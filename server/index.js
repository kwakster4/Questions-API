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
  // req.params vs. req.query
  let query = req.query;
  db.getQs(parseInt(query.product_id), parseInt(query.page), parseInt(query.count))
    .then((questions)=>{
      let resObj = {"product_id": query.product_id, "results": questions}
      res.status(200).send(resObj);
    })
    .catch((err)=> {
      console.log(err);
      res.status(500).end();
    });
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
  console.log(`QnA API listening at http://localhost:${port}`)
})