document.addEventListener("DOMContentLoaded", function() {
    const formBuscar = document.getElementById('formBuscar');
    const tablaEmpresas = document.getElementById('tablaEmpresas');
    const inputBuscarNombre = document.getElementById('inputBuscarNombre');

    // Función para cargar opciones desde el servidor y llenar los select
    function cargarOpciones(url, select) {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al cargar opciones');
                }
                return response.json(); // Convertir la respuesta en formato JSON
            })
            .then(data => {
                // Limpiar las opciones anteriores
                select.innerHTML = '';

                // Agregar la opción "Sin Especificar"
                const optionSinEspecificar = document.createElement('option');
                optionSinEspecificar.value = '';
                optionSinEspecificar.text = 'Sin Especificar';
                select.appendChild(optionSinEspecificar);

                // Agregar una opción por defecto
                const optionDefault = document.createElement('option');
                optionDefault.value = '';
                optionDefault.text = 'Seleccionar...';
                optionDefault.disabled = true; // Deshabilitar la opción
                optionDefault.selected = true; // Seleccionar por defecto
                select.appendChild(optionDefault);

                // Agregar las opciones obtenidas
                data.forEach(option => {
                    const optionElement = document.createElement('option');
                    optionElement.value = option;
                    optionElement.text = option;
                    select.appendChild(optionElement);
                });
            })
            .catch(error => console.error('Error al cargar opciones:', error));
    }

    // Función para cargar las empresas al iniciar la página
    function cargarEmpresas() {
        fetch(`/api/v1/empresas/listadoEmpresas`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('No se pudo obtener la lista de empresas');
                }
                return response.json(); // Convertir la respuesta en formato JSON
            })
            .then(empresas => {
                empresas.forEach(empresa => {
                    // Crear una fila para mostrar cada empresa en la tabla
                    const filaEmpresa = document.createElement('tr');
                    filaEmpresa.innerHTML = `
                        <td>${empresa.CIF}</td>
                        <td>${empresa.name}</td>
                        <td>${empresa.city}</td>
                        <td>${empresa.personInCharge}</td>
                        <td>${empresa.area}</td>
                    `;
                    tablaEmpresas.querySelector('tbody').appendChild(filaEmpresa);
                });
            })
            .catch(error => console.error('Error al cargar empresas:', error));
    }

    // Cargar opciones para ciudad al iniciar la página
    cargarOpciones('/api/v1/empresas/citys', document.getElementById('city'));

    // Cargar opciones para familia al iniciar la página
    cargarOpciones('/api/v1/empresas/familys', document.getElementById('family'));

    // Cargar opciones para área al iniciar la página
    cargarOpciones('/api/v1/empresas/areas', document.getElementById('area'));

    // Cargar las empresas al iniciar la página
    cargarEmpresas();

    // Manejar la búsqueda de empresas
    formBuscar.addEventListener('submit', function(event) {
        event.preventDefault(); // Evitar que el formulario se envíe por defecto

        const formData = new FormData(formBuscar);
        const queryParams = new URLSearchParams(formData).toString();

        // Eliminar el parámetro si su valor es "Sin Especificar"
        const queryParamsWithoutSinEspecificar = queryParams.replace(/&\w+=Sin%20Especificar/g, '');

        fetch(`/api/v1/empresas/buscar-empresas?${queryParamsWithoutSinEspecificar}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('No se pudo obtener la lista de empresas');
                }
                return response.json(); // Convertir la respuesta en formato JSON
            })
            .then(empresas => {
                // Limpiar la tabla antes de agregar las nuevas empresas
                tablaEmpresas.querySelector('tbody').innerHTML = '';

                empresas.forEach(empresa => {
                    // Crear una fila de la tabla para cada empresa
                    const fila = document.createElement('tr');
                    fila.innerHTML = `
                        <td>${empresa.CIF}</td>
                        <td>${empresa.name}</td>
                        <td>${empresa.city}</td>
                        <td>${empresa.personInCharge}</td>
                        <td>${empresa.area}</td>
                    `;
                    tablaEmpresas.querySelector('tbody').appendChild(fila);
                });
            })
            .catch(error => console.error('Error al buscar empresas:', error));
    });

    // Manejar la búsqueda por nombre en tiempo real
    inputBuscarNombre.addEventListener('input', function() {
        const searchTerm = inputBuscarNombre.value.trim().toLowerCase();
        const empresas = tablaEmpresas.querySelectorAll('tbody tr');

        empresas.forEach(empresa => {
            const nombreEmpresa = empresa.querySelector('td:nth-child(2)').textContent.toLowerCase();
            if (nombreEmpresa.includes(searchTerm)) {
                empresa.style.display = '';
            } else {
                empresa.style.display = 'none';
            }
        });
    });
});
