class BooksList {
  constructor() {
    const thisBooksList = this;
    thisBooksList.filters = [];
    thisBooksList.favoriteBooks = [];
    thisBooksList.initData();
    thisBooksList.getElements();
    thisBooksList.render();
    thisBooksList.initActions();
  }

  initData() {
    const thisBooksList = this;
    thisBooksList.data = dataSource.books;
  }

  getElements() {
    const thisBooksList = this;
    thisBooksList.bookTemplate =
      document.getElementById('template-book').innerHTML;
    thisBooksList.booksList = document.querySelector('.books-list');
    thisBooksList.filtersForm = document.querySelector('.filters');
  }

  initActions() {
    const thisBooksList = this;

    thisBooksList.filtersForm.addEventListener('change', function (event) {
      if (event.target.matches('input[type="checkbox"][name="filter"]')) {
        const filterValue = event.target.value;
        if (
          event.target.checked &&
          !thisBooksList.filters.includes(filterValue)
        ) {
          thisBooksList.filters.push(filterValue);
        } else if (
          !event.target.checked &&
          thisBooksList.filters.includes(filterValue)
        ) {
          thisBooksList.filters.splice(
            thisBooksList.filters.indexOf(filterValue),
            1
          );
        }

        thisBooksList.filterBooks();
      }
    });

    thisBooksList.booksList.addEventListener('dblclick', function (event) {
      event.preventDefault();

      // Sprawdzamy, czy kliknięty element lub jego rodzic ma klasę .book__image
      if (event.target.offsetParent.classList.contains('book__image')) {
        const bookId = event.target.offsetParent.getAttribute('data-id');

        if (thisBooksList.favoriteBooks.includes(bookId)) {
          // Usunięcie książki z ulubionych
          thisBooksList.favoriteBooks.splice(
            thisBooksList.favoriteBooks.indexOf(bookId),
            1
          );
          event.target.offsetParent.classList.remove('favorite');
        } else {
          // Dodanie książki do ulubionych
          thisBooksList.favoriteBooks.push(bookId);
          event.target.offsetParent.classList.add('favorite');
        }
      }
    });
  }

  render() {
    const thisBooksList = this;

    thisBooksList.booksList.innerHTML = '';
    const compiledTemplate = Handlebars.compile(thisBooksList.bookTemplate);

    for (const book of thisBooksList.data) {
      const ratingBgc = thisBooksList.determineRatingBgc(book.rating);
      const ratingWidth = book.rating * 10;

      const generatedHTML = compiledTemplate({
        ...book,
        ratingBgc: ratingBgc,
        ratingWidth: ratingWidth,
      });

      const bookElement = utils.createDOMFromHTML(generatedHTML);

      thisBooksList.booksList.appendChild(bookElement);
    }
    thisBooksList.filterBooks();
  }

  // Funkcja filterBooks
  filterBooks() {
    const thisBooksList = this;
    for (const book of thisBooksList.data) {
      let shouldBeHidden = false;

      // Sprawdzamy każdy filtr
      for (const filter of thisBooksList.filters) {
        if (!book.details[filter]) {
          shouldBeHidden = true;
          break;
        }
      }

      // Znajdujemy element .book__image i dodajemy lub usuwamy klasę hidden
      const bookImage = thisBooksList.booksList.querySelector(
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

  determineRatingBgc(rating) {
    const thisBooksList = this;

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
}

const app = new BooksList();
