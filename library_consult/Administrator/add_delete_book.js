document.addEventListener('DOMContentLoaded', function() {
    // Obtener el formulario de agregar libro por su id
    const bookForm = document.getElementById('book-form');

    // Agregar un evento de envío al formulario
    bookForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Evitar que el formulario se envíe automáticamente

        // Obtener los valores de los campos de entrada
        const autor = document.getElementById('autor').value;
        const titulo = document.getElementById('titulo').value;
        const editorial = document.getElementById('editorial').value;
        const disponibilidad = document.getElementById('disponibilidad').value
        const area = document.getElementById('area').value;

        // Crear objeto del libro
        const libro = {
            autor: autor,
            titulo: titulo,
            editorial: editorial,
            disponibilidad: disponibilidad,
            area: area
        };
        // Obtener el token de autorización del Local Storage
        const token = localStorage.getItem('token');

        // Realizar solicitud POST al endpoint /api/libros
        fetch('http://127.0.0.1:4000/api/libros', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token// Obtener token del Local Storage
            },
            body: JSON.stringify(libro)
        })
        .then(function(response) {
            if (response.status === 200 || response.status === 201) {
                // Libro agregado exitosamente
                return response.json();
            } else {
                // Error al agregar el libro
                throw new Error('Error al agregar el libro');
            }
        })
        .then(function(data) {
            // Mostrar mensaje de éxito
            alert('Libro agregado exitosamente');
            // Restablecer campos del formulario
            bookForm.reset();
        })
        .catch(function(error) {
            // Mostrar mensaje de error
            alert('Error: ' + error.message);
        });
    });
    
});



