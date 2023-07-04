//protejo la pagina

function isUserLoggedIn() {
  const token = localStorage.getItem('token');
  return !!token; // Devuelve true si el token existe y false si no existe
}

if (isUserLoggedIn()) {
  // Mostrar el contenido oculto
  const content = document.getElementById('content');
  content.classList.remove('hidden');
}

//add books
document.addEventListener('DOMContentLoaded', function() {
    const bookForm = document.getElementById('book-form');
      bookForm.addEventListener('submit', function(event) {
        event.preventDefault(); 

        // Obtener los valores de los campos de entrada
        const author = document.getElementById('author').value;
        const title = document.getElementById('title').value;
        const editorial = document.getElementById('editorial').value;
        const availability = document.getElementById('availability').value
        const area = document.getElementById('area').value;

        // Crear objeto del libro
        let book = {
            author: author,
            title: title,
            editorial: editorial,
            availability: availability,
            area: area
        };
        // Obtenemos el token de autorización del Local Storage
        const token = localStorage.getItem('token');

        // Realizamos solicitud POST al endpoint /api/libros
        fetch('https://laupadron.pythonanywhere.com/api/books', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(book)
        })
        .then(function(response) {
            if (response.status === 200 || response.status === 201) {
                
                return response.json();
            } else {
                
                throw new Error('Error al agregar el libro');
            }
        })
        .then(function(data) {
            
            alert('Libro agregado exitosamente');
            
            bookForm.reset();
        })
        .catch(function(error) {
            
            alert('Error: ' + error.message);
        });
    });
    
});


//get books para la lista con botones de update y eliminar
document.addEventListener('DOMContentLoaded', function() {
    let searchForm = document.getElementById('search_form');
    let resultsContainer = document.getElementById('book-info-container');
    
    searchForm.addEventListener('submit', function(event) {
      event.preventDefault(); 
  
      let bookName = document.getElementById('book-name').value;
      let bookAuthor = document.getElementById('book-author').value;
  
      // Construir la URL de búsqueda con los parámetros
      var searchParams = new URLSearchParams();
      if (bookName.trim() !== '') {
        searchParams.append('title', bookName);
      }
      if (bookAuthor.trim() !== '') {
        searchParams.append('author', bookAuthor);
      }
      let searchUrl = 'https://laupadron.pythonanywhere.com/api/books?' + searchParams.toString();
  
      // Realizar la solicitud GET al servidor para buscar el libro
      fetch(searchUrl)
        .then(function(response) {
          if (response.ok) {
            return response.json(); 
          } else {
            throw new Error('Error al buscar el libro.');
          }
        })
        .then(function(data) {
          
          resultsContainer.innerHTML = ''; 
          
            if (data.length > 0) {
            let table = document.createElement('table');
            table.classList.add('table', 'table-fixed'); // Agregar clases Bootstrap 'table' y 'table-fixed' a la tabla
          
            // Crear encabezados de columna
            let thead = document.createElement('thead');
            let headerRow = document.createElement('tr');
            let idHeader = document.createElement('th');
            idHeader.textContent = 'ID';
            let titleHeader = document.createElement('th');
            titleHeader.textContent = 'Título';
            let authorHeader = document.createElement('th');
            authorHeader.textContent = 'Autor';
            let availabilityHeader = document.createElement('th');
            availabilityHeader.textContent = 'Disponibilidad';
            let areaHeader = document.createElement('th');
            areaHeader.textContent = 'Área';
            let actionsHeader = document.createElement('th');
            actionsHeader.textContent = 'Acciones';
          
            headerRow.appendChild(idHeader);
            headerRow.appendChild(titleHeader);
            headerRow.appendChild(authorHeader);
            headerRow.appendChild(availabilityHeader);
            headerRow.appendChild(areaHeader);
            headerRow.appendChild(actionsHeader);
            thead.appendChild(headerRow);
            table.appendChild(thead);
          
            let tbody = document.createElement('tbody');
          
            data.forEach(function (book) {
              let row = document.createElement('tr');
              
              let idCell = document.createElement('td');
              idCell.style.width = '10%'; // Establecer ancho igual para cada celda de la columna de ID
              idCell.textContent = book.id;
              
              let titleCell = document.createElement('td');
              titleCell.style.width = '20%'; // Establecer ancho igual para cada celda de la columna de título
              titleCell.textContent = book.title;
              
              let authorCell = document.createElement('td');
              authorCell.style.width = '20%'; // Establecer ancho igual para cada celda de la columna de autor
              authorCell.textContent = book.author;
              
              let availabilityCell = document.createElement('td');
              availabilityCell.style.width = '15%'; // Establecer ancho igual para cada celda de la columna de disponibilidad
              availabilityCell.textContent = book.availability;
              
              let areaCell = document.createElement('td');
              areaCell.style.width = '15%'; // Establecer ancho igual para cada celda de la columna de área
              areaCell.textContent = book.area;
              
              let actionsCell = document.createElement('td');
              actionsCell.style.width = '20%'; // Establecer ancho igual para cada celda de la columna de acciones
              
              let updateButton = document.createElement('button');
              updateButton.textContent = 'Actualizar libro';
              updateButton.classList.add('btn', 'btn-custom-pink', 'mr-2');
              updateButton.addEventListener('click', function() {
                showUpdateForm = true;
                bookIdToUpdate = book.id; 
                renderBooks();
              });
              
              let deleteButton = document.createElement('button');
              deleteButton.textContent = 'Eliminar libro';
              deleteButton.classList.add('btn', 'btn-custom-pink');
              deleteButton.addEventListener('click', function() {
                deleteBook(book.id);
              });
              
              actionsCell.appendChild(updateButton);
              actionsCell.appendChild(deleteButton);
              
              row.appendChild(idCell);
              row.appendChild(titleCell);
              row.appendChild(authorCell);
              row.appendChild(availabilityCell);
              row.appendChild(areaCell);
              row.appendChild(actionsCell);
              
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
  
      // Limpiar los campos del formulario después de realizar la búsqueda
      document.getElementById('book-name').value = '';
      document.getElementById('book-author').value = '';
    });

    let showUpdateForm = false;


    //delete book
    function deleteBook(bookId) {
      
      let deleteUrl = 'https://laupadron.pythonanywhere.com/api/books/' + bookId;
        // Obtener el token de autorización del Local Storage
        const token = localStorage.getItem('token');
        
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
          alert('Libro eliminado correctamente');
          /// Eliminar visualmente la fila correspondiente en la tabla
          let listItemToDelete = document.querySelector(`li[data-book-id="${bookId}"]`);
          
          if (listItemToDelete) {
            listItemToDelete.remove();
          }
        
          })
        .catch(function(error) {
          console.log('Error:', error);
          alert('Error al eliminar el libro.');
        });
        
    }

    //update book
    function updateBook(bookId) {

     
        
        let updatedTitle = document.getElementById('update-title').value;
        let updatedAuthor = document.getElementById('update-author').value;
        let updatedEditorial = document.getElementById('update-editorial').value;
        let updatedAvaila = document.getElementById('update-availability').value;
        let updatedArea = document.getElementById('update-area').value;
        
        let updatedData = {};
        
      
        // Verificar y agregar campos opcionales solo si se proporciona un valor
        if (updatedTitle.trim() !== '') {
          updatedData.title = updatedTitle;
        }
        if (updatedAuthor.trim() !== '') {
          updatedData.autor = updatedAuthor;
        }
        if (updatedEditorial.trim() !== '') {
          updatedData.editorial = updatedEditorial;
        }
        if (updatedAvaila.trim() !== '') {
            updatedData.editorial = updatedAvaila;
          }
        if (updatedArea.trim() !== '') {
          updatedData.area = updatedArea;
        }
        let updateUrl = 'https://laupadron.pythonanywhere.com/api/books/' + bookId;
        const token = localStorage.getItem('token');
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
            alert('se actualizó correctamente la base de datos')
          })
          .catch(function(error) {
            console.log('Error:', error);
            alert('Error al actualizar el libro.');
          });
      }
      
      
    function renderBooks() {

      let updateForm = document.createElement('form');
      updateForm.setAttribute('id', 'update_form');

        if (showUpdateForm) {
          resultsContainer.innerHTML = '';
      
          let titleLabel = document.createElement('label');
          titleLabel.textContent = 'Título:';
          let titleInput = document.createElement('input');
          titleInput.setAttribute('type', 'text');
          titleInput.setAttribute('id', 'update-title');
          updateForm.appendChild(titleLabel);
          updateForm.appendChild(titleInput);
      
          let authorLabel = document.createElement('label');
          authorLabel.textContent = 'Autor:';
          let authorInput = document.createElement('input');
          authorInput.setAttribute('type', 'text');
          authorInput.setAttribute('id', 'update-author');
          updateForm.appendChild(authorLabel);
          updateForm.appendChild(authorInput);
      
          let publisherLabel = document.createElement('label');
          publisherLabel.textContent = 'Editorial:';
          let publisherInput = document.createElement('input');
          publisherInput.setAttribute('type', 'text');
          publisherInput.setAttribute('id', 'update-editorial');
          updateForm.appendChild(publisherLabel);
          updateForm.appendChild(publisherInput);

          let dispoLabel = document.createElement('label');
          dispoLabel.textContent = 'Disponibilidad:';
          let dispoInput = document.createElement('input');
          dispoInput.setAttribute('type', 'text');
          dispoInput.setAttribute('id', 'update-availability');
          updateForm.appendChild(dispoLabel);
          updateForm.appendChild(dispoInput);
      
          let areaLabel = document.createElement('label');
          areaLabel.textContent = 'Área:';
          let areaInput = document.createElement('input');
          areaInput.setAttribute('type', 'text');
          areaInput.setAttribute('id', 'update-area');
          updateForm.appendChild(areaLabel);
          updateForm.appendChild(areaInput);
      
          let submitButton = document.createElement('button');
          submitButton.textContent = 'Actualizar';
          updateForm.appendChild(submitButton);

          let deleteButton = document.createElement('button');
        deleteButton.textContent = 'Eliminar libro';
        deleteButton.addEventListener('click', function() {
        deleteBook(bookIdToUpdate);
          });

        updateForm.appendChild(deleteButton);
      
          updateForm.addEventListener('submit', function(event) {
            event.preventDefault();
      
            let updatedData = {
              title: titleInput.value,
              author: authorInput.value,
              editorial: publisherInput.value,
              availability: dispoInput.value,
              area: areaInput.value
            };
      
            updateBook(bookIdToUpdate, updatedData);
          });
          
          
      
          resultsContainer.appendChild(updateForm);
        } else {
          
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
  