(() => {
const data = window.CROSSWORD_DATA;
const grid = document.getElementById("crossword-grid");
const acrossHost = document.getElementById("across-clues");
const downHost = document.getElementById("down-clues");
const cells = new Map(), inputs = new Map();
let activeEntry = null;
const key = (r,c) => `${r},${c}`;
data.entries.forEach(e => [...e.word].forEach((letter,i) => {
  const r=e.r+(e.dir==="down"?i:0), c=e.c+(e.dir==="across"?i:0), k=key(r,c);
  if(cells.has(k) && cells.get(k).letter!==letter) console.warn("Letter crossing mismatch",k);
  const cell=cells.get(k)||{r,c,letter,numbers:[]}; cell.letter=letter;
  if(i===0) cell.numbers.push(e.n); cells.set(k,cell);
}));
const maxW = Math.min(40, Math.floor((window.innerWidth-70)/data.width));
grid.style.gridTemplateColumns = `repeat(${data.width}, minmax(18px, ${maxW}px))`;
function renderGrid(){
  for(let r=0;r<data.height;r++) for(let c=0;c<data.width;c++){
    const d=cells.get(key(r,c)), el=document.createElement("div");
    if(!d){el.className="cell block";grid.appendChild(el);continue;}
    el.className="cell";el.dataset.cell=key(r,c);
    if(d.numbers.length){const n=document.createElement("span");n.className="number";n.textContent=Math.min(...d.numbers);el.appendChild(n);}
    const input=document.createElement("input");input.maxLength=1;input.autocomplete="off";input.spellcheck=false;
    input.setAttribute("aria-label",`Row ${r+1}, column ${c+1}`);
    if(d.numbers.length)input.classList.add("has-number");
    input.addEventListener("focus",()=>{const matching=data.entries.filter(e=>[...e.word].some((_,i)=>e.r+(e.dir==="down"?i:0)===r&&e.c+(e.dir==="across"?i:0)===c));if(matching.length)selectEntry(matching.find(e=>e.dir===activeEntry?.dir)||matching[0]);});
    input.addEventListener("input",()=>{input.value=input.value.replace(/[^a-z]/gi,"").toUpperCase().slice(-1);clearMark(el);updateProgress();if(input.value)moveNext(r,c);});
    input.addEventListener("keydown",e=>{let rr=r,cc=c;if(e.key==="ArrowRight")cc++;else if(e.key==="ArrowLeft")cc--;else if(e.key==="ArrowDown")rr++;else if(e.key==="ArrowUp")rr--;else if(e.key==="Backspace"&&!input.value){rr+=activeEntry?.dir==="down"?-1:0;cc+=activeEntry?.dir==="across"?-1:0;}else return;const target=inputs.get(key(rr,cc));if(target){target.focus();e.preventDefault();}});
    el.appendChild(input);inputs.set(key(r,c),input);grid.appendChild(el);
  }
}
function renderClues(dir,host){data.entries.filter(e=>e.dir===dir).sort((a,b)=>a.n-b.n).forEach(e=>{const b=document.createElement("button");b.type="button";b.className="clue";b.dataset.number=e.n;b.innerHTML=`<span class="clue-num">${e.n}.</span><span class="clue-text">${e.clue} <small>(${e.word.length})</small></span><span class="tick"></span>`;b.addEventListener("click",()=>selectEntry(e));host.appendChild(b);});}
function selectEntry(e){activeEntry=e;document.querySelectorAll(".clue").forEach(x=>x.classList.toggle("active",Number(x.dataset.number)===e.n));document.querySelectorAll(".cell").forEach(x=>x.classList.remove("selected-word"));[...e.word].forEach((_,i)=>{const r=e.r+(e.dir==="down"?i:0),c=e.c+(e.dir==="across"?i:0),el=grid.querySelector(`[data-cell="${key(r,c)}"]`);if(el)el.classList.add("selected-word");});const input=inputs.get(key(e.r,e.c));if(input)input.focus({preventScroll:true});}
function moveNext(r,c){const dr=activeEntry?.dir==="down"?1:0,dc=activeEntry?.dir==="across"?1:0;const next=inputs.get(key(r+dr,c+dc));if(next){next.focus({preventScroll:true});return;}const intersect=data.entries.find(e=>e!==activeEntry&&[...e.word].some((_,i)=>e.r+(e.dir==="down"?i:0)===r&&e.c+(e.dir==="across"?i:0)===c));if(intersect)selectEntry(intersect);}
function clearMark(el){el.classList.remove("correct","incorrect");}
function updateProgress(){let correct=0,filled=0,total=cells.size;cells.forEach((d,k)=>{const v=(inputs.get(k)?.value||"").toUpperCase();if(v)filled++;if(v===d.letter)correct++;});const pct=Math.round(correct/total*100);document.getElementById("progress-label").textContent=`${correct} of ${total} letters correct`;document.getElementById("progress-percent").textContent=pct+"%";document.getElementById("progress-fill").style.width=pct+"%";document.getElementById("status-message").textContent=correct===total?"Excellent! Crossword completed.":`${filled} of ${total} squares filled.`;data.entries.forEach(e=>{const done=[...e.word].every((l,i)=>{const r=e.r+(e.dir==="down"?i:0),c=e.c+(e.dir==="across"?i:0);return (inputs.get(key(r,c))?.value||"").toUpperCase()===l;});const clue=document.querySelector(`.clue[data-number="${e.n}"]`);if(clue){clue.classList.toggle("done",done);clue.querySelector(".tick").textContent=done?"✓":"";}});}
function checkAnswers(){cells.forEach((d,k)=>{const input=inputs.get(k),el=input.parentElement;clearMark(el);const v=(input.value||"").toUpperCase();if(v)el.classList.add(v===d.letter?"correct":"incorrect");});updateProgress();const all=[...cells.entries()].every(([k,d])=>(inputs.get(k).value||"").toUpperCase()===d.letter);document.getElementById("status-message").textContent=all?"🎉 Brilliant! You solved the crossword!":"Green squares are correct. Keep working on the others.";}
function reveal(){cells.forEach((d,k)=>{inputs.get(k).value=d.letter;inputs.get(k).parentElement.classList.remove("incorrect");inputs.get(k).parentElement.classList.add("correct");});updateProgress();document.getElementById("status-message").textContent="Answers revealed — use them to learn the crossings.";}
function reset(){inputs.forEach(i=>{i.value="";clearMark(i.parentElement);});updateProgress();selectEntry(data.entries[0]);}
renderGrid();renderClues("across",acrossHost);renderClues("down",downHost);
document.getElementById("check-btn").addEventListener("click",checkAnswers);document.getElementById("reveal-btn").addEventListener("click",reveal);document.getElementById("reset-btn").addEventListener("click",reset);
selectEntry(data.entries[0]);updateProgress();
})();