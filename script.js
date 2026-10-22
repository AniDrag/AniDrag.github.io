function $(selector, parent = document) {
  return parent.querySelector(selector);
}

function createTag(text) {
  const span = document.createElement("span");
  span.className = "tag";
  span.textContent = text;
  return span;
}

function getTeamMemberText(member) {
  if (typeof member === "string") {
    return member;
  }

  return `${member.name} - ${member.role}`;
}

function renderTeamMember(member) {
  const row = document.createElement("div");
  row.className = "team-member";

  if (typeof member === "string") {
    row.innerHTML = `<span>${member}</span>`;
    return row;
  }

  const hasLink = member.url && member.url !== "#";

  row.innerHTML = `
    <div class="team-member-info">
      <strong>${member.name}</strong>
      <span>${member.role}</span>
    </div>
    ${
      hasLink
        ? `<a href="${member.url}" target="_blank" rel="noreferrer">Portfolio</a>`
        : `<span class="no-link">No page yet</span>`
    }
  `;

  return row;
}

function gameUrl(game) {
  return `game.html?id=${encodeURIComponent(game.id)}`;
}

function renderGameCard(game) {
  const card = document.createElement("a");
  card.className = "game-card";
  card.href = gameUrl(game);
  card.innerHTML = `
    <img src="${game.capsule}" alt="${game.name} image" loading="lazy">
    <div class="game-card-body">
      <h3>${game.name}</h3>
      <p>${game.tagline}</p>
      <div class="tag-row"></div>
    </div>
  `;

  const tagRow = $(".tag-row", card);
  game.type.slice(0, 4).forEach(type => tagRow.appendChild(createTag(type)));
  return card;
}

function renderFeaturedGames() {
  const target = $("[data-featured-games]");
  if (!target) return;

  target.innerHTML = "";
  window.PORTFOLIO_GAMES.forEach(game => target.appendChild(renderGameCard(game)));
}

