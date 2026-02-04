# NeutralOps - Landing Page

Landing page completa y responsive para **NeutralOps**, agencia de soluciones de automatización con IA.

## 📁 Estructura del Proyecto

```
Landing Page/
├── public/
│   ├── index.html          # Página principal
│   ├── privacy.html        # Política de Privacidad
│   ├── terms.html          # Términos y Condiciones
│   ├── styles.css          # Estilos principales
│   ├── script.js           # JavaScript (validación, animaciones)
│   └── assets/
│       ├── logo.png        # Logo NeutralOps
│       └── banner.png      # Banner del Hero
├── Dockerfile              # Configuración Docker
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
- **Docker Ready**: Dockerfile incluido para deployment con contenedores

## 🚀 Cómo Correr Localmente

### Opción 1: Abrir Directamente
1. Navegar a `public/index.html`
2. Doble clic para abrir en el navegador

### Opción 2: Servidor Local (Recomendado)

**Usando Python:**
```bash
cd "Landing Page/public"
python -m http.server 8000

# Abrir en navegador: http://localhost:8000/
```

**Usando Node.js (http-server):**
```bash
# Instalar http-server globalmente (solo una vez)
npm install -g http-server

# Correr servidor
cd "Landing Page/public"
http-server -p 8000

# Abrir en navegador: http://localhost:8000/
```

**Usando PHP:**
```bash
cd "Landing Page/public"
php -S localhost:8000

# Abrir en navegador: http://localhost:8000/
```

### Opción 3: Docker

```bash
# Construir imagen
docker build -t neutralops-landing .

# Ejecutar contenedor
docker run -d -p 8080:80 neutralops-landing

# Abrir en navegador: http://localhost:8080/
```

### Opción 4: Live Server (VS Code)

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

### 4. Docker Deployment

**Docker Hub:**
```bash
# Build y push
docker build -t tu-usuario/neutralops-landing .
docker push tu-usuario/neutralops-landing

# En servidor de producción
docker pull tu-usuario/neutralops-landing
docker run -d -p 80:80 neutralops-landing
```

**Docker Compose:**
```yaml
version: '3'
services:
  web:
    build: .
    ports:
      - "80:80"
```

### 5. Hosting Tradicional (cPanel/FTP)

1. Conectar por FTP (FileZilla, WinSCP, etc.)
2. Subir **todo el contenido de la carpeta `public/`** a `public_html/` o `www/`
3. Asegurar que la estructura sea:
   ```
   public_html/
   ├── index.html
   ├── privacy.html
   ├── terms.html
   ├── styles.css
   ├── script.js
   └── assets/
   ```

## 🔧 Personalización

### Cambiar colores
Editar las variables CSS en `public/styles.css`:
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
Editar el handler en `public/script.js` para usar `fetch()` y enviar a tu API.

## 🔒 Seguridad y Privacidad

- ✅ Páginas legales (`privacy.html` y `terms.html`) completadas
- ✅ El formulario **no envía datos a ningún servidor** por defecto (solo localStorage)
- ⚠️ Cuando conectes un backend, asegurar usar **HTTPS**
- ✅ Favicon configurado
- ✅ Meta tags de SEO

## 🐳 Docker

El proyecto incluye un `Dockerfile` para deployment fácil:

```dockerfile
FROM nginx:alpine
COPY public/ /usr/share/nginx/html
EXPOSE 80
```

**Comandos útiles:**
```bash
# Build
docker build -t neutralops-landing .

# Run
docker run -d -p 8080:80 neutralops-landing

# Stop
docker stop <container_id>

# Logs
docker logs <container_id>
```

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
- Nginx (Docker)
- Sin frameworks ni librerías externas

## 📞 Contacto y Soporte

Para consultas sobre la landing page o servicios de NeutralOps:

**Email**: hola@neutralops.cloud  
**Teléfono**: 092332379

---

Desarrollado con 💙 por NeutralOps | 2026
