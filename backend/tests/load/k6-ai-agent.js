import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: "20s", target: 20 },  // Ramp-up to 20 users
    { duration: "1m", target: 50 },   // Sustain 50 concurrent AI analyses
    { duration: "20s", target: 0 },   // Ramp-down
  ],
  thresholds: {
    http_req_duration: ["p(95)<800"], // AI Bayesian reasoning P95 under 800ms
    http_req_failed: ["rate<0.01"],   // Error rate below 1%
  },
};

const BASE_URL = __ENV.BASE_URL || "http://localhost:5000/api";

export default function () {
  const payload = JSON.stringify({
    userId: "k6_load_tester",
  });

  const params = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const res = http.post(`${BASE_URL}/agent/analyze/dev_iphone_15_pro`, payload, params);

  check(res, {
    "AI status is 200": (r) => r.status === 200 || r.status === 201,
  });

  sleep(3);
}
