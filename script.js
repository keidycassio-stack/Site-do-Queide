const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];

// tema claro/escuro
try{const t=localStorage.getItem('th');if(t)document.documentElement.dataset.theme=t}catch(e){}
$('#theme').onclick=()=>{
  const d=document.documentElement,
  dark=d.dataset.theme?d.dataset.theme==='dark':matchMedia('(prefers-color-scheme:dark)').matches;
  d.dataset.theme=dark?'light':'dark';
  try{localStorage.setItem('th',d.dataset.theme)}catch(e){}
};

// barra de progresso + menu ativo
const secs=$$('section[id]'),links=$$('#links a');
addEventListener('scroll',()=>{
  const h=document.documentElement;
  $('#bar').style.width=(h.scrollTop/(h.scrollHeight-h.clientHeight)*100)+'%';
  let cur='';
  secs.forEach(s=>{if(s.getBoundingClientRect().top<140)cur=s.id});
  links.forEach(a=>a.classList.toggle('on',a.hash==='#'+cur));
},{passive:true});

// animação ao fazer scroll
const io=new IntersectionObserver(e=>e.forEach(x=>{
  if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}
}),{threshold:.08});
$$('.rv').forEach(el=>io.observe(el));

// separadores (tabs) da instalação
$$('#tabs button').forEach(b=>b.onclick=()=>{
  $$('#tabs button').forEach(x=>x.classList.toggle('on',x===b));
  $$('.pane').forEach(p=>p.classList.toggle('on',p.id===b.dataset.t));
});

// explorador de comandos
const C=[
['pwd','Mostra o diretório atual','pwd','Ficheiros'],['ls','Lista ficheiros e pastas','ls -la','Ficheiros'],['cd','Muda de diretório','cd /home/aluno','Ficheiros'],
['mkdir','Cria uma pasta','mkdir projeto','Ficheiros'],['touch','Cria um ficheiro vazio','touch notas.txt','Ficheiros'],['cp','Copia ficheiros','cp a.txt b.txt','Ficheiros'],
['mv','Move ou renomeia','mv a.txt docs/','Ficheiros'],['rm','Apaga ficheiros (cuidado!)','rm -r pasta/','Ficheiros'],['cat','Mostra o conteúdo','cat notas.txt','Texto'],
['grep','Procura texto','grep -i "erro" log.txt','Texto'],['nano','Editor de texto no terminal','nano ficheiro.txt','Texto'],['head / tail','Início ou fim de um ficheiro','tail -n 20 log.txt','Texto'],
['chmod','Altera permissões','chmod 755 script.sh','Permissões'],['chown','Altera o dono','sudo chown aluno ficheiro','Permissões'],['sudo','Executa como administrador','sudo apt update','Permissões'],
['apt','Gere pacotes (Debian/Ubuntu)','sudo apt install vlc','Sistema'],['ps','Lista processos','ps aux','Sistema'],['top','Monitor de processos','top','Sistema'],
['kill','Termina um processo','kill 1234','Sistema'],['df','Espaço em disco','df -h','Sistema'],['uname','Informação do sistema','uname -a','Sistema'],
['ping','Testa ligação à rede','ping -c 4 google.com','Rede'],['ip','Mostra interfaces e IPs','ip a','Rede'],['man','Manual de um comando','man ls','Ajuda']];

const cats=['Todos',...new Set(C.map(c=>c[3]))];
let cat='Todos';

$('#cats').innerHTML=cats.map(c=>`<button class="chip${c===cat?' on':''}">${c}</button>`).join(' ');

function draw(){
  const q=$('#q').value.toLowerCase();
  $('#cmds').innerHTML=C
    .filter(c=>(cat==='Todos'||c[3]===cat)&&(c[0]+c[1]+c[2]).toLowerCase().includes(q))
    .map(c=>`<div class="cmd" data-c="${c[2]}"><span class="cp">copiar</span><div class="n">${c[0]}</div><div class="d">${c[1]}</div><code>$ ${c[2]}</code></div>`)
    .join('')||'<p>Sem resultados.</p>';
}

$('#cats').onclick=e=>{
  if(e.target.classList.contains('chip')){
    cat=e.target.textContent;
    $$('#cats .chip').forEach(x=>x.classList.toggle('on',x===e.target));
    draw();
  }
};

$('#q').oninput=draw;

$('#cmds').onclick=e=>{
  const c=e.target.closest('.cmd');
  if(!c)return;
  try{navigator.clipboard.writeText(c.dataset.c)}catch(x){}
  const s=c.querySelector('.cp');
  s.textContent='copiado ✓';
  setTimeout(()=>s.textContent='copiar',1200);
};

draw();