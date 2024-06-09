/*****************conection 2*********************/

const Usersmodel = require("../model/bonozona_model"); // Importa el modelo ProductosModel

class Users {
  // Método para obtener todas las categorias
  static async getAll(req, res) {
    try {
      const { distrito, gestion, mes } = req.body;
      const data = await Usersmodel.getAll(distrito, gestion, mes);

      if (!data) {
        return res.status(404).json({ error: message });
      }
      /* console.log(data) */
      res.status(200).json(data);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Método para obtener todos los usuarios
  static async gestion(req, res) {
    try {
      /* const { data, error, message } = await Usersmodel.getAll(); */
      const data = await Usersmodel.gestion();

      if (!data) {
        return res.status(404).json({ error: message });
      }
      /* console.log(data) */
      res.status(200).json(data);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = Users;
