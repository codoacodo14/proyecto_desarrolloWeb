// Capturamos el evento de envío del formulario
document.getElementById('container-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Evitamos que se recargue la página

    // Obtenemos los valores del formulario
    var title = document.getElementById('title').value;
    var author = document.getElementById('author').value;

    var category = document.getElementById('category').value;

    // Construimos la URL de búsqueda con los parámetros
    var searchParams = new URLSearchParams();

    if (title.trim() !== '') {
    searchParams.append('titulo', title);
    }

    if (author.trim() !== '') {
    searchParams.append('autor', author);
    }

   // Incluir el campo "category" sin validación
    searchParams.append('area', category);
    var searchUrl = 'http://127.0.0.1:4000/api/libros?' + searchParams.toString();

    // Realizamos la solicitud GET al servidor para buscar el libro
    fetch(searchUrl)
    .then(function(response) {
        if (response.ok) {
            return response.json(); // Parseamos la respuesta JSON
        } else {
            throw new Error('Error al buscar el libro.');
        }
    })
    .then(function(data) {
        // Aquí puedes manejar la respuesta de la API según tus necesidades
        console.log(data)
            // Obtener el elemento HTML donde deseas mostrar los resultados
    var resultsContainer = document.getElementById('results-container');

 // Limpiar el contenido existente en el contenedor
    resultsContainer.innerHTML = '';

    // Verificar si se encontraron libros
    if (data.length > 0) {
        // Crear una lista para mostrar los libros
        var ul = document.createElement('ul');

        // Iterar sobre cada libro en los datos
        data.forEach(function(book) {
            // Crear un elemento de lista para cada libro
            var li = document.createElement('li');
            // Crear un contenido para mostrar los detalles del libro
            var bookDetails = document.createTextNode('Título: ' + book.titulo + ', Autor: ' + book.autor +', disponibilidad: ' + book.disponibilidad + ', area: ' + book.area);
            // Agregar el contenido al elemento de lista
            li.appendChild(bookDetails);

            // Agregar el elemento de lista a la lista
            ul.appendChild(li);
        });

        // Agregar la lista al contenedor de resultados
        resultsContainer.appendChild(ul);
    } else {
        // Mostrar un mensaje si no se encontraron libros
        var noBooksMessage = document.createTextNode('No se encontraron libros.');
        resultsContainer.appendChild(noBooksMessage);
    }
})
.catch(function(error) {
    console.log('Error:', error);
    alert('Error al buscar el libro.');
});
});


