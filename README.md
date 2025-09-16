# Generador-examenes.express
Aplicación Node.js con Express, EJS y PDFKit para crear exámenes dinámicamente, listarlos, ver su detalle y descargar cada examen en PDF. Datos en memoria para simplicidad.

# 📝 Generador de Exámenes (Express + EJS + PDF)

Aplicación web en **Node.js** que permite **crear exámenes** indicando el número de ejercicios, **asignar puntuación y enunciado** a cada ejercicio, **listar** los exámenes creados, **ver el detalle** de un examen y **descargarlo en PDF**. La interfaz usa **EJS** como motor de vistas y los PDF se generan con **PDFKit**.

---

## ✨ Funcionalidades

- ➕ **Crear examen** indicando cuántos ejercicios tendrá (1–5 por defecto).
- 🧮 **Definir cada ejercicio** con *puntuación* y *enunciado*.
- 📚 **Listar exámenes** creados durante la sesión.
- 🔎 **Ver detalle** de un examen específico.
- ⬇️ **Descargar PDF** del examen con formato sencillo.
- ℹ️ **Página About** y **página 404** personalizadas.

> Los exámenes se almacenan **en memoria** (un array) para simplificar el ejemplo; si reinicias el servidor, se pierden. Ideal para prácticas o como base de un proyecto mayor.  
> Rutas principales definidas en `app.js` con Express 5 y vistas EJS. El array global `examenes` es el almacenamiento temporal. :contentReference[oaicite:1]{index=1}

---

## 🗺️ Rutas y flujo de uso

- `GET /` — **Inicio**: lista exámenes y muestra formulario para elegir la *cantidad de ejercicios* del nuevo examen. Renderizado con `views/index.ejs`. 
- `POST /create` — Genera dinámicamente el **formulario de creación** con N ejercicios (según lo elegido en `/`). Renderiza `views/create.ejs` con `cantidad`. 
- `POST /save` — **Guarda** el examen en memoria (id incremental, ejercicios con `puntuacion[]` y `enunciado[]`) y redirige a `/`. :contentReference[oaicite:4]{index=4}
- `GET /examen/:id` — **Detalle** del examen seleccionado, lista ejercicios con puntuación y enunciado. Renderiza `views/examen.ejs`. 
- `GET /examen/:id/pdf` — **Genera PDF** del examen con título y bloques por ejercicio (puntuación + enunciado), usando **PDFKit**. Descarga con `Content-Disposition: attachment`. :contentReference[oaicite:6]{index=6}
- `GET /about` — Página estática *About*. Sirve `public/about.html`. 
- `*` — **404**: fallback para rutas no encontradas. Sirve `public/404.html`. 

---

## 🧩 Arquitectura y carpetas

generador-examenes-express/
├─ app.js # Servidor Express y rutas principales
├─ package.json # Dependencias y scripts
├─ package-lock.json
├─ views/
│ ├─ index.ejs # Lista exámenes + selector de cantidad
│ ├─ create.ejs # Form con N ejercicios dinámicos
│ └─ examen.ejs # Detalle de examen + botón "Descargar PDF"
└─ public/
├─ 404.html # Página de error
├─ about.html # Página informativa
└─ css/
└─ style.css # Estilos básicos


- El servidor:
  - Define **EJS** como `view engine` y `/views` como carpeta de vistas. :contentReference[oaicite:9]{index=9}
  - Sirve estáticos desde `/public`. (CSS, 404, About) :contentReference[oaicite:10]{index=10}
- Estilos base en `public/css/style.css`. :contentReference[oaicite:11]{index=11}

---

## 🛠️ Requisitos y dependencias

- **Node.js >= 18** (Express 5 y varios paquetes requieren esta versión o superior).
- Dependencias:
  - `express@^5` — servidor y ruteo. :contentReference[oaicite:12]{index=12}
  - `ejs` — motor de vistas. :contentReference[oaicite:13]{index=13}
  - `pdfkit` — generación de PDF. :contentReference[oaicite:14]{index=14}

`package.json` ya incluye estas dependencias en `"dependencies"`. Puedes añadir un script `"start"` para comodidad (ver más abajo). :contentReference[oaicite:15]{index=15}

---

## 🚀 Puesta en marcha

1) **Clonar e instalar**
```bash
git clone https://github.com/hugomnz/generador-examenes-express.git
cd generador-examenes-express
npm install
```
2) Organiza los archivos (si no están ya así):
- Mueve index.ejs, create.ejs, examen.ejs a ./views/
- Mueve 404.html, about.html a ./public/
- Mueve style.css a ./public/css/style.css

3) Scripts de npm (opcional pero recomendado)
Edita package.json para añadir:
```json
{
  "scripts": {
    "start": "node app.js",
    "dev": "NODE_ENV=development node app.js"
  }
}
```
4) Levantar el servidor
```bash
npm run start
# o
node app.js
```
Abre http://localhost:3000 en tu navegador. El puerto está configurado como 3000 en app.js.

🧪 Cómo usar la aplicación (paso a paso)

En Inicio (/): elige el número de ejercicios y pulsa Crear examen.

En Crear: completa puntuación y enunciado para cada ejercicio; pulsa Guardar examen. 

Vuelve a Inicio: verás el nuevo examen en la lista. Entra a su detalle. 

En Detalle: revisa los ejercicios y pulsa Descargar PDF para obtener el examen en un archivo PDF. 

Visita /about para información general o navega a una ruta inexistente para ver la 404.

📄 Generación de PDF

Ruta GET /examen/:id/pdf crea un documento PDF con:

Título Examen N en color y subrayado.

Secciones por ejercicio: número, puntuación y enunciado.

Se envía con cabeceras para descarga directa (Content-Disposition: attachment). 

🎨 Estilos

Hoja public/css/style.css con tipografías, colores, formularios y botones. 

🔐 Notas y limitaciones

Persistencia: los exámenes viven en memoria (const examenes = []). Al reiniciar, se pierden. Integra una BD (SQLite/PostgreSQL/MongoDB) para persistencia real. 

Validación/seguridad: el ejemplo es didáctico; añade validaciones de entrada, protección CSRF si fuera necesario, y saneo de datos para producción.

Producción: configura variables de entorno y un PORT dinámico si despliegas (Render, Railway, Fly.io, etc.).

Hecho por hugomnz, bajo licencia MIT (LICENSE).
