// Obtener la referencia al dropdown y a la imagen del usuario
const userDropdown = document.getElementById('userDropdown');
const userImage = document.getElementById('userImage');

// Manejar el evento de clic en la imagen del usuario
userImage.addEventListener('click', function() {
    // Alternar la clase 'active' del dropdown para mostrarlo u ocultarlo
    userDropdown.classList.toggle('active');
});

// Ocultar el dropdown cuando se hace clic fuera de él
document.addEventListener('click', function(event) {
    if (!userImage.contains(event.target) && !userDropdown.contains(event.target)) {
        userDropdown.classList.remove('active');
    }
});

// Función para obtener el valor de un parámetro de la URL
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

// Obtener el ID del usuario de la URL
const userId = getParameterByName('userId');
console.log(userId);

// Obtener el enlace a la página de contacto
const contactoLink = document.getElementById('contactoLink');

// Si se encontró el ID del usuario en la URL y existe el enlace a la página de contacto
if (userId && contactoLink) {
    // Agregar el ID del usuario al enlace a la página de contacto
    contactoLink.href += `?userId=${userId}`;
}

// Realizar la solicitud AJAX para obtener la imagen del usuario
fetch(`/api/v1/users/user/${userId}/picture`)
    .then(response => {
        if (!response.ok) {
            throw new Error('No se pudo obtener la imagen del usuario');
        }
        return response.blob(); // Convertir la respuesta en un objeto Blob
    })
    .then(blob => {
        // Crear una URL para la imagen Blob
        const imageUrl = URL.createObjectURL(blob);
        // Actualizar la fuente de la imagen del usuario con la URL creada
        document.getElementById('userImage').src = imageUrl;
    })
    .catch(error => console.error('Error al obtener la imagen del usuario:', error));