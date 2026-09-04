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
      settings: { rest: DEFAULT_REST },
      ui: { tab: 'routines', screen: 'tab', progressEx: null, progressMetric: 'maxWeight' },
    };
    if (!saved) return base;
    // Rutinas de ejemplo añadidas en versiones nuevas: se agregan una sola vez (si el usuario las borra, no vuelven).
    const seeded = new Set(saved.seeded || ['rutina-a', 'rutina-b']);
    const routines = (saved.routines || []).slice();
    for (const r of DEFAULT_ROUTINES) if (!seeded.has(r.id)) { routines.push(cloneRoutine(r)); seeded.add(r.id); }
    return {
      ...base, ...saved, routines, seeded: [...seeded],
      settings: { ...base.settings, ...(saved.settings || {}) },
      ui: { ...base.ui, ...(saved.ui || {}), screen: saved.active ? (saved.ui?.screen || 'tab') : 'tab' },
    };
  }
  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
    catch (e) { toast('No se pudo guardar (almacenamiento lleno)'); }
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
      else if (k === 'style' && typeof v === 'object') Object.assign(node.style, v);
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
  const fmtW = (w) => (w % 1 === 0 ? String(w) : w.toFixed(1)) + ' kg';

  function mediaNode(ex, { autoplay = true } = {}) {
    if (!ex.media) {
      return el('div', { class: 'media-box dark' }, el('span', { class: 'muted', style: { fontSize: '3rem' } }, '🏋️'));
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
  function render() {
    stopMedia();
    view.replaceChildren();
    view.scrollTop = 0;
    document.querySelectorAll('.tab').forEach((t) => t.classList.toggle('active', state.ui.screen === 'tab' && t.dataset.tab === state.ui.tab));

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
          r.items.map((it) => {
            const ex = getExercise(it.exerciseId);
            return el('div', { class: 'ex-item' },
              el('img', { class: 'thumb sm', src: thumbSrc(ex), alt: '', loading: 'lazy' }),
              el('div', { class: 'grow' }, el('div', { class: 'name' }, ex.name), el('div', { class: 'meta' }, ex.muscle)),
              el('span', { class: 'chip accent' }, `${it.sets}×${it.reps}`));
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
      entries: r.items.map((it) => {
        const last = lastEntryFor(it.exerciseId);
        const lastSets = last ? last.entry.sets.filter((s) => s.done) : [];
        return {
          exerciseId: it.exerciseId, name: getExercise(it.exerciseId).name, targetSets: it.sets, targetReps: it.reps,
          sets: Array.from({ length: it.sets }, (_, i) => ({
            reps: it.reps,
            weight: lastSets[i]?.weight ?? lastSets[lastSets.length - 1]?.weight ?? 0,
            done: false,
          })),
        };
      }),
    };
    go('workout');
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
    const routineNotes = state.routines.find((r) => r.id === a.routineId)?.notes;
    if (routineNotes) view.append(el('p', { class: 'small notes mb' }, '📝 ', routineNotes));

    view.append(el('h1', {}, ex.name));
    view.append(el('p', { class: 'muted small' }, `${ex.muscle} · Objetivo: `, el('b', {}, `${entry.targetSets} × ${entry.targetReps}`)));
    view.append(mediaNode(ex));

    const last = lastEntryFor(entry.exerciseId);
    const pb = personalBests(entry.exerciseId);
    view.append(el('p', { class: 'last-time' },
      last ? ['Última vez (', fmtDate(last.session.startedAt), '): ', el('b', {}, setsSummary(last.entry))] : 'Primera vez con este ejercicio. ¡Registra tu base!',
      pb.maxWeight ? [' · Récord: ', el('b', {}, fmtW(pb.maxWeight))] : null));

    const table = el('div', { class: 'set-table' },
      el('div', { class: 'set-head' }, el('span', {}, 'Serie'), el('span', {}, 'Reps'), el('span', {}, 'Peso (kg)'), el('span', {}, '✓')));
    entry.sets.forEach((s, i) => {
      const row = el('div', { class: 'set-row' + (s.done ? ' done' : '') });
      const reps = el('input', { class: 'input num', type: 'number', inputmode: 'numeric', min: 0, value: s.reps,
        onchange: (e) => { s.reps = Math.max(0, parseInt(e.target.value, 10) || 0); e.target.value = s.reps; save(); } });
      const weight = el('input', { class: 'input num', type: 'number', inputmode: 'decimal', min: 0, step: '0.5', value: s.weight,
        onchange: (e) => { s.weight = Math.max(0, parseFloat(String(e.target.value).replace(',', '.')) || 0); e.target.value = s.weight; save(); } });
      row.append(
        el('span', { class: 'idx' }, i + 1), reps, weight,
        el('button', { class: 'done-btn', 'aria-label': s.done ? 'Desmarcar serie' : 'Marcar serie hecha', onclick: () => toggleSet(entry, s, i) }, s.done ? '✓' : '○'));
      table.append(row);
    });
    view.append(table);
    view.append(el('div', { class: 'row mt', style: { gap: '.5rem' } },
      el('button', { class: 'btn btn-sm', onclick: () => { entry.sets.push({ reps: entry.targetReps, weight: entry.sets[entry.sets.length - 1]?.weight || 0, done: false }); save(); render(); } }, '+ Serie'),
      entry.sets.length > 1 ? el('button', { class: 'btn btn-sm btn-ghost', onclick: () => { entry.sets.pop(); save(); render(); } }, '− Serie') : null,
      el('span', { class: 'grow' }),
      el('button', { class: 'btn btn-sm btn-ghost', onclick: () => { pickExercise((x) => {
        a.entries.splice(a.current + 1, 0, { exerciseId: x.id, name: x.name, targetSets: 4, targetReps: 10, sets: Array.from({ length: 4 }, () => ({ reps: 10, weight: 0, done: false })) });
        save(); render();
      }); } }, '+ Ejercicio extra')));

    view.append(el('div', { class: 'workout-nav' },
      el('button', { class: 'btn', disabled: a.current === 0, onclick: () => { a.current--; save(); render(); } }, '‹ Anterior'),
      a.current < a.entries.length - 1
        ? el('button', { class: 'btn btn-accent', onclick: () => { a.current++; save(); render(); } }, 'Siguiente ›')
        : el('button', { class: 'btn btn-ok', onclick: finishWorkout }, '✔ Finalizar')));

    view.append(el('p', { class: 'small muted mt', style: { textAlign: 'center' } },
      `Descanso entre series: ${state.settings.rest}s · `,
      el('a', { href: '#', onclick: (e) => { e.preventDefault(); changeRest(); } }, 'cambiar')));
  }

  function toggleSet(entry, s, i) {
    s.done = !s.done;
    if (s.done) {
      // Copia peso a las series siguientes que aún no se hayan tocado (comodidad)
      entry.sets.forEach((n, j) => { if (j > i && !n.done && !n.weight) n.weight = s.weight; });
      startRest(state.settings.rest);
      const pb = personalBests(entry.exerciseId);
      if (s.weight && s.weight > pb.maxWeight && s.reps > 0) toast('🏆 ¡Nuevo récord de peso!');
    }
    save(); render();
  }
  function changeRest() {
    const input = el('input', { class: 'input num', type: 'number', min: 10, max: 600, step: 5, value: state.settings.rest });
    const close = openModal(el('div', {}, el('h2', {}, 'Descanso entre series (segundos)'), input,
      el('button', { class: 'btn btn-accent btn-block mt', onclick: () => { state.settings.rest = clamp(parseInt(input.value, 10) || DEFAULT_REST, 10, 600); save(); close(); render(); } }, 'Guardar')));
  }

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
      el('button', { class: 'btn btn-sm', onclick: () => { restEnd += 30000; tick(); } }, '+30s'),
      el('button', { class: 'btn btn-sm btn-ghost', 'aria-label': 'Saltar descanso', onclick: stopRest }, '✕'));
    document.body.append(restNode);
    document.body.classList.add('resting');
    restTimer = setInterval(tick, 250);
    tick();
  }
  function tick() {
    if (!restNode) return;
    const left = Math.max(0, Math.ceil((restEnd - Date.now()) / 1000));
    restNode.querySelector('.t').textContent = fmtSec(left);
    if (left <= 0) { stopRest(); toast('⏰ ¡A por la siguiente serie!'); navigator.vibrate?.([200, 100, 200]); beep(); }
  }
  function stopRest() { clearInterval(restTimer); restTimer = null; restNode?.remove(); restNode = null; document.body.classList.remove('resting'); }
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
  function renderHistory() {
    view.append(el('div', { class: 'section-head' }, el('h1', {}, 'Historial'),
      el('span', { class: 'chip' }, `${state.sessions.length} sesiones`)));
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

    const list = el('div', { class: 'stack' });
    const sorted = state.sessions.slice().sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt));
    for (const s of sorted) {
      const vol = s.entries.reduce((n, e) => n + (sessionExerciseStats(e)?.volume || 0), 0);
      const details = el('div', { class: 'details', hidden: true },
        s.entries.map((e) => {
          const st = sessionExerciseStats(e);
          const pb = personalBests(e.exerciseId, s.id);
          const isPr = st && st.maxWeight > 0 && st.maxWeight > pb.maxWeight;
          return el('div', { class: 'ex-line' },
            el('span', {}, e.name, isPr ? el('span', { class: 'pr-badge' }, ' 🏆') : null),
            el('span', { class: 'sets' }, setsSummary(e)));
        }),
        el('div', { class: 'row mt', style: { justifyContent: 'flex-end' } },
          el('button', { class: 'btn btn-sm btn-ghost', onclick: () => repeatSession(s) }, '🔁 Repetir'),
          el('button', { class: 'btn btn-sm btn-danger', onclick: async () => {
            if (!(await confirmDialog('Eliminar sesión', 'Esta acción no se puede deshacer.', 'Eliminar', true))) return;
            state.sessions = state.sessions.filter((x) => x.id !== s.id); save(); render();
          } }, '🗑️ Eliminar')));
      const card = el('div', { class: 'card session-card clickable', onclick: (e) => { if (e.target.closest('button')) return; details.hidden = !details.hidden; } },
        el('div', { class: 'row between' },
          el('div', {}, el('div', { class: 'date' }, fmtDate(s.startedAt)), el('div', { class: 'small muted' }, `${s.routineName} · ${fmtTime(s.startedAt)} · ${fmtDur(s.startedAt, s.finishedAt)}`)),
          el('div', { style: { textAlign: 'right' } }, el('div', { style: { fontWeight: 700 } }, `${Math.round(vol)} kg`), el('div', { class: 'small muted' }, `${s.entries.reduce((n, e) => n + e.sets.length, 0)} series`))),
        details);
      list.append(card);
    }
    view.append(list);
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
    maxWeight: { label: 'Peso máx (kg)', fmt: (v) => fmtW(v) },
    volume: { label: 'Volumen (kg)', fmt: (v) => Math.round(v) + ' kg' },
    e1rm: { label: '1RM estimado', fmt: (v) => fmtW(v) },
    reps: { label: 'Reps totales', fmt: (v) => v + ' reps' },
  };
  function renderProgress() {
    view.append(el('div', { class: 'section-head' }, el('h1', {}, 'Progreso')));
    const exercised = allExercises().filter((e) => historyFor(e.id).length);
    if (!exercised.length) {
      view.append(el('div', { class: 'empty' }, el('div', { class: 'big' }, '📈'), 'Cuando guardes entrenamientos verás aquí tu evolución por ejercicio.'));
      view.append(dataTools());
      return;
    }
    if (!exercised.some((e) => e.id === state.ui.progressEx)) state.ui.progressEx = exercised[0].id;
    const select = el('select', { class: 'input', onchange: (e) => { state.ui.progressEx = e.target.value; save(); render(); } },
      exercised.map((e) => el('option', { value: e.id, selected: e.id === state.ui.progressEx }, e.name)));
    view.append(el('label', { class: 'field' }, el('span', {}, 'Ejercicio'), select));

    const metricRow = el('div', { class: 'row wrap mb', style: { gap: '.4rem' } });
    for (const [k, m] of Object.entries(METRICS)) {
      metricRow.append(el('button', { class: 'chip' + (k === state.ui.progressMetric ? ' accent' : ''), style: { cursor: 'pointer', border: k === state.ui.progressMetric ? '1px solid var(--accent)' : undefined },
        onclick: () => { state.ui.progressMetric = k; save(); render(); } }, m.label));
    }
    view.append(metricRow);

    const ex = getExercise(state.ui.progressEx);
    const hist = historyFor(ex.id);
    const metric = state.ui.progressMetric;
    const vals = hist.map((h) => h.stats[metric]);
    const first = vals[0], lastV = vals[vals.length - 1], best = Math.max(...vals);
    const delta = lastV - first;
    view.append(el('div', { class: 'stats four' },
      el('div', { class: 'stat' }, el('div', { class: 'v' }, METRICS[metric].fmt(lastV)), el('div', { class: 'l' }, 'Último')),
      el('div', { class: 'stat' }, el('div', { class: 'v' }, METRICS[metric].fmt(best)), el('div', { class: 'l' }, 'Mejor')),
      el('div', { class: 'stat' }, el('div', { class: 'v', style: { color: delta >= 0 ? 'var(--ok)' : 'var(--danger)' } }, (delta >= 0 ? '+' : '') + METRICS[metric].fmt(delta)), el('div', { class: 'l' }, 'Desde el inicio')),
      el('div', { class: 'stat' }, el('div', { class: 'v' }, hist.length), el('div', { class: 'l' }, 'Sesiones'))));

    view.append(el('div', { class: 'card' }, chart(hist.map((h) => ({ x: h.session.startedAt, y: h.stats[metric] })), METRICS[metric].fmt)));

    const rows = el('div', { class: 'card mt' }, el('h3', {}, 'Sesiones'));
    hist.slice().reverse().forEach((h) => rows.append(el('div', { class: 'ex-line', style: { display: 'flex', justifyContent: 'space-between', gap: '.5rem', padding: '.3rem 0', borderTop: '1px solid var(--line)', fontSize: '.9rem' } },
      el('span', { class: 'muted' }, fmtDate(h.session.startedAt)),
      el('span', {}, setsSummary(h.entry)))));
    view.append(rows);
    view.append(dataTools());
  }

  function chart(points, fmt) {
    const W = 600, H = 260, P = { l: 48, r: 14, t: 14, b: 34 };
    const svg = svgEl('svg', { class: 'chart', viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': 'Gráfica de progreso' });
    if (!points.length) return svg;
    const ys = points.map((p) => p.y);
    let min = Math.min(...ys), max = Math.max(...ys);
    if (min === max) { min = min * 0.8; max = max * 1.2 || 1; }
    const padY = (max - min) * 0.1; min = Math.max(0, min - padY); max += padY;
    const xAt = (i) => P.l + (points.length === 1 ? (W - P.l - P.r) / 2 : (i / (points.length - 1)) * (W - P.l - P.r));
    const yAt = (v) => P.t + (1 - (v - min) / (max - min)) * (H - P.t - P.b);
    for (let g = 0; g <= 4; g++) {
      const v = min + ((max - min) * g) / 4, y = yAt(v);
      svg.append(svgEl('line', { class: 'grid', x1: P.l, x2: W - P.r, y1: y, y2: y }));
      svg.append(svgEl('text', { x: P.l - 6, y: y + 4, 'text-anchor': 'end' }, Math.round(v * 10) / 10));
    }
    const step = Math.max(1, Math.ceil(points.length / 6));
    points.forEach((p, i) => {
      if (i % step === 0 || i === points.length - 1) svg.append(svgEl('text', { x: xAt(i), y: H - 10, 'text-anchor': 'middle' }, fmtShort(p.x)));
    });
    svg.append(svgEl('path', { class: 'line', d: points.map((p, i) => `${i ? 'L' : 'M'}${xAt(i).toFixed(1)},${yAt(p.y).toFixed(1)}`).join(' ') }));
    points.forEach((p, i) => {
      const c = svgEl('circle', { class: 'dot', cx: xAt(i), cy: yAt(p.y), r: 4.5 });
      c.append(svgEl('title', {}, `${fmtDate(p.x)}: ${fmt(p.y)}`));
      svg.append(c);
    });
    return svg;
  }

  /* ---------- Exportar / importar ---------- */
  function dataTools() {
    return el('div', { class: 'card mt' },
      el('h3', {}, 'Tus datos'),
      el('p', { class: 'small muted' }, 'Todo se guarda en este dispositivo. Exporta una copia para no perder el progreso o para pasarlo a otro teléfono.'),
      el('div', { class: 'row wrap' },
        el('button', { class: 'btn btn-sm', onclick: exportData }, '⬇️ Exportar JSON'),
        el('button', { class: 'btn btn-sm', onclick: importData }, '⬆️ Importar JSON'),
        el('button', { class: 'btn btn-sm btn-danger', onclick: async () => {
          if (!(await confirmDialog('Borrar todo', 'Se eliminarán rutinas, historial y ejercicios personalizados. Las rutinas de ejemplo se restaurarán.', 'Borrar todo', true))) return;
          localStorage.removeItem(STORAGE_KEY); location.reload();
        } }, '🧹 Reiniciar')));
  }
  function exportData() {
    const blob = new Blob([JSON.stringify({ routines: state.routines, customExercises: state.customExercises, sessions: state.sessions, settings: state.settings, exportedAt: new Date().toISOString() }, null, 2)], { type: 'application/json' });
    const a = el('a', { href: URL.createObjectURL(blob), download: `gym-tracker-${new Date().toISOString().slice(0, 10)}.json` });
    document.body.append(a); a.click(); a.remove();
    toast('Copia exportada');
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
        if (data.settings) state.settings = { ...state.settings, ...data.settings };
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
  save();
  render();
})();
