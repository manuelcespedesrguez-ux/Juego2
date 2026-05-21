// game.js – lógica simple de movimiento y sonido
"use strict";

// Configuración de audio (se reutilizan funciones ya definidas en index.html)
let audioCtx = null;
let muted = false;
function ensureAudio(){
  if (audioCtx || muted) return;
  try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch { audioCtx = null; }
}
function beep(type, freq, dur, gain){
  if (muted) return;
  ensureAudio();
  if (!audioCtx) return;
  const t0 = audioCtx.currentTime;
  const o = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  o.type = type; o.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(Math.max(0.0001, gain), t0 + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g).connect(audioCtx.destination);
  o.start(t0); o.stop(t0 + dur + 0.02);
}
function sfxShot(){ beep('square', Math.random()*260+520, 0.035, 0.04); }
function sfxExplosion(){ beep('sawtooth', Math.random()*50+40, 0.18, 0.10); }
function sfxPowerup(){ beep('sine', Math.random()*200+500, 0.08, 0.08); }

// Estado de la nave
const ship = { x: 0, y: 0, speed: 300, size: 30 };
let lastTime = 0;

function resize(){
  const canvas = document.getElementById('c');
  const rect = canvas.getBoundingClientRect();
  ship.x = rect.width/2; ship.y = rect.height/2;
}
window.addEventListener('resize', resize);
resize();

// Global key state
const keys = {};
window.addEventListener('keydown', e=> keys[e.key.toLowerCase()] = true);
window.addEventListener('keyup', e=> keys[e.key.toLowerCase()] = false);

function update(dt){
  // movimiento con WASD o flechas
  let dx = 0, dy = 0;
  if (keys['w']||keys['arrowup']) dy -= 1;
  if (keys['s']||keys['arrowdown']) dy += 1;
  if (keys['a']||keys['arrowleft']) dx -= 1;
  if (keys['d']||keys['arrowright']) dx += 1;
  if (dx||dy){
    const len = Math.hypot(dx,dy);
    dx/=len; dy/=len;
    ship.x += dx*ship.speed*dt;
    ship.y += dy*ship.speed*dt;
    sfxShot();
  }
}

function draw(){
  const canvas = document.getElementById('c');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(ship.x, ship.y, ship.size,0,Math.PI*2);
  ctx.fill();
}

function loop(timestamp){
  const dt = (timestamp-lastTime)/1000; lastTime = timestamp;
  update(dt);
  draw();
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

// Botón mute
const muteBtn = document.getElementById('muteBtn');
if (muteBtn){
  muteBtn.addEventListener('click',()=>{ muted=!muted; muteBtn.textContent=`Sonido: ${muted?'OFF':'ON'}`; if(muted&&audioCtx){audioCtx.close();audioCtx=null;} });
}

const EVOLUTION_TREE = {
  plasma: { damage: 1.5, fireRate: 0.12 }, // Más rápido
  sniper: { damage: 3.0, fireRate: 0.40 }  // Más lento pero fuerte
}

function selectEvolution(type) {
  const evo = EVOLUTION_TREE[type];
  game.playerShip.specialization = type;
  game.playerShip.hitDmg *= evo.damage;
  game.playerShip.fireRate = evo.fireRate;
  
  // Cerrar el menú
  document.getElementById('evolutionOverlay').classList.remove('show');
  game.running = true; // Reanudar el bucle de juego
}

// Dentro de la lógica donde controlas el nivel de la nave
if (game.playerShip.level >= 5 && !game.playerShip.specialization) {
  game.running = false; // Pausar juego
  document.getElementById('evolutionOverlay').classList.add('show');
}

// Cuando el nivel llega a 5 (o el máximo que decidas)
function checkEvolution() {
  const evoOverlay = document.getElementById('evolutionOverlay');
  if (ship.level >= 5 && !ship.specialization) {
    evoOverlay.classList.add('show'); // Esto lo hace visible
    // Aquí deberías pausar tu juego, por ejemplo:
    game.running = false; 
  }
}