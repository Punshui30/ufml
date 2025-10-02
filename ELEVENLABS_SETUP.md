# 🎤 ElevenLabs Natural Voice Setup Guide

This guide will help you set up ElevenLabs for natural, human-like voice narration in the Credit Hardar demo.

## 🚀 Why ElevenLabs?

- **Incredibly Natural Voices**: Sounds like real humans, not robots
- **Professional Quality**: Perfect for business presentations and demos
- **Multiple Voice Options**: 20+ professional voices to choose from
- **Fast Generation**: Quick audio generation for real-time demos
- **Affordable**: Free tier available, paid plans start at $5/month

## 📋 Setup Steps

### 1. **Create ElevenLabs Account**

1. Visit [ElevenLabs](https://elevenlabs.io/)
2. Click "Sign Up" 
3. Create your account (email + password)
4. Verify your email address

### 2. **Get Your API Key**

1. Log into your ElevenLabs dashboard
2. Go to your **Profile Settings**
3. Click on **API Keys** tab
4. Click **"Create API Key"**
5. Give it a name like "Credit Hardar Demo"
6. Copy the generated API key (starts with `sk_...`)

### 3. **Configure Environment Variables**

Add your API key to your environment variables:

**For Development (.env.local):**
```bash
NEXT_PUBLIC_ELEVENLABS_API_KEY=sk_your_api_key_here
```

**For Production:**
Set the environment variable in your hosting platform:
- **Vercel**: Project Settings → Environment Variables
- **Netlify**: Site Settings → Environment Variables  
- **Railway**: Variables tab
- **Docker**: Add to docker-compose.yml

### 4. **Test the Integration**

1. Start your development server: `pnpm run dev`
2. Navigate to `/demo`
3. Select a demo type (Agency or Consumer)
4. Click the **Settings** button next to "Voice"
5. Choose from the available natural voices
6. Click **Play** to hear the natural voice narration

## 🎯 Available Voices

### **Professional Male Voices:**
- **Adam** - Natural American male, professional (Default)
- **Arnold** - Deep, authoritative male voice
- **Josh** - Natural, conversational male voice
- **Sam** - Natural, warm male voice
- **Thomas** - Natural, conversational male voice
- **William** - Professional, authoritative male voice
- **Ryan** - Natural, friendly male voice

### **Professional Female Voices:**
- **Bella** - Warm, professional female voice
- **Domi** - Confident, engaging female voice
- **Elli** - Clear, friendly female voice
- **Rachel** - Professional, clear female voice
- **Freya** - Professional female voice
- **Gigi** - Warm, friendly female voice
- **Grace** - Professional, clear female voice
- **Lily** - Young, energetic female voice
- **Serena** - Professional, confident female voice
- **Nicole** - Professional, clear female voice
- **Sarah** - Warm, professional female voice

### **International Voices:**
- **Callum** - Professional British male voice

## 💰 Pricing

### **Free Tier:**
- 10,000 characters per month
- 3 custom voices
- Standard quality voices
- Perfect for demos and testing

### **Starter Plan ($5/month):**
- 30,000 characters per month
- 10 custom voices
- Premium voices
- Commercial use allowed

### **Creator Plan ($22/month):**
- 100,000 characters per month
- 30 custom voices
- Premium voices
- Priority support

### **Pro Plan ($99/month):**
- 500,000 characters per month
- 160 custom voices
- Premium voices
- API access
- Priority support

## 🔧 Advanced Configuration

### **Custom Voice Settings**

You can adjust voice parameters in `apps/web/app/services/natural-voice.ts`:

```typescript
const NATURAL_VOICE_SETTINGS: VoiceSettings = {
  stability: 0.5,        // Voice consistency (0.0 - 1.0)
  similarity_boost: 0.8, // Voice similarity to original (0.0 - 1.0)
  style: 0.2,           // Style exaggeration (0.0 - 1.0)
  use_speaker_boost: true // Enhance speaker similarity
};
```

### **Adding Custom Voices**

1. In ElevenLabs dashboard, go to **Voice Lab**
2. Click **"Add Voice"**
3. Choose **"Instant Voice Clone"** or **"Professional Voice Clone"**
4. Upload sample audio or record your voice
5. Name your voice and save
6. Add the voice ID to the `NATURAL_VOICES` object in the service

## 🚨 Troubleshooting

### **"API key not configured" Warning**
- Make sure `NEXT_PUBLIC_ELEVENLABS_API_KEY` is set in your environment
- Restart your development server after adding the environment variable
- Check that the API key starts with `sk_`

### **"ElevenLabs TTS failed" Error**
- Check your API key is valid and active
- Verify you have sufficient character credits
- Check your internet connection
- The system will automatically fallback to Web Speech API

### **No Voices Available**
- Ensure you're logged into ElevenLabs
- Check that your account has access to voices
- Free tier includes all standard voices

### **Audio Not Playing**
- Check browser audio permissions
- Ensure your system volume is up
- Try a different browser
- Check browser console for errors

## 🔒 Security Best Practices

1. **Never commit API keys to version control**
2. **Use environment variables for all secrets**
3. **Rotate API keys regularly**
4. **Monitor usage in ElevenLabs dashboard**
5. **Set up usage alerts to avoid overage charges**

## 📊 Usage Monitoring

Monitor your ElevenLabs usage:

1. Log into your ElevenLabs dashboard
2. Go to **Usage** tab
3. View character usage, API calls, and costs
4. Set up alerts for usage limits

## 🎯 Demo Optimization Tips

1. **Choose the Right Voice**: Test different voices to find the best fit for your content
2. **Optimize Text**: Shorter, clearer sentences work better for TTS
3. **Use Pauses**: Add periods and commas for natural speech rhythm
4. **Test on Different Devices**: Ensure voice quality is consistent across platforms

## 📞 Support

- **ElevenLabs Documentation**: https://docs.elevenlabs.io/
- **ElevenLabs Support**: support@elevenlabs.io
- **Discord Community**: https://discord.gg/elevenlabs

---

**Ready to upgrade your demo with natural voices?** Follow the setup steps above and transform your Credit Hardar demo into a professional, engaging experience!


