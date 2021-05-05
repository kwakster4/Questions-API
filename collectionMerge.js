const mongoose = require('mongoose');
const schemas = require('./schemas');

mongoose.connect('mongodb://localhost/sdc_q_a', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});

const Photo = mongoose.model('Photo', schemas.photoSchema, 'answer_photos');
// Photo.findOne().then((res)=>{console.log(res)});
const Answer = mongoose.model('Answer', schemas.answerSchema, 'answers');
// Answer.findOne().then((res)=>{console.log('answer: ', res)});
const Question = mongoose.model('Question', schemas.questionSchema, 'questions');
// Question.findOne().then((res)=>{console.log('question: ',res)});


// for every answer in collection, Answer.find() does not work.
// maybe aggregate to every unique answer_id in answer collection? aggregate
// javascript memory heap exceeded with $project only.
Photo.aggregate([{$limit: 10},{$group: {_id: '$answer_id', photos: {$push: {id: '$id', url: '$url'}}}}]).allowDiskUse(true)
  .then((answerIds)=>{
    for (let answerId of answerIds) {
      console.log(answerId);
    }
  })
  .catch((err)=>{console.log(err)});
  // find and aggregate photos where photo.answer_id = preanswer.id
  // set those photos in an array
  // update document with photoArray as photos
  // then
  // for every question in collection
    // find and aggregate answers where answer.question_id = question.id
    // set those answers in an array
    // update document with answerArray as answers



/*
 photo = {
  "_id" : ObjectId("6092d18631817e4926e07699"),
  "id" : 3,
  "answer_id" : 5,
  "url" : "string"
}
 preanswer = {
  "_id" : ObjectId("6092d292b4b5a799812a693b"),
  "id" : 1,
  "question_id" : 36,
  "body" : "string",
  "date_written" : "2018-01-17",
  "answerer_name" : "sillyguy",
  "answerer_email" : "first.last@gmail.com",
  "reported" : 0,
  "helpful" : 1
}
 prequestion = {
  "_id" : ObjectId("6092d37e211c59d43aca3684"),
  "id" : 1,
  "product_id" : 1,
  "body" : "What fabric is the top made of?",
  "date_written" : "2018-01-04",
  "asker_name" : "yankeelover",
  "asker_email" : "first.last@gmail.com",
  "reported" : 0,
  "helpful" : 1
}
*/