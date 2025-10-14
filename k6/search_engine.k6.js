/* global __ENV */
import http from 'k6/http';
import { check, sleep } from 'k6';

const SHORT = __ENV.K6_SHORT === '1' || __ENV.K6_SHORT === 'true';

export const options = SHORT
  ? {
      stages: [
        { duration: '5s', target: 2 },
        { duration: '5s', target: 0 },
      ],
      thresholds: {
        http_req_duration: ['p(95)<1000'],
        'http_req_failed{type:search}': ['rate<0.1'],
      },
    }
  : {
      stages: [
        { duration: '10s', target: 5 },
        { duration: '20s', target: 10 },
        { duration: '10s', target: 0 },
      ],
      thresholds: {
        http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
        'http_req_failed{type:search}': ['rate<0.01'],
      },
    };

const BASE = 'https://duckduckgo.com/html/';

export default function () {
  const q = encodeURIComponent('playwright typescript');
  const url = `${BASE}?q=${q}`;
  const res = http.get(url, { tags: { type: 'search' } });

  check(res, {
    'status is 200': (r) => r.status === 200,
    'body contains results': (r) => r.body && r.body.indexOf('result__a') !== -1,
  });

  sleep(1);
}
