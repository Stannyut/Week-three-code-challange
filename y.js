let films = [];
let selectedFilm = null;

function fetchMovies() {
    fetch('http://localhost:3000/films')
        .then(response => response.json())
        .then(data => {
            films = data;  
            renderMovieList(films);
            if (films.length > 0) {
                renderFilm(films[0]);  
            }
        });
}

function renderMovieList(films) {
    let movieTitleList = document.getElementById('movie-title');
    movieTitleList.innerHTML = '';  

    films.forEach(film => {
        let listItem = document.createElement('li');
        listItem.className = 'film item';

        listItem.innerHTML = `
            <span>${film.title}</span>
            <button class="view-details" data-id="${film.id}">View Details</button>
        `;

        movieTitleList.appendChild(listItem);
    });

    document.querySelectorAll('.view-details').forEach(button => {
        button.addEventListener('click', event => {
            let filmId = event.target.getAttribute('data-id');
            fetchMovieDetails(filmId);
        });
    });
}

function fetchMovieDetails(filmId) {
    const film = films.find(f => f.id === filmId);
    if (film) {
        renderFilm(film);
    }
}

function renderFilm(film) {
    selectedFilm = film;
    let availableTickets = film.capacity - film.tickets_sold;

    let movieDetails = document.getElementById('movie-details');
    movieDetails.innerHTML = '';  

    let mainMovie = document.createElement('div');
    mainMovie.innerHTML = `
        <img src="${film.poster}" alt="Poster of ${film.title}">
        <div class="content">
            <h2>${film.title}</h2>
            <p>Runtime: ${film.runtime} minutes</p>
            <p>Showtime: ${film.showtime}</p>
            <p>Available Tickets: <span id="available-tickets">${availableTickets}</span></p>
            <p>Description: ${film.description}</p>
            <button id="buy-ticket">${availableTickets > 0 ? 'Buy Ticket' : 'Sold Out!'}</button>
        </div>
    `;

    movieDetails.appendChild(mainMovie);

    document.getElementById('buy-ticket').addEventListener('click', () => {
        if (availableTickets > 0) {
            availableTickets--;
            document.getElementById('available-tickets').innerText = availableTickets;

            fetch(`http://localhost:3000/films/${film.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ tickets_sold: film.capacity - availableTickets }),
            }).then(() => {
                if (availableTickets === 0) {
                    document.getElementById('buy-ticket').innerText = 'Sold Out!';
                    document.getElementById('buy-ticket').disabled = true;
                }
            });
        }
    });
}

fetchMovies();
