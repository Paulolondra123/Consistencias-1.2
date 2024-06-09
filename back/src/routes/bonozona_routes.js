/*****************conection 3*********************/

const express = require('express')
const router = express.Router()
const Users = require('../controller/bonozona_controller')

// Ruta para obtener U.E. con bono zona
router.post('/bonozona', Users.getAll);
// Ruta para obtener los distritos
router.get('/gestion', Users.gestion);


module.exports = router 