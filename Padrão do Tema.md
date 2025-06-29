# Tema Dreamer Collection - Guia Completo

## 🎨 Paleta de Cores (CSS Variables)

```css
:root {
    --primary-gradient: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
    --primary-color: #bb86fc;          /* Roxo vibrante */
    --secondary-color: #03dac6;        /* Ciano/turquesa */
    --accent-color: #cf6679;           /* Rosa coral */
    --text-primary: #e1e1e1;          /* Texto principal claro */
    --text-secondary: #b3b3b3;        /* Texto secundário */
    --bg-main: rgba(18, 18, 35, 0.98); /* Fundo principal translúcido */
    --bg-nav: rgba(18, 18, 35, 0.98);  /* Fundo navegação */
    --shadow-color: rgba(0,0,0,0.4);
    --shadow-color-strong: rgba(0,0,0,0.6);
    --transition-speed: 0.3s;          /* Mantém rápido */
    --border-radius: 15px;
}
```

## 🌌 Fundo e Atmosfera

```css
body {
    background: radial-gradient(ellipse at center, #0a0a0a 0%, #000000 100%);
    min-height: 100vh;
    color: var(--text-primary);
    overflow-x: hidden;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
}
```

## ⭐ Sistema de Campo de Estrelas

### HTML Structure
```html
<div class="starfield" id="starfield" aria-hidden="true"></div>
```

### CSS para Estrelas
```css
.starfield {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
    z-index: -1;
    opacity: 0.8;
    overflow: hidden;
}

.star {
    position: absolute;
    background: white;
    border-radius: 50%;
    opacity: 0;
    animation: star-travel linear infinite;
}

/* Tipos de estrelas */
.star.distant {
    width: 1px;
    height: 1px;
    animation-duration: 25s;
    box-shadow: 0 0 2px rgba(255, 255, 255, 0.3);
}

.star.medium {
    width: 1.5px;
    height: 1.5px;
    animation-duration: 15s;
    box-shadow: 0 0 3px rgba(255, 255, 255, 0.5);
}

.star.close {
    width: 2px;
    height: 2px;
    animation-duration: 8s;
    box-shadow: 0 0 4px rgba(255, 255, 255, 0.7);
}

/* Cores especiais do antigo */
.star.blue {
    background: #e6f3ff;
    box-shadow: 0 0 6px rgba(173, 216, 255, 0.6);
}

.star.yellow {
    background: #fff8e1;
    box-shadow: 0 0 4px rgba(255, 248, 225, 0.5);
}

/* Animação (mais suave) */
@keyframes star-travel {
    0% {
        opacity: 0;
        transform: translate(0, 0) scale(0.5);
    }
    10% {
        opacity: 0.4;
    }
    50% {
        opacity: 1;
        transform: translate(var(--dx), var(--dy)) scale(1);
    }
    90% {
        opacity: 0.6;
    }
    100% {
        opacity: 0;
        transform: translate(calc(var(--dx) * 2), calc(var(--dy) * 2)) scale(1.2);
    }
}

@keyframes twinkle {
    0%, 100% { opacity: 0.2; }
    50% { opacity: 0.8; }
}
```

