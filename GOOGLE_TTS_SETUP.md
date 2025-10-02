# 🎤 Google Cloud Text-to-Speech Setup Guide

This guide will help you set up Google Cloud Text-to-Speech for incredibly natural, human-like voice narration in the Credit Hardar demo.

## 🚀 Why Google Cloud TTS?

- **Incredibly Natural Voices**: Google's WaveNet technology sounds like real humans
- **Browser-Compatible**: Pure REST API, no Node.js module conflicts
- **High-Quality Audio**: Professional-grade voice synthesis
- **Reliable**: Google's enterprise-grade infrastructure
- **Cost-Effective**: Pay-per-character pricing, generous free tier

## 📋 Setup Steps

### 1. **Create Google Cloud Account**

1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Sign up for a free Google Cloud account
3. You get $300 in free credits for 12 months

### 2. **Create a New Project**

1. In Google Cloud Console, click **"Select a project"**
2. Click **"New Project"**
3. Enter project name: `credit-hardar-tts`
4. Click **"Create"**

### 3. **Enable Text-to-Speech API**

1. In the Google Cloud Console, go to **"APIs & Services"** → **"Library"**
2. Search for **"Cloud Text-to-Speech API"**
3. Click on it and click **"Enable"**

### 4. **Create API Credentials**

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"+ CREATE CREDENTIALS"**
3. Select **"API key"**
4. Copy the generated API key
5. (Optional) Click **"Restrict key"** and add HTTP referrer restrictions for security

### 5. **Configure Environment Variables**

Add your Google TTS API key to your environment variables:

**For Development (.env.local):**
```bash
NEXT_PUBLIC_GOOGLE_TTS_API_KEY=your_google_api_key_here
```

**For Production:**
Set the environment variable in your hosting platform:
- **Vercel**: Project Settings → Environment Variables
- **Netlify**: Site Settings → Environment Variables  
- **Railway**: Variables tab
- **Docker**: Add to docker-compose.yml

### 6. **Test the Integration**

1. Start your development server: `pnpm run dev`
2. Navigate to `/demo`
3. Select a demo type (Agency or Consumer)
4. Click the **Settings** button next to "Voice"
5. Choose from the available Google voices
6. Click **Play** to hear the natural voice narration

## 🎯 Available Google Voices

### **Premium WaveNet Voices (Highest Quality):**
- **David (Premium)** - Professional American male voice (Default)
- **Mike (Premium)** - Natural American male voice
- **John (Premium)** - Friendly American male voice
- **Tom (Premium)** - Confident American male voice
- **Sarah (Premium)** - Professional American female voice
- **Emma (Premium)** - Natural American female voice
- **Lisa (Premium)** - Friendly American female voice
- **Amy (Premium)** - Confident American female voice

### **Standard Voices (Good Quality):**
- **David (Standard)** - Professional American male voice
- **Mike (Standard)** - Natural American male voice
- **John (Standard)** - Friendly American male voice
- **Tom (Standard)** - Confident American male voice
- **Sarah (Standard)** - Professional American female voice
- **Emma (Standard)** - Natural American female voice
- **Lisa (Standard)** - Friendly American female voice
- **Amy (Standard)** - Confident American female voice

### **International Voices:**
- **James (British)** - Professional British male voice
- **Kate (British)** - Professional British female voice
- **James (British Premium)** - High-quality British male voice
- **Kate (British Premium)** - High-quality British female voice

## 💰 Pricing

### **Free Tier:**
- 1 million characters per month
- 4 million characters per month for WaveNet voices
- Perfect for demos and testing

### **Paid Pricing:**
- **Standard Voices**: $4.00 per 1 million characters
- **WaveNet Voices**: $16.00 per 1 million characters
- **Neural2 Voices**: $16.00 per 1 million characters

### **Example Costs:**
- **1,000 characters** ≈ $0.004 (Standard) / $0.016 (WaveNet)
- **10,000 characters** ≈ $0.04 (Standard) / $0.16 (WaveNet)
- **100,000 characters** ≈ $0.40 (Standard) / $1.60 (WaveNet)

## 🔧 Advanced Configuration

### **Custom Voice Settings**

You can adjust speech parameters in the SSML:

```typescript
const ssml = `
  <speak>
    <voice name="${this.currentVoice}">
      <prosody rate="0.9" pitch="+0%">
        ${text}
      </prosody>
    </voice>
  </speak>
`;
```

**Available SSML Parameters:**
- `rate`: Speech rate (0.25 = slow, 1.0 = normal, 4.0 = fast)
- `pitch`: Voice pitch (-50% = lower, +50% = higher)
- `volume`: Voice volume (soft, medium, loud)

### **Voice Selection Logic**

The service automatically detects gender based on voice name:
- Voices ending in A, B, C, D = Male
- Voices ending in E, F, G, H = Female

## 🚨 Troubleshooting

### **"Google TTS API key not configured" Warning**
- Make sure `NEXT_PUBLIC_GOOGLE_TTS_API_KEY` is set
- Restart your development server after adding environment variables
- Check that the API key is valid in Google Cloud Console

### **"Google TTS API error: 403"**
- API key is invalid or restricted
- Check that Text-to-Speech API is enabled
- Verify billing is set up (even for free tier)

### **"Google TTS API error: 400"**
- Invalid request format
- Check that the voice name is correct
- Verify SSML syntax

### **"Google TTS API error: 429"**
- Rate limit exceeded
- You're hitting the free tier limits
- Wait a moment and try again

### **Audio Not Playing**
- Check browser audio permissions
- Ensure your system volume is up
- Try a different browser
- Check browser console for errors

## 🔒 Security Best Practices

1. **Never commit API keys to version control**
2. **Use environment variables for all secrets**
3. **Restrict API key to specific domains/IPs**
4. **Monitor usage in Google Cloud Console**
5. **Set up billing alerts to avoid surprise charges**

## 📊 Usage Monitoring

Monitor your Google TTS usage:

1. Log into [Google Cloud Console](https://console.cloud.google.com/)
2. Go to **"APIs & Services"** → **"Dashboard"**
3. Select your project
4. View Text-to-Speech API usage and costs
5. Set up billing alerts for usage limits

## 🎯 Demo Optimization Tips

1. **Use WaveNet Voices**: Higher quality, more natural sound
2. **Optimize Text**: Shorter, clearer sentences work better
3. **Use SSML**: Add pauses and emphasis for natural speech
4. **Cache Audio**: Consider caching generated audio for repeated content
5. **Test on Different Devices**: Ensure voice quality is consistent

## 📞 Support

- **Google Cloud Documentation**: https://cloud.google.com/text-to-speech/docs
- **Google Cloud Support**: https://cloud.google.com/support/
- **Stack Overflow**: Tag questions with `google-cloud-text-to-speech`

## 🆚 Google TTS vs Other Services

| Feature | Google TTS | Azure Speech | ElevenLabs |
|---------|------------|--------------|------------|
| **Voice Quality** | Excellent | High | Very High |
| **Browser Compatibility** | Excellent | Excellent | Good |
| **Setup Complexity** | Easy | Easy | Medium |
| **Build Issues** | None | None | Potential |
| **Free Tier** | 4M chars/month | 5 hours/month | 10K chars/month |
| **Pricing** | $4-16/1M chars | $4/1M chars | $5/month starter |
| **Custom Voices** | Yes | Yes | Yes |
| **Enterprise Support** | Excellent | Excellent | Good |

---

**Ready to upgrade your demo with Google's natural voices?** Follow the setup steps above and enjoy incredibly natural, human-like voice narration without any build issues!


