// Premium Voice Service with multiple TTS providers
const AMAZON_POLLY_API_KEY = process.env.NEXT_PUBLIC_AMAZON_POLLY_API_KEY || '';
const AMAZON_POLLY_REGION = process.env.NEXT_PUBLIC_AMAZON_POLLY_REGION || 'us-east-1';

// Premium voice options
const PREMIUM_VOICES = {
  // Amazon Polly Neural Voices (Highest Quality)
  'joanna': 'Joanna (Neural) - Natural American Female',
  'matthew': 'Matthew (Neural) - Natural American Male', 
  'amy': 'Amy (Neural) - Natural American Female',
  'brian': 'Brian (Neural) - Natural British Male',
  'emma': 'Emma (Neural) - Natural British Female',
  'joey': 'Joey (Neural) - Natural American Male',
  'justin': 'Justin (Neural) - Natural American Male',
  'kendra': 'Kendra (Neural) - Natural American Female',
  'kimberly': 'Kimberly (Neural) - Natural American Female',
  'salli': 'Salli (Neural) - Natural American Female',
  
  // Standard voices (Good quality)
  'ivy': 'Ivy (Standard) - American Female',
  'joanna_std': 'Joanna (Standard) - American Female',
  'matthew_std': 'Matthew (Standard) - American Male',
  'amy_std': 'Amy (Standard) - American Female',
  'brian_std': 'Brian (Standard) - British Male',
  'emma_std': 'Emma (Standard) - British Female',
  'joey_std': 'Joey (Standard) - American Male',
  'justin_std': 'Justin (Standard) - American Male',
  'kendra_std': 'Kendra (Standard) - American Female',
  'kimberly_std': 'Kimberly (Standard) - American Female',
  'salli_std': 'Salli (Standard) - American Female'
};

export class PremiumVoiceService {
  private currentVoice: string = 'joanna'; // Default to high-quality neural voice
  private isPlaying: boolean = false;
  private audioContext: AudioContext | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  /**
   * Set the voice for narration (simplified - using default)
   */
  setVoice(voiceId: string) {
    // Simplified - just set the voice
    this.currentVoice = voiceId;
  }

  /**
   * Get available voices
   */
  getAvailableVoices() {
    return Object.keys(PREMIUM_VOICES).map(voiceId => ({
      id: voiceId,
      name: PREMIUM_VOICES[voiceId as keyof typeof PREMIUM_VOICES],
      description: this.getVoiceDescription(voiceId)
    }));
  }

  /**
   * Get voice description
   */
  private getVoiceDescription(voiceId: string): string {
    const descriptions: Record<string, string> = {
      'joanna': 'Premium neural voice - Natural American female, perfect for professional presentations',
      'matthew': 'Premium neural voice - Natural American male, excellent for business content',
      'amy': 'Premium neural voice - Natural American female, great for friendly narration',
      'brian': 'Premium neural voice - Natural British male, sophisticated and clear',
      'emma': 'Premium neural voice - Natural British female, articulate and professional',
      'joey': 'Premium neural voice - Natural American male, perfect for casual content',
      'justin': 'Premium neural voice - Natural American male, ideal for technical content',
      'kendra': 'Premium neural voice - Natural American female, warm and engaging',
      'kimberly': 'Premium neural voice - Natural American female, clear and professional',
      'salli': 'Premium neural voice - Natural American female, friendly and approachable',
      'ivy': 'Standard voice - American female, good quality',
      'joanna_std': 'Standard voice - American female, reliable quality',
      'matthew_std': 'Standard voice - American male, professional',
      'amy_std': 'Standard voice - American female, clear',
      'brian_std': 'Standard voice - British male, sophisticated',
      'emma_std': 'Standard voice - British female, articulate',
      'joey_std': 'Standard voice - American male, casual',
      'justin_std': 'Standard voice - American male, technical',
      'kendra_std': 'Standard voice - American female, warm',
      'kimberly_std': 'Standard voice - American female, professional',
      'salli_std': 'Standard voice - American female, friendly'
    };
    return descriptions[voiceId] || 'High-quality voice';
  }

  /**
   * Generate and play natural speech
   */
  async speak(text: string): Promise<void> {
    // Try Amazon Polly first if available
    if (AMAZON_POLLY_API_KEY) {
      try {
        await this.speakWithPolly(text);
        return;
      } catch (error) {
        console.warn('Amazon Polly failed, falling back to enhanced Web Speech API:', error);
      }
    }

    // Fallback to enhanced Web Speech API
    await this.speakWithWebSpeech(text);
  }

  /**
   * Generate speech using Amazon Polly
   */
  private async speakWithPolly(text: string): Promise<void> {
    this.isPlaying = true;

    try {
      const voiceName = this.currentVoice.replace('_std', '');
      const isNeural = !this.currentVoice.includes('_std');
      
      const response = await fetch(`https://polly.${AMAZON_POLLY_REGION}.amazonaws.com/v1/speech`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Amz-Target': 'com.amazon.polly.v1.SynthesizeSpeech',
          'Authorization': `AWS4-HMAC-SHA256 Credential=${AMAZON_POLLY_API_KEY}/${new Date().toISOString().split('T')[0]}/${AMAZON_POLLY_REGION}/polly/aws4_request`
        },
        body: JSON.stringify({
          Text: text,
          OutputFormat: 'mp3',
          VoiceId: voiceName,
          Engine: isNeural ? 'neural' : 'standard',
          TextType: 'text',
          SampleRate: '22050'
        })
      });

