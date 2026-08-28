# ReTech Production Operational Runbook

**Version**: 1.0.0-PROD  
**Author**: ReTech Engineering & Circular Infrastructure  
**Target Environment**: AWS us-east-1 (ECS Fargate + RDS Multi-AZ + ElastiCache)

---

## 1. System Topology & Architecture
- **Web Frontend**: Next.js 14 Standalone container on AWS ECS Fargate, distributed via CloudFront CDN.
- **API Core**: Express.js + Socket.io gateway on AWS ECS Fargate behind Application Load Balancer (ALB).
- **Database**: PostgreSQL 15 Multi-AZ RDS instance with read-replica and PgBouncer connection pooling.
- **Caching & Carts**: AWS ElastiCache Redis 7.0 Cluster (3 nodes, multi-AZ failover, at-rest encryption).
- **Object Storage**: S3 + CloudFront for device photos, optical proof documents, and PDF Life Passports.

---

## 2. Production Checklist Verification
- [x] HTTPS TLS 1.3 enabled via ACM and CloudFront.
- [x] Rate Limiting enabled at 100 requests/minute/IP on public endpoints.
- [x] JWT access tokens (15m expiration) + HTTP-only secure refresh tokens (7d).
- [x] Stripe Connect webhook signature validation with idempotency keys.
- [x] Daily automated RDS snapshots with 30-day point-in-time recovery (PITR).
- [x] Sentry Release Tracking and Datadog APM instrumentation.
- [x] Health endpoints configured at `/health` and `/api/health`.

---

## 3. Zero-Downtime Deployment Procedure

```bash
# 1. Triggered via GitHub Actions on merge to main
git checkout main
git pull origin main

# 2. Automated pipeline runs:
#    a. ESLint & TypeScript validation
#    b. Unit & Integration test suites
#    c. E2E critical user journey tests
#    d. Multi-stage Docker builds
#    e. Pushes container images to AWS ECR
#    f. Executes rolling update on ECS Fargate (minimumHealthyPercent: 100%)

# 3. Verify health post-deployment
curl -f https://api.retech.eco/health
curl -f https://retech.eco/
```

---

## 4. Rollback Protocol
In the event of an uncaught regression or elevated 5xx error rate:

```bash
# Rollback ECS Fargate Task Definition to previous revision:
aws ecs update-service \
  --cluster retech-prod-cluster \
  --service retech-backend-service \
  --task-definition retech-backend:PREVIOUS_REVISION_NUMBER

# Invalidate CloudFront edge cache:
aws cloudfront create-invalidation \
  --distribution-id E1A2B3C4D5E6F7 \
  --paths "/*"
```

---

## 5. Database Backup & Disaster Recovery

### Automated Snapshots
- Frequency: Daily at 02:00 UTC.
- Retention: 30 days.

### Manual On-Demand Backup
```bash
aws rds create-db-snapshot \
  --db-instance-identifier retech-postgres-prod \
  --db-snapshot-identifier retech-manual-backup-$(date +%Y%m%d%H%M)
```

### Point-in-Time Restore
```bash
aws rds restore-db-instance-to-point-in-time \
  --source-db-instance-identifier retech-postgres-prod \
  --target-db-instance retech-postgres-restored \
  --restore-time "2026-08-24T12:00:00Z"
```

---

## 6. Incident Response & PagerDuty Alert Escalation

| Alert Severity | Response SLA | Action Required |
| :--- | :--- | :--- |
| **P1 - Critical** (System Outage / 5xx > 1%) | **< 15 minutes** | On-call engineer paged. Check ALB logs, inspect ECS container memory, rollback if needed. |
| **P2 - High** (Elevated Latency P95 > 800ms) | **< 30 minutes** | Scale ECS task count, inspect Redis cache hit ratio, check RDS slow query log. |
| **P3 - Medium** (Single failed webhook) | **< 2 hours** | Inspect dead-letter queue (DLQ) in BullMQ/Redis and replay failed event. |

---

## 7. Secrets & Key Rotation Schedule
- **Stripe Webhook Secret**: Rotate every 90 days in AWS Secrets Manager.
- **JWT Signing Keys**: Zero-downtime dual-key rotation via environment variables.
- **Database Passwords**: Managed via AWS Secrets Manager automatic rotation.
