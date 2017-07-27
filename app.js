const express = require('express')
const pug = require('pug')
const path = require('path')
const bodyParser = require('body-parser')
const cookieSession = require('cookie-session')
const bcrypt = require('bcrypt')

const db = require('./models/config')
const {signUp, login} = require('./models/queries')
const {checkUserSession} = require('./models/user')
const getUserSearchHistory = require('./models/searchHistory')

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
  response.render('index')
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
              request.session.user = {
                email: userInfo.email,
                id: userInfo.id,
              }
              response.redirect('/home')
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
        .then(newUser => {
          request.session.user = {
            email: newUser.email,
            id: newUser.id,
          }
          response.render('home', {results: [], userName: newUser.email} )
        })
        .catch(console.error)
    })
  })

app.get('/signout', (request, response) => {
  response.clearCookie('loggined')
  request.session = null
  response.redirect('/')
})

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

app.use(checkUserSession)

app.get('/home', (request, response) => {
  const {user} = request.session

  console.log(user);

  getUserSearchHistory(user.id)
    .then(info => {
      console.log('Search Term', info);

      response.status(200).render('home', {userName: user.email, searchTerm: info.search_term})
    })
})

app.listen(port, () => console.log('Runnin on port: ' + port))
