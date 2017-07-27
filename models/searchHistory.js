const db = require('./config')

const selectSearchTerm = "SELECT * FROM search_history WHERE user_id = $1"

module.exports = function getUserSearchHistory(user_id) {
  return db.oneOrNone(selectSearchTerm, [user_id])
}
