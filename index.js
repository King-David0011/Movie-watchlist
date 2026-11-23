const searchInput = document.getElementById("search-input")
const searchBtn = document.getElementById("search-btn")
const movieList = document.getElementById("movie-list")

let movies = []

searchBtn.addEventListener("click", function() {
    const title = searchInput.value

    if (title === "") {
        return
    }

    fetch(`https://www.omdbapi.com/?apikey=fcc2506d&s=${title}&type=movie`)
        .then(res => res.json())
        .then(data => {
            if (data.Response === "False") {
                movieList.innerHTML = `
                    <div class="message">
                        <p>Unable to find what you’re looking for. Please try another search.</p>
                    </div>
                `
                return
            }

            movies = []

            data.Search.forEach(function(movie) {
                fetch(`https://www.omdbapi.com/?apikey=fcc2506d&i=${movie.imdbID}`)
                    .then(res => res.json())
                    .then(details => {
                        movies.push(details)
                        renderMovies()
                    })
            })
        })
})

function getPlot(movie) {
    if (movie.Plot.length > 120) {
        return `${movie.Plot.slice(0, 120)}... <span class="read-more" data-id="${movie.imdbID}">Read more</span>`
    }
    return movie.Plot
}

function renderMovies() {
    let html = ""

    movies.forEach(function(movie) {
        html += `
            <div class="movie">
                <img src="${movie.Poster}" alt="${movie.Title} poster">
                <div class="movie-info">
                    <div class="movie-title">
                        <h2>${movie.Title}</h2>
                        <span class="star">★</span>
                        <span class="rating">${movie.imdbRating}</span>
                    </div>
                    <div class="movie-details">
                        <p>${movie.Runtime}</p>
                        <p>${movie.Genre}</p>
                        <button class="watchlist-btn" data-id="${movie.imdbID}">Watchlist</button>
                    </div>
                    <p class="plot">${getPlot(movie)}</p>
                </div>
            </div>
        `
    })

    movieList.innerHTML = html
}

movieList.addEventListener("click", function(e) {
    const id = e.target.dataset.id
    const movie = movies.find(m => m.imdbID === id)

    if (e.target.className === "read-more") {
        e.target.parentElement.textContent = movie.Plot
    }

    if (e.target.className === "watchlist-btn") {
        let watchlist = JSON.parse(localStorage.getItem("watchlist")) || []
        const alreadySaved = watchlist.some(m => m.imdbID === id)

        if (!alreadySaved) {
            watchlist.push(movie)
            localStorage.setItem("watchlist", JSON.stringify(watchlist))
        }

        e.target.textContent = "Added"
        e.target.className = "added-btn"
    }
})