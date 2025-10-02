// ElevenLabs API configuration
const ELEVENLABS_API_KEY = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY || '';
const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1';

// Voice settings interface
interface VoiceSettings {
  stability: number;
  similarity_boost: number;
  style?: number;
  use_speaker_boost?: boolean;
}

// Premium natural voices - these sound incredibly human-like
const NATURAL_VOICES = {
  // Professional male voices
  'adam': 'pNInz6obpgDQGcFmaJgB', // Adam - Natural American male, professional
  'arnold': 'VR6AewLTigWG4xSOukaG', // Arnold - Deep, authoritative male voice
  'bella': 'EXAVITQu4vr4xnSDxMaL', // Bella - Warm, professional female voice
  'domi': 'AZnzlk1XvdvUeBnXmlld', // Domi - Confident, engaging female voice
  'elli': 'MF3mGyEYCl7XYWbV9V6O', // Elli - Clear, friendly female voice
  'josh': 'TxGEqnHWrfWFTfGW9XjX', // Josh - Natural, conversational male voice
  'rachel': '21m00Tcm4TlvDq8ikWAM', // Rachel - Professional, clear female voice
  'sam': 'yoZ06aMxZJJ28mfd3POQ', // Sam - Natural, warm male voice
  'callum': 'N2lVS1w4EtoT3dr4eOWO', // Callum - British accent, professional
  'freya': 'jsCqWAovK2LkecY7zXl4', // Freya - Professional female voice
  'gigi': 'jBpfuIE2acCO8z3wKNLl', // Gigi - Warm, friendly female voice
  'grace': 'oWAxZDx7w5VEj9dCyTzz', // Grace - Professional, clear female voice
  'lily': 'pFZP5JQG7iQjIQuC4Bku', // Lily - Young, energetic female voice
  'serena': 'pMsXgVXv3BLzUgSXRplM', // Serena - Professional, confident female voice
  'thomas': 'GBv7mTt0atIp3Br8iCZE', // Thomas - Natural, conversational male voice
  'william': 'CYw3kZ02Hs0563khs1Fj', // William - Professional, authoritative male voice
  'ryan': 'wViXBPUzp2ZZixB1xQuM', // Ryan - Natural, friendly male voice
  'nicole': 'piTKgcLEGmPE4e6mEKli', // Nicole - Professional, clear female voice
  'sarah': 'EXAVITQu4vr4xnSDxMaL', // Sarah - Warm, professional female voice
};

// Voice settings for natural speech
const NATURAL_VOICE_SETTINGS: VoiceSettings = {
  stability: 0.5,        // Voice consistency (0.0 - 1.0)
  similarity_boost: 0.8, // Voice similarity to original (0.0 - 1.0)
  style: 0.2,           // Style exaggeration (0.0 - 1.0)
  use_speaker_boost: true // Enhance speaker similarity
};

export class NaturalVoiceService {
  private currentVoice: string = 'adam'; // Default to Adam - professional male voice
  private isPlaying: boolean = false;
  private audioContext: AudioContext | null = null;

