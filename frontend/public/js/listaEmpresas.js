// Hacer una solicitud AJAX para obtener todas las empresas
fetch('/api/v1/empresas/listadoEmpresas/')
.then(response => {
    if (!response.ok) {
        throw new Error('No se pudo obtener la lista de empresas');
    }
    return response.json(); // Convertir la respuesta en formato JSON
})
.then(empresas => {
    const listaEmpresas = document.getElementById('contenedorEmpresas');
    empresas.forEach(empresa => {
        // Crear un elemento de lista para cada empresa
        const li = document.createElement('li');
        li.innerHTML = `<strong>${empresa.name}</strong> - ${empresa.city}, ${empresa.address}`;
        listaEmpresas.appendChild(li);
    });
})
.catch(error => console.error('Error al obtener la lista de empresas:', error));