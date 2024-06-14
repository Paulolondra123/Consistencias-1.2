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
    doc.font('Helvetica-Bold').fontSize(10).text('REPORTE DE BONO ZONA', 30, 30)
       .font('Helvetica-Bold').fontSize(10).text('CENTROS EDUCATIVOS', 30, 45)
       .fontSize(5).text('ESTADO PLURINACIONAL DE', 30, 45)
       .font('Helvetica-Bold').fontSize(20).text('BOLIVIA', 30, 45)
       .font('Helvetica-Bold').fontSize(10).text('MINISTERIO DE EDUCACION', 30, 45)
       .font('Helvetica-Bold').fontSize(10).text('DIRECCION DEPARTAMENTAL DE', 30, 45)
       .font('Helvetica-Bold').fontSize(10).text('EDUCACION DE SANTA CRUZ', 30, 45)

    // Dibujar línea horizontal
    doc.font('Helvetica-Bold')
        .moveTo(25, 90)
       .lineTo(762, 90)
       .stroke();

    doc.font('Helvetica-Bold')
        .moveTo(25, 93)
       .lineTo(762, 93)
       .stroke();

    doc.moveDown();
    doc.fontSize(8)
       .text('DISTRITO EDUCATIVO:', 160, 75)
       .text('CENTROS EDUCATIVOS', 500, 75)

    // Añadir tabla de datos
    let yPosition = 105;
    datosTabla.forEach(row => {
        doc.text(row[0], 120, yPosition)
           .text(row[1], 480, yPosition)
           //.text(row[2], 500, yPosition)
           //.text(row[3], 650, yPosition);
        yPosition += 20;
    });

    doc.end();
});


module.exports = router 