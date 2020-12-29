
const submitForm = document.getElementById('search-form');
const displayAnimeTitle = document.getElementById('display-anime-title');
const anime = document.getElementById('anime-movies');
const displayAnimeInfo = document.querySelector('.display-anime-info');
const closeButton = document.getElementById('close-button');
const ghibliHistory = document.querySelector('.ghibli-history');

function showAnimeTitle(e){// shows the title for each film
  e.preventDefault();
  fetch(`https://ghibliapi.herokuapp.com/films`)
  .then(res => res.json())
  .then(data => {
    //console.log(data);
    anime.innerHTML = data.map(film => `
      <a class='film-title' id='film-title'>
      ${film.title}
      </a><br>
      `).sort().join('');// joins each film to list of films for display
    displayAnimeTitle.style.display = 'block';
    closeButton.style.display = 'block';// removes close button
    ghibliHistory.style.display = 'none';// removes the history window
  });
}

function getAnimeByID(filmID){// gets and adds film info to be displayed
  fetch(`https://ghibliapi.herokuapp.com/films/${filmID}`)
    .then(res => res.json())
    .then(data => {
      const filmTitle = data.title;
      const filmDirector = data.director;
      const filmProducer = data.producer;
      const filmDescription = data.description;
      const releaseDate = data.release_date;
      const rating = data.rt_score;
      let titleWithoutApostrophe = data.title.replace("'", "");
      const span = document.createElement('span');
      span.innerHTML = `
      <div class='display-anime-info-header'>
        <span>${filmTitle}</span>
        <img class='film-art' src='img/${titleWithoutApostrophe}.jpg'>
      </div>
      <p class='film-description'>${filmDescription}</p>
      <span class='film-info'>Director: ${filmDirector}</span><br>
      <span class='film-info'>Producer: ${filmProducer}</span><br>
      <span class='film-info'>Released: ${releaseDate}</span><br>
      <span class='film-info'>Rating: ${rating} / 100</span>
      `;
      //console.log(filmID);
      displayAnimeInfo.appendChild(span);// adds elements with info to be displayed
    });
}

function showAnimeInfo(e){// adds each films info to the DOM when title is clicked
  if(e.target.id == 'film-title'){
    let title = e.target.text.trim();
    fetch(`https://ghibliapi.herokuapp.com/films`)
      .then(res => res.json())
      .then(data => {
        data.map(filmInfo => {
          if(title == filmInfo.title){
            getAnimeByID(filmInfo.id);
            displayAnimeInfo.style.display = 'flex';
          }
          displayAnimeInfo.innerHTML = '';
        });
      });
      //console.log(title);
  }
}

function closeDisplay(){// closes all info windows and shows history
  displayAnimeTitle.style.display = 'none';
  displayAnimeInfo.style.display = 'none';
  displayAnimeInfo.innerHTML = '';
  closeButton.style.display = 'none';
  ghibliHistory.style.display = 'flex';
}

// event listeners
closeButton.addEventListener('click', closeDisplay);
submitForm.addEventListener('submit', showAnimeTitle);
document.addEventListener('click', showAnimeInfo);
