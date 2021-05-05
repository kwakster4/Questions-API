const mongoose = require('mongoose');
const schemas = require('./schemas');

mongoose.connect('mongodb://localhost/sdc_q_a', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});

const Photo = mongoose.model('Photo', schemas.photoSchema, 'answer_photos');
// Photo.findOne().then((res)=>{console.log(res)});
const PreAnswer = mongoose.model('PreAnswer', schemas.answerSchema, 'preanswers');
// PreAnswer.findOne().then((res)=>{console.log(res)});
const PreQuestion = mongoose.model('PreQuestion', schemas.questionSchema, 'prequestions');
PreQuestion.findOne().then((res)=>{console.log(res)});