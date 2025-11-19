# 🤖💬 AI Best Friend Setup Guide

Your bot now has an AI best friend personality! 😊

---

## ✨ What It Does

Your bot can now chat like a real best friend:
- 😊 Warm and supportive
- 🤣 Fun and playful
- ❤️ Caring and emotional
- 💬 Casual and natural
- 🎯 Responds to mentions and commands

---

## 🔑 Get Your Free Google API Key

### Step 1: Go to Google AI Studio
Visit: https://makersuite.google.com/app/apikey

### Step 2: Sign In
- Use your Google account
- It's completely FREE! 🎉

### Step 3: Create API Key
1. Click "Create API Key"
2. Select a project (or create new one)
3. Copy your API key

### Step 4: Add to .env
```env
GOOGLE_API_KEY=your_api_key_here
```

**That's it!** 🎊

---

## 🎮 How to Use

### Method 1: Slash Command
```
/chat message:Hey! How are you doing?
```

**Bot responds:**
```
Hey there! 😊 I'm doing great, thanks for asking! 
How about you? What's been going on? ✨
```

### Method 2: Tag the Bot
```
@YourBot what do you think about pizza?
```

**Bot responds:**
```
Pizza?! 🍕🤩 Dude, pizza is literally one of the best 
things ever invented! What's your favorite topping? 
I'm curious! 👀
```

### Method 3: Just Chat Naturally
```
@YourBot I'm feeling kinda sad today
```

**Bot responds:**
```
Aww, I'm sorry you're feeling down 😔❤️‍🩹 
Wanna talk about it? I'm here for you, friend. 
Sometimes it helps to just let it out, you know? 🤗
```

---

## 🎭 Personality Examples

### Happy/Excited
**User:** "I just got a new job!"
**Bot:** "YOOO THAT'S AMAZING!! 🤩🔥 Congrats!! I'm so proud of you! When do you start? Tell me everything! ✨"

### Supportive
**User:** "I failed my exam..."
**Bot:** "Aw man, that sucks 😔 But hey, one bad exam doesn't define you! You'll bounce back, I believe in you ❤️‍🩹 What happened?"

### Funny/Silly
**User:** "I just ate 10 tacos"
**Bot:** "TEN?! 😳🌮 Okay, I'm impressed AND concerned 🤣 Are you okay? Do you need a nap? That's legendary though! 😅"

### Curious
**User:** "I'm learning to code"
**Bot:** "Ooh that's cool! 🤔💻 What language are you learning? Is it hard? I bet you're doing great! 👀"

---

## 🎨 Emotion System

The bot automatically detects emotions and responds accordingly:

| User Emotion | Bot Response Style | Emojis |
|--------------|-------------------|---------|
| Happy | Excited, celebratory | 😊😄✨🎉 |
| Sad | Supportive, caring | 😔😭❤️‍🩹🤗 |
| Excited | Matches energy | 🤩🔥⚡ |
| Angry | Understanding, calm | 😤😑💭 |
| Confused | Helpful, curious | 🤔👀💡 |
| Funny | Playful, silly | 🤣😅😂 |

---

## ⚙️ Configuration

### Temperature (Creativity)
Current: `0.9` (Very creative and varied)

**Adjust in code:**
```typescript
temperature: 0.9  // 0.0 = predictable, 1.0 = creative
```

### Response Length
Current: `200 tokens` (2-4 sentences)

**Adjust in code:**
```typescript
maxOutputTokens: 200  // Increase for longer responses
```

### Personality Tweaks

Edit the prompt in:
- `src/commands/fun/chat.ts`
- `src/events/aiBestFriend.ts`

**Example tweaks:**
```typescript
// More sassy
"• Add more sass and playful teasing"

// More wholesome
"• Be extra sweet and wholesome"

// More energetic
"• Always be super energetic and hyped"
```

---

## 🚀 Advanced Features

### Conversation Memory (Same Session)

The bot can reference earlier messages in the same conversation:

**User:** "I love cats"
**Bot:** "Cats are awesome! 😻"

**User:** "Do you remember what I said?"
**Bot:** "Yeah! You said you love cats! 😊 Do you have any?"

