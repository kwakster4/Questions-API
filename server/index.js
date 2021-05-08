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

app.get('/questions/:question_id/answers', (req, res) => {
  let query = req.query;
  if (!query.page) { query.page = 0; };
  if (!query.count) { query.count = 5; };
  db.getAs(parseInt(req.params.question_id), parseInt(query.page), parseInt(query.count))
    .then((answers)=>{
      let resObj = {question: req.params.question_id, page: parseInt(query.page), count: answers.length, results: answers};
      res.status(200).send(resObj);
    })
    .catch((err)=>{
      console.log(err);
      res.status(500).end();
    })
});

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
      res.status(201).send('CREATED');
    })
    .catch((err)=>{
      console.log(err);
      res.status(500).end();
    });
});

app.post('/questions/:question_id/answers', (req, res) => {
  let newA = {...req.body};
  newA.answerer_name = newA.name;
  newA.answerer_email = newA.email;
  delete newA.name;
  delete newA.email;
  newA.helpful = 0;
  newA.reported = 0;
  newA.question_id= parseInt(req.params.question_id);
  db.setA(newA.question_id, newA)
    .then(()=> {
      res.status(201).send('CREATED');
    })
    .catch((err)=>{
      console.log(err);
      res.status(500).end();
    });
});

app.put('/questions/:question_id/helpful', (req, res) => {
  db.helpQ(parseInt(req.params.question_id))
    .then((status)=>{
      res.status(204).send('NO CONTENT');
    })
    .catch((err)=>{
      res.status(500).send();
    })
  res.end();
});
// mark question as reported: reportQ
app.put('/questions/:question_id/report', (req, res) => {
  db.reportQ(parseInt(req.params.question_id))
    .then((status)=>{
      res.status(204).send('NO CONTENT');
    })
    .catch((err)=>{
      res.status(500).send();
    })
  res.end();
});
// add 1 to helpfulness counter: helpA
app.put('/answers/:answer_id/helpful', (req, res) => {
  db.helpA(parseInt(req.params.answer_id))
    .then((status)=>{
      res.status(204).send('NO CONTENT');
    })
    .catch((err)=>{
      res.status(500).send();
    })
});
// mark answer as reported: reportA
app.put('/answers/:answer_id/report', (req, res) => {
  db.reportA(parseInt(req.params.answer_id))
    .then((status)=>{
      res.status(204).send('NO CONTENT');
    })
    .catch((err)=>{
      res.status(500).send();
    })
});

app.listen(port, () => {
  console.log(`QnA API listening at http://localhost:${port}`)
})