export const LANGS = ['en', 'es'];

const translations = {
  en: {
    // App header
    tagline: 'AI-generated therapeutic audio to help you stay grounded when your nervous system is maxed out.',

    // Tabs
    tabGenerate: 'Create',
    tabLibrary: 'Library',

    // API Key
    apiKeyLabel: 'Get OpenAI API key',
    apiKeySave: 'Save',
    apiKeyChange: 'Change',
    apiKeyVerifying: 'Verifying...',
    apiKeyActive: 'Key active (this session only; it does not leave your browser).',
    apiKeyHint: 'Requests go straight from your browser to OpenAI.',
    apiKeyError: 'Invalid API key or no access. Check that it is correct.',
    apiKeyRequired: 'Enter your OpenAI API key to get started.',

    // Models
    modelsTitle: 'Models',
    modelScript: 'Script (text)',
    modelVoice: 'Voice (audio)',
    modelImage: 'Image',
    modelReset: 'Reset',

    // Model option labels
    'model.gpt-4o-mini': 'gpt-4o-mini — fast, economical (recommended)',
    'model.gpt-4o': 'gpt-4o — higher script quality',
    'model.gpt-audio-mini': 'gpt-audio-mini — economical, fast (recommended)',
    'model.gpt-audio': 'gpt-audio — better voice quality',
    'model.gpt-audio-1.5': 'gpt-audio-1.5 — best available voice',
    'model.gpt-4o-audio-preview': 'gpt-4o-audio-preview — GPT-4o with audio',
    'model.gpt-4o-mini-audio-preview': 'gpt-4o-mini-audio-preview — GPT-4o mini with audio',
    'model.gpt-image-1-mini': 'gpt-image-1-mini — economical, fast (recommended)',
    'model.gpt-image-1': 'gpt-image-1 — higher quality',
    'model.gpt-image-1.5': 'gpt-image-1.5 — state of the art',

    // Header selector
    headerQuestion: 'What do you need right now',

    // Header labels & descriptions
    'header.ancla_nocturna.label': 'Night anchor',
    'header.ancla_nocturna.description': 'For going to bed with an activated nervous system',
    'header.anti_gaslighting.label': 'Anti-gaslighting',
    'header.anti_gaslighting.description': 'Identity and self-worth reconstruction',
    'header.arrancar_funcionar.label': 'Get moving',
    'header.arrancar_funcionar.description': 'For studying or working from a broken state',
    'header.terror_nocturno.label': 'Night terror',
    'header.terror_nocturno.description': 'For waking up with intrusive images or panic',
    'header.viaje_mental.label': 'Mental journey',
    'header.viaje_mental.description': 'Sleep induction through immersive narrative',
    'header.calmar_depresion.label': 'Ease depression',
    'header.calmar_depresion.description': 'Deep emotional containment',
    'header.induccion_sueno.label': 'Sleep induction',
    'header.induccion_sueno.description': 'Progressive relaxation and breathing',
    'header.reconstruccion_autoestima.label': 'Rebuild self-worth',
    'header.reconstruccion_autoestima.description': 'Affirmations built from the real wound',

    // Parameter sliders
    audioLength: 'Audio length',
    wordsHint: (w) => `~${w} words (Spanish script)`,
    voiceLabel: 'Voice',
    voicePreviewHint: '— press ▶ to preview',
    toneLabel: 'Tone',
    contextLabel: 'Personal context',
    contextOptional: '(optional, in Spanish)',
    contextPlaceholder: 'e.g. I\'m going through an aggressive work situation, I\'ve had insomnia for weeks…',
    sliderWarmth: 'Warmth',
    sliderWarmthLeft: 'Neutral',
    sliderWarmthRight: 'Very warm',
    sliderCloseness: 'Closeness',
    sliderClosenessLeft: 'Professional',
    sliderClosenessRight: 'Intimate',
    sliderPace: 'Pace',
    sliderPaceLeft: 'Very slow',
    sliderPaceRight: 'Flowing',
    voiceStop: 'Stop',
    voiceLoading: 'Loading...',
    voiceListen: 'Listen',

    // Generate button
    generating: 'Generating...',
    generateScript: 'Generating script...',
    synthesizingAudio: 'Synthesizing audio...',
    generateBtn: (label) => `Generate — ${label}`,

    // Result
    resultSaved: 'Done. Saved to your library.',
    tokensIn: 'in',
    tokensOut: 'out',
    tokensTotal: 'total',
    addToPlaylist: 'Add to playlist',
    inPlaylist: 'In playlist',

    // Audio player
    showTranscript: 'Show transcript',
    hideTranscript: 'Hide transcript',
    download: 'Download',
    audioUnavailable: 'Audio unavailable this session. Download before closing the browser to keep a copy.',

    // Library
    libraryEmpty: 'Generated audio appears here. It is stored in your browser.',
    savedTracks: (n) => `${n} saved track${n !== 1 ? 's' : ''}`,
    clearAll: 'Clear all',
    deleteTrack: 'Delete this track',
    addToPlaylistIcon: 'Add to playlist',
    removeFromPlaylistIcon: 'Remove from playlist',

    // Playlist player
    playlistTitle: 'Playlist',
    downloadAll: 'Download all',
    downloadTrack: 'Download this track',
    loopOn: 'Loop on',
    loopOff: 'Loop off',
    removeFromPlaylist: 'Remove from playlist',
    tracks: (n) => `${n} track${n !== 1 ? 's' : ''}`,

    // Floating playlist button
    playlistBtn: 'Playlist',

    // Lightbox
    downloadImage: 'Download',
    lightboxAlt: 'Therapeutic visualization',

    // Footer
    footer: 'Audio files are stored locally in your browser. Your API key never leaves this device.',
  },

  es: {
    tagline: 'Audio terapéutico generado con IA para mantenerte en equilibrio cuando tu sistema nervioso está al límite.',

    tabGenerate: 'Crear',
    tabLibrary: 'Biblioteca',

    apiKeyLabel: 'Obtener API key de OpenAI',
    apiKeySave: 'Guardar',
    apiKeyChange: 'Cambiar',
    apiKeyVerifying: 'Verificando...',
    apiKeyActive: 'Clave activa (solo esta sesión; no sale de tu navegador).',
    apiKeyHint: 'Las solicitudes van directo desde tu navegador a OpenAI.',
    apiKeyError: 'API key inválida o sin acceso. Verificá que sea correcta.',
    apiKeyRequired: 'Ingresá tu API key de OpenAI para empezar.',

    modelsTitle: 'Modelos',
    modelScript: 'Guion (texto)',
    modelVoice: 'Voz (audio)',
    modelImage: 'Imagen',
    modelReset: 'Restablecer',

    'model.gpt-4o-mini': 'gpt-4o-mini — rápido, económico (recomendado)',
    'model.gpt-4o': 'gpt-4o — mayor calidad de guion',
    'model.gpt-audio-mini': 'gpt-audio-mini — económico, rápido (recomendado)',
    'model.gpt-audio': 'gpt-audio — mejor calidad de voz',
    'model.gpt-audio-1.5': 'gpt-audio-1.5 — mejor voz disponible',
    'model.gpt-4o-audio-preview': 'gpt-4o-audio-preview — GPT-4o con audio',
    'model.gpt-4o-mini-audio-preview': 'gpt-4o-mini-audio-preview — GPT-4o mini con audio',
    'model.gpt-image-1-mini': 'gpt-image-1-mini — económico, rápido (recomendado)',
    'model.gpt-image-1': 'gpt-image-1 — mejor calidad',
    'model.gpt-image-1.5': 'gpt-image-1.5 — estado del arte',

    headerQuestion: 'Qué necesitás ahora',

    'header.ancla_nocturna.label': 'Ancla nocturna',
    'header.ancla_nocturna.description': 'Para acostarse con el sistema nervioso activado',
    'header.anti_gaslighting.label': 'Anti-gaslighting',
    'header.anti_gaslighting.description': 'Reconstrucción de identidad y valor propio',
    'header.arrancar_funcionar.label': 'Arrancar a funcionar',
    'header.arrancar_funcionar.description': 'Para estudiar o trabajar desde el quiebre',
    'header.terror_nocturno.label': 'Terror nocturno',
    'header.terror_nocturno.description': 'Para despertarse con imágenes o pánico',
    'header.viaje_mental.label': 'Viaje mental',
    'header.viaje_mental.description': 'Inducción de sueño por narrativa inmersiva',
    'header.calmar_depresion.label': 'Calmar la depresión',
    'header.calmar_depresion.description': 'Contención emocional profunda',
    'header.induccion_sueno.label': 'Inducción de sueño',
    'header.induccion_sueno.description': 'Relajación progresiva y respiración',
    'header.reconstruccion_autoestima.label': 'Reconstrucción de autoestima',
    'header.reconstruccion_autoestima.description': 'Afirmaciones desde la herida real',

    audioLength: 'Duración del audio',
    wordsHint: (w) => `~${w} palabras`,
    voiceLabel: 'Voz',
    voicePreviewHint: '— presioná ▶ para escuchar',
    toneLabel: 'Tono',
    contextLabel: 'Contexto personal',
    contextOptional: '(opcional)',
    contextPlaceholder: 'Ej: estoy pasando por un proceso laboral muy agresivo, tengo insomnio desde hace semanas…',
    sliderWarmth: 'Calidez',
    sliderWarmthLeft: 'Neutra',
    sliderWarmthRight: 'Muy cálida',
    sliderCloseness: 'Cercanía',
    sliderClosenessLeft: 'Profesional',
    sliderClosenessRight: 'Íntima',
    sliderPace: 'Ritmo',
    sliderPaceLeft: 'Muy pausado',
    sliderPaceRight: 'Fluido',
    voiceStop: 'Detener',
    voiceLoading: 'Cargando...',
    voiceListen: 'Escuchar',

    generating: 'Generando...',
    generateScript: 'Generando guion...',
    synthesizingAudio: 'Sintetizando audio...',
    generateBtn: (label) => `Generar — ${label}`,

    resultSaved: 'Listo. Guardado en tu biblioteca.',
    tokensIn: 'entrada',
    tokensOut: 'salida',
    tokensTotal: 'total',
    addToPlaylist: 'Agregar a playlist',
    inPlaylist: 'En playlist',

    showTranscript: 'Ver texto',
    hideTranscript: 'Ocultar texto',
    download: 'Descargar',
    audioUnavailable: 'Audio no disponible en esta sesión. Descargalo antes de cerrar el navegador.',

    libraryEmpty: 'Los audios que generes aparecen acá. Se guardan en tu navegador.',
    savedTracks: (n) => `${n} audio${n !== 1 ? 's' : ''} guardado${n !== 1 ? 's' : ''}`,
    clearAll: 'Borrar todo',
    deleteTrack: 'Eliminar este audio',
    addToPlaylistIcon: 'Agregar a playlist',
    removeFromPlaylistIcon: 'Quitar de playlist',

    playlistTitle: 'Playlist',
    downloadAll: 'Descargar todos',
    downloadTrack: 'Descargar este audio',
    loopOn: 'Loop activado',
    loopOff: 'Loop desactivado',
    removeFromPlaylist: 'Quitar de playlist',
    tracks: (n) => `${n} audio${n !== 1 ? 's' : ''}`,

    playlistBtn: 'Playlist',

    downloadImage: 'Descargar',
    lightboxAlt: 'Visualización terapéutica',

    footer: 'Los audios se guardan localmente en tu navegador. Tu API key nunca sale de este dispositivo.',
  },
};

export function t(lang, key, ...args) {
  const val = translations[lang]?.[key] ?? translations['en'][key] ?? key;
  return typeof val === 'function' ? val(...args) : val;
}
