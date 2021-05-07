const mongoose = require('mongoose');
const schemas = require('./../schemas');
// uses aggregate merge
// index behavior recommended to be turned off for production, as index creation can have performance impact. turn off with autoIndex false.
// e.g. mongoose.connect('mongodb://user:pass@localhost:port/database', { autoIndex: false });
mongoose.connect('mongodb://localhost/sdc_q_a', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: true});
const Question = mongoose.model('Question', schemas.questionSchema,
'questions');
const Answer = mongoose.model('Answer', schemas.answerSchema, 'answers');

// getQs
const getQs = function(product_id, page, count) {
  // get all non-reported Questions for that product
  count = count || 100;
  // mongoose method of Question.find doesn't return anything when setting reported to false or 0;
  // return Question.find({'product_id': product_id, reported:false}, {limit: count});
  // when using aggregate, reported returns as 0 instead of boolean.
  return Question.aggregate([{$match: {$and: [{reported: 0}, {'product_id': product_id}]}}, {$limit: count}])
    .then((questions)=>{
      questions = questions.map((question)=> {
        let answers = question.answers.map((answer)=>{
          let photos = answer.photos.map((photo)=>{
            return {'id': photo.id, 'url': photo.url}
          });
          return {
            answer_id: answer.id,
            body: answer.body,
            date: answer.date_written,
            answerer_name: answer.answerer_name,
            helpfulness: answer.helpful,
            photos: photos
          }
        });
        return {
          question_id: question.id,
          question_body: question.body,
          question_date: question.date_written,
          asker_name: question.asker_name,
          question_helpfulness: question.helpful,
          reported: false,
          answers: answers
        }
      })
      return questions;
    });
};
// setQ
const setQ = function(newQ) {
  // newQ = {body, name, email, product_id}
  let newQuestion = {...newQ};
  // question needs: id, date_written, helpful, reported, and answers
  // need to generate a unique id, make sure its a number
  let id = 0;
  Question.aggregate([{$count: "maxId"}]).then((countObj)=>{
    id = countObj.maxId + 1;
    newQuestion.id = id;
  });
};
// getAs
const getAs = function(question_id, page, count) {
  // get all non-reported Answers for that product
  return Question.aggregate([{$match: {question_id: question_id}}, {$unwind: $answers}, {$match:{reported: false}}, {$limit: count}]);
};
// setA
const setA = function(question_id, newA) {
  // newA = {body, name, email, photos}
  let newAnswer = {...newA};
  // question needs: id, date_written, helpful, reported, and photos
  // need to generate a unique id, make sure its a number
};
// helpQ
const helpQ = function(question_id) {
  // access and change helpfulness of question.
  // Question.update({question_id: question_id}, {$inc:{'helpfulness': 1}});
};
// reportQ
const reportQ = function(question_id) {
  //
  // Question.update({question_id: question_id}, {$set:{'reported': true}});
};
// helpA
const helpA = function(answer_id) {
  Answer.findOne({id: answer_id}).select('question_id')
    .then((id)=>{
      return id.question_id;
    })
    // .then((product_id)=>{
      // Question.aggregate([{$match: {question_id: question_id}}, {$unwind: $answers}, {$match:{id: answer_id}}, {$inc:{'helpfulness': 1}}]);
      // // OR
      // Question.update({product_id: product_id, answers.id: answer_id}, {$inc:{'answers.$.helpfulness': 1}});
    // })

  // may also get away with Question.update({answer.id: answer_id}, {$inc:{'answers.$.helpfulness':1}}), bc listed as index on mongo database

  // use that question_id to target correct answer, and thereby correct answer, in the Question collection.
};
// reportA
const reportA = function(answer_id) {
  //
  Answer.findOne({id: answer_id}).select('question_id')
    .then((id)=>{
      return id.question_id;
    })
    // .then((product_id)=>{
      // Question.aggregate([{$match: {question_id: question_id}}, {$unwind: $answers}, {$match:{id: answer_id}}, {$set:{'reported': true}}]);
      // // OR
      // Question.update({product_id: product_id, answers.answer_id: answer_id}, {$set:{'answers.$.reported': true}});
    // })
};

module.exports = {getQs, setQ, getAs, setA, helpQ, reportQ, helpA, reportA};