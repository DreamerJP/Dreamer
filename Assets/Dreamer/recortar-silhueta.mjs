// Converte silhueta preta sobre fundo branco em PNG com canal alpha.
//
//   node Assets/Dreamer/recortar-silhueta.mjs <entrada> [saida] [opcoes]
//
// A entrada pode ser um arquivo .png ou uma pasta (processa todos os .png).
// Se a saida for omitida, grava ao lado com sufixo "-alpha".
//
// Opcoes:
//   --ink #04050a   cor solida do recorte (padrao: a mesma tinta das camadas)
//   --keep          preserva a cor original em vez de chapar em --ink
//   --gamma 1.0     >1 endurece a borda, <1 amacia
//   --invert        para silhueta branca sobre fundo preto
//
// O alpha vem da luminancia, e nao de "remover o branco": isso preserva a
// borda suavizada da imagem gerada, sem serrilhado nem halo claro.
//
// Sem dependencias: usa apenas node:zlib. Aceita PNG de 8 bits nao entrelacado
// nos formatos cinza, cinza+alfa, RGB, RGBA e paleta.

import { readFileSync, writeFileSync, readdirSync, statSync, mkdirSync } from "node:fs";
import { join, dirname, extname, basename } from "node:path";
import { inflateSync, deflateSync } from "node:zlib";

/* ── CRC32, exigido pelo formato dos blocos ── */
const TABLE = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();

function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}

/* ── leitura ── */
const CHANNELS = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 };

function decode(buf) {
  if (buf.length < 8 || buf.readUInt32BE(0) !== 0x89504e47) throw new Error("nao e um PNG");

  let pos = 8, head = null, plte = null, trns = null;
  const idat = [];

  while (pos + 8 <= buf.length) {
    const len = buf.readUInt32BE(pos);
    const type = buf.toString("ascii", pos + 4, pos + 8);
    const data = buf.subarray(pos + 8, pos + 8 + len);
    if (type === "IHDR") {
      head = { w: data.readUInt32BE(0), h: data.readUInt32BE(4), depth: data[8], color: data[9], interlace: data[12] };
    } else if (type === "PLTE") plte = Buffer.from(data);
    else if (type === "tRNS") trns = Buffer.from(data);
    else if (type === "IDAT") idat.push(Buffer.from(data));
    else if (type === "IEND") break;
    pos += 12 + len;
  }

  if (!head) throw new Error("PNG sem cabecalho IHDR");
  if (head.depth !== 8) throw new Error("profundidade " + head.depth + " bits; converta para 8 bits antes");
  if (head.interlace) throw new Error("PNG entrelacado; salve sem entrelacamento");
  if (!(head.color in CHANNELS)) throw new Error("formato de cor " + head.color + " nao suportado");
  if (head.color === 3 && !plte) throw new Error("PNG em paleta sem bloco PLTE");

  const ch = CHANNELS[head.color];
  const stride = head.w * ch;
  const raw = inflateSync(Buffer.concat(idat));
  const px = Buffer.alloc(head.h * stride);

  // desfaz o filtro por linha
  let p = 0;
  for (let y = 0; y < head.h; y++) {
    const kind = raw[p++];
    const line = raw.subarray(p, p + stride);
    p += stride;
    const cur = px.subarray(y * stride, (y + 1) * stride);
    const prev = y ? px.subarray((y - 1) * stride, y * stride) : null;

    for (let x = 0; x < stride; x++) {
      const a = x >= ch ? cur[x - ch] : 0;
      const b = prev ? prev[x] : 0;
      const c = prev && x >= ch ? prev[x - ch] : 0;
      let v = line[x];
      if (kind === 1) v += a;
      else if (kind === 2) v += b;
      else if (kind === 3) v += (a + b) >> 1;
      else if (kind === 4) {
        const pa = Math.abs(b - c), pb = Math.abs(a - c), pc = Math.abs(a + b - 2 * c);
        v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
      } else if (kind !== 0) throw new Error("filtro desconhecido: " + kind);
      cur[x] = v & 0xff;
    }
  }

  // normaliza tudo para RGBA
  const out = Buffer.alloc(head.w * head.h * 4);
  const n = head.w * head.h;
  for (let i = 0; i < n; i++) {
    let r, g, b, a = 255;
    if (head.color === 0) { r = g = b = px[i]; }
    else if (head.color === 4) { r = g = b = px[i * 2]; a = px[i * 2 + 1]; }
    else if (head.color === 2) { r = px[i * 3]; g = px[i * 3 + 1]; b = px[i * 3 + 2]; }
    else if (head.color === 6) { r = px[i * 4]; g = px[i * 4 + 1]; b = px[i * 4 + 2]; a = px[i * 4 + 3]; }
    else { const k = px[i]; r = plte[k * 3]; g = plte[k * 3 + 1]; b = plte[k * 3 + 2]; if (trns && k < trns.length) a = trns[k]; }
    out[i * 4] = r; out[i * 4 + 1] = g; out[i * 4 + 2] = b; out[i * 4 + 3] = a;
  }

  return { w: head.w, h: head.h, px: out };
}

