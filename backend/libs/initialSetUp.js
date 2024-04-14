const Role = require('../models/role');
const User = require('../models/user');
/**
 * Crea nuevos roles y los guarda en la base de datos.
 * Esta función solo creará roles si no hay ninguno en la base de datos.
 */
exports.initializeData = async () => {
    try {
        const countRoles = await Role.estimatedDocumentCount();
        if (countRoles === 0) {
            const roles = await Promise.all([
                new Role({ name: 'alumno' }).save(),
                new Role({ name: 'profesor' }).save(),
                new Role({ name: 'admin' }).save()
            ]);
            console.log("Roles creados:", roles);
        }

        // Busca el rol de administrador en la base de datos
        const adminRole = await Role.findOne({ name: 'admin' });
        if (!adminRole) {
            console.error("No se encontró el rol de administrador en la base de datos.");
            return;
        }
        
        // Comprueba si hay usuarios con el rol de administrador
        const countAdminUsers = await User.countDocuments({ roles: adminRole._id });
        if (countAdminUsers === 0) {
            const adminUser = new User({
                username: 'admin',
                password: 'admin123', 
                firstName: 'Admin',
                direccion: 'Admin Address',
                email: 'admin@example.com',
                roles: [adminRole._id] // Asignar el ID del rol de administrador
            });

            // Definir una función result para manejar el resultado
            const result = (data, error) => {
                if (error) {
                    console.error("Error al crear usuario administrador:", error);
                } else {
                    console.log("Usuario administrador creado:", data);
                }
            };

            // Llamar al método create con la función result
            await User.create(adminUser, result);
        } else {
            console.log("El usuario administrador ya existe.");
        }
    } catch (error) {
        console.error("Error al inicializar datos:", error);
    }
};
