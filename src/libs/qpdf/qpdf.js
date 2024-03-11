const Module = (() => {
  let _scriptDir = typeof document !== 'undefined' && document.currentScript ? document.currentScript.src : undefined;
  if (typeof __filename !== 'undefined') { _scriptDir = _scriptDir || __filename; }
  return (
    function (Module) {
      Module = Module || {};

      let d; d || (d = typeof Module !== 'undefined' ? Module : {}); let aa, ba; d.ready = new Promise((a, b) => { aa = a; ba = b; }); d.noInitialRun = !0; let ca = Object.assign({}, d); let da = []; let ea = './this.program'; let fa = (a, b) => { throw b; }; const ha = typeof window == 'object'; const m = typeof importScripts == 'function'; const ia = typeof process == 'object' && typeof process.versions == 'object' && typeof process.versions.node == 'string'; let q = ''; let ja; let ka; let la; let fs; let t; let ma;
      if (ia) {
        q = m ? `${require('node:path').dirname(q)}/` : `${__dirname}/`, ma = () => { t || (fs = require('node:fs'), t = require('node:path')); }, ja = function (a, b) { ma(); a = t.normalize(a); return fs.readFileSync(a, b ? void 0 : 'utf8'); }, la = (a) => { a = ja(a, !0); a.buffer || (a = new Uint8Array(a)); return a; }, ka = (a, b, c) => { ma(); a = t.normalize(a); fs.readFile(a, (e, f) => { e ? c(e) : b(f.buffer); }); }, process.argv.length > 1 && (ea = process.argv[1].replace(/\\/g, '/')), da = process.argv.slice(2), process.on('uncaughtException', (a) => {
          if (!(a instanceof na)) { throw a; }
        }), process.on('unhandledRejection',
          (a) => { throw a; }), fa = (a, b) => {
          if (noExitRuntime) { throw process.exitCode = a, b; } b instanceof na || v(`exiting due to exception: ${b}`); process.exit(a);
        }, d.inspect = function () { return '[Emscripten Module object]'; };
      }
      else if (ha || m) {
        m ? q = self.location.href : typeof document != 'undefined' && document.currentScript && (q = document.currentScript.src), _scriptDir && (q = _scriptDir), q.indexOf('blob:') !== 0 ? q = q.substr(0, q.replace(/[?#].*/, '').lastIndexOf('/') + 1) : q = '', ja = (a) => { const b = new XMLHttpRequest(); b.open('GET', a, !1); b.send(null); return b.responseText; },
        m && (la = (a) => { const b = new XMLHttpRequest(); b.open('GET', a, !1); b.responseType = 'arraybuffer'; b.send(null); return new Uint8Array(b.response); }), ka = (a, b, c) => { const e = new XMLHttpRequest(); e.open('GET', a, !0); e.responseType = 'arraybuffer'; e.onload = () => { e.status == 200 || e.status == 0 && e.response ? b(e.response) : c(); }; e.onerror = c; e.send(null); };
      } const oa = console.log.bind(console); var v = console.warn.bind(console); Object.assign(d, ca); ca = null; let z = 0; var noExitRuntime = !0; typeof WebAssembly != 'object' && A('no native wasm support detected');
      let pa; let qa = !1; let ra; const sa = typeof TextDecoder != 'undefined' ? new TextDecoder('utf8') : void 0;
      function B(a, b) {
        for (var c = b + Number.NaN, e = b; a[e] && !(e >= c);) { ++e; } if (e - b > 16 && a.buffer && sa) { return sa.decode(a.subarray(b, e)); } for (c = ''; b < e;) {
          let f = a[b++]; if (f & 128) {
            const g = a[b++] & 63; if ((f & 224) == 192) { c += String.fromCharCode((f & 31) << 6 | g); }
            else { const k = a[b++] & 63; f = (f & 240) == 224 ? (f & 15) << 12 | g << 6 | k : (f & 7) << 18 | g << 12 | k << 6 | a[b++] & 63; f < 65536 ? c += String.fromCharCode(f) : (f -= 65536, c += String.fromCharCode(55296 | f >> 10, 56320 | f & 1023)); }
          }
          else { c += String.fromCharCode(f); }
        } return c;
      } function C(a) { return a ? B(ta, a) : ''; }
      function ua(a, b, c, e) {
        if (!(e > 0)) { return 0; } const f = c; e = c + e - 1; for (let g = 0; g < a.length; ++g) {
          let k = a.charCodeAt(g); if (k >= 55296 && k <= 57343) { const l = a.charCodeAt(++g); k = 65536 + ((k & 1023) << 10) | l & 1023; } if (k <= 127) {
            if (c >= e) { break; } b[c++] = k;
          }
          else {
            if (k <= 2047) {
              if (c + 1 >= e) { break; } b[c++] = 192 | k >> 6;
            }
            else {
              if (k <= 65535) {
                if (c + 2 >= e) { break; } b[c++] = 224 | k >> 12;
              }
              else {
                if (c + 3 >= e) { break; } b[c++] = 240 | k >> 18; b[c++] = 128 | k >> 12 & 63;
              }b[c++] = 128 | k >> 6 & 63;
            }b[c++] = 128 | k & 63;
          }
        }b[c] = 0; return c - f;
      }
      function va(a) { for (var b = 0, c = 0; c < a.length; ++c) { let e = a.charCodeAt(c); e >= 55296 && e <= 57343 && (e = 65536 + ((e & 1023) << 10) | a.charCodeAt(++c) & 1023); e <= 127 ? ++b : b = e <= 2047 ? b + 2 : e <= 65535 ? b + 3 : b + 4; } return b; } function wa(a) { const b = va(a) + 1; const c = xa(b); c && ua(a, D, c, b); return c; } function ya(a) { const b = va(a) + 1; const c = za(b); ua(a, D, c, b); return c; } let Aa, D, ta, Ba, E, G, Ca;
      function Da() { const a = pa.buffer; Aa = a; d.HEAP8 = D = new Int8Array(a); d.HEAP16 = Ba = new Int16Array(a); d.HEAP32 = E = new Int32Array(a); d.HEAPU8 = ta = new Uint8Array(a); d.HEAPU16 = new Uint16Array(a); d.HEAPU32 = G = new Uint32Array(a); d.HEAPF32 = new Float32Array(a); d.HEAPF64 = new Float64Array(a); d.HEAP64 = Ca = new BigInt64Array(a); d.HEAPU64 = new BigUint64Array(a); } let Ea; const Fa = []; const Ga = []; const Ha = []; const Ia = []; let H = 0; let Ja = null; let Ka = null; function La() { H--; if (H == 0 && (Ja !== null && (clearInterval(Ja), Ja = null), Ka)) { const a = Ka; Ka = null; a(); } }
      function A(a) { a = `Aborted(${a})`; v(a); qa = !0; ra = 1; a = new WebAssembly.RuntimeError(`${a}. Build with -sASSERTIONS for more info.`); ba(a); throw a; } function Ma() { return K.startsWith('data:application/octet-stream;base64,'); } let K; K = 'qpdf.wasm'; if (!Ma()) { const Na = K; K = d.locateFile ? d.locateFile(Na, q) : q + Na; } function Oa() {
        const a = K; try {
          if (la) { return la(a); } throw 'both async and sync fetching of the wasm failed';
        }
        catch (b) { A(b); }
      }
      function Pa() {
        if (ha || m) {
          if (typeof fetch == 'function' && !K.startsWith('file://')) {
            return fetch(K, { credentials: 'same-origin' }).then((a) => {
              if (!a.ok) { throw `failed to load wasm binary file at '${K}'`; } return a.arrayBuffer();
            }).catch(() => { return Oa(); });
          } if (ka) { return new Promise((a, b) => { ka(K, (c) => { a(new Uint8Array(c)); }, b); }); }
        } return Promise.resolve().then(() => { return Oa(); });
      }
      function Qa(a) {
        for (;a.length > 0;) {
          const b = a.shift(); if (typeof b == 'function') { b(d); }
          else { const c = b.ld; typeof c == 'number' ? void 0 === b.vb ? L(c)() : L(c)(b.vb) : c(void 0 === b.vb ? null : b.vb); }
        }
      } function L(a) { return Ea.get(a); } const Ra = []; let Sa = 0; let M = 0;
      function N(a) {
        this.eb = a; this.ta = a - 24; this.ed = function (b) { G[this.ta + 4 >> 2] = b; }; this.Ia = function () { return G[this.ta + 4 >> 2]; }; this.Yc = function (b) { G[this.ta + 8 >> 2] = b; }; this.Gc = function () { return G[this.ta + 8 >> 2]; }; this.cd = function () { E[this.ta >> 2] = 0; }; this.Nb = function (b) { D[this.ta + 12 >> 0] = b ? 1 : 0; }; this.Tc = function () { return D[this.ta + 12 >> 0] != 0; }; this.Ob = function (b) { D[this.ta + 13 >> 0] = b ? 1 : 0; }; this.fc = function () { return D[this.ta + 13 >> 0] != 0; }; this.Ma = function (b, c) { this.Ya(0); this.ed(b); this.Yc(c); this.cd(); this.Nb(!1); this.Ob(!1); };
        this.Oc = function () { E[this.ta >> 2] += 1; }; this.Uc = function () { const b = E[this.ta >> 2]; E[this.ta >> 2] = b - 1; return b === 1; }; this.Ya = function (b) { G[this.ta + 16 >> 2] = b; }; this.Sc = function () { return G[this.ta + 16 >> 2]; }; this.Wc = function () {
          if (Ta(this.Ia())) { return G[this.eb >> 2]; } const b = this.Sc(); return b !== 0 ? b : this.eb;
        };
      } function Ua(a) { return Va((new N(a)).ta); }
      const Wa = (a, b) => {
        for (var c = 0, e = a.length - 1; e >= 0; e--) { const f = a[e]; f === '.' ? a.splice(e, 1) : f === '..' ? (a.splice(e, 1), c++) : c && (a.splice(e, 1), c--); } if (b) { for (;c; c--) { a.unshift('..'); } } return a;
      }; const O = (a) => { const b = a.charAt(0) === '/'; const c = a.substr(-1) === '/'; (a = Wa(a.split('/').filter(e => !!e), !b).join('/')) || b || (a = '.'); a && c && (a += '/'); return (b ? '/' : '') + a; }; const Xa = (a) => {
        let b = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/.exec(a).slice(1); a = b[0]; b = b[1]; if (!a && !b) { return '.'; } b && (b = b.substr(0, b.length - 1)); return a + b;
      }; const P = (a) => {
        if (a
=== '/') { return '/'; } a = O(a); a = a.replace(/\/$/, ''); const b = a.lastIndexOf('/'); return b === -1 ? a : a.substr(b + 1);
      }; function Ya() { const a = Array.prototype.slice.call(arguments, 0); return O(a.join('/')); } const Q = (a, b) => O(`${a}/${b}`); function Za() {
        if (typeof crypto == 'object' && typeof crypto.getRandomValues == 'function') { const a = new Uint8Array(1); return function () { crypto.getRandomValues(a); return a[0]; }; } if (ia) {
          try { const b = require('node:crypto'); return function () { return b.randomBytes(1)[0]; }; }
          catch (c) {}
        } return function () { A('randomDevice'); };
      }
      function R() {
        for (var a = '', b = !1, c = arguments.length - 1; c >= -1 && !b; c--) {
          b = c >= 0 ? arguments[c] : S.cwd(); if (typeof b != 'string') { throw new TypeError('Arguments to path.resolve must be strings'); } if (!b) { return ''; } a = `${b}/${a}`; b = b.charAt(0) === '/';
        }a = Wa(a.split('/').filter(e => !!e), !b).join('/'); return (b ? '/' : '') + a || '.';
      }
      const $a = (a, b) => { function c(k) { for (var l = 0; l < k.length && k[l] === ''; l++) { ; } for (var p = k.length - 1; p >= 0 && k[p] === ''; p--) { ; } return l > p ? [] : k.slice(l, p - l + 1); }a = R(a).substr(1); b = R(b).substr(1); a = c(a.split('/')); b = c(b.split('/')); for (var e = Math.min(a.length, b.length), f = e, g = 0; g < e; g++) { if (a[g] !== b[g]) { f = g; break; } }e = []; for (g = f; g < a.length; g++) { e.push('..'); }e = e.concat(b.slice(f)); return e.join('/'); }; const ab = []; function bb(a, b) { ab[a] = { input: [], output: [], Za: b }; S.Mb(a, cb); }
      var cb = {
        open(a) {
          const b = ab[a.node.rdev]; if (!b) { throw new S.na(43); } a.tty = b; a.seekable = !1;
        },
        close(a) { a.tty.Za.flush(a.tty); },
        flush(a) { a.tty.Za.flush(a.tty); },
        read(a, b, c, e) {
          if (!a.tty || !a.tty.Za.ec) { throw new S.na(60); } for (var f = 0, g = 0; g < e; g++) {
            try { var k = a.tty.Za.ec(a.tty); }
            catch (l) { throw new S.na(29); } if (void 0 === k && f === 0) { throw new S.na(6); } if (k === null || void 0 === k) { break; } f++; b[c + g] = k;
          }f && (a.node.timestamp = Date.now()); return f;
        },
        write(a, b, c, e) {
          if (!a.tty || !a.tty.Za.Ib) { throw new S.na(60); }
          try { for (var f = 0; f < e; f++) { a.tty.Za.Ib(a.tty, b[c + f]); } }
          catch (g) { throw new S.na(29); }e && (a.node.timestamp = Date.now()); return f;
        },
      }; const eb = {
        ec(a) {
          if (!a.input.length) {
            let b = null; if (ia) {
              const c = Buffer.alloc(256); let e = 0; try { e = fs.readSync(process.stdin.fd, c, 0, 256, -1); }
              catch (f) {
                if (f.toString().includes('EOF')) { e = 0; }
                else { throw f; }
              }e > 0 ? b = c.slice(0, e).toString('utf-8') : b = null;
            }
            else {
              typeof window != 'undefined' && typeof window.prompt == 'function'
                ? (b = window.prompt('Input: '), b !== null && (b += '\n'))
                : typeof readline == 'function'
&& (b = readline(), b !== null && (b += '\n'));
            } if (!b) { return null; } a.input = db(b, !0);
          } return a.input.shift();
        },
        Ib(a, b) { b === null || b === 10 ? (oa(B(a.output, 0)), a.output = []) : b != 0 && a.output.push(b); },
        flush(a) { a.output && a.output.length > 0 && (oa(B(a.output, 0)), a.output = []); },
      }; const fb = { Ib(a, b) { b === null || b === 10 ? (v(B(a.output, 0)), a.output = []) : b != 0 && a.output.push(b); }, flush(a) { a.output && a.output.length > 0 && (v(B(a.output, 0)), a.output = []); } }; var T = {
        Fa: null,
        ra() { return T.createNode(null, '/', 16895, 0); },
        createNode(a, b, c, e) {
          if (S.Hc(c) || S.isFIFO(c)) { throw new S.na(63); } T.Fa || (T.Fa = { dir: { node: { za: T.oa.za, wa: T.oa.wa, lookup: T.oa.lookup, Ca: T.oa.Ca, rename: T.oa.rename, unlink: T.oa.unlink, rmdir: T.oa.rmdir, readdir: T.oa.readdir, symlink: T.oa.symlink }, stream: { Aa: T.qa.Aa } }, file: { node: { za: T.oa.za, wa: T.oa.wa }, stream: { Aa: T.qa.Aa, read: T.qa.read, write: T.qa.write, cb: T.qa.cb, Wa: T.qa.Wa, Xa: T.qa.Xa } }, link: { node: { za: T.oa.za, wa: T.oa.wa, readlink: T.oa.readlink }, stream: {} }, Ub: { node: { za: T.oa.za, wa: T.oa.wa }, stream: S.tc } });
          c = S.createNode(a, b, c, e); S.va(c.mode) ? (c.oa = T.Fa.dir.node, c.qa = T.Fa.dir.stream, c.pa = {}) : S.isFile(c.mode) ? (c.oa = T.Fa.file.node, c.qa = T.Fa.file.stream, c.ua = 0, c.pa = null) : S.Va(c.mode) ? (c.oa = T.Fa.link.node, c.qa = T.Fa.link.stream) : S.jb(c.mode) && (c.oa = T.Fa.Ub.node, c.qa = T.Fa.Ub.stream); c.timestamp = Date.now(); a && (a.pa[b] = c, a.timestamp = c.timestamp); return c;
        },
        nd(a) { return a.pa ? a.pa.subarray ? a.pa.subarray(0, a.ua) : new Uint8Array(a.pa) : new Uint8Array(0); },
        $b(a, b) {
          let c = a.pa ? a.pa.length : 0; c >= b || (b
= Math.max(b, c * (c < 1048576 ? 2 : 1.125) >>> 0), c != 0 && (b = Math.max(b, 256)), c = a.pa, a.pa = new Uint8Array(b), a.ua > 0 && a.pa.set(c.subarray(0, a.ua), 0));
        },
        Vc(a, b) {
          if (a.ua != b) {
            if (b == 0) { a.pa = null, a.ua = 0; }
 else { const c = a.pa; a.pa = new Uint8Array(b); c && a.pa.set(c.subarray(0, Math.min(b, a.ua))); a.ua = b; }
          }
        },
        oa: {
          za(a) {
            const b = {}; b.dev = S.jb(a.mode) ? a.id : 1; b.ino = a.id; b.mode = a.mode; b.nlink = 1; b.uid = 0; b.gid = 0; b.rdev = a.rdev; S.va(a.mode) ? b.size = 4096 : S.isFile(a.mode) ? b.size = a.ua : S.Va(a.mode) ? b.size = a.link.length : b.size = 0; b.atime
= new Date(a.timestamp); b.mtime = new Date(a.timestamp); b.ctime = new Date(a.timestamp); b.Ja = 4096; b.blocks = Math.ceil(b.size / b.Ja); return b;
          },
          wa(a, b) { void 0 !== b.mode && (a.mode = b.mode); void 0 !== b.timestamp && (a.timestamp = b.timestamp); void 0 !== b.size && T.Vc(a, b.size); },
          lookup() { throw S.yb[44]; },
          Ca(a, b, c, e) { return T.createNode(a, b, c, e); },
          rename(a, b, c) {
            if (S.va(a.mode)) {
              try { var e = S.Ha(b, c); }
              catch (g) {} if (e) { for (const f in e.pa) { throw new S.na(55); } }
            } delete a.parent.pa[a.name]; a.parent.timestamp
= Date.now(); a.name = c; b.pa[c] = a; b.timestamp = a.parent.timestamp; a.parent = b;
          },
          unlink(a, b) { delete a.pa[b]; a.timestamp = Date.now(); },
          rmdir(a, b) { const c = S.Ha(a, b); let e; for (e in c.pa) { throw new S.na(55); } delete a.pa[b]; a.timestamp = Date.now(); },
          readdir(a) { const b = ['.', '..']; let c; for (c in a.pa) { a.pa.hasOwnProperty(c) && b.push(c); } return b; },
          symlink(a, b, c) { a = T.createNode(a, b, 41471, 0); a.link = c; return a; },
          readlink(a) {
            if (!S.Va(a.mode)) { throw new S.na(28); } return a.link;
          },
        },
        qa: {
          read(a,
            b, c, e, f) {
            const g = a.node.pa; if (f >= a.node.ua) { return 0; } a = Math.min(a.node.ua - f, e); if (a > 8 && g.subarray) { b.set(g.subarray(f, f + a), c); }
            else { for (e = 0; e < a; e++) { b[c + e] = g[f + e]; } } return a;
          },
          write(a, b, c, e, f, g) {
            b.buffer === D.buffer && (g = !1); if (!e) { return 0; } a = a.node; a.timestamp = Date.now(); if (b.subarray && (!a.pa || a.pa.subarray)) {
              if (g) { return a.pa = b.subarray(c, c + e), a.ua = e; } if (a.ua === 0 && f === 0) { return a.pa = b.slice(c, c + e), a.ua = e; } if (f + e <= a.ua) { return a.pa.set(b.subarray(c, c + e), f), e; }
            }T.$b(a, f + e); if (a.pa.subarray && b.subarray) {
              a.pa.set(b.subarray(c,
                c + e), f);
            }
            else { for (g = 0; g < e; g++) { a.pa[f + g] = b[c + g]; } }a.ua = Math.max(a.ua, f + e); return e;
          },
          Aa(a, b, c) {
            c === 1 ? b += a.position : c === 2 && S.isFile(a.node.mode) && (b += a.node.ua); if (b < 0) { throw new S.na(28); } return b;
          },
          cb(a, b, c) { T.$b(a.node, b + c); a.node.ua = Math.max(a.node.ua, b + c); },
          Wa(a, b, c, e, f, g) {
            if (b !== 0) { throw new S.na(28); } if (!S.isFile(a.node.mode)) { throw new S.na(43); } a = a.node.pa; if (g & 2 || a.buffer !== Aa) {
              if (e > 0 || e + c < a.length) { a.subarray ? a = a.subarray(e, e + c) : a = Array.prototype.slice.call(a, e, e + c); } e = !0; A();
              c = void 0; if (!c) { throw new S.na(48); } D.set(a, c);
            }
            else { e = !1, c = a.byteOffset; } return { ta: c, qc: e };
          },
          Xa(a, b, c, e, f) {
            if (!S.isFile(a.node.mode)) { throw new S.na(43); } if (f & 2) { return 0; } T.qa.write(a, b, 0, e, c, !1); return 0;
          },
        },
      }; function gb(a, b, c) {
        const e = `al ${a}`; ka(a, (f) => { f || A(`Loading data file "${a}" failed (no arrayBuffer).`); b(new Uint8Array(f)); e && La(); }, () => {
          if (c) { c(); }
          else { throw `Loading data file "${a}" failed.`; }
        }); e && H++;
      }
      let hb = {}; var U = {
        lb: !1,
        Pb: () => { U.lb = !!process.platform.match(/^win/); let a = process.binding('constants'); a.fs && (a = a.fs); U.ac = { 1024: a.O_APPEND, 64: a.O_CREAT, 128: a.O_EXCL, 256: a.O_NOCTTY, 0: a.O_RDONLY, 2: a.O_RDWR, 4096: a.O_SYNC, 512: a.O_TRUNC, 1: a.O_WRONLY, 131072: a.O_NOFOLLOW }; },
        xa: a => hb[a.code],
        ra: a => U.createNode(null, '/', U.Ta(a.$a.root), 0),
        createNode: (a, b, c) => {
          if (!S.va(c) && !S.isFile(c) && !S.Va(c)) { throw new S.na(28); } a = S.createNode(a, b, c); a.oa = U.oa; a.qa = U.qa; return a;
        },
        Ta: (a) => {
          try {
            var b = fs.lstatSync(a); U.lb && (b.mode
= b.mode | (b.mode & 292) >> 2);
          }
          catch (c) {
            if (!c.code) { throw c; } throw new S.na(U.xa(c));
          } return b.mode;
        },
        Ba: (a) => { for (var b = []; a.parent !== a;) { b.push(a.name), a = a.parent; }b.push(a.ra.$a.root); b.reverse(); return Ya.apply(null, b); },
        Ec: (a) => {
          a &= -2721793; let b = 0; let c; for (c in U.ac) { a & c && (b |= U.ac[c], a ^= c); } if (a) { throw new S.na(28); } return b;
        },
        oa: {
          za: (a) => {
            a = U.Ba(a); try { var b = fs.lstatSync(a); }
            catch (c) {
              if (!c.code) { throw c; } throw new S.na(U.xa(c));
            }U.lb && !b.Ja && (b.Ja = 4096); U.lb && !b.blocks && (b.blocks = (b.size + b.Ja - 1) / b.Ja | 0); return {
              dev: b.dev,
              ino: b.ino,
              mode: b.mode,
              nlink: b.nlink,
              uid: b.uid,
              gid: b.gid,
              rdev: b.rdev,
              size: b.size,
              atime: b.atime,
              mtime: b.mtime,
              ctime: b.ctime,
              Ja: b.Ja,
              blocks: b.blocks,
            };
          },
          wa: (a, b) => {
            const c = U.Ba(a); try { void 0 !== b.mode && (fs.chmodSync(c, b.mode), a.mode = b.mode), void 0 !== b.size && fs.truncateSync(c, b.size); }
            catch (e) {
              if (!e.code) { throw e; } throw new S.na(U.xa(e));
            }
          },
          lookup: (a, b) => { let c = Q(U.Ba(a), b); c = U.Ta(c); return U.createNode(a, b, c); },
          Ca: (a, b, c, e) => {
            a = U.createNode(a, b, c, e); b = U.Ba(a); try {
              S.va(a.mode)
                ? fs.mkdirSync(b, a.mode)
                : fs.writeFileSync(b,
                  '', { mode: a.mode });
            }
            catch (f) {
              if (!f.code) { throw f; } throw new S.na(U.xa(f));
            } return a;
          },
          rename: (a, b, c) => {
            const e = U.Ba(a); b = Q(U.Ba(b), c); try { fs.renameSync(e, b); }
            catch (f) {
              if (!f.code) { throw f; } throw new S.na(U.xa(f));
            }a.name = c;
          },
          unlink: (a, b) => {
            a = Q(U.Ba(a), b); try { fs.unlinkSync(a); }
            catch (c) {
              if (!c.code) { throw c; } throw new S.na(U.xa(c));
            }
          },
          rmdir: (a, b) => {
            a = Q(U.Ba(a), b); try { fs.rmdirSync(a); }
            catch (c) {
              if (!c.code) { throw c; } throw new S.na(U.xa(c));
            }
          },
          readdir: (a) => {
            a = U.Ba(a); try { return fs.readdirSync(a); }
            catch (b) {
              if (!b.code) { throw b; }
              throw new S.na(U.xa(b));
            }
          },
          symlink: (a, b, c) => {
            a = Q(U.Ba(a), b); try { fs.symlinkSync(c, a); }
            catch (e) {
              if (!e.code) { throw e; } throw new S.na(U.xa(e));
            }
          },
          readlink: (a) => {
            let b = U.Ba(a); try { return b = fs.readlinkSync(b), b = t.relative(t.resolve(a.ra.$a.root), b); }
            catch (c) {
              if (!c.code) { throw c; } if (c.code === 'UNKNOWN') { throw new S.na(28); } throw new S.na(U.xa(c));
            }
          },
        },
        qa: {
          open: (a) => {
            const b = U.Ba(a.node); try { S.isFile(a.node.mode) && (a.ib = fs.openSync(b, U.Ec(a.flags))); }
            catch (c) {
              if (!c.code) { throw c; } throw new S.na(U.xa(c));
            }
          },
          close: (a) => {
            try {
              S.isFile(a.node.mode)
&& a.ib && fs.closeSync(a.ib);
            }
            catch (b) {
              if (!b.code) { throw b; } throw new S.na(U.xa(b));
            }
          },
          read: (a, b, c, e, f) => {
            if (e === 0) { return 0; } try { return fs.readSync(a.ib, Buffer.from(b.buffer), c, e, f); }
            catch (g) { throw new S.na(U.xa(g)); }
          },
          write: (a, b, c, e, f) => {
            try { return fs.writeSync(a.ib, Buffer.from(b.buffer), c, e, f); }
            catch (g) { throw new S.na(U.xa(g)); }
          },
          Aa: (a, b, c) => {
            if (c === 1) { b += a.position; }
            else if (c === 2 && S.isFile(a.node.mode)) {
              try { b += fs.fstatSync(a.ib).size; }
              catch (e) { throw new S.na(U.xa(e)); }
            } if (b < 0) { throw new S.na(28); } return b;
          },
          Wa: (a,
            b, c, e) => {
            if (b !== 0) { throw new S.na(28); } if (!S.isFile(a.node.mode)) { throw new S.na(43); } A(); U.qa.read(a, D, void 0, c, e); return { ta: void 0, qc: !0 };
          },
          Xa: (a, b, c, e, f) => {
            if (!S.isFile(a.node.mode)) { throw new S.na(43); } if (f & 2) { return 0; } U.qa.write(a, b, 0, e, c, !1); return 0;
          },
        },
      }; var V = {
        sb: 16895,
        bb: 33279,
        Kb: null,
        ra(a) {
          function b(g) { g = g.split('/'); for (var k = e, l = 0; l < g.length - 1; l++) { const p = g.slice(0, l + 1).join('/'); f[p] || (f[p] = V.createNode(k, g[l], V.sb, 0)); k = f[p]; } return k; } function c(g) { g = g.split('/'); return g[g.length - 1]; }m || A();
          V.Kb || (V.Kb = new FileReaderSync()); var e = V.createNode(null, '/', V.sb, 0); var f = {}; Array.prototype.forEach.call(a.$a.files || [], (g) => { V.createNode(b(g.name), c(g.name), V.bb, 0, g, g.lastModifiedDate); }); (a.$a.blobs || []).forEach((g) => { V.createNode(b(g.name), c(g.name), V.bb, 0, g.data); }); (a.$a.packages || []).forEach((g) => { g.metadata.files.forEach((k) => { const l = k.filename.substr(1); V.createNode(b(l), c(l), V.bb, 0, g.blob.slice(k.start, k.end)); }); }); return e;
        },
        createNode(a, b, c, e, f, g) {
          e = S.createNode(a,
            b, c); e.mode = c; e.oa = V.oa; e.qa = V.qa; e.timestamp = (g || new Date()).getTime(); V.bb !== V.sb || A(); c === V.bb ? (e.size = f.size, e.pa = f) : (e.size = 4096, e.pa = {}); a && (a.pa[b] = e); return e;
        },
        oa: {
          za(a) { return { dev: 1, ino: a.id, mode: a.mode, nlink: 1, uid: 0, gid: 0, rdev: void 0, size: a.size, atime: new Date(a.timestamp), mtime: new Date(a.timestamp), ctime: new Date(a.timestamp), Ja: 4096, blocks: Math.ceil(a.size / 4096) }; },
          wa(a, b) { void 0 !== b.mode && (a.mode = b.mode); void 0 !== b.timestamp && (a.timestamp = b.timestamp); },
          lookup() {
            throw new S.na(44);
          },
          Ca() { throw new S.na(63); },
          rename() { throw new S.na(63); },
          unlink() { throw new S.na(63); },
          rmdir() { throw new S.na(63); },
          readdir(a) { const b = ['.', '..']; let c; for (c in a.pa) { a.pa.hasOwnProperty(c) && b.push(c); } return b; },
          symlink() { throw new S.na(63); },
          readlink() { throw new S.na(63); },
        },
        qa: {
          read(a, b, c, e, f) {
            if (f >= a.node.size) { return 0; } a = a.node.pa.slice(f, f + e); e = V.Kb.readAsArrayBuffer(a); b.set(new Uint8Array(e), c); return a.size;
          },
          write() {
            throw new S.na(29);
          },
          Aa(a, b, c) {
            c === 1 ? b += a.position : c === 2 && S.isFile(a.node.mode) && (b += a.node.size); if (b < 0) { throw new S.na(28); } return b;
          },
        },
      }; var S = {
        root: null,
        hb: [],
        Yb: {},
        streams: [],
        Mc: 1,
        Ea: null,
        Xb: '/',
        Cb: !1,
        Bb: !0,
        na: null,
        yb: {},
        Cc: null,
        pb: 0,
        sa: (a, b = {}) => {
          a = R(S.cwd(), a); if (!a) { return { path: '', node: null }; } b = Object.assign({ xb: !0, Lb: 0 }, b); if (b.Lb > 8) { throw new S.na(32); } a = Wa(a.split('/').filter(k => !!k), !1); for (var c = S.root, e = '/', f = 0; f < a.length; f++) {
            let g = f === a.length - 1; if (g && b.parent) { break; } c = S.Ha(c, a[f]); e = O(`${e}/${a[f]}`); S.Na(c)
&& (!g || g && b.xb) && (c = c.gb.root); if (!g || b.Da) {
              for (g = 0; S.Va(c.mode);) {
                if (c = S.readlink(e), e = R(Xa(e), c), c = S.sa(e, { Lb: b.Lb + 1 }).node, g++ > 40) { throw new S.na(32); }
              }
            }
          } return { path: e, node: c };
        },
        La: (a) => {
          for (var b; ;) {
            if (S.kb(a)) { return a = a.ra.kc, b ? a[a.length - 1] !== '/' ? `${a}/${b}` : a + b : a; } b = b ? `${a.name}/${b}` : a.name; a = a.parent;
          }
        },
        Ab: (a, b) => { for (var c = 0, e = 0; e < b.length; e++) { c = (c << 5) - c + b.charCodeAt(e) | 0; } return (a + c >>> 0) % S.Ea.length; },
        ic: (a) => { const b = S.Ab(a.parent.id, a.name); a.Pa = S.Ea[b]; S.Ea[b] = a; },
        jc: (a) => {
          let b = S.Ab(a.parent.id, a.name); if (S.Ea[b]
=== a) { S.Ea[b] = a.Pa; }
          else { for (b = S.Ea[b]; b;) { if (b.Pa === a) { b.Pa = a.Pa; break; }b = b.Pa; } }
        },
        Ha: (a, b) => {
          let c = S.Jc(a); if (c) { throw new S.na(c, a); } for (c = S.Ea[S.Ab(a.id, b)]; c; c = c.Pa) {
            const e = c.name; if (c.parent.id === a.id && e === b) { return c; }
          } return S.lookup(a, b);
        },
        createNode: (a, b, c, e) => { a = new S.mc(a, b, c, e); S.ic(a); return a; },
        wb: (a) => { S.jc(a); },
        kb: a => a === a.parent,
        Na: a => !!a.gb,
        isFile: a => (a & 61440) === 32768,
        va: a => (a & 61440) === 16384,
        Va: a => (a & 61440) === 40960,
        jb: a => (a & 61440) === 8192,
        Hc: a => (a & 61440) === 24576,
        isFIFO: a => (a & 61440) === 4096,
        isSocket: a =>
          (a & 49152) === 49152,
        Dc: { 'r': 0, 'r+': 2, 'w': 577, 'w+': 578, 'a': 1089, 'a+': 1090 },
        Lc: (a) => {
          const b = S.Dc[a]; if (typeof b == 'undefined') { throw new TypeError(`Unknown file open mode: ${a}`); } return b;
        },
        bc: (a) => { let b = ['r', 'w', 'rw'][a & 3]; a & 512 && (b += 'w'); return b; },
        Qa: (a, b) => {
          if (S.Bb) { return 0; } if (!b.includes('r') || a.mode & 292) {
            if (b.includes('w') && !(a.mode & 146) || b.includes('x') && !(a.mode & 73)) { return 2; }
          }
          else { return 2; } return 0;
        },
        Jc: (a) => { const b = S.Qa(a, 'x'); return b || (a.oa.lookup ? 0 : 2); },
        Hb: (a, b) => {
          try { return S.Ha(a, b), 20; }
          catch (c) {} return S.Qa(a, 'wx');
        },
        mb: (a, b, c) => {
          try { var e = S.Ha(a, b); }
          catch (f) { return f.ya; } if (a = S.Qa(a, 'wx')) { return a; } if (c) {
            if (!S.va(e.mode)) { return 54; } if (S.kb(e) || S.La(e) === S.cwd()) { return 10; }
          }
          else if (S.va(e.mode)) { return 31; } return 0;
        },
        Kc: (a, b) => a ? S.Va(a.mode) ? 32 : S.va(a.mode) && (S.bc(b) !== 'r' || b & 512) ? 31 : S.Qa(a, S.bc(b)) : 44,
        nc: 4096,
        Nc: (a = 0, b = S.nc) => {
          for (;a <= b; a++) {
            if (!S.streams[a]) { return a; }
          } throw new S.na(33);
        },
        Ua: a => S.streams[a],
        Wb: (a, b, c) => {
          S.tb || (S.tb = function () { this.ob = {}; }, S.tb.prototype = {
            object: {
              get() { return this.node; },
              set(e) {
                this.node
= e;
              },
            },
            flags: { get() { return this.ob.flags; }, set(e) { this.ob.flags = e; } },
            position: { get md() { return this.ob.position; }, set(e) { this.ob.position = e; } },
          }); a = Object.assign(new S.tb(), a); b = S.Nc(b, c); a.fd = b; return S.streams[b] = a;
        },
        uc: (a) => { S.streams[a] = null; },
        tc: { open: (a) => { a.qa = S.Fc(a.node.rdev).qa; a.qa.open && a.qa.open(a); }, Aa: () => { throw new S.na(70); } },
        Gb: a => a >> 8,
        qd: a => a & 255,
        Oa: (a, b) => a << 8 | b,
        Mb: (a, b) => { S.Yb[a] = { qa: b }; },
        Fc: a => S.Yb[a],
        dc: (a) => {
          const b = []; for (a = [a]; a.length;) {
            const c = a.pop(); b.push(c); a.push.apply(a,
              c.hb);
          } return b;
        },
        lc: (a, b) => {
          function c(k) { S.pb--; return b(k); } function e(k) {
            if (k) {
              if (!e.Bc) { return e.Bc = !0, c(k); }
            }
            else { ++g >= f.length && c(null); }
          } typeof a == 'function' && (b = a, a = !1); S.pb++; S.pb > 1 && v(`warning: ${S.pb} FS.syncfs operations in flight at once, probably just doing extra work`); var f = S.dc(S.root.ra); var g = 0; f.forEach((k) => {
            if (!k.type.lc) { return e(null); } k.type.lc(k, a, e);
          });
        },
        ra: (a, b, c) => {
          const e = c === '/'; const f = !c; if (e && S.root) { throw new S.na(10); } if (!e && !f) {
            var g = S.sa(c, { xb: !1 }); c = g.path; g = g.node; if (S.Na(g)) { throw new S.na(10); }
            if (!S.va(g.mode)) { throw new S.na(54); }
          }b = { type: a, $a: b, kc: c, hb: [] }; a = a.ra(b); a.ra = b; b.root = a; e ? S.root = a : g && (g.gb = b, g.ra && g.ra.hb.push(b)); return a;
        },
        wd: (a) => {
          a = S.sa(a, { xb: !1 }); if (!S.Na(a.node)) { throw new S.na(28); } a = a.node; const b = a.gb; const c = S.dc(b); Object.keys(S.Ea).forEach((e) => { for (e = S.Ea[e]; e;) { const f = e.Pa; c.includes(e.ra) && S.wb(e); e = f; } }); a.gb = null; a.ra.hb.splice(a.ra.hb.indexOf(b), 1);
        },
        lookup: (a, b) => a.oa.lookup(a, b),
        Ca: (a, b, c) => {
          const e = S.sa(a, { parent: !0 }).node; a = P(a); if (!a || a === '.' || a === '..') { throw new S.na(28); }
          const f = S.Hb(e, a); if (f) { throw new S.na(f); } if (!e.oa.Ca) { throw new S.na(63); } return e.oa.Ca(e, a, b, c);
        },
        create: (a, b) => S.Ca(a, (void 0 !== b ? b : 438) & 4095 | 32768, 0),
        mkdir: (a, b) => S.Ca(a, (void 0 !== b ? b : 511) & 1023 | 16384, 0),
        rd: (a, b) => {
          a = a.split('/'); for (let c = '', e = 0; e < a.length; ++e) {
            if (a[e]) {
              c += `/${a[e]}`; try { S.mkdir(c, b); }
              catch (f) {
                if (f.ya != 20) { throw f; }
              }
            }
          }
        },
        nb: (a, b, c) => { typeof c == 'undefined' && (c = b, b = 438); return S.Ca(a, b | 8192, c); },
        symlink: (a, b) => {
          if (!R(a)) { throw new S.na(44); } const c = S.sa(b, { parent: !0 }).node; if (!c) { throw new S.na(44); }
          b = P(b); const e = S.Hb(c, b); if (e) { throw new S.na(e); } if (!c.oa.symlink) { throw new S.na(63); } return c.oa.symlink(c, b, a);
        },
        rename: (a, b) => {
          const c = Xa(a); const e = Xa(b); let f = P(a); const g = P(b); let k = S.sa(a, { parent: !0 }); const l = k.node; k = S.sa(b, { parent: !0 }); k = k.node; if (!l || !k) { throw new S.na(44); } if (l.ra !== k.ra) { throw new S.na(75); } const p = S.Ha(l, f); a = $a(a, e); if (a.charAt(0) !== '.') { throw new S.na(28); } a = $a(b, c); if (a.charAt(0) !== '.') { throw new S.na(55); } try { var n = S.Ha(k, g); }
          catch (r) {} if (p !== n) {
            b = S.va(p.mode); if (f = S.mb(l, f, b)) { throw new S.na(f); } if (f
= n ? S.mb(k, g, b) : S.Hb(k, g)) { throw new S.na(f); } if (!l.oa.rename) { throw new S.na(63); } if (S.Na(p) || n && S.Na(n)) { throw new S.na(10); } if (k !== l && (f = S.Qa(l, 'w'))) { throw new S.na(f); } S.jc(p); try { l.oa.rename(p, k, g); }
            catch (r) { throw r; }
            finally { S.ic(p); }
          }
        },
        rmdir: (a) => {
          const b = S.sa(a, { parent: !0 }).node; a = P(a); const c = S.Ha(b, a); const e = S.mb(b, a, !0); if (e) { throw new S.na(e); } if (!b.oa.rmdir) { throw new S.na(63); } if (S.Na(c)) { throw new S.na(10); } b.oa.rmdir(b, a); S.wb(c);
        },
        readdir: (a) => {
          a = S.sa(a, { Da: !0 }).node; if (!a.oa.readdir) { throw new S.na(54); } return a.oa.readdir(a);
        },
        unlink: (a) => {
          const b = S.sa(a, { parent: !0 }).node; if (!b) { throw new S.na(44); } a = P(a); const c = S.Ha(b, a); const e = S.mb(b, a, !1); if (e) { throw new S.na(e); } if (!b.oa.unlink) { throw new S.na(63); } if (S.Na(c)) { throw new S.na(10); } b.oa.unlink(b, a); S.wb(c);
        },
        readlink: (a) => {
          a = S.sa(a).node; if (!a) { throw new S.na(44); } if (!a.oa.readlink) { throw new S.na(28); } return R(S.La(a.parent), a.oa.readlink(a));
        },
        stat: (a, b) => {
          a = S.sa(a, { Da: !b }).node; if (!a) { throw new S.na(44); } if (!a.oa.za) { throw new S.na(63); } return a.oa.za(a);
        },
        lstat: a => S.stat(a, !0),
        chmod: (a, b, c) => {
          a
= typeof a == 'string' ? S.sa(a, { Da: !c }).node : a; if (!a.oa.wa) { throw new S.na(63); } a.oa.wa(a, { mode: b & 4095 | a.mode & -4096, timestamp: Date.now() });
        },
        lchmod: (a, b) => { S.chmod(a, b, !0); },
        fchmod: (a, b) => {
          a = S.Ua(a); if (!a) { throw new S.na(8); } S.chmod(a.node, b);
        },
        chown: (a, b, c, e) => {
          a = typeof a == 'string' ? S.sa(a, { Da: !e }).node : a; if (!a.oa.wa) { throw new S.na(63); } a.oa.wa(a, { timestamp: Date.now() });
        },
        lchown: (a, b, c) => { S.chown(a, b, c, !0); },
        fchown: (a, b, c) => {
          a = S.Ua(a); if (!a) { throw new S.na(8); } S.chown(a.node, b, c);
        },
        truncate: (a, b) => {
          if (b < 0) { throw new S.na(28); }
          a = typeof a == 'string' ? S.sa(a, { Da: !0 }).node : a; if (!a.oa.wa) { throw new S.na(63); } if (S.va(a.mode)) { throw new S.na(31); } if (!S.isFile(a.mode)) { throw new S.na(28); } const c = S.Qa(a, 'w'); if (c) { throw new S.na(c); } a.oa.wa(a, { size: b, timestamp: Date.now() });
        },
        kd: (a, b) => {
          a = S.Ua(a); if (!a) { throw new S.na(8); } if ((a.flags & 2097155) === 0) { throw new S.na(28); } S.truncate(a.node, b);
        },
        xd: (a, b, c) => { a = S.sa(a, { Da: !0 }).node; a.oa.wa(a, { timestamp: Math.max(b, c) }); },
        open: (a, b, c) => {
          if (a === '') { throw new S.na(44); } b = typeof b == 'string' ? S.Lc(b) : b; c = b & 64
            ? (typeof c
== 'undefined'
                ? 438
                : c) & 4095 | 32768
            : 0; if (typeof a == 'object') { var e = a; }
          else {
            a = O(a); try { e = S.sa(a, { Da: !(b & 131072) }).node; }
            catch (g) {}
          } let f = !1; if (b & 64) {
            if (e) {
              if (b & 128) { throw new S.na(20); }
            }
            else { e = S.Ca(a, c, 0), f = !0; }
          } if (!e) { throw new S.na(44); } S.jb(e.mode) && (b &= -513); if (b & 65536 && !S.va(e.mode)) { throw new S.na(54); } if (!f && (c = S.Kc(e, b))) { throw new S.na(c); } b & 512 && !f && S.truncate(e, 0); b &= -131713; e = S.Wb({ node: e, path: S.La(e), flags: b, seekable: !0, position: 0, qa: e.qa, dd: [], error: !1 }); e.qa.open && e.qa.open(e); !d.logReadFiles || b & 1 || (S.Jb
|| (S.Jb = {}), a in S.Jb || (S.Jb[a] = 1)); return e;
        },
        close: (a) => {
          if (S.fb(a)) { throw new S.na(8); } a.zb && (a.zb = null); try { a.qa.close && a.qa.close(a); }
          catch (b) { throw b; }
          finally { S.uc(a.fd); }a.fd = null;
        },
        fb: a => a.fd === null,
        Aa: (a, b, c) => {
          if (S.fb(a)) { throw new S.na(8); } if (!a.seekable || !a.qa.Aa) { throw new S.na(70); } if (c != 0 && c != 1 && c != 2) { throw new S.na(28); } a.position = a.qa.Aa(a, b, c); a.dd = []; return a.position;
        },
        read: (a, b, c, e, f) => {
          if (e < 0 || f < 0) { throw new S.na(28); } if (S.fb(a)) { throw new S.na(8); } if ((a.flags & 2097155) === 1) { throw new S.na(8); } if (S.va(a.node.mode)) { throw new S.na(31); }
          if (!a.qa.read) { throw new S.na(28); } const g = typeof f != 'undefined'; if (!g) { f = a.position; }
          else if (!a.seekable) { throw new S.na(70); } b = a.qa.read(a, b, c, e, f); g || (a.position += b); return b;
        },
        write: (a, b, c, e, f, g) => {
          if (e < 0 || f < 0) { throw new S.na(28); } if (S.fb(a)) { throw new S.na(8); } if ((a.flags & 2097155) === 0) { throw new S.na(8); } if (S.va(a.node.mode)) { throw new S.na(31); } if (!a.qa.write) { throw new S.na(28); } a.seekable && a.flags & 1024 && S.Aa(a, 0, 2); const k = typeof f != 'undefined'; if (!k) { f = a.position; }
          else if (!a.seekable) { throw new S.na(70); } b = a.qa.write(a,
            b, c, e, f, g); k || (a.position += b); return b;
        },
        cb: (a, b, c) => {
          if (S.fb(a)) { throw new S.na(8); } if (b < 0 || c <= 0) { throw new S.na(28); } if ((a.flags & 2097155) === 0) { throw new S.na(8); } if (!S.isFile(a.node.mode) && !S.va(a.node.mode)) { throw new S.na(43); } if (!a.qa.cb) { throw new S.na(138); } a.qa.cb(a, b, c);
        },
        Wa: (a, b, c, e, f, g) => {
          if ((f & 2) !== 0 && (g & 2) === 0 && (a.flags & 2097155) !== 2) { throw new S.na(2); } if ((a.flags & 2097155) === 1) { throw new S.na(2); } if (!a.qa.Wa) { throw new S.na(43); } return a.qa.Wa(a, b, c, e, f, g);
        },
        Xa: (a, b, c, e, f) => a && a.qa.Xa
          ? a.qa.Xa(a, b, c, e, f)
          : 0,
        sd: () => 0,
        Db: (a, b, c) => {
          if (!a.qa.Db) { throw new S.na(59); } return a.qa.Db(a, b, c);
        },
        readFile: (a, b = {}) => {
          b.flags = b.flags || 0; b.encoding = b.encoding || 'binary'; if (b.encoding !== 'utf8' && b.encoding !== 'binary') { throw new Error(`Invalid encoding type "${b.encoding}"`); } let c; const e = S.open(a, b.flags); a = S.stat(a).size; const f = new Uint8Array(a); S.read(e, f, 0, a, 0); b.encoding === 'utf8' ? c = B(f, 0) : b.encoding === 'binary' && (c = f); S.close(e); return c;
        },
        writeFile: (a, b, c = {}) => {
          c.flags = c.flags || 577; a = S.open(a, c.flags, c.mode); if (typeof b == 'string') {
            const e
= new Uint8Array(va(b) + 1); b = ua(b, e, 0, e.length); S.write(a, e, 0, b, void 0, c.sc);
          }
          else if (ArrayBuffer.isView(b)) { S.write(a, b, 0, b.byteLength, void 0, c.sc); }
          else { throw new TypeError('Unsupported data type'); }S.close(a);
        },
        cwd: () => S.Xb,
        chdir: (a) => {
          a = S.sa(a, { Da: !0 }); if (a.node === null) { throw new S.na(44); } if (!S.va(a.node.mode)) { throw new S.na(54); } const b = S.Qa(a.node, 'x'); if (b) { throw new S.na(b); } S.Xb = a.path;
        },
        wc: () => { S.mkdir('/tmp'); S.mkdir('/home'); S.mkdir('/home/web_user'); },
        vc: () => {
          S.mkdir('/dev'); S.Mb(S.Oa(1, 3), {
            read: () => 0,
            write: (b,
              c, e, f) => f,
          }); S.nb('/dev/null', S.Oa(1, 3)); bb(S.Oa(5, 0), eb); bb(S.Oa(6, 0), fb); S.nb('/dev/tty', S.Oa(5, 0)); S.nb('/dev/tty1', S.Oa(6, 0)); const a = Za(); S.Ka('/dev', 'random', a); S.Ka('/dev', 'urandom', a); S.mkdir('/dev/shm'); S.mkdir('/dev/shm/tmp');
        },
        zc: () => {
          S.mkdir('/proc'); const a = S.mkdir('/proc/self'); S.mkdir('/proc/self/fd'); S.ra({
            ra: () => {
              const b = S.createNode(a, 'fd', 16895, 73); b.oa = {
                lookup: (c, e) => {
                  const f = S.Ua(+e); if (!f) { throw new S.na(8); } c = { parent: null, ra: { kc: 'fake' }, oa: { readlink: () => f.path } }; return c.parent = c;
                },
              }; return b;
            },
          },
          {}, '/proc/self/fd');
        },
        Ac: () => { d.stdin ? S.Ka('/dev', 'stdin', d.stdin) : S.symlink('/dev/tty', '/dev/stdin'); d.stdout ? S.Ka('/dev', 'stdout', null, d.stdout) : S.symlink('/dev/tty', '/dev/stdout'); d.stderr ? S.Ka('/dev', 'stderr', null, d.stderr) : S.symlink('/dev/tty1', '/dev/stderr'); S.open('/dev/stdin', 0); S.open('/dev/stdout', 1); S.open('/dev/stderr', 1); },
        Zb: () => {
          S.na || (S.na = function (a, b) { this.node = b; this.Xc = function (c) { this.ya = c; }; this.Xc(a); this.message = 'FS error'; }, S.na.prototype = Error(), S.na.prototype.constructor = S.na,
          [44].forEach((a) => { S.yb[a] = new S.na(a); S.yb[a].stack = '<generic error, no stack>'; }));
        },
        Pb: () => { S.Zb(); S.Ea = Array(4096); S.ra(T, {}, '/'); S.wc(); S.vc(); S.zc(); S.Cc = { MEMFS: T, NODEFS: U, WORKERFS: V }; },
        Ma: (a, b, c) => { S.Ma.Cb = !0; S.Zb(); d.stdin = a || d.stdin; d.stdout = b || d.stdout; d.stderr = c || d.stderr; S.Ac(); },
        td: () => { S.Ma.Cb = !1; for (let a = 0; a < S.streams.length; a++) { const b = S.streams[a]; b && S.close(b); } },
        Ta: (a, b) => { let c = 0; a && (c |= 365); b && (c |= 146); return c; },
        jd: (a, b) => { a = S.ub(a, b); return a.exists ? a.object : null; },
        ub: (a, b) => {
          try {
            var c
= S.sa(a, { Da: !b }); a = c.path;
          }
          catch (f) {} const e = { kb: !1, exists: !1, error: 0, name: null, path: null, object: null, Pc: !1, Rc: null, Qc: null }; try { c = S.sa(a, { parent: !0 }), e.Pc = !0, e.Rc = c.path, e.Qc = c.node, e.name = P(a), c = S.sa(a, { Da: !b }), e.exists = !0, e.path = c.path, e.object = c.node, e.name = c.node.name, e.kb = c.path === '/'; }
          catch (f) { e.error = f.ya; } return e;
        },
        gd: (a, b) => {
          a = typeof a == 'string' ? a : S.La(a); for (b = b.split('/').reverse(); b.length;) {
            const c = b.pop(); if (c) {
              var e = O(`${a}/${c}`); try { S.mkdir(e); }
              catch (f) {}a = e;
            }
          } return e;
        },
        xc: (a, b, c, e, f) => {
          a = Q(typeof a
== 'string'
            ? a
            : S.La(a), b); e = S.Ta(e, f); return S.create(a, e);
        },
        Vb: (a, b, c, e, f, g) => { let k = b; a && (a = typeof a == 'string' ? a : S.La(a), k = b ? O(`${a}/${b}`) : a); a = S.Ta(e, f); k = S.create(k, a); if (c) { if (typeof c == 'string') { b = Array(c.length); e = 0; for (f = c.length; e < f; ++e) { b[e] = c.charCodeAt(e); }c = b; }S.chmod(k, a | 146); b = S.open(k, 577); S.write(b, c, 0, c.length, 0, g); S.close(b); S.chmod(k, a); } return k; },
        Ka: (a, b, c, e) => {
          a = Q(typeof a == 'string' ? a : S.La(a), b); b = S.Ta(!!c, !!e); S.Ka.Gb || (S.Ka.Gb = 64); const f = S.Oa(S.Ka.Gb++, 0); S.Mb(f, {
            open: (g) => { g.seekable = !1; },
            close: () => { e && e.buffer && e.buffer.length && e(10); },
            read: (g, k, l, p) => {
              for (var n = 0, r = 0; r < p; r++) {
                try { var w = c(); }
                catch (y) { throw new S.na(29); } if (void 0 === w && n === 0) { throw new S.na(6); } if (w === null || void 0 === w) { break; } n++; k[l + r] = w;
              }n && (g.node.timestamp = Date.now()); return n;
            },
            write: (g, k, l, p) => {
              for (var n = 0; n < p; n++) {
                try { e(k[l + n]); }
                catch (r) { throw new S.na(29); }
              }p && (g.node.timestamp = Date.now()); return n;
            },
          }); return S.nb(a, b, f);
        },
        cc: (a) => {
          if (a.Eb || a.Ic || a.link || a.pa) { return !0; } if (typeof XMLHttpRequest != 'undefined') { throw new TypeError('Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.'); }
          if (ja) {
            try { a.pa = db(ja(a.url), !0), a.ua = a.pa.length; }
            catch (b) { throw new S.na(29); }
          }
          else { throw new Error('Cannot load without read() or XMLHttpRequest.'); }
        },
        yc: (a, b, c, e, f) => {
          function g() { this.Fb = !1; this.Ia = []; }g.prototype.get = function (n) { if (!(n > this.length - 1 || n < 0)) { const r = n % this.chunkSize; return this.hc(n / this.chunkSize | 0)[r]; } }; g.prototype.Ya = function (n) { this.hc = n; }; g.prototype.Tb = function () {
            let n = new XMLHttpRequest(); n.open('HEAD', c, !1); n.send(null); if (!(n.status >= 200 && n.status < 300 || n.status === 304)) {
              throw new Error(`Couldn't load ${
c}. Status: ${n.status}`);
            } let r = Number(n.getResponseHeader('Content-length')); let w; const y = (w = n.getResponseHeader('Accept-Ranges')) && w === 'bytes'; n = (w = n.getResponseHeader('Content-Encoding')) && w === 'gzip'; let h = 1048576; y || (h = r); const u = this; u.Ya((x) => {
              let F = x * h; let I = (x + 1) * h - 1; I = Math.min(I, r - 1); if (typeof u.Ia[x] == 'undefined') {
                const Ab = u.Ia; if (F > I) { throw new Error(`invalid range (${F}, ${I}) or no bytes requested!`); } if (I > r - 1) { throw new Error(`only ${r} bytes available! programmer error!`); } const J = new XMLHttpRequest(); J.open('GET',
                  c, !1); r !== h && J.setRequestHeader('Range', `bytes=${F}-${I}`); J.responseType = 'arraybuffer'; J.overrideMimeType && J.overrideMimeType('text/plain; charset=x-user-defined'); J.send(null); if (!(J.status >= 200 && J.status < 300 || J.status === 304)) { throw new Error(`Couldn't load ${c}. Status: ${J.status}`); } F = void 0 !== J.response ? new Uint8Array(J.response || []) : db(J.responseText || '', !0); Ab[x] = F;
              } if (typeof u.Ia[x] == 'undefined') { throw new TypeError('doXHR failed!'); } return u.Ia[x];
            }); if (n || !r) { h = r = 1, h = r = this.hc(0).length, oa('LazyFiles on gzip forces download of the whole file when length is accessed'); }
            this.pc = r; this.oc = h; this.Fb = !0;
          }; if (typeof XMLHttpRequest != 'undefined') {
            if (!m) { throw 'Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc'; } var k = new g(); Object.defineProperties(k, { length: { get() { this.Fb || this.Tb(); return this.pc; } }, chunkSize: { get() { this.Fb || this.Tb(); return this.oc; } } }); k = { Eb: !1, pa: k };
          }
          else { k = { Eb: !1, url: c }; } const l = S.xc(a, b, k, e, f); k.pa ? l.pa = k.pa : k.url && (l.pa = null, l.url = k.url); Object.defineProperties(l, { ua: { get() { return this.pa.length; } } });
          const p = {}; Object.keys(l.qa).forEach((n) => { const r = l.qa[n]; p[n] = function () { S.cc(l); return r.apply(null, arguments); }; }); p.read = (n, r, w, y, h) => {
            S.cc(l); n = n.node.pa; if (h >= n.length) { return 0; } y = Math.min(n.length - h, y); if (n.slice) { for (var u = 0; u < y; u++) { r[w + u] = n[h + u]; } }
            else { for (u = 0; u < y; u++) { r[w + u] = n.get(h + u); } } return y;
          }; l.qa = p; return l;
        },
        hd: (a, b, c, e, f, g, k, l, p, n) => {
          function r(y) { function h(u) { n && n(); l || S.Vb(a, b, u, e, f, p); g && g(); La(); }ib.od(y, w, h, () => { k && k(); La(); }) || h(y); } var w = b ? R(O(`${a}/${b}`)) : a; H++; typeof c == 'string'
            ? gb(c, y => r(y),
              k)
            : r(c);
        },
        indexedDB: () => window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB,
        Rb: () => `EM_FS_${window.location.pathname}`,
        Sb: 20,
        ab: 'FILE_DATA',
        ud: (a, b, c) => {
          b = b || (() => {}); c = c || (() => {}); const e = S.indexedDB(); try { var f = e.open(S.Rb(), S.Sb); }
          catch (g) { return c(g); }f.onupgradeneeded = () => { oa('creating db'); f.result.createObjectStore(S.ab); }; f.onsuccess = () => {
            const g = f.result.transaction([S.ab], 'readwrite'); const k = g.objectStore(S.ab); let l = 0; let p = 0; const n = a.length; a.forEach((r) => {
              r = k.put(S.ub(r).object.pa, r);
              r.onsuccess = () => { l++; l + p == n && (p == 0 ? b() : c()); }; r.onerror = () => { p++; l + p == n && (p == 0 ? b() : c()); };
            }); g.onerror = c;
          }; f.onerror = c;
        },
        pd: (a, b, c) => {
          b = b || (() => {}); c = c || (() => {}); const e = S.indexedDB(); try { var f = e.open(S.Rb(), S.Sb); }
          catch (g) { return c(g); }f.onupgradeneeded = c; f.onsuccess = () => {
            const g = f.result; try { var k = g.transaction([S.ab], 'readonly'); }
            catch (w) { c(w); return; } const l = k.objectStore(S.ab); let p = 0; let n = 0; const r = a.length; a.forEach((w) => {
              const y = l.get(w); y.onsuccess = () => {
                S.ub(w).exists && S.unlink(w); S.Vb(Xa(w), P(w), y.result, !0, !0, !0); p++;
                p + n == r && (n == 0 ? b() : c());
              }; y.onerror = () => { n++; p + n == r && (n == 0 ? b() : c()); };
            }); k.onerror = c;
          }; f.onerror = c;
        },
      }; function jb(a, b) {
        if (b.charAt(0) === '/') { return b; } if (a === -100) { a = S.cwd(); }
        else {
          a = S.Ua(a); if (!a) { throw new S.na(8); } a = a.path;
        } if (b.length == 0) { throw new S.na(44); } return O(`${a}/${b}`);
      } let kb = void 0; function W() { kb += 4; return E[kb - 4 >> 2]; } function lb(a) {
        a = S.Ua(a); if (!a) { throw new S.na(8); } return a;
      }
      function mb(a, b, c) { function e(p) { return (p = p.toTimeString().match(/\(([A-Za-z ]+)\)$/)) ? p[1] : 'GMT'; } let f = (new Date()).getFullYear(); const g = new Date(f, 0, 1); const k = new Date(f, 6, 1); f = g.getTimezoneOffset(); const l = k.getTimezoneOffset(); E[a >> 2] = 60 * Math.max(f, l); E[b >> 2] = Number(f != l); a = e(g); b = e(k); a = wa(a); b = wa(b); l < f ? (E[c >> 2] = a, E[c + 4 >> 2] = b) : (E[c >> 2] = b, E[c + 4 >> 2] = a); } function nb(a, b, c) { nb.rc || (nb.rc = !0, mb(a, b, c)); } const ob = {};
      function pb() { if (!qb) { const a = { USER: 'web_user', LOGNAME: 'web_user', PATH: '/', PWD: '/', HOME: '/home/web_user', LANG: `${(typeof navigator == 'object' && navigator.languages && navigator.languages[0] || 'C').replace('-', '_')}.UTF-8`, _: ea || './this.program' }; let b; for (b in ob) { void 0 === ob[b] ? delete a[b] : a[b] = ob[b]; } const c = []; for (b in a) { c.push(`${b}=${a[b]}`); }qb = c; } return qb; } let qb; function rb(a) { return a % 4 === 0 && (a % 100 !== 0 || a % 400 === 0); } const sb = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]; const tb = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      function ub(a, b, c, e) {
        function f(h, u, x) { for (h = typeof h == 'number' ? h.toString() : h || ''; h.length < u;) { h = x[0] + h; } return h; } function g(h, u) { return f(h, u, '0'); } function k(h, u) { function x(I) { return I < 0 ? -1 : I > 0 ? 1 : 0; } let F; (F = x(h.getFullYear() - u.getFullYear())) === 0 && (F = x(h.getMonth() - u.getMonth())) === 0 && (F = x(h.getDate() - u.getDate())); return F; } function l(h) {
          switch (h.getDay()) {
            case 0:return new Date(h.getFullYear() - 1, 11, 29); case 1:return h; case 2:return new Date(h.getFullYear(), 0, 3); case 3:return new Date(h.getFullYear(),
              0, 2); case 4:return new Date(h.getFullYear(), 0, 1); case 5:return new Date(h.getFullYear() - 1, 11, 31); case 6:return new Date(h.getFullYear() - 1, 11, 30);
          }
        } function p(h) {
          let u = h.Ra; for (h = new Date((new Date(h.Sa + 1900, 0, 1)).getTime()); u > 0;) {
            var x = h.getMonth(); const F = (rb(h.getFullYear()) ? sb : tb)[x]; if (u > F - h.getDate()) { u -= F - h.getDate() + 1, h.setDate(1), x < 11 ? h.setMonth(x + 1) : (h.setMonth(0), h.setFullYear(h.getFullYear() + 1)); }
            else { h.setDate(h.getDate() + u); break; }
          }x = new Date(h.getFullYear() + 1, 0, 4); u = l(new Date(h.getFullYear(),
            0, 4)); x = l(x); return k(u, h) <= 0 ? k(x, h) <= 0 ? h.getFullYear() + 1 : h.getFullYear() : h.getFullYear() - 1;
        } let n = E[e + 40 >> 2]; e = { ad: E[e >> 2], $c: E[e + 4 >> 2], qb: E[e + 8 >> 2], Qb: E[e + 12 >> 2], rb: E[e + 16 >> 2], Sa: E[e + 20 >> 2], Ga: E[e + 24 >> 2], Ra: E[e + 28 >> 2], vd: E[e + 32 >> 2], Zc: E[e + 36 >> 2], bd: n ? C(n) : '' }; c = C(c); n = {
          '%c': '%a %b %d %H:%M:%S %Y',
          '%D': '%m/%d/%y',
          '%F': '%Y-%m-%d',
          '%h': '%b',
          '%r': '%I:%M:%S %p',
          '%R': '%H:%M',
          '%T': '%H:%M:%S',
          '%x': '%m/%d/%y',
          '%X': '%H:%M:%S',
          '%Ec': '%c',
          '%EC': '%C',
          '%Ex': '%m/%d/%y',
          '%EX': '%H:%M:%S',
          '%Ey': '%y',
          '%EY': '%Y',
          '%Od': '%d',
          '%Oe': '%e',
          '%OH': '%H',
          '%OI': '%I',
          '%Om': '%m',
          '%OM': '%M',
          '%OS': '%S',
          '%Ou': '%u',
          '%OU': '%U',
          '%OV': '%V',
          '%Ow': '%w',
          '%OW': '%W',
          '%Oy': '%y',
        }; for (var r in n) { c = c.replace(new RegExp(r, 'g'), n[r]); } const w = 'Sunday Monday Tuesday Wednesday Thursday Friday Saturday'.split(' '); const y = 'January February March April May June July August September October November December'.split(' '); n = {
          '%a': function (h) { return w[h.Ga].substring(0, 3); },
          '%A': function (h) { return w[h.Ga]; },
          '%b': function (h) { return y[h.rb].substring(0, 3); },
          '%B': function (h) { return y[h.rb]; },
          '%C': function (h) { return g((h.Sa + 1900) / 100 | 0, 2); },
          '%d': function (h) { return g(h.Qb, 2); },
          '%e': function (h) { return f(h.Qb, 2, ' '); },
          '%g': function (h) { return p(h).toString().substring(2); },
          '%G': function (h) { return p(h); },
          '%H': function (h) { return g(h.qb, 2); },
          '%I': function (h) { h = h.qb; h == 0 ? h = 12 : h > 12 && (h -= 12); return g(h, 2); },
          '%j': function (h) { for (var u = 0, x = 0; x <= h.rb - 1; u += (rb(h.Sa + 1900) ? sb : tb)[x++]) { ; } return g(h.Qb + u, 3); },
          '%m': function (h) { return g(h.rb + 1, 2); },
          '%M': function (h) { return g(h.$c, 2); },
          '%n': function () { return '\n'; },
          '%p': function (h) {
            return h.qb
>= 0 && h.qb < 12
              ? 'AM'
              : 'PM';
          },
          '%S': function (h) { return g(h.ad, 2); },
          '%t': function () { return '\t'; },
          '%u': function (h) { return h.Ga || 7; },
          '%U': function (h) { return g(Math.floor((h.Ra + 7 - h.Ga) / 7), 2); },
          '%V': function (h) {
            let u = Math.floor((h.Ra + 7 - (h.Ga + 6) % 7) / 7); (h.Ga + 371 - h.Ra - 2) % 7 <= 2 && u++; if (u) { u == 53 && (x = (h.Ga + 371 - h.Ra) % 7, x == 4 || x == 3 && rb(h.Sa) || (u = 1)); }
            else { u = 52; var x = (h.Ga + 7 - h.Ra - 1) % 7; (x == 4 || x == 5 && rb(h.Sa % 400 - 1)) && u++; } return g(u, 2);
          },
          '%w': function (h) { return h.Ga; },
          '%W': function (h) { return g(Math.floor((h.Ra + 7 - (h.Ga + 6) % 7) / 7), 2); },
          '%y': function (h) { return (h.Sa + 1900).toString().substring(2); },
          '%Y': function (h) { return h.Sa + 1900; },
          '%z': function (h) { h = h.Zc; const u = h >= 0; h = Math.abs(h) / 60; return (u ? '+' : '-') + String(`0000${h / 60 * 100 + h % 60}`).slice(-4); },
          '%Z': function (h) { return h.bd; },
          '%%': function () { return '%'; },
        }; c = c.replace(/%%/g, '\x00\x00'); for (r in n) { c.includes(r) && (c = c.replace(new RegExp(r, 'g'), n[r](e))); }c = c.replace(/\0\0/g, '%'); r = db(c, !1); if (r.length > b) { return 0; } D.set(r, a); return r.length - 1;
      }
      function vb(a, b, c, e) { a || (a = this); this.parent = a; this.ra = a.ra; this.gb = null; this.id = S.Mc++; this.name = b; this.mode = c; this.oa = {}; this.qa = {}; this.rdev = e; }Object.defineProperties(vb.prototype, { read: { get() { return (this.mode & 365) === 365; }, set(a) { a ? this.mode |= 365 : this.mode &= -366; } }, write: { get() { return (this.mode & 146) === 146; }, set(a) { a ? this.mode |= 146 : this.mode &= -147; } }, Ic: { get() { return S.va(this.mode); } }, Eb: { get() { return S.jb(this.mode); } } }); S.mc = vb; S.Pb(); let ib;
      ia && (ma(), U.Pb());
      hb = {
        EPERM: 63,
        ENOENT: 44,
        ESRCH: 71,
        EINTR: 27,
        EIO: 29,
        ENXIO: 60,
        E2BIG: 1,
        ENOEXEC: 45,
        EBADF: 8,
        ECHILD: 12,
        EAGAIN: 6,
        EWOULDBLOCK: 6,
        ENOMEM: 48,
        EACCES: 2,
        EFAULT: 21,
        ENOTBLK: 105,
        EBUSY: 10,
        EEXIST: 20,
        EXDEV: 75,
        ENODEV: 43,
        ENOTDIR: 54,
        EISDIR: 31,
        EINVAL: 28,
        ENFILE: 41,
        EMFILE: 33,
        ENOTTY: 59,
        ETXTBSY: 74,
        EFBIG: 22,
        ENOSPC: 51,
        ESPIPE: 70,
        EROFS: 69,
        EMLINK: 34,
        EPIPE: 64,
        EDOM: 18,
        ERANGE: 68,
        ENOMSG: 49,
        EIDRM: 24,
        ECHRNG: 106,
        EL2NSYNC: 156,
        EL3HLT: 107,
        EL3RST: 108,
        ELNRNG: 109,
        EUNATCH: 110,
        ENOCSI: 111,
        EL2HLT: 112,
        EDEADLK: 16,
        ENOLCK: 46,
        EBADE: 113,
        EBADR: 114,
        EXFULL: 115,
        ENOANO: 104,
        EBADRQC: 103,
        EBADSLT: 102,
        EDEADLOCK: 16,
        EBFONT: 101,
        ENOSTR: 100,
        ENODATA: 116,
        ETIME: 117,
        ENOSR: 118,
        ENONET: 119,
        ENOPKG: 120,
        EREMOTE: 121,
        ENOLINK: 47,
        EADV: 122,
        ESRMNT: 123,
        ECOMM: 124,
        EPROTO: 65,
        EMULTIHOP: 36,
        EDOTDOT: 125,
        EBADMSG: 9,
        ENOTUNIQ: 126,
        EBADFD: 127,
        EREMCHG: 128,
        ELIBACC: 129,
        ELIBBAD: 130,
        ELIBSCN: 131,
        ELIBMAX: 132,
        ELIBEXEC: 133,
        ENOSYS: 52,
        ENOTEMPTY: 55,
        ENAMETOOLONG: 37,
        ELOOP: 32,
        EOPNOTSUPP: 138,
        EPFNOSUPPORT: 139,
        ECONNRESET: 15,
        ENOBUFS: 42,
        EAFNOSUPPORT: 5,
        EPROTOTYPE: 67,
        ENOTSOCK: 57,
        ENOPROTOOPT: 50,
        ESHUTDOWN: 140,
        ECONNREFUSED: 14,
        EADDRINUSE: 3,
        ECONNABORTED: 13,
        ENETUNREACH: 40,
        ENETDOWN: 38,
        ETIMEDOUT: 73,
        EHOSTDOWN: 142,
        EHOSTUNREACH: 23,
        EINPROGRESS: 26,
        EALREADY: 7,
        EDESTADDRREQ: 17,
        EMSGSIZE: 35,
        EPROTONOSUPPORT: 66,
        ESOCKTNOSUPPORT: 137,
        EADDRNOTAVAIL: 4,
        ENETRESET: 39,
        EISCONN: 30,
        ENOTCONN: 53,
        ETOOMANYREFS: 141,
        EUSERS: 136,
        EDQUOT: 19,
        ESTALE: 72,
        ENOTSUP: 138,
        ENOMEDIUM: 148,
        EILSEQ: 25,
        EOVERFLOW: 61,
        ECANCELED: 11,
        ENOTRECOVERABLE: 56,
        EOWNERDEAD: 62,
        ESTRPIPE: 135,
      }; function db(a, b) { const c = Array(va(a) + 1); a = ua(a, c, 0, c.length); b && (c.length = a); return c; }
      const Tb = {
        n(a, b, c, e) { A(`Assertion failed: ${C(a)}, at: ${[b ? C(b) : 'unknown filename', c, e ? C(e) : 'unknown function']}`); },
        a(a) { return xa(a + 24) + 24; },
        o(a) { a = new N(a); a.Tc() || (a.Nb(!0), Sa--); a.Ob(!1); Ra.push(a); a.Oc(); return a.Wc(); },
        q() { X(0); const a = Ra.pop(); if (a.Uc() && !a.fc()) { const b = a.Gc(); b && L(b)(a.eb); Ua(a.eb); }M = 0; },
        d() {
          const a = M; if (!a) { return z = 0; } const b = new N(a); b.Ya(a); const c = b.Ia(); if (!c) { return z = 0, a; } for (let e = Array.prototype.slice.call(arguments), f = 0; f < e.length; f++) {
            const g
= e[f]; if (g === 0 || g === c) { break; } if (wb(g, c, b.ta + 16)) { return z = g, a; }
          }z = c; return a;
        },
        j() {
          const a = M; if (!a) { return z = 0; } const b = new N(a); b.Ya(a); const c = b.Ia(); if (!c) { return z = 0, a; } for (let e = Array.prototype.slice.call(arguments), f = 0; f < e.length; f++) {
            const g = e[f]; if (g === 0 || g === c) { break; } if (wb(g, c, b.ta + 16)) { return z = g, a; }
          }z = c; return a;
        },
        O() {
          const a = M; if (!a) { return z = 0; } const b = new N(a); b.Ya(a); const c = b.Ia(); if (!c) { return z = 0, a; } for (let e = Array.prototype.slice.call(arguments), f = 0; f < e.length; f++) {
            const g = e[f]; if (g === 0 || g === c) { break; }
            if (wb(g, c, b.ta + 16)) { return z = g, a; }
          }z = c; return a;
        },
        y: Ua,
        D() { const a = Ra.pop(); a || A('no exception to throw'); const b = a.eb; a.fc() || (Ra.push(a), a.Ob(!0), a.Nb(!1), Sa++); M = b; throw b; },
        b(a, b, c) { (new N(a)).Ma(b, c); M = a; Sa++; throw a; },
        R() { return Sa; },
        g(a) { M || (M = a); throw a; },
        F(a, b, c) {
          kb = c; try {
            const e = lb(a); switch (b) {
              case 0:var f = W(); return f < 0 ? -28 : S.Wb(e, f).fd; case 1:case 2:return 0; case 3:return e.flags; case 4:return f = W(), e.flags |= f, 0; case 5:return f = W(), Ba[f + 0 >> 1] = 2, 0; case 6:case 7:return 0;
              case 16:case 8:return -28; case 9:return E[xb() >> 2] = 28, -1; default:return -28;
            }
          }
          catch (g) {
            if (typeof S == 'undefined' || !(g instanceof S.na)) { throw g; } return -g.ya;
          }
        },
        _(a, b, c) {
          kb = c; try {
            const e = lb(a); switch (b) {
              case 21509:case 21505:return e.tty ? 0 : -59; case 21510:case 21511:case 21512:case 21506:case 21507:case 21508:return e.tty ? 0 : -59; case 21519:if (!e.tty) { return -59; } var f = W(); return E[f >> 2] = 0; case 21520:return e.tty ? -28 : -59; case 21531:return f = W(), S.Db(e, b, f); case 21523:return e.tty ? 0 : -59; case 21524:return e.tty
                ? 0
                : -59; default:A(`bad ioctl syscall ${b}`);
            }
          }
          catch (g) {
            if (typeof S == 'undefined' || !(g instanceof S.na)) { throw g; } return -g.ya;
          }
        },
        $(a, b, c, e) {
          kb = e; try { b = C(b); b = jb(a, b); const f = e ? W() : 0; return S.open(b, c, f).fd; }
          catch (g) {
            if (typeof S == 'undefined' || !(g instanceof S.na)) { throw g; } return -g.ya;
          }
        },
        U(a, b, c, e) {
          try { return b = C(b), e = C(e), b = jb(a, b), e = jb(c, e), S.rename(b, e), 0; }
          catch (f) {
            if (typeof S == 'undefined' || !(f instanceof S.na)) { throw f; } return -f.ya;
          }
        },
        T(a, b) {
          try {
            a = C(a); a: {
              const c = S.stat; try { var e = c(a); }
              catch (g) {
                if (g
&& g.node && O(a) !== O(S.La(g.node))) { var f = -54; break a; } throw g;
              }E[b >> 2] = e.dev; E[b + 4 >> 2] = 0; E[b + 8 >> 2] = e.ino; E[b + 12 >> 2] = e.mode; E[b + 16 >> 2] = e.nlink; E[b + 20 >> 2] = e.uid; E[b + 24 >> 2] = e.gid; E[b + 28 >> 2] = e.rdev; E[b + 32 >> 2] = 0; Ca[b + 40 >> 3] = BigInt(e.size); E[b + 48 >> 2] = 4096; E[b + 52 >> 2] = e.blocks; E[b + 56 >> 2] = e.atime.getTime() / 1e3 | 0; E[b + 60 >> 2] = 0; E[b + 64 >> 2] = e.mtime.getTime() / 1e3 | 0; E[b + 68 >> 2] = 0; E[b + 72 >> 2] = e.ctime.getTime() / 1e3 | 0; E[b + 76 >> 2] = 0; Ca[b + 80 >> 3] = BigInt(e.ino); f = 0;
            } return f;
          }
          catch (g) {
            if (typeof S == 'undefined' || !(g instanceof S.na)) { throw g; }
            return -g.ya;
          }
        },
        S(a, b, c) {
          try { return b = C(b), b = jb(a, b), c === 0 ? S.unlink(b) : c === 512 ? S.rmdir(b) : A('Invalid flags passed to unlinkat'), 0; }
          catch (e) {
            if (typeof S == 'undefined' || !(e instanceof S.na)) { throw e; } return -e.ya;
          }
        },
        G() { return Date.now(); },
        P() { throw Number.POSITIVE_INFINITY; },
        H(a, b) {
          a = new Date(1e3 * E[a >> 2]); E[b >> 2] = a.getSeconds(); E[b + 4 >> 2] = a.getMinutes(); E[b + 8 >> 2] = a.getHours(); E[b + 12 >> 2] = a.getDate(); E[b + 16 >> 2] = a.getMonth(); E[b + 20 >> 2] = a.getFullYear() - 1900; E[b + 24 >> 2] = a.getDay(); let c = new Date(a.getFullYear(),
            0, 1); E[b + 28 >> 2] = (a.getTime() - c.getTime()) / 864e5 | 0; E[b + 36 >> 2] = -(60 * a.getTimezoneOffset()); const e = (new Date(a.getFullYear(), 6, 1)).getTimezoneOffset(); c = c.getTimezoneOffset(); E[b + 32 >> 2] = (e != c && a.getTimezoneOffset() == Math.min(c, e)) | 0;
        },
        I: nb,
        z() { A(''); },
        A(a) {
          const b = ta.length; a >>>= 0; if (a > 2147483648) { return !1; } for (let c = 1; c <= 4; c *= 2) {
            let e = b * (1 + 0.2 / c); e = Math.min(e, a + 100663296); let f = Math; e = Math.max(a, e); f = f.min.call(f, 2147483648, e + (65536 - e % 65536) % 65536); a: {
              try {
                pa.grow(f - Aa.byteLength + 65535 >>> 16);
                Da(); var g = 1; break a;
              }
              catch (k) {}g = void 0;
            } if (g) { return !0; }
          } return !1;
        },
        W(a, b) { let c = 0; pb().forEach((e, f) => { let g = b + c; f = E[a + 4 * f >> 2] = g; for (g = 0; g < e.length; ++g) { D[f++ >> 0] = e.charCodeAt(g); }D[f >> 0] = 0; c += e.length + 1; }); return 0; },
        X(a, b) { const c = pb(); E[a >> 2] = c.length; let e = 0; c.forEach((f) => { e += f.length + 1; }); E[b >> 2] = e; return 0; },
        v(a) { ra = a; yb(a); },
        E(a) {
          try { const b = lb(a); S.close(b); return 0; }
          catch (c) {
            if (typeof S == 'undefined' || !(c instanceof S.na)) { throw c; } return c.ya;
          }
        },
        Z(a,
          b, c, e) {
          try {
            a: {
              const f = lb(a); a = b; for (let g = b = 0; g < c; g++) {
                const k = G[a >> 2]; const l = G[a + 4 >> 2]; a += 8; const p = S.read(f, D, k, l, void 0); if (p < 0) { var n = -1; break a; }b += p; if (p < l) { break; }
              }n = b;
            }E[e >> 2] = n; return 0;
          }
          catch (r) {
            if (typeof S == 'undefined' || !(r instanceof S.na)) { throw r; } return r.ya;
          }
        },
        V(a, b, c, e) {
          try {
            const f = Number(b & BigInt(4294967295)) | 0; const g = Number(b >> BigInt(32)) | 0; const k = lb(a); a = 4294967296 * g + (f >>> 0); if (a <= -9007199254740992 || a >= 9007199254740992) { return 61; } S.Aa(k, a, c); Ca[e >> 3] = BigInt(k.position); k.zb && a === 0 && c === 0 && (k.zb = null);
            return 0;
          }
          catch (l) {
            if (typeof S == 'undefined' || !(l instanceof S.na)) { throw l; } return l.ya;
          }
        },
        Y(a, b, c, e) {
          try { a: { const f = lb(a); a = b; for (let g = b = 0; g < c; g++) { const k = G[a >> 2]; const l = G[a + 4 >> 2]; a += 8; const p = S.write(f, D, k, l, void 0); if (p < 0) { var n = -1; break a; }b += p; }n = b; }E[e >> 2] = n; return 0; }
          catch (r) {
            if (typeof S == 'undefined' || !(r instanceof S.na)) { throw r; } return r.ya;
          }
        },
        c() { return z; },
        J: zb,
        e: Bb,
        f: Cb,
        p: Db,
        L: Eb,
        N: Fb,
        s: Gb,
        B: Hb,
        x: Ib,
        M: Jb,
        K: Kb,
        k: Lb,
        i: Mb,
        h: Nb,
        r: Ob,
        m: Pb,
        t: Qb,
        u: Rb,
        w: Sb,
        C(a) { return a; },
        l(a) {
          z
= a;
        },
        Q(a, b, c, e) { return ub(a, b, c, e); },
      };
      (function () {
        function a(f) { d.asm = f.exports; pa = d.asm.aa; Da(); Ea = d.asm.ga; Ga.unshift(d.asm.ba); La(); } function b(f) { a(f.instance); } function c(f) { return Pa().then((g) => { return WebAssembly.instantiate(g, e); }).then((g) => { return g; }).then(f, (g) => { v(`failed to asynchronously prepare wasm: ${g}`); A(g); }); } var e = { a: Tb }; H++; if (d.instantiateWasm) {
          try { return d.instantiateWasm(e, a); }
          catch (f) { return v(`Module.instantiateWasm callback failed with error: ${f}`), !1; }
        }(function () {
          return typeof WebAssembly.instantiateStreaming != 'function'
|| Ma() || K.startsWith('file://') || typeof fetch != 'function'
            ? c(b)
            : fetch(K, { credentials: 'same-origin' }).then((f) => { return WebAssembly.instantiateStreaming(f, e).then(b, (g) => { v(`wasm streaming compile failed: ${g}`); v('falling back to ArrayBuffer instantiation'); return c(b); }); });
        })().catch(ba); return {};
      })(); d.___wasm_call_ctors = function () { return (d.___wasm_call_ctors = d.asm.ba).apply(null, arguments); };
      var xb = d.___errno_location = function () { return (xb = d.___errno_location = d.asm.ca).apply(null, arguments); }; var xa = d._malloc = function () { return (xa = d._malloc = d.asm.da).apply(null, arguments); }; d._main = function () { return (d._main = d.asm.ea).apply(null, arguments); };
      var Va = d._free = function () { return (Va = d._free = d.asm.fa).apply(null, arguments); }; var X = d._setThrew = function () { return (X = d._setThrew = d.asm.ha).apply(null, arguments); }; var Y = d.stackSave = function () { return (Y = d.stackSave = d.asm.ia).apply(null, arguments); }; var Z = d.stackRestore = function () { return (Z = d.stackRestore = d.asm.ja).apply(null, arguments); }; var za = d.stackAlloc = function () { return (za = d.stackAlloc = d.asm.ka).apply(null, arguments); }; var wb = d.___cxa_can_catch = function () { return (wb = d.___cxa_can_catch = d.asm.la).apply(null, arguments); }; var Ta
= d.___cxa_is_pointer_type = function () { return (Ta = d.___cxa_is_pointer_type = d.asm.ma).apply(null, arguments); }; function Mb(a, b) {
        const c = Y(); try { L(a)(b); }
        catch (e) {
          Z(c); if (e !== e + 0) { throw e; } X(1, 0);
        }
      } function Bb(a, b) {
        const c = Y(); try { return L(a)(b); }
        catch (e) {
          Z(c); if (e !== e + 0) { throw e; } X(1, 0);
        }
      } function Cb(a, b, c) {
        const e = Y(); try { return L(a)(b, c); }
        catch (f) {
          Z(e); if (f !== f + 0) { throw f; } X(1, 0);
        }
      } function Ob(a, b, c, e) {
        const f = Y(); try { L(a)(b, c, e); }
        catch (g) {
          Z(f); if (g !== g + 0) { throw g; } X(1, 0);
        }
      }
      function Nb(a, b, c) {
        const e = Y(); try { L(a)(b, c); }
        catch (f) {
          Z(e); if (f !== f + 0) { throw f; } X(1, 0);
        }
      } function Lb(a) {
        const b = Y(); try { L(a)(); }
        catch (c) {
          Z(b); if (c !== c + 0) { throw c; } X(1, 0);
        }
      } function Gb(a, b, c, e, f, g, k) {
        const l = Y(); try { return L(a)(b, c, e, f, g, k); }
        catch (p) {
          Z(l); if (p !== p + 0) { throw p; } X(1, 0);
        }
      } function Db(a, b, c, e) {
        const f = Y(); try { return L(a)(b, c, e); }
        catch (g) {
          Z(f); if (g !== g + 0) { throw g; } X(1, 0);
        }
      } function Fb(a, b, c, e, f, g) {
        const k = Y(); try { return L(a)(b, c, e, f, g); }
        catch (l) {
          Z(k); if (l !== l + 0) { throw l; } X(1, 0);
        }
      }
      function Jb(a, b, c, e, f, g) {
        const k = Y(); try { return L(a)(b, c, e, f, g); }
        catch (l) {
          Z(k); if (l !== l + 0) { throw l; } X(1, 0);
        }
      } function Eb(a, b, c, e, f, g) {
        const k = Y(); try { return L(a)(b, c, e, f, g); }
        catch (l) {
          Z(k); if (l !== l + 0) { throw l; } X(1, 0);
        }
      } function Kb(a, b, c, e) {
        const f = Y(); try { return L(a)(b, c, e); }
        catch (g) {
          Z(f); if (g !== g + 0) { throw g; } X(1, 0);
        }
      } function Hb(a, b, c, e, f, g, k, l) {
        const p = Y(); try { return L(a)(b, c, e, f, g, k, l); }
        catch (n) {
          Z(p); if (n !== n + 0) { throw n; } X(1, 0);
        }
      }
      function Pb(a, b, c, e, f) {
        const g = Y(); try { L(a)(b, c, e, f); }
        catch (k) {
          Z(g); if (k !== k + 0) { throw k; } X(1, 0);
        }
      } function Qb(a, b, c, e, f, g, k, l) {
        const p = Y(); try { L(a)(b, c, e, f, g, k, l); }
        catch (n) {
          Z(p); if (n !== n + 0) { throw n; } X(1, 0);
        }
      } function Ib(a, b, c, e, f, g, k, l, p, n, r, w) {
        const y = Y(); try { return L(a)(b, c, e, f, g, k, l, p, n, r, w); }
        catch (h) {
          Z(y); if (h !== h + 0) { throw h; } X(1, 0);
        }
      } function Rb(a, b, c, e, f, g, k, l, p, n, r) {
        const w = Y(); try { L(a)(b, c, e, f, g, k, l, p, n, r); }
        catch (y) {
          Z(w); if (y !== y + 0) { throw y; } X(1, 0);
        }
      }
      function Sb(a, b, c, e, f, g, k, l, p, n, r, w, y, h, u, x) {
        const F = Y(); try { L(a)(b, c, e, f, g, k, l, p, n, r, w, y, h, u, x); }
        catch (I) {
          Z(F); if (I !== I + 0) { throw I; } X(1, 0);
        }
      } function zb(a) {
        const b = Y(); try { return L(a)(); }
        catch (c) {
          Z(b); if (c !== c + 0) { throw c; } X(1, 0);
        }
      }d.callMain = Ub; d.ENV = ob; d.FS = S; d.NODEFS = U; d.WORKERFS = V; let Vb; function na(a) { this.name = 'ExitStatus'; this.message = `Program terminated with exit(${a})`; this.status = a; }Ka = function Wb() { Vb || Xb(); Vb || (Ka = Wb); };
      function Ub(a) {
        const b = d._main; a = a || []; const c = a.length + 1; const e = za(4 * (c + 1)); E[e >> 2] = ya(ea); for (let f = 1; f < c; f++) { E[(e >> 2) + f] = ya(a[f - 1]); }E[(e >> 2) + c] = 0; try { const g = b(c, e); ra = g; yb(g); return g; }
        catch (l) {
          if (l instanceof na || l == 'unwind') { var k = ra; }
          else { fa(1, l), k = void 0; } return k;
        }
        finally {}
      }
      function Xb(a) {
        a = a || da; if (!(H > 0)) {
          if (d.preRun) { for (typeof d.preRun == 'function' && (d.preRun = [d.preRun]); d.preRun.length;) { const b = d.preRun.shift(); Fa.unshift(b); } }Qa(Fa); H > 0 || Vb || (Vb = !0, d.calledRun = !0, qa || (d.noFSInit || S.Ma.Cb || S.Ma(), S.Bb = !1, Qa(Ga), Qa(Ha), aa(d), Yb && Ub(a), Qa(Ia)));
        }
      }d.run = Xb; function yb(a) { ra = a; noExitRuntime || (qa = !0); fa(a, new na(a)); } var Yb = !0; d.noInitialRun && (Yb = !1); Xb();
      Object.assign(S, { init: S.Ma, mkdir: S.mkdir, mount: S.ra, chdir: S.chdir, writeFile: S.writeFile, readFile: S.readFile, createLazyFile: S.yc, setIgnorePermissions(a) { S.Bb = a; } });

      return Module.ready;
    }
  );
})();
export default Module;
