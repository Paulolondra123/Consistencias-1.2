/*****************conection 1*********************/

//consultas para obtener datos de base de la db
const { connectToMssql, disconnectFromMssql} = require("../config/index");
//const { connectToPostgres, disconnectFromPostgres } = require('../config/index');
const mssql = require('mssql');

class Usersmodel {
  // Método para obtener todas las medidas
  static async getAll(carnet, queryType) {
    try {
      
      const pool = await connectToMssql();
      if (!pool) {
        throw new Error("Error al conectar con PostgreSQL");
      }

      let query = '';
      //`SELECT gestion,mes,cod_dis, servicio,item,horas FROM B_planilla WHERE CARNET='${carnet}' and gestion=2022 and mes=12 ORDER BY GESTION,MES,SERVICIO,ITEM`
      if (queryType === 'first') {
        query = `
          SELECT gestion, mes, cod_dis, servicio, item, horas 
          FROM B_planilla 
          WHERE GESTION = 2023 AND CARNET = '${carnet}'
          UNION
          SELECT gestion, mes, cod_dis, servicio, item, horas 
          FROM B_planilla 
          WHERE CARNET = '${carnet}' AND gestion = 2022 AND mes = 12 
          ORDER BY gestion, mes, servicio, item
        `;
      } else if (queryType === 'second') {
        query = `
          SELECT B.GESTION, 
                 (RTRIM(B.cod_dis) + ' - ' + RTRIM(S.descripcion)) AS DISTRITO, 
                 (RTRIM(B.CARNET) + ' - ' + RTRIM(B.PATERNO) + ' ' + RTRIM(B.MATERNO) + ' ' + RTRIM(B.nombre1) + ' ' + RTRIM(B.nombre2)) AS MAESTRO_A, 
                 B.CARGO, B.servicio, B.item, B.horapr, 
                 COUNT(B.horapr) AS CANTIDAD_MESES
          FROM b_planilla B
          INNER JOIN b_rue R ON B.cod_ue = R.cod_ue
          INNER JOIN b_distrito S ON B.cod_dis = S.cod_dis
          WHERE SUBSTRING(B.servicio, 7, 1) IN (2, 3) AND B.carnet = '${carnet}'
          GROUP BY B.GESTION, B.cod_dis, S.descripcion, B.CARNET, B.PATERNO, B.MATERNO, B.nombre1, B.nombre2, B.CARGO, B.servicio, B.item, B.horapr
          ORDER BY B.GESTION, B.cod_dis, B.CARGO, B.servicio, B.item
        `;
      } else if (queryType === 'tercer') {
        query = `
        SELECT 
            rda.cod_rda,
            (RTRIM(RDA.carnet) + ' - ' + RTRIM(rda.paterno) + ' ' + RTRIM(rda.materno) + ' ' + RTRIM(rda.nombre1)) AS MAESTRO_A,
            rda.nombre2,
            ANIOS.NUM_DOC,
            ANIOS.FRONTERA,
            (RTRIM(ANIOS.DESDE_ANIO) + ' - ' + RTRIM(ANIOS.DESDE_MES)) AS DESDE,
            (RTRIM(ANIOS.HASTA_ANIO) + ' - ' + RTRIM(ANIOS.HASTA_MES)) AS HASTA,
            ANIOS.HORAS  
        FROM 
            B_rda rda 
        INNER JOIN 
            dbrda.dbo.R_ANIOSSERVICIO ANIOS ON rda.cod_rda = ANIOS.cod_rda 
        WHERE 
            RDA.CARNET = '${carnet}'  
            AND anios.frontera = 1 
        ORDER BY 
            ANIOS.DESDE_ANIO, 
            ANIOS.HASTA_ANIO;
        `
      } else if (queryType === 'cuarto') {
        query = `
        SELECT 
            RDA.carnet, 
            RDA.PATERNO, 
            RDA.MATERNO, 
            RDA.nombre1, 
            RDA.NOMBRE2, 
            VISTA.MOTIVO 
        FROM 
            B_RDA RDA 
        INNER JOIN 
            DBRDA.DBO.W_DUP_OBSERVADOS VISTA 
            ON RDA.cod_rda = VISTA.cod_rda 
        WHERE 
            RDA.CARNET = '${carnet}';
        `
      } 
      const result = await pool.request().query(query);
      await disconnectFromMssql(pool);
      //console.log(result.recordset) 
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







  /* static async getAll(carnet, queryType) {
    try {
      const pool = await connectToPostgres();
      if (!pool) {
        throw new Error("Error al conectar con PostgreSQL");
      }
      console.log(carnet)

      let query = '';
      if (queryType === 'first') {
        query = `
        SELECT gestion, mes, cod_dis, servicio, item, horas 
        FROM "B_planilla" 
        WHERE GESTION = 2023 AND CARNET = $1
        UNION
        SELECT gestion, mes, cod_dis, servicio, item, horas 
        FROM "B_planilla" 
        WHERE CARNET = $1 AND gestion = 2022 AND mes = 12 
        ORDER BY gestion, mes, servicio, item
        `;
      } else if (queryType === 'second') {
        query = `b_rue
            SELECT B.GESTION, 
                  (RTRIM(B.cod_dis) + ' - ' + RTRIM(S.descripcion)) AS DISTRITO, 
                  (RTRIM(B.CARNET) + ' - ' + RTRIM(B.PATERNO) + ' ' + RTRIM(B.MATERNO) + ' ' + RTRIM(B.nombre1) + ' ' + RTRIM(B.nombre2)) AS MAESTRO_A, 
                  B.CARGO, B.servicio, B.item, B.horapr, 
                  COUNT(B.horapr) AS CANTIDAD_MESES
            FROM "B_planilla" B
            INNER JOIN b_rue R ON B.cod_ue = R.cod_ue
            INNER JOIN b_distrito S ON B.cod_dis = S.cod_dis
            WHERE SUBSTRING(B.servicio, 7, 1) IN (2, 3) AND B.carnet = $1
            GROUP BY B.GESTION, B.cod_dis, S.descripcion, B.CARNET, B.PATERNO, B.MATERNO, B.nombre1, B.nombre2, B.CARGO, B.servicio, B.item, B.horapr
            ORDER BY B.GESTION, B.cod_dis, B.CARGO, B.servicio, B.item
        `;
      }
      
      const result = await pool.query(query, [carnet]);
      await disconnectFromPostgres(pool);
      console.log(result.rows);
      if (result.rows.length === 0) {
        return {
          data: null,
          error: true,
          message: "No hay registros",
        };
      }
      return { data: result.rows, error: false };
    } catch (error) {
      return { data: null, error: true, message: error.message };
    }
  } */




  
}

module.exports = Usersmodel;
