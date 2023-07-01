document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
  
    // Agregar un evento de envío al formulario
    loginForm.addEventListener('submit', function(event) {
      event.preventDefault(); // Evitar que el formulario se envíe automáticamente
  
      // Obtener los valores de los campos de entrada
      let name = document.getElementById('username').value;
      let password = document.getElementById('password').value;
  
      // Realizar una solicitud POST a la API de inicio de sesión
      fetch('https://laupadron.pythonanywhere.com/api/login', {
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
        
        // Verificamos la respuesta de la API
        if (data.message === 'Inicio de sesión exitoso') {
          // Almacenamos el token en el Local Storage
          localStorage.setItem('token', data.token);
          console.log(localStorage.getItem('token'))
          // Redireccionamos al formulario de agregar libros
          window.location.replace('./add_delete_book.html'); 
        } else {
          
          window.location.href = '../library_consult.html'
          
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
    });
    

  });
  