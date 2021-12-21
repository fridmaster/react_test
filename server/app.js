const express = require('express')
const app = express()
const port = 3001
const bodyParser = require('body-parser');
const cors = require('cors');
const tasks = [
    'task1',
    'task2'
];
app.use(cors());
app.options('*', cors());

app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());

// respond with "hello world" when a GET request is made to the homepage
app.get('/getTasks', function (req, res) {
  res.send({tasks:tasks})
})

app.post('/addTask', function(req, res){
    tasks.push(req.body.task);
    res.send({succes:'OK'})
})
// app.

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })