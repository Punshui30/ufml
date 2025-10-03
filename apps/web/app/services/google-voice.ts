// Google Cloud Text-to-Speech API
const GOOGLE_TTS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_TTS_API_KEY || '';

// Professional Google voices - these sound incredibly natural
const GOOGLE_VOICES = {
  // Professional male voices
  'en-US-Standard-A': 'en-US-Standard-A', // Professional American male
  'en-US-Standard-B': 'en-US-Standard-B', // Natural American male
  'en-US-Standard-C': 'en-US-Standard-C', // Friendly American male
  'en-US-Standard-D': 'en-US-Standard-D', // Confident American male
  'en-US-Wavenet-A': 'en-US-Wavenet-A',   // High-quality American male
  'en-US-Wavenet-B': 'en-US-Wavenet-B',   // High-quality American male
  'en-US-Wavenet-C': 'en-US-Wavenet-C',   // High-quality American male
  'en-US-Wavenet-D': 'en-US-Wavenet-D',   // High-quality American male
  
  // Professional female voices
  'en-US-Standard-E': 'en-US-Standard-E', // Professional American female
  'en-US-Standard-F': 'en-US-Standard-F', // Natural American female
  'en-US-Standard-G': 'en-US-Standard-G', // Friendly American female
  'en-US-Standard-H': 'en-US-Standard-H', // Confident American female
  'en-US-Wavenet-E': 'en-US-Wavenet-E',   // High-quality American female
  'en-US-Wavenet-F': 'en-US-Wavenet-F',   // High-quality American female
  'en-US-Wavenet-G': 'en-US-Wavenet-G',   // High-quality American female
  'en-US-Wavenet-H': 'en-US-Wavenet-H',   // High-quality American female
  
  // International voices
  'en-GB-Standard-A': 'en-GB-Standard-A', // Professional British male
  'en-GB-Standard-B': 'en-GB-Standard-B', // Professional British female
  'en-GB-Wavenet-A': 'en-GB-Wavenet-A',   // High-quality British male
  'en-GB-Wavenet-B': 'en-GB-Wavenet-B',   // High-quality British female
};

export class GoogleVoiceService {
  private currentVoice: string = 'en-US-Wavenet-A'; // Default high-quality male voice
  private isPlaying: boolean = false;

  /**
   * Set the voice for narration
   */
  setVoice(voiceId: string) {
    if (GOOGLE_VOICES[voiceId as keyof typeof GOOGLE_VOICES]) {
      this.currentVoice = voiceId;
    }
  }

  /**
   * Get available voices
   */
  getAvailableVoices() {
    return Object.keys(GOOGLE_VOICES).map(voiceId => ({
      id: voiceId,
      name: this.getVoiceDisplayName(voiceId),
      description: this.getVoiceDescription(voiceId)
    }));
  }

  /**
   * Get voice display name
   */
  private getVoiceDisplayName(voiceId: string): string {
    const names: Record<string, string> = {
      'en-US-Standard-A': 'David (Standard)',
      'en-US-Standard-B': 'Mike (Standard)',
      'en-US-Standard-C': 'John (Standard)',
      'en-US-Standard-D': 'Tom (Standard)',
      'en-US-Wavenet-A': 'David (Premium)',
      'en-US-Wavenet-B': 'Mike (Premium)',
      'en-US-Wavenet-C': 'John (Premium)',
      'en-US-Wavenet-D': 'Tom (Premium)',
      'en-US-Standard-E': 'Sarah (Standard)',
      'en-US-Standard-F': 'Emma (Standard)',
      'en-US-Standard-G': 'Lisa (Standard)',
      'en-US-Standard-H': 'Amy (Standard)',
      'en-US-Wavenet-E': 'Sarah (Premium)',
      'en-US-Wavenet-F': 'Emma (Premium)',
      'en-US-Wavenet-G': 'Lisa (Premium)',
      'en-US-Wavenet-H': 'Amy (Premium)',
      'en-GB-Standard-A': 'James (British)',
      'en-GB-Standard-B': 'Kate (British)',
      'en-GB-Wavenet-A': 'James (British Premium)',
      'en-GB-Wavenet-B': 'Kate (British Premium)'
    };
    return names[voiceId] || voiceId;
  }

  /**
   * Get voice description
   */
  private getVoiceDescription(voiceId: string): string {
    const descriptions: Record<string, string> = {
      'en-US-Standard-A': 'Professional American male voice - perfect for business presentations',
      'en-US-Standard-B': 'Natural American male voice - great for conversational content',
      'en-US-Standard-C': 'Friendly American male voice - ideal for customer service',
      'en-US-Standard-D': 'Confident American male voice - perfect for announcements',
      'en-US-Wavenet-A': 'Premium American male voice - highest quality, natural sound',
      'en-US-Wavenet-B': 'Premium American male voice - excellent for professional content',
      'en-US-Wavenet-C': 'Premium American male voice - perfect for marketing',
      'en-US-Wavenet-D': 'Premium American male voice - ideal for leadership content',
      'en-US-Standard-E': 'Professional American female voice - excellent for corporate content',
      'en-US-Standard-F': 'Natural American female voice - perfect for friendly narration',
      'en-US-Standard-G': 'Friendly American female voice - great for tutorials',
      'en-US-Standard-H': 'Confident American female voice - ideal for presentations',
      'en-US-Wavenet-E': 'Premium American female voice - highest quality, natural sound',
      'en-US-Wavenet-F': 'Premium American female voice - excellent for professional content',
      'en-US-Wavenet-G': 'Premium American female voice - perfect for customer service',
      'en-US-Wavenet-H': 'Premium American female voice - ideal for leadership content',
      'en-GB-Standard-A': 'Professional British male voice - sophisticated and clear',
      'en-GB-Standard-B': 'Professional British female voice - articulate and engaging',
      'en-GB-Wavenet-A': 'Premium British male voice - highest quality British accent',
      'en-GB-Wavenet-B': 'Premium British female voice - excellent for professional content'
    };
    return descriptions[voiceId] || 'Professional, natural voice';
  }

