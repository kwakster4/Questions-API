const mongoose = require('mongoose');
const schemas = require('./schemas');

mongoose.connect('mongodb://localhost/sdc_q_a', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});

const Photo = mongoose.model('Photo', schemas.photoSchema, 'answer_photos');
const Answer = mongoose.model('Answer', schemas.answerSchema, 'answers');
const Question = mongoose.model('Question', schemas.questionSchema, 'questions');
// {$limit: 10},
Photo.aggregate([{$group: {_id: '$answer_id', allPhotos: {$push: {id: '$id'}}}}]).allowDiskUse(true)
  .then((allPhotos)=>{
    console.log('aggregated photo');
    let answerBulk = Answer.collection.initializeUnorderedBulkOp();
    // let answerUpdates = [];
    for (let photo of allPhotos) {
      let photosArray = photo.photos.map((photo_id)=> {
        return Photo.findOne('id': photo_id);
      })
      Promise.all(photosArray)
        .then((photos)=> {
          answerBulk.find({'id': photo._id}).updateOne({"$set": {'photos': photos}}
        })
      );
    }
    console.log('executing answerBulk');
    return answerBulk.execute();
  })
  .then(()=> {
    // {$limit: 10},
    return Answer.aggregate([{$group: {_id: '$question_id', answers: {$push: {answer_id: '$id', date: '$date_written', body: '$body', answerer_name: '$answerer_name', helpfulness: '$helpful', reported: '$reported', photos: '$photos'}}}}]).allowDiskUse(true)
  })
  .then((answers)=>{
    console.log('aggregated answer');
    let questionBulk = Question.collection.initializeUnorderedBulkOp();
    for (let answer of answers) {
      questionBulk.find({'id': answer._id}).updateOne({"$set": {'answers': answer.answers}});
    }
    console.log('executing questionBulk');
    return questionBulk.execute();
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