### Custom Triggers

Add more ways to trigger the bot:

```typescript
// In aiBestFriend.ts
if (message.content.toLowerCase().includes('hey bot')) {
  // Respond
}
```

### Multiple Personalities

Create different commands for different moods:

```
/chat-happy message:...    // Always happy
/chat-chill message:...    // Always chill
/chat-hype message:...     // Always hyped
```

---

## 📊 API Limits (Free Tier)

**Google Gemini Free Tier:**
- ✅ 60 requests per minute
- ✅ Unlimited requests per day
- ✅ No credit card required
- ✅ Perfect for Discord bots!

**If you hit limits:**
- Add cooldowns to commands
- Cache responses
- Upgrade to paid tier (optional)

---

## 🛠️ Troubleshooting

### Bot Not Responding

**Check:**
1. `GOOGLE_API_KEY` in .env
2. API key is valid
3. Bot has message permissions
4. Bot is online

**Test:**
```
/chat message:test
```

### "API Error" Message

**Causes:**
- Invalid API key
- Rate limit exceeded
- Network issues

**Fix:**
1. Check API key
2. Wait a minute
3. Try again

### Bot Too Formal

**Adjust temperature:**
```typescript
temperature: 0.95  // More casual
```

### Bot Too Random

**Adjust temperature:**
```typescript
temperature: 0.7  // More consistent
```

---

## 🎯 Best Practices

### Do's ✅
- Keep conversations natural
- Let users chat freely
- Respond to emotions
- Be supportive and fun
- Use emojis naturally

### Don'ts ❌
- Don't lecture users
- Don't be too formal
- Don't give long responses
- Don't ignore emotions
- Don't be repetitive

---

## 📝 Example Conversations

### Casual Chat
```
User: @Bot what's up?
Bot: Not much! Just vibing here 😊 What about you? 
     Anything exciting happening? ✨

User: Just chilling, kinda bored
Bot: Oof, I feel that 😅 Wanna play a game or something? 
     Or we could just chat! What sounds good? 🎮
```

### Emotional Support
```
User: @Bot I'm stressed about school
Bot: Aw man, school stress is the worst 😔 What's going on? 
     Is it exams or assignments? I'm here to listen ❤️‍🩹

User: Yeah, finals are coming up
Bot: Finals are tough, but you've got this! 💪 
     Have you started studying yet? Maybe I can help 
     you make a plan? 📚✨
```

### Fun Banter
```
User: @Bot tell me a joke
Bot: Okay okay, here's one! 😄 Why don't scientists 
     trust atoms? Because they make up everything! 🤣 
     Was that terrible? Be honest 😅

User: That was so bad lol
Bot: I KNOW RIGHT?! 🤣 I tried though! Got any better ones? 
     I wanna hear! 👀
```

---

## 🔄 Updates & Improvements

### Future Ideas
- [ ] Conversation history (multi-message memory)
- [ ] User preferences (remember favorite things)
- [ ] Mood detection (analyze sentiment)
- [ ] Voice chat support
- [ ] Custom personality per server
- [ ] Image understanding (when available)

### Current Version
- ✅ Tag-based responses
- ✅ Slash command support
- ✅ Emotion detection
- ✅ Natural conversations
- ✅ Free Google API

---

## 💡 Tips for Best Results

1. **Be Natural** - Talk to the bot like a real friend
2. **Use Emojis** - Bot responds better to emotional cues
3. **Ask Questions** - Bot loves engaging conversations
4. **Be Specific** - More context = better responses
5. **Have Fun** - The bot is designed to be playful!

---

## 🎊 You're All Set!

Your bot is now your server's AI best friend! 🤖❤️

**Quick Start:**
1. Add `GOOGLE_API_KEY` to .env
2. Restart bot
3. Try: `/chat message:Hey!`
4. Or tag: `@YourBot what's up?`

**Enjoy your new AI companion!** 😊✨

---

**Version:** 2.1.0  
**API:** Google Gemini (Free)  
**Cost:** $0.00  
**Status:** 🟢 Ready to Chat!
