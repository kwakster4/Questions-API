const fs = require('fs');
const fsPromise = require('fs/promises');
const stream = require('stream');
const readline = require('readline');
const mongoose = require('mongoose');
const schemas = require('./schemas');
// mongoose.connect('mongodb://localhost/test', {useNewUrlParser: true, useUnifiedTopology: true});
let parsedVal = function(val, key) {
  let numBank = ['id', 'answer_id', 'question_id', 'product_id', 'reported', 'helpful']
  if (key === 'reported') { return Boolean(parseInt(val)); }
  if (numBank.includes(key)) {
    return parseInt(val);
  } else {
    return  val.slice(1, val.length - 1);
  }
};
let photos = {};
let answers = {};
const Photo = mongoose.model('Photo', schemas.photoSchema);
fsPromise.readFile('./csv/answers_photos.csv', 'utf8')
  .then((data) => {
    let lines = data.split('\n');
    let keys = lines[0].split(', ');
    // lines.length
    for (let i = 1; i < lines.length; i++) {
      let line = lines[i];
      let values = line.split(',');
      // if photos.answer_id exists then
      let photo = {id: parsedVal(values[0], 'id'), answer_id: parsedVal(values[1], 'answer_id'), url: parsedVal(values[2], 'url')};
      if (!photos[values[1]]) {
        photos[values[1]] = [];
      }
      photos[values[1]].push(photo);
    }
    console.log(photos['5']);
  })
  .catch((err) => {
    console.log(err);
  });

let answerInput = fs.createReadStream('./csv/answers.csv', {encoding: 'utf8'})
// process.stdout
let answerInterface = readline.createInterface({input: answerInput, crlfDelay: Infinity});
let answerKeys;
answerInterface.on('line', (line) => {
  // [answer_id, question_id, body, date_written, answerer_name, reported, helpful]
  let values = line.split(',');
  if (!parseInt(values[0])) {
    values = values.map((value)=>{
      value = value.trim();
      if (value === 'id') {
        value = 'answer_id';
      }
      return value;
    });
    answerKeys = values;
  } else {
    let answer = {};
    for (let i = 0; i < answerKeys.length; i++) {
      let value = parsedVal(values[i], answerKeys[i]);
      answer[answerKeys[i]] = value;
    }
    if (!answers[values[1]]) {
      answers[values[1]] = [];
    }
    answers[values[1]].push(answer);
    console.log(answer);
  }
  answerInput.close();
});