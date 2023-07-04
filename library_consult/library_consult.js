// Capturamos el evento de envío del formulario
document.getElementById('container-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Evitamos que se recargue la página

    // Obtenemos los valores del formulario
    let title = document.getElementById('title').value;
    let author = document.getElementById('author').value;

    let category = document.getElementById('category').value;

    // Construimos la URL de búsqueda con los parámetros
    let searchParams = new URLSearchParams();

    if (title.trim() !== '') {
    searchParams.append('title', title);
    }

    if (author.trim() !== '') {
    searchParams.append('author', author);
    }

   // Incluimos el campo "category" 
    searchParams.append('area', category);
    let searchUrl = 'https://laupadron.pythonanywhere.com/api/books?' + searchParams.toString();

    // Realizamos la solicitud GET al servidor para buscar el libro
    fetch(searchUrl)
    .then(function(response) {
        if (response.ok) {
            return response.json(); 
        } else {
            throw new Error('Error al buscar el libro.');
        }
    })
    .then(function(data) {
        
            // Obtenemos el elemento HTML donde deseas mostrar los resultados
    let resultsContainer = document.getElementById('results-container');
    resultsContainer.innerHTML = '';

    // Verificamos si se encontraron libros
    if (data.length > 0) {
        
        let table = document.createElement('table')
        table.classList.add('table', 'table-fixed');

         // Crear encabezados de columna bootstrap
  let thead = document.createElement('thead');
  let headerRow = document.createElement('tr');
  let titleHeader = document.createElement('th');
  titleHeader.textContent = 'Título';
  let authorHeader = document.createElement('th');
  authorHeader.textContent = 'Autor';
  let availabilityHeader = document.createElement('th');
  availabilityHeader.textContent = 'Disponibilidad';

  headerRow.appendChild(titleHeader);
  headerRow.appendChild(authorHeader);
  headerRow.appendChild(availabilityHeader);
  thead.appendChild(headerRow);
  table.appendChild(thead);

  let tbody = document.createElement('tbody');

        data.forEach(function(book) {
            let row = document.createElement('tr');
            let titleCell = document.createElement('td');
            titleCell.style.width = '33%'; 
            titleCell.textContent = book.title;
            let authorCell = document.createElement('td');
            authorCell.style.width = '33%';
            authorCell.textContent = book.author;
            let availabilityCell = document.createElement('td');
            availabilityCell.style.width = '33%';
            availabilityCell.textContent = book.availability;

            row.appendChild(titleCell);
            row.appendChild(authorCell);
            row.appendChild(availabilityCell);

            
            tbody.appendChild(row);
        });
        table.appendChild(tbody);
        resultsContainer.appendChild(table);
        
    } else {
        let noBooksMessage = document.createTextNode('No se encontraron libros.');
        resultsContainer.appendChild(noBooksMessage);
    }
})
.catch(function(error) {
    console.log('Error:', error);
    alert('Error al buscar el libro.');
});
});