### JavaScript Otimizado
```javascript
// Configuração de performance
const performanceConfig = {
    maxStars: window.innerWidth > 768 ? 150 : 80,
    staticStars: window.innerWidth > 768 ? 40 : 20
};

function createStarfield() {
    const starfield = document.getElementById('starfield');
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    starfield.innerHTML = '';
    const fragment = document.createDocumentFragment();
    
    // Estrelas em movimento
    for (let i = 0; i < performanceConfig.maxStars; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        const angle = Math.random() * 2 * Math.PI;
        const initialRadius = Math.random() * 50 + 10;
        const startX = centerX + Math.cos(angle) * initialRadius;
        const startY = centerY + Math.sin(angle) * initialRadius;
        
        const directionX = Math.cos(angle);
        const directionY = Math.sin(angle);
        
        const maxDistance = Math.sqrt(Math.pow(window.innerWidth, 2) + Math.pow(window.innerHeight, 2));
        const travelDistance = maxDistance * (0.7 + Math.random() * 0.5);
        
        // Tipos com probabilidades
        const starType = Math.random();
        if (starType < 0.7) {
            star.classList.add('distant');
        } else if (starType < 0.9) {
            star.classList.add('medium');
        } else {
            star.classList.add('close');
        }
        
        // Cores especiais do antigo
        const colorType = Math.random();
        if (colorType < 0.1) {
            star.classList.add('blue');
        } else if (colorType < 0.2) {
            star.classList.add('yellow');
        }
        
        star.style.left = startX + 'px';
        star.style.top = startY + 'px';
        star.style.setProperty('--dx', (directionX * travelDistance) + 'px');
        star.style.setProperty('--dy', (directionY * travelDistance) + 'px');
        star.style.animationDelay = Math.random() * 25 + 's';
        
        fragment.appendChild(star);
    }
    
    // Estrelas estacionárias com twinkle
    for (let i = 0; i < performanceConfig.staticStars; i++) {
        const staticStar = document.createElement('div');
        staticStar.className = 'star distant';
        staticStar.style.position = 'absolute';
        staticStar.style.left = Math.random() * window.innerWidth + 'px';
        staticStar.style.top = Math.random() * window.innerHeight + 'px';
        staticStar.style.opacity = Math.random() * 0.4 + 0.1;
        staticStar.style.animation = `twinkle ${3 + Math.random() * 4}s ease-in-out infinite alternate`;
        staticStar.style.animationDelay = Math.random() * 2 + 's';
        
        fragment.appendChild(staticStar);
    }
    
    starfield.appendChild(fragment);
}
```

## 🧭 Navegação

```css
.navigation {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: var(--bg-nav);
    backdrop-filter: blur(15px);
    border-bottom: 2px solid var(--primary-color);
    z-index: 1000;
    padding: 12px 0;
    box-shadow: 0 4px 20px var(--shadow-color-strong);
    transition: all var(--transition-speed) ease;
}

.nav-container {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
}

.nav-home {
    font-size: 1.4em;
    font-weight: 700;
    color: var(--text-primary);
    text-decoration: none;
    transition: all var(--transition-speed) ease;
    display: flex;
    align-items: center;
    gap: 8px;
}

.nav-home:hover {
    color: var(--primary-color);
    transform: scale(1.05);
}

.nav-links {
    display: flex;
    gap: 20px;
    list-style: none;
}

.nav-links a {
    color: var(--text-primary);
    text-decoration: none;
    font-weight: 500;
    padding: 10px 18px;
    border-radius: 25px;
    transition: all var(--transition-speed) ease;
    position: relative;
    display: flex;
    align-items: center;
    gap: 6px;
}

.nav-links a:hover,
.nav-links a.active {
    color: white;
    background: linear-gradient(45deg, var(--primary-color), var(--secondary-color));
    transform: translateY(-2px);
    box-shadow: 0 6px 20px var(--shadow-color);
}

/* Menu Mobile */
.menu-toggle {
    display: none;
    background: none;
    border: none;
    font-size: 1.8em;
    cursor: pointer;
    color: var(--text-primary);
    transition: color var(--transition-speed) ease;
}

.menu-toggle:hover {
    color: var(--primary-color);
}

@media (max-width: 768px) {
    .nav-links {
        display: none;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: var(--bg-nav);
        flex-direction: column;
        padding: 25px 20px;
        box-shadow: 0 8px 25px var(--shadow-color-strong);
        border-radius: 0 0 var(--border-radius) var(--border-radius);
        backdrop-filter: blur(15px);
    }
    
    .nav-links.active {
        display: flex;
    }
    
    .menu-toggle {
        display: block;
    }
}
```

## 📦 Container Principal

```css
.main-content {
    padding: 120px 20px 40px;
    max-width: 1000px;
    margin: 0 auto;
}

.container {
    background: var(--bg-main);
    border-radius: var(--border-radius);
    padding: 40px;
    box-shadow: 0 20px 40px var(--shadow-color-strong);
    backdrop-filter: blur(15px);
    position: relative;
    overflow: hidden;
    border: 1px solid rgba(187, 134, 252, 0.1);
}

.container::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
}
```

## 🎭 Elementos Flutuantes

### HTML
```html
<div class="floating-elements" aria-hidden="true">
    <div class="floating-element">🎬</div>
    <div class="floating-element">🍿</div>
    <div class="floating-element">🎭</div>
    <div class="floating-element">📽️</div>
</div>
```

