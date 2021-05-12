const mongoose = require('mongoose');
const schemas = require('./schemas/schemas.js');
// schemas for collectionMerge, serverSchemas for database use.
mongoose.connect('mongodb://localhost/sdc_q_a', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: true});

// const Photo = mongoose.model('Photo', schemas.photoSchema, 'answer_photos');
const Answer = mongoose.model('Answer', schemas.answerSchema, 'answers');
const Question = mongoose.model('Question', schemas.questionSchema, 'questions');
const MaxId = mongoose.model('maxId', schemas.maxIdSchema);

// General startup stuff
console.log('aggregating...');
Answer.aggregate([{$lookup: {from: "answer_photos", localField: "id", foreignField: 'answer_id', as: "photos"}}, {$out: 'answers'}]).allowDiskUse(true)
  .then(()=>{
    console.log('finished answer aggregate. aggregating question');
    return Question.aggregate([{$lookup: {from: "answers", localField: "id", foreignField: 'question_id', as: "answers"}}, {$out: 'questions'}]).allowDiskUse(true);
  })
  .then(()=>{
    console.log('finished question aggregate!');
    return Question.aggregate([{$group:{_id:null, max_id: {$max: '$id'}}}])
  })
  .then((data)=>{
    console.log('creating question max-id');
    return MaxId.create({maxId: data[0].max_id, for: 'questions'});
  })
  .then(()=>{
    return Answer.aggregate([{$group:{_id:null, max_id: {$max: '$id'}}}])
  })
  .then((data)=>{
    return MaxId.create({maxId: data[0].max_id, for: 'answers'});
  })
  .then(()=>{
    console.log('maxIds finished!!');
    return;
  })
  .catch((err)=>{
    console.log(err);
  });


// When aggregated everything but not have maxId collection yet
// Question.aggregate([{$group:{_id:null, max_id: {$max: '$id'}}}])
//   .then((data)=>{
//     console.log('creating question max-id');
//     return MaxId.create({maxId: data[0].max_id, for: 'questions'});
//   })
//   .then(()=>{
//     return Answer.aggregate([{$group:{_id:null, max_id: {$max: '$id'}}}])
//   })
//   .then((data)=>{
//     return MaxId.create({maxId: data[0].max_id, for: 'answers'});
//   })
//   .then(()=>{
//     console.log('maxIds finished!!');
//     return;
//   })
//   .catch((err)=>{
//     console.log(err)
//   });

// When aggregated answer but not Question
// Question.aggregate([{$lookup: {from: "answers", localField: "id", foreignField: 'question_id', as: "answers"}}, {$out: 'questions'}]).allowDiskUse(true)
//   .then(()=>{
//     console.log('FINISHED!');
//   })
//   .catch((err)=>{
//     console.log(err);
//   });





// OLD, DOES NOT WORK WELL
// Photo.aggregate([{$limit: 10}, {$group: {_id: '$answer_id', photos: { $push: { id: '$id', url: '$url'}}}}, {$out: 'new_photos'}]).allowDiskUse(true)
//   .then(()=> {
//     console.log('aggregating answer');
//     return Answer.aggregate([{$limit:10},{$group: {_id: '$question_id', answers: {$push: {answer_id: '$id', date: '$date_written', body: '$body', answerer_name: '$answerer_name', helpfulness: '$helpful', reported: '$reported', photos: '$photos'}}}}, {$lookup:{from: 'questions', localField: '_id', foreignField:'id', as:'fromQuestions', whenMatched:'merge'}}]).allowDiskUse(true);
//   })
//   .then(()=>{
//     console.log('aggregated answer');
//     console.log(Question.findOne());
//   })
//   .then(()=>{
//     console.log('completed ETL!');
//   })
//   .catch((err)=>{console.log(err)});

// Instead of bulk, promises?
// let updatePromise = Answer.findOneAndUpdate({"id": photo._id}, { "$set": {"photos": photo.photos }});
      // answerUpdates.push(updatePromise);
      // update document with photoArray as photos
      // for each photo, find Answer doc corresponding to photo._id, and then update their photos with photo.photos