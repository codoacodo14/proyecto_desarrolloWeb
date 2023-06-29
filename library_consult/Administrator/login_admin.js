document.addEventListener('DOMContentLoaded', function() {
    // Obtener el formulario de inicio de sesión por su id
    const loginForm = document.getElementById('loginForm');
  
    // Agregar un evento de envío al formulario
    loginForm.addEventListener('submit', function(event) {
      event.preventDefault(); // Evitar que el formulario se envíe automáticamente
  
      // Obtener los valores de los campos de entrada
      const name = document.getElementById('username').value;
      const password = document.getElementById('password').value;
  
      // Realizar una solicitud POST a la API de inicio de sesión
      fetch('http://127.0.0.1:4000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          password: password
        })
      })
      .then(response => response.json())
      .then(data => {
        
        
        // Verificar la respuesta de la API
        if (data.message === 'Inicio de sesión exitoso') {
          // Almacenar el token en el Local Storage
          localStorage.setItem('token', data.token);
          console.log(localStorage.getItem('token'))
          // Redireccionar al formulario de agregar libros
          
          window.location.replace('./add_delete_book.html'); // Reemplaza '/agregar-libros' con la ruta deseada

        } else {
          // Redireccionar a la página anterior (inicio de sesión fallido)
          window.location.href = '../library_consult.html'
          
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
    });
    

  });
  