  /**
   * Generate and play natural speech using Google Cloud TTS
   */
  async speak(text: string): Promise<void> {
    if (!GOOGLE_TTS_API_KEY) {
      console.warn('Google TTS API key not configured. Using fallback voice.');
      return this.fallbackToWebSpeech(text);
    }

    try {
      this.isPlaying = true;

      // Create SSML for natural speech
      const ssml = `
        <speak>
          <voice name="${this.currentVoice}">
            <prosody rate="0.9" pitch="+0%">
              ${text}
            </prosody>
          </voice>
        </speak>
      `;

      // Generate speech using Google Cloud TTS API
      const response = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${GOOGLE_TTS_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: {
            ssml: ssml
          },
          voice: {
            languageCode: 'en-US',
            name: this.currentVoice,
            ssmlGender: this.currentVoice.includes('Standard-A') || this.currentVoice.includes('Wavenet-A') || 
                       this.currentVoice.includes('Standard-B') || this.currentVoice.includes('Wavenet-B') ||
                       this.currentVoice.includes('Standard-C') || this.currentVoice.includes('Wavenet-C') ||
                       this.currentVoice.includes('Standard-D') || this.currentVoice.includes('Wavenet-D') ||
                       this.currentVoice.includes('GB-Standard-A') || this.currentVoice.includes('GB-Wavenet-A') ? 'MALE' : 'FEMALE'
          },
          audioConfig: {
            audioEncoding: 'MP3',
            speakingRate: 0.9,
            pitch: 0.0,
            volumeGainDb: 0.0
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Google TTS API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Convert base64 audio to blob
      const audioData = atob(data.audioContent);
      const audioArray = new Uint8Array(audioData.length);
      for (let i = 0; i < audioData.length; i++) {
        audioArray[i] = audioData.charCodeAt(i);
      }
      
      const audioBlob = new Blob([audioArray], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);

      // Play the audio
      await this.playAudio(audioUrl);

      // Clean up
      URL.revokeObjectURL(audioUrl);
      
    } catch (error) {
      console.error('Google TTS failed:', error);
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
   * Fallback to Web Speech API with better voice selection
   */
  private async fallbackToWebSpeech(text: string): Promise<void> {
    if (!('speechSynthesis' in window)) {
      throw new Error('Speech synthesis not supported');
    }

    return new Promise((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Get voices and select the best one
      const voices = speechSynthesis.getVoices();
      
      // Prioritize high-quality voices
      const preferredVoices = [
        'Microsoft David Desktop - English (United States)',
        'Microsoft Mark Desktop - English (United States)',
        'Google US English Male',
        'Alex',
        'Daniel',
        'Tom',
        'Ralph',
        'Bruce',
        'Fred'
      ];
      
      let selectedVoice = null;
      
      // Try to find a high-quality voice
      for (const preferredVoice of preferredVoices) {
        selectedVoice = voices.find(voice => 
          voice.name.includes(preferredVoice) && 
          voice.lang.startsWith('en')
        );
        if (selectedVoice) break;
      }
      
      // If no preferred voice found, try any English male voice
      if (!selectedVoice) {
        selectedVoice = voices.find(voice => 
          voice.lang.startsWith('en') && 
          !voice.name.toLowerCase().includes('female') && 
          !voice.name.toLowerCase().includes('woman') &&
          !voice.name.toLowerCase().includes('zira') &&
          !voice.name.toLowerCase().includes('hazel') &&
          !voice.name.toLowerCase().includes('susan') &&
          !voice.name.toLowerCase().includes('karen') &&
          !voice.name.toLowerCase().includes('victoria') &&
          !voice.name.toLowerCase().includes('samantha') &&
          !voice.name.toLowerCase().includes('moira') &&
          !voice.name.toLowerCase().includes('tessa') &&
          !voice.name.toLowerCase().includes('veena') &&
          !voice.name.toLowerCase().includes('fiona')
        );
      }
      
      // Last resort: any English voice
      if (!selectedVoice) {
        selectedVoice = voices.find(voice => voice.lang.startsWith('en'));
      }
      
      if (selectedVoice) {
        utterance.voice = selectedVoice;
        console.log('Selected fallback voice:', selectedVoice.name);
      }
      
      // Optimize speech parameters for natural sound
      utterance.rate = 0.85;  // Slightly slower for natural pace
      utterance.pitch = 1.0;  // Normal pitch
      utterance.volume = 1.0; // Full volume
      
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
    
    // Stop Google audio
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
export const googleVoice = new GoogleVoiceService();



