const mongoose = require('mongoose');
const schemas = require('./schemas');

mongoose.connect('mongodb://localhost/sdc_q_a', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: true});

const Photo = mongoose.model('Photo', schemas.photoSchema, 'answer_photos');
const Answer = mongoose.model('Answer', schemas.answerSchema, 'answers');
const Question = mongoose.model('Question', schemas.questionSchema, 'questions');
// {$limit: 10},
Photo.aggregate([{$group: { _id: '$answer_id', photos: { $push: { id: '$id', url: '$url'}}}}]).allowDiskUse(true)
  .then((photos)=>{
    console.log('aggregated photo');
    // let answerBulk = Answer.collection.initializeUnorderedBulkOp();
    // for (let photo of photos) {
    //   answerBulk.find({'id': photo._id}).updateOne({"$set": {'photos': photo.photos}});
    // }
    for (let i = 0; i < photos.length; i++) {
      let photo = photos[i];
      Answer.findOneAndUpdate({"id": photo._id}, { "$set": {"photos": photo.photos }});
      if (i === photos.length - 1) {
        console.log('reached last photo findOneAndUpdate');
        return Answer.findOneAndUpdate({"id": photo._id}, { "$set": {"photos": photo.photos }});
      }
    }
    // console.log('executing answerBulk');
    // return answerBulk.execute();
  })
  .then(()=> {
    console.log('aggregating answer');
    // {$limit: 10},
    Answer.aggregate([{$group: {_id: '$question_id', answers: {$push: {answer_id: '$id', date: '$date_written', body: '$body', answerer_name: '$answerer_name', helpfulness: '$helpful', reported: '$reported', photos: '$photos'}}}}]).allowDiskUse(true);
    // So from this experiment, the results show that the aggregation isn't the issue, the passing of the results from the aggregation to the next promise chain is the memory heap issue.
    return;
  })
  .then((answers)=>{
    // console.log('aggregated answer');
    // let questionBulk = Question.collection.initializeUnorderedBulkOp();
    // for (let answer of answers) {
    //   questionBulk.find({'id': answer._id}).updateOne({"$set": {'answers': answer.answers}});
    // }
    // console.log('executing questionBulk');
    // return questionBulk.execute();


    // for (let i = 0; i < answers.length; i++) {
    //   let answer = answers[i];
    //   Question.findOneAndUpdate({"id": answer._id}, { "$set": {"answers": answer.answers }});
    //   if (i === photos.length - 1) {
    //     console.log('reached last photo findOneAndUpdate');
    //     return Question.findOneAndUpdate({"id": answer._id}, { "$set": {"answers": answer.answers }});
    //   }
    // }
    return;
  })
  .then(()=>{
    console.log('completed ETL!');
  })
  .catch((err)=>{console.log(err)});
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
// Instead of bulk, promises?
// let updatePromise = Answer.findOneAndUpdate({"id": photo._id}, { "$set": {"photos": photo.photos }});
      // answerUpdates.push(updatePromise);
      // update document with photoArray as photos
      // for each photo, find Answer doc corresponding to photo._id, and then update their photos with photo.photos