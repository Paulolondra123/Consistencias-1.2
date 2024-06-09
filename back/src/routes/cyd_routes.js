/*****************conection 3*********************/

const express = require('express')
const router = express.Router()
const Users = require('../controller/cyd_controller')


// Ruta para obtener todas las medidas
router.post('/buscar', Users.getAll)
 
module.exports = router 