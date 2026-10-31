// 1. Show one section at a time, based on the link (#home, #about ...)
const views = document.querySelectorAll('.view');
const tabs = document.querySelectorAll('.dock a');

function show(id) {
  id = id || (location.hash || '#home').slice(1);
  const target = document.getElementById(id) ? id : 'home';
  views.forEach(v => v.classList.toggle('on', v.id === target));
  tabs.forEach(a => {
    if (a.getAttribute('href') === '#' + target) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  document.getElementById(target).scrollTop = 0;
}

window.addEventListener('hashchange', () => show());

// Every link that starts with # switches the view directly, so buttons always work
document.addEventListener('click', e => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  e.preventDefault();
  const h = a.getAttribute('href');
  if (h.length > 1) {            // "#" alone is a placeholder link, so it does nothing
    show(h.slice(1));
    try { history.replaceState(null, '', h); } catch (err) {}
  }
});
show();

// 2. Projects row: arrow buttons, mouse wheel and mouse drag all scroll sideways
const rail = document.querySelector('.rail');
const step = () => rail.querySelector('.proj').offsetWidth + 18;
document.getElementById('next').addEventListener('click', () => rail.scrollBy({ left: step(), behavior: 'smooth' }));
document.getElementById('prev').addEventListener('click', () => rail.scrollBy({ left: -step(), behavior: 'smooth' }));

rail.addEventListener('wheel', e => {
  if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
  const max = rail.scrollWidth - rail.clientWidth;
  if ((e.deltaY > 0 && rail.scrollLeft < max - 1) || (e.deltaY < 0 && rail.scrollLeft > 0)) {
    e.preventDefault();
    rail.scrollLeft += e.deltaY;
  }
}, { passive: false });

let dragging = false, startX = 0, startLeft = 0;
rail.addEventListener('pointerdown', e => {
  if (e.pointerType !== 'mouse') return;
  dragging = true; startX = e.clientX; startLeft = rail.scrollLeft;
  rail.style.scrollSnapType = 'none';
});
window.addEventListener('pointermove', e => { if (dragging) rail.scrollLeft = startLeft - (e.clientX - startX); });
window.addEventListener('pointerup', () => { dragging = false; rail.style.scrollSnapType = ''; });

// 3. Contact form: checks the fields and shows a confirmation (it does not send email)
const form = document.getElementById('form');
const msg = document.getElementById('msg');
form.addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const text = document.getElementById('text').value.trim();
  msg.className = 'err';
  if (!name) return msg.textContent = 'Enter your name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return msg.textContent = 'Enter a valid email address.';
  if (text.length < 10) return msg.textContent = 'Write a message of at least 10 characters.';
  msg.className = 'ok';
  msg.textContent = 'Thanks, ' + name + '. Your details look correct. This form does not send email, so please write to me at sshreeja07@gmail.com.';
  form.reset();
});

// 4. Light and dark theme toggle
const themeBtn = document.getElementById('theme');
function setTheme(t) {
  document.documentElement.dataset.theme = t;
  themeBtn.textContent = t === 'light' ? 'Dark mode' : 'Light mode';
  try { localStorage.setItem('theme', t); } catch (err) {}
}
let saved = null;
try { saved = localStorage.getItem('theme'); } catch (err) {}
setTheme(saved === 'light' ? 'light' : 'dark');
themeBtn.addEventListener('click', () => {
  setTheme(document.documentElement.dataset.theme === 'light' ? 'dark' : 'light');
});

// 5. Expand and collapse project details
document.querySelectorAll('.more').forEach(b => b.addEventListener('click', () => {
  const box = document.getElementById(b.getAttribute('aria-controls'));
  const willOpen = box.hidden;
  box.hidden = !willOpen;
  b.setAttribute('aria-expanded', willOpen);
}));

// 6. Footer year
document.querySelectorAll('.year').forEach(y => { y.textContent = new Date().getFullYear(); });
