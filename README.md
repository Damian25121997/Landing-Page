# NeutralOps - Landing Page

Landing page completa y responsive para **NeutralOps**, agencia de soluciones de automatización con IA.

## 📁 Estructura del Proyecto

```
Landing Page/
├── public/
│   ├── index.html          # Página principal
│   ├── privacy.html        # Política de Privacidad
│   ├── terms.html          # Términos y Condiciones
│   └── assets/
│       ├── logo.png        # Logo NeutralOps
│       └── banner.png      # Banner del Hero
├── styles.css              # Estilos principales
├── script.js               # JavaScript (validación, animaciones)
└── README.md               # Este archivo
```

## 🎨 Características

- **Responsive Design**: Adaptado a móviles, tablets y escritorio
- **Animaciones sutiles**: On-scroll animations sin librerías externas
- **Formulario funcional**: Validación JS + almacenamiento en localStorage
- **SEO optimizado**: Meta tags, favicon, H1 único, estructura semántica
- **Accesibilidad**: Labels, contraste, navegación por teclado
- **Sticky Header**: Navegación fija al hacer scroll
- **FAQ Accordion**: Sección de preguntas frecuentes interactiva

## 🚀 Cómo Correr Localmente

### Opción 1: Servidor Local (Recomendado)

**Usando Python:**
```bash
# Python 3
cd "Landing Page"
python -m http.server 8000

# Abrir en navegador: http://localhost:8000/public/
```

**Usando Node.js (http-server):**
```bash
# Instalar http-server globalmente (solo una vez)
npm install -g http-server

# Correr servidor
cd "Landing Page"
http-server -p 8000

# Abrir en navegador: http://localhost:8000/public/
```

**Usando PHP:**
```bash
cd "Landing Page"
php -S localhost:8000

# Abrir en navegador: http://localhost:8000/public/
```

### Opción 2: Live Server (VS Code)

1. Instalar la extensión "Live Server"
2. Click derecho en `public/index.html` → "Open with Live Server"

## 📤 Cómo Publicar en Producción

### 1. Netlify (Recomendado - Gratis)

**Opción A: Drag & Drop**
1. Ir a [netlify.com](https://netlify.com)
2. Crear cuenta (gratis)
3. Arrastrar la carpeta **`public/`** a la zona de deploy
4. ¡Listo! Tu sitio estará en `https://tu-sitio.netlify.app`

**Opción B: Git Deploy (recomendado para updates)**
```bash
# 1. Subir a GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/tu-usuario/neutralops-landing.git
git push -u origin main

# 2. En Netlify:
# - New site from Git
# - Conectar GitHub
# - Seleccionar repo
# - Build settings:
#   - Publish directory: public
# - Deploy!
```

**Configuración de dominio personalizado:**
- En Netlify: Site settings → Domain management → Add custom domain
- Seguir instrucciones para configurar DNS

### 2. GitHub Pages (Gratis)

```bash
# 1. Crear repositorio en GitHub
# 2. Subir código
git init
git add .
git commit -m "Landing page NeutralOps"
git branch -M main
git remote add origin https://github.com/tu-usuario/neutralops-landing.git
git push -u origin main

# 3. Configurar GitHub Pages:
# - Ir a Settings → Pages
# - Source: Deploy from a branch
# - Branch: main → /public → Save
```

Tu sitio estará en: `https://tu-usuario.github.io/neutralops-landing/`

**Dominio personalizado:**
- En Settings → Pages → Custom domain
- Agregar tu dominio (ej: `neutralops.cloud`)
- Configurar DNS según instrucciones

### 3. Vercel (Gratis)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
cd "Landing Page"
vercel --prod

# Configuración:
# - Public directory: public
```

### 4. Hosting Tradicional (cPanel/FTP)

1. Conectar por FTP (FileZilla, WinSCP, etc.)
2. Subir **todo el contenido de la carpeta `public/`** a `public_html/` o `www/`
3. Subir `styles.css` y `script.js` a la raíz del servidor (un nivel arriba de public_html)
4. Asegurar que la estructura en el servidor sea:
   ```
   /
   ├── styles.css
   ├── script.js
   └── public_html/
       ├── index.html
       ├── privacy.html
       ├── terms.html
       └── assets/
   ```

> **Nota**: Si tu hosting no permite esta estructura, puedes mover todos los archivos de `public/` a la raíz junto con CSS y JS, y actualizar las rutas en los HTML (quitar el `../` de las referencias a CSS y JS).

## 🔧 Personalización

### Cambiar colores
Editar las variables CSS en `styles.css`:
```css
:root {
  --primary: #16589C;
  --accent: #0FC2DE;
  --accent2: #159ECB;
  /* ... más variables */
}
```

### Modificar contenido
- **Textos**: Editar directamente en `public/index.html`
- **Imágenes**: Reemplazar los archivos en `public/assets/`
- **Links de contacto**: Buscar `hola@neutralops.cloud` en los archivos HTML

### Actualizar teléfono
Editar el número en `public/index.html` (footer):
```html
<a href="tel:+59892332379">092332379</a>
```

## 📧 Formulario de Contacto

El formulario actualmente:
- ✅ Valida campos obligatorios (nombre, email, teléfono, mensaje)
- ✅ Valida formato de email
- ✅ Requiere aceptación de términos y privacidad
- ⚠️ **Guarda en localStorage** (simulación, no envía a servidor)

### Para conectar con un backend real:

**Opción A - Formspree (sin código, gratis):**
1. Crear cuenta en [formspree.io](https://formspree.io/)
2. Crear nuevo formulario
3. Copiar el endpoint
4. En `public/index.html` línea 312, cambiar:
   ```html
   <form action="https://formspree.io/f/TU_FORM_ID" method="POST">
   ```

**Opción B - Netlify Forms:**
1. En `public/index.html`, agregar `netlify` al form:
   ```html
   <form netlify class="contact__form" id="contactForm">
   ```

**Opción C - Backend propio:**
Editar el handler en `script.js` para usar `fetch()` y enviar a tu API.

## 🔒 Seguridad y Privacidad

- ✅ Páginas legales (`privacy.html` y `terms.html`) completadas
- ✅ El formulario **no envía datos a ningún servidor** por defecto (solo localStorage)
- ⚠️ Cuando conectes un backend, asegurar usar **HTTPS**
- ✅ Favicon configurado
- ✅ Meta tags de SEO

## 📱 Compatibilidad

- ✅ Chrome, Firefox, Safari, Edge (últimas versiones)
- ✅ Móviles iOS y Android
- ✅ Tablets
- ✅ Navegación por teclado
- ✅ Lectores de pantalla (básico)

## 🛠️ Tecnologías Utilizadas

- HTML5 semántico
- CSS3 (Flexbox, Grid, Variables CSS, Animations)
- JavaScript vanilla (ES6+)
- Sin frameworks ni librerías externas

## 📞 Contacto y Soporte

Para consultas sobre la landing page o servicios de NeutralOps:

**Email**: hola@neutralops.cloud  
**Teléfono**: 092332379

---

Desarrollado con 💙 por NeutralOps | 2026
