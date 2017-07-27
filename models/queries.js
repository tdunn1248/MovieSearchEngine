const db = require('./config')

const signUp = (email, password) => {
  return db.one("INSERT INTO movie_users(email, password) VALUES($1, $2) RETURNING email, password", [email,password])
}

const login = (email) => {
  return db.one("SELECT * FROM movie_users WHERE email = $1", [email])
    .then(record => {
      // const  userInfo = {
      //   email: record.email,
      //   hashPassword: record.password
      // }
      record.hashPassword = record.password
      return record
    }).catch(e => e)
}
module.exports = {signUp, login}
