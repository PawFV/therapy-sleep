const DEFAULT_MAX = 280;

function splitSentences(s) {
  const out = [];
  let start = 0;
  const re = /[.!?]+\s+/g;
  let m;
  while ((m = re.exec(s)) !== null) {
    const piece = s.slice(start, m.index + m[0].length).trim();
    if (piece) out.push(piece);
    start = m.index + m[0].length;
  }
  const tail = s.slice(start).trim();
  if (tail) out.push(tail);
  return out.length ? out : [s.trim()].filter(Boolean);
}

function pushHardSlices(text, maxChars, parts) {
  let i = 0;
  while (i < text.length) {
    let end = Math.min(i + maxChars, text.length);
    if (end < text.length) {
      const space = text.lastIndexOf(' ', end);
      if (space > i + maxChars * 0.5) end = space;
    }
    const slice = text.slice(i, end).trim();
    if (slice) parts.push(slice);
    i = end;
  }
}

export function splitTextForSpeech(text, maxChars = DEFAULT_MAX) {
  const normalized = text.replace(/\r\n/g, '\n').trim();
  if (!normalized) return [];

  const parts = [];
  const paragraphs = normalized.split(/\n\n+/);

  for (const para of paragraphs) {
    const trimmed = para.trim().replace(/\n/g, ' ');
    if (!trimmed) continue;

    if (trimmed.length <= maxChars) {
      parts.push(trimmed);
      continue;
    }

    const sentences = splitSentences(trimmed);
    let buf = '';

    function flush() {
      const t = buf.trim();
      if (t) parts.push(t);
      buf = '';
    }

    for (const sentence of sentences) {
      if (sentence.length > maxChars) {
        flush();
        pushHardSlices(sentence, maxChars, parts);
        continue;
      }

      const next = buf ? `${buf} ${sentence}` : sentence;
      if (next.length <= maxChars) {
        buf = next;
      } else {
        flush();
        buf = sentence;
      }
    }
    flush();
  }

  return parts.filter(Boolean);
}
