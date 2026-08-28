terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  backend "s3" {
    bucket         = "retech-terraform-state-prod"
    key            = "prod/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "retech-tf-locks"
  }
}

provider "aws" {
  region = var.aws_region
  default_tags {
    tags = {
      Project     = "ReTech"
      Environment = "Production"
      ManagedBy   = "Terraform"
    }
  }
}

variable "aws_region" {
  default = "us-east-1"
}

# 1. VPC & Networking
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.0.0"

  name = "retech-vpc-prod"
  cidr = "10.0.0.0/16"

  azs             = ["us-east-1a", "us-east-1b", "us-east-1c"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]

  enable_nat_gateway   = true
  single_nat_gateway   = false
  enable_dns_hostnames = true
}

# 2. RDS PostgreSQL 15 Multi-AZ
resource "aws_db_subnet_group" "rds" {
  name       = "retech-rds-subnet-group"
  subnet_ids = module.vpc.private_subnets
}

resource "aws_db_instance" "postgres" {
  identifier           = "retech-postgres-prod"
  engine               = "postgres"
  engine_version       = "15.4"
  instance_class       = "db.r6g.xlarge"
  allocated_storage    = 100
  max_allocated_storage = 1000
  storage_type         = "gp3"
  multi_az             = true
  db_name              = "retech_db"
  username             = "retech_admin"
  password             = var.db_password
  db_subnet_group_name = aws_db_subnet_group.rds.name
  skip_final_snapshot  = false
  backup_retention_period = 30
}

# 3. ElastiCache Redis Cluster
resource "aws_elasticache_subnet_group" "redis" {
  name       = "retech-redis-subnet-group"
  subnet_ids = module.vpc.private_subnets
}

resource "aws_elasticache_replication_group" "redis" {
  replication_group_id          = "retech-redis-prod"
  replication_group_description = "ReTech High-Availability Redis Cache & Sessions"
  engine                        = "redis"
  engine_version                = "7.0"
  node_type                     = "cache.m6g.large"
  num_cache_clusters            = 3
  automatic_failover_enabled    = true
  multi_az_enabled              = true
  subnet_group_name             = aws_elasticache_subnet_group.redis.name
  at_rest_encryption_enabled    = true
  transit_encryption_enabled   = true
}

# 4. Amazon S3 & CloudFront CDN
resource "aws_s3_bucket" "assets" {
  bucket = "retech-public-assets-prod"
}

resource "aws_cloudfront_distribution" "cdn" {
  origin {
    domain_name = aws_s3_bucket.assets.bucket_regional_domain_name
    origin_id   = "S3-retech-assets"
  }

  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-retech-assets"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 86400
    max_ttl                = 31536000
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
}

# 5. ECS Fargate Cluster & Application Load Balancer
resource "aws_ecs_cluster" "cluster" {
  name = "retech-prod-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

resource "aws_lb" "alb" {
  name               = "retech-alb-prod"
  internal           = false
  load_balancer_type = "application"
  subnets            = module.vpc.public_subnets
}

variable "db_password" {
  type      = string
  sensitive = true
}
