
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
// // Obtener el ID del usuario de la cookie 'userId'
// const userId = getUserIdFromCookie("userId");
// console.log("Este es el ID:", userId); // Debugging statement

// // Realizar la solicitud AJAX para obtener el rol del usuario
// if (userId) {
//     fetch(`/api/v1/users/user/${userId}/role`)
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error('No se pudo obtener el rol del usuario');
//             }
//             return response.text(); // Convertir la respuesta en texto
//         })
//         .then(role => {
//             console.log("Este es el rol:", role); // Para depuración
//             // Ocultar el enlace a listado de usuarios si el rol es "alumno"
//             if (role === "alumno") {
//                 const userListLink = document.getElementById('userListLink');
//                 if (userListLink) {
//                     userListLink.style.display = 'none';
//                 }
//             }
//         })
//         .catch(error => console.error('Error al obtener el rol del usuario:', error));
// }
// });