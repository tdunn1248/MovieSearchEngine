const express = require('express')
const pug = require('pug')
const path = require('path')
const app = express()
const port = 3111

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
  res.render('index')
})

app.listen(port, () => console.log('Runnin on port: ' + port))
