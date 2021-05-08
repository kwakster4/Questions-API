const mongoose = require('mongoose');
const schemas = require('./../schemas');
const moment = require('moment');
// index behavior recommended to be turned off for production, as index creation can have performance impact. turn off with autoIndex false.
// e.g. mongoose.connect('mongodb://user:pass@localhost:port/database', { autoIndex: false });
mongoose.connect('mongodb://localhost/sdc_q_a', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: true});
const Question = mongoose.model('Question', schemas.questionSchema,
'questions');
const MaxId = mongoose.model('MaxId', schemas.maxIdSchema, 'maxids');

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
        let answersObj = {};
        for (let answer of answers) {
          answersObj[answer.answer_id] = answer;
        }
        return {
          question_id: question.id,
          question_body: question.body,
          question_date: question.date_written,
          asker_name: question.asker_name,
          question_helpfulness: question.helpful,
          reported: false,
          answers: answersObj
        }
      })
      return questions;
    });
};
// setQ
const setQ = function(newQ) {
  let currentTime = moment().format('YYYY-MM-DD');
  newQ.date_written = currentTime;
  MaxId.findOne({})
  // newQ needs id
  // need to generate a unique id, make sure its a number\
  // found max_id of current aggregate
  // db.questions.aggregate([{$group:{_id:null, max_id: {$max: '$id'}}}])
  // { "_id" : null, "max_id" : 3521634 }
  return 'hello';
};
// getAs
const getAs = function(question_id, page, count) {
  // get all non-reported Answers for that product
  return Question.aggregate([{$match: {id: question_id}}, {$unwind: '$answers'}, {$match:{reported: 0}}, {$project: {'answers':1, _id:0}}, {$limit: count}])
    .then((answers)=>{
      return answers.map((answer)=>{
        answer = answer.answers;
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
      })
    });
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
  return Question.updateOne({id: question_id}, {$inc:{'helpful': 1}});
};
// reportQ
const reportQ = function(question_id) {
  //
  // Question.update({question_id: question_id}, {$set:{'reported': true}});
};
// helpA
const helpA = function(answer_id) {
  // may also get away with Question.update({answer.id: answer_id}, {$inc:{'answers.$.helpfulness':1}}), bc listed as index on mongo database
  return Question.updateOne({'answers.id': answer_id}, {$inc:{'answers.$.helpful': 1}});
  // Answer.findOne({id: answer_id}).select('question_id')
  //   .then((id)=>{
  //     return id.question_id;
  //   })
    // .then((question_id)=>{
      // use that question_id to target correct answer, and thereby correct answer, in the Question collection.
      // Question.aggregate([{$match: {id: question_id}}, {$unwind: $answers}, {$match:{id: answer_id}}, {$inc:{'helpfulness': 1}}]);
      // // OR
      // Question.update({id: question_id, answers.id: answer_id}, {$inc:{'answers.$.helpfulness': 1}});
    // })
};
// reportA
const reportA = function(answer_id) {
  // Answer.findOne({id: answer_id}).select('question_id')
  //   .then((id)=>{
  //     return id.question_id;
  //   })
    // .then((product_id)=>{
      // Question.aggregate([{$match: {question_id: question_id}}, {$unwind: $answers}, {$match:{id: answer_id}}, {$set:{'reported': true}}]);
      // // OR
      // Question.update({product_id: product_id, answers.answer_id: answer_id}, {$set:{'answers.$.reported': true}});
    // })
};

module.exports = {getQs, setQ, getAs, setA, helpQ, reportQ, helpA, reportA};