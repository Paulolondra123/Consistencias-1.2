/*****************conection 1*********************/

//consultas para obtener datos de base de la db
const { connectToMssql, disconnectFromMssql } = require('../config/index');
//const { connectToPostgres, disconnectFromPostgres } = require('../config/index');
const bcrypt = require('bcryptjs');
const pg = require('pg');
const mssql = require('mssql');


class Usersmodel {
  // Método para obtener todos los usuarios
  static async getAll() {
    try {
      const pool = await connectToMssql();
      if (!pool) {
        throw new Error('Error al conectar con MSSQL');
      }
      const result = await pool.request().query('SELECT * FROM usuario');
      await disconnectFromMssql(pool);
      //console.log(result.rows) 
      if (result.recordset.length === 0) {
        return { data: null, error: true, message: 'No hay usuarios registrados' };
      }

      //const rows = result.rows.map(row =>  {
      //  return {...row, foto: row.foto? Buffer.from(row.foto).toString('base64') : null}
      //}) 

      //return { data: rows, error: false };

      return { data: result.recordset, error: false };
    } catch (error) {
      // Manejar errores y devolver un mensaje de error
      return { data: null, error: true, message: error.message };
    }
  } 




  // Método para agregar un nuevo usuario
  static async createUser(nombres, apellidos, perfil, distrito, usuario, contraseña) {
    let pool;
    try {
        // Conectar a la base de datos PostgreSQL
        pool = await connectToMssql();
        if (!pool) {
            throw new Error('Error al conectar con MSSQL');
        }

        // Obtener la fecha actual para la fecha de registro
        /* const currentDate = new Date();
        const fecha_registro = currentDate.toISOString(); */
        const currentDate = new Date();
        const fecha_registro = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()} ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;

        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(contraseña, 10);

        // Consulta para insertar un nuevo usuario en la base de datos
        const query = `
            INSERT INTO usuario (nombres, apellidos, perfil, distrito, usuario, contraseña, fecha_registro)
            VALUES ('${nombres}', '${apellidos}', '${perfil}', '${distrito}', '${usuario}', '${hashedPassword}', '${fecha_registro}');
        `;

        // Ejecutar la consulta con parámetros
        const result = await pool.request().query(query);

        console.log('Usuario creado correctamente');
        return true;
    } catch (error) {
        console.error('Error al crear el usuario:', error);
        return false;
    } finally {
        // Desconectar de la base de datos
        if (pool) {
            await disconnectFromMssql(pool);
        }
    }
}





  // Metodo para actualizar el usuario
  static async updateUser(id_usuario, nombres, apellidos, usuario) {
    let pool;
    try {
      // Conectar a la base de datos PostgreSQL
      pool = await connectToMssql();
      if (!pool) {
        throw new Error('Error al conectar con PostgreSQL');
      }
      // Consulta para actualizar un usuario en la base de datos
      const query = `
            UPDATE usuario
            SET nombres = '${nombres}', apellidos = '${apellidos}', usuario = '${usuario}'
            WHERE id_usuario = '${id_usuario}'
          `;

      // Ejecutar la consulta con parámetros
      await pool.request().query(query);

      console.log('Usuario actualizado correctamente');
      return true;
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
      return false;
    } finally {
      // Desconectar de la base de datos
      if (pool) {
        await disconnectFromMssql(pool);
      }
    }
  }





  // Método para cambiar el estado de un usuario
  static async changeState(userId, state) {
    try {
      const pool = await connectToMssql();
      if (!pool) {
        throw new Error('Error al conectar con PostgreSQL');
      }
      //const request = pool.request(); 
      // Actualizar el estado del usuario en la base de datos
      await pool.request().query(`UPDATE usuario SET estado = '${state}' WHERE id_usuario = ${userId}`);
      await disconnectFromMssql(pool);
      return true;
    } catch (error) {
      return false;
    }
  }




  // Método para eliminar usuario de la data base
  static async deleteUser(userId) {
    try {
      const pool = await connectToMssql();
      if (!pool) {
        throw new Error("Error al conectar con MSSQL");
      }

      // Eliminar el usuario de la base de datos
      await pool.query(`DELETE FROM usuario WHERE id_usuario = ${userId}`);

      await disconnectFromMssql();
      return true;
    } catch (error) {
      console.error("Error al eliminar al usuario:", error);
      return false;
    }
  }


// Método para obtener los distritos
static async distrito() {
  try {
    const pool = await connectToMssql();
    if (!pool) {
      throw new Error('Error al conectar con MSSQL');
    }
    const result = await pool.request().query(`
              SELECT cod_dis, RTRIM(cod_dis) + ' - ' + RTRIM(descripcion) AS distrito_descripcion
              FROM B_distrito 
              WHERE CAST(cod_dis AS INT) BETWEEN 700 AND 755
              ORDER BY CAST(cod_dis AS INT) ASC;
    `);
    await disconnectFromMssql(pool);
    //console.log(result.recordset) 
    if (result.recordset.length === 0) {
      return { data: null, error: true, message: 'No hay usuarios registrados' };
    }

    return { data: result.recordset, error: false };
  } catch (error) {
    // Manejar errores y devolver un mensaje de error
    return { data: null, error: true, message: error.message };
  }
} 

























  /* static async getAll() {
    try {
      const pool = await connectToPostgres();
      if (!pool) {
        throw new Error('Error al conectar con PostgreSQL');
      }
      const result = await pool.query('SELECT * FROM usuario');
      await disconnectFromPostgres(pool);
      //console.log(result.rows)
      if (result.rows.length === 0) {
        return { data: null, error: true, message: 'No hay usuarios registrados' };
      }

      //const rows = result.rows.map(row =>  {
      //  return {...row, foto: row.foto? Buffer.from(row.foto).toString('base64') : null}
      //}) 

      //return { data: rows, error: false };

      return { data: result.rows, error: false };
    } catch (error) {
      return { data: null, error: true, message: error.message };
    }
  } */
}


module.exports = Usersmodel