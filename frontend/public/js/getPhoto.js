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
// function getParameterByName(name, url) {
//     if (!url) url = window.location.href;
//     name = name.replace(/[\[\]]/g, '\\$&');
//     var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
//         results = regex.exec(url);
//     if (!results) return null;
//     if (!results[2]) return '';
//     return decodeURIComponent(results[2].replace(/\+/g, ' '));
// }

// // Obtener el ID del usuario de la URL
// const userId = getParameterByName('userId');
// console.log(userId);

// // Obtener el enlace a la página de contacto
// const contactoLink = document.getElementById('contactoLink');

// // Si se encontró el ID del usuario en la URL y existe el enlace a la página de contacto
// if (userId && contactoLink) {
//     // Agregar el ID del usuario al enlace a la página de contacto
//     contactoLink.href += `?userId=${userId}`;
// }


// // Realizar la solicitud AJAX para obtener la imagen del usuario
// fetch(`/api/v1/users/user/${userId}/picture`)
//     .then(response => {
//         if (!response.ok) {
//             throw new Error('No se pudo obtener la imagen del usuario');
//         }
//         return response.blob(); // Convertir la respuesta en un objeto Blob
//     })
//     .then(blob => {
//         // Crear una URL para la imagen Blob
//         const imageUrl = URL.createObjectURL(blob);
//         // Actualizar la fuente de la imagen del usuario con la URL creada
//         document.getElementById('userImage').src = imageUrl;
//     })
//     .catch(error => console.error('Error al obtener la imagen del usuario:', error));




// Función para obtener el valor de una cookie por nombre
// function getUserIdFromCookie(name) {
//     const cookies = document.cookie.split(';');
//     for (let cookie of cookies) {
//         const [cookieName, cookieValue] = cookie.trim().split('=');
//         if (cookieName === name) {
//             return decodeURIComponent(cookieValue);
//         }
//     }
//     return '';
// }

// document.addEventListener('DOMContentLoaded', function() {
//     // Obtener el ID del usuario de la cookie 'userId'
//     const userId = getUserIdFromCookie("userId");
//     console.log("Este es el ID:", userId); 

//     // Realizar la solicitud AJAX para obtener la imagen del usuario si se encontró el ID
//     if (userId) {
//         fetch(`/api/v1/users/user/${userId}/picture`)
//             .then(response => {
//                 if (!response.ok) {
//                     throw new Error('No se pudo obtener la imagen del usuario');
//                 }
//                 return response.blob(); // Convertir la respuesta en un objeto Blob
//             })
//             .then(blob => {
//                 // Crear una URL para la imagen Blob
//                 const imageUrl = URL.createObjectURL(blob);
//                 // Actualizar la fuente de la imagen del usuario con la URL creada
//                 document.getElementById('userImage').src = imageUrl;
//             })
//             .catch(error => console.error('Error al obtener la imagen del usuario:', error));
//     }
// });


// document.addEventListener('DOMContentLoaded', async function() {
//     // Obtener el ID del usuario de la cookie 'userId'
//     const userId = getCookieValue("userId");
//     console.log("Este es el ID:", userId); // Para depuración

//     if (userId) {
//         try {
//             // Realizar la solicitud AJAX para obtener la imagen del usuario
//             const imageResponse = await fetch(`/api/v1/users/user/${userId}/picture`);
//             if (!imageResponse.ok) {
//                 throw new Error('No se pudo obtener la imagen del usuario');
//             }
//             const imageBlob = await imageResponse.blob();
//             const imageUrl = URL.createObjectURL(imageBlob);
//             document.getElementById('userImage').src = imageUrl;

//         } catch (error) {
//             console.error('Error:', error);
//         }
//     }
// });


// // Función para obtener el valor de una cookie por nombre
// function getCookieValue(name) {
//     const cookies = document.cookie.split(';');
//     for (let cookie of cookies) {
//         const [cookieName, cookieValue] = cookie.trim().split('=');
//         if (cookieName === name) {
//             return decodeURIComponent(cookieValue);
//         }
//     }
//     return '';
// }

document.addEventListener('DOMContentLoaded', async function() {
    // Función para obtener el valor de una cookie por nombre
    function getCookieValue(name) {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const [cookieName, cookieValue] = cookie.trim().split('=');
            if (cookieName === name) {
                return decodeURIComponent(cookieValue);
            }
        }
        return '';
    }

    // Obtener el ID del usuario de la cookie 'userId'
    const userId = getCookieValue("userId");
    console.log("Este es el ID:", userId); // Para depuración

    if (userId) {
        try {
            // Realizar la solicitud AJAX para obtener la imagen del usuario
            const imageResponse = await fetch(`/api/v1/users/user/${userId}/picture`);
            if (!imageResponse.ok) {
                throw new Error('No se pudo obtener la imagen del usuario');
            }
            const imageBlob = await imageResponse.blob();
            const imageUrl = URL.createObjectURL(imageBlob);
            document.getElementById('userImage').src = imageUrl;

            // Realizar la solicitud AJAX para obtener el rol del usuario
            const roleResponse = await fetch(`/api/v1/users/user/${userId}/role`);
            if (!roleResponse.ok) {
                throw new Error('No se pudo obtener el rol del usuario');
            }
            const roleData = await roleResponse.json();
            const userRole = roleData.role;
            console.log("Este es el rol:", userRole); // Para depuración

            // Ocultar el enlace a listado de usuarios si el rol es "alumno"
            if (userRole === "alumno") {
                const userListLink = document.getElementById('userListLink');
                const empresasLink = document.getElementById('empresasListLink');
                const vincularLink = document.getElementById('vincularLink');

                
                userListLink.style.display = 'none';
                empresasLink.style.display = 'none';
                vincularLink.style.display = 'none';
                
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
});