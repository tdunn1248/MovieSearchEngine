function movieSearch() {
  document.getElementById("movie_list").innerHTML = ""
  var ajax = new XMLHttpRequest()

  var formValue = document.getElementsByClassName('movieTitle')[0].value

  ajax.onreadystatechange = function() {
    if( ajax.readyState === XMLHttpRequest.DONE) {
      var parsedMovies = JSON.parse(ajax.responseText)
      var movies = document.getElementById('movie_list')

      parsedMovies.forEach(function(element) {
        var createdMovie = document.createElement("LI")
        createdMovie.className = 'movie-list-item'
        createdMovie.innerText = element
        movies.appendChild(createdMovie)
      })
    }
  }
  ajax.open('POST', 'http://localhost:3008/search/movies')
  ajax.setRequestHeader("Content-type", "application/json")
  ajax.send(JSON.stringify({title: formValue}))
}
