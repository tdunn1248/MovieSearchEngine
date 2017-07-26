const express = require('express')
const pug = require('pug')
const path = require('path')
const bodyParser = require('body-parser')
const db = require('./models/config')
const {signUp, login} = require('./models/queries')
const {checkUserSession} = require('./models/user')
const cookieSession = require('cookie-session')
const bcrypt = require('bcrypt')
const app = express()

const {movies} = require('./cheerio_functions/cheerio')
const port = 3008

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(cookieSession({
  name: 'loggined',
  keys: ['key1', 'key2'],
  maxAge: 24 * 60 * 60 * 1000
}))

app.get('/', (request, response) => {
  response.render('home')
})

app.route('/login')
  .get((request, response) => {
    response.render('login')
  })
  .post((request, response) => {
    const userEmail = request.body.email
    const password = request.body.password
    login(userEmail)
      .then(userInfo => {
        bcrypt.compare(password, userInfo.hashPassword)
          .then(res => {
            if(!res) {
              response.render('login', {error: 'Incorrect email or password'})
            } else {
              request.session.user = userInfo.email
              response.render('loggedInHome', {results: [], userName: request.session.user})
            }
          }).catch(e => console.log(e))
      }).catch(e => console.log(e))
  })

app.route('/signup')
  .get((request, response) => {
    response.render('signup')
  })
  .post((request, response) => {
    const newUser = {
      email: request.body.email,
      password: request.body.password
    }
    bcrypt.hash(newUser.password, 10, function(err, hash) {
      signUp(newUser.email, hash)
    })
    request.session.user = newUser.email
    response.render('loggedInHome', {results: [], userName: request.session.user} )
  })

app.get('/signout', (request, response) => {
  response.clearCookie('loggined')
  request.session = null
  response.redirect('/')
})
// ==========================================

app.post('/search/movies', (request, response) => {
  const {title} = request.body
  movies(title)
    .then(results => {
      const movies = results || []
      response.status(200).json(movies)
    })
})

app.get('/results', (request, response) => {
  response.render('results')
})
// ==========================================

app.use(checkUserSession)

app.get('/loggedInHome', (request, response) => {
  response.render('loggedInHome', {userName: request.session.user})
})

app.listen(port, () => console.log('Runnin on port: ' + port))
