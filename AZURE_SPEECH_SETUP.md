# 🎤 Azure Speech Services Setup Guide

This guide will help you set up Azure Cognitive Services Speech for natural, high-quality voice narration in the Credit Hardar demo.

## 🚀 Why Azure Speech Services?

- **High-Quality Neural Voices**: Professional, natural-sounding voices
- **Browser-Compatible**: Works directly in web browsers via REST API
- **Reliable**: Microsoft's enterprise-grade speech services
- **Cost-Effective**: Pay-per-use pricing, free tier available
- **No Build Issues**: Pure REST API, no Node.js module conflicts

## 📋 Setup Steps

### 1. **Create Azure Account**

1. Visit [Azure Portal](https://portal.azure.com/)
2. Sign up for a free Azure account (if you don't have one)
3. You get $200 in free credits for 30 days

### 2. **Create Speech Service Resource**

1. In Azure Portal, click **"Create a resource"**
2. Search for **"Speech"**
3. Select **"Speech Services"**
4. Click **"Create"**
5. Fill in the details:
   - **Subscription**: Your Azure subscription
   - **Resource Group**: Create new or use existing
   - **Region**: Choose closest to your users (e.g., `East US`)
   - **Name**: `credit-hardar-speech`
   - **Pricing Tier**: `Free (F0)` for testing, `Standard (S0)` for production
6. Click **"Review + create"**
7. Click **"Create"**

### 3. **Get Your API Keys**

1. Go to your Speech Services resource
2. Click **"Keys and Endpoint"** in the left menu
3. Copy **Key 1** and **Region**
4. Save these for the environment variables

### 4. **Configure Environment Variables**

Add your Azure Speech keys to your environment variables:

**For Development (.env.local):**
```bash
NEXT_PUBLIC_AZURE_SPEECH_KEY=your_azure_speech_key_here
NEXT_PUBLIC_AZURE_SPEECH_REGION=eastus
```

**For Production:**
Set the environment variables in your hosting platform:
- **Vercel**: Project Settings → Environment Variables
- **Netlify**: Site Settings → Environment Variables  
- **Railway**: Variables tab
- **Docker**: Add to docker-compose.yml

### 5. **Test the Integration**

1. Start your development server: `pnpm run dev`
2. Navigate to `/demo`
3. Select a demo type (Agency or Consumer)
4. Click the **Settings** button next to "Voice"
5. Choose from the available Azure voices
6. Click **Play** to hear the natural voice narration

## 🎯 Available Azure Voices

### **Professional Male Voices:**
- **Davis** - Professional American male voice (Default)
- **Guy** - Natural American male voice
- **Jason** - Friendly American male voice
- **Brandon** - Confident American male voice
- **Ethan** - Young professional male voice

### **Professional Female Voices:**
- **Jenny** - Professional American female voice
- **Aria** - Natural American female voice
- **Sara** - Friendly American female voice
- **Michelle** - Warm American female voice
- **Ashley** - Clear American female voice
- **Emma** - Professional American female voice
- **Monica** - Confident American female voice

### **International Voices:**
- **Ryan** - Professional British male voice
- **Libby** - Professional British female voice

## 💰 Pricing

### **Free Tier (F0):**
- 5 hours of speech synthesis per month
- 0.5 million characters per month
- Perfect for demos and testing

### **Standard Tier (S0):**
- $4.00 per 1 million characters
- No monthly limits
- Commercial use allowed
- Priority support

### **Example Costs:**
- **1,000 characters** ≈ $0.004
- **10,000 characters** ≈ $0.04
- **100,000 characters** ≈ $0.40

## 🔧 Advanced Configuration

### **Custom Voice Settings**

You can adjust speech parameters in the SSML:

```typescript
const ssml = `
  <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
    <voice name="${voiceName}">
      <prosody rate="0.9" pitch="+0%">
        ${text}
      </prosody>
    </voice>
  </speak>
`;
```

**Available SSML Parameters:**
- `rate`: Speech rate (0.5 = slow, 1.0 = normal, 2.0 = fast)
- `pitch`: Voice pitch (+50% = higher, -50% = lower)
- `volume`: Voice volume (soft, medium, loud)

### **Adding Custom Voices**

1. In Azure Portal, go to your Speech Service
2. Click **"Custom Voice"** in the left menu
3. Click **"Create a project"**
4. Upload training data (audio files + transcripts)
5. Train your custom voice model
6. Add the voice name to the `AZURE_VOICES` object

## 🚨 Troubleshooting

### **"Azure Speech API key not configured" Warning**
- Make sure `NEXT_PUBLIC_AZURE_SPEECH_KEY` is set
- Make sure `NEXT_PUBLIC_AZURE_SPEECH_REGION` is set
- Restart your development server after adding environment variables
- Check that the API key is valid in Azure Portal

### **"Azure Speech API error: 401"**
- Invalid API key
- Check that the key is correct in Azure Portal
- Ensure the key hasn't expired

### **"Azure Speech API error: 403"**
- Insufficient permissions
- Check your Azure subscription status
- Ensure you have quota remaining

### **"Azure Speech API error: 429"**
- Rate limit exceeded
- You're hitting the free tier limits
- Upgrade to Standard tier for higher limits

### **Audio Not Playing**
- Check browser audio permissions
- Ensure your system volume is up
- Try a different browser
- Check browser console for errors

## 🔒 Security Best Practices

1. **Never commit API keys to version control**
2. **Use environment variables for all secrets**
3. **Rotate API keys regularly**
4. **Monitor usage in Azure Portal**
5. **Set up spending alerts to avoid surprise charges**

## 📊 Usage Monitoring

Monitor your Azure Speech usage:

1. Log into [Azure Portal](https://portal.azure.com/)
2. Go to your Speech Services resource
3. Click **"Metrics"** in the left menu
4. View character usage, API calls, and costs
5. Set up alerts for usage limits

## 🎯 Demo Optimization Tips

1. **Choose the Right Voice**: Test different voices to find the best fit
2. **Optimize Text**: Shorter, clearer sentences work better
3. **Use SSML**: Add pauses and emphasis for natural speech
4. **Cache Audio**: Consider caching generated audio for repeated content
5. **Test on Different Devices**: Ensure voice quality is consistent

## 📞 Support

- **Azure Documentation**: https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/
- **Azure Support**: https://azure.microsoft.com/en-us/support/
- **Stack Overflow**: Tag questions with `azure-cognitive-services`

## 🆚 Azure vs ElevenLabs Comparison

| Feature | Azure Speech | ElevenLabs |
|---------|-------------|------------|
| **Voice Quality** | High | Very High |
| **Browser Compatibility** | Excellent | Good (with setup) |
| **Pricing** | $4/1M chars | $5/month starter |
| **Setup Complexity** | Easy | Medium |
| **Build Issues** | None | Potential Node.js issues |
| **Free Tier** | 5 hours/month | 10K chars/month |
| **Custom Voices** | Yes | Yes |
| **Enterprise Support** | Excellent | Good |

---

**Ready to upgrade your demo with professional Azure voices?** Follow the setup steps above and enjoy high-quality, natural voice narration without any build issues!


