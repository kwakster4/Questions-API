const mongoose = require('mongoose');
// use indexes on foreign keys to speed up lookup
const photoSchema = new mongoose.Schema({
    "id": {
      type: Number
    },
    "answer_id": {
      type: Number,
      index: true
    },
    "url": String
});
photoSchema.index({id: 1});

const answerSchema = new mongoose.Schema({
  "question_id": {
    type: Number,
    index: true
  },
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
answerSchema.index({id: 1});

const questionSchema = new mongoose.Schema({
  "product_id": {
    type: Number,
    index: true
  },
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
questionSchema.index({id: 1});

const maxIdSchema = new mongoose.Schema({
  "maxId": {
    type: Number
  },
  "for": {
    type: String,
    index: true
  }
});

module.exports = {photoSchema, answerSchema, questionSchema, maxIdSchema};