/* ── escrita ── */
function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

function encode(img) {
  const stride = img.w * 4;
  const raw = Buffer.alloc(img.h * (stride + 1));
  for (let y = 0; y < img.h; y++) {
    raw[y * (stride + 1)] = 0;                       // sem filtro
    img.px.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }
  const head = Buffer.alloc(13);
  head.writeUInt32BE(img.w, 0);
  head.writeUInt32BE(img.h, 4);
  head[8] = 8; head[9] = 6; head[10] = 0; head[11] = 0; head[12] = 0;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", head),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0))
  ]);
}

/* ── conversao ── */
function cut(img, opt) {
  const n = img.w * img.h;
  for (let i = 0; i < n; i++) {
    const r = img.px[i * 4], g = img.px[i * 4 + 1], b = img.px[i * 4 + 2];
    const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    let k = opt.invert ? lum : 1 - lum;             // opaco onde e escuro
    if (opt.gamma !== 1) k = Math.pow(k, opt.gamma);
    img.px[i * 4 + 3] = Math.round(k * img.px[i * 4 + 3]);
    if (!opt.keep) {
      img.px[i * 4] = opt.ink[0];
      img.px[i * 4 + 1] = opt.ink[1];
      img.px[i * 4 + 2] = opt.ink[2];
    }
  }
  return img;
}

/* ── linha de comando ── */
function parseInk(s) {
  const m = /^#?([0-9a-f]{6})$/i.exec(s);
  if (!m) throw new Error("cor invalida: " + s);
  const v = parseInt(m[1], 16);
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
}

const args = process.argv.slice(2);
const opt = { ink: parseInk("04050a"), keep: false, gamma: 1, invert: false };
const free = [];

for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === "--keep") opt.keep = true;
  else if (a === "--invert") opt.invert = true;
  else if (a === "--ink") opt.ink = parseInk(args[++i]);
  else if (a === "--gamma") opt.gamma = parseFloat(args[++i]);
  else free.push(a);
}

if (!free.length) {
  console.error("uso: node recortar-silhueta.mjs <entrada.png|pasta> [saida] [--ink #04050a] [--keep] [--gamma 1] [--invert]");
  process.exit(1);
}

const [src, dest] = free;
const isDir = statSync(src).isDirectory();
const files = isDir
  ? readdirSync(src).filter(f => extname(f).toLowerCase() === ".png").map(f => join(src, f))
  : [src];

if (!files.length) { console.error("nenhum .png em " + src); process.exit(1); }
if (dest && isDir) mkdirSync(dest, { recursive: true });

let ok = 0;
for (const file of files) {
  const target = dest
    ? (isDir ? join(dest, basename(file)) : dest)
    : join(dirname(file), basename(file, ".png") + "-alpha.png");
  try {
    const img = decode(readFileSync(file));
    writeFileSync(target, encode(cut(img, opt)));
    console.log(basename(file) + "  " + img.w + "x" + img.h + "  ->  " + target);
    ok++;
  } catch (err) {
    console.error(basename(file) + "  FALHOU: " + err.message);
  }
}
console.log(ok + "/" + files.length + " convertido(s)");
