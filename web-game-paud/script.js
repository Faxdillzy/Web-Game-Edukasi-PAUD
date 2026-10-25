"use strict";
/* =====================================================
   ILUSTRASI HEWAN BAWAAN (SVG). Dipakai jika file PNG di
   assets/images/ belum ada. Ganti dengan gambar Anda kapan saja.
   ===================================================== */
const INK = "#1b1b1b";
const svgs = {
  sapi: `<g stroke="${INK}" stroke-width="4" stroke-linejoin="round"><path d="M28 36 14 20M92 36l14-16" fill="none"/><ellipse cx="18" cy="48" rx="14" ry="8" fill="#fff"/><ellipse cx="102" cy="48" rx="14" ry="8" fill="#fff"/><rect x="26" y="26" width="68" height="76" rx="30" fill="#fff"/><path d="M26 50a30 30 0 0 1 22-24 20 20 0 0 0-10 30z" fill="${INK}"/><ellipse cx="60" cy="84" rx="26" ry="18" fill="#f6a5b5"/></g><circle cx="48" cy="56" r="5" fill="${INK}"/><circle cx="72" cy="56" r="5" fill="${INK}"/><circle cx="52" cy="84" r="4" fill="${INK}"/><circle cx="68" cy="84" r="4" fill="${INK}"/>`,
  bebek: `<g stroke="${INK}" stroke-width="4" stroke-linejoin="round"><circle cx="60" cy="58" r="44" fill="#ffd23f"/><path d="M40 72q20-12 40 0 6 16-20 20-26-4-20-20z" fill="#ff8c1a"/></g><circle cx="44" cy="48" r="6" fill="${INK}"/><circle cx="76" cy="48" r="6" fill="${INK}"/><circle cx="46" cy="46" r="2" fill="#fff"/><circle cx="78" cy="46" r="2" fill="#fff"/><path d="M60 14q-8-10 2-12" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`,
  ayam: `<g stroke="${INK}" stroke-width="4" stroke-linejoin="round"><path d="M44 28q-4-20 8-16 4-10 14-2 12-4 12 16z" fill="#e63946"/><circle cx="60" cy="62" r="42" fill="#fff"/><path d="M50 68h20l-10 16z" fill="#ffb703"/><path d="M52 84q8 18 16 0z" fill="#e63946"/></g><circle cx="42" cy="56" r="6" fill="${INK}"/><circle cx="78" cy="56" r="6" fill="${INK}"/>`,
  kambing: `<g stroke="${INK}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"><path d="M42 30q-10-24-24-18 8 6 8 22M78 30q10-24 24-18-8 6-8 22" fill="#f1e3c6"/><path d="M20 58 4 52q4 14 20 16zM100 58l16-6q-4 14-20 16z" fill="#c9b48c"/><path d="M30 34h60l-6 56q-24 20-48 0z" fill="#e9dcc0"/><path d="M60 100l-8 14h16z" fill="#f1e3c6"/><ellipse cx="60" cy="80" rx="16" ry="11" fill="#d9c7a0"/></g><rect x="38" y="54" width="12" height="8" rx="4" fill="${INK}"/><rect x="70" y="54" width="12" height="8" rx="4" fill="${INK}"/><circle cx="54" cy="80" r="3" fill="${INK}"/><circle cx="66" cy="80" r="3" fill="${INK}"/>`
};
const fallbackImg = id => "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">${svgs[id]}</svg>`);

/* =====================================================
   DATA HEWAN - tambah hewan baru cukup menambah objek di sini
   (tambahkan juga ilustrasi di objek svgs, atau cukup file PNG)
   ===================================================== */
const animals = [
  { id: "sapi",    name: "Sapi",    word: "Moo... Moo...",     clue: "MOO MOO",     bg: "#ffe8b8" },
  { id: "bebek",   name: "Bebek",   word: "Kwek... Kwek...",   clue: "KWEK KWEK",   bg: "#d6f0ff" },
  { id: "ayam",    name: "Ayam",    word: "Kukuruyuk!",        clue: "KUKURUYUK",   bg: "#ffd6d6" },
  { id: "kambing", name: "Kambing", word: "Mbeek... Mbeek...", clue: "MBEEK MBEEK", bg: "#e4f5c8" }
].map(a => ({ ...a, image: `assets/images/${a.id}.png`, sound: `assets/sounds/${a.id}.mp3` }));

/* Pengaturan level kuis */
const levels = {
  2: { title: "Tebak Suara",     total: 5,  showClue: false },
  3: { title: "Tantangan Hewan", total: 10, showClue: true }
};
const praises = ["Hebat!", "Pintar!", "Bagus sekali!"];

/* Helper kecil */
const $ = id => document.getElementById(id);
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);
function animate(el, cls) { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); }

function makeImage(a) {
  const img = new Image();
  img.src = a.image;
  img.alt = "Gambar " + a.name;
  img.onerror = () => { img.onerror = null; img.src = fallbackImg(a.id); }; // pakai SVG bawaan
  return img;
}
function makeCard(a, onClick) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "animal-card";
  btn.style.setProperty("--bg", a.bg);
  btn.dataset.id = a.id;
  btn.appendChild(makeImage(a));
  btn.insertAdjacentHTML("beforeend", `<span class="label">${a.name}</span>`);
  btn.addEventListener("click", () => onClick(a, btn));
  return btn;
}
/* Percikan kotak kuning dari tengah elemen (untuk jawaban benar) */
function burst(el) {
  const r = el.getBoundingClientRect();
  for (let i = 0; i < 8; i++) {
    const s = document.createElement("span");
    const ang = (i / 8) * Math.PI * 2;
    s.className = "spark";
    s.style.cssText = `left:${r.left + r.width / 2}px;top:${r.top + r.height / 2}px;--dx:${Math.cos(ang) * 80}px;--dy:${Math.sin(ang) * 80}px`;
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 700);
  }
}
function ripple(btn) { btn.classList.add("speaking"); setTimeout(() => btn.classList.remove("speaking"), 1000); }

/* =====================================================
   AUDIO - hanya satu suara pada satu waktu
   ===================================================== */
const Sound = {
  enabled: true, current: null, ctx: null, cache: new Map(),
  /* Satu elemen Audio per hewan, dipakai ulang supaya file tidak diunduh
     berulang kali dan suara lebih cepat berbunyi. */
  audio(animal) {
    let snd = this.cache.get(animal.id);
    if (!snd) {
      snd = new Audio(animal.sound);
      snd.preload = "auto";
      this.cache.set(animal.id, snd);
    }
    return snd;
  },
  preload(list) {
    list.forEach(a => this.audio(a).load());
  },
  stop() {
    if (this.current) { this.current.pause(); this.current.currentTime = 0; this.current = null; }
    if (window.speechSynthesis) speechSynthesis.cancel();
    $("btn-play").classList.remove("playing");
  },
  play(animal) {
    this.stop();
    if (!this.enabled || !animal) return;
    const snd = this.audio(animal);
    snd.currentTime = 0;
    this.current = snd;
    $("btn-play").classList.add("playing");
    snd.onended = () => $("btn-play").classList.remove("playing");
    // Jika file mp3 belum ada / gagal dimuat, browser mengucapkan bunyi hewan
    snd.onerror = () => this.speak(animal.word);
    const p = snd.play();
    if (p && p.catch) p.catch(() => this.speak(animal.word));
  },
  speak(text) {
    if (!this.enabled || !window.speechSynthesis) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "id-ID"; u.rate = 0.8; u.pitch = 1.3;
    speechSynthesis.speak(u);
  },
  tone(freqs) { // nada feedback tanpa file
    if (!this.enabled) return;
    try {
      this.ctx = this.ctx || new (window.AudioContext || window.webkitAudioContext)();
      freqs.forEach((f, i) => {
        const o = this.ctx.createOscillator(), g = this.ctx.createGain(), t = this.ctx.currentTime + i * 0.15;
        o.frequency.value = f; o.connect(g); g.connect(this.ctx.destination);
        g.gain.setValueAtTime(0.15, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
        o.start(t); o.stop(t + 0.15);
      });
    } catch (e) { /* audio tidak didukung */ }
  },
  toggle() {
    this.enabled = !this.enabled;
    if (!this.enabled) this.stop();
    $("btn-sound").textContent = "Suara: " + (this.enabled ? "ON" : "OFF");
    $("btn-sound").setAttribute("aria-pressed", String(this.enabled));
  }
};

/* Navigasi antar layar */
function showScreen(id) {
  Sound.stop(); Quiz.clearTimer();
  document.querySelectorAll(".screen").forEach(s => { s.hidden = s.id !== id; });
  window.scrollTo(0, 0);
}

/* =====================================================
   LEVEL 1 - KENALI HEWAN
   ===================================================== */
const Learn = {
  found: new Set(),
  init() {
    animals.forEach(a => $("learn-grid").appendChild(makeCard(a, (an, btn) => this.select(an, btn))));
  },
  reset() { this.found.clear(); this.update(); $("learn-sound").textContent = "Pilih satu hewan"; $("learn-name").innerHTML = "&nbsp;"; $("learn-praise").innerHTML = "&nbsp;"; },
  select(a, btn) {
    animate(btn, "anim-bounce"); ripple(btn);
    Sound.play(a);
    this.found.add(a.id);
    $("learn-sound").textContent = a.word;
    $("learn-name").textContent = `Ini adalah ${a.name.toUpperCase()}!`;
    $("learn-praise").textContent = `${pick(praises)} Kamu menemukan ${a.name.toLowerCase()}!`;
    animate($("learn-info"), "anim-pop");
    this.update();
    if (this.found.size === animals.length) { burst(btn); }
  },
  update() {
    const n = this.found.size;
    $("learn-found").textContent = n === animals.length
      ? "Hebat! Kamu sudah mengenal semua hewan!" : `Ditemukan ${n} dari ${animals.length}`;
  }
};

/* =====================================================
   LEVEL 2 & 3 - KUIS TEBAK SUARA
   ===================================================== */
const Quiz = {
  level: 2, cfg: null, index: 0, score: 0, right: 0, wrong: 0,
  answer: null, hadMistake: false, locked: false, timer: null, lastId: null,
  clearTimer() { clearTimeout(this.timer); this.timer = null; },

  start(level) {
    this.level = level; this.cfg = levels[level];
    Object.assign(this, { index: 0, score: 0, right: 0, wrong: 0, lastId: null });
    $("quiz-title").textContent = `Level ${level}: ${this.cfg.title}`;
    showScreen("screen-quiz");
    this.nextQuestion();
  },

  nextQuestion() {
    this.locked = false; this.hadMistake = false;
    this.answer = pick(animals.filter(a => a.id !== this.lastId)); // tidak sama dengan soal lalu
    this.lastId = this.answer.id;
    $("quiz-question").textContent = this.cfg.showClue
      ? `Hewan apa yang berbunyi ${this.answer.clue}?`
      : "Dengarkan suaranya. Hewan apa ini?";
    $("quiz-feedback").innerHTML = "&nbsp;"; $("quiz-feedback").className = "feedback";
    const box = $("quiz-options");
    box.innerHTML = "";
    shuffle(animals).forEach(a => {
      const card = makeCard(a, (an, btn) => this.check(an, btn));
      card.classList.add("anim-pop");
      box.appendChild(card);
    });
    this.updateStats();
    animate($("quiz-question"), "anim-pop");
    Sound.play(this.answer);
  },

  check(a, btn) {
    if (this.locked) return;
    const fb = $("quiz-feedback");
    if (a.id === this.answer.id) {
      this.locked = true; this.right++; this.index++;
      if (!this.hadMistake) this.score++; // skor hanya jika benar di percobaan pertama
      btn.classList.add("correct"); animate(btn, "anim-bounce"); burst(btn);
      Sound.play(a); // putar suara hewan dari file milik pengguna
      fb.textContent = "BENAR! " + pick(praises); fb.className = "feedback good";
      this.updateStats();
      this.timer = setTimeout(() => (this.index >= this.cfg.total ? this.finish() : this.nextQuestion()), 1600);
    } else {
      // Salah: tanpa hukuman, boleh mencoba lagi
      this.hadMistake = true; this.wrong++;
      animate(btn, "anim-shake"); btn.disabled = true;
      Sound.play(a); // kenalkan suara hewan yang dipilih
      fb.textContent = "Coba lagi"; fb.className = "feedback bad";
      this.updateStats();
    }
  },

  updateStats() {
    const t = this.cfg.total, pct = Math.round((this.index / t) * 100);
    $("stat-score").textContent = this.score;
    $("stat-count").textContent = `${Math.min(this.index + 1, t)}/${t}`;
    $("stat-right").textContent = this.right;
    $("stat-wrong").textContent = this.wrong;
    $("progress-fill").style.width = pct + "%";
    $("progress").setAttribute("aria-valuenow", pct);
    $("progress-text").textContent = pct + "%";
  },

  finish() {
    const t = this.cfg.total, ratio = this.score / t;
    const stars = ratio >= 0.8 ? 3 : ratio >= 0.5 ? 2 : 1;
    const msg = ratio >= 0.8 ? "LUAR BIASA!" : ratio >= 0.5 ? "HEBAT! Terus berlatih!" : "Ayo coba lagi!";
    showScreen("screen-result");
    $("result-stars").textContent = "\u2605".repeat(stars) + "\u2606".repeat(3 - stars);
    $("result-score").textContent = `Skor: ${this.score}/${t}`;
    $("result-message").textContent = msg;
    animate($("result-score"), "anim-pop");
    Sound.tone([523, 659, 784, 1047]);
  }
};

/* =====================================================
   INISIALISASI & EVENT LISTENER
   ===================================================== */
function init() {
  Sound.preload(animals); // muat semua suara hewan lebih awal
  animals.forEach(a => $("meadow").appendChild(makeImage(a))); // hewan hiasan di home
  Learn.init();

  $("btn-start").addEventListener("click", () => showScreen("screen-mode"));
  $("btn-brand").addEventListener("click", () => showScreen("screen-home"));
  $("btn-sound").addEventListener("click", () => Sound.toggle());
  $("btn-howto").addEventListener("click", () => { $("modal-howto").hidden = false; $("btn-close-howto").focus(); });
  $("btn-close-howto").addEventListener("click", () => { $("modal-howto").hidden = true; $("btn-howto").focus(); });
  $("btn-play").addEventListener("click", () => Sound.play(Quiz.answer));
  $("btn-restart").addEventListener("click", () => Quiz.start(Quiz.level));

  document.querySelectorAll("[data-goto]").forEach(b => b.addEventListener("click", () => showScreen(b.dataset.goto)));
  document.querySelectorAll("[data-level]").forEach(b => b.addEventListener("click", () => {
    const lv = Number(b.dataset.level);
    if (lv === 1) { Learn.reset(); showScreen("screen-learn"); } else Quiz.start(lv);
  }));

  // Keyboard: Escape menutup popup, angka 1-4 memilih jawaban di kuis
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") $("modal-howto").hidden = true;
    if (!$("screen-quiz").hidden && /^[1-4]$/.test(e.key)) {
      const card = $("quiz-options").children[Number(e.key) - 1];
      if (card && !card.disabled) card.click();
    }
  });
}
document.addEventListener("DOMContentLoaded", init);