### CSS
```css
.floating-elements {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    overflow: hidden;
    z-index: 1;
}

.floating-element {
    position: absolute;
    font-size: 2em;
    opacity: 0.15;
    animation: float 8s ease-in-out infinite;
    color: var(--secondary-color);
    filter: blur(0.5px);
}

/* Posicionamento */
.floating-element:nth-child(1) { 
    top: 15%; 
    left: 10%; 
    animation-delay: 0s; 
}
.floating-element:nth-child(2) { 
    top: 25%; 
    right: 15%; 
    animation-delay: 2s; 
}
.floating-element:nth-child(3) { 
    bottom: 25%; 
    left: 20%; 
    animation-delay: 4s; 
}
.floating-element:nth-child(4) { 
    bottom: 35%; 
    right: 25%; 
    animation-delay: 1s; 
}

/* Animação */
@keyframes float {
    0%, 100% { 
        transform: translateY(0px) rotate(0deg) scale(1); 
    }
    25% { 
        transform: translateY(-15px) rotate(3deg) scale(1.05); 
    }
    50% { 
        transform: translateY(-25px) rotate(-2deg) scale(0.95); 
    }
    75% { 
        transform: translateY(-10px) rotate(4deg) scale(1.02); 
    }
}
```

## 🔗 Botões/Links Especiais

```css
.catalog-link, .youtube-link a {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: linear-gradient(45deg, var(--primary-color), var(--secondary-color));
    color: white;
    padding: 16px 32px;
    border-radius: 50px;
    text-decoration: none;
    font-weight: 600;
    font-size: 1.1em;
    transition: all var(--transition-speed) ease;
    margin-bottom: 25px;
    position: relative;
    overflow: hidden;
    box-shadow: 0 6px 20px var(--shadow-color);
}

/* Shimmer effect do antigo */
.catalog-link::before, .youtube-link a::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: left 0.5s;
}

.catalog-link:hover::before, .youtube-link a:hover::before {
    left: 100%;
}

.catalog-link:hover, .youtube-link a:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 30px var(--shadow-color-strong);
}
```

## 🖼️ Container de Imagem/Vídeo

```css
.image-container, .youtube-embed {
    position: relative;
    max-width: 600px;
    margin: 0 auto 35px;
    border-radius: var(--border-radius);
    overflow: hidden;
    box-shadow: 0 15px 40px var(--shadow-color-strong);
    transition: all var(--transition-speed) ease;
    border: 2px solid rgba(187, 134, 252, 0.2);
}

/* Para YouTube embed */
.youtube-embed {
    width: 100%;
    height: 0;
    padding-bottom: 56.25%;
}

.youtube-embed iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: none;
    border-radius: inherit;
}

.image-container:hover, .youtube-embed:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 50px var(--shadow-color-strong);
    border-color: var(--primary-color);
}

/* Overlay do antigo */
.image-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, rgba(187, 134, 252, 0.8), rgba(3, 218, 198, 0.8));
    opacity: 0;
    transition: all var(--transition-speed) ease;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.5em;
    font-weight: bold;
    text-shadow: 2px 2px 4px var(--shadow-color-strong);
}

.image-container:hover .image-overlay {
    opacity: 1;
}
```

## 📝 Seções Informativas

```css
.playlist-info, .info-section {
    background: linear-gradient(135deg, 
        rgba(187, 134, 252, 0.1), 
        rgba(3, 218, 198, 0.1));
    border-radius: var(--border-radius);
    padding: 30px;
    margin-bottom: 35px;
    border-left: 4px solid var(--primary-color);
    animation: fadeInUp 0.8s ease-out 0.4s both;
    position: relative;
    z-index: 2;
}

.playlist-info h3, .info-section h3 {
    color: var(--text-primary);
    font-size: 1.4em;
    font-weight: 600;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 10px;
}

.playlist-info p, .info-section p {
    color: var(--text-secondary);
    font-size: 1.05em;
    line-height: 1.6;
}
```

## ✨ Animações

