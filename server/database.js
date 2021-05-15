const mongoose = require('mongoose');
const schemas = require('./../schemas/serverSchemas');
const moment = require('moment');
require('dotenv').config();
// index behavior recommended to be turned off for production, as index creation can have performance impact. turn off with autoIndex false.
// e.g. mongoose.connect('mongodb://user:pass@localhost:port/database', { autoIndex: false });
mongoose.connect(`mongodb://${process.env.USER1}:${process.env.PASS}@${process.env.HOST}/sdc_q_a`, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false});

// the schemas below doesn't work (next is not defined), but shows that maxTimeMS works
// schemas.newQuestionSchema.pre('aggregate', function(next) {
//   this._startTime = Date.now();
// });
// schemas.newQuestionSchema.post('aggregate', function(next) {
//   if (this._startTime != null) {
//     console.log('Runtime in MS: ', Date.now() - this._startTime);
//   }
// });

// index behavior recommended to be turned off for production, as index creation can have performance impact. turn off with autoIndex false.
// e.g. mongoose.connect('mongodb://user:pass@localhost:port/database', { autoIndex: false });
// mongoose.connect('mongodb://localhost/sdc_q_a', {useNewUrlParser: true, useUnifiedTopology:
// true, useCreateIndex: true, useFindAndModify: false});

const Question = mongoose.model('Question', schemas.newQuestionSchema,
'questions');
const MaxId = mongoose.model('MaxId', schemas.maxIdSchema, 'maxids');

const getQs = function(product_id, page, count) {
  // get all non-reported Questions for that product
  count = count || 5;
  // mongoose method of Question.find doesn't return anything when setting reported to false or 0;
  // return Question.find({'product_id': product_id, reported:false}, {limit: count});
  // when using aggregate, reported returns as 0 instead of boolean.

  // the below comment works only if the question has an answer
  // return Question.aggregate([{$match: {$and: [{reported: {$ne:1 }}, {'product_id': product_id}]}}, {$unwind: '$answers'}, {$match: {'answers.reported': {$ne: 1}}}, {$group: {_id:'$id', answers: {$push: '$answers'}, question_body: {$first: '$body'}, 'question_date': {$first: '$date_written'}, 'asker_name':{$first:'$asker_name'}, 'question_helpfulness':{$first:'$helpful'}}}, {$limit: count}]).option({maxTimeMS: 50, allowDiskUse: true})
  return Question.aggregate([{$match: {$and: [{reported: {$ne:1 }}, {'product_id': product_id}]}}, {$limit: count}]).option(allowDiskUse: true})
    .then((questions)=>{
      questions = questions.map((question)=> {
        let answers = question.answers.filter((answer)=>{
          return answer.reported !== 1;
        })
        answers = answers.map((answer)=>{
          let photos = answer.photos.map((photo)=>{
            return {'id': photo.id, 'url': photo.url}
          });
          return {
            id: answer.id,
            body: answer.body,
            date: answer.date_written,
            answerer_name: answer.answerer_name,
            helpfulness: answer.helpful,
            photos: photos
          }
        });
        let answersObj = {};
        for (let answer of answers) {
          answersObj[answer.id] = answer;
        }
        // question.question_id = question._id;
        // delete question._id;
        // question.reported= false;
        // question.answers = answersObj;
        // return question;
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

const setQ = function(newQ) {
  let currentTime = moment().format('YYYY-MM-DD');
  newQ.date_written = currentTime;
  return MaxId.findOneAndUpdate({for: 'questions'}, {$inc: {'maxId': 1}})
    .then((id)=>{
      newQ.id = id.maxId + 1;
      return Question.create(newQ);
    })
  // newQ needs id
  // need to generate a unique id, make sure its a number\
  // found max_id of current aggregate
  // db.questions.aggregate([{$group:{_id:null, max_id: {$max: '$id'}}}])
  // { "_id" : null, "max_id" : 3521634 }
};

const getAs = function(question_id, page, count) {
  // get all non-reported Answers for that product
  return Question.aggregate([{$match: {id: question_id}}, {$unwind: '$answers'}, {$match: {'answers.reported': {$ne: 1}}}, {$project: {'answers':1, _id:0}}, {$limit: count}]).option(allowDiskUse: true})
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

const setA = function(question_id, newA) {
  let currentTime = moment().format('YYYY-MM-DD');
  newA.date_written = currentTime;
  return MaxId.findOneAndUpdate({for: 'answers'}, {$inc: {'maxId': 1}});
    .then((id)=>{
      newA.id = id.maxId + 1;
      return Question.updateOne({id: question_id}, {$push: {answers: newA}});
    })
};

const helpQ = function(question_id) {
  // access and change helpfulness of question.
  return Question.updateOne({id: question_id}, {$inc:{'helpful': 1}});
};

const reportQ = function(question_id) {
  return Question.updateOne({id: question_id}, {$set:{'reported': 1}});
};

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

const reportA = function(answer_id) {
  return Question.updateOne({'answers.id': answer_id}, {$set:{'answers.$.reported': 1}});
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