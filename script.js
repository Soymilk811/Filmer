// Recupero gli elementi di interesse dalla pagina
const button = document.querySelector('button');
const inputField = document.querySelector('input');
const todoList = document.querySelector('.todo-list');
const ratedTodoList = document.querySelector('.rated-todo-list'); // Seleziona il nuovo container per le attività valutate
const emptyListMessage = document.querySelector('.empty-list-message');

// Chiave per il local storage
const STORAGE_KEY = '__bool_todo__';

// Lista di attività inizializzata vuota
let activities = [];

// Controllo se ci sono attività nel local storage
const storage = localStorage.getItem(STORAGE_KEY);
if (storage) {
  activities = JSON.parse(storage);
}

// Mostra il contenuto in base alle attività presenti
showContent();

// Aggiunta dell'attività al click del bottone
button.addEventListener('click', function () {
  addActivity();
});

function showContent() {
  todoList.innerHTML = '';
  ratedTodoList.innerHTML = ''; // Resetta le attività valutate
  emptyListMessage.innerText = '';

  // Filtra attività basandosi sul fatto che siano state valutate o meno
  const unRatedActivities = activities.filter(activity => activity.rating === null);
  const ratedActivities = activities.filter(activity => activity.rating !== null);

  // Mostra le attività non valutate
  unRatedActivities.forEach(activity => {
    const listItem = createActivityListItem(activity);
    todoList.appendChild(listItem);
  });

  // Mostra le attività valutate
  ratedActivities.forEach(activity => {
    const listItem = createActivityListItem(activity, true);
    ratedTodoList.appendChild(listItem);
  });

  if (activities.length === 0) {
    emptyListMessage.innerText = 'Sembra che non ci siano film qui :)';
  }
}

function createActivityListItem(activity, isRated = false) {
  const listItem = document.createElement('li');
  listItem.className = 'todo-item';

  const checkDiv = document.createElement('div');
  checkDiv.className = 'todo-check';
  checkDiv.innerHTML = `<img src="immagini/checkcine.svg" alt="Check Icon">`;
  checkDiv.onclick = function () { openRatingPopup(activities.indexOf(activity)); };
  listItem.appendChild(checkDiv);

  const textP = document.createElement('p');
  textP.className = 'todo-text';
  textP.textContent = activity.text;
  listItem.appendChild(textP);

  if (isRated) {
    const ratingP = document.createElement('p');
    ratingP.className = 'todo-rating';
    ratingP.textContent = `Voto: ${activity.rating}`;
    listItem.appendChild(ratingP);
  }

  const deleteDiv = document.createElement('div');
  deleteDiv.className = 'todo-delete';
  deleteDiv.innerHTML = `<img src="immagini/bin2.svg" alt="Delete Icon">`;
  deleteDiv.onclick = function () { handleDelete(activities.indexOf(activity)); };
  listItem.appendChild(deleteDiv);

  return listItem;
}

function openRatingPopup(index) {
  const rating = prompt("Che voto dai a questa attività? (da 1 a 10)");
  const parsedRating = parseInt(rating, 10);
  if (!isNaN(parsedRating) && parsedRating >= 1 && parsedRating <= 10) {
    activities[index].rating = parsedRating;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
    showContent();
  } else {
    alert("Per favore inserisci un numero da 1 a 10.");
  }
}

function addActivity() {
  const newActivityText = inputField.value.trim();
  if (newActivityText) {
    const newActivity = {
      text: newActivityText,
      rating: null // Voto inizialmente non presente
    };
    activities.push(newActivity);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
    showContent();
    inputField.value = '';
  }
}

function handleDelete(index) {
  activities.splice(index, 1); // Rimuove l'attività dall'array
  localStorage.setItem(STORAGE_KEY, JSON.stringify(activities)); // Aggiorna il local storage
  showContent(); // Aggiorna la visualizzazione delle attività
}
