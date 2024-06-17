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
    const imagePath = path.join(__dirname, '../../../frond/img/Chakana.png');
    doc.image(imagePath, 50, 20, { width: 55 })
    
    
    // Ajustar tamaño y centrar texto "REPORTE DE BONO ZONA" y "CENTROS EDUCATIVOS"
    const headerText1 = 'REPORTE DE BONO ZONA';
    const headerText2 = 'CENTROS EDUCATIVOS';
    const headerTextWidth1 = doc.widthOfString(headerText1);
    const headerTextWidth2 = doc.widthOfString(headerText2);
    const headerTextX1 = (doc.page.width - headerTextWidth1) / 2;
    const headerTextX2 = (doc.page.width - headerTextWidth2) / 2;
    const headerTextY = 30;

    // Escribir primer texto
    doc.font('Helvetica-Bold').fontSize(10)
       .text(headerText1, headerTextX1, headerTextY);

    // Escribir segundo texto con salto de línea
    doc.moveDown()
       .text(headerText2, headerTextX2, doc.y - 10); // Ajusta el espacio según sea necesario


    doc.fontSize(5).text('ESTADO PLURINACIONAL DE', 120, 30)
       .font('Helvetica-Bold').fontSize(19).text('BOLIVIA', 117, 35)
       .font('Helvetica-Bold').fontSize(5).text('MINISTERIO DE EDUCACION', 120, 52)
       .font('Helvetica-Bold').fontSize(5).text('DIRECCION DEPARTAMENTAL DE', 115, 58)
       .font('Helvetica-Bold').fontSize(5).text('EDUCACION DE SANTA CRUZ', 119, 65)

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
       .text('DISTRITO EDUCATIVO:', 160, 80)
       .text('CENTROS EDUCATIVOS', 500, 80)

    // Añadir tabla de datos
    let yPosition = 105;
    datosTabla.forEach(row => {
        doc.text(row[0], 120, yPosition)
           .text(row[1], 480, yPosition)
           //.text(row[2], 500, yPosition)
           //.text(row[3], 650, yPosition);
        yPosition += 20;
    });

    // Dibujar línea horizontal al final
    const finalYPosition = 585; // Posición en Y donde quieres las líneas al final
    doc.moveTo(25, finalYPosition)
       .lineTo(762, finalYPosition)
       .stroke();

    doc.moveTo(25, finalYPosition + 3)
       .lineTo(762, finalYPosition + 3)
       .stroke();

    doc.end();
});


module.exports = router 