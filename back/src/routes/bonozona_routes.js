/*****************conection 3*********************/

const express = require('express')
const router = express.Router()
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const Users = require('../controller/bonozona_controller')

// Ruta para obtener U.E. con bono zona
router.post('/bonozona', Users.getAll);
// Ruta para obtener los distritos
router.get('/gestion', Users.gestion);


router.post('/pdf', (req, res) => {
    const { datosTabla } = req.body;

    // Crear un nuevo documento PDF en orientación horizontal
    const doc = new PDFDocument({ layout: 'landscape' });
    let filename = 'reporte.pdf';
    filename = encodeURIComponent(filename);

    res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
    res.setHeader('Content-type', 'application/pdf');

    doc.pipe(res);

    // Añadir encabezado e imagen
    //const imagePath = path.join(__dirname, '../public/images/logo.png');
    //doc.image(imagePath, 50, 20, { width: 100 }) // Ajusta la ruta y las dimensiones según sea necesario
    //doc.fontSize(20)
    doc.font('Helvetica-Bold').fontSize(10).text('REPORTE DE BONO ZONA', 30, 30, { align: 'center' })
       .font('Helvetica-Bold').fontSize(10).text('CENTROS EDUCATIVOS', 30, 45, { align: 'center' });

    // Dibujar línea horizontal
    doc.moveTo(50, 80)
       .lineTo(550, 80)
       .stroke();

    doc.moveDown();
    doc.fontSize(10)
       .text('DISTRITO EDUCATIVO:', 50, 73)
       .text('SIE:', 250, 73)
       .text('CENTROS EDUCATIVOS', 400, 73)
       .text('CANTIDAD', 550, 73);

    // Añadir tabla de datos
    let yPosition = 180;
    datosTabla.forEach(row => {
        doc.text(row[0], 50, yPosition)
           .text(row[1], 250, yPosition)
           .text(row[2], 400, yPosition)
           .text(row[3], 550, yPosition);
        yPosition += 20;
    });

    doc.end();
});


module.exports = router 