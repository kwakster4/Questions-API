const mongoose = require('mongoose');
// what if:
// all Questions by ProductID
// all Answers by QuestionID
// can have collection of questions and collection for answers
/// When I return the response, serve those answers together
// find by product_id;
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
  "answer_id": {
    type: Number,
    unique: true
  },
  "body": String,
  "date": String,
  "answerer_name": String,
  "helpfulness": Number,
  "reported": Boolean
  // photos is an array of objects with id and urls.
  // "photos": [photoSchema]
});
const answerPhotoSchema = new mongoose.Schema({
  "question_id": Number,
  "answer_id": {
    type: Number,
    unique: true
  },
  "body": String,
  "date": String,
  "answerer_name": String,
  "helpfulness": Number,
  "reported": Boolean,
  // photos is an array of objects with id and urls.
  "photos": [photoSchema]
});
const questionSchema = new mongoose.Schema({
  "product_id": Number,
  "question_id": {
    type: Number,
    unique: true
  },
  "question_body": String,
  "question_date": String,
  "asker_name": String,
  "question_helpfulness": Number,
  "reported": Boolean
  // should I have answerSchema inside questionSchema?
  // "answers": [answerSchema]
});
const qaSchema = new mongoose.Schema({
  "product_id": Number,
  "question_id": {
    type: Number,
    unique: true
  },
  "question_body": String,
  "question_date": String,
  "asker_name": String,
  "question_helpfulness": Number,
  "reported": Boolean,
  // should I have answerSchema inside questionSchema?
  "answers": [answerSchema]
});
module.exports = {photoSchema, answerSchema, answerPhotoSchema, questionSchema, qaSchema};