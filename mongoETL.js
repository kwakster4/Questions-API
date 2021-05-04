const fs = require('fs');
const fsPromise = require('fs/promises');
// photos will look like {answer_id: [{id:1, url:'asdf'},{}], answer_id2:[]...}
let photos = {};
let answers = {};
// fsPromise.readFile('./csv/answers_photos.csv', 'utf8')
//   .then((data) => {
//     let lines = data.split('\n');
//     let keys = lines[0].split(', ');
//     // lines.length
//     for (let i = 1; i < 11; i++) {
//       let line = lines[i];
//       let values = line.split(',');
//       // if photos.answer_id exists then
//       let photo = {id: values[0], url: values[2]};
//       if (!photos[values[1]]) {
//         photos[values[1]] = [];
//       }
//       photos[values[1]].push(photo);
//     }
//   })
//   .catch((err) => {
//     console.log(err);
//   });

fsPromise.readFile('./csv/answers.csv', 'utf8')
  .then((data) => {
    let lines = data.split('\n');
    let keys = lines[0].split(', ');
    // console.log(keys);
  })
  .catch((err) => {
    console.log(err);
  });