function loadScript() {
  const submitForm = document.querySelector('#search-form');
  const displayAnimeTitle = document.querySelector('.display-anime-title');
  const anime = document.querySelector('#anime-movies');
  const displayAnimeInfo = document.querySelector('.display-anime-info');
  const closeButton = document.querySelector('#close-button');
  const ghibliHistory = document.querySelector('.ghibli-history');

  async function getAnimeTitle() {
    const res = await fetch(`https://ghibliapi.herokuapp.com/films`);
    const data = await res.json();
    return data;
  }
  async function showAnimeTitle(e) {
    // shows the title for each film
    e.preventDefault();
    let films = await getAnimeTitle();
    anime.innerHTML = films
      .map(
        (film) => `
    <a class='film-title' id='film-title'>
    ${film.title}
    </a><br>
    `
      )
      .sort()
      .join(''); // joins each film to list of films for display
    displayAnimeTitle.style.opacity = '1';
    // closeButton.style.display = 'block';
    ghibliHistory.style.left = '-100%'; // removes the history window
    ghibliHistory.style.opacity = '0';
  }

  async function getAnimeByID(filmID) {
    // gets and adds film info to be displayed
    let res = await fetch(`https://ghibliapi.herokuapp.com/films/${filmID}`);
    let data = await res.json();
    const filmTitle = data.title;
    const filmDirector = data.director;
    const filmProducer = data.producer;
    const filmDescription = data.description;
    const releaseDate = data.release_date;
    const rating = data.rt_score;
    let titleWithoutApostrophe = data.title.replace("'", '');
    const div = document.createElement('div');
    div.innerHTML = `
  <div class='display-anime-info-header'>
    <span>${filmTitle}</span>
  </div>
  <p class='film-description'>${filmDescription}
  <img class='film-art' src='img/${titleWithoutApostrophe}.jpg'>
  </p>
  <span class='film-info'>Director: ${filmDirector}</span><br>
  <span class='film-info'>Producer: ${filmProducer}</span><br>
  <span class='film-info'>Released: ${releaseDate}</span><br>
  <span class='film-info'>Rating: ${rating} / 100</span>
  `;
    displayAnimeInfo.appendChild(div); // adds elements with info to be displayed
  }

  async function getAnimeInfo() {
    const res = await fetch(`https://ghibliapi.herokuapp.com/films`);
    const data = await res.json();
    return data;
  }

  async function showAnimeInfo(e) {
    // adds each films info to the DOM when title is clicked
    if (e.target.id == 'film-title') {
      let title = e.target.text.trim();
      let film = await getAnimeInfo();
      film.map((filmInfo) => {
        if (title == filmInfo.title) {
          getAnimeByID(filmInfo.id);
          displayAnimeInfo.style.display = 'flex';
        }
        displayAnimeInfo.innerHTML = '';
      });
    }
  }

  function positionHistory() {
    if (window.innerWidth < 1200) {
      ghibliHistory.style.left = '50%';
    } else {
      ghibliHistory.style.left = '200px';
    }
  }

  function closeDisplay() {
    // closes all info windows and shows history
    displayAnimeTitle.style.opacity = '0';
    displayAnimeInfo.style.display = 'none';
    displayAnimeInfo.innerHTML = '';
    ghibliHistory.style.opacity = '1';
    positionHistory();
  }

  // event listeners
  closeButton.addEventListener('click', closeDisplay);
  submitForm.addEventListener('submit', showAnimeTitle);
  document.addEventListener('click', showAnimeInfo);
  window.addEventListener('resize', positionHistory);
}

window.onload = loadScript;
