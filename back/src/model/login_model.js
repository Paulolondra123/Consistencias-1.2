/*****************conection 1*********************/

/* const {connectToPostgres,disconnectFromPostgres} = require('../config/index')
const bcrypt = require('bcryptjs');

class buscarusers {
    static async getuser(username, password) {
        let pool;
        let response = { data: null, error: null };

        try {
            // Conectarse a la base de datos
            pool = await connectToPostgres();
            if (!pool) {
                throw new Error('Error al conectar con PostgreSQL');
            }
            console.log(username)
            // Consultar la base de datos para obtener el usuario
            const query = `
                SELECT * FROM usuario WHERE usuario = $1
                RETURNING *;
            `;
            // Ejecutar la consulta con parámetros
            const result = await pool.query(query, [
              username,
            ]);
            console.log(result.rows)
            // Verificar si se encontró un usuario
            if (result.rows.length > 0) {
                const user = result.rows[0];
                // Verificar la contraseña
                const passwordMatch = await bcrypt.compare(password, user.contrasena);
                if (!passwordMatch || !user.estado) {
                    response.error = 'Credenciales inválidas';
                } else {
                    response.data = user;
                }
            } else {
                response.error = 'Usuario no encontrado';
            }
        } catch (error) {
            response.error = error.message;
        } finally {
            // Desconectar de la base de datos
            if (pool) {
                await pool.end();
            }
            return response;
        }
    }
}

module.exports = buscarusers */

const { connectToMssql, disconnectFromMssql } = require('../config/index');
const mssql = require('mssql')
const bcrypt = require('bcryptjs');


class buscarusers {
    static async getUsuario(username, password) {
        let pool;
        let response = { data: null, error: null };

        try {
            // Conectarse a la base de datos
            pool = await connectToMssql();
            if (!pool) {
                throw new Error('Error al conectar con SQL Server');
            }
           
            // Consultar la base de datos para obtener el usuario
            const query = `
                SELECT id_usuario, nombres, apellidos, perfil, usuario, contraseña, fecha_registro, estado, distrito
                FROM usuario 
                WHERE usuario = '${username}';
            `;
            // Ejecutar la consulta con parámetros
            const request = pool.request();
            request.input('usuario', mssql.NVarChar, username);
            const result = await request.query(query);
            //console.log(result.recordset);

            // Verificar si se encontró un usuario
            if (result.recordset.length > 0) {
                const usuario = result.recordset[0];
                //console.log(usuario)
                // Verificar la contraseña
                const passwordMatch = await bcrypt.compare(password, usuario.contraseña);
                if (!passwordMatch) {
                    response.error = 'Contraseña incorrecta';
                } else if (!usuario.estado) {
                    response.error = 'Usuario está deshabilitado';
                } else {
                    // Devolver solo los datos necesarios del usuario
                    response.data = {
                        id: usuario.id_usuario,
                        nombres: usuario.nombres,
                        apellidos: usuario.apellidos,
                        usuario: usuario.usuario,
                        perfil: usuario.perfil,
                        distrito: usuario.distrito,
                        fecha_registro: usuario.fecha_registro,
                        estado: usuario.estado,
                    };

                }
            } else {
                response.error = 'Usuario no encontrado';
            }
        } catch (error) {
            response.error = error.message;
        } finally {
            // Desconectar de la base de datos
            if (pool) {
                await disconnectFromMssql(pool);
            }
            return response;
        }
    }
}

module.exports = buscarusers;
