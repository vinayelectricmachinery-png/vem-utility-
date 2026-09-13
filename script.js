(()=>{const root=document.getElementById('app'),pages=[...root.querySelectorAll('.page')],nav=[...root.querySelectorAll('[data-nav]')];function show(id){pages.forEach(p=>p.classList.toggle('active',p.id===id));nav.forEach(n=>n.classList.toggle('active',n.dataset.nav===id));window.scrollTo({top:0,behavior:'smooth'})}

root.querySelectorAll('[data-info]').forEach(x=>x.addEventListener('click',()=>show(x.dataset.info)));
const taglines=[...root.querySelectorAll('.tagline')];let taglineIndex=0;
setInterval(()=>{if(taglines.length){taglines[taglineIndex].classList.remove('active');taglineIndex=(taglineIndex+1)%taglines.length;taglines[taglineIndex].classList.add('active')}},3000);
root.querySelectorAll('[data-open]').forEach(x=>x.addEventListener('click',()=>show(x.dataset.open)));root.querySelectorAll('[data-home]').forEach(x=>x.addEventListener('click',()=>show('home')));nav.forEach(x=>x.addEventListener('click',()=>show(x.dataset.nav)));
function theme(t){document.documentElement.classList.toggle('light',t==='light');document.getElementById('dark').classList.toggle('active',t==='dark');document.getElementById('light').classList.toggle('active',t==='light')}document.getElementById('dark').onclick=()=>theme('dark');document.getElementById('light').onclick=()=>theme('light');
const swg={18:1.219,19:1.016,20:.914,21:.813,22:.711,23:.610,24:.559,25:.508,26:.457,27:.417,28:.376,29:.345,30:.315};
document.getElementById('swgBtn').onclick=()=>{let s=document.getElementById('swgIn').value.split('+').map(x=>x.trim()).filter(Boolean),kg=+document.getElementById('kg').value,o=document.getElementById('swgOut'),a=s.map(x=>swg[x]?Math.PI*(swg[x]/2)**2:0);if(!s.length||kg<=0||a.some(x=>!x)){o.innerHTML='<span style="color:#f06b82">Enter valid values. Sample SWG table supports 18–30.</span>';return}let sum=a.reduce((x,y)=>x+y,0);o.innerHTML='<small>Individual weights</small><table>'+s.map((x,i)=>`<tr><td>${x} SWG</td><td class="right">${(kg*a[i]/sum).toFixed(3)} kg</td></tr>`).join('')+`<tr><td><b>Total</b></td><td class="right">${kg.toFixed(3)} kg</td></tr></table>`};
document.getElementById('ubtn').onclick=()=>{let v=+document.getElementById('uv').value,d=document.getElementById('ud').value,o=document.getElementById('uout');if(!Number.isFinite(v)){o.textContent='Enter a valid value.';return}o.innerHTML=d==='im'?`<small>Result</small><div class="big">${(v*25.4).toFixed(3)} mm</div>`:`<small>Result</small><div class="big">${(v/25.4).toFixed(4)} in</div>`};
let bearings=[];

fetch('data/bearings.json')
  .then(r=>{
    if(!r.ok) throw new Error('Bearing database not found');
    return r.json();
  })
  .then(d=>{
    bearings=Array.isArray(d)
      ? d
      : (Array.isArray(d.records) ? d.records : []);

    document.getElementById('bbtn').click();
  })
  .catch(err=>{
    console.error(err);
  });


// ------------------------------------
// Bearing Search Mode
// ------------------------------------

const bearingMode=document.getElementById('bearingMode');
const dimensionSearch=document.getElementById('dimensionSearch');
const numberSearch=document.getElementById('numberSearch');

bearingMode.onchange=()=>{
  const mode=bearingMode.value;

  if(mode==='dimensions'){
    dimensionSearch.style.display='';
    numberSearch.style.display='none';
    document.getElementById('bbtn').click();
  }else{
    dimensionSearch.style.display='none';
    numberSearch.style.display='';
    document.getElementById('bout').innerHTML='';
    document.getElementById('bearingNumber').focus();
  }
};


// ------------------------------------
// ID + OD + Width → Bearing Number
// ------------------------------------

document.getElementById('bbtn').onclick=()=>{
  let i=+document.getElementById('bi').value;
  let o=+document.getElementById('bo').value;
  let w=+document.getElementById('bw').value;
  let r=document.getElementById('bout');

  let matches=bearings.filter(z=>
    Number(z.id)===i &&
    Number(z.od)===o &&
    Number(z.width)===w
  );

  if(matches.length){
    r.innerHTML=
      `<small>Matching bearing${matches.length>1?'s':''}</small>`+
      matches.map(x=>
        `<div class="big">${x.number}</div>
         <div>${i} × ${o} × ${w} mm · ${x.series} series</div>`
      ).join('');
  }else{
    r.innerHTML=
      '<span style="color:var(--muted)">No exact match in the local bearing reference.</span>';
  }
};


// ------------------------------------
// Bearing Number → ID + OD + Width
// ------------------------------------

document.getElementById('bnbtn').onclick=()=>{
  let number=document
    .getElementById('bearingNumber')
    .value
    .trim()
    .toUpperCase();

  let r=document.getElementById('bout');

  if(!number){
    r.innerHTML=
      '<span style="color:var(--muted)">Enter a bearing number.</span>';
    return;
  }

  let matches=bearings.filter(x=>
    String(x.number).trim().toUpperCase()===number
  );

  if(matches.length){
    r.innerHTML=
      `<small>Bearing dimensions</small>`+
      matches.map(x=>
        `<div class="big">${x.number}</div>
         <div>ID: <b>${x.id} mm</b></div>
         <div>OD: <b>${x.od} mm</b></div>
         <div>Width: <b>${x.width} mm</b></div>
         <div>${x.series} series · ${x.type.replaceAll('_',' ')}</div>`
      ).join('');
  }else{
    r.innerHTML=
      '<span style="color:var(--muted)">Bearing number not found in the local bearing reference.</span>';
  }
};


// Press Enter in bearing number field
document.getElementById('bearingNumber').addEventListener('keydown',e=>{
  if(e.key==='Enter'){
    document.getElementById('bnbtn').click();
  }
});
document.getElementById('tbtn').onclick=()=>{let [mm,inch]=document.getElementById('tapSel').value.split('|');document.getElementById('tout').innerHTML=`<small>Recommended tap drill</small><div class="big">${mm} mm</div><div>${inch}</div>`};
document.getElementById('search').oninput=e=>{let q=e.target.value.toLowerCase();let n=0;root.querySelectorAll('.card').forEach(c=>{let yes=c.textContent.toLowerCase().includes(q);c.style.display=yes?'':'none';if(yes)n++});document.getElementById('count').textContent=n+' tool'+(n===1?'':'s')};
document.getElementById('swgBtn').click();document.getElementById('ubtn').click();document.getElementById('bbtn').click();document.getElementById('tbtn').click();
})();
