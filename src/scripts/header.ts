// Cabecera (todas las páginas): fondo al hacer scroll y versión oscura mientras hay una
// sección oscura (`data-dark`) debajo.
const header = document.querySelector<HTMLElement>('[data-header]');
const darkSections = Array.from(document.querySelectorAll<HTMLElement>('[data-dark]'));

const updateHeader = () => {
  if (!header) return;
  header.toggleAttribute('data-scrolled', window.scrollY > 20);
  const line = header.offsetHeight / 2;
  header.toggleAttribute(
    'data-on-dark',
    darkSections.some((s) => {
      const r = s.getBoundingClientRect();
      return r.top <= line && r.bottom >= line;
    }),
  );
};

window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();
