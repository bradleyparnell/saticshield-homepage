const menuButton=document.querySelector('.menu-button');
const mobileMenu=document.querySelector('.mobile-menu');
const setMenu=open=>{mobileMenu?.classList.toggle('open',open);menuButton?.setAttribute('aria-expanded',String(open));menuButton?.querySelector('span')&&(menuButton.querySelector('span').textContent=open?'Close':'Menu')};
menuButton?.addEventListener('click',()=>setMenu(!mobileMenu.classList.contains('open')));
mobileMenu?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
document.addEventListener('keydown',e=>{if(e.key==='Escape'){setMenu(false);if(modal?.open)modal.close()}});

const modal=document.querySelector('.video-modal');
document.querySelector('[data-video]')?.addEventListener('click',()=>modal.showModal());
document.querySelector('.modal-close')?.addEventListener('click',()=>modal.close());
modal?.addEventListener('click',e=>{if(e.target===modal)modal.close()});

const tabs=[...document.querySelectorAll('.product-tabs button')];
const cards=[...document.querySelectorAll('.product-card')];
tabs.forEach(tab=>tab.addEventListener('click',()=>{tabs.forEach(t=>{t.classList.remove('active');t.setAttribute('aria-selected','false')});tab.classList.add('active');tab.setAttribute('aria-selected','true');const f=tab.dataset.filter;cards.forEach(c=>c.classList.toggle('hidden',f!=='all'&&c.dataset.kind!==f))}));

if('IntersectionObserver'in window){const reveal=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');reveal.unobserve(entry.target)}}),{threshold:.08,rootMargin:'0px 0px 40px'});document.querySelectorAll('.reveal').forEach(el=>reveal.observe(el))}else document.querySelectorAll('.reveal').forEach(el=>el.classList.add('visible'));

const header=document.querySelector('.site-header');
const syncHeader=()=>header?.classList.toggle('is-scrolled',window.scrollY>48);
window.addEventListener('scroll',syncHeader,{passive:true});syncHeader();

// If a browser cannot decode WebP or an asset is interrupted, use the included source image.
document.querySelectorAll('img').forEach(img=>img.addEventListener('error',()=>{const fallback=img.dataset.fallback;if(fallback&&img.getAttribute('src')!==fallback){img.src=fallback;return}img.classList.add('image-error');img.parentElement?.classList.add('image-error-frame')},{once:true}));