function renderGamesLibrary() {
 const target = $('[data-games-library]'); if (!target) return;
 const filters=$('[data-game-filters]'), search=$('#game-search'), sort=$('#game-sort');
 let selected='all';
 function draw(){
  const query=(search?.value || '').trim().toLowerCase();
  let games=window.PORTFOLIO_GAMES.filter(g=>(selected==='all'||g.type.includes(selected)) && [g.name,g.tagline,g.role,...g.type].join(' ').toLowerCase().includes(query));
  if(sort?.value==='az') games.sort((a,b)=>a.name.localeCompare(b.name));
  target.replaceChildren(...games.map(renderGameCard));
  $('[data-library-count]').textContent=games.length+' of '+window.PORTFOLIO_GAMES.length+' projects';
  if(!games.length){const empty=document.createElement('div'); empty.className='empty-library'; empty.innerHTML='<h3>No projects found</h3><p>Try another search or choose a different tag.</p>'; const reset=document.createElement('button'); reset.className='button secondary'; reset.textContent='Reset filters'; reset.onclick=()=>{search.value=''; filters.querySelector('button').click();}; empty.append(reset);target.append(empty);}
 }
 ['all',...new Set(window.PORTFOLIO_GAMES.flatMap(g=>g.type))].forEach(value=>{
  const b=document.createElement('button');b.className='filter-btn';b.textContent=value==='all'?'All projects':value;b.setAttribute('aria-pressed',value==='all');b.classList.toggle('active',value==='all');
  b.onclick=()=>{selected=value;filters.querySelectorAll('button').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',x===b);});draw();};filters.append(b);
 });
 search?.addEventListener('input',draw);sort?.addEventListener('change',draw);draw();
}

function renderGamePage() {
  const page = $("[data-game-page]");
  if (!page) return;

  const params = new URLSearchParams(location.search);
  const id = params.get("id") || window.PORTFOLIO_GAMES[0].id;
  const game = window.PORTFOLIO_GAMES.find(item => item.id === id) || window.PORTFOLIO_GAMES[0];

  const crumb=$('[data-breadcrumb-name]'); if(crumb) crumb.textContent=game.name;
  const role=$('[data-contribution-role]'); if(role) role.textContent=game.role;
  const details=$('[data-contribution-details]');
  if(details && game.contributions?.length){details.hidden=false;game.contributions.forEach(text=>{const li=document.createElement('li');li.textContent=text;details.append(li);});}
  const toolkit=$('[data-contribution-skills]'); if(toolkit) game.skills.forEach(skill=>toolkit.append(createTag(skill)));
  const related=$('[data-related-games]'); if(related) window.PORTFOLIO_GAMES.filter(g=>g.id!==game.id).slice(0,3).forEach(g=>related.append(renderGameCard(g)));
  document.title = `${game.name} | AniDrag Portfolio`;

  const hero = $("[data-game-hero]");
  if (hero) hero.style.backgroundImage = `url('${game.banner}')`;

  $("[data-game-name]").textContent = game.name;
  $("[data-game-tagline]").textContent = game.tagline;
  $("[data-game-about]").textContent = game.about;
  $("[data-game-core]").textContent = game.coreGameplay;
  $("[data-game-lore]").textContent = game.lore;

  const tagRow = $("[data-game-tags]");
  tagRow.innerHTML = "";
  game.type.forEach(type => tagRow.appendChild(createTag(type)));

  const stats = $("[data-game-stats]");
  stats.innerHTML = `
    <div class="stat-item"><strong>Role</strong><span>${game.role}</span></div>
    <div class="stat-item"><strong>Status</strong><span>${game.status}</span></div>
    <div class="stat-item"><strong>Type</strong><span>${game.type.join(", ")}</span></div>
  `;

  if(game.duration){const item=document.createElement('div');item.className='stat-item';const title=document.createElement('strong');title.textContent='Duration';const value=document.createElement('span');value.textContent=game.duration;item.append(title,value);stats.append(item);}
  const teamList = $("[data-game-team]");
  if (teamList) {
    teamList.innerHTML = "";
    game.team.forEach(member => teamList.appendChild(renderTeamMember(member)));
  }

  const links = $("[data-game-links]");
  links.innerHTML = "";
  game.links.forEach(link => {
    const a = document.createElement("a");
    a.className = "button secondary";
    a.href = link.url;
    a.textContent = link.label;
    if (link.url !== "#") {
      a.target = "_blank";
      a.rel = "noreferrer";
    }
    links.appendChild(a);
  });

  const skills = $("[data-game-skills]");
  if (skills) {
    skills.innerHTML = "";
    game.skills.forEach(skill => skills.appendChild(createTag(skill)));
  }

  const screenshots = $("[data-game-screenshots]");
  screenshots.innerHTML = "";
  game.screenshots.forEach(src => {
    const img = document.createElement("img");
    img.src = src;
    img.alt = `${game.name} screenshot`;
    img.loading = "lazy";
    img.tabIndex=0; img.setAttribute("role", "button"); img.setAttribute("aria-label", `Enlarge ${game.name} screenshot`);
    img.addEventListener("keydown", e=>{if(e.key==="Enter" || e.key===" "){e.preventDefault();openLightbox(src);}});
    img.addEventListener("click", () => openLightbox(src));
    screenshots.appendChild(img);
  });
}

function renderGallery() {
  const target = $("[data-gallery]");
  if (!target) return;

  const filters = $("[data-gallery-filters]");
  const groups = [...new Set(window.PORTFOLIO_GALLERY.map(item => item.group))].sort();

  function draw(filter = "all") {
    target.innerHTML = "";
    window.PORTFOLIO_GALLERY
      .filter(item => filter === "all" || item.group === filter)
      .forEach(item => {
        const button = document.createElement("button");
        button.className = "gallery-item";
        button.innerHTML = `<img src="${item.src}" alt="${item.title}" loading="lazy"><span>${item.title}</span>`;
        button.addEventListener("click", () => openLightbox(item.src));
        target.appendChild(button);
      });
  }

  if (filters) {
    filters.innerHTML = "";
    ["all", ...groups].forEach(filter => {
      const button = document.createElement("button");
      button.className = "filter-btn";
      button.textContent = filter === "all" ? "All" : filter;
      if (filter === "all") button.classList.add("active");
      button.addEventListener("click", () => {
        filters.querySelectorAll("button").forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");
        draw(filter);
      });
      filters.appendChild(button);
    });
  }

  draw();
}

let lightboxTrigger;
function openLightbox(src) {
 const box=$('.lightbox');if(!box || !src)return;
 lightboxTrigger=document.activeElement;
 $('img',box).src=src;box.classList.add('open');box.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';$('button',box).focus();
}
function setupLightbox(){
 const box=$('.lightbox');if(!box)return;
 box.setAttribute('role','dialog');box.setAttribute('aria-modal','true');box.setAttribute('aria-label','Image preview');
 function close(){box.classList.remove('open');box.setAttribute('aria-hidden','true');document.body.style.overflow='';lightboxTrigger?.focus();}
 $('button',box).addEventListener('click',close);
 box.addEventListener('click',e=>{if(e.target===box)close();});
 box.addEventListener('keydown',e=>{if(e.key==='Escape')close();if(e.key==='Tab'){e.preventDefault();$('button',box).focus();}});
}

function setActiveNav() {
  const current = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach(link => {
    const href = link.getAttribute("href");
    if (href === current || (current === "" && href === "index.html")) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });
}

renderFeaturedGames();
renderGamesLibrary();
renderGamePage();
renderGallery();
setupLightbox();
setActiveNav();

function renderSpotlight(){
 const target=$('[data-spotlight]'), selectors=$('[data-spotlight-selector]');if(!target)return;
 const games=window.PORTFOLIO_GAMES.slice(0,2);
 function select(game){
  target.innerHTML=`<div class="spotlight-grid"><a class="spotlight-art" href="${gameUrl(game)}"><img src="${game.banner}" alt="${game.name}"><span class="art-caption">Explore project ↗</span></a><div class="spotlight-copy"><div class="kicker">Featured project</div><h2>${game.name}</h2><p>${game.tagline}</p><div class="tag-row"></div><div class="spotlight-role"><span>My role</span><strong>${game.role}</strong></div><a class="button" href="${gameUrl(game)}">Explore the game →</a></div></div>`;
  game.type.slice(0,4).forEach(t=>$('.tag-row',target).append(createTag(t)));
  selectors.querySelectorAll('button').forEach(b=>{const active=b.dataset.id===game.id;b.classList.toggle('active',active);b.setAttribute('aria-pressed',active);});
 }
 games.forEach((g,i)=>{const b=document.createElement('button');b.dataset.id=g.id;b.innerHTML='<span>0'+(i+1)+'</span> '+g.name;b.onclick=()=>select(g);selectors.append(b);});select(games[0]);
}
function renderCV(){const target=$('[data-cv-projects]');if(!target)return;window.PORTFOLIO_GAMES.forEach(g=>{const entry=document.createElement('article');entry.className='cv-project';const title=document.createElement('a');title.href=gameUrl(g);title.textContent=g.name+' ↗';const role=document.createElement('p');role.textContent=g.role;const tags=document.createElement('div');tags.className='tag-row';g.type.forEach(t=>tags.append(createTag(t)));entry.append(title,role,tags);target.append(entry);});}
renderSpotlight();renderCV();
