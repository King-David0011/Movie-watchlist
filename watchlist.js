const movieList = document.getElementById("movie-list")

let watchlist = JSON.parse(localStorage.getItem("watchlist")) || []

function getPlot(movie) {
    if (movie.Plot.length > 120) {
        return `${movie.Plot.slice(0, 120)}... <span class="read-more" data-id="${movie.imdbID}">Read more</span>`
    }
    return movie.Plot
}

function renderWatchlist() {
    if (watchlist.length === 0) {
        movieList.innerHTML = `
            <div class="message">
                <p>Your watchlist is looking a little empty...</p>
                <a class="add-link" href="index.html">Let’s add some movies!</a>
            </div>
        `
        return
    }

    let html = ""

    watchlist.forEach(function(movie) {
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
                        <button class="remove-btn" data-id="${movie.imdbID}">Remove</button>
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

    if (e.target.className === "read-more") {
        const movie = watchlist.find(m => m.imdbID === id)
        e.target.parentElement.textContent = movie.Plot
    }

    if (e.target.className === "remove-btn") {
        watchlist = watchlist.filter(m => m.imdbID !== id)
        localStorage.setItem("watchlist", JSON.stringify(watchlist))
        renderWatchlist()
    }
})

renderWatchlist()
