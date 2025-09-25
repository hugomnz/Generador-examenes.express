const express = require('express');
const path = require('path');
const PDFDocument = require('pdfkit');

const app = express();

// Configuración del motor de vistas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware para formularios
app.use(express.urlencoded({ extended: true }));

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Array global para almacenar exámenes (en memoria)
const examenes = [];

// Variable temporal para almacenar la cantidad de ejercicios
let examenTemporal = {};

// Ruta raíz - muestra lista de exámenes y formulario de creación
app.get('/', (req, res) => {
  res.render('index', { examenes });
});

// Ruta estática /about
app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

// POST /create - genera el formulario dinámico
app.post('/create', (req, res) => {
  const cantidad = parseInt(req.body.cantidad, 10);
  examenTemporal = { cantidad };
  res.render('create', { cantidad });
});

// POST /save - guarda el examen y redirige al inicio
app.post('/save', (req, res) => {
  const { puntuacion, enunciado } = req.body;

  const ejercicios = [];

  for (let i = 0; i < puntuacion.length; i++) {
    ejercicios.push({
      puntuacion: parseInt(puntuacion[i], 10),
      enunciado: enunciado[i]
    });
  }

  const examen = {
    id: examenes.length,
    ejercicios
  };

  examenes.push(examen);

  res.redirect('/');
});

// GET /examen/:id - muestra los ejercicios del examen
app.get('/examen/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const examen = examenes[id];

  if (!examen) {
    return res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
  }

  res.render('examen', { examen });
});

// GET /examen/:id/pdf - genera el PDF para ese examen
app.get('/examen/:id/pdf', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const examen = examenes[id];

  if (!examen) {
    return res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
  }

  const doc = new PDFDocument();
  const filename = `examen_${id}.pdf`;

  res.writeHead(200, {
    'Content-Type': 'application/pdf',
    'Content-Disposition': `attachment; filename=${filename}`
  });

  doc.pipe(res);

  // Título del examen
  doc.fontSize(18).fillColor('blue').text(`Examen ${id + 1}`, { underline: true });

  // Ejercicios
  examen.ejercicios.forEach((ej, index) => {
    doc.moveDown();
    doc.fontSize(14).fillColor('black').text(`Ejercicio ${index + 1}`);
    doc.fontSize(12).text(`Puntuación: ${ej.puntuacion}`);
    doc.text(`Enunciado: ${ej.enunciado}`);
  });

  doc.end();
});

// Página 404 por defecto
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor escuchando en http://localhost:${PORT}`);
});
