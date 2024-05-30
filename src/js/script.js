// Pobieramy referencję do szablonu książki
const bookTemplate = document.getElementById('template-book').innerHTML;

// Pobieramy referencję do listy książek
const booksList = document.querySelector('.books-list');

// Funkcja renderująca książki
function renderBooks() {
  // Przechodzimy przez wszystkie książki w dataSource.books
  dataSource.books.forEach((book) => {
    // Tworzymy HTML na podstawie szablonu i danych o książce
    const html = Handlebars.compile(bookTemplate)(book);

    // Tworzymy element DOM z HTML
    const bookElement = utils.createDOMFromHTML(html);

    // Dodajemy wygenerowany element do listy .books-list
    booksList.appendChild(bookElement);
  });
}

// Wywołujemy funkcję renderBooks, aby wyrenderować książki na stronie
renderBooks();
