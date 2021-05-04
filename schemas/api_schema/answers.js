let answerSchema = {
  "question_id": Number,
  "answer_id": Number,
  "body": String,
  "date": String,
  "answerer_name": String,
  "helpfulness": Number,
  reported: Boolean,
  // photos is an array of strings
  "photos": Array
}