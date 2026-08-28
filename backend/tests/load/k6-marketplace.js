import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: "30s", target: 100 },  // Ramp-up to 100 users
    { duration: "1m", target: 500 },   // Sustain 500 concurrent users
    { duration: "30s", target: 0 },    // Ramp-down
  ],
  thresholds: {
    http_req_duration: ["p(95)<500"], // 95% of requests must complete below 500ms
    http_req_failed: ["rate<0.01"],   // Error rate must be less than 1%
  },
};

const BASE_URL = __ENV.BASE_URL || "http://localhost:5000/api";

export default function () {
  // 1. Browse marketplace catalog
  const listingsRes = http.get(`${BASE_URL}/listings`);
  check(listingsRes, {
    "status is 200": (r) => r.status === 200,
    "listings returned": (r) => JSON.parse(r.body).data !== undefined,
  });

  sleep(1);

  // 2. Search filtered catalog
  const searchRes = http.get(`${BASE_URL}/listings?brand=Apple&condition=Pristine`);
  check(searchRes, {
    "search status is 200": (r) => r.status === 200,
  });

  sleep(1);

  // 3. View Digital Life Passport
  const passportRes = http.get(`${BASE_URL}/passport/dev_iphone_15_pro`);
  check(passportRes, {
    "passport status is 200 or 404": (r) => r.status === 200 || r.status === 404,
  });

  sleep(2);
}
