const express = require('express');
const app = express();
const port = 3001;
const db = require('./database.js');
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
//  test with product 1, question 4 (helpfulness 6), answer 65 (helpfulness 1);
app.get('/', (req, res) => {
  res.send('Hello World!')
});

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
  let newQ = {...req.body};
  newQ.asker_name = newQ.name;
  newQ.asker_email = newQ.email;
  delete newQ.name;
  delete newQ.email;
  newQ.helpful = 0;
  newQ.reported = 0;
  newQ.answers = [];
  db.setQ(newQ)
    .then(()=> {
      res.end();
    })
    .catch((err)=>{
      console.log(err);
    });
});
// get all non-reported answers: getAs
app.get('/questions/:question_id/answers', (req, res) => {
  // db.getAs(question_id, page, count)
  let query = req.query;
  db.getAs(parseInt(req.params.question_id), parseInt(query.page), parseInt(query.count))
    .then((answers)=>{
      let resObj = {question: req.params.question_id, page: parseInt(query.page), count: answers.length, results: answers};
      res.status(200).send(resObj);
    })
    .catch((err)=>{
      res.status(500).end();
    })
});
// post an answer to a question: setA
app.post('/questions/:question_id/answers', (req, res) => {
  // db.setA(question_id, newA)
});
// add 1 to helpfulness counter: helpQ
app.put('/questions/:question_id/helpful', (req, res) => {
  db.helpQ(parseInt(req.params.question_id))
    .then((status)=>{
      res.status(200).send('OK');
    })
    .catch((err)=>{
      res.status(500).send();
    })
  res.end();
});
// mark question as reported: reportQ
app.put('/questions/:question_id/report', (req, res) => {
  // db.reportQ(question_id)
});
// add 1 to helpfulness counter: helpA
app.put('/answers/:answer_id/helpful', (req, res) => {
  db.helpA(parseInt(req.params.answer_id))
    .then((status)=>{
      res.status(200).send();
    })
    .catch((err)=>{
      res.status(500).send();
    })
});
// mark answer as reported: reportA
app.put('/answers/:answer_id/report', (req, res) => {
  // db.reportA(answer_id)
});

app.listen(port, () => {
  console.log(`QnA API listening at http://localhost:${port}`)
})