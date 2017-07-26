function checkUserSession(request, response, next) {
  (!request.session.user) ? response.status(302).redirect('/login') : next()
}

module.exports = {checkUserSession}
