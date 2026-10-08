(function () {
  'use strict';
  const D = window.SHEET;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const inline = (s) => esc(s).replace(/`([^`]+)`/g, '<code>$1</code>');

  /* ---------- Theme ---------- */
  const root = document.documentElement;
  root.dataset.theme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  $('#themeBtn').addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  });
  $('#printBtn').addEventListener('click', () => window.print());

  /* ---------- Copy ---------- */
  const toast = $('#toast');
  let toastT;
  function showToast(msg) {
    toast.textContent = msg; toast.classList.add('show');
    clearTimeout(toastT); toastT = setTimeout(() => toast.classList.remove('show'), 1400);
  }
  function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    let ok = false; try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    ta.remove(); return ok;
  }
  async function copyText(text, btn) {
    let ok = false;
    try { if (navigator.clipboard && window.isSecureContext) { await navigator.clipboard.writeText(text); ok = true; } } catch (e) { ok = false; }
    if (!ok) ok = fallbackCopy(text);
    showToast(ok ? 'Copied to clipboard' : 'Select the text and press Ctrl-C to copy');
    if (btn && ok) { const t = btn.textContent; btn.textContent = 'Copied'; btn.classList.add('done'); setTimeout(() => { btn.textContent = t; btn.classList.remove('done'); }, 1200); }
  }
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-copy]');
    if (b) { copyText(b.dataset.copy, b.classList.contains('copy') ? b : null); return; }
    const f = e.target.closest('[data-copy-from]');
    if (f) copyText($('#' + f.dataset.copyFrom).textContent, f);
  });

  /* ---------- Code rendering ---------- */
  function renderCode(code, out) {
    const lines = code.split('\n');
    let cont = false, heredoc = null;
    const html = lines.map((ln) => {
      let prompt = !cont && !heredoc && !/^\s*#/.test(ln);
      if (heredoc && ln.trim() === heredoc) { heredoc = null; prompt = false; }
      const hm = !heredoc && ln.match(/<<-?\s*'?"?(\w+)'?"?/);
      const wasInHeredoc = !!heredoc;
      if (hm && !/<<</.test(ln)) heredoc = hm[1];
      cont = /\\$/.test(ln);
      let body;
      if (/^\s*#/.test(ln) && !wasInHeredoc) body = '<span class="cm">' + esc(ln) + '</span>';
      else {
        const m = !wasInHeredoc && ln.match(/^(.*?\S)(\s{2,}#.*)$/);
        body = m ? esc(m[1]) + '<span class="cm">' + esc(m[2]) + '</span>' : esc(ln);
      }
      return (prompt ? '<span class="ps">$ </span>' : '') + body;
    }).join('\n');
    const o = out ? '<span class="out">' + esc(out) + '</span>' : '';
    return `<div class="code"><pre><code>${html}${o}</code></pre><button class="copy" data-copy="${esc(code)}" aria-label="Copy command">Copy</button></div>`;
  }

  /* ---------- Sections & cards ---------- */
  const secWrap = $('#sections');
  D.sections.forEach((s) => {
    const cards = D.cards.filter((c) => c.sec === s.id);
    const el = document.createElement('section');
    el.className = 'section'; el.id = s.id; el.dataset.sec = s.id;
    el.innerHTML = `<header class="sec-head"><span class="sec-num">${s.num}</span><div><h2>${esc(s.title)}</h2><p>${esc(s.lede)}</p></div></header><div class="widget-slot"></div><div class="cards">${cards.map(cardHTML).join('')}</div>`;
    secWrap.appendChild(el);
  });
  function cardHTML(c) {
    const exs = c.ex.map((x) => `<div class="ex">${renderCode(x.code, x.out)}${x.note ? `<p class="ex-note">${inline(x.note)}</p>` : ''}</div>`).join('');
    const calls = [...c.tips.map((t) => `<div class="callout tip"><b>Tip</b><span>${inline(t)}</span></div>`), ...c.warn.map((t) => `<div class="callout warn"><b>Watch out</b><span>${inline(t)}</span></div>`)].join('');
    const text = [c.cmd, c.title, c.summary, c.syntax, ...c.ex.map((x) => x.code + ' ' + x.note), ...c.tips, ...c.warn].join(' ').toLowerCase();
    return `<article class="card" id="c-${c.id}" data-text="${esc(text)}">
      <div class="card-head"><span class="cmd-tag">${esc(c.cmd)}</span><h3>${esc(c.title)}</h3><a class="anchor" href="#c-${c.id}" aria-label="Link to ${esc(c.title)}">#</a></div>
      <p class="summary">${inline(c.summary)}</p>
      <div class="syntax"><b>syntax</b>${esc(c.syntax)}</div>
      <div class="examples">${exs}</div>
      ${calls ? `<div class="callouts">${calls}</div>` : ''}
    </article>`;
  }

  /* ---------- Errors ---------- */
  $('#errList').innerHTML = D.errors.map((e, i) => {
    const text = [e.msg, e.full, e.cause, e.fix, e.tags].join(' ').toLowerCase();
    return `<details class="err" id="e-${i}" data-text="${esc(text)}">
      <summary><code>${esc(e.msg)}</code></summary>
      <div class="err-body">
        <pre class="err-full">${esc(e.full)}</pre>
        <h4>What it means</h4><p>${inline(e.cause)}</p>
        <h4>Fix</h4>${renderCode(e.fix)}
      </div></details>`;
  }).join('');

  /* ---------- Quick ref ---------- */
  $('#quickGrid').innerHTML = D.quick.map((g) => `<div class="qgroup" data-text="${esc(g.group.toLowerCase())}"><h3>${esc(g.group)}</h3>${g.rows.map((r) =>
    `<button class="qrow" data-copy="${esc(r.c)}" data-text="${esc((g.group + ' ' + r.c + ' ' + r.d).toLowerCase())}" title="Copy"><code>${esc(r.c)}</code><span>${esc(r.d)}</span></button>`).join('')}</div>`).join('');

  /* ---------- TOC ---------- */
  const tocItems = [...D.sections.map((s) => ({ id: s.id, num: s.num, title: s.title })), { id: 'errors', num: '06', title: 'Beginner errors' }, { id: 'quick', num: '07', title: 'Quick reference' }];
  $('#toc').innerHTML = tocItems.map((t) => `<li><a href="#${t.id}" data-id="${t.id}"><span>${t.num}</span>${esc(t.title)}</a></li>`).join('');
  const tocLinks = $$('#toc a');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        tocLinks.forEach((a) => a.classList.toggle('active', a.dataset.id === en.target.id));
        const act = $('#toc a.active');
        if (act && window.innerWidth <= 960) act.scrollIntoView({ block: 'nearest', inline: 'center' });
      }
    });
  }, { rootMargin: '-30% 0px -65% 0px' });
  $$('.section').forEach((s) => obs.observe(s));

  $('#heroMeta').innerHTML = `<li><strong>${D.cards.length}</strong> commands &amp; concepts</li><li><strong>${D.cards.reduce((n, c) => n + c.ex.length, 0)}</strong> copyable examples</li><li><strong>${D.errors.length}</strong> errors explained</li><li><strong>2</strong> interactive simulators</li>`;

  /* ---------- Redirection visualizer ---------- */
  const redirSlot = $('#redirect .widget-slot');
  redirSlot.appendChild($('#tpl-redir').content.cloneNode(true));
  const OUT_LINE = 'real.txt';
  const ERR_LINE = "ls: cannot access 'missing.txt': No such file or directory";
  $('#redirChips').innerHTML = D.redir.map((r, i) => `<button class="chip${r.trap ? ' trap' : ''}" role="tab" aria-selected="${i === 0}" data-i="${i}">${esc(r.label)}</button>`).join('');
  function nodeClass(dest) {
    if (/dev\/null/.test(dest)) return 'null';
    if (/next/.test(dest)) return 'pipe';
    if (/\.txt/.test(dest)) return 'file';
    return '';
  }
  function showRedir(i) {
    const r = D.redir[i];
    $$('#redirChips .chip').forEach((c) => c.setAttribute('aria-selected', String(+c.dataset.i === i)));
    $('#redirCode').textContent = r.op.replace(/^cmd/, 'ls real.txt missing.txt').replace(/\bnext\b/, 'sort');
    const stdinSrc = r.stdin;
    $('#redirFlow').innerHTML = `
      <div class="node ${nodeClass(stdinSrc)}" style="grid-row:1/3"><small>stdin source</small>${esc(stdinSrc)}</div>
      <div class="arrow r" style="grid-row:1/3">0</div>
      <div class="node proc" style="grid-row:1/3">ls</div>
      <div class="arrow r">1 stdout</div>
      <div class="node ${nodeClass(r.stdout)}">${esc(r.stdout.replace('next', 'sort'))}</div>
      <div class="arrow r" style="grid-column:4">2 stderr</div>
      <div class="node ${nodeClass(r.stderr)} ${r.trap ? 'bad' : ''}">${esc(r.stderr.replace('next', 'sort'))}</div>`;
    const note = $('#redirNote'); note.textContent = r.note; note.classList.toggle('trap', !!r.trap);
    const term = [], files = {};
    const route = (dest, line, cls) => {
      if (/terminal/.test(dest)) term.push(`<span class="${cls}">${esc(line)}</span>`);
      if (/dev\/null/.test(dest)) return;
      const fm = dest.match(/([\w.]+\.txt)/);
      if (fm) (files[fm[1]] = files[fm[1]] || []).push(`<span class="${cls}">${esc(line)}</span>`);
      if (/next/.test(dest)) (files['sort (stdin)'] = files['sort (stdin)'] || []).push(`<span class="${cls}">${esc(line)}</span>`);
    };
    // order as ls would emit: stderr first (ls reports missing files before listing)
    route(r.stderr, ERR_LINE, 'e');
    route(r.stdout, OUT_LINE, '');
    if (files['sort (stdin)']) term.push(...files['sort (stdin)'].slice().sort((a, b) => a.replace(/<[^>]+>/g, '').localeCompare(b.replace(/<[^>]+>/g, ''))));
    const keys = Object.keys(files);
    if (/append/.test(r.stdout)) files['out.txt'].unshift('<span class="empty">…previous contents…</span>');
    $('#demoTerm').innerHTML = term.length ? term.join('\n') : '<span class="empty">(nothing)</span>';
    $('#demoFileLabel').textContent = keys.length ? (keys.some((k) => k.startsWith('sort')) ? 'Piped into sort' : 'File contents') : (/dev\/null/.test(r.stderr) ? '/dev/null' : 'File contents');
    $('#demoFile').innerHTML = keys.length
      ? keys.map((k) => (keys.length > 1 || !k.startsWith('sort') ? `<span class="empty"># ${esc(k)}</span>\n` : '') + files[k].join('\n')).join('\n')
      : (/dev\/null/.test(r.stderr) ? '<span class="empty">(stderr discarded — gone for good)</span>' : '<span class="empty">(no file written)</span>');
  }
  $('#redirChips').addEventListener('click', (e) => { const c = e.target.closest('.chip'); if (c) showRedir(+c.dataset.i); });
  showRedir(0);

  /* ---------- Quoting playground ---------- */
  const quoteSlot = $('#quote .widget-slot');
  quoteSlot.appendChild($('#tpl-quote').content.cloneNode(true));
  const VARS = { HOME: '/home/ada', USER: 'ada', SAMPLE: 'S01', FILE: 'my reads.fq', DIR: '/scratch/ada/run 1', NAME: 'Ada Lovelace', EMPTY: '', PAT: '*.fq.gz', THREADS: '8' };
  const CMDSUB = { 'date +%F': '2026-10-05', 'date': 'Mon Oct  5 16:41:00 EDT 2026', 'hostname': 'login01', 'whoami': 'ada', 'pwd': '/scratch/ada/project', 'wc -l < samples.txt': '96', 'ls': 'a.txt b.txt' };
  $('#qVars').innerHTML = '<span class="var" style="border:0;background:none;padding-left:0">Pretend variables:</span>' + Object.entries(VARS).map(([k, v]) => `<span class="var"><b>${k}</b>=${esc(JSON.stringify(v))}</span>`).join('');
  const PRESETS = [
    ['wc -l $FILE', 'unquoted var with a space'],
    ['wc -l "$FILE"', 'quoted var'],
    ["echo '$HOME' \"$HOME\" $HOME", 'single vs double'],
    ['echo $SAMPLE_R1.fq "${SAMPLE}_R1.fq"', 'braces'],
    ['rm -rf $EMPTY/tmp', 'empty var danger'],
    ['ls $PAT "$PAT" \'*.fq.gz\'', 'globs'],
    ['grep -c PASS calls.vcf > $FILE', 'ambiguous redirect'],
    ['echo "Job done!nice"', 'history expansion'],
    ["echo 'It'\\''s done' \"It's done\"", 'quote inside quote'],
    ['echo "Run on $(hostname) at $(date +%F)"', 'command substitution'],
    ['THREADS = 8', 'spaces around ='],
    ["echo 'unfinished", 'unclosed quote'],
  ];
  $('#qPresets').innerHTML = PRESETS.map(([c, l]) => `<button class="chip" data-cmd="${esc(c)}" title="${esc(c)}">${esc(l)}</button>`).join('');

  function readDollar(line, j) {
    const c = line[j + 1];
    if (c === '{') {
      const k = line.indexOf('}', j + 2);
      if (k < 0) return { error: 'bad substitution: missing closing }' };
      const inner = line.slice(j + 2, k);
      const m = inner.match(/^([A-Za-z_][A-Za-z0-9_]*)(?:(:-|-)(.*))?$/);
      if (!m) return { val: '', end: k + 1, label: '${' + inner + '}', unsupported: true };
      let v = VARS[m[1]];
      if (m[2] && (v === undefined || (m[2] === ':-' && v === ''))) v = m[3];
      return { val: v === undefined ? '' : v, end: k + 1, label: '${' + inner + '}', name: m[1], unset: VARS[m[1]] === undefined && !m[2] };
    }
    if (c === '(') {
      let depth = 1, k = j + 2;
      while (k < line.length && depth) { if (line[k] === '(') depth++; else if (line[k] === ')') depth--; k++; }
      if (depth) return { error: "unexpected EOF while looking for matching `)'" };
      const inner = line.slice(j + 2, k - 1).trim();
      const v = Object.prototype.hasOwnProperty.call(CMDSUB, inner) ? CMDSUB[inner] : 'OUTPUT_OF_' + inner.split(/\s+/)[0].toUpperCase();
      return { val: v, end: k, label: '$(' + inner + ')', sub: true };
    }
    const m = line.slice(j + 1).match(/^([A-Za-z_][A-Za-z0-9_]*|[?$#0-9])/);
    if (!m) return null;
    const name = m[1];
    const special = { '?': '0', '$': '48213', '#': '0', '0': '-bash' };
    let v = VARS[name]; if (v === undefined) v = special[name];
    return { val: v === undefined ? '' : v, end: j + 1 + name.length, label: '$' + name, name, unset: v === undefined };
  }

  function simulate(line) {
    const tokens = []; let segs = []; let inWord = false; const notes = [];
    const note = (s) => { if (!notes.includes(s)) notes.push(s); };
    const push = (t, o = {}) => { segs.push(Object.assign({ t }, o)); inWord = true; };
    const endWord = () => { if (inWord) tokens.push({ type: 'word', segs }); segs = []; inWord = false; };
    const bang = (j) => {
      const m = line.slice(j + 1).match(/^[A-Za-z0-9_-]+/);
      return m ? { error: `-bash: !${m[0]}: event not found`, hint: 'In interactive bash, ! inside double quotes (or unquoted) triggers history expansion. Use single quotes, or run `set +H`.' } : null;
    };
    let i = 0; const n = line.length;
    while (i < n) {
      const c = line[i];
      if (c === ' ' || c === '\t') { endWord(); i++; continue; }
      if (c === '#' && !inWord) break;
      if (c === '\\') { if (i + 1 < n) { push(line[i + 1], { q: true }); i += 2; } else { note('A trailing backslash continues the command on the next line.'); i++; } continue; }
      if (c === "'") {
        const k = line.indexOf("'", i + 1);
        if (k < 0) return { error: "unexpected EOF while looking for matching `''", hint: 'The single quote is never closed. Interactively you would see a > prompt waiting for more input. Press Ctrl-C and fix the line.' };
        const lit = line.slice(i + 1, k);
        if (/\$|\*/.test(lit)) note(`Inside single quotes, '${lit}' is kept exactly as typed: no variable or glob expansion.`);
        push(lit, { q: true }); i = k + 1; continue;
      }
      if (c === '"') {
        let j = i + 1, buf = '', closed = false;
        push('', { q: true });
        const flush = () => { if (buf) { push(buf, { q: true }); buf = ''; } };
        while (j < n) {
          const d = line[j];
          if (d === '"') { closed = true; j++; break; }
          if (d === '\\' && j + 1 < n && '$`"\\'.includes(line[j + 1])) { buf += line[j + 1]; j += 2; continue; }
          if (d === '!') { const b = bang(j); if (b) return b; }
          if (d === '$') {
            const r = readDollar(line, j);
            if (r && r.error) return { error: r.error };
            if (r) {
              flush(); push(r.val, { q: true, exp: r.label });
              if (r.unset) note(`${r.label} is not set, so it expands to an empty string.`);
              if (r.sub) note(`${r.label} is replaced by the command's output${CMDSUB[r.label.slice(2, -1).trim()] ? '' : ' (shown as a placeholder here)'}. Inside double quotes it stays one argument.`);
              if (/\s/.test(r.val)) note(`"${r.label}" is double-quoted, so its space is preserved and it stays a single argument.`);
              j = r.end; continue;
            }
          }
          buf += d; j++;
        }
        if (!closed) return { error: "unexpected EOF while looking for matching `\"'", hint: 'The double quote is never closed. Interactively you would see a > prompt. Press Ctrl-C and fix the line.' };
        flush(); i = j; continue;
      }
      if (c === '!') { const b = bang(i); if (b) return b; }
      if (c === '$') {
        const r = readDollar(line, i);
        if (r && r.error) return { error: r.error };
        if (r) {
          push(r.val, { split: true, exp: r.label });
          if (r.unset) note(`${r.label} is not set${r.name && /_/.test(r.name) && VARS[r.name.split('_')[0]] !== undefined ? ` (bash read the whole name ${r.name}; use \${${r.name.split('_')[0]}}_… to stop the name early)` : ''}, so it expands to an empty string.`);
          if (r.val === '' && !r.unset) note(`${r.label} is empty and unquoted, so it simply vanishes from the command.`);
          if (/\s/.test(r.val.trim())) note(`Unquoted ${r.label} contains whitespace, so bash split it into ${r.val.trim().split(/\s+/).length} separate arguments. Write "${r.label}" to keep it whole.`);
          if (/[*?[]/.test(r.val)) note(`Unquoted ${r.label} contains a wildcard, so bash also tries to glob it against filenames.`);
          i = r.end; continue;
        }
      }
      if (c === '~' && !inWord && (i + 1 === n || /[\/\s]/.test(line[i + 1]))) { push(VARS.HOME, { q: true, exp: '~' }); note('Unquoted ~ at the start of a word expands to your home directory. Inside quotes it would stay a literal ~.'); i++; continue; }
      if ('|<>;&'.includes(c)) {
        let fd = '';
        if (inWord && segs.length === 1 && !segs[0].q && !segs[0].split && /^\d$/.test(segs[0].t) && (c === '>' || c === '<')) { fd = segs[0].t; segs = []; inWord = false; } else endWord();
        let j = i, op = '';
        while (j < n && '|<>;&'.includes(line[j])) { op += line[j]; j++; }
        if (/>&$/.test(op)) while (j < n && /\d/.test(line[j])) { op += line[j]; j++; }
        tokens.push({ type: 'op', v: fd + op }); i = j; continue;
      }
      push(c, { g: /[*?[]/.test(c) });
      i++;
    }
    endWord();

    // expand words into fields
    const out = [];
    tokens.forEach((tk) => {
      if (tk.type === 'op') { out.push({ op: tk.v }); return; }
      const fields = []; let cur = '', has = false, glob = false;
      tk.segs.forEach((s) => {
        if (s.split) {
          if (s.t === '') return;
          const pieces = s.t.split(/[ \t\n]+/);
          pieces.forEach((p, k) => {
            if (k > 0) { if (has) fields.push({ v: cur, glob }); cur = ''; has = false; glob = false; }
            if (p !== '') { cur += p; has = true; if (/[*?[]/.test(p)) glob = true; }
          });
        } else { cur += s.t; has = true; if (s.g) glob = true; }
      });
      if (has) fields.push({ v: cur, glob });
      out.push({ word: true, fields, raw: tk });
    });
    return { items: out, notes };
  }

  function renderArgv() {
    const line = $('#qInput').value;
    const res = simulate(line);
    const argv = $('#qArgv'), notesEl = $('#qNotes');
    if (res.error) {
      argv.innerHTML = `<li style="border-color:var(--rust)"><small style="background:var(--rust-soft);color:var(--rust)">bash error</small><code class="errline">${esc(res.error)}</code></li>`;
      notesEl.innerHTML = res.hint ? `<li>${inline(res.hint)}</li>` : '';
      return;
    }
    const html = []; const notes = res.notes.slice();
    let idx = 0, expectTarget = false, cmdStart = true, firstFields = [];
    res.items.forEach((it) => {
      if (it.op) {
        const isRedir = /[<>]/.test(it.op) && !/&\d$/.test(it.op);
        html.push(`<li class="op"><small>${/[<>]/.test(it.op) ? 'redirect' : 'operator'}</small><code>${esc(it.op)}</code></li>`);
        if (isRedir) expectTarget = true;
        if (/^(\||\|\||&&|;|&)$/.test(it.op)) { idx = 0; cmdStart = true; }
        return;
      }
      if (expectTarget) {
        expectTarget = false;
        if (it.fields.length !== 1) {
          html.push(`<li style="border-color:var(--rust)"><small style="background:var(--rust-soft);color:var(--rust)">target</small><code class="errline">ambiguous redirect</code></li>`);
          notes.push('A redirection target must expand to exactly one word. The unquoted variable here produced ' + it.fields.length + '. Quote it.');
        } else html.push(`<li class="glob"><small>target file</small><code>${fmt(it.fields[0].v)}</code></li>`);
        return;
      }
      if (!it.fields.length) return;
      it.fields.forEach((f) => {
        if (cmdStart) { firstFields = []; }
        firstFields.push(f.v);
        html.push(`<li class="${f.glob ? 'glob' : ''}"><small>${idx === 0 ? 'argv[0] · command' : 'argv[' + idx + ']'}${f.glob ? ' · glob' : ''}</small><code>${fmt(f.v)}</code></li>`);
        idx++; cmdStart = false;
      });
    });
    if (res.items.some((it) => it.fields && it.fields.some((f) => f.glob))) notes.push('Arguments marked glob are unquoted wildcards. Bash replaces them with matching filenames, or passes them through literally if nothing matches.');
    if (firstFields.length >= 2 && /^[A-Za-z_]\w*$/.test(firstFields[0]) && firstFields[1] === '=') notes.push('Spaces around = turn the assignment into a command named ' + firstFields[0] + '. Bash would reply "' + firstFields[0] + ': command not found". Write ' + firstFields[0] + '=' + (firstFields[2] || 'value') + '.');
    if (!html.length) html.push('<li><small>empty</small><code> </code></li>');
    argv.innerHTML = html.join('');
    notesEl.innerHTML = notes.length ? notes.map((n2) => `<li>${inline(n2)}</li>`).join('') : '<li>No surprises: every argument is exactly what you typed.</li>';
  }
  function fmt(v) { return v === '' ? '<span class="sp">(empty string)</span>' : esc(v).replace(/ /g, '<span class="sp"> </span>'); }
  $('#qInput').addEventListener('input', renderArgv);
  $('#qPresets').addEventListener('click', (e) => { const c = e.target.closest('.chip'); if (!c) return; $('#qInput').value = c.dataset.cmd; renderArgv(); });
  renderArgv();

  /* ---------- Search ---------- */
  const q = $('#q');
  function applySearch() {
    const term = q.value.trim().toLowerCase();
    let total = 0;
    $$('.card').forEach((c) => { const hit = !term || c.dataset.text.includes(term); c.classList.toggle('hidden', !hit); if (hit) total++; });
    $$('.err').forEach((c) => { const hit = !term || c.dataset.text.includes(term); c.classList.toggle('hidden', !hit); if (term && hit) c.open = true; if (!term) c.open = false; if (hit) total++; });
    $$('.qgroup').forEach((g) => {
      let any = false;
      $$('.qrow', g).forEach((r) => { const hit = !term || r.dataset.text.includes(term); r.classList.toggle('hidden', !hit); if (hit) any = true; });
      g.classList.toggle('hidden', !any);
      if (any && term) total++;
    });
    $$('.widget-slot').forEach((w) => w.classList.toggle('hidden', !!term));
    $('.hero').classList.toggle('hidden', !!term);
    $$('.section').forEach((s) => {
      const vis = $$('.card:not(.hidden), .err:not(.hidden), .qgroup:not(.hidden)', s).length > 0;
      s.classList.toggle('hidden', !!term && !vis);
      const a = $(`#toc a[data-id="${s.id}"]`); if (a) a.classList.toggle('dim', !!term && !vis);
    });
    const none = !!term && total === 0;
    $('#noResults').hidden = !none; $('#noResultsQ').textContent = q.value;
  }
  let st; q.addEventListener('input', () => { clearTimeout(st); st = setTimeout(applySearch, 80); });
  q.addEventListener('keydown', (e) => { if (e.key === 'Escape') { q.value = ''; applySearch(); q.blur(); } });
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) { e.preventDefault(); q.focus(); q.select(); }
  });
})();
