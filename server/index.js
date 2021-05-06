const express = require('express');
const app = express();
const port = 3001;

app.get('/', (req, res) => {
  res.send('Hello World!')
});
app.get('/questions');
app.get('/questions/:question_id/answers');
app.get('questions/:question_id/helpful');
app.get('questions/:question_id/report');
// endpoints can start with in /questions or /answers

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})