// Interaktif kecil: search yang menyorot kata pada konten
document.getElementById('searchBtn').addEventListener('click', function(){
  const q = document.getElementById('q').value.trim();
  if(!q) return alert('Ketik kata kunci.');
  // cari dan scroll ke bagian yang cocok
  const content = document.querySelector('main');
  const el = Array.from(content.querySelectorAll('h3, p, li'))
    .find(n => n.textContent.toLowerCase().includes(q.toLowerCase()));
  if(el){
    el.scrollIntoView({behavior:'smooth', block:'center'});
    el.style.transition = 'background 0.6s';
    const orig = el.style.background;
    el.style.background = 'linear-gradient(90deg,#fffbeb,#fff7ed)';
    setTimeout(()=> el.style.background = orig, 1600);
  } else {
    alert('Tidak ditemukan di catatan singkat. Coba kursus atau tanya tutor.');
  }
});

// Dark mode toggle
document.getElementById('toggleMode').addEventListener('click', function(){
  document.body.classList.toggle('dark');
  this.textContent = document.body.classList.contains('dark') ? '☀' : '🌙';
});