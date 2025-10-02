// Azure Cognitive Services Speech API
const AZURE_SPEECH_KEY = process.env.NEXT_PUBLIC_AZURE_SPEECH_KEY || '';
const AZURE_SPEECH_REGION = process.env.NEXT_PUBLIC_AZURE_SPEECH_REGION || 'eastus';

// Professional voices available in Azure Speech
const AZURE_VOICES = {
  // Professional male voices
  'davis': 'en-US-DavisNeural', // Professional American male
  'guy': 'en-US-GuyNeural',     // Natural American male
  'jason': 'en-US-JasonNeural', // Friendly American male
  'brandon': 'en-US-BrandonNeural', // Confident American male
  'ethan': 'en-US-EthanNeural', // Young professional male
  
  // Professional female voices
  'jenny': 'en-US-JennyNeural', // Professional American female
  'aria': 'en-US-AriaNeural',   // Natural American female
  'sara': 'en-US-SaraNeural',   // Friendly American female
  'michelle': 'en-US-MichelleNeural', // Warm American female
  'ashley': 'en-US-AshleyNeural', // Clear American female
  'emma': 'en-US-EmmaNeural',   // Professional American female
  'monica': 'en-US-MonicaNeural', // Confident American female
  
  // International voices
  'ryan': 'en-GB-RyanNeural',   // Professional British male
  'libby': 'en-GB-LibbyNeural', // Professional British female
};

export class AzureVoiceService {
  private currentVoice: string = 'davis'; // Default professional male voice
  private isPlaying: boolean = false;

  /**
   * Set the voice for narration
   */
  setVoice(voiceId: string) {
    if (AZURE_VOICES[voiceId as keyof typeof AZURE_VOICES]) {
      this.currentVoice = voiceId;
    }
  }

  /**
   * Get available voices
   */
  getAvailableVoices() {
    return Object.keys(AZURE_VOICES).map(voiceId => ({
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
      'davis': 'Professional American male voice - perfect for business presentations',
      'guy': 'Natural American male voice - great for conversational content',
      'jason': 'Friendly American male voice - ideal for customer service',
      'brandon': 'Confident American male voice - perfect for announcements',
      'ethan': 'Young professional male voice - great for modern content',
      'jenny': 'Professional American female voice - excellent for corporate content',
      'aria': 'Natural American female voice - perfect for friendly narration',
      'sara': 'Friendly American female voice - great for tutorials',
      'michelle': 'Warm American female voice - ideal for welcoming content',
      'ashley': 'Clear American female voice - perfect for instructions',
      'emma': 'Professional American female voice - great for presentations',
      'monica': 'Confident American female voice - ideal for leadership content',
      'ryan': 'Professional British male voice - sophisticated and clear',
      'libby': 'Professional British female voice - articulate and engaging'
    };
    return descriptions[voiceId] || 'Professional, natural voice';
  }

  /**
   * Generate and play natural speech using Azure Speech
   */
  async speak(text: string): Promise<void> {
    if (!AZURE_SPEECH_KEY) {
      console.warn('Azure Speech API key not configured. Falling back to Web Speech API.');
      return this.fallbackToWebSpeech(text);
    }

    try {
      this.isPlaying = true;

      // Get the voice name
      const voiceName = AZURE_VOICES[this.currentVoice as keyof typeof AZURE_VOICES];

      // Create SSML (Speech Synthesis Markup Language)
      const ssml = `
        <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
          <voice name="${voiceName}">
            <prosody rate="0.9" pitch="+0%">
              ${text}
            </prosody>
          </voice>
        </speak>
      `;

      // Generate speech using Azure Speech REST API
      const response = await fetch(`https://${AZURE_SPEECH_REGION}.tts.speech.microsoft.com/cognitiveservices/v1`, {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': AZURE_SPEECH_KEY,
          'Content-Type': 'application/ssml+xml',
          'X-Microsoft-OutputFormat': 'audio-24khz-160kbitrate-mono-mp3'
        },
        body: ssml
      });

      if (!response.ok) {
        throw new Error(`Azure Speech API error: ${response.status} ${response.statusText}`);
      }

      // Get the audio data
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      // Play the audio
      await this.playAudio(audioUrl);

      // Clean up
      URL.revokeObjectURL(audioUrl);
      
    } catch (error) {
      console.error('Azure Speech TTS failed:', error);
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
   * Fallback to Web Speech API
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
    
    // Stop Azure audio
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
export const azureVoice = new AzureVoiceService();


