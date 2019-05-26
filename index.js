const express = require('express')
const app = express()
const cors = require('cors');
const fs = require("fs");
const uuidv4 = require('uuid/v4');



app.use(cors())

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.get('/macelleria', (req,res) => {
  fs.readFile(`${__dirname}/database/coda-macelleria.json`, 'utf8', function readFileCallback(err, data){
    if (err){
        console.log(err);
    } else {
      let queueData = JSON.parse(data);

      res.send(queueData[0]);
    }
  })
})

app.get('/macelleria/:id', (req, res) => {
  const sessionId = req.params.id
  console.log(sessionId)
  console.log("[GET] ", sessionId)
  fs.readFile(`${__dirname}/database/coda-macelleria.json`, 'utf8', function readFileCallback(err, data){
    if (err){
        console.log(err);
    } else {
      let queueData = JSON.parse(data);

      let srcObj = queueData.find( x => x.session === sessionId)


      const result = queueData.indexOf(srcObj)
      console.log(">>> id", sessionId, " IS #", result);

      let queueResponse = {
        queueNum: result
      }
      res.send(queueResponse);
    }
  })
})

app.post('/macelleria', (req, res) => {
  console.log(req.body)
  const sessionId = uuidv4();
  const newQueueData = {
    name: req.body.user.name,
    picture: req.body.user.pic,
    session: sessionId
  }

  //add data to json file (DB abstraction)
  fs.readFile(`${__dirname}/database/coda-macelleria.json`, 'utf8', function readFileCallback(err, data){
    if (err){
        console.log(err);
    } else {
      let queueData = JSON.parse(data);
      let queueLength = queueData.length
      queueData.push(newQueueData)
      let finalJson = JSON.stringify(queueData)
      fs.writeFile(`${__dirname}/database/coda-macelleria.json`, finalJson, 'utf8', function writeFileClbk(err) {
        if (err) {
          return console.error(err)
        }
        console.log("Success! wrote to file!")
        let queueResponse = {
          queueNum: queueLength,
          sessionId: sessionId
        }

        res.send(queueResponse)
      });
    }
  })


})

app.delete('/macelleria/:id', (req, res) => {

  console.log(req.params)
  let sessionId =  req.params.id

  fs.readFile(`${__dirname}/database/coda-macelleria.json`, 'utf8', function readFileCallback(err, data){
    if (err){
        console.log(err);
    } else {
      let queueData = JSON.parse(data);
      let queueLength = queueData.length
      let objRemoved = queueData.shift()
      let finalJson = JSON.stringify(queueData)
      fs.writeFile(`${__dirname}/database/coda-macelleria.json`, finalJson, 'utf8', function writeFileClbk(err) {
        if (err) {
          return console.error(err)
        }
        console.log("Success! wrote to file!")

        res.send(objRemoved)
      });
    }
  })

  // res.status(202).send()
})


app.listen(3001, () => {
  console.log("App listening on port 3001")
})
