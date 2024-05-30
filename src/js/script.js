// Referencja do szablonu książki
const bookTemplate = document.getElementById('template-book').innerHTML;

// Referencja do listy książek
const booksList = document.querySelector('.books-list');

// Pusta tablica filters
const filters = [];

// Pusta tablica favoriteBooks
const favoriteBooks = [];

function determineRatingBgc(rating) {
  if (rating < 6) {
    return 'linear-gradient(to bottom, #fefcea 0%, #f1da36 100%)';
  } else if (rating > 6 && rating <= 8) {
    return 'linear-gradient(to bottom, #b4df5b 0%, #b4df5b 100%)';
  } else if (rating > 8 && rating <= 9) {
    return 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%)';
  } else if (rating > 9) {
    return 'linear-gradient(to bottom, #ff0084 0%, #ff0084 100%)';
  }
}

function render() {
  booksList.innerHTML = '';
  const compiledTemplate = Handlebars.compile(bookTemplate);

  for (const book of dataSource.books) {
    const ratingBgc = determineRatingBgc(book.rating);
    const ratingWidth = book.rating * 10;

    const generatedHTML = compiledTemplate({
      ...book,
      ratingBgc: ratingBgc,
      ratingWidth: ratingWidth,
    });

    const bookElement = utils.createDOMFromHTML(generatedHTML);

    booksList.appendChild(bookElement);
  }
  filterBooks();
}

// Funkcja filterBooks
function filterBooks() {
  for (const book of dataSource.books) {
    let shouldBeHidden = false;

    // Sprawdzamy każdy filtr
    for (const filter of filters) {
      if (!book.details[filter]) {
        shouldBeHidden = true;
        break;
      }
    }

    // Znajdujemy element .book__image i dodajemy lub usuwamy klasę hidden
    const bookImage = booksList.querySelector(
      `.book__image[data-id="${book.id}"]`
    );
    if (bookImage) {
      if (shouldBeHidden) {
        bookImage.classList.add('hidden');
      } else {
        bookImage.classList.remove('hidden');
      }
    }
  }
}

// Funkcja initActions
function initActions() {
  //Referencja do formularza
  const filtersForm = document.querySelector('.filters');
  // Funkcja render
  filtersForm.addEventListener('change', function (event) {
    if (event.target.matches('input[type="checkbox"][name="filter"]')) {
      const filterValue = event.target.value;
      if (event.target.checked && !filters.includes(filterValue)) {
        filters.push(filterValue);
      } else if (!event.target.checked && filters.includes(filterValue)) {
        filters.splice(filters.indexOf(filterValue), 1);
      }

      // Ponowne renderowanie książek na podstawie zmienionych filtrów
      render();
    }
  });

  booksList.addEventListener('dblclick', function (event) {
    event.preventDefault();

    // Sprawdzamy, czy kliknięty element lub jego rodzic ma klasę .book__image
    if (event.target.offsetParent.classList.contains('book__image')) {
      const bookId = event.target.offsetParent.getAttribute('data-id');

      if (favoriteBooks.includes(bookId)) {
        // Usunięcie książki z ulubionych
        favoriteBooks.splice(favoriteBooks.indexOf(bookId), 1);
        event.target.offsetParent.classList.remove('favorite');
      } else {
        // Dodanie książki do ulubionych
        favoriteBooks.push(bookId);
        event.target.offsetParent.classList.add('favorite');
      }
    }
  });
}

render();
initActions();