  constructor() {
    // Initialize audio context
    if (typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  /**
   * Set the voice for narration
   */
  setVoice(voiceId: string) {
    if (NATURAL_VOICES[voiceId as keyof typeof NATURAL_VOICES]) {
      this.currentVoice = voiceId;
    }
  }

  /**
   * Get available voices
   */
  getAvailableVoices() {
    return Object.keys(NATURAL_VOICES).map(voiceId => ({
      id: voiceId,
      name: voiceId.charAt(0).toUpperCase() + voiceId.slice(1),
      description: this.getVoiceDescription(voiceId)
    }));
  }

  /**
   * Get voice description
   */
  private getVoiceDescription(voiceId: string): string {
    const descriptions: Record<string, string> = {
      'adam': 'Professional American male voice - perfect for business presentations',
      'arnold': 'Deep, authoritative male voice - great for serious content',
      'bella': 'Warm, professional female voice - excellent for friendly narration',
      'domi': 'Confident, engaging female voice - perfect for marketing content',
      'elli': 'Clear, friendly female voice - great for tutorials and guides',
      'josh': 'Natural, conversational male voice - ideal for casual content',
      'rachel': 'Professional, clear female voice - perfect for corporate content',
      'sam': 'Natural, warm male voice - great for storytelling',
      'callum': 'Professional British male voice - sophisticated and clear',
      'freya': 'Professional female voice - confident and articulate',
      'gigi': 'Warm, friendly female voice - perfect for customer service',
      'grace': 'Professional, clear female voice - excellent for presentations',
      'lily': 'Young, energetic female voice - great for dynamic content',
      'serena': 'Professional, confident female voice - ideal for leadership content',
      'thomas': 'Natural, conversational male voice - perfect for podcasts',
      'william': 'Professional, authoritative male voice - great for announcements',
      'ryan': 'Natural, friendly male voice - perfect for customer interactions',
      'nicole': 'Professional, clear female voice - excellent for training',
      'sarah': 'Warm, professional female voice - great for welcoming content'
    };
    return descriptions[voiceId] || 'Natural, human-like voice';
  }

  /**
   * Generate and play natural speech
   */
  async speak(text: string): Promise<void> {
    if (!ELEVENLABS_API_KEY) {
      console.warn('ElevenLabs API key not configured. Falling back to Web Speech API.');
      return this.fallbackToWebSpeech(text);
    }

    try {
      this.isPlaying = true;

      // Get the voice ID
      const voiceId = NATURAL_VOICES[this.currentVoice as keyof typeof NATURAL_VOICES];

      // Generate speech using ElevenLabs REST API
      const response = await fetch(`${ELEVENLABS_API_URL}/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: NATURAL_VOICE_SETTINGS
        })
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status} ${response.statusText}`);
      }

      // Get the audio data
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      // Play the audio
      await this.playAudio(audioUrl);

      // Clean up
      URL.revokeObjectURL(audioUrl);
      
    } catch (error) {
      console.error('ElevenLabs TTS failed:', error);
      // Fallback to Web Speech API
      await this.fallbackToWebSpeech(text);
    } finally {
      this.isPlaying = false;
    }
  }

  /**
   * Play audio from URL
   */
  private async playAudio(audioUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const audio = new Audio(audioUrl);
      
      audio.onloadeddata = () => {
        audio.play().then(() => {
          audio.onended = () => resolve();
          audio.onerror = () => reject(new Error('Audio playback failed'));
        }).catch(reject);
      };
      
      audio.onerror = () => reject(new Error('Audio loading failed'));
    });
  }

  /**
   * Fallback to Web Speech API (for when ElevenLabs is not available)
   */
  private async fallbackToWebSpeech(text: string): Promise<void> {
    if (!('speechSynthesis' in window)) {
      throw new Error('Speech synthesis not supported');
    }

    return new Promise((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Try to find a decent voice
      const voices = speechSynthesis.getVoices();
      const preferredVoices = [
        'Microsoft David Desktop - English (United States)',
        'Microsoft Mark Desktop - English (United States)',
        'Alex',
        'Daniel',
        'Tom'
      ];
      
      for (const preferredVoice of preferredVoices) {
        const voice = voices.find(v => v.name.includes(preferredVoice));
        if (voice) {
          utterance.voice = voice;
          break;
        }
      }
      
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      utterance.onend = () => resolve();
      utterance.onerror = () => reject(new Error('Speech synthesis failed'));
      
      speechSynthesis.speak(utterance);
    });
  }

  /**
   * Stop current speech
   */
  stop(): void {
    this.isPlaying = false;
    
    // Stop ElevenLabs audio
    if (typeof window !== 'undefined') {
      const audioElements = document.querySelectorAll('audio');
      audioElements.forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
      });
    }
    
    // Stop Web Speech API
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
  }

  /**
   * Check if currently playing
   */
  isCurrentlyPlaying(): boolean {
    return this.isPlaying;
  }

  /**
   * Get current voice
   */
  getCurrentVoice(): string {
    return this.currentVoice;
  }
}

// Export singleton instance
export const naturalVoice = new NaturalVoiceService();
