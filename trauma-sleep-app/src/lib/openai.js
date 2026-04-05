import OpenAI from 'openai';
import { durationToMaxTokens } from './prompts';
import { splitTextForSpeech } from './audioChunks';

export const MODEL_TEXT = 'gpt-4o-mini';
export const MODEL_AUDIO = 'gpt-audio-mini';
export const MODEL_IMAGE = 'gpt-image-1-mini';

export const TEXT_MODEL_OPTIONS = [
  { id: 'gpt-4o-mini',  label: 'gpt-4o-mini — rapido, economico (recomendado)' },
  { id: 'gpt-4o',       label: 'gpt-4o — mayor calidad de guion' },
];

export const AUDIO_MODEL_OPTIONS = [
  { id: 'gpt-audio-mini',  label: 'gpt-audio-mini — economico, rapido (recomendado)' },
  { id: 'gpt-audio',       label: 'gpt-audio — mejor calidad de voz' },
  { id: 'gpt-audio-1.5',   label: 'gpt-audio-1.5 — mejor voz disponible' },
  { id: 'gpt-4o-audio-preview',      label: 'gpt-4o-audio-preview — GPT-4o con audio' },
  { id: 'gpt-4o-mini-audio-preview', label: 'gpt-4o-mini-audio-preview — GPT-4o mini con audio' },
];

export const IMAGE_MODEL_OPTIONS = [
  { id: 'gpt-image-1-mini', label: 'gpt-image-1-mini — economico, rapido (recomendado)' },
  { id: 'gpt-image-1',      label: 'gpt-image-1 — mejor calidad' },
  { id: 'gpt-image-1.5',    label: 'gpt-image-1.5 — estado del arte' },
];

const AVAILABLE_VOICES = ['nova', 'shimmer', 'coral', 'sage', 'alloy', 'echo', 'fable', 'onyx', 'ash', 'ballad', 'verse', 'marin', 'cedar'];

export { AVAILABLE_VOICES };

function createClient(apiKey) {
  return new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
}

const AUDIO_SYSTEM =
  'Leé el siguiente texto en voz alta. Usá vos. Ritmo pausado, íntimo, terapéutico. No agregues nada. No resumas.';

async function synthesizeOneChunk({ apiKey, text, voice, model = MODEL_AUDIO }) {
  const client = createClient(apiKey);

  const response = await client.chat.completions.create({
    model,
    modalities: ['text', 'audio'],
    audio: { voice, format: 'mp3' },
    messages: [
      { role: 'system', content: AUDIO_SYSTEM },
      { role: 'user', content: text },
    ],
  });

  const audioData = response.choices[0].message.audio?.data;
  if (!audioData) throw new Error('La API no devolvió datos de audio.');

  const binary = atob(audioData);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export async function generateText({ apiKey, systemPrompt, userPrompt, maxTokens = 400, model = MODEL_TEXT }) {
  const client = createClient(apiKey);

  const response = await client.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.7,
    max_tokens: maxTokens,
  });

  return {
    text: response.choices[0].message.content.trim(),
    usage: response.usage,
  };
}

export async function generateAudio({ apiKey, text, voice = 'nova', audioModel = MODEL_AUDIO, onChunk }) {
  const chunks = splitTextForSpeech(text);
  if (chunks.length === 0) throw new Error('El texto está vacío.');

  const arrays = [];
  for (let i = 0; i < chunks.length; i++) {
    onChunk?.(i + 1, chunks.length);
    const bytes = await synthesizeOneChunk({ apiKey, text: chunks[i], voice, model: audioModel });
    arrays.push(bytes);
  }

  const totalLen = arrays.reduce((sum, u) => sum + u.length, 0);
  const merged = new Uint8Array(totalLen);
  let offset = 0;
  for (const u of arrays) {
    merged.set(u, offset);
    offset += u.length;
  }

  const blob = new Blob([merged], { type: 'audio/mpeg' });

  let audioB64 = '';
  try {
    let binary = '';
    merged.forEach((b) => { binary += String.fromCharCode(b); });
    audioB64 = btoa(binary);
  } catch {
    audioB64 = '';
  }

  return { blob, url: URL.createObjectURL(blob), audioB64, chunkCount: chunks.length };
}

export async function generateFull({ apiKey, header, params, context, onProgress }) {
  onProgress?.('text');
  const systemPrompt = header.systemPrompt(params);
  const userPrompt = header.userPrompt(context);
  const maxTokens = durationToMaxTokens(params.duration ?? 2);
  const { text, usage } = await generateText({
    apiKey,
    systemPrompt,
    userPrompt,
    maxTokens,
    model: params.textModel || MODEL_TEXT,
  });

  const { blob, url, chunkCount } = await generateAudio({
    apiKey,
    text,
    voice: params.voice || 'nova',
    audioModel: params.audioModel || MODEL_AUDIO,
    onChunk: (current, total) => onProgress?.('audio', { current, total }),
  });

  return { text, blob, url, usage, chunkCount };
}

export async function generateVoicePreview({ apiKey, voice, audioModel = MODEL_AUDIO }) {
  const { url } = await generateAudio({
    apiKey,
    text: `Hola, soy ${voice}. Estoy acá con vos.`,
    voice,
    audioModel,
  });
  return url;
}

export async function generateImage({ apiKey, header, context, imageModel = MODEL_IMAGE }) {
  const client = createClient(apiKey);

  const contextLine = context?.trim()
    ? `Contexto personal del usuario: "${context.trim()}".`
    : '';

  const prompt = `Ilustración terapéutica, estilo onírico suave y sereno, paleta de colores fríos y cálidos en armonía. 
Tema: "${header.label}" — ${header.description ?? header.label}. 
${contextLine}
Sin texto, sin palabras, sin letras en la imagen. Atmósfera de calma, seguridad y sanación interior.`.trim();

  const result = await client.images.generate({
    model: imageModel,
    prompt,
    size: '1024x1024',
    quality: 'medium',
    n: 1,
  });

  const b64 = result.data[0].b64_json;
  if (!b64) throw new Error('La API no devolvió imagen.');
  return `data:image/png;base64,${b64}`;
}

export async function validateApiKey(apiKey) {
  try {
    const client = createClient(apiKey);
    await client.models.list();
    return { valid: true };
  } catch (e) {
    return { valid: false, error: e.message };
  }
}
