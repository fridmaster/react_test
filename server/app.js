const express = require('express')
const app = express()
const port = 3001
const bodyParser = require('body-parser');
const cors = require('cors');
const faker = require('faker');
let history = [];

for (let index = 0; index < 10; index++) {
  let chatRoomObj = {
    roomId: index,
    fromName: faker.name.findName(),
    fromNumber: faker.phone.phoneNumber(),
    body: getMessages()
  }
  history.push(chatRoomObj);
}

function getMessages() {
  const countMessages = Math.floor(Math.random() * 10) + 1;
  let messageList = [];
  for (let index = 0; index < countMessages; index++) {
    let message = {};
    message = {
      receivedAt: faker.time.recent(),
      body: faker.random.words(),
      direction: index % 2 === 0 ? 'incoming' : 'outcoming'
    }
    messageList.push(message);
  }
  return messageList;
}

function getRandomMessage(history){
  const randomRoomIdx = Math.floor(Math.random()*history.length);
  const randomRoom = history[randomRoomIdx];
  const {body, ...roomParams} = randomRoom
  const randomMessageIdx = Math.floor(Math.random()*randomRoom.body.length);
  return {...body[randomMessageIdx], ...roomParams};
}

app.use(cors());
app.options('*', cors());

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// respond with "hello world" when a GET request is made to the homepage
app.get('/api/message', function (req, res) {
  res.send(getRandomMessage(history))
})

app.get('/api/chat/:room_id', function (req, res) {
  let id = req.params.room_id;
  let room = history.find((historyRoom) => {
    return historyRoom.roomId == id
  });

  if (room) {
    res.send(room)
  } else {
    res.status(404).send();
  }
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})