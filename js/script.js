const projects = [
  {id:1,title:'Chatbot de Atendimento',desc:'Um chatbot que responde perguntas comuns e integra com API.',tags:['AI','Node.js'],link:'#',image:null,notes:'Tecnologias: Node.js, Express, Rasa (opcional).'} ,
  {id:2,title:'Portfolio Pessoal',desc:'Site responsivo para mostrar trabalhos e currículo.',tags:['Web','HTML','CSS'],link:'#',image:'https://via.placeholder.com/400x200.png?text=Portfolio'},
  {id:3,title:'App de Finanças',desc:'App mobile para controlar gastos e metas.',tags:['Mobile','React Native'],link:'#',video:'https://www.youtube.com/embed/dQw4w9WgXcQ',notes:'Demonstração disponível em vídeo.'},
  {id:4,title:'Jogo 2D',desc:'Plataforma de jogo com fases e sistema de pontuação.',tags:['Game','JavaScript'],link:'#',image:null,notes:'Assets criados em pixel art; engine custom.'},
  {id:5,title:'Biblioteca de Músicas',desc:'Aplicação para organizar, tocar e compartilhar playlists de músicas.',tags:['Música','Web','JavaScript'],link:'#',image:'https://via.placeholder.com/400x200.png?text=Música',spotify:'https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M'}
];

const grid = document.getElementById('grid');
const tagsEl = document.getElementById('tags');
const search = document.getElementById('search');

const allTags = [...new Set(projects.flatMap(p=>p.tags))];

function renderTags(){
  tagsEl.innerHTML = '';
  const btnAll = document.createElement('button');
  btnAll.className='tag active'; btnAll.textContent='Todas'; btnAll.dataset.tag='';
  tagsEl.appendChild(btnAll);
  allTags.forEach(t=>{
    const b = document.createElement('button');
    b.className='tag'; b.textContent=t; b.dataset.tag=t;
    tagsEl.appendChild(b);
  });
}

function cardHTML(p){
  const initials = p.title.split(' ').slice(0,2).map(s=>s[0]).join('');
  const thumb = p.image
    ? `<img class="thumb" src="${p.image}" alt="Imagem de ${p.title}">`
    : `<div class="thumb" aria-hidden="true">${initials}</div>`;
  const musicIndicator = p.tags.includes('Música') ? `<div style="margin-top:8px" class="music-badge">🎧 Músicas</div>` : '';
  return `
    <article class="card" data-id="${p.id}">
      ${thumb}
      <div>
        <div class="meta"><div class="title">${p.title}</div><div class="desc">${p.tags.join(' • ')}</div></div>
        <p class="desc">${p.desc}</p>
        <div class="badges">${p.tags.map(t=>`<span class="badge">${t}</span>`).join('')}</div>
        ${musicIndicator}
      </div>
      <div class="actions">
        <button class="btn" data-action="view">Ver</button>
        <a class="btn primary" href="${p.link}" target="_blank" rel="noopener">Abrir</a>
      </div>
    </article>
  `;
}

function renderGrid(list){
  grid.innerHTML = list.map(cardHTML).join('\n');
}

let activeTag = '';
function applyFilters(){
  const q = search.value.trim().toLowerCase();
  let filtered = projects.filter(p=>{
    const inTag = activeTag? p.tags.includes(activeTag) : true;
    const inQuery = q? (p.title + ' ' + p.desc + ' ' + p.tags.join(' ')).toLowerCase().includes(q) : true;
    return inTag && inQuery;
  });
  renderGrid(filtered);
}

tagsEl.addEventListener('click', e=>{
  const b = e.target.closest('.tag'); if(!b) return;
  document.querySelectorAll('.tag').forEach(t=>t.classList.remove('active'));
  b.classList.add('active');
  activeTag = b.dataset.tag;
  applyFilters();
});

search.addEventListener('input', applyFilters);

grid.addEventListener('click', e=>{
  const btn = e.target.closest('[data-action]');
  if(!btn) return;
  const article = btn.closest('.card');
  const id = Number(article.dataset.id);
  const p = projects.find(x=>x.id===id);
  openModal(p);
});

const modal = document.getElementById('modal');
const close = document.getElementById('close');

function openModal(p){
  document.getElementById('m-title').textContent = p.title;
  document.getElementById('m-desc').textContent = p.desc;

  let extra = '';
  if(p.spotify){
    extra += `<div style="margin-bottom:12px;">
      <div style="position:relative;padding-top:56.25%;border-radius:8px;overflow:hidden;background:#000;">
        <iframe src="${p.spotify}" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;"
          allow="encrypted-media; clipboard-write; autoplay; fullscreen; picture-in-picture" loading="lazy"></iframe>
      </div>
    </div>`;
  }
  if(p.video){
    extra += `<div style="margin-bottom:12px;">
      <div style="position:relative;padding-top:56.25%;border-radius:8px;overflow:hidden;background:#000;">
        <iframe src="${p.video}" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen loading="lazy"></iframe>
      </div>
    </div>`;
  }
  if(p.image){
    extra += `<div style="margin-bottom:12px;">
      <img src="${p.image}" alt="Imagem do projeto ${p.title}" style="width:100%;border-radius:8px;">
    </div>`;
  }

  extra += `<p style="color:var(--muted)">${p.notes || ''}</p>`;
  extra += `<p style="margin-top:8px;color:var(--muted)"><strong>Tags:</strong> ${p.tags.join(', ')}</p>`;

  document.getElementById('m-extra').innerHTML = extra;
  modal.classList.add('open'); modal.setAttribute('aria-hidden','false');
}

function closeModal(){ modal.classList.remove('open'); modal.setAttribute('aria-hidden','true'); }
close.addEventListener('click', closeModal);
modal.addEventListener('click', e=>{ if(e.target===modal) closeModal(); });

renderTags(); renderGrid(projects);
search.addEventListener('keydown', e=>{ if(e.key==='Escape') { search.value=''; applyFilters(); } });