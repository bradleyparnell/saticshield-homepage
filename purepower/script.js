const menuButton=document.querySelector('.menu-button');
const mobileMenu=document.querySelector('.mobile-menu');
const setMenu=open=>{mobileMenu?.classList.toggle('open',open);menuButton?.setAttribute('aria-expanded',String(open));menuButton?.querySelector('span')&&(menuButton.querySelector('span').textContent=open?'Close':'Menu')};
menuButton?.addEventListener('click',()=>setMenu(!mobileMenu.classList.contains('open')));
mobileMenu?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
document.addEventListener('keydown',e=>{if(e.key==='Escape'){setMenu(false);if(modal?.open)modal.close()}});

const modal=document.querySelector('.video-modal');
const film=modal?.querySelector('video');
const openFilm=()=>{if(!modal)return;if(film&&!film.src){film.src=film.dataset.src;film.load()}modal.showModal();film?.play().catch(()=>{})};
document.querySelectorAll('[data-video]').forEach(button=>button.addEventListener('click',openFilm));
document.querySelector('.modal-close')?.addEventListener('click',()=>modal.close());
modal?.addEventListener('click',e=>{if(e.target===modal)modal.close()});
modal?.addEventListener('close',()=>film?.pause());

const tabs=[...document.querySelectorAll('.product-tabs button')];
const cards=[...document.querySelectorAll('.product-card')];
const filterStatus=document.querySelector('#filter-status');
const filterNames={all:'all',filter:'filtering',measure:'measurement','shield':'shielding & lighting'};
tabs.forEach(tab=>tab.addEventListener('click',()=>{
  tabs.forEach(t=>{t.classList.remove('active');t.setAttribute('aria-selected','false')});
  tab.classList.add('active');tab.setAttribute('aria-selected','true');
  const filter=tab.dataset.filter;
  cards.forEach(card=>card.classList.toggle('hidden',filter!=='all'&&card.dataset.kind!==filter));
  const visible=cards.filter(card=>!card.classList.contains('hidden')).length;
  document.querySelector('.products')?.classList.toggle('is-filtered',filter!=='all');
  if(filterStatus)filterStatus.textContent=filter==='all'?`Showing all ${visible} solutions`:`Showing ${visible} ${filterNames[filter]} solution${visible===1?'':'s'}`;
}));

if('IntersectionObserver'in window){const reveal=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');reveal.unobserve(entry.target)}}),{threshold:.08,rootMargin:'0px 0px 40px'});document.querySelectorAll('.reveal').forEach(el=>reveal.observe(el))}else document.querySelectorAll('.reveal').forEach(el=>el.classList.add('visible'));

const header=document.querySelector('.site-header');
const syncHeader=()=>header?.classList.toggle('is-scrolled',window.scrollY>48);
window.addEventListener('scroll',syncHeader,{passive:true});syncHeader();

// If a browser cannot decode WebP or an asset is interrupted, use the included source image.
document.querySelectorAll('img').forEach(img=>img.addEventListener('error',()=>{const fallback=img.dataset.fallback;if(fallback&&img.getAttribute('src')!==fallback){img.src=fallback;return}img.classList.add('image-error');img.parentElement?.classList.add('image-error-frame')},{once:true}));

const homeFitForm=document.querySelector('#home-fit-form');
const homeSize=document.querySelector('#home-size');
const homeSizeOutput=document.querySelector('#home-size-output');
const planItems=document.querySelector('#plan-items');
const planStatus=document.querySelector('#plan-status');
const planTitle=document.querySelector('#plan-title');
const planSummary=document.querySelector('#plan-summary');
const assessmentButton=document.querySelector('.assessment-button');
const formatSize=value=>`${Number(value).toLocaleString()} sq ft`;
const syncSize=()=>{if(homeSizeOutput&&homeSize)homeSizeOutput.textContent=formatSize(homeSize.value)};
homeSize?.addEventListener('input',syncSize);syncSize();

homeFitForm?.addEventListener('submit',event=>{
  event.preventDefault();
  const data=new FormData(homeFitForm);
  const size=Number(data.get('size'));
  const recommendations=[];
  recommendations.push({title:'Measure your baseline',body:'Use an EMI Line Monitor before and after changes so your plan is based on what is actually present.'});
  if(data.get('solar')==='yes')recommendations.push({title:'Evaluate whole-home solar filtration',body:'Solar inverters can add high-frequency electrical noise. Pure Power Solar Duty is the logical whole-home conversation.'});
  else if(size>=3000)recommendations.push({title:'Plan by electrical zones',body:'For a larger home, review major panels and high-use areas before choosing whole-home or targeted filtration.'});
  else recommendations.push({title:'Start with targeted filtration',body:'Begin in the rooms used most, then compare your monitor reading before expanding the system.'});
  if(data.get('pool')==='yes')recommendations.push({title:'Check pool equipment',body:'Variable-speed pumps and motor controls may add line noise. Measure near the equipment and at the main panel.'});
  if(data.get('wifi')==='yes')recommendations.push({title:'Protect the sleep environment',body:'Move the router away from bedrooms, hardwire when practical, and reduce unnecessary overnight wireless activity.'});
  else recommendations.push({title:'Keep distance working for you',body:'Maintain separation between wireless equipment and sleeping areas, especially overnight.'});
  if(data.get('mold')==='yes')recommendations.push({title:'Address moisture first',body:'Identify the moisture source and consult a qualified mold professional. Electrical products are not mold remediation.'});
  planItems.innerHTML=recommendations.slice(0,5).map((item,index)=>`<article><b>${String(index+1).padStart(2,'0')}</b><div><strong>${item.title}</strong><p>${item.body}</p></div></article>`).join('');
  const path=data.get('solar')==='yes'?'EMI Line Monitor → Pure Power Solar Duty':size>=3000?'EMI Line Monitor → whole-home evaluation':'EMI Line Monitor → targeted Plug-In filtration';
  const priorities=[data.get('solar')==='yes'?'solar':'no solar',data.get('pool')==='yes'?'pool equipment':null,data.get('wifi')==='yes'?'sleep-area Wi-Fi':null,data.get('mold')==='yes'?'moisture first':null].filter(Boolean);
  if(planStatus)planStatus.innerHTML='<i></i> PLAN READY · 5 ANSWERS ANALYZED';
  if(planTitle)planTitle.innerHTML='Your PurePower<br><span>starting plan.</span>';
  if(planSummary)planSummary.innerHTML=`<b>Recommended path</b><strong>${path}</strong><small>${formatSize(size)} · ${priorities.join(' · ')}</small>`;
  if(assessmentButton)assessmentButton.innerHTML='Update my home plan <span>✓</span>';
  const homePlan=document.querySelector('#home-plan');
  homePlan?.classList.remove('is-ready');requestAnimationFrame(()=>homePlan?.classList.add('is-ready'));
  homePlan?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
});
