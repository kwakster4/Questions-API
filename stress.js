import http from 'k6/http';
import { sleep } from 'k6';
import { group } from 'k6';
export let options = {
  vus: 1,
  duration: '30s',
};
export default function () {
  // group('get questions test (Pid: 1000005)', function() {
  //   http.get('http://localhost:3001/questions/?product_id=1000005&page=0&count=100');
  //   sleep(1);
  // });

  // group('get answers test (Qid: 3521600)', function() {
  //   http.get('http://localhost:3001/questions/3521600/answers');
  //   sleep(1);
  // });

  // group('report questions test (Qid: 3521600)', function() {
  //   http.put('http://localhost:3001/questions/3521600/report');
  //   sleep(1);
  // });

  // group('report answers test (Aid: 12000000)', function() {
  //   http.put('http://localhost:3001/answers/12000000/report');
  //   sleep(1);
  // });

  // group('helpful questions test (Qid: 3521600)', function() {
  //   // duration 10, only testing VUs 1000
  //   http.put('http://localhost:3001/questions/3521600/helpful');
  //   sleep(0.5);
  // });

  // group('helpful answers test (Aid: 12000000)', function() {
  //   // duration 10, only testing VUs 1000
  //   http.put('http://localhost:3001/answers/12000000/helpful');
  //   sleep(0.5);
  // });

  // was 1000005. moving onto 1000006 to make space
  group('post questions test (Pid: 1000006)', function() {
    // duration 5, only testing 1000 VUs, no sleep
    var url = 'http://localhost:3001/questions';
    var payload = JSON.stringify({
      body: 'questions stress test',
      name: 'random VU',
      email: 'vu@k6.com',
      product_id: 1000006,
    });
    var params = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    http.post(url, payload, params);
    sleep(1);
  });

  // group('post answers test (Qid: 3521600)', function() {
  //   // duration 5, only testing 1000 VUs, no sleep
  //   var url = 'http://localhost:3001/questions/3521600/answers';
  //   var payload = JSON.stringify({
  //     body: 'answers stress test',
  //     name: 'random VU',
  //     email: 'vu@k6.com',
  //     photos: ['https://source.unsplash.com/random/800x600'],
  //   });
  //   var params = {
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //   };
    // http.post(url, payload, params);
  // });
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