'use server';
/**
 * @fileOverview A GenAI tool to suggest and visualize unique 'gold fringe' border patterns.
 *
 * - generateGoldFringePattern - A function that generates a gold fringe border pattern image based on aesthetic preferences.
 * - GenerateGoldFringePatternInput - The input type for the generateGoldFringePattern function.
 * - GenerateGoldFringePatternOutput - The return type for the generateGoldFringePattern function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

const GoldFringePatternInputSchema = z.object({
  aestheticPreferences: z
    .string()
    .describe(
      'A detailed description of the aesthetic preferences for the gold fringe border pattern, including style, texture, and intricacy.'
    ),
});
export type GenerateGoldFringePatternInput = z.infer<typeof GoldFringePatternInputSchema>;

const GoldFringePatternOutputSchema = z.object({
  patternImage: z
    .string()
    .describe(
      "A data URI of the generated gold fringe border pattern image. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GenerateGoldFringePatternOutput = z.infer<typeof GoldFringePatternOutputSchema>;

export async function generateGoldFringePattern(
  input: GenerateGoldFringePatternInput
): Promise<GenerateGoldFringePatternOutput> {
  return generateGoldFringePatternFlow(input);
}

const generateGoldFringePatternFlow = ai.defineFlow(
  {
    name: 'generateGoldFringePatternFlow',
    inputSchema: GoldFringePatternInputSchema,
    outputSchema: GoldFringePatternOutputSchema,
  },
  async input => {
    const promptText = `Generate a high-resolution, detailed image of a unique gold fringe border pattern. The pattern should be suitable for the inner edges of elegant curtains.

Aesthetic Preferences: ${input.aestheticPreferences}

Consider elements like:
- Intricacy of the design (simple, ornate, geometric, flowing)
- Texture of the gold (polished, matte, hammered, shimmering)
- Width and density of the fringe elements
- Overall style (classic, modern, art deco, Islamic geometric)
- The background should be neutral or transparent to highlight the pattern.`;

    const {media} = await ai.generate({
      model: googleAI.model('imagen-4.0-fast-generate-001'),
      prompt: promptText,
      config: {
        responseModalities: ['IMAGE'],
      },
    });

    if (!media || !media.url) {
      throw new Error('Failed to generate image for gold fringe pattern.');
    }

    return {patternImage: media.url};
  }
);
