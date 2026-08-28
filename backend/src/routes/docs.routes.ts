import { Router, Request, Response } from "express";

const router = Router();

const API_DOCS_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>ReTech API Explorer & Interactive Docs</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --cream: #F8F3EA;
      --cream-dark: #EDE4D3;
      --brown: #8A6652;
      --brown-dark: #3F2314;
      --burgundy: #641F2A;
      --burgundy-dark: #4A121C;
      --emerald: #059669;
      --amber: #D97706;
      --blue: #2563EB;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Plus Jakarta Sans', sans-serif;
      background: var(--cream);
      color: var(--brown-dark);
      line-height: 1.5;
      padding: 32px 20px;
    }
    .container {
      max-width: 1100px;
      margin: 0 auto;
    }
    header {
      background: white;
      border: 1px solid var(--cream-dark);
      border-radius: 20px;
      padding: 28px 32px;
      margin-bottom: 24px;
      box-shadow: 0 4px 20px rgba(100, 31, 42, 0.05);
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
    }
    .badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 700;
      font-family: 'JetBrains Mono', monospace;
      text-transform: uppercase;
    }
    .badge-burgundy { background: #641F2A15; color: var(--burgundy); }
    .badge-emerald { background: #05966915; color: var(--emerald); }
    h1 { font-size: 26px; font-weight: 800; color: var(--burgundy); margin-bottom: 4px; }
    p.subtitle { font-size: 13px; color: #715545; }

    .category-card {
      background: white;
      border: 1px solid var(--cream-dark);
      border-radius: 18px;
      margin-bottom: 20px;
      overflow: hidden;
      box-shadow: 0 2px 10px rgba(0,0,0,0.02);
    }
    .category-header {
      padding: 16px 24px;
      background: #FAF6F0;
      border-bottom: 1px solid var(--cream-dark);
      font-size: 14px;
      font-weight: 800;
      color: var(--brown-dark);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .endpoint-row {
      padding: 16px 24px;
      border-bottom: 1px solid #F3EDE3;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 12px;
      transition: background 0.15s;
    }
    .endpoint-row:last-child { border-bottom: none; }
    .endpoint-row:hover { background: #FCFAF6; }
    .endpoint-left {
      display: flex;
      align-items: center;
      gap: 12px;
      flex: 1;
      min-width: 280px;
    }
    .method {
      padding: 4px 10px;
      border-radius: 8px;
      font-family: 'JetBrains Mono', monospace;
      font-weight: 700;
      font-size: 11px;
      min-width: 65px;
      text-align: center;
    }
    .method-get { background: #E0F2FE; color: #0284C7; }
    .method-post { background: #DCFCE7; color: #16A34A; }
    .method-patch { background: #FEF3C7; color: #D97706; }
    .method-delete { background: #FEE2E2; color: #DC2626; }
    .path {
      font-family: 'JetBrains Mono', monospace;
      font-size: 13px;
      font-weight: 700;
      color: var(--brown-dark);
    }
    .desc { font-size: 12px; color: #786455; }
    .btn-test {
      padding: 6px 14px;
      border-radius: 10px;
      background: var(--burgundy);
      color: white;
      text-decoration: none;
      font-size: 11px;
      font-weight: 700;
      cursor: pointer;
      border: none;
      transition: background 0.2s;
    }
    .btn-test:hover { background: var(--burgundy-dark); }
    .footer {
      text-align: center;
      margin-top: 32px;
      font-size: 12px;
      color: #988273;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div>
        <h1>ReTech REST & WebSocket API</h1>
        <p class="subtitle">AI-Powered Circular Electronics Marketplace Core Engine (v1.0.0)</p>
      </div>
      <div>
        <span class="badge badge-emerald">● Server Online (Port 5000)</span>
      </div>
    </header>

    <!-- 1. System Health -->
    <div class="category-card">
      <div class="category-header">
        <span>1. System Health & Gateway</span>
        <span class="badge badge-burgundy">CORE</span>
      </div>
      <div class="endpoint-row">
        <div class="endpoint-left">
          <span class="method method-get">GET</span>
          <span class="path">/health</span>
          <span class="desc">— Platform cluster health status</span>
        </div>
        <a href="/health" target="_blank" class="btn-test">Execute GET</a>
      </div>
      <div class="endpoint-row">
        <div class="endpoint-left">
          <span class="method method-get">GET</span>
          <span class="path">/docs</span>
          <span class="desc">— Interactive documentation portal</span>
        </div>
        <a href="/docs" class="btn-test">Active</a>
      </div>
    </div>

    <!-- 2. Marketplace & Hardware Listings -->
    <div class="category-card">
      <div class="category-header">
        <span>2. Marketplace Inventory</span>
        <span class="badge badge-burgundy">CATALOG</span>
      </div>
      <div class="endpoint-row">
        <div class="endpoint-left">
          <span class="method method-get">GET</span>
          <span class="path">/api/listings</span>
          <span class="desc">— Fetch all active devices with Second-Life Scores</span>
        </div>
        <a href="/api/listings" target="_blank" class="btn-test">Execute GET</a>
      </div>
      <div class="endpoint-row">
        <div class="endpoint-left">
          <span class="method method-post">POST</span>
          <span class="path">/api/listings</span>
          <span class="desc">— Create new verified hardware listing</span>
        </div>
        <button class="btn-test" onclick="alert('Use POST with JSON body: { brand, model, price, condition }')">Inspect Schema</button>
      </div>
    </div>

    <!-- 3. Digital Life Passport -->
    <div class="category-card">
      <div class="category-header">
        <span>3. Digital Life Passport (Cryptographic Ledger)</span>
        <span class="badge badge-burgundy">PASSPORT</span>
      </div>
      <div class="endpoint-row">
        <div class="endpoint-left">
          <span class="method method-get">GET</span>
          <span class="path">/api/passport/:deviceId</span>
          <span class="desc">— Fetch immutable maintenance & diagnostic history</span>
        </div>
        <a href="/api/passport/dev_sample" target="_blank" class="btn-test">Execute GET</a>
      </div>
      <div class="endpoint-row">
        <div class="endpoint-left">
          <span class="method method-get">GET</span>
          <span class="path">/api/passport/qr/:deviceId</span>
          <span class="desc">— Generate high-resolution QR verification code</span>
        </div>
        <a href="/api/passport/qr/dev_sample" target="_blank" class="btn-test">View QR</a>
      </div>
    </div>

    <!-- 4. Agentic AI Decision Agent -->
    <div class="category-card">
      <div class="category-header">
        <span>4. Autonomous AI Device Decision Agent</span>
        <span class="badge badge-burgundy">AGENTIC AI</span>
      </div>
      <div class="endpoint-row">
        <div class="endpoint-left">
          <span class="method method-post">POST</span>
          <span class="path">/api/agent/analyze/:deviceId</span>
          <span class="desc">— Run 6-tool Bayesian reasoning (BUY/SELL/HOLD)</span>
        </div>
        <button class="btn-test" onclick="alert('Invokes full multi-tool AI decision pipeline with WebSocket stream')">Live Stream</button>
      </div>
    </div>

    <!-- 5. Commerce & Escrow Checkout -->
    <div class="category-card">
      <div class="category-header">
        <span>5. Commerce, Escrow & Orders</span>
        <span class="badge badge-burgundy">STRIPE</span>
      </div>
      <div class="endpoint-row">
        <div class="endpoint-left">
          <span class="method method-get">GET</span>
          <span class="path">/api/cart</span>
          <span class="desc">— Retrieve active Redis cart session</span>
        </div>
        <a href="/api/cart" target="_blank" class="btn-test">Execute GET</a>
      </div>
      <div class="endpoint-row">
        <div class="endpoint-left">
          <span class="method method-post">POST</span>
          <span class="path">/api/checkout/intent</span>
          <span class="desc">— Create Stripe PaymentIntent with 5% escrow split</span>
        </div>
        <button class="btn-test" onclick="alert('Creates Stripe PaymentIntent for escrow transaction')">Stripe Gateway</button>
      </div>
    </div>

    <!-- 6. Sustainability & Impact -->
    <div class="category-card">
      <div class="category-header">
        <span>6. Sustainability & Circular Metrics</span>
        <span class="badge badge-burgundy">IMPACT</span>
      </div>
      <div class="endpoint-row">
        <div class="endpoint-left">
          <span class="method method-get">GET</span>
          <span class="path">/api/sustainability/platform</span>
          <span class="desc">— Aggregate CO2, e-waste, trees and water metrics</span>
        </div>
        <a href="/api/sustainability/platform" target="_blank" class="btn-test">Execute GET</a>
      </div>
      <div class="endpoint-row">
        <div class="endpoint-left">
          <span class="method method-get">GET</span>
          <span class="path">/api/sustainability/leaderboard</span>
          <span class="desc">— Circular champion seller and buyer leaderboard</span>
        </div>
        <a href="/api/sustainability/leaderboard" target="_blank" class="btn-test">Execute GET</a>
      </div>
    </div>

    <!-- 7. Admin Dashboard & Moderation -->
    <div class="category-card">
      <div class="category-header">
        <span>7. Administration & Moderation</span>
        <span class="badge badge-burgundy">ADMIN</span>
      </div>
      <div class="endpoint-row">
        <div class="endpoint-left">
          <span class="method method-get">GET</span>
          <span class="path">/api/admin/metrics</span>
          <span class="desc">— Master console 6 KPIs & 14-day chart telemetry</span>
        </div>
        <a href="/api/admin/metrics" target="_blank" class="btn-test">Execute GET</a>
      </div>
      <div class="endpoint-row">
        <div class="endpoint-left">
          <span class="method method-get">GET</span>
          <span class="path">/api/admin/system</span>
          <span class="desc">— Live cluster telemetry (PostgreSQL, Redis, n8n, API)</span>
        </div>
        <a href="/api/admin/system" target="_blank" class="btn-test">Execute GET</a>
      </div>
    </div>

    <div class="footer">
      <p>ReTech Circular Electronics Marketplace • Powered by Node.js, Express, Socket.io, Prisma & Next.js</p>
    </div>
  </div>
</body>
</html>`;

router.get(["/docs", "/api/docs"], (req: Request, res: Response) => {
  res.setHeader("Content-Type", "text/html");
  return res.send(API_DOCS_HTML);
});

export default router;
