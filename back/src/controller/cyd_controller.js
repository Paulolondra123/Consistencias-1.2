/*****************conection 2*********************/

const Usersmodel = require("../model/cyd_model"); // Importa el modelo ProductosModel

class Users {
  // Método para obtener todas las medidas
  static async getAll(req, res) {
    try {
      const { carnet, queryType } = req.body;
      const data = await Usersmodel.getAll(carnet, queryType);

      if (!data) {
        return res.status(404).json({ error: message });
      }
      console.log(data)
      res.status(200).json(data);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  
}

module.exports = Users;
