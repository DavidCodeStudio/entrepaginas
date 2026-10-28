/* ==========================================================
   ENTRE PÁGINAS · INTERACCIONES
   01 Menú | 02 Filtros | 03 Inscripción | 04 Boletín
   ========================================================== */
'use strict';

// 01 · Menú móvil accesible
const botonMenu = document.querySelector('.boton-menu');
const navegacion = document.getElementById('navegacion');
if (botonMenu && navegacion) {
  botonMenu.addEventListener('click', () => {
    const abierto = navegacion.classList.toggle('abierta');
    botonMenu.setAttribute('aria-expanded', String(abierto));
    botonMenu.setAttribute('aria-label', abierto ? 'Cerrar menú' : 'Abrir menú');
    botonMenu.textContent = abierto ? '×' : '☰';
  });
  navegacion.querySelectorAll('a').forEach(enlace => enlace.addEventListener('click', () => {
    navegacion.classList.remove('abierta');
    botonMenu.setAttribute('aria-expanded', 'false');
    botonMenu.setAttribute('aria-label', 'Abrir menú');
    botonMenu.textContent = '☰';
  }));
}

// 02 · Filtros de la biblioteca
const botonesFiltro = document.querySelectorAll('[data-filtro]');
const tarjetasLibro = document.querySelectorAll('.tarjeta-libro');
const avisoFiltros = document.querySelector('.aviso-filtros');
botonesFiltro.forEach(boton => boton.addEventListener('click', () => {
  const genero = boton.dataset.filtro;
  let visibles = 0;
  botonesFiltro.forEach(elemento => {
    const activo = elemento === boton;
    elemento.classList.toggle('activo', activo);
    elemento.setAttribute('aria-pressed', String(activo));
  });
  tarjetasLibro.forEach(tarjeta => {
    const mostrar = genero === 'todos' || tarjeta.dataset.genero === genero;
    tarjeta.hidden = !mostrar;
    if (mostrar) visibles++;
  });
  if (avisoFiltros) avisoFiltros.textContent = `${visibles} lecturas disponibles.`;
}));

// 03 · Inscripción demostrativa: sin envío ni almacenamiento
const dialogoInscripcion = document.getElementById('dialogo-inscripcion');
document.querySelectorAll('[data-abrir-inscripcion]').forEach(boton => {
  boton.addEventListener('click', () => dialogoInscripcion?.showModal());
});
dialogoInscripcion?.querySelector('.cerrar-dialogo')?.addEventListener('click', () => dialogoInscripcion.close());
dialogoInscripcion?.addEventListener('click', evento => {
  if (evento.target === dialogoInscripcion) dialogoInscripcion.close();
});
document.getElementById('formulario-inscripcion')?.addEventListener('submit', evento => {
  evento.preventDefault();
  const mensaje = document.querySelector('.mensaje-inscripcion');
  if (mensaje) mensaje.textContent = '¡Gracias! Esto es una demostración: no hemos registrado tus datos.';
});

// 04 · Newsletter demostrativa: sin envío ni almacenamiento
const formularioBoletin = document.getElementById('formulario-boletin');
formularioBoletin?.addEventListener('submit', evento => {
  evento.preventDefault();
  const mensaje = formularioBoletin.querySelector('.mensaje-boletin');
  if (mensaje) mensaje.textContent = '¡Gracias! La newsletter es demostrativa; no se ha enviado ni guardado tu correo.';
});

// 05 · Mostrar u ocultar filtros de lecturas
const botonTodasLecturas = document.getElementById('boton-todas-lecturas');
const panelFiltros = document.getElementById('panel-filtros');

if (botonTodasLecturas && panelFiltros) {
  botonTodasLecturas.addEventListener('click', () => {
    const mostrar = panelFiltros.hidden;
    panelFiltros.hidden = !mostrar;
    botonTodasLecturas.setAttribute('aria-expanded', String(mostrar));
    if (mostrar) {
      panelFiltros.querySelector('button')?.focus();
    }
  });
}


// 06 · Cerrar menú móvil con Escape o al ampliar la ventana.
if (botonMenu && navegacion) {
  const cerrarMenu = () => {
    navegacion.classList.remove('abierta');
    botonMenu.setAttribute('aria-expanded', 'false');
    botonMenu.setAttribute('aria-label', 'Abrir menú');
    botonMenu.textContent = '☰';
  };
  document.addEventListener('keydown', evento => {
    if (evento.key === 'Escape' && navegacion.classList.contains('abierta')) {
      cerrarMenu();
      botonMenu.focus();
    }
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1100 && navegacion.classList.contains('abierta')) cerrarMenu();
  });
}

// La navegación sigue la sección que se está leyendo.
const enlacesSeccion = [...document.querySelectorAll('.navegacion a')];
if ('IntersectionObserver' in window) {
  const observador = new IntersectionObserver(entradas => {
    const visible = entradas.filter(e => e.isIntersecting).sort((a,b) => b.intersectionRatio-a.intersectionRatio)[0];
    if (!visible) return;
    enlacesSeccion.forEach(enlace => {
      const activo = enlace.hash === `#${visible.target.id}`;
      enlace.classList.toggle('activo', activo);
      if (activo) enlace.setAttribute('aria-current', 'location');
      else enlace.removeAttribute('aria-current');
    });
  }, {rootMargin: '-15% 0px -55% 0px', threshold: 0});
  document.querySelectorAll('header[id], main section[id]').forEach(s => observador.observe(s));
}
// Permite conservar el contexto de la actividad al abrir la inscripción.
document.querySelectorAll('.evento-datos button').forEach(boton => {
  boton.addEventListener('click', () => {
    const titulo = boton.closest('.evento-datos').querySelector('h4').textContent;
    document.querySelector('#dialogo-inscripcion > p:not(.etiqueta)').textContent = `Te interesa «${titulo}». Puedes probar el formulario; la actividad y la inscripción son demostrativas.`;
  });
});
document.querySelectorAll('[data-abrir-inscripcion]:not(.evento-datos button)').forEach(boton => {
  boton.addEventListener('click', () => {
    document.querySelector('#dialogo-inscripcion > p:not(.etiqueta)').textContent = 'Un primer paso para leer en compañía. Prueba el formulario de inscripción: no se envían ni se guardan datos.';
  });
});

// Acceso independiente al futuro marketplace; no utiliza el registro del club.
const dialogoMarketplace = document.getElementById('dialogo-marketplace');
document.querySelector('[data-abrir-marketplace]')?.addEventListener('click', () => dialogoMarketplace?.showModal());
dialogoMarketplace?.querySelectorAll('.cerrar-dialogo, [data-cerrar-marketplace]').forEach(boton => {
  boton.addEventListener('click', () => dialogoMarketplace.close());
});
dialogoMarketplace?.addEventListener('click', evento => {
  if (evento.target === dialogoMarketplace) dialogoMarketplace.close();
});
