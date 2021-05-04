const fs = require('fs');
const fsPromise = require('fs/promises');
const stream = require('stream');
const readline = require('readline');
let parsedVal = function(val, key) {
  let numBank = ['id', 'question_id', 'reported', 'helpful']
  if (numBank.includes(key)) {
    return parseInt(val);
  } else {
    // return val.replace(/['"]+/g, ''); // may want to keep "" in the middle of the answer bodies
    return val.slice(1, val.length - 1);
  }
};
// photos will look like {answer_id: [{id:1, url:'asdf'},{}], answer_id2:[]...}
let photos = {};
let answers = {};
// fsPromise.readFile('./csv/answers_photos.csv', 'utf8')
//   .then((data) => {
//     let lines = data.split('\n');
//     let keys = lines[0].split(', ');
//     // lines.length
//     for (let i = 1; i < lines.length; i++) {
//       let line = lines[i];
//       let values = line.split(',');
//       // if photos.answer_id exists then
//       let photo = {id: parseInt(values[0]), url: values[2].replace(/['"]+/g, '')};
//       if (!photos[values[1]]) {
//         photos[values[1]] = [];
//       }
//       photos[values[1]].push(photo);
//     }
//     console.log(photos['5']);
//   })
//   .catch((err) => {
//     console.log(err);
//   });



// total data from answers to large of a string for node.
// answers looks like {question_id: [{id, body, date_written, answerer_name, answerer_email, reported, helpful}]}
// createRead Stream only works up to a certain point, ends chunk halfway through a line
// let answerStream = fs.createReadStream('./csv/answers.csv', {encoding: 'utf8'});
// answerStream.on('data', (chunk) => {
//   answerStream.pause();
//   console.log(chunk);
//   let lines = chunk.split('\n');
// })

let input = fs.createReadStream('./csv/answers.csv', {encoding: 'utf8'})
let output = process.stdout;
let answerInterface = readline.createInterface({input, output});
let answerKeys;
answerInterface.on('line', (line) => {
  // [id, question_id, body, date_written, answerer_name, answerer_email, reported, helpful]
  let values = line.split(',');
  if (!parseInt(values[0])) {
    values = values.map((value)=>(value.trim()));
    answerKeys = values;
  } else {
    let answer = {};
    values = values.map((value)=>(parsedVal(value)));
    for (let i = 0; i < answerKeys.length; i++) {
      // let value = parsedVal(values[i], answerKeys[i]);
      answer[answerKeys[i]] = values[i];
    }
    // if (!answers[values[1]]) {
    //   photos[values[1]] = [];
    // }
    // photos[values[1]].push(photo);
  }
  console.log(answer);
  input.pause();
});

