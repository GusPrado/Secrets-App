require('dotenv/config')
const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const app = express()

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs')

mongoose.connect('mongodb://localhost:27017/userDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {console.log('Connected to MongoDB')})
  .catch((err) => {console.log(err)})

const userSchema = new mongoose.Schema({
  email: String,
  password: String
})

const User = new mongoose.model('User', userSchema)


app.get('/', (req, res) => {
  res.render('home')
})

app.get('/login', (req, res) => {
  res.render('login')
})

app.get('/register', (req, res) => {
  res.render('register')
})

app.post('/register', (req, res) => {
  let { username, password } = req.body

  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(password, salt, function(err, hash) {
      User.create({
        email: username,
        password: hash
      }, (err) => {
        if (err) {
          console.log(err)
        } res.render('secrets')
      })
    })
  })  
})

app.post('/login', (req, res) => {
  let { username, password } = req.body

  User.findOne({
    email: username
  }, (err, foundUser) => {
    if (err) {
      console.log(err)
    } else {
      if (foundUser) {
        bcrypt.compare(password, foundUser.password, function(err, result) {
          if (result === true) {
            res.render('secrets')
          }
        })    
      }
    }
  })
})

app.listen(3000, () => {console.log('Server running on port 3000')})
