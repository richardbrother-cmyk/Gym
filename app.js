/* Gym Tracker – PWA sin dependencias.
   Datos en localStorage. Secciones: Rutinas, Ejercicios, Historial, Progreso + pantalla de Entrenamiento. */
(() => {
  'use strict';

  const STORAGE_KEY = 'gymtracker.v1';
  const DEFAULT_REST = 90;

  /* ---------- Biblioteca de ejercicios (medios incluidos en /media) ---------- */
  const LIBRARY = [
    { id: 'press-pecho-plano',     name: 'Press de pecho plano',     muscle: 'Pecho',                media: 'video' },
    { id: 'jalon-al-pecho',        name: 'Jalón al pecho',           muscle: 'Espalda (dorsales)',   media: 'video' },
    { id: 'press-pecho-inclinado', name: 'Press de pecho inclinado', muscle: 'Pecho superior',       media: 'video' },
    { id: 'remo-sentado-al-pecho', name: 'Remo sentado al pecho',    muscle: 'Espalda media',        media: 'video' },
    { id: 'peck-deck-cristo',      name: 'Peck Deck en cristo',      muscle: 'Pecho',                media: 'image' },
    { id: 'pull-over-polea-alta',  name: 'Pull Over en polea alta',  muscle: 'Dorsales / Pecho',     media: 'image' },
    { id: 'peck-deck-invertido',   name: 'Peck Deck invertido',      muscle: 'Hombro posterior',     media: 'video', dark: true },
    { id: 'jalon-a-la-barbilla',   name: 'Jalón a la barbilla',      muscle: 'Hombros / Trapecio',   media: 'video' },
    { id: 'espalda-baja',          name: 'Espalda baja',             muscle: 'Lumbares',             media: 'video' },
    { id: 'press-pecho-declinado', name: 'Press de pecho declinado', muscle: 'Pecho inferior',       media: 'video' },
    // Hombro, bíceps y tríceps
    { id: 'press-militar-mancuernas-sentado',  name: 'Press militar con mancuernas sentado',      muscle: 'Hombros',            media: 'video' },
    { id: 'laterales-mancuernas-de-pie',       name: 'Laterales con mancuernas de pie',           muscle: 'Hombro lateral',     media: 'video' },
    { id: 'posterior-unilateral-polea-alta',   name: 'Posterior unilateral en polea alta',        muscle: 'Hombro posterior',   media: 'video', dark: true, wide: true },
    { id: 'frontal-unilateral-mancuernas',     name: 'Frontal unilateral con mancuernas',         muscle: 'Hombro anterior',    media: 'image', wide: true },
    { id: 'curl-biceps-barra-z',               name: 'Curl de bíceps con barra Z',                muscle: 'Bíceps',             media: 'video' },
    { id: 'extension-polea-alta-barra',        name: 'Extensión en polea alta con barra',         muscle: 'Tríceps',            media: 'video' },
    { id: 'curl-martillo-unilateral-sentado',  name: 'Curl martillo con mancuernas unilateral sentado', muscle: 'Bíceps / Braquial', media: 'video' },
    { id: 'extension-polea-alta-cuerda',       name: 'Extensión en polea alta con cuerda',        muscle: 'Tríceps',            media: 'video' },
    { id: 'predicador',                        name: 'Predicador',                                muscle: 'Bíceps',             media: 'image' },
    { id: 'extension-trasnuca-polea-cuerda',   name: 'Extensión trasnuca en polea alta con cuerda', muscle: 'Tríceps (cabeza larga)', media: 'image', wide: true },
    // Pierna
    { id: 'extension-cuadriceps',          name: 'Extensión de cuádriceps',                 muscle: 'Cuádriceps',           media: 'video' },
    { id: 'femoral-sentado',               name: 'Femoral sentado',                         muscle: 'Isquiotibiales',       media: 'video' },
    { id: 'prensa-inclinada',              name: 'Prensa inclinada',                        muscle: 'Cuádriceps / Glúteo',  media: 'video' },
    { id: 'sentadilla-libre',              name: 'Sentadilla libre',                        muscle: 'Pierna completa',      media: 'video' },
    { id: 'aductor',                       name: 'Aductor',                                 muscle: 'Aductores',            media: 'video' },
    { id: 'abductor',                      name: 'Abductor',                                muscle: 'Glúteo medio',         media: 'video' },
    { id: 'pantorrilla-de-pie-sin-peso',   name: 'Extensión de pantorrilla de pie sin peso', muscle: 'Pantorrilla',         media: 'video' },
    { id: 'pantorrilla-en-prensa',         name: 'Extensión de pantorrilla en prensa',      muscle: 'Pantorrilla',          media: 'video' },
    { id: 'extension-tibiales',            name: 'Extensión para tibiales',                 muscle: 'Tibial anterior',      media: null },
  ];

  const DEFAULT_ROUTINES = [
    {
      id: 'rutina-a', name: 'Rutina A · Pecho y espalda',
      items: [
        { exerciseId: 'press-pecho-plano', sets: 4, reps: 10 },
        { exerciseId: 'jalon-al-pecho', sets: 4, reps: 10 },
        { exerciseId: 'press-pecho-inclinado', sets: 4, reps: 10 },
        { exerciseId: 'remo-sentado-al-pecho', sets: 4, reps: 10 },
        { exerciseId: 'peck-deck-cristo', sets: 4, reps: 10 },
        { exerciseId: 'pull-over-polea-alta', sets: 4, reps: 10 },
      ],
    },
    {
      id: 'rutina-b', name: 'Rutina B · Pecho, hombro y lumbar',
      items: [
        { exerciseId: 'press-pecho-inclinado', sets: 4, reps: 10 },
        { exerciseId: 'peck-deck-invertido', sets: 4, reps: 10 },
        { exerciseId: 'jalon-a-la-barbilla', sets: 4, reps: 17 },
        { exerciseId: 'espalda-baja', sets: 4, reps: 20 },
      ],
    },
    {
      id: 'rutina-hombro-brazo', name: 'Martes y Viernes · Hombro, bíceps y tríceps',
      notes: 'Bloque 1: hombro (4 ejercicios). Bloque 2: curl con barra Z alternado con extensión con barra. Bloque 3: cuatriserie (los 4 últimos seguidos).',
      items: [
        { exerciseId: 'press-militar-mancuernas-sentado', sets: 4, reps: 10 },
        { exerciseId: 'laterales-mancuernas-de-pie', sets: 4, reps: 10 },
        { exerciseId: 'posterior-unilateral-polea-alta', sets: 4, reps: 10 },
        { exerciseId: 'frontal-unilateral-mancuernas', sets: 4, reps: 10 },
        { exerciseId: 'curl-biceps-barra-z', sets: 4, reps: 10 },
        { exerciseId: 'extension-polea-alta-barra', sets: 4, reps: 10 },
        { exerciseId: 'curl-martillo-unilateral-sentado', sets: 4, reps: 10 },
        { exerciseId: 'extension-polea-alta-cuerda', sets: 4, reps: 10 },
        { exerciseId: 'predicador', sets: 4, reps: 10 },
        { exerciseId: 'extension-trasnuca-polea-cuerda', sets: 4, reps: 10 },
      ],
    },
    {
      id: 'rutina-pierna', name: 'Miércoles y Sábado · Pierna',
      notes: 'Triserie inicial: cuádriceps, femoral y prensa (una serie de cada, seguidas). Sentadilla libre sola. Aductor alternado con abductor. Triserie final: pantorrilla de pie sin peso, pantorrilla en prensa y tibiales. La de pie puede hacerse completamente recto agarrado de algo.',
      items: [
        { exerciseId: 'extension-cuadriceps', sets: 4, reps: 10 },
        { exerciseId: 'femoral-sentado', sets: 4, reps: 10 },
        { exerciseId: 'prensa-inclinada', sets: 4, reps: 10 },
        { exerciseId: 'sentadilla-libre', sets: 4, reps: 10 },
        { exerciseId: 'aductor', sets: 4, reps: 10 },
        { exerciseId: 'abductor', sets: 4, reps: 10 },
        { exerciseId: 'pantorrilla-de-pie-sin-peso', sets: 4, reps: 20 },
        { exerciseId: 'pantorrilla-en-prensa', sets: 4, reps: 20 },
        { exerciseId: 'extension-tibiales', sets: 4, reps: 20 },
      ],
    },
  ];
  const cloneRoutine = (r) => ({ ...r, items: r.items.map((i) => ({ ...i })) });

  /* ---------- Estado ---------- */
  const state = load();

  function load() {
    let saved = null;
    try { saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'); } catch (_) { saved = null; }
    const base = {
      routines: DEFAULT_ROUTINES.map(cloneRoutine),
      seeded: DEFAULT_ROUTINES.map((r) => r.id),
      customExercises: [],
      sessions: [],
      active: null,
      settings: { rest: DEFAULT_REST, notify: true, sync: { key: null, url: '', lastSyncAt: null, lastError: null } },
      ui: { tab: 'routines', screen: 'tab', progressEx: null, progressMetric: 'maxWeight', progressRange: 'Todo', progressView: 'exercise' },
    };
    if (!saved) return base;
    // Rutinas de ejemplo añadidas en versiones nuevas: se agregan una sola vez (si el usuario las borra, no vuelven).
    const seeded = new Set(saved.seeded || ['rutina-a', 'rutina-b']);
    const routines = (saved.routines || []).slice();
    for (const r of DEFAULT_ROUTINES) if (!seeded.has(r.id)) { routines.push(cloneRoutine(r)); seeded.add(r.id); }
    return {
      ...base, ...saved, routines, seeded: [...seeded],
      settings: { ...base.settings, ...(saved.settings || {}), sync: { ...base.settings.sync, ...(saved.settings?.sync || {}) } },
      ui: { ...base.ui, ...(saved.ui || {}), screen: saved.active ? (saved.ui?.screen || 'tab') : 'tab' },
    };
  }
  let restoring = false; // mientras se restaura la copia espejo no se debe guardar nada
  function save() {
    if (restoring) return;
    const json = JSON.stringify(state);
    try { localStorage.setItem(STORAGE_KEY, json); }
    catch (e) { toast('No se pudo guardar (almacenamiento lleno)'); }
    idbPut(json);
    scheduleCloudPush();
  }

  /* ---------- Copia en la nube (Worker de Cloudflare + KV) ----------
     La frase del usuario se convierte en SHA-256 en el teléfono; solo ese hash viaja al Worker.
     Tras cada cambio se sube la copia (con retraso de unos segundos); al arrancar se descarga
     y se combina con lo local. */
  const SYNC_DEFAULT_URL = 'api/backup';
  const syncCfg = () => state.settings.sync;
  const syncEnabled = () => !!syncCfg().key;
  const syncUrl = () => (syncCfg().url || SYNC_DEFAULT_URL);
  async function sha256Hex(text) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
    return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  const normalizePhrase = (p) => p.normalize('NFKC').trim().toLowerCase().replace(/\s+/g, ' ');
  const syncKeyFromPhrase = (phrase) => sha256Hex('gym-tracker:' + normalizePhrase(phrase));
  const cloudPayload = () => ({ routines: state.routines, customExercises: state.customExercises, sessions: state.sessions, settings: { rest: state.settings.rest, notify: state.settings.notify }, seeded: state.seeded });

  async function cloudRequest(method, body) {
    const res = await fetch(syncUrl(), {
      method, cache: 'no-store',
      headers: { 'X-Sync-Key': syncCfg().key, ...(body ? { 'Content-Type': 'application/json' } : {}) },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) throw new Error(res.status === 401 ? 'Código no aceptado por el servidor' : res.status === 404 ? 'Servidor de copias no encontrado' : `Error ${res.status} del servidor`);
    const data = await res.json();
    return method === 'GET' && data?.exists === false ? null : data;
  }

  let cloudPushTimer = null, cloudBusy = false, cloudDirty = false;
  function scheduleCloudPush() {
    if (!syncEnabled() || restoring) return;
    cloudDirty = true;
    clearTimeout(cloudPushTimer);
    cloudPushTimer = setTimeout(() => cloudPush(), 4000);
  }
  async function cloudPush() {
    if (!syncEnabled() || cloudBusy) return false;
    if (!navigator.onLine) { cloudDirty = true; return false; }
    cloudBusy = true;
    try {
      // Antes de escribir, combinar con lo que haya en la nube (otro dispositivo pudo añadir sesiones).
      const remote = await cloudRequest('GET');
      if (remote) {
        const r = mergeCloud(remote);
        if (r.added) { persistQuiet(); idbPut(JSON.stringify(state)); if (state.ui.screen === 'tab') render(); }
      }
      const savedAt = new Date().toISOString();
      await cloudRequest('PUT', { data: cloudPayload(), savedAt });
      cloudDirty = false;
      syncCfg().lastSyncAt = savedAt; syncCfg().lastError = null;
      persistQuiet();
      return true;
    } catch (e) {
      cloudDirty = true;
      syncCfg().lastError = e.message || 'No se pudo subir la copia';
      persistQuiet();
      return false;
    } finally { cloudBusy = false; }
  }
  // Guarda sin volver a programar una subida (para actualizar el estado de la sincronización).
  function persistQuiet() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (_) { /* lleno */ }
  }
  // Combina la copia de la nube con lo local: sesiones y ejercicios por unión; rutinas locales mandan.
  function mergeCloud(remote) {
    const d = remote?.data || {};
    const localEmpty = !state.sessions.length && !state.customExercises.length;
    if (localEmpty) {
      state.sessions = Array.isArray(d.sessions) ? d.sessions : [];
      state.routines = Array.isArray(d.routines) && d.routines.length ? d.routines : state.routines;
      state.customExercises = Array.isArray(d.customExercises) ? d.customExercises : [];
      if (Array.isArray(d.seeded)) state.seeded = [...new Set([...(state.seeded || []), ...d.seeded])];
      if (d.settings) state.settings = { ...state.settings, ...d.settings, sync: state.settings.sync };
      return { restored: true, added: state.sessions.length };
    }
    let added = 0;
    const have = new Set(state.sessions.map((x) => x.id));
    for (const x of d.sessions || []) if (!have.has(x.id)) { state.sessions.push(x); added++; }
    const haveR = new Set(state.routines.map((r) => r.id));
    for (const r of d.routines || []) if (!haveR.has(r.id) && !(state.seeded || []).includes(r.id)) state.routines.push(r);
    const haveE = new Set(state.customExercises.map((e) => e.id));
    for (const e of d.customExercises || []) if (!haveE.has(e.id)) state.customExercises.push(e);
    return { restored: false, added };
  }
  async function cloudPull({ silent = false } = {}) {
    if (!syncEnabled()) return null;
    if (!navigator.onLine) { if (!silent) toast('Sin conexión'); return null; }
    try {
      const remote = await cloudRequest('GET');
      syncCfg().lastError = null;
      if (!remote) { await cloudPush(); return { restored: false, added: 0, first: true }; }
      const result = mergeCloud(remote);
      save();
      syncCfg().lastSyncAt = new Date().toISOString(); persistQuiet();
      if (result.restored) toast(`☁️ Restauradas ${result.added} sesiones desde la nube`);
      else if (result.added && !silent) toast(`☁️ ${result.added} sesiones nuevas desde la nube`);
      await cloudPush();
      return result;
    } catch (e) {
      syncCfg().lastError = e.message || 'No se pudo conectar'; persistQuiet();
      if (!silent) toast('☁️ ' + syncCfg().lastError);
      return null;
    }
  }
  async function connectCloud(phrase) {
    if (normalizePhrase(phrase).length < 8) { toast('Usa una frase de al menos 8 caracteres'); return false; }
    syncCfg().key = await syncKeyFromPhrase(phrase);
    syncCfg().lastError = null; persistQuiet();
    const r = await cloudPull();
    if (!r) { syncCfg().key = null; persistQuiet(); return false; }
    if (r.first) toast('☁️ Copia en la nube creada'); else if (!r.restored && !r.added) toast('☁️ Nube conectada');
    return true;
  }
  function disconnectCloud() {
    clearTimeout(cloudPushTimer);
    state.settings.sync = { key: null, url: syncCfg().url, lastSyncAt: null, lastError: null };
    persistQuiet();
  }
  window.addEventListener('online', () => { if (cloudDirty) cloudPush(); });
  document.addEventListener('visibilitychange', () => { if (!document.hidden && cloudDirty) cloudPush(); });

  /* ---------- Copia espejo en IndexedDB ----------
     Segunda copia de los datos. Si localStorage aparece vacío (purga del navegador, limpieza
     de caché) pero IndexedDB conserva la copia, se restaura automáticamente al arrancar. */
  const IDB_NAME = 'gymtracker', IDB_STORE = 'kv';
  function idbOpen() {
    return new Promise((resolve, reject) => {
      if (!('indexedDB' in window)) return reject(new Error('sin IndexedDB'));
      const req = indexedDB.open(IDB_NAME, 1);
      req.onupgradeneeded = () => req.result.createObjectStore(IDB_STORE);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }
  let idbWriteTimer = null, idbPending = null;
  function idbPut(json) {
    idbPending = json;
    clearTimeout(idbWriteTimer);
    idbWriteTimer = setTimeout(async () => {
      const data = idbPending; idbPending = null;
      try {
        const db = await idbOpen();
        const tx = db.transaction(IDB_STORE, 'readwrite');
        tx.objectStore(IDB_STORE).put(data, 'state');
        tx.objectStore(IDB_STORE).put(new Date().toISOString(), 'savedAt');
        tx.oncomplete = () => db.close();
      } catch (_) { /* sin IndexedDB */ }
    }, 300);
  }
  function idbGet(key) {
    return idbOpen().then((db) => new Promise((resolve) => {
      const req = db.transaction(IDB_STORE).objectStore(IDB_STORE).get(key);
      req.onsuccess = () => { resolve(req.result ?? null); db.close(); };
      req.onerror = () => { resolve(null); db.close(); };
    })).catch(() => null);
  }
  // Si localStorage no tiene datos reales pero IndexedDB sí, restaura y recarga.
  async function restoreFromMirrorIfNeeded() {
    const hasLocal = state.sessions.length > 0 || state.customExercises.length > 0;
    if (hasLocal) return;
    const json = await idbGet('state');
    if (!json) return;
    try {
      const mirror = JSON.parse(json);
      if (!Array.isArray(mirror.sessions) || !mirror.sessions.length) return;
      restoring = true;
      clearTimeout(idbWriteTimer); idbPending = null;
      localStorage.setItem(STORAGE_KEY, json);
      toast('Datos restaurados desde la copia de seguridad interna');
      setTimeout(() => location.reload(), 1200);
    } catch (_) { /* copia dañada */ }
  }
  function idbDelete() {
    return new Promise((resolve) => {
      try { const q = indexedDB.deleteDatabase(IDB_NAME); q.onsuccess = q.onerror = q.onblocked = () => resolve(); }
      catch (_) { resolve(); }
    });
  }

  /* ---------- Almacenamiento persistente ----------
     Pide al navegador que no borre los datos del sitio por falta de espacio. */
  async function requestPersistentStorage() {
    try {
      if (!navigator.storage?.persist) return null;
      if (await navigator.storage.persisted()) return true;
      return await navigator.storage.persist();
    } catch (_) { return null; }
  }
  async function storageStatus() {
    let persisted = null, usage = null;
    try { persisted = navigator.storage?.persisted ? await navigator.storage.persisted() : null; } catch (_) { /* no */ }
    try { const e = await navigator.storage?.estimate?.(); if (e) usage = e.usage; } catch (_) { /* no */ }
    return { persisted, usage, standalone: isStandalone, ios: isIOS };
  }

  const allExercises = () => LIBRARY.concat(state.customExercises);
  const getExercise = (id) => allExercises().find((e) => e.id === id) || { id, name: 'Ejercicio eliminado', muscle: '', media: null };
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

  /* ---------- Utilidades DOM ---------- */
  const $ = (sel, root = document) => root.querySelector(sel);
  function el(tag, attrs = {}, ...children) {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (v == null || v === false) continue;
      if (k === 'class') node.className = v;
      else if (k === 'html') node.innerHTML = v;
      else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2), v);
      else if (k === 'style' && typeof v === 'object') for (const [sk, sv] of Object.entries(v)) { if (sv == null) continue; if (sk.startsWith('--')) node.style.setProperty(sk, sv); else node.style[sk] = sv; }
      else if (v === true) node.setAttribute(k, '');
      else node.setAttribute(k, v);
    }
    for (const c of children.flat()) {
      if (c == null || c === false) continue;
      node.append(c.nodeType ? c : document.createTextNode(String(c)));
    }
    return node;
  }
  function svgEl(tag, attrs = {}, ...children) {
    const node = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (const [k, v] of Object.entries(attrs)) if (v != null) node.setAttribute(k, v);
    for (const c of children.flat()) if (c != null) node.append(c.nodeType ? c : document.createTextNode(String(c)));
    return node;
  }

  let toastTimer;
  function toast(msg, ms = 2200) {
    const t = $('#toast');
    t.textContent = msg; t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { t.hidden = true; }, ms);
  }

  function openModal(content) {
    const root = $('#modal-root');
    const modal = el('div', { class: 'modal' }, el('div', { class: 'grab' }), content);
    const backdrop = el('div', { class: 'modal-backdrop', onclick: (e) => { if (e.target === backdrop) close(); } }, modal);
    function close() { backdrop.remove(); }
    root.append(backdrop);
    return close;
  }

  function confirmDialog(title, text, okLabel = 'Confirmar', danger = false) {
    return new Promise((resolve) => {
      const close = openModal(el('div', {},
        el('h2', {}, title),
        el('p', { class: 'muted' }, text),
        el('div', { class: 'row', style: { justifyContent: 'flex-end' } },
          el('button', { class: 'btn btn-ghost', onclick: () => { close(); resolve(false); } }, 'Cancelar'),
          el('button', { class: 'btn ' + (danger ? 'btn-danger' : 'btn-accent'), onclick: () => { close(); resolve(true); } }, okLabel),
        ),
      ));
    });
  }

  const pad = (n) => String(n).padStart(2, '0');
  const fmtDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString('es', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  };
  const fmtShort = (iso) => { const d = new Date(iso); return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}`; };
  const fmtTime = (iso) => { const d = new Date(iso); return `${pad(d.getHours())}:${pad(d.getMinutes())}`; };
  const fmtDur = (a, b) => {
    const m = Math.max(0, Math.round((new Date(b) - new Date(a)) / 60000));
    return m >= 60 ? `${Math.floor(m / 60)} h ${m % 60} min` : `${m} min`;
  };
  const fmtNum = (w) => (w % 1 === 0 ? String(w) : w.toFixed(1));
  const fmtW = (w) => fmtNum(w) + ' kg';

  function mediaNode(ex, { autoplay = true } = {}) {
    if (!ex.media) {
      return el('div', { class: 'media-box dark placeholder' }, el('span', { class: 'muted', style: { fontSize: '2.5rem' } }, '🏋️'));
    }
    if (ex.media === 'image') {
      return el('div', { class: 'media-box' + (ex.wide ? ' wide' : '') }, el('img', { src: `media/${ex.id}.jpg`, alt: ex.name, loading: 'lazy' }));
    }
    const video = el('video', {
      src: `media/${ex.id}.mp4`, poster: `media/thumbs/${ex.id}.jpg`,
      muted: true, loop: true, playsinline: true, autoplay, preload: 'auto', 'aria-label': ex.name,
    });
    video.muted = true; // el atributo no siempre basta para autoplay en iOS
    if (autoplay) video.play?.().catch(() => {});
    video.addEventListener('click', () => (video.paused ? video.play() : video.pause()));
    return el('div', { class: 'media-box' + (ex.dark ? ' dark' : '') + (ex.wide ? ' wide' : '') }, video);
  }
  const thumbSrc = (ex) => (ex.media ? `media/thumbs/${ex.id}.jpg` : 'icons/icon.svg');

  /* ---------- Métricas de progreso ---------- */
  function sessionExerciseStats(entry) {
    const done = entry.sets.filter((s) => s.done && s.reps > 0);
    if (!done.length) return null;
    const maxWeight = Math.max(...done.map((s) => s.weight || 0));
    const volume = done.reduce((a, s) => a + s.reps * (s.weight || 0), 0);
    const reps = done.reduce((a, s) => a + s.reps, 0);
    const e1rm = Math.max(...done.map((s) => (s.weight || 0) * (1 + s.reps / 30)));
    return { maxWeight, volume, reps, e1rm: Math.round(e1rm * 10) / 10, sets: done.length };
  }
  function historyFor(exerciseId) {
    return state.sessions
      .slice().sort((a, b) => new Date(a.startedAt) - new Date(b.startedAt))
      .flatMap((s) => s.entries.filter((e) => e.exerciseId === exerciseId).map((e) => ({ session: s, entry: e, stats: sessionExerciseStats(e) })))
      .filter((x) => x.stats);
  }
  function lastEntryFor(exerciseId) {
    const h = historyFor(exerciseId);
    return h.length ? h[h.length - 1] : null;
  }
  function personalBests(exerciseId, beforeSessionId = null) {
    let maxWeight = 0, volume = 0;
    for (const x of historyFor(exerciseId)) {
      if (beforeSessionId && x.session.id === beforeSessionId) break;
      maxWeight = Math.max(maxWeight, x.stats.maxWeight);
      volume = Math.max(volume, x.stats.volume);
    }
    return { maxWeight, volume };
  }

  /* ---------- Render principal ---------- */
  const view = $('#view');
  // Clave de la vista actual: si no cambia entre renders (p. ej. al marcar una serie), se conserva el scroll.
  let lastViewKey = null;
  function viewKey() {
    return state.ui.screen === 'workout' && state.active ? `workout:${state.active.id}:${state.active.current}` : `${state.ui.screen}:${state.ui.tab}`;
  }
  function render() {
    const key = viewKey();
    const keep = key === lastViewKey;
    const y = window.scrollY;
    lastViewKey = key;
    stopMedia();
    // Mantener la altura mientras se vacía el contenido evita que el navegador salte arriba.
    if (keep) view.style.minHeight = view.offsetHeight + 'px';
    view.replaceChildren();
    document.querySelectorAll('.tab').forEach((t) => t.classList.toggle('active', state.ui.screen === 'tab' && t.dataset.tab === state.ui.tab));
    try { renderScreen(); }
    finally {
      if (keep) {
        window.scrollTo(0, y);
        requestAnimationFrame(() => { window.scrollTo(0, y); view.style.minHeight = ''; });
      } else {
        view.style.minHeight = '';
        window.scrollTo(0, 0);
      }
    }
  }
  function renderScreen() {
    if (state.ui.screen === 'workout' && state.active) return renderWorkout();
    if (state.ui.screen === 'editor') return renderEditor();
    state.ui.screen = 'tab';

    if (state.active) view.append(activeBanner());
    switch (state.ui.tab) {
      case 'exercises': return renderExercises();
      case 'history': return renderHistory();
      case 'progress': return renderProgress();
      default: return renderRoutines();
    }
  }
  function stopMedia() { view.querySelectorAll('video').forEach((v) => { v.pause(); v.removeAttribute('src'); v.load(); }); }
  function go(screen, tab) {
    if (tab) state.ui.tab = tab;
    state.ui.screen = screen;
    save(); render();
    window.scrollTo(0, 0);
  }
  document.querySelectorAll('.tab').forEach((t) => t.addEventListener('click', () => go('tab', t.dataset.tab)));

  function activeBanner() {
    const a = state.active;
    const done = a.entries.reduce((n, e) => n + e.sets.filter((s) => s.done).length, 0);
    return el('div', { class: 'card row between mb', style: { borderColor: 'var(--accent)' } },
      el('div', { class: 'grow' },
        el('div', { style: { fontWeight: 700 } }, '⏱️ Entrenamiento en curso'),
        el('div', { class: 'small muted' }, `${a.routineName} · ${done} series hechas · desde ${fmtTime(a.startedAt)}`)),
      el('button', { class: 'btn btn-accent btn-sm', onclick: () => go('workout') }, 'Continuar'));
  }

  /* ---------- Rutinas ---------- */
  function renderRoutines() {
    view.append(el('div', { class: 'section-head' },
      el('h1', {}, 'Rutinas'),
      el('button', { class: 'btn btn-accent btn-sm', onclick: () => startEditor(null) }, '+ Nueva')));
    if (!syncEnabled() && !state.sessions.length) {
      view.append(el('div', { class: 'card row between mb', style: { borderColor: 'var(--accent)' } },
        el('div', { class: 'grow' }, el('div', { style: { fontWeight: 700 } }, '☁️ ¿Tenías datos guardados?'),
          el('div', { class: 'small muted' }, 'Conecta la copia en la nube con tu frase para recuperarlos, o actívala ahora para no perderlos.')),
        el('button', { class: 'btn btn-accent btn-sm', onclick: openSettings }, 'Conectar')));
    }

    if (!state.routines.length) {
      view.append(el('div', { class: 'empty' }, el('div', { class: 'big' }, '📋'), 'Aún no tienes rutinas. Crea la primera.'));
      return;
    }
    const list = el('div', { class: 'stack' });
    for (const r of state.routines) {
      const last = state.sessions.filter((s) => s.routineId === r.id).sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt))[0];
      const totalSets = r.items.reduce((n, i) => n + Number(i.sets || 0), 0);
      list.append(el('div', { class: 'card' },
        el('div', { class: 'row between' },
          el('div', { class: 'grow' },
            el('h2', {}, r.name),
            el('div', { class: 'small muted' }, `${r.items.length} ejercicios · ${totalSets} series` + (last ? ` · última vez ${fmtDate(last.startedAt)}` : ' · nunca realizada')),
            r.notes ? el('div', { class: 'small notes' }, '📝 ', r.notes) : null),
        ),
        el('div', { class: 'ex-list mt' },
          r.items.map((it, idx) => {
            const ex = getExercise(it.exerciseId);
            return el('button', { class: 'ex-item ex-item-btn', 'aria-label': `Opciones de ${ex.name}`, onclick: () => routineItemActions(r, idx) },
              el('img', { class: 'thumb sm', src: thumbSrc(ex), alt: '', loading: 'lazy' }),
              el('div', { class: 'grow' }, el('div', { class: 'name' }, ex.name), el('div', { class: 'meta' }, ex.muscle)),
              el('span', { class: 'chip accent' }, `${it.sets}×${it.reps}`),
              el('span', { class: 'muted', 'aria-hidden': 'true' }, '›'));
          })),
        el('div', { class: 'row mt' },
          el('button', { class: 'btn btn-accent grow', onclick: () => startWorkout(r) }, '▶ Iniciar'),
          el('button', { class: 'btn btn-icon', title: 'Editar', 'aria-label': 'Editar', onclick: () => startEditor(r) }, '✏️'),
          el('button', { class: 'btn btn-icon', title: 'Duplicar', 'aria-label': 'Duplicar', onclick: () => duplicateRoutine(r) }, '📄'),
          el('button', { class: 'btn btn-icon btn-danger', title: 'Eliminar', 'aria-label': 'Eliminar', onclick: () => deleteRoutine(r) }, '🗑️'),
        ),
      ));
    }
    view.append(list);
  }

  /* Menú al tocar un ejercicio dentro de una rutina */
  function routineItemActions(r, idx) {
    const it = r.items[idx];
    const ex = getExercise(it.exerciseId);
    const num = (key, min, max) => el('input', {
      class: 'input num', type: 'number', inputmode: 'numeric', min, max, value: it[key], 'aria-label': key === 'sets' ? 'Series' : 'Repeticiones',
      onchange: (e) => { it[key] = clamp(parseInt(e.target.value, 10) || min, min, max); e.target.value = it[key]; save(); render(); },
    });
    const close = openModal(el('div', {},
      el('div', { class: 'ex-item mb' },
        el('img', { class: 'thumb', src: thumbSrc(ex), alt: '' }),
        el('div', { class: 'grow' }, el('h2', {}, ex.name), el('div', { class: 'small muted' }, `${ex.muscle} · en "${r.name}"`))),
      el('div', { class: 'mb' },
        el('div', { class: 'small muted', style: { fontWeight: 600, marginBottom: '.3rem' } }, 'Series × repeticiones'),
        el('div', { class: 'row', style: { gap: '.5rem' } }, num('sets', 1, 20), el('span', { class: 'muted' }, '×'), num('reps', 1, 200))),
      el('div', { class: 'stack' },
        el('button', { class: 'btn btn-accent btn-block', onclick: () => { close(); go('tab', 'exercises'); showExercise(ex); } }, '📖 Ver ficha y técnica'),
        el('button', { class: 'btn btn-block', onclick: () => { close(); pickExercise((nx) => {
          it.exerciseId = nx.id; save(); render(); toast(`Cambiado por ${nx.name}`);
        }); } }, '🔁 Cambiar por otro ejercicio'),
        el('button', { class: 'btn btn-block', onclick: () => { close(); startEditor(r); } }, '✏️ Editar rutina completa'),
        el('button', { class: 'btn btn-block btn-danger', onclick: async () => {
          close();
          if (!(await confirmDialog('Quitar ejercicio', `¿Quitar "${ex.name}" de la rutina "${r.name}"?`, 'Quitar', true))) return;
          r.items.splice(idx, 1); save(); render(); toast('Ejercicio quitado de la rutina');
        } }, '🗑️ Quitar de la rutina'))));
  }

  /* Ficha técnica (descripción, ejecución, consejos, errores) */
  function infoSections(ex, { open = false } = {}) {
    const info = window.EXERCISE_INFO?.[ex.id];
    if (!info) return el('p', { class: 'small muted mt' }, 'Este ejercicio no tiene ficha técnica todavía.');
    const list = (items, cls) => el('ul', { class: 'info-list ' + (cls || '') }, items.map((t) => el('li', {}, t)));
    const section = (title, body, isOpen) => el('details', { class: 'info', open: isOpen }, el('summary', {}, title), body);
    return el('div', { class: 'info-wrap mt' },
      el('p', { class: 'info-desc' }, info.descripcion),
      el('p', { class: 'small' }, el('b', {}, 'Músculos: '), info.musculos.primarios, el('span', { class: 'muted' }, ' · Secundarios: ' + info.musculos.secundarios)),
      section('🎯 Cómo se hace', el('ol', { class: 'info-list' }, info.pasos.map((t) => el('li', {}, t))), open),
      section('💡 Consejos', list(info.consejos), open),
      section('⚠️ Errores comunes', list(info.errores, 'err'), open),
      section('🔗 Fuentes', el('ul', { class: 'info-list small' }, info.fuentes.map((f) => el('li', {}, el('a', { href: f.u, target: '_blank', rel: 'noopener' }, f.t)))), false));
  }
  function showExerciseInfo(ex) {
    openModal(el('div', {}, el('h2', {}, ex.name), el('p', { class: 'muted small' }, ex.muscle), infoSections(ex, { open: true })));
  }

  function duplicateRoutine(r) {
    state.routines.push({ id: uid(), name: r.name + ' (copia)', items: r.items.map((i) => ({ ...i })) });
    save(); render(); toast('Rutina duplicada');
  }
  async function deleteRoutine(r) {
    if (!(await confirmDialog('Eliminar rutina', `¿Eliminar "${r.name}"? El historial de sesiones se conserva.`, 'Eliminar', true))) return;
    state.routines = state.routines.filter((x) => x.id !== r.id);
    save(); render(); toast('Rutina eliminada');
  }

  /* ---------- Editor de rutina ---------- */
  let draft = null;
  function startEditor(r) {
    draft = r ? { id: r.id, name: r.name, notes: r.notes || '', items: r.items.map((i) => ({ ...i })) } : { id: null, name: '', notes: '', items: [] };
    go('editor');
  }
  function renderEditor() {
    const isNew = !draft.id;
    view.append(el('div', { class: 'section-head' },
      el('button', { class: 'btn btn-ghost btn-sm', onclick: () => go('tab', 'routines') }, '‹ Cancelar'),
      el('h1', {}, isNew ? 'Nueva rutina' : 'Editar rutina'),
      el('button', { class: 'btn btn-accent btn-sm', onclick: saveDraft }, 'Guardar')));

    view.append(el('label', { class: 'field' }, el('span', {}, 'Nombre de la rutina'),
      el('input', { class: 'input', value: draft.name, placeholder: 'Ej. Rutina A · Pecho y espalda', oninput: (e) => { draft.name = e.target.value; } })));
    view.append(el('label', { class: 'field' }, el('span', {}, 'Notas (opcional)'),
      el('textarea', { class: 'input', rows: 2, placeholder: 'Ej. Bloque 2 alternado, bloque 3 en cuatriserie…', oninput: (e) => { draft.notes = e.target.value; } }, draft.notes)));

    const list = el('div', { class: 'stack' });
    if (!draft.items.length) list.append(el('div', { class: 'empty' }, 'Añade ejercicios con el botón de abajo.'));
    draft.items.forEach((it, idx) => {
      const ex = getExercise(it.exerciseId);
      const num = (key, min, max) => el('input', {
        class: 'input num', type: 'number', inputmode: 'numeric', min, max, value: it[key],
        onchange: (e) => { it[key] = clamp(parseInt(e.target.value, 10) || min, min, max); e.target.value = it[key]; },
      });
      list.append(el('div', { class: 'card edit-row' },
        el('img', { class: 'thumb sm', src: thumbSrc(ex), alt: '' }),
        el('div', { class: 'grow' }, el('div', { style: { fontWeight: 600 } }, ex.name), el('div', { class: 'small muted' }, ex.muscle)),
        el('div', { class: 'sr' }, num('sets', 1, 20), el('span', { class: 'muted' }, '×'), num('reps', 1, 200)),
        el('div', { class: 'ctrls' },
          el('button', { class: 'btn btn-icon btn-sm', disabled: idx === 0, 'aria-label': 'Subir', onclick: () => moveItem(idx, -1) }, '▲'),
          el('button', { class: 'btn btn-icon btn-sm', disabled: idx === draft.items.length - 1, 'aria-label': 'Bajar', onclick: () => moveItem(idx, 1) }, '▼'),
          el('button', { class: 'btn btn-icon btn-sm btn-danger', 'aria-label': 'Quitar', onclick: () => { draft.items.splice(idx, 1); render(); } }, '✕')),
      ));
    });
    view.append(list);
    view.append(el('button', { class: 'btn btn-block mt', onclick: () => pickExercise() }, '+ Añadir ejercicio'));
  }
  const clamp = (n, a, b) => Math.min(b, Math.max(a, n));
  function moveItem(i, d) { const [x] = draft.items.splice(i, 1); draft.items.splice(i + d, 0, x); render(); }
  function saveDraft() {
    const name = draft.name.trim();
    if (!name) return toast('Ponle un nombre a la rutina');
    if (!draft.items.length) return toast('Añade al menos un ejercicio');
    if (draft.id) {
      const r = state.routines.find((x) => x.id === draft.id);
      if (r) { r.name = name; r.notes = draft.notes.trim(); r.items = draft.items; }
    } else {
      state.routines.push({ id: uid(), name, notes: draft.notes.trim(), items: draft.items });
    }
    draft = null;
    go('tab', 'routines'); toast('Rutina guardada');
  }

  function pickExercise(onPick) {
    const add = onPick || ((ex) => { draft.items.push({ exerciseId: ex.id, sets: 4, reps: 10 }); render(); });
    const list = el('div', { class: 'ex-list' });
    const search = el('input', { class: 'input mb', placeholder: 'Buscar ejercicio…', oninput: () => fill(search.value) });
    function fill(q = '') {
      list.replaceChildren();
      const ql = q.trim().toLowerCase();
      for (const ex of allExercises().filter((e) => !ql || (e.name + ' ' + e.muscle).toLowerCase().includes(ql))) {
        list.append(el('button', { class: 'card clickable ex-item', style: { width: '100%', textAlign: 'left' }, onclick: () => { close(); add(ex); } },
          el('img', { class: 'thumb sm', src: thumbSrc(ex), alt: '' }),
          el('div', { class: 'grow' }, el('div', { class: 'name' }, ex.name), el('div', { class: 'meta' }, ex.muscle)),
          el('span', { class: 'muted' }, '+')));
      }
      if (!list.children.length) list.append(el('div', { class: 'empty' }, 'Sin resultados'));
    }
    fill();
    const close = openModal(el('div', {},
      el('h2', {}, 'Elegir ejercicio'), search, list,
      el('button', { class: 'btn btn-block mt', onclick: () => { close(); createCustomExercise(add); } }, '✚ Crear ejercicio personalizado')));
    setTimeout(() => search.focus(), 50);
  }

  function createCustomExercise(onCreated) {
    const name = el('input', { class: 'input', placeholder: 'Nombre (ej. Curl de bíceps)' });
    const muscle = el('input', { class: 'input', placeholder: 'Músculo (ej. Bíceps)' });
    const close = openModal(el('div', {},
      el('h2', {}, 'Ejercicio personalizado'),
      el('p', { class: 'small muted' }, 'Se mostrará sin animación.'),
      el('label', { class: 'field' }, el('span', {}, 'Nombre'), name),
      el('label', { class: 'field' }, el('span', {}, 'Grupo muscular'), muscle),
      el('button', { class: 'btn btn-accent btn-block', onclick: () => {
        const n = name.value.trim(); if (!n) return toast('Escribe un nombre');
        const ex = { id: 'custom-' + uid(), name: n, muscle: muscle.value.trim() || 'Personalizado', media: null };
        state.customExercises.push(ex); save(); close(); onCreated?.(ex); toast('Ejercicio creado');
      } }, 'Crear')));
    setTimeout(() => name.focus(), 50);
  }

  /* ---------- Ejercicios (biblioteca con animaciones) ---------- */
  function renderExercises() {
    view.append(el('div', { class: 'section-head' }, el('h1', {}, 'Ejercicios'),
      el('button', { class: 'btn btn-sm', onclick: () => createCustomExercise(() => render()) }, '+ Personalizado')));
    const grid = el('div', { class: 'ex-grid' });
    for (const ex of allExercises()) {
      grid.append(el('button', { class: 'card ex-tile', onclick: () => showExercise(ex) },
        el('img', { src: thumbSrc(ex), alt: '', loading: 'lazy' }),
        el('div', { class: 'name' }, ex.name, el('span', { class: 'muscle' }, ex.muscle))));
    }
    view.append(grid);
  }
  function showExercise(ex) {
    const last = lastEntryFor(ex.id);
    const pb = personalBests(ex.id);
    const isCustom = ex.id.startsWith('custom-');
    const close = openModal(el('div', {},
      el('h2', {}, ex.name), el('p', { class: 'muted small' }, ex.muscle),
      mediaNode(ex),
      last ? el('p', { class: 'last-time mt' }, 'Última vez (', fmtDate(last.session.startedAt), '): ', el('b', {}, setsSummary(last.entry))) : el('p', { class: 'muted small mt' }, 'Todavía no lo has registrado.'),
      pb.maxWeight ? el('div', { class: 'small' }, '🏆 Récord: ', el('b', {}, fmtW(pb.maxWeight)), ' · Mejor volumen: ', el('b', {}, fmtW(pb.volume))) : null,
      infoSections(ex),
      el('div', { class: 'row mt' },
        el('button', { class: 'btn grow', onclick: () => { close(); state.ui.progressEx = ex.id; go('tab', 'progress'); } }, '📈 Ver progreso'),
        isCustom ? el('button', { class: 'btn btn-danger', onclick: async () => {
          if (!(await confirmDialog('Eliminar ejercicio', 'Se quitará de la biblioteca; el historial se conserva.', 'Eliminar', true))) return;
          state.customExercises = state.customExercises.filter((c) => c.id !== ex.id); save(); close(); render();
        } }, '🗑️') : null),
    ));
  }
  function setsSummary(entry) {
    return entry.sets.filter((s) => s.done).map((s) => `${s.reps}×${s.weight || 0}kg`).join(' · ') || '—';
  }

  /* ---------- Entrenamiento ---------- */
  async function startWorkout(r) {
    if (state.active) {
      const ok = await confirmDialog('Entrenamiento en curso', `Ya tienes "${state.active.routineName}" en curso. ¿Descartarlo y empezar "${r.name}"?`, 'Descartar y empezar', true);
      if (!ok) return;
    }
    state.active = {
      id: uid(), routineId: r.id, routineName: r.name, startedAt: new Date().toISOString(), current: 0,
      entries: r.items.map((it) => makeEntry(it.exerciseId, it.sets, it.reps)),
    };
    go('workout');
  }
  // Crea la entrada de un ejercicio para el entrenamiento, con los kilos de la última sesión precargados.
  function makeEntry(exerciseId, sets, reps) {
    const last = lastEntryFor(exerciseId);
    const lastSets = last ? last.entry.sets.filter((s) => s.done) : [];
    return {
      exerciseId, name: getExercise(exerciseId).name, targetSets: sets, targetReps: reps,
      sets: Array.from({ length: sets }, (_, i) => ({
        reps,
        weight: lastSets[i]?.weight ?? lastSets[lastSets.length - 1]?.weight ?? 0,
        done: false,
      })),
    };
  }

  /* Opciones del ejercicio actual durante el entrenamiento: reemplazar o quitar */
  function workoutItemActions(a, idx) {
    const entry = a.entries[idx];
    const ex = getExercise(entry.exerciseId);
    const routine = state.routines.find((r) => r.id === a.routineId);
    // Posición equivalente en la rutina guardada: la n-ésima aparición del mismo ejercicio.
    const nth = a.entries.slice(0, idx).filter((e) => e.exerciseId === entry.exerciseId).length;
    let routineIdx = -1;
    if (routine) { let seen = 0; routineIdx = routine.items.findIndex((it) => it.exerciseId === entry.exerciseId && seen++ === nth); }
    const alsoRoutine = el('input', { type: 'checkbox', class: 'switch' });
    const done = entry.sets.filter((s) => s.done).length;
    const close = openModal(el('div', {},
      el('div', { class: 'ex-item mb' },
        el('img', { class: 'thumb', src: thumbSrc(ex), alt: '' }),
        el('div', { class: 'grow' }, el('h2', {}, ex.name), el('div', { class: 'small muted' }, `Ejercicio ${idx + 1} de ${a.entries.length} · ${done} series hechas`))),
      routine && routineIdx >= 0 ? el('label', { class: 'row mb', style: { gap: '.75rem' } }, alsoRoutine,
        el('div', { class: 'grow' }, el('div', { style: { fontWeight: 600 } }, 'Guardar también el cambio en la rutina'), el('div', { class: 'small muted' }, `Se aplicará a "${routine.name}" para las próximas veces.`))) : null,
      el('div', { class: 'stack' },
        el('button', { class: 'btn btn-accent btn-block', onclick: () => { close(); pickExercise((nx) => {
          a.entries[idx] = makeEntry(nx.id, entry.targetSets || entry.sets.length, entry.targetReps || entry.sets[0]?.reps || 10);
          if (alsoRoutine.checked && routine && routineIdx >= 0) routine.items[routineIdx].exerciseId = nx.id;
          save(); render(); toast(`Reemplazado por ${nx.name}`);
        }); } }, '🔁 Reemplazar por otro ejercicio'),
        el('button', { class: 'btn btn-block', onclick: () => { close(); showExerciseInfo(ex); } }, '📖 Técnica y consejos'),
        el('button', { class: 'btn btn-block btn-danger', disabled: a.entries.length <= 1, onclick: async () => {
          close();
          const msg = done ? `Tiene ${done} series hechas que se perderán. ¿Quitar "${ex.name}" de este entrenamiento?` : `¿Quitar "${ex.name}" de este entrenamiento?`;
          if (!(await confirmDialog('Quitar ejercicio', msg, 'Quitar', true))) return;
          a.entries.splice(idx, 1);
          a.current = clamp(a.current, 0, a.entries.length - 1);
          if (alsoRoutine.checked && routine && routineIdx >= 0) routine.items.splice(routineIdx, 1);
          save(); render(); toast('Ejercicio quitado del entrenamiento');
        } }, '🗑️ Quitar de este entrenamiento'),
        a.entries.length <= 1 ? el('p', { class: 'small muted', style: { textAlign: 'center' } }, 'No se puede quitar el único ejercicio; usa "Salir" para descartar el entrenamiento.') : null)));
  }

  function renderWorkout() {
    const a = state.active;
    a.current = clamp(a.current, 0, a.entries.length - 1);
    const entry = a.entries[a.current];
    const ex = getExercise(entry.exerciseId);
    const totalSets = a.entries.reduce((n, e) => n + e.sets.length, 0);
    const doneSets = a.entries.reduce((n, e) => n + e.sets.filter((s) => s.done).length, 0);

    view.append(el('div', { class: 'workout-head' },
      el('button', { class: 'btn btn-ghost btn-sm', onclick: () => go('tab', 'routines') }, '‹ Salir'),
      el('div', { class: 'grow', style: { textAlign: 'center' } },
        el('div', { class: 'title', style: { fontWeight: 700 } }, a.routineName),
        el('div', { class: 'small muted' }, `Ejercicio ${a.current + 1} de ${a.entries.length} · ${doneSets}/${totalSets} series`)),
      el('button', { class: 'btn btn-ok btn-sm', onclick: finishWorkout }, 'Finalizar')));
    view.append(el('div', { class: 'progress-bar' }, el('div', { style: { width: `${totalSets ? (doneSets / totalSets) * 100 : 0}%` } })));

    // Selector rápido de ejercicio
    const strip = el('div', { class: 'row', style: { overflowX: 'auto', gap: '.4rem', paddingBottom: '.5rem', marginBottom: '.5rem' } });
    a.entries.forEach((e, i) => {
      const d = e.sets.filter((s) => s.done).length;
      strip.append(el('button', {
        class: 'chip' + (i === a.current ? ' accent' : d === e.sets.length ? ' ok' : ''),
        style: { flex: 'none', border: i === a.current ? '1px solid var(--accent)' : undefined },
        onclick: () => { a.current = i; save(); render(); },
      }, `${i + 1}. ${e.name.split(' ')[0]} ${d}/${e.sets.length}`));
    });
    view.append(strip);
    // Mantener visible el ejercicio seleccionado: la barra se redibuja en cada render y perdía el desplazamiento.
    requestAnimationFrame(() => {
      const chip = strip.children[a.current];
      if (!chip) return;
      const target = chip.offsetLeft - (strip.clientWidth - chip.offsetWidth) / 2;
      strip.scrollLeft = Math.max(0, target);
    });
    const routineNotes = state.routines.find((r) => r.id === a.routineId)?.notes;
    if (routineNotes) view.append(el('p', { class: 'small notes mb' }, '📝 ', routineNotes));

    view.append(el('div', { class: 'row between', style: { alignItems: 'flex-start' } },
      el('h1', { class: 'grow' }, ex.name),
      el('button', { class: 'btn btn-icon', title: 'Opciones del ejercicio', 'aria-label': 'Opciones del ejercicio', onclick: () => workoutItemActions(a, a.current) }, '⋯')));
    view.append(el('p', { class: 'muted small' }, `${ex.muscle} · Objetivo: `, el('b', {}, `${entry.targetSets} × ${entry.targetReps}`)));
    view.append(mediaNode(ex));
    if (window.EXERCISE_INFO?.[ex.id]) view.append(el('button', { class: 'btn btn-block btn-sm mt', onclick: () => showExerciseInfo(ex) }, '📖 Técnica y consejos'));

    const last = lastEntryFor(entry.exerciseId);
    const pb = personalBests(entry.exerciseId);
    view.append(el('p', { class: 'last-time' },
      last ? ['Última vez (', fmtDate(last.session.startedAt), '): ', el('b', {}, setsSummary(last.entry))] : 'Primera vez con este ejercicio. ¡Registra tu base!',
      pb.maxWeight ? [' · Récord: ', el('b', {}, fmtW(pb.maxWeight))] : null));

    // Series de la última sesión (solo las hechas), para mostrarlas como referencia por serie.
    const prevSets = last ? last.entry.sets.filter((x) => x.done) : [];
    const hasPrev = prevSets.length > 0;
    const table = el('div', { class: 'set-table' + (hasPrev ? ' with-prev' : '') },
      el('div', { class: 'set-head' }, el('span', {}, 'Serie'), hasPrev ? el('span', {}, 'Anterior') : null, el('span', {}, 'Reps'), el('span', {}, 'Peso (kg)'), el('span', {}, '✓')));
    entry.sets.forEach((s, i) => {
      const row = el('div', { class: 'set-row' + (s.done ? ' done' : '') });
      const p = prevSets[i];
      const prevCell = hasPrev ? el('button', {
        class: 'prev' + (p ? '' : ' empty'), type: 'button',
        title: p ? 'Usar los valores de la última vez' : 'Sin dato de la última vez',
        'aria-label': p ? `Última vez: ${p.reps} repeticiones con ${p.weight || 0} kg. Tocar para usar` : 'Sin dato de la última vez',
        onclick: p ? () => { if (s.done) return; s.reps = p.reps; s.weight = p.weight || 0; s.rTouched = true; s.wTouched = true; save(); render(); } : null,
      }, p ? [el('b', {}, fmtNum(p.weight || 0)), el('span', { class: 'u' }, ' kg'), el('br'), el('span', { class: 'r' }, `${p.reps} reps`)] : '—') : null;
      const reps = el('input', { class: 'input num', type: 'number', inputmode: 'numeric', min: 0, value: s.reps,
        onchange: (e) => {
          s.reps = Math.max(0, parseInt(e.target.value, 10) || 0); e.target.value = s.reps;
          s.rTouched = true;
          if (propagate(entry, i, 'reps')) render(); else save();
        } });
      const weight = el('input', { class: 'input num', type: 'number', inputmode: 'decimal', min: 0, step: '0.5', value: s.weight,
        onchange: (e) => {
          s.weight = Math.max(0, parseFloat(String(e.target.value).replace(',', '.')) || 0); e.target.value = s.weight;
          s.wTouched = true;
          if (propagate(entry, i, 'weight')) render(); else save();
        } });
      row.append(
        el('span', { class: 'idx' }, i + 1), ...(prevCell ? [prevCell] : []), reps, weight,
        el('button', { class: 'done-btn', 'aria-label': s.done ? 'Desmarcar serie' : 'Marcar serie hecha', onclick: () => toggleSet(entry, s, i) }, s.done ? '✓' : '○'));
      table.append(row);
    });
    view.append(table);
    view.append(el('div', { class: 'row mt', style: { gap: '.5rem' } },
      el('button', { class: 'btn btn-sm', onclick: () => { entry.sets.push({ reps: entry.targetReps, weight: entry.sets[entry.sets.length - 1]?.weight || 0, done: false }); save(); render(); } }, '+ Serie'),
      entry.sets.length > 1 ? el('button', { class: 'btn btn-sm btn-ghost', onclick: () => { entry.sets.pop(); save(); render(); } }, '− Serie') : null,
      el('span', { class: 'grow' }),
      el('button', { class: 'btn btn-sm btn-ghost', onclick: () => { pickExercise((x) => {
        a.entries.splice(a.current + 1, 0, makeEntry(x.id, 4, 10));
        save(); render();
      }); } }, '+ Ejercicio extra')));

    view.append(el('div', { class: 'workout-nav' },
      el('button', { class: 'btn', disabled: a.current === 0, onclick: () => { a.current--; save(); render(); } }, '‹ Anterior'),
      a.current < a.entries.length - 1
        ? el('button', { class: 'btn btn-accent', onclick: () => { a.current++; save(); render(); } }, 'Siguiente ›')
        : el('button', { class: 'btn btn-ok', onclick: finishWorkout }, '✔ Finalizar')));

    view.append(el('p', { class: 'small muted mt', style: { textAlign: 'center' } },
      `Descanso: ${state.settings.rest}s · Aviso: ${state.settings.notify && notifPermission() === 'granted' ? 'activado' : state.settings.notify ? 'pendiente de permiso' : 'desactivado'} · `,
      el('a', { href: '#', onclick: (e) => { e.preventDefault(); openSettings(); } }, 'cambiar')));
  }

  // Autorrellena kilos o repeticiones en las series siguientes del mismo ejercicio que no estén hechas ni editadas a mano.
  function propagate(entry, i, key) {
    const v = entry.sets[i][key];
    const touched = key === 'weight' ? 'wTouched' : 'rTouched';
    let changed = false;
    entry.sets.forEach((n, j) => {
      if (j > i && !n.done && !n[touched] && n[key] !== v) { n[key] = v; changed = true; }
    });
    save();
    return changed;
  }

  function toggleSet(entry, s, i) {
    s.done = !s.done;
    if (s.done) {
      propagate(entry, i, 'weight'); propagate(entry, i, 'reps');
      startRest(state.settings.rest);
      const pb = personalBests(entry.exerciseId);
      if (s.weight && s.weight > pb.maxWeight && s.reps > 0) toast('🏆 ¡Nuevo récord de peso!');
    }
    save(); render();
  }
  /* ---------- Ajustes (notificaciones y descanso) ---------- */
  function openSettings() {
    const perm = notifPermission();
    const statusText = perm === 'unsupported' ? 'Este navegador no admite notificaciones. En iPhone, instala la app en la pantalla de inicio (iOS 16.4 o superior).'
      : perm === 'denied' ? 'Bloqueadas por el navegador. Actívalas en los ajustes del sitio (icono del candado o información de la página).'
      : perm === 'granted' ? 'Permiso concedido. Recibirás el aviso aunque la pantalla esté apagada.'
      : 'Falta conceder el permiso del navegador.';
    const statusChip = perm === 'granted' && state.settings.notify ? el('span', { class: 'chip ok' }, 'Activadas')
      : !state.settings.notify ? el('span', { class: 'chip' }, 'Desactivadas')
      : el('span', { class: 'chip accent' }, perm === 'denied' ? 'Bloqueadas' : 'Sin permiso');

    const toggle = el('input', { type: 'checkbox', class: 'switch', checked: state.settings.notify, onchange: () => {
      state.settings.notify = toggle.checked; save();
      if (toggle.checked && perm === 'default') { askedNotif = false; ensureNotificationPermission().then(reopen); }
      else reopen();
    } });
    const restInput = el('input', { class: 'input num', type: 'number', min: 10, max: 600, step: 5, value: state.settings.rest,
      onchange: () => { state.settings.rest = clamp(parseInt(restInput.value, 10) || DEFAULT_REST, 10, 600); restInput.value = state.settings.rest; save(); } });

    const close = openModal(el('div', {},
      el('h2', {}, '⚙️ Ajustes'),

      el('div', { class: 'card mb' },
        el('div', { class: 'row between' }, el('h3', {}, '🔔 Notificaciones'), statusChip),
        el('label', { class: 'row', style: { gap: '.75rem', padding: '.6rem 0' } }, toggle,
          el('div', { class: 'grow' }, el('div', { style: { fontWeight: 600 } }, 'Avisar al terminar el descanso'),
            el('div', { class: 'small muted' }, 'Notificación del sistema con el ejercicio y la serie que toca.'))),
        el('p', { class: 'small muted' }, statusText),
        state.settings.notify && perm === 'default' ? el('button', { class: 'btn btn-block', onclick: async () => { askedNotif = false; await ensureNotificationPermission(); reopen(); } }, '🔔 Permitir notificaciones') : null,
        state.settings.notify && perm === 'granted' ? el('button', { class: 'btn btn-block btn-sm', onclick: testNotification }, 'Probar notificación') : null),

      el('div', { class: 'card mb' },
        el('h3', {}, '⏱️ Descanso entre series'),
        el('label', { class: 'field', style: { marginBottom: 0 } }, el('span', {}, 'Segundos'), restInput),
        el('p', { class: 'small muted', style: { margin: '.5rem 0 0' } }, 'Además del aviso, la app vibra y suena si está en primer plano.')),

      cloudCard(),
      storageCard(),

      el('button', { class: 'btn btn-accent btn-block', onclick: () => { close(); render(); } }, 'Listo')));
    function reopen() { close(); openSettings(); }
  }
  function cloudCard() {
    const c = syncCfg();
    const card = el('div', { class: 'card mb' });
    const render_ = () => {
      card.replaceChildren(el('div', { class: 'row between' }, el('h3', {}, '☁️ Copia en la nube'),
        syncEnabled() ? el('span', { class: 'chip ' + (c.lastError ? 'accent' : 'ok') }, c.lastError ? 'Con error' : 'Conectada') : el('span', { class: 'chip' }, 'Sin conectar')));
      if (!syncEnabled()) {
        const phrase = el('input', { class: 'input', type: 'password', placeholder: 'Tu frase secreta (mín. 8 caracteres)', autocomplete: 'off' });
        const show = el('input', { type: 'checkbox', onchange: () => { phrase.type = show.checked ? 'text' : 'password'; } });
        const btn = el('button', { class: 'btn btn-accent btn-block', onclick: async () => {
          btn.disabled = true; btn.textContent = 'Conectando…';
          const ok = await connectCloud(phrase.value);
          btn.disabled = false; btn.textContent = 'Conectar';
          if (ok) { render_(); render(); }
        } }, 'Conectar');
        card.append(
          el('p', { class: 'small muted' }, 'Guarda tu progreso en la nube con una frase que solo tú conoces. Si el teléfono borra la app, vuelve a escribir la frase y recuperas todo. También sirve para usar la app en dos dispositivos.'),
          el('label', { class: 'field' }, el('span', {}, 'Frase secreta'), phrase),
          el('label', { class: 'row small muted', style: { gap: '.5rem', marginBottom: '.6rem' } }, show, 'Mostrar frase'),
          btn,
          el('p', { class: 'small muted', style: { marginTop: '.5rem' } }, 'La frase nunca sale del teléfono: solo se envía una huella cifrada. Elige una frase larga y guárdala en un lugar seguro.'));
      } else {
        const d = c.lastSyncAt ? Math.round((Date.now() - new Date(c.lastSyncAt)) / 60000) : null;
        card.append(
          el('p', { class: 'small muted' }, c.lastError ? `⚠️ ${c.lastError}` : (d === null ? 'Aún no se ha sincronizado.' : d < 1 ? '✅ Sincronizada hace un momento.' : d < 60 ? `✅ Sincronizada hace ${d} min.` : `✅ Sincronizada el ${fmtDate(c.lastSyncAt)} a las ${fmtTime(c.lastSyncAt)}.`),
            ' Cada cambio se sube solo en unos segundos.'),
          el('div', { class: 'row wrap' },
            el('button', { class: 'btn btn-sm', onclick: async (e) => { e.target.disabled = true; await cloudPull(); e.target.disabled = false; render_(); render(); } }, '🔄 Sincronizar ahora'),
            el('button', { class: 'btn btn-sm btn-danger', onclick: async () => {
              if (!(await confirmDialog('Desconectar la nube', 'Los datos del teléfono se conservan y la copia en la nube no se borra. Podrás reconectar con la misma frase.', 'Desconectar', true))) return;
              disconnectCloud(); render_();
            } }, 'Desconectar')));
      }
      const adv = el('details', { class: 'info', style: { marginTop: '.6rem' } }, el('summary', {}, 'Avanzado: servidor'),
        el('div', { style: { padding: '0 .8rem .7rem' } },
          el('input', { class: 'input', placeholder: `Por defecto: ${SYNC_DEFAULT_URL} (mismo dominio)`, value: c.url || '', onchange: (e) => { c.url = e.target.value.trim(); persistQuiet(); } }),
          el('div', { class: 'small muted', style: { marginTop: '.3rem' } }, 'Solo si el Worker está en otra dirección (p. ej. https://gym-sync.tu-cuenta.workers.dev/api/backup).')));
      card.append(adv);
    };
    render_();
    return card;
  }
  function storageCard() {
    const status = el('div', { class: 'small muted' }, 'Comprobando…');
    const d = daysSince(state.settings.lastExportAt);
    const card = el('div', { class: 'card mb' },
      el('h3', {}, '💾 Tus datos'),
      status,
      el('p', { class: 'small muted', style: { margin: '.5rem 0' } }, `${state.sessions.length} sesiones guardadas · ` + (d === null ? 'sin copia de seguridad' : `última copia hace ${d} días`)),
      el('div', { class: 'row wrap' },
        el('button', { class: 'btn btn-sm btn-accent', onclick: exportData }, '⬇️ Guardar copia'),
        el('button', { class: 'btn btn-sm', onclick: importData }, '⬆️ Restaurar copia')));
    storageStatus().then((st) => {
      status.replaceChildren();
      const line = (ok, text) => status.append(el('div', { style: { color: ok ? 'var(--ok)' : 'var(--accent-2)', marginBottom: '.2rem' } }, (ok ? '✅ ' : '⚠️ ') + text));
      if (st.ios && !st.standalone) line(false, 'En iPhone, Safari borra los datos de las webs tras 7 días sin usarlas. Instala la app en la pantalla de inicio (Compartir → Añadir a pantalla de inicio) para evitarlo.');
      else line(st.standalone, st.standalone ? 'App instalada: los datos no se borran por inactividad.' : 'Abre la app instalada (no desde el navegador) para que los datos duren más.');
      if (st.persisted === true) line(true, 'Almacenamiento persistente concedido: el navegador no borrará los datos por falta de espacio.');
      else if (st.persisted === false) line(false, 'El navegador aún puede borrar los datos si falta espacio. Usa la app con frecuencia y guarda copias.');
      status.append(el('div', { style: { marginTop: '.3rem' } }, 'Además, la app guarda una copia interna que se restaura sola si el navegador vacía el almacenamiento principal. Aun así, la única copia a prueba de todo es la que guardas fuera del teléfono.'));
    });
    return card;
  }
  async function testNotification() {
    if (notifPermission() !== 'granted') return toast('Primero concede el permiso');
    const opts = { body: 'Así se verá el aviso al terminar el descanso.', icon: 'icons/icon-192.png', tag: 'rest-test' };
    try {
      const reg = await navigator.serviceWorker?.getRegistration();
      if (reg) await reg.showNotification('⏰ Descanso terminado', opts); else new Notification('⏰ Descanso terminado', opts);
      toast('Notificación enviada');
    } catch (_) { toast('No se pudo mostrar la notificación'); }
  }
  $('#btn-settings').addEventListener('click', openSettings);

  async function finishWorkout() {
    const a = state.active;
    const entries = a.entries.map((e) => ({ ...e, sets: e.sets.filter((s) => s.done && s.reps > 0) })).filter((e) => e.sets.length);
    if (!entries.length) {
      if (await confirmDialog('Sin series registradas', 'No marcaste ninguna serie. ¿Descartar este entrenamiento?', 'Descartar', true)) {
        state.active = null; stopRest(); go('tab', 'routines');
      }
      return;
    }
    const pending = a.entries.reduce((n, e) => n + e.sets.filter((s) => !s.done).length, 0);
    if (pending && !(await confirmDialog('Finalizar entrenamiento', `Quedan ${pending} series sin marcar. Se guardarán solo las series completadas.`, 'Finalizar'))) return;
    const session = { id: a.id, routineId: a.routineId, routineName: a.routineName, startedAt: a.startedAt, finishedAt: new Date().toISOString(), entries };
    state.sessions.push(session);
    state.active = null; stopRest();
    save();
    showSummary(session);
    go('tab', 'history');
  }
  function showSummary(s) {
    const vol = s.entries.reduce((n, e) => n + (sessionExerciseStats(e)?.volume || 0), 0);
    const sets = s.entries.reduce((n, e) => n + e.sets.length, 0);
    const prs = s.entries.filter((e) => { const st = sessionExerciseStats(e); const pb = personalBests(e.exerciseId, s.id); return st && st.maxWeight > 0 && st.maxWeight > pb.maxWeight; });
    const close = openModal(el('div', {},
      el('h2', {}, '💪 ¡Entrenamiento guardado!'),
      el('div', { class: 'stats' },
        el('div', { class: 'stat' }, el('div', { class: 'v' }, fmtDur(s.startedAt, s.finishedAt)), el('div', { class: 'l' }, 'Duración')),
        el('div', { class: 'stat' }, el('div', { class: 'v' }, sets), el('div', { class: 'l' }, 'Series')),
        el('div', { class: 'stat' }, el('div', { class: 'v' }, Math.round(vol)), el('div', { class: 'l' }, 'Volumen (kg)'))),
      prs.length ? el('p', { class: 'pr-badge' }, '🏆 Récords: ' + prs.map((e) => e.name).join(', ')) : null,
      el('button', { class: 'btn btn-accent btn-block', onclick: () => close() }, 'Genial')));
  }

  /* ---------- Temporizador de descanso ---------- */
  let restTimer = null, restEnd = 0, restNode = null;
  function startRest(sec) {
    stopRest();
    restEnd = Date.now() + sec * 1000;
    restNode = el('div', { class: 'rest' },
      el('span', { class: 'muted small' }, 'Descanso'),
      el('span', { class: 't' }, fmtSec(sec)),
      el('button', { class: 'btn btn-sm', onclick: () => { restEnd += 30000; scheduleRestNotification(); tick(); } }, '+30s'),
      el('button', { class: 'btn btn-sm btn-ghost', 'aria-label': 'Saltar descanso', onclick: stopRest }, '✕'));
    document.body.append(restNode);
    document.body.classList.add('resting');
    restTimer = setInterval(tick, 250);
    ensureNotificationPermission().then(scheduleRestNotification);
    tick();
  }
  function tick() {
    if (!restNode) return;
    const left = Math.max(0, Math.ceil((restEnd - Date.now()) / 1000));
    restNode.querySelector('.t').textContent = fmtSec(left);
    if (left <= 0) {
      stopRest({ keepNotification: true });
      toast('⏰ ¡A por la siguiente serie!'); navigator.vibrate?.([200, 100, 200]); beep();
      if (!swReady()) showRestNotificationFromPage();
    }
  }
  function stopRest({ keepNotification = false } = {}) {
    clearInterval(restTimer); restTimer = null; restNode?.remove(); restNode = null;
    document.body.classList.remove('resting');
    if (!keepNotification) cancelRestNotification();
  }
  // Si la app vuelve a primer plano, actualiza el contador (los temporizadores se pausan en segundo plano).
  document.addEventListener('visibilitychange', () => { if (!document.hidden) tick(); });

  /* ---------- Notificaciones al terminar el descanso ---------- */
  const notifSupported = () => 'Notification' in window;
  const notifPermission = () => (notifSupported() ? Notification.permission : 'unsupported');
  const swReady = () => !!navigator.serviceWorker?.controller;
  let askedNotif = false;
  async function ensureNotificationPermission() {
    if (!state.settings.notify || !notifSupported() || askedNotif) return notifPermission() === 'granted';
    if (Notification.permission === 'default') {
      askedNotif = true;
      try { await Notification.requestPermission(); } catch (_) { /* ignorado */ }
      if (Notification.permission === 'denied') toast('Notificaciones bloqueadas: actívalas en los ajustes del navegador');
    }
    return Notification.permission === 'granted';
  }
  function restNotificationPayload() {
    const a = state.active;
    const e = a?.entries[a.current];
    const nextSet = e ? e.sets.findIndex((x) => !x.done) + 1 : 0;
    return {
      title: '⏰ Descanso terminado',
      body: e ? (nextSet ? `${e.name} · serie ${nextSet} de ${e.sets.length}` : `${e.name} · ¡ejercicio completado!`) : '¡A por la siguiente serie!',
    };
  }
  function scheduleRestNotification() {
    if (!state.settings.notify || notifPermission() !== 'granted' || !swReady() || !restNode) return;
    navigator.serviceWorker.controller.postMessage({ type: 'rest:schedule', at: restEnd, ...restNotificationPayload() });
  }
  function cancelRestNotification() {
    if (swReady()) navigator.serviceWorker.controller.postMessage({ type: 'rest:cancel' });
  }
  function showRestNotificationFromPage() {
    if (!state.settings.notify || notifPermission() !== 'granted') return;
    const p = restNotificationPayload();
    try { new Notification(p.title, { body: p.body, icon: 'icons/icon-192.png', tag: 'rest', silent: false }); } catch (_) { /* iOS sin SW */ }
  }
  // Al tocar la notificación el SW enfoca la app; aquí solo cerramos el contador si sigue visible.
  navigator.serviceWorker?.addEventListener('message', (ev) => { if (ev.data?.type === 'rest:fired') tick(); });

  const fmtSec = (s) => `${Math.floor(s / 60)}:${pad(s % 60)}`;
  function beep() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination); o.frequency.value = 880; g.gain.value = 0.15;
      o.start(); o.stop(ctx.currentTime + 0.25);
      setTimeout(() => ctx.close(), 400);
    } catch (_) { /* sin audio */ }
  }

  /* ---------- Historial ---------- */

  /* ---------- Agrupación y paleta (vista general / historial) ---------- */
  const GROUPS = ['Pecho', 'Espalda', 'Hombros', 'Brazos', 'Pierna', 'Otros'];
  // Paleta categórica validada para superficie oscura (orden fijo, nunca se recicla).
  const PALETTE = ['#e06218', '#357fd6', '#2a9c5a', '#9470d8', '#b08a1a', '#b84e72'];
  function muscleGroup(ex) {
    const m = (ex.muscle || '').toLowerCase();
    if (/pecho|pectoral/.test(m)) return 'Pecho';
    if (/espalda|dorsal|lumbar|trapecio/.test(m)) return 'Espalda';
    if (/hombro|deltoid/.test(m)) return 'Hombros';
    if (/b[ií]ceps|tr[ií]ceps|braquial|antebrazo/.test(m)) return 'Brazos';
    if (/cu[aá]driceps|isquio|femoral|pierna|gl[uú]teo|aductor|abductor|pantorrilla|tibial|gemelo/.test(m)) return 'Pierna';
    return 'Otros';
  }
  const sessionVolume = (s) => s.entries.reduce((n, e) => n + (sessionExerciseStats(e)?.volume || 0), 0);
  const sessionSets = (s) => s.entries.reduce((n, e) => n + e.sets.length, 0);
  const weekStart = (t) => { const d = new Date(t); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return d.getTime(); };
  const routineColor = (routineId) => {
    const ids = [...new Set([...state.routines.map((r) => r.id), ...state.sessions.map((s) => s.routineId)])];
    return PALETTE[Math.max(0, ids.indexOf(routineId)) % PALETTE.length];
  };
  const fmtTons = (kg) => (kg >= 10000 ? (kg / 1000).toFixed(1) + ' t' : fmtNumOnly(Math.round(kg)) + ' kg');
  const weekLabel = (t) => {
    const cur = weekStart(Date.now());
    if (t === cur) return 'Esta semana';
    if (t === cur - 7 * DAY) return 'Semana pasada';
    return 'Semana del ' + new Date(t).toLocaleDateString('es', { day: 'numeric', month: 'short' });
  };

  function renderHistory() {
    view.append(el('div', { class: 'section-head' }, el('h1', {}, 'Historial'),
      el('span', { class: 'chip' }, `${state.sessions.length} sesiones`)));
    const bb = backupBanner(); if (bb) view.append(bb);
    if (!state.sessions.length) {
      view.append(el('div', { class: 'empty' }, el('div', { class: 'big' }, '🗓️'), 'Todavía no hay entrenamientos guardados. Inicia una rutina para empezar.'));
      return;
    }
    const weekAgo = Date.now() - 7 * 864e5;
    const week = state.sessions.filter((s) => new Date(s.startedAt) > weekAgo).length;
    view.append(el('div', { class: 'stats' },
      el('div', { class: 'stat' }, el('div', { class: 'v' }, week), el('div', { class: 'l' }, 'Esta semana')),
      el('div', { class: 'stat' }, el('div', { class: 'v' }, state.sessions.length), el('div', { class: 'l' }, 'Total')),
      el('div', { class: 'stat' }, el('div', { class: 'v' }, Math.round(state.sessions.reduce((n, s) => n + s.entries.reduce((m, e) => m + (sessionExerciseStats(e)?.volume || 0), 0), 0) / 1000 * 10) / 10 + ' t'), el('div', { class: 'l' }, 'Volumen total'))));
    view.append(activityCalendar());

    // Filtros: rutina y búsqueda por ejercicio
    const f = state.ui.histFilter || (state.ui.histFilter = { routine: 'all', q: '' });
    const routines = [...new Map(state.sessions.map((x) => [x.routineId, x.routineName])).entries()];
    const chips = el('div', { class: 'filter-chips' },
      el('button', { class: 'chip' + (f.routine === 'all' ? ' accent' : ''), onclick: () => { f.routine = 'all'; render(); } }, 'Todas'),
      routines.map(([id, name]) => el('button', { class: 'chip' + (f.routine === id ? ' accent' : ''), onclick: () => { f.routine = id; render(); } },
        el('i', { class: 'swatch', style: { background: routineColor(id) } }), name.split(' · ')[0])));
    const search = el('input', { class: 'input search', placeholder: 'Buscar ejercicio…', value: f.q, oninput: (e) => { f.q = e.target.value; refreshList(); } });
    view.append(el('div', { class: 'filters-block' }, chips, search));

    const listWrap = el('div');
    view.append(listWrap);
    function refreshList() {
      const q = f.q.trim().toLowerCase();
      const sessions = state.sessions
        .filter((x) => f.routine === 'all' || x.routineId === f.routine)
        .filter((x) => !q || x.entries.some((e) => e.name.toLowerCase().includes(q)))
        .sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt));
      listWrap.replaceChildren();
      if (!sessions.length) { listWrap.append(el('div', { class: 'empty' }, 'Ninguna sesión coincide con el filtro.')); return; }
      // Agrupar por semana, con comparación de volumen frente a la semana anterior (misma selección)
      const groups = new Map();
      for (const x of sessions) { const k = weekStart(new Date(x.startedAt).getTime()); if (!groups.has(k)) groups.set(k, []); groups.get(k).push(x); }
      const keys = [...groups.keys()].sort((a, b) => b - a);
      const volOf = (k) => (groups.get(k) || []).reduce((n, x) => n + sessionVolume(x), 0);
      const maxSessionVol = Math.max(1, ...sessions.map(sessionVolume));
      keys.forEach((k, i) => {
        const items = groups.get(k);
        const vol = volOf(k), prev = volOf(keys[i + 1]);
        const mins = items.reduce((n, x) => n + Math.round((new Date(x.finishedAt) - new Date(x.startedAt)) / 60000), 0);
        const delta = prev ? (vol - prev) / prev : null;
        listWrap.append(el('div', { class: 'week-head' },
          el('div', {}, el('div', { class: 'wk-title' }, weekLabel(k)),
            el('div', { class: 'small muted' }, `${items.length} ${items.length === 1 ? 'sesión' : 'sesiones'} · ${fmtTons(vol)} · ${mins >= 60 ? `${Math.floor(mins / 60)} h ${mins % 60} min` : `${mins} min`}`)),
          delta !== null ? el('span', { class: 'trend ' + (delta >= 0 ? 'up' : 'down') }, (delta >= 0 ? '▲ ' : '▼ ') + fmtPct(delta)) : null));
        items.forEach((x) => listWrap.append(sessionCard(x, maxSessionVol, q)));
      });
    }
    refreshList();
  }

  function sessionCard(s, maxVol, q = '') {
    const vol = sessionVolume(s);
    const prs = s.entries.filter((e) => { const st = sessionExerciseStats(e); const pb = personalBests(e.exerciseId, s.id); return st && st.maxWeight > 0 && st.maxWeight > pb.maxWeight; });
    const details = el('div', { class: 'details-inner' },
      s.entries.map((e) => {
        const isPr = prs.includes(e);
        const hit = q && e.name.toLowerCase().includes(q);
        return el('div', { class: 'ex-line' + (hit ? ' hit' : '') },
          el('span', {}, e.name, isPr ? el('span', { class: 'pr-badge' }, ' 🏆') : null),
          el('span', { class: 'sets' }, setsSummary(e)));
      }),
      el('div', { class: 'row mt', style: { justifyContent: 'flex-end' } },
        el('button', { class: 'btn btn-sm btn-ghost', onclick: () => repeatSession(s) }, '🔁 Repetir'),
        el('button', { class: 'btn btn-sm btn-danger', onclick: async () => {
          if (!(await confirmDialog('Eliminar sesión', 'Esta acción no se puede deshacer.', 'Eliminar', true))) return;
          state.sessions = state.sessions.filter((x) => x.id !== s.id); save(); render();
        } }, '🗑️ Eliminar')));
    const panel = el('div', { class: 'details-panel' + (q ? ' open' : '') }, details);
    const card = el('div', { class: 'card session-card clickable', style: { '--rc': routineColor(s.routineId) }, 'aria-expanded': q ? 'true' : 'false',
      onclick: (e) => { if (e.target.closest('button')) return; const open = panel.classList.toggle('open'); card.setAttribute('aria-expanded', open); } },
      el('div', { class: 'row between', style: { alignItems: 'flex-start' } },
        el('div', { class: 'grow' },
          el('div', { class: 'date' }, fmtDate(s.startedAt), el('span', { class: 'muted small' }, ` · ${fmtTime(s.startedAt)}`)),
          el('div', { class: 'small muted' }, el('i', { class: 'swatch' }), `${s.routineName} · ${fmtDur(s.startedAt, s.finishedAt)}`)),
        el('div', { class: 'sess-nums' }, el('div', { class: 'v' }, fmtTons(vol)), el('div', { class: 'small muted' }, `${sessionSets(s)} series · ${s.entries.length} ej.`))),
      el('div', { class: 'vol-bar' }, el('div', { style: { width: `${Math.round((vol / maxVol) * 100)}%` } })),
      prs.length ? el('div', { class: 'pr-chips' }, prs.map((e) => el('span', { class: 'chip ok' }, `🏆 ${e.name.split(' ').slice(0, 3).join(' ')} · ${fmtW(sessionExerciseStats(e).maxWeight)}`))) : null,
      panel);
    return card;
  }
  function repeatSession(s) {
    const r = state.routines.find((x) => x.id === s.routineId) || {
      id: s.routineId, name: s.routineName,
      items: s.entries.map((e) => ({ exerciseId: e.exerciseId, sets: e.targetSets || e.sets.length, reps: e.targetReps || e.sets[0]?.reps || 10 })),
    };
    startWorkout(r);
  }

  /* ---------- Progreso ---------- */
  const METRICS = {
    maxWeight: { label: 'Peso máx', unit: 'kg', fmt: (v) => fmtW(v) },
    volume: { label: 'Volumen', unit: 'kg', fmt: (v) => Math.round(v) + ' kg' },
    e1rm: { label: '1RM est.', unit: 'kg', fmt: (v) => fmtW(v) },
    reps: { label: 'Reps', unit: 'reps', fmt: (v) => v + ' reps' },
  };
  const RANGES = { '1M': 30, '3M': 91, '6M': 182, 'Todo': null };
  const DAY = 864e5;
  const fmtDay = (iso) => new Date(iso).toLocaleDateString('es', { day: 'numeric', month: 'short' });
  const fmtPct = (p) => (p >= 0 ? '+' : '−') + Math.abs(Math.round(p * 100)) + '%';

  // Serie de valores de una métrica por sesión, con marca de récord (valor > todos los anteriores).
  function metricSeries(exerciseId, metric) {
    let best = -Infinity;
    return historyFor(exerciseId).map((h) => {
      const y = h.stats[metric];
      const pr = y > best && best !== -Infinity;
      best = Math.max(best, y);
      return { t: new Date(h.session.startedAt).getTime(), x: h.session.startedAt, y, pr, h };
    });
  }
  // Variación frente al valor de hace ~30 días (o el primero si no hay tanto histórico).
  function trendOf(series) {
    if (series.length < 2) return null;
    const last = series[series.length - 1];
    const cutoff = last.t - 30 * DAY;
    const ref = series.slice().reverse().find((p) => p.t <= cutoff) || series[0];
    if (!ref.y) return null;
    return { pct: (last.y - ref.y) / ref.y, delta: last.y - ref.y, since: ref.x };
  }

  function renderProgress() {
    const pview = state.ui.progressView || 'exercise';
    view.append(el('div', { class: 'section-head' }, el('h1', {}, 'Progreso'),
      el('div', { class: 'seg' },
        el('button', { class: 'seg-btn' + (pview === 'exercise' ? ' on' : ''), onclick: () => { state.ui.progressView = 'exercise'; save(); render(); } }, 'Por ejercicio'),
        el('button', { class: 'seg-btn' + (pview === 'overview' ? ' on' : ''), onclick: () => { state.ui.progressView = 'overview'; save(); render(); } }, 'General'))));
    const exercised = allExercises().filter((e) => historyFor(e.id).length);
    if (pview === 'overview' && state.sessions.length) { renderOverview(); view.append(dataTools()); return; }
    if (!exercised.length) {
      view.append(el('div', { class: 'empty' }, el('div', { class: 'big' }, '📈'), 'Cuando guardes entrenamientos verás aquí tu evolución por ejercicio.'));
      view.append(dataTools());
      return;
    }
    if (!exercised.some((e) => e.id === state.ui.progressEx)) state.ui.progressEx = exercised[0].id;
    const metric = state.ui.progressMetric;
    const range = state.ui.progressRange || 'Todo';

    // Selector de ejercicio: tarjetas con miniatura, última marca y sparkline, ordenadas por última sesión.
    const strip = el('div', { class: 'ex-strip' });
    exercised
      .map((e) => ({ e, series: metricSeries(e.id, metric) }))
      .sort((a, b) => b.series[b.series.length - 1].t - a.series[a.series.length - 1].t)
      .forEach(({ e, series }) => {
        const last = series[series.length - 1];
        const tr = trendOf(series);
        strip.append(el('button', { class: 'ex-card' + (e.id === state.ui.progressEx ? ' selected' : ''), onclick: () => { state.ui.progressEx = e.id; save(); render(); } },
          el('img', { src: thumbSrc(e), alt: '', loading: 'lazy' }),
          el('div', { class: 'name' }, e.name),
          el('div', { class: 'row between', style: { alignItems: 'flex-end' } },
            el('div', {}, el('div', { class: 'val' }, METRICS[metric].fmt(last.y)),
              tr ? el('div', { class: 'trend ' + (tr.pct >= 0 ? 'up' : 'down') }, (tr.pct >= 0 ? '▲ ' : '▼ ') + fmtPct(tr.pct)) : el('div', { class: 'trend muted' }, `${series.length} ${series.length === 1 ? 'sesión' : 'sesiones'}`)),
            sparkline(series.slice(-12).map((p) => p.y)))));
      });
    view.append(strip);
    requestAnimationFrame(() => { const c = strip.querySelector('.selected'); if (c) strip.scrollLeft = Math.max(0, c.offsetLeft - (strip.clientWidth - c.offsetWidth) / 2); });

    // Filtros: métrica y rango, en una sola fila.
    const filters = el('div', { class: 'filters' });
    const seg = (items, current, onPick) => el('div', { class: 'seg' }, items.map(([k, label]) => el('button', { class: 'seg-btn' + (k === current ? ' on' : ''), onclick: () => onPick(k) }, label)));
    filters.append(
      seg(Object.entries(METRICS).map(([k, m]) => [k, m.label]), metric, (k) => { state.ui.progressMetric = k; save(); render(); }),
      seg(Object.keys(RANGES).map((k) => [k, k]), range, (k) => { state.ui.progressRange = k; save(); render(); }));
    view.append(filters);

    const ex = getExercise(state.ui.progressEx);
    const full = metricSeries(ex.id, metric);
    const days = RANGES[range];
    const series = days ? full.filter((p) => p.t >= Date.now() - days * DAY) : full;
    const last = full[full.length - 1];
    const bestP = full.reduce((a, p) => (p.y > a.y ? p : a), full[0]);
    const tr = trendOf(full);
    const e1 = full[full.length - 1].h.stats.e1rm;

    // Cabecera de tendencia
    view.append(el('div', { class: 'card hero' },
      el('div', { class: 'row between', style: { alignItems: 'flex-start' } },
        el('div', {},
          el('div', { class: 'small muted' }, ex.name, ' · ', METRICS[metric].label.toLowerCase()),
          el('div', { class: 'hero-v' }, fmtNumOnly(last.y), el('span', { class: 'unit' }, ' ' + METRICS[metric].unit)),
          tr ? el('div', { class: 'trend ' + (tr.pct >= 0 ? 'up' : 'down') }, (tr.pct >= 0 ? '▲ ' : '▼ ') + fmtPct(tr.pct) + ' ', el('span', { class: 'muted' }, `desde el ${fmtDay(tr.since)}`)) : el('div', { class: 'small muted' }, 'Registra más sesiones para ver la tendencia')),
        el('div', { class: 'hero-side' },
          el('div', {}, el('div', { class: 'small muted' }, 'Mejor'), el('div', { class: 'hv' }, METRICS[metric].fmt(bestP.y)), el('div', { class: 'small muted' }, fmtDay(bestP.x))),
          metric !== 'e1rm' ? el('div', {}, el('div', { class: 'small muted' }, '1RM est.'), el('div', { class: 'hv' }, fmtW(e1))) : el('div', {}, el('div', { class: 'small muted' }, 'Sesiones'), el('div', { class: 'hv' }, full.length))))));

    // Gráfica
    const card = el('div', { class: 'card chart-card' });
    if (!series.length) card.append(el('div', { class: 'empty', style: { padding: '1.5rem' } }, 'Sin sesiones en este rango.'));
    else card.append(lineChart(series, METRICS[metric]));
    view.append(card);

    // Sesiones del rango
    const rows = el('div', { class: 'card mt' }, el('div', { class: 'row between' }, el('h3', {}, 'Sesiones'), el('span', { class: 'chip' }, `${series.length} en el rango`)));
    series.slice().reverse().forEach((p) => rows.append(el('div', { class: 'sess-row' },
      el('span', { class: 'muted' }, fmtDate(p.x)),
      el('span', { class: 'sets' }, setsSummary(p.h.entry), p.pr ? el('span', { class: 'pr-badge' }, ' 🏆') : null))));
    view.append(rows);
    view.append(dataTools());
  }

  /* ---------- Vista general: volumen semanal y reparto muscular ---------- */
  function renderOverview() {
    const weeks = 12;
    const cur = weekStart(Date.now());
    const byWeek = Array.from({ length: weeks }, (_, i) => ({ t: cur - (weeks - 1 - i) * 7 * DAY, vol: 0, n: 0, sets: 0 }));
    const groupVol = Object.fromEntries(GROUPS.map((g) => [g, 0]));
    const since4w = cur - 3 * 7 * DAY;
    for (const s of state.sessions) {
      const t = new Date(s.startedAt).getTime();
      const w = byWeek.find((x) => weekStart(t) === x.t);
      const v = sessionVolume(s);
      if (w) { w.vol += v; w.n++; w.sets += sessionSets(s); }
      if (t >= since4w) for (const e of s.entries) groupVol[muscleGroup(getExercise(e.exerciseId))] += sessionExerciseStats(e)?.volume || 0;
    }
    // Si la semana actual aún no tiene sesiones (p. ej. lunes), la cabecera muestra la semana pasada.
    const showLast = byWeek[weeks - 1].n === 0 && byWeek[weeks - 2].n > 0;
    const thisW = showLast ? byWeek[weeks - 2] : byWeek[weeks - 1], lastW = showLast ? byWeek[weeks - 3] : byWeek[weeks - 2];
    const delta = lastW && lastW.vol ? (thisW.vol - lastW.vol) / lastW.vol : null;
    const avg = byWeek.slice(0, -1).filter((w) => w.n).reduce((a, w, _, arr) => a + w.vol / arr.length, 0);

    view.append(el('div', { class: 'card hero' },
      el('div', { class: 'row between', style: { alignItems: 'flex-start' } },
        el('div', {},
          el('div', { class: 'small muted' }, showLast ? 'Volumen la semana pasada' : 'Volumen esta semana'),
          el('div', { class: 'hero-v' }, fmtNumOnly(Math.round(thisW.vol)), el('span', { class: 'unit' }, ' kg')),
          delta !== null ? el('div', { class: 'trend ' + (delta >= 0 ? 'up' : 'down') }, (delta >= 0 ? '▲ ' : '▼ ') + fmtPct(delta) + ' ', el('span', { class: 'muted' }, showLast ? 'vs. la anterior' : 'vs. semana pasada')) : el('div', { class: 'small muted' }, 'Sin datos de la semana anterior'),
          showLast ? el('div', { class: 'small muted' }, 'Esta semana aún sin entrenamientos') : null),
        el('div', { class: 'hero-side' },
          el('div', {}, el('div', { class: 'small muted' }, 'Sesiones'), el('div', { class: 'hv' }, thisW.n), el('div', { class: 'small muted' }, `${thisW.sets} series`)),
          el('div', {}, el('div', { class: 'small muted' }, 'Media / semana'), el('div', { class: 'hv' }, fmtTons(avg)))))));

    view.append(el('div', { class: 'card chart-card' }, el('h3', { class: 'chart-title' }, 'Volumen semanal · 12 semanas'), barChart(byWeek)));

    const total = Object.values(groupVol).reduce((a, b) => a + b, 0);
    if (total > 0) view.append(el('div', { class: 'card mt' }, el('h3', { class: 'chart-title' }, 'Reparto por grupo muscular · últimas 4 semanas'), donut(groupVol, total)));
  }

  // Barras: semana actual en acento, resto atenuado; tooltip por barra.
  function barChart(weeksData) {
    const W = 600, H = 200, P = { l: 44, r: 10, t: 14, b: 28 };
    const wrap = el('div', { class: 'chart-wrap' });
    const svg = svgEl('svg', { class: 'chart bars', viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': 'Volumen semanal' });
    const maxV = Math.max(1, ...weeksData.map((w) => w.vol));
    const raw = maxV / 3, mag = Math.pow(10, Math.floor(Math.log10(raw)));
    const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((v) => v >= raw) || raw;
    const top = Math.ceil(maxV / step) * step;
    const yAt = (v) => P.t + (1 - v / top) * (H - P.t - P.b);
    for (let v = 0; v <= top + 1e-9; v += step) {
      svg.append(svgEl('line', { class: 'grid', x1: P.l, x2: W - P.r, y1: yAt(v), y2: yAt(v) }));
      svg.append(svgEl('text', { class: 'tick', x: P.l - 8, y: yAt(v) + 4, 'text-anchor': 'end' }, v >= 1000 ? (v / 1000) + 'k' : v));
    }
    const slot = (W - P.l - P.r) / weeksData.length, bw = Math.min(28, slot * 0.6);
    const tip = el('div', { class: 'chart-tip', hidden: true });
    weeksData.forEach((w, i) => {
      const x = P.l + slot * i + (slot - bw) / 2;
      const y = w.vol ? yAt(w.vol) : yAt(0) - 2;
      const h = Math.max(2, yAt(0) - y);
      const g = svgEl('g', { class: 'bar' + (i === weeksData.length - 1 ? ' current' : '') + (w.vol ? '' : ' empty'), tabindex: 0 });
      g.append(svgEl('rect', { class: 'hit', x: P.l + slot * i, y: P.t, width: slot, height: H - P.t - P.b }));
      g.append(svgEl('rect', { class: 'fill', x, y, width: bw, height: h, rx: 4 }));
      g.append(svgEl('rect', { class: 'base', x, y: yAt(0) - 2, width: bw, height: 2 }));
      if (i % 3 === 0 || i === weeksData.length - 1) svg.append(svgEl('text', { class: 'tick', x: x + bw / 2, y: H - 8, 'text-anchor': 'middle' }, new Date(w.t).toLocaleDateString('es', { day: 'numeric', month: 'short' })));
      const show = () => {
        svg.querySelectorAll('.bar.active').forEach((b) => b.classList.remove('active')); g.classList.add('active');
        tip.replaceChildren(el('div', { class: 'tv' }, fmtTons(w.vol)), el('div', { class: 'td' }, weekLabel(w.t)), el('div', { class: 'ts' }, w.n ? `${w.n} ${w.n === 1 ? 'sesión' : 'sesiones'} · ${w.sets} series` : 'Sin entrenamientos'));
        tip.hidden = false; const pct = (x + bw / 2) / W;
        tip.style.left = `${pct * 100}%`; tip.style.transform = `translateX(${pct > 0.6 ? '-100%' : pct < 0.25 ? '0' : '-50%'})`; tip.style.top = `${Math.max(0, (y / H) * 100 - 34)}%`;
      };
      g.addEventListener('pointerenter', show); g.addEventListener('pointerdown', show); g.addEventListener('focus', show);
      svg.append(g);
    });
    svg.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') { tip.hidden = true; svg.querySelectorAll('.bar.active').forEach((b) => b.classList.remove('active')); } });
    wrap.append(svg, tip);
    return wrap;
  }

  // Anillo de reparto con leyenda (color fijo por grupo; el texto nunca lleva el color del dato).
  function donut(groupVol, total) {
    const R = 54, C = 2 * Math.PI * R, size = 140;
    const svg = svgEl('svg', { class: 'donut', viewBox: `0 0 ${size} ${size}`, role: 'img', 'aria-label': 'Reparto por grupo muscular' });
    let offset = 0;
    const rows = GROUPS.map((g, i) => ({ g, v: groupVol[g], color: PALETTE[i] })).filter((r) => r.v > 0).sort((a, b) => b.v - a.v);
    rows.forEach((r) => {
      const frac = r.v / total;
      const seg = svgEl('circle', { class: 'seg', cx: size / 2, cy: size / 2, r: R, fill: 'none', stroke: r.color, 'stroke-width': 14,
        'stroke-dasharray': `${Math.max(0, frac * C - 2)} ${C}`, 'stroke-dashoffset': -offset, transform: `rotate(-90 ${size / 2} ${size / 2})` });
      seg.append(svgEl('title', {}, `${r.g}: ${Math.round(frac * 100)}%`));
      svg.append(seg); offset += frac * C;
    });
    svg.append(svgEl('text', { class: 'donut-c', x: size / 2, y: size / 2 - 2, 'text-anchor': 'middle' }, rows[0] ? Math.round((rows[0].v / total) * 100) + '%' : ''));
    svg.append(svgEl('text', { class: 'donut-l', x: size / 2, y: size / 2 + 14, 'text-anchor': 'middle' }, rows[0]?.g || ''));
    const legend = el('div', { class: 'legend-list' }, rows.map((r) => el('div', { class: 'legend-row' },
      el('i', { class: 'swatch', style: { background: r.color } }), el('span', { class: 'grow' }, r.g),
      el('span', { class: 'muted' }, fmtTons(r.v)), el('b', {}, Math.round((r.v / total) * 100) + '%'))));
    return el('div', { class: 'donut-wrap' }, svg, legend);
  }

  const fmtNumOnly = (v) => (Math.abs(v) >= 1000 ? Math.round(v).toLocaleString('es') : fmtNum(v));

  // Curva suavizada (Catmull-Rom → Bézier) a partir de puntos en píxeles.
  function smoothPath(pts) {
    if (pts.length < 2) return pts.length ? `M${pts[0].x},${pts[0].y}` : '';
    let d = `M${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      const c1x = p1.x + (p2.x - p0.x) / 6, c1y = p1.y + (p2.y - p0.y) / 6;
      const c2x = p2.x - (p3.x - p1.x) / 6, c2y = p2.y - (p3.y - p1.y) / 6;
      d += ` C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
    }
    return d;
  }
  function sparkline(values) {
    const W = 72, H = 26, P = 3;
    const svg = svgEl('svg', { class: 'spark', viewBox: `0 0 ${W} ${H}`, 'aria-hidden': 'true' });
    if (values.length < 2) return svg;
    const min = Math.min(...values), max = Math.max(...values);
    const pts = values.map((v, i) => ({ x: P + (i / (values.length - 1)) * (W - 2 * P), y: max === min ? H / 2 : P + (1 - (v - min) / (max - min)) * (H - 2 * P) }));
    svg.append(svgEl('path', { class: 'spark-line', d: smoothPath(pts) }));
    const l = pts[pts.length - 1];
    svg.append(svgEl('circle', { class: 'spark-dot', cx: l.x, cy: l.y, r: 2.5 }));
    return svg;
  }

  // Gráfica de líneas con eje temporal real, área, récords y cursor con tooltip.
  function lineChart(series, m) {
    const W = 600, H = 250, P = { l: 44, r: 16, t: 18, b: 30 };
    const wrap = el('div', { class: 'chart-wrap' });
    const svg = svgEl('svg', { class: 'chart', viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': `Evolución de ${m.label}` });
    const ys = series.map((p) => p.y);
    let lo = Math.min(...ys), hi = Math.max(...ys);
    if (lo === hi) { lo = lo * 0.85; hi = hi * 1.15 || 1; }
    const pad = (hi - lo) * 0.12; lo = Math.max(0, lo - pad); hi += pad;
    // Escala "bonita": paso 1, 2, 2.5 o 5 × 10^k, con 3 o 4 divisiones
    const raw = (hi - lo) / 3, mag = Math.pow(10, Math.floor(Math.log10(raw)));
    const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((v) => v >= raw) || raw;
    const min = Math.floor(lo / step) * step, max = Math.ceil(hi / step) * step;
    const divisions = Math.round((max - min) / step);
    const t0 = series[0].t, t1 = series[series.length - 1].t;
    const span = Math.max(t1 - t0, DAY);
    const xAt = (t) => (series.length === 1 ? W / 2 : P.l + ((t - t0) / span) * (W - P.l - P.r));
    const yAt = (v) => P.t + (1 - (v - min) / (max - min)) * (H - P.t - P.b);
    const pts = series.map((p) => ({ x: xAt(p.t), y: yAt(p.y), p }));

    // Rejilla y eje Y (4 líneas, valores redondeados)
    for (let g = 0; g <= divisions; g++) {
      const v = min + step * g, y = yAt(v);
      svg.append(svgEl('line', { class: 'grid', x1: P.l, x2: W - P.r, y1: y, y2: y }));
      svg.append(svgEl('text', { class: 'tick', x: P.l - 8, y: y + 4, 'text-anchor': 'end' }, fmtNumOnly(Math.round(v * 100) / 100)));
    }
    // Eje X: hasta 5 fechas repartidas
    const n = Math.min(5, series.length);
    const ticks = new Set();
    for (let i = 0; i < n; i++) ticks.add(Math.round((i / Math.max(1, n - 1)) * (series.length - 1)));
    [...ticks].forEach((i) => svg.append(svgEl('text', { class: 'tick', x: xAt(series[i].t), y: H - 8, 'text-anchor': i === 0 ? 'start' : i === series.length - 1 ? 'end' : 'middle' }, fmtDay(series[i].x))));

    // Área + línea
    const defs = svgEl('defs');
    const grad = svgEl('linearGradient', { id: 'area-grad', x1: 0, y1: 0, x2: 0, y2: 1 });
    grad.append(svgEl('stop', { offset: '0%', 'stop-color': 'var(--accent)', 'stop-opacity': '.18' }), svgEl('stop', { offset: '100%', 'stop-color': 'var(--accent)', 'stop-opacity': '0' }));
    defs.append(grad); svg.append(defs);
    const lineD = smoothPath(pts);
    if (pts.length > 1) {
      svg.append(svgEl('path', { class: 'area', d: `${lineD} L${pts[pts.length - 1].x.toFixed(1)},${(H - P.b).toFixed(1)} L${pts[0].x.toFixed(1)},${(H - P.b).toFixed(1)} Z` }));
      svg.append(svgEl('path', { class: 'line', d: lineD }));
    }
    // Cursor
    const cursor = svgEl('line', { class: 'cursor', x1: 0, x2: 0, y1: P.t, y2: H - P.b, hidden: true });
    svg.append(cursor);
    // Puntos (récords con anillo)
    const dots = pts.map(({ x, y, p }) => {
      const g = svgEl('g', { class: 'pt' + (p.pr ? ' pr' : '') });
      if (p.pr) g.append(svgEl('circle', { class: 'ring', cx: x, cy: y, r: 8 }));
      g.append(svgEl('circle', { class: 'dot', cx: x, cy: y, r: 4 }));
      svg.append(g); return g;
    });
    const tip = el('div', { class: 'chart-tip', hidden: true });
    wrap.append(svg, tip);

    let active = -1;
    function show(i) {
      if (i === active || i < 0) return;
      active = i;
      const { x, y, p } = pts[i];
      cursor.setAttribute('x1', x); cursor.setAttribute('x2', x); cursor.hidden = false;
      dots.forEach((g, j) => g.classList.toggle('active', j === i));
      tip.replaceChildren(
        el('div', { class: 'tv' }, m.fmt(p.y), p.pr ? el('span', { class: 'pr-badge' }, ' 🏆 récord') : null),
        el('div', { class: 'td' }, fmtDate(p.x)),
        el('div', { class: 'ts' }, setsSummary(p.h.entry)));
      tip.hidden = false;
      const pct = x / W;
      tip.style.left = `${pct * 100}%`;
      tip.style.transform = `translateX(${pct > 0.6 ? '-100%' : pct < 0.25 ? '0' : '-50%'})`;
      tip.style.top = `${Math.max(0, (y / H) * 100 - 30)}%`;
    }
    function nearest(clientX) {
      const r = svg.getBoundingClientRect();
      const xv = ((clientX - r.left) / r.width) * W;
      let best = 0; pts.forEach((q, i) => { if (Math.abs(q.x - xv) < Math.abs(pts[best].x - xv)) best = i; });
      return best;
    }
    svg.addEventListener('pointerdown', (e) => { show(nearest(e.clientX)); });
    svg.addEventListener('pointermove', (e) => { if (e.pointerType === 'mouse' || e.buttons) show(nearest(e.clientX)); });
    svg.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') { cursor.hidden = true; tip.hidden = true; dots.forEach((g) => g.classList.remove('active')); active = -1; } });
    svg.style.touchAction = 'pan-y';
    return wrap;
  }

  // Calendario de actividad: últimas 12 semanas, intensidad por volumen; racha de semanas seguidas.
  function activityCalendar() {
    const byDay = new Map();
    for (const s of state.sessions) {
      const d = new Date(s.startedAt); d.setHours(0, 0, 0, 0);
      const k = d.getTime();
      const vol = s.entries.reduce((n, e) => n + (sessionExerciseStats(e)?.volume || 0), 0);
      const cur = byDay.get(k) || { n: 0, vol: 0, names: [] };
      cur.n++; cur.vol += vol; cur.names.push(s.routineName); byDay.set(k, cur);
    }
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const dow = (today.getDay() + 6) % 7; // lunes = 0
    const weeks = 12;
    const start = new Date(today); start.setDate(today.getDate() - dow - (weeks - 1) * 7);
    const maxVol = Math.max(1, ...[...byDay.values()].map((v) => v.vol));
    const grid = el('div', { class: 'cal-grid' });
    ['L', 'M', 'X', 'J', 'V', 'S', 'D'].forEach((d, i) => grid.append(el('span', { class: 'cal-lbl', style: { gridRow: i + 2, gridColumn: 1 } }, d)));
    let lastMonth = -1;
    for (let w = 0; w < weeks; w++) {
      for (let d = 0; d < 7; d++) {
        const date = new Date(start); date.setDate(start.getDate() + w * 7 + d);
        const k = date.getTime();
        if (d === 0 && date.getMonth() !== lastMonth) { lastMonth = date.getMonth(); grid.append(el('span', { class: 'cal-lbl cal-month', style: { gridRow: 1, gridColumn: w + 2 } }, date.toLocaleDateString('es', { month: 'short' }))); }
        const v = byDay.get(k);
        const level = !v ? 0 : Math.min(4, 1 + Math.floor((v.vol / maxVol) * 3.99));
        const cell = el('button', { class: 'cal-cell l' + level + (k === today.getTime() ? ' today' : '') + (date > today ? ' future' : ''), style: { gridRow: d + 2, gridColumn: w + 2 },
          'aria-label': `${date.toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long' })}: ${v ? `${v.n} ${v.n > 1 ? 'sesiones' : 'sesión'}, ${Math.round(v.vol)} kg` : 'sin entrenamiento'}`,
          onclick: () => toast(v ? `${fmtDay(date)}: ${v.names.join(', ')} · ${Math.round(v.vol)} kg` : `${fmtDay(date)}: sin entrenamiento`) });
        grid.append(cell);
      }
    }
    // Racha: semanas consecutivas (hasta la actual) con al menos una sesión
    const weekKey = (t) => { const d = new Date(t); const dd = (d.getDay() + 6) % 7; d.setDate(d.getDate() - dd); d.setHours(0, 0, 0, 0); return d.getTime(); };
    const weeksWith = new Set([...byDay.keys()].map(weekKey));
    let streak = 0; let wk = weekKey(today);
    if (!weeksWith.has(wk)) wk -= 7 * DAY; // la semana actual aún puede completarse
    while (weeksWith.has(wk)) { streak++; wk -= 7 * DAY; }
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1).getTime();
    const thisMonth = [...byDay.entries()].filter(([k]) => k >= monthStart).reduce((n, [, v]) => n + v.n, 0);
    return el('div', { class: 'card mb' },
      el('h3', {}, '📆 Actividad'),
      el('div', { class: 'row wrap mb', style: { gap: '.4rem' } },
        el('span', { class: 'chip ' + (streak ? 'ok' : '') }, `🔥 ${streak} semana${streak === 1 ? '' : 's'} seguidas`),
        el('span', { class: 'chip' }, `${thisMonth} sesiones este mes`)),
      el('div', { class: 'cal-scroll' }, grid),
      el('div', { class: 'cal-legend small muted' }, 'Menos ', [0, 1, 2, 3, 4].map((l) => el('i', { class: 'cal-cell l' + l })), ' Más volumen'));
  }

  /* ---------- Exportar / importar ---------- */
  function dataTools() {
    return el('div', { class: 'card mt' },
      el('h3', {}, 'Tus datos'),
      el('p', { class: 'small muted' }, 'Todo se guarda en este dispositivo. Exporta una copia para no perder el progreso o para pasarlo a otro teléfono.',
        state.settings.lastExportAt ? ` Última copia: hace ${daysSince(state.settings.lastExportAt)} días.` : ' Todavía no has guardado ninguna copia.'),
      el('div', { class: 'row wrap' },
        el('button', { class: 'btn btn-sm', onclick: exportData }, '⬇️ Exportar JSON'),
        el('button', { class: 'btn btn-sm', onclick: importData }, '⬆️ Importar JSON'),
        el('button', { class: 'btn btn-sm btn-danger', onclick: async () => {
          if (!(await confirmDialog('Borrar todo', 'Se eliminarán rutinas, historial y ejercicios personalizados. Las rutinas de ejemplo se restaurarán.', 'Borrar todo', true))) return;
          restoring = true; clearTimeout(idbWriteTimer); idbPending = null;
          localStorage.removeItem(STORAGE_KEY); await idbDelete(); location.reload();
        } }, '🧹 Reiniciar')));
  }
  async function exportData() {
    const now = new Date();
    const name = `gym-tracker-${now.toISOString().slice(0, 10)}.json`;
    const json = JSON.stringify({ routines: state.routines, customExercises: state.customExercises, sessions: state.sessions, settings: { rest: state.settings.rest, notify: state.settings.notify }, exportedAt: now.toISOString() }, null, 2);
    const markDone = () => { state.settings.lastExportAt = now.toISOString(); save(); toast('Copia guardada'); render(); };
    // En el móvil, la hoja de compartir permite guardar en Archivos, Drive, WhatsApp, etc.
    try {
      const file = new File([json], name, { type: 'application/json' });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: 'Copia de Gym Tracker' });
        markDone(); return;
      }
    } catch (e) { if (e?.name === 'AbortError') return; }
    const blob = new Blob([json], { type: 'application/json' });
    const a = el('a', { href: URL.createObjectURL(blob), download: name });
    document.body.append(a); a.click(); a.remove();
    markDone();
  }
  const daysSince = (iso) => (iso ? Math.floor((Date.now() - new Date(iso)) / 864e5) : null);
  // Aviso cuando hay sesiones y la última copia tiene más de 7 días (o nunca se hizo).
  function backupBanner() {
    if (!state.sessions.length) return null;
    const d = daysSince(state.settings.lastExportAt);
    if (d !== null && d < 7) return null;
    return el('div', { class: 'card mb', style: { borderColor: 'var(--accent)' } },
      el('div', { class: 'row between' },
        el('div', { class: 'grow' },
          el('div', { style: { fontWeight: 700 } }, '💾 Haz una copia de seguridad'),
          el('div', { class: 'small muted' }, d === null ? 'Nunca has guardado una copia de tu progreso.' : `Tu última copia tiene ${d} días.`)),
        el('button', { class: 'btn btn-accent btn-sm', onclick: exportData }, 'Guardar copia')));
  }
  function importData() {
    const input = el('input', { type: 'file', accept: 'application/json,.json' });
    input.addEventListener('change', async () => {
      const f = input.files?.[0]; if (!f) return;
      try {
        const data = JSON.parse(await f.text());
        if (!Array.isArray(data.sessions) || !Array.isArray(data.routines)) throw new Error('formato');
        const merge = await confirmDialog('Importar datos', '¿Combinar con los datos actuales? (Cancelar = reemplazar todo)', 'Combinar');
        if (merge) {
          const have = new Set(state.sessions.map((s) => s.id));
          state.sessions.push(...data.sessions.filter((s) => !have.has(s.id)));
          const haveR = new Set(state.routines.map((r) => r.id));
          state.routines.push(...data.routines.filter((r) => !haveR.has(r.id)));
          const haveE = new Set(state.customExercises.map((e) => e.id));
          state.customExercises.push(...(data.customExercises || []).filter((e) => !haveE.has(e.id)));
        } else {
          state.sessions = data.sessions; state.routines = data.routines; state.customExercises = data.customExercises || [];
        }
        if (data.settings) state.settings = { ...state.settings, ...data.settings, sync: state.settings.sync };
        save(); render(); toast('Datos importados');
      } catch (_) { toast('Archivo no válido'); }
    });
    input.click();
  }

  /* ---------- PWA: instalación y service worker ---------- */
  let deferredPrompt = null;
  const installBtn = $('#btn-install');
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault(); deferredPrompt = e; installBtn.hidden = false;
  });
  installBtn.addEventListener('click', async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') installBtn.hidden = true;
      deferredPrompt = null;
    } else {
      showInstallHelp();
    }
  });
  window.addEventListener('appinstalled', () => { installBtn.hidden = true; toast('¡App instalada!'); });
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  if (!isStandalone && isIOS) installBtn.hidden = false;

  function showInstallHelp() {
    openModal(el('div', {},
      el('h2', {}, 'Instalar Gym Tracker'),
      isIOS
        ? el('ol', {}, el('li', {}, 'Toca el botón ', el('b', {}, 'Compartir'), ' (cuadrado con flecha) en Safari.'), el('li', {}, 'Elige ', el('b', {}, '"Añadir a pantalla de inicio"'), '.'), el('li', {}, 'Confirma con ', el('b', {}, 'Añadir'), '.'))
        : el('ol', {}, el('li', {}, 'Abre el menú del navegador (⋮).'), el('li', {}, 'Toca ', el('b', {}, '"Instalar aplicación"'), ' o ', el('b', {}, '"Añadir a pantalla de inicio"'), '.')),
      el('p', { class: 'small muted' }, 'La app funciona sin conexión una vez instalada.')));
  }

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').then((reg) => {
        reg.addEventListener('updatefound', () => {
          const nw = reg.installing;
          nw?.addEventListener('statechange', () => {
            if (nw.state === 'installed' && navigator.serviceWorker.controller) toast('Nueva versión lista: recarga la app');
          });
        });
      }).catch(() => {});
    });
  }

  /* ---------- Arranque ---------- */
  if (!state.active) state.ui.screen = 'tab';
  if (state.ui.screen === 'editor') state.ui.screen = 'tab';
  restoreFromMirrorIfNeeded().finally(() => { if (restoring) return; save(); requestPersistentStorage(); cloudPull({ silent: true }).then((r) => { if (r && (r.restored || r.added)) render(); }); });
  render();
})();
