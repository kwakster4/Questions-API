import http from 'k6/http';
import { sleep } from 'k6';
import { group } from 'k6';
export let options = {
  vus: 1000,
  duration: '30s',
};
export default function () {
  // group('get questions test (Pid: 1000005', function() {
  //   http.get('http://localhost:3001/questions/?product_id=1000005&page=0&count=100');
  //   sleep(1);
  // });
  group('get answers test (Qid: 3521600', function() {
    http.get('http://localhost:3001/questions/3521600/answers');
    sleep(1);
  });
}
// export let options = {
//   stages: [
//     { duration: '30s', target: 20 },
//     { duration: '1m30s', target: 10 },
//     { duration: '20s', target: 0 },
//   ],
// };
// export default function () {
//   http.get('http://test.k6.io');
//   sleep(1);
// }