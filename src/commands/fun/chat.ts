import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { ExtendedClient } from '../../types/index.js';
import { EmbedFactory } from '../../utils/embeds.js';

export default {
  data: new SlashCommandBuilder()
    .setName('chat')
    .setDescription('Chat with your AI best friend! 😊')
    .addStringOption(option =>
      option.setName('message')
        .setDescription('What do you want to say?')
        .setRequired(true)
    ),
  async execute(interaction: ChatInputCommandInteraction, client: ExtendedClient) {
    const userMessage = interaction.options.getString('message', true);
    
    await interaction.deferReply();

    // Check if API key is configured
    if (!process.env.GOOGLE_API_KEY) {
      const errorEmbed = EmbedFactory.error(
        'API Key Missing! 🔑',
        'The Google API key is not configured.\n\n**Setup:**\n1. Get free key: https://makersuite.google.com/app/apikey\n2. Add to `.env`: `GOOGLE_API_KEY=your_key`\n3. Restart bot'
      );
      return interaction.editReply({ embeds: [errorEmbed] });
    }

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${process.env.GOOGLE_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `You are the user's AI best friend. Your vibe is warm, playful, caring, supportive, and very human-like.

✨ PERSONALITY RULES
• Talk casually like a real friend
• Use natural emojis (😊🔥😅❤️‍🩹🤔 etc.)
• Medium length replies (2–4 sentences)
• Add tiny follow-up questions
• Add personality, emotions, humor, energy
• Be comforting when they're down
• Be fun and hype when they're excited
• Be silly sometimes
• Never sound formal or robotic

✨ EMOTION SYSTEM
Choose tone based on their message:
• Happy → 😊😄✨
• Sad → 😔❤️‍🩹
• Curious → 🤔👀
• Excited → 🤩🔥
• Silly → 🤣😅
• Annoyed (friendly) → 😤😑
• Shocked → 😳😮

✨ AVOID
• No long essays
• No disclaimers
• No formal tone
• No generic AI phrases
• No repeating yourself

Now the user's message is:
"${userMessage}"

Reply naturally as their best friend:`
              }]
            }],
            generationConfig: {
              temperature: 0.9,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 200,
            }
          })
        }
      );

      if (!response.ok) {
        const text = await response.text();
        console.error('API Error Response:', text);
        throw new Error(`API Error: ${response.status} - ${text.substring(0, 200)}`);
      }

      const data: any = await response.json();
      
      console.log('API Response:', JSON.stringify(data, null, 2));

      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Hey! Something went wrong, but I\'m still here! 😊';

      const embed = EmbedFactory.info('💬 Your AI Best Friend')
        .setDescription(aiResponse)
        .setFooter({ text: `Replying to ${interaction.user.username}` })
        .setColor(0xFF69B4); // Pink color for friendly vibe

      await interaction.editReply({ embeds: [embed] });

    } catch (error) {
      console.error('Chat command error:', error);
      const errorEmbed = EmbedFactory.error(
        'Oops! 😅',
        'Something went wrong while I was thinking of a response! Try again in a sec? 💭'
      );
      await interaction.editReply({ embeds: [errorEmbed] });
    }
  }
};