      if (!response.ok) {
        throw new Error(`Amazon Polly API error: ${response.status}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      await this.playAudio(audioUrl);
      URL.revokeObjectURL(audioUrl);

    } finally {
      this.isPlaying = false;
    }
  }

  /**
   * Enhanced Web Speech API with better voice selection
   */
  private async speakWithWebSpeech(text: string): Promise<void> {
    if (!('speechSynthesis' in window)) {
      throw new Error('Speech synthesis not supported');
    }

    this.isPlaying = true;

    try {
      return new Promise((resolve, reject) => {
        // Cancel any existing speech
        speechSynthesis.cancel();

        // Wait for voices to load
        const loadVoices = () => {
          return new Promise<void>((voiceResolve) => {
            const voices = speechSynthesis.getVoices();
            if (voices.length > 0) {
              voiceResolve();
            } else {
              speechSynthesis.onvoiceschanged = () => voiceResolve();
            }
          });
        };

        loadVoices().then(() => {
          const voices = speechSynthesis.getVoices();
          console.log('Available voices:', voices.map(v => v.name));

          // Enhanced voice selection - prioritize the most natural voices
          let selectedVoice = null;
          
          // Priority list of the most natural-sounding voices
          const naturalVoices = [
            // Windows 10/11 Neural voices (most natural)
            'Microsoft Aria Desktop - English (United States)',
            'Microsoft Jenny Desktop - English (United States)',
            'Microsoft Guy Desktop - English (United States)',
            'Microsoft Davis Desktop - English (United States)',
            'Microsoft Jane Desktop - English (United States)',
            'Microsoft Jason Desktop - English (United States)',
            'Microsoft Nancy Desktop - English (United States)',
            'Microsoft Tony Desktop - English (United States)',
            
            // Windows 10/11 Standard voices (good quality)
            'Microsoft David Desktop - English (United States)',
            'Microsoft Mark Desktop - English (United States)',
            'Microsoft Susan Desktop - English (United States)',
            'Microsoft Zira Desktop - English (United States)',
            'Microsoft Richard Desktop - English (United States)',
            'Microsoft James Desktop - English (United States)',
            'Microsoft Linda Desktop - English (United States)',
            'Microsoft Hazel Desktop - English (United States)',
            
            // macOS voices (very natural)
            'Alex',
            'Samantha',
            'Victoria',
            'Daniel',
            'Tom',
            'Ralph',
            'Bruce',
            'Fred',
            'Karen',
            'Moira',
            'Tessa',
            'Veena',
            'Fiona',
            'Yuna',
            'Sin-ji',
            'Kyoko',
            'Noriko',
            'Reed',
            'Albert',
            'Bahh',
            'Bells',
            'Boing',
            'Bubbles',
            'Cellos',
            'Deranged',
            'Good News',
            'Hysterical',
            'Pipe Organ',
            'Trinoids',
            'Whisper',
            'Zarvox',
            
            // Chrome/Edge voices
            'Google US English Male',
            'Google US English Female',
            'Google UK English Male',
            'Google UK English Female',
            'Google Australian English Male',
            'Google Australian English Female',
            'Google Canadian English Male',
            'Google Canadian English Female',
            'Google Indian English Male',
            'Google Indian English Female',
            'Google South African English Male',
            'Google South African English Female',
            
            // Other high-quality voices
            'Microsoft Aria Online (Natural) - English (United States)',
            'Microsoft Jenny Online (Natural) - English (United States)',
            'Microsoft Guy Online (Natural) - English (United States)',
            'Microsoft Davis Online (Natural) - English (United States)',
            'Microsoft Jane Online (Natural) - English (United States)',
            'Microsoft Jason Online (Natural) - English (United States)',
            'Microsoft Nancy Online (Natural) - English (United States)',
            'Microsoft Tony Online (Natural) - English (United States)'
          ];

          // Use the priority list for natural voices
          for (const voiceName of naturalVoices) {
            selectedVoice = voices.find(voice => 
              voice.name === voiceName || 
              voice.name.includes(voiceName.split(' - ')[0])
            );
            if (selectedVoice) {
              break;
            }
          }

          // If no premium voice found, try any neural or high-quality voice
          if (!selectedVoice) {
            selectedVoice = voices.find(voice => 
              voice.name.toLowerCase().includes('neural') ||
              voice.name.toLowerCase().includes('natural') ||
              voice.name.toLowerCase().includes('aria') ||
              voice.name.toLowerCase().includes('jenny') ||
              voice.name.toLowerCase().includes('guy') ||
              voice.name.toLowerCase().includes('davis') ||
              voice.name.toLowerCase().includes('jane') ||
              voice.name.toLowerCase().includes('jason') ||
              voice.name.toLowerCase().includes('nancy') ||
              voice.name.toLowerCase().includes('tony')
            );
          }

          // Last resort: any English voice
          if (!selectedVoice) {
            selectedVoice = voices.find(voice => voice.lang.startsWith('en'));
          }

          const utterance = new SpeechSynthesisUtterance(text);
          if (selectedVoice) {
            utterance.voice = selectedVoice;
          }

          // Optimize speech parameters for the most natural sound
          utterance.rate = 0.9;   // Slightly slower for natural pace
          utterance.pitch = 1.05; // Slightly higher pitch for warmth
          utterance.volume = 1.0; // Full volume for clarity

          utterance.onend = () => {
            this.isPlaying = false;
            resolve();
          };
          
          utterance.onerror = (event) => {
            this.isPlaying = false;
            reject(new Error(`Speech synthesis failed: ${event.error}`));
          };

          console.log('Speaking with enhanced Web Speech API:', text);
          speechSynthesis.speak(utterance);
        });
      });
    } catch (error) {
      this.isPlaying = false;
      throw error;
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
   * Stop current speech
   */
  stop(): void {
    this.isPlaying = false;
    
    // Stop audio
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
export const premiumVoice = new PremiumVoiceService();