document.addEventListener('DOMContentLoaded', function() {
    var searchForm = document.getElementById('search_form');
    var resultsContainer = document.getElementById('book-info-container');
  
    searchForm.addEventListener('submit', function(event) {
      event.preventDefault(); // Evitar que el formulario se envíe automáticamente
  
      var libroNombre = document.getElementById('libro-nombre').value;
      var libroAutor = document.getElementById('libro-autor').value;
  
      // Construir la URL de búsqueda con los parámetros
      var searchParams = new URLSearchParams();
      if (libroNombre.trim() !== '') {
        searchParams.append('titulo', libroNombre);
      }
      if (libroAutor.trim() !== '') {
        searchParams.append('autor', libroAutor);
      }
      var searchUrl = 'http://127.0.0.1:4000/api/libros?' + searchParams.toString();
  
      // Realizar la solicitud GET al servidor para buscar el libro
      fetch(searchUrl)
        .then(function(response) {
          if (response.ok) {
            return response.json(); // Parsear la respuesta JSON
          } else {
            throw new Error('Error al buscar el libro.');
          }
        })
        .then(function(data) {
          resultsContainer.innerHTML = ''; // Limpiar el contenido existente
  
          if (data.length > 0) {
            var ul = document.createElement('ul');
  
            data.forEach(function(book) {
              var li = document.createElement('li');
              var bookDetails = document.createTextNode('Título: ' + book.titulo + ', Autor: ' + book.autor + ', disponibilidad: ' + book.disponibilidad + ', Área: ' + book.area);
              li.appendChild(bookDetails);
  
              var updateButton = document.createElement('button');
              updateButton.textContent = 'Actualizar libro';
            updateButton.addEventListener('click', function() {
              showUpdateForm = true;
              libroIdToUpdate = book.id; // Almacena el ID del libro a actualizar
              renderBooks();
            });
  
              var deleteButton = document.createElement('button');
              deleteButton.textContent = 'Eliminar libro';
              deleteButton.addEventListener('click', function() {
                eliminarLibro(book.id);
              });
  
              li.appendChild(updateButton);
              li.appendChild(deleteButton);
              ul.appendChild(li);
            });
  
            resultsContainer.appendChild(ul);
          } else {
            var noBooksMessage = document.createTextNode('No se encontraron libros.');
            resultsContainer.appendChild(noBooksMessage);
          }
        })
        .catch(function(error) {
          console.log('Error:', error);
          alert('Error al buscar el libro.');
        });
  
      // Limpiar los campos del formulario después de realizar la búsqueda
      document.getElementById('libro-nombre').value = '';
      document.getElementById('libro-autor').value = '';
    });
  
    function eliminarLibro(libroId) {
      var deleteUrl = 'http://127.0.0.1:4000/api/libros/' + libroId;
        // Obtener el token de autorización del Local Storage
        const token = localStorage.getItem('token');
        console.log(token)
      fetch(deleteUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        }
      })
        .then(function(response) {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Error al eliminar el libro.');
          }
        })
        .then(function(data) {
          console.log(data);
          // Mostrar mensaje de éxito o realizar acciones adicionales si es necesario
        })
        .catch(function(error) {
          console.log('Error:', error);
          alert('Error al eliminar el libro.');
        });
    }
    function actualizarLibro(libroId) {
        var updateUrl = 'http://127.0.0.1:4000/api/libros/' + libroId;
        const token = localStorage.getItem('token');
      
        // Obtener los valores de los campos del formulario
        var updatedTitulo = document.getElementById('update-titulo').value;
        var updatedAutor = document.getElementById('update-autor').value;
        var updatedEditorial = document.getElementById('update-editorial').value;
        var updatedDispo = document.getElementById('update-disponibilidad').value;
        var updatedArea = document.getElementById('update-area').value;
      
        // Crear un objeto con los datos actualizados del libro
        var updatedData = {};
      
        // Verificar y agregar campos opcionales solo si se proporciona un valor
        if (updatedTitulo.trim() !== '') {
          updatedData.titulo = updatedTitulo;
        }
        if (updatedAutor.trim() !== '') {
          updatedData.autor = updatedAutor;
        }
        if (updatedEditorial.trim() !== '') {
          updatedData.editorial = updatedEditorial;
        }
        if (updatedDispo.trim() !== '') {
            updatedData.editorial = updatedDispo;
          }
        if (updatedArea.trim() !== '') {
          updatedData.area = updatedArea;
        }
      
        fetch(updateUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          },
          body: JSON.stringify(updatedData)
        })
          .then(function(response) {
            if (response.ok) {
              return response.json();
            } else {
              throw new Error('Error al actualizar el libro.');
            }
          })
          .then(function(data) {
            console.log(data);
            // Mostrar mensaje de éxito o realizar acciones adicionales si es necesario
          })
          .catch(function(error) {
            console.log('Error:', error);
            alert('Error al actualizar el libro.');
          });
      }
      
      
    function renderBooks() {
        if (showUpdateForm) {
          resultsContainer.innerHTML = '';
      
          var updateForm = document.createElement('form');
      
          var titleLabel = document.createElement('label');
          titleLabel.textContent = 'Título:';
          var titleInput = document.createElement('input');
          titleInput.setAttribute('type', 'text');
          titleInput.setAttribute('id', 'update-titulo');
          updateForm.appendChild(titleLabel);
          updateForm.appendChild(titleInput);
      
          var authorLabel = document.createElement('label');
          authorLabel.textContent = 'Autor:';
          var authorInput = document.createElement('input');
          authorInput.setAttribute('type', 'text');
          authorInput.setAttribute('id', 'update-autor');
          updateForm.appendChild(authorLabel);
          updateForm.appendChild(authorInput);
      
          var publisherLabel = document.createElement('label');
          publisherLabel.textContent = 'Editorial:';
          var publisherInput = document.createElement('input');
          publisherInput.setAttribute('type', 'text');
          publisherInput.setAttribute('id', 'update-editorial');
          updateForm.appendChild(publisherLabel);
          updateForm.appendChild(publisherInput);

          var dispoLabel = document.createElement('label');
          dispoLabel.textContent = 'Disponibilidad:';
          var dispoInput = document.createElement('input');
          dispoInput.setAttribute('type', 'text');
          dispoInput.setAttribute('id', 'update-disponibilidad');
          updateForm.appendChild(dispoLabel);
          updateForm.appendChild(dispoInput);
      
          var areaLabel = document.createElement('label');
          areaLabel.textContent = 'Área:';
          var areaInput = document.createElement('input');
          areaInput.setAttribute('type', 'text');
          areaInput.setAttribute('id', 'update-area');
          updateForm.appendChild(areaLabel);
          updateForm.appendChild(areaInput);
      
          var submitButton = document.createElement('button');
          submitButton.textContent = 'Actualizar';
          updateForm.appendChild(submitButton);
      
          updateForm.addEventListener('submit', function(event) {
            event.preventDefault();
      
            var updatedData = {
              titulo: titleInput.value,
              autor: authorInput.value,
              editorial: publisherInput.value,
              disponibilidad: dispoInput.value,
              area: areaInput.value
            };
      
            actualizarLibro(libroIdToUpdate, updatedData);
          });
      
          resultsContainer.appendChild(updateForm);
        } else {
          // Resto del código para mostrar los libros y los botones de actualización y eliminación
        }
      }
      
})

//cerrar sesion
document.getElementById('close_session').addEventListener('click', function() {
    // Eliminar el token de autenticación del Local Storage
    localStorage.removeItem('token');
    
    // Redirigir a la página library_consult
    window.location.href = '../library_consult.html';
  });
  