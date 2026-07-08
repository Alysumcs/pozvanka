/* ============================================================
   Svadobné oznámenie — Michal & Janka (app.js) — vlastný kód
   ============================================================ */
(function(){
  'use strict';
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var cover=document.getElementById('cover'),
      main=document.getElementById('main'),
      music=document.getElementById('music'),
      openVid=document.getElementById('openVid'),
      heroVid=document.getElementById('heroVid'),
      hero=document.getElementById('hero'),
      bgm=document.getElementById('bgm');
  var opened=false, playing=false;

  /* ── Otvorenie obálky ── */
  function reveal(){
    if(!cover) return;
    cover.classList.add('gone');
    if(main) main.classList.add('show');
    if(music) music.classList.add('show');
    document.body.style.overflow='auto';
    startPetals();
    playHero();
  }
  function open(){
    if(opened) return; opened=true;
    if(cover) cover.classList.add('playing');
    playMusic();
    var done=false;
    function go(){ if(done) return; done=true; reveal(); }
    if(openVid){
      var p=openVid.play(); if(p&&p.catch)p.catch(function(){});
      openVid.addEventListener('ended',go);
      setTimeout(go, 3200);
    }else{
      setTimeout(go, 700);
    }
  }
  if(cover){ document.body.style.overflow='hidden'; cover.addEventListener('click',open); }

  /* ── Hero: statické → potom video ── */
  function playHero(){
    if(!heroVid||!hero) return;
    setTimeout(function(){
      var p=heroVid.play();
      if(p&&p.then){ p.then(function(){ hero.classList.add('video-on'); }).catch(function(){}); }
      else { hero.classList.add('video-on'); }
    }, 500);
  }

  /* ── Hudba ── */
  function playMusic(){ if(!bgm) return; try{ bgm.volume=.7; var p=bgm.play(); if(p&&p.then){ p.then(function(){ playing=true; music&&music.classList.remove('paused'); }).catch(function(){}); } }catch(e){} }
  function pauseMusic(){ if(!bgm) return; bgm.pause(); playing=false; music&&music.classList.add('paused'); }
  if(music) music.addEventListener('click',function(){ playing?pauseMusic():playMusic(); });

  /* ── Padajúce lupienky (ružové) ── */
  var PCOLS=['#E3A79B','#D98C86','#E8B7A8','#CE8578','#EBC9B6','#C77F70'];
  function petalSVG(s,c){
    return '<svg width="'+s+'" height="'+(s*1.08)+'" viewBox="0 0 24 26">'
      +'<path d="M12 25C4.5 19.5 1.8 12.5 4 7.6 5.6 3.8 9 3 12 6 15 3 18.4 3.8 20 7.6 22.2 12.5 19.5 19.5 12 25Z" fill="'+c+'"/>'
      +'<path d="M12 24.4C9.2 18.6 8.3 12.6 9.3 7.8" stroke="rgba(255,255,255,.28)" stroke-width="1" fill="none"/>'
      +'<path d="M12 6.4C13.6 4.6 16 4.8 17.6 7.4" stroke="rgba(255,255,255,.32)" stroke-width="1" fill="none"/>'
      +'</svg>';
  }
  function startPetals(){
    if(reduce) return;
    var box=document.getElementById('petals'); if(!box) return;
    var N=window.innerWidth<420?11:16;
    for(var i=0;i<N;i++) spawn(i*520,i);
    function spawn(delay,i){
      setTimeout(function(){
        var p=document.createElement('div'); p.className='petal';
        var depth=Math.random(), s=(14-depth*6)+Math.random()*4, c=PCOLS[Math.floor(Math.random()*PCOLS.length)];
        p.style.left=(Math.random()*100)+'%'; p.style.filter=depth>.7?'blur(1.3px)':'none'; p.style.opacity=(1-depth*.4);
        p.innerHTML=petalSVG(s,c); box.appendChild(p);
        var dur=(9000+Math.random()*6000)*(0.7+depth*0.6), drift=(Math.random()*80-40), rot=Math.random()*900-450, ph=Math.random()*6, start=performance.now();
        (function fall(now){
          var t=(now-start)/dur; if(t>=1){ p.remove(); spawn(0,i); return; }
          var y=t*(window.innerHeight+50), x=Math.sin(t*5+ph)*drift;
          p.style.transform='translate('+x+'px,'+y+'px) rotate('+(rot*t)+'deg)';
          requestAnimationFrame(fall);
        })(start);
      },delay);
    }
  }

  /* ── Countdown ── */
  (function(){
    var el=document.getElementById('cd'); if(!el) return;
    var target=new Date(el.dataset.date).getTime();
    var d=document.getElementById('cd-d'),h=document.getElementById('cd-h'),m=document.getElementById('cd-m'),s=document.getElementById('cd-s');
    function tick(){
      var diff=target-Date.now(); if(diff<0)diff=0;
      d.textContent=Math.floor(diff/864e5);
      h.textContent=String(Math.floor(diff%864e5/36e5)).padStart(2,'0');
      m.textContent=String(Math.floor(diff%36e5/6e4)).padStart(2,'0');
      s.textContent=String(Math.floor(diff%6e4/1e3)).padStart(2,'0');
    }
    tick(); setInterval(tick,1000);
  })();

  /* ── Pohyblivá ruža na časovej osi (podľa scrollu) ── */
  (function(){
    var tl=document.getElementById('tl'), rose=document.getElementById('tlRose'), lineTop=18, ticking=false;
    if(!tl||!rose) return;
    function upd(){
      var r=tl.getBoundingClientRect(), vh=window.innerHeight;
      var prog=(vh - r.top)/(vh + r.height);
      prog=Math.max(0,Math.min(1,prog));
      var usable=r.height-2*lineTop;
      rose.style.top=(lineTop + prog*usable)+'px';
      ticking=false;
    }
    window.addEventListener('scroll',function(){ if(!ticking){ ticking=true; requestAnimationFrame(upd); } },{passive:true});
    window.addEventListener('resize',upd); upd();
  })();

  /* ── RSVP modal ── */
  (function(){
    var modal=document.getElementById('rsvpModal'); if(!modal) return;
    var openB=document.getElementById('sealBtn'), closeB=document.getElementById('rsvpClose'),
        doneB=document.getElementById('rsvpDone'), f=document.getElementById('rsvp'), thanks=document.getElementById('rsvpThanks');
    function op(){ modal.classList.add('open'); modal.setAttribute('aria-hidden','false'); }
    function cl(){ modal.classList.remove('open'); modal.setAttribute('aria-hidden','true'); }
    if(openB) openB.addEventListener('click',op);
    if(closeB) closeB.addEventListener('click',cl);
    if(doneB) doneB.addEventListener('click',cl);
    modal.addEventListener('click',function(e){ if(e.target===modal)cl(); });
    document.addEventListener('keydown',function(e){ if(e.key==='Escape')cl(); });
    if(f) f.addEventListener('submit',function(e){ e.preventDefault();
      if(document.getElementById('r-name').value.trim().length<2){ document.getElementById('r-name').focus(); return; }
      f.style.display='none'; thanks.classList.add('show');
    });
  })();

  /* ── Scroll reveal ── */
  (function(){
    var els=document.querySelectorAll('.rv');
    if(!('IntersectionObserver'in window)){ els.forEach(function(e){e.classList.add('in')}); return; }
    var io=new IntersectionObserver(function(en){ en.forEach(function(x){ if(x.isIntersecting){ x.target.classList.add('in'); io.unobserve(x.target); } }); },{threshold:.12,rootMargin:'0px 0px -8% 0px'});
    els.forEach(function(e){ io.observe(e); });
  })();
})();
