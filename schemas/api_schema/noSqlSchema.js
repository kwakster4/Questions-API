// what if:
// all Questions by ProductID
// all Answers by QuestionID
// can have collection of questions and collection for answers
/// When I return the response, serve those answers together
// find by product_id;
let questionSchema = {
  "product_id": Number,
  "question_id": Number,
  "question_body": String,
  "question_date": String,
  "asker_name": String,
  "question_helpfulness": Number,
  "reported": Boolean,
  // should I have answerSchema inside questionSchema?
  "answers": [answerSchema]
};

let answerSchema = {
  "question_id": Number,
  "answer_id": Number,
  "body": String,
  "date": String,
  "answerer_name": String,
  "helpfulness": Number,
  "reported": Boolean,
  // photos is an array of objects with id and urls.
  "photos": [photoSchema]
};
// let photoSchema = {
//     "id": Number,
//     "answer_id": Number,
//     "url": String
// }