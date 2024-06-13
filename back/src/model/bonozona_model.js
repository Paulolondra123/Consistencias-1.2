/*****************conection 1*********************/

//consultas para obtener datos de base de la db
const { connectToMssql, disconnectFromMssql} = require("../config/index");
//const { connectToPostgres, disconnectFromPostgres } = require('../config/index');
const mssql = require('mssql');

class Usersmodel {
  // Método para obtener todas las medidas
  static async getAll(distrito, gestion, mes, coddis) {
    try {
      console
      const pool = await connectToMssql();
      if (!pool) {
        throw new Error("Error al conectar con PostgreSQL");
      }

      let query = '';

    if (coddis) {
      query = `
      select     RDA.cod_rda RDA, (RTRIM(b.carnet)+' - '+RTRIM(b.paterno)+' '+RTRIM(b.materno)+' '+RTRIM(b.nombre1)+' '+RTRIM(b.nombre2)) MAESTRO_A,  (RTRIM(B.Cargo)+' - '+RTRIM(c.Descripcion))CARGO, (RTRIM(substring(b.servicio, 4, 5))+' - '+RTRIM(b.item)) SERVICIO_ITEM
        FROM	 b_planilla b INNER JOIN
              b_rue r on b.cod_ue = r.cod_ue inner join
              b_distrito s on b.cod_dis = s.cod_dis inner join
              b_cargo c on b.cargo=c.cargo inner join 
              B_rda	rda on b.carnet=rda.carnet
        where     (b.gestion = ${gestion}) and (b.mes = ${mes}) AND B.COD_DEP=7 AND B.CARNET<>'00000000' AND B.bonozona>0  AND SUBSTRING(B.servicio, 8, 1) IN (1,2,3,4,5,6,7,8) AND B.COD_UE=${coddis} 
        AND B.COD_DIS=${distrito} ORDER BY B.SERVICIO, B.ITEM
      `;
    } else if (distrito === '700') {
      query = `
      select     (RTRIM(s.cod_dis)+'-'+  RTRIM(s.descripcion))AS DISTRITO,  (RTRIM(r.cod_ue)+'-'+  RTRIM(r.des_ue))AS UNIDAD_EDUCATIVA 
        FROM	 b_planilla b INNER JOIN
              b_rue r on b.cod_ue = r.cod_ue inner join
              b_distrito s on b.cod_dis = s.cod_dis inner join
              b_cargo c on b.cargo=c.cargo
        where     (b.gestion = ${gestion}) and (b.mes = ${mes}) AND B.COD_DEP=7 AND B.CARNET<>'00000000' AND B.bonozona>0  AND SUBSTRING(B.servicio, 8, 1) IN (1,2,3,4,5,6,7,8)  
        GROUP BY s.cod_dis, s.descripcion, r.cod_ue, r.des_ue ORDER BY s.cod_dis, r.cod_ue
      `;
    } else {
      query = `
      select     (RTRIM(s.cod_dis)+'-'+  RTRIM(s.descripcion))AS DISTRITO,  (RTRIM(r.cod_ue)+'-'+  RTRIM(r.des_ue))AS UNIDAD_EDUCATIVA 
        FROM	 b_planilla b INNER JOIN
              b_rue r on b.cod_ue = r.cod_ue inner join
              b_distrito s on b.cod_dis = s.cod_dis inner join
              b_cargo c on b.cargo=c.cargo
        where     (b.gestion = ${gestion}) and (b.mes = ${mes}) AND B.COD_DEP=7 AND B.CARNET<>'00000000' AND B.bonozona>0  AND SUBSTRING(B.servicio, 8, 1) IN (1,2,3,4,5,6,7,8) AND B.COD_DIS=${distrito} 
        GROUP BY s.cod_dis, s.descripcion, r.cod_ue, r.des_ue ORDER BY s.cod_dis, r.cod_ue
        
      `;
    }

      const result = await pool.request().query(query);
      await disconnectFromMssql(pool);
      console.log(result.recordset) 
      if (result.recordset.length === 0) {
        return {
          data: null,
          error: true,
          message: "No hay registros",
        };
      }
      return { data: result.recordset, error: false };
    } catch (error) {
      return { data: null, error: true, message: error.message };
    }
  }

  // Método para obtener los distritos
  static async gestion() {
    try {
      const pool = await connectToMssql();
      if (!pool) {
        throw new Error('Error al conectar con MSSQL');
      }
      
      const result = await pool.request().query(`
                select gestion from b_planilla 
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

}

module.exports = Usersmodel;
