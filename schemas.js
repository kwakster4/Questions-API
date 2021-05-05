const mongoose = require('mongoose');
const photoSchema = ({
    "id": {
      type: Number,
      unique: true
    },
    "answer_id": Number,
    "url": String
});

const answerSchema = new mongoose.Schema({
  "question_id": Number,
  "id": {
    type: Number,
    unique: true
  },
  "body": String,
  "date_written": String,
  "answerer_name": String,
  "answerer_email": String,
  "helpful": Number,
  "reported": Boolean,
  // photos is an array of objects with id and urls.
  "photos": [photoSchema]
});

const questionSchema = new mongoose.Schema({
  "product_id": Number,
  "id": {
    type: Number,
    unique: true
  },
  "body": String,
  "date_written": String,
  "asker_name": String,
  "asker_email": String,
  "helpful": Number,
  "reported": Boolean,
  // should I have answerSchema inside questionSchema?
  "answers": [answerSchema]
});
module.exports = {photoSchema, answerSchema, questionSchema};

// const preAnswerSchema = new mongoose.Schema({
//   "question_id": Number,
//   "answer_id": {
//     type: Number,
//     unique: true
//   },
//   "body": String,
//   "date": String,
//   "answerer_name": String,
//   "helpfulness": Number,
//   "reported": Boolean
//   // photos is an array of objects with id and urls.
//   // "photos": [photoSchema]
// });
// const preQuestionSchema = new mongoose.Schema({
//   "product_id": Number,
//   "question_id": {
//     type: Number,
//     unique: true
//   },
//   "question_body": String,
//   "question_date": String,
//   "asker_name": String,
//   "question_helpfulness": Number,
//   "reported": Boolean
//   // should I have answerSchema inside questionSchema?
//   // "answers": [answerSchema]
// });