```css
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(40px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Pulse effect do antigo */
.pulse-effect {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100px;
    height: 100px;
    border: 2px solid rgba(187, 134, 252, 0.3);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
    0% {
        transform: translate(-50%, -50%) scale(0.8);
        opacity: 1;
    }
    100% {
        transform: translate(-50%, -50%) scale(2);
        opacity: 0;
    }
}
```

## 🎨 Tipografia

```css
.header h1 {
    color: var(--text-primary);
    font-size: 2.8em;
    font-weight: 700;
    margin-bottom: 15px;
    text-shadow: 
        0 0 20px var(--primary-color),
        2px 2px 8px var(--shadow-color);
    animation: fadeInUp 0.8s ease-out;
}

.header p {
    color: var(--text-secondary);
    font-size: 1.2em;
    margin-bottom: 30px;
    animation: fadeInUp 0.8s ease-out 0.2s both;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
}
```

## 🎯 JavaScript Essencial

```javascript
// Setup completo do parallax
function setupParallax() {
    let ticking = false;
    
    function updateParallax(e) {
        const floatingElements = document.querySelectorAll('.floating-element');
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        floatingElements.forEach((element, index) => {
            const speed = (index + 1) * 0.3;
            const xPos = (x - 0.5) * speed * 15;
            const yPos = (y - 0.5) * speed * 15;
            
            element.style.transform = `translate(${xPos}px, ${yPos}px)`;
        });
        
        ticking = false;
    }
    
    document.addEventListener('mousemove', function(e) {
        if (!ticking) {
            requestAnimationFrame(() => updateParallax(e));
            ticking = true;
        }
    });
}

// Menu mobile
function toggleMenu() {
    const navLinks = document.getElementById('navLinks');
    const menuToggle = document.querySelector('.menu-toggle');
    const isActive = navLinks.classList.toggle('active');
    
    menuToggle.setAttribute('aria-expanded', isActive);
    menuToggle.setAttribute('aria-label', isActive ? 'Fechar menu de navegação' : 'Abrir menu de navegação');
}

// Fechar menu
document.addEventListener('click', function(e) {
    const nav = document.querySelector('.navigation');
    const navLinks = document.getElementById('navLinks');
    const menuToggle = document.querySelector('.menu-toggle');
    
    if (!nav.contains(e.target) && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Abrir menu de navegação');
    }
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && document.getElementById('navLinks').classList.contains('active')) {
        toggleMenu();
    }
});

// Debounce
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    createStarfield();
    setupParallax();
    
    // Resize otimizado
    window.addEventListener('resize', debounce(() => {
        performanceConfig.maxStars = window.innerWidth > 768 ? 150 : 80;
        performanceConfig.staticStars = window.innerWidth > 768 ? 40 : 20;
        createStarfield();
    }, 250));
    
    // Animação de entrada
    const container = document.querySelector('.container');
    if (container) {
        container.style.opacity = '0';
        container.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            container.style.transition = 'all 0.8s ease-out';
            container.style.opacity = '1';
            container.style.transform = 'translateY(0)';
        }, 100);
    }
});
```

## 📱 Responsividade

```css
@media (max-width: 768px) {
    .main-content {
        padding: 100px 15px 30px;
    }
    
    .container {
        padding: 30px 25px;
    }
    
    .header h1 {
        font-size: 2.2em;
    }
    
    .header p {
        font-size: 1.1em;
    }
    
    .floating-element {
        font-size: 1.6em;
    }
}

@media (max-width: 480px) {
    .header h1 {
        font-size: 1.9em;
    }
    
    .container {
        padding: 25px 20px;
    }
    
    .catalog-link, .youtube-link a {
        padding: 14px 28px;
        font-size: 1em;
    }
}
```

## 🎯 Estados de Acessibilidade

```css
/* Focus states */
.nav-links a:focus,
.catalog-link:focus,
.youtube-link a:focus,
.menu-toggle:focus {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}
```

## 📋 Emojis por Categoria

- **Filmes**: 🎬 🍿 🎭 📽️
- **Animes**: 🎌 🌸 ⚡ 🗾
- **Jogos**: 🎮 🕹️ 👾 🏆
- **Músicas**: 🎵 🎶 🎧 🎤
- **Imagens**: 🖼️ 📸 🎨 🌈
- **Vídeos**: 📹 🎥 📺 🎞️
