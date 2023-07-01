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
        
        let ul = document.createElement('ul');

        data.forEach(function(book) {
            // Creamos un elemento de lista para cada libro
            let li = document.createElement('li');
            // Creamos un contenido para mostrar los detalles del libro
            let bookDetails = document.createTextNode('Título: ' + book.title + ', Autor: ' + book.author +', disponibilidad: ' + book.availability + ', area: ' + book.area);
            // Agregamos el contenido al elemento de lista
            li.appendChild(bookDetails);
            // Agregamos el elemento de lista a la lista
            ul.appendChild(li);
        });

        // Agregamos la lista al contenedor de resultados
        resultsContainer.appendChild(ul);
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


