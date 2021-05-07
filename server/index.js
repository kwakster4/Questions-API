const express = require('express');
const app = express();
const port = 3001;
const db = require('./database.js');

app.get('/', (req, res) => {
  res.send('Hello World!')
});
// get all non-reported questions: getQs
app.get('/questions', (req, res) => {
  // db.getQs(product_id, page, count)
});
// post a question: setQ
app.post('/questions', (req, res) => {
  // db.setQ(newQ)
});
// get all non-reported answers: getAs
app.get('/questions/:question_id/answers', (req, res) => {
  // db.getAs(question_id, page, count)
});
// post an answer to a question: setA
app.post('/questions/:question_id/answers', (req, res) => {
  // db.setA(question_id, newA)
});
// add 1 to helpfulness counter: helpQ
app.put('/questions/:question_id/helpful', (req, res) => {
  // db.helpQ(question_id)
});
// mark question as reported: reportQ
app.put('/questions/:question_id/report', (req, res) => {
  // db.reportQ(question_id)
});
// add 1 to helpfulness counter: helpA
app.put('/answers/:answer_id/helpful', (req, res) => {
  // db.helpA(answer_id)
});
// mark answer as reported: reportA
app.put('/answers/:answer_id/report', (req, res) => {
  // db.reportA(answer_id)
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})