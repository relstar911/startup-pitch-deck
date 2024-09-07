import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

interface FormData {
  companyName: string;
  startupIdea: string;
  problemStatement: string;
  solution: string;
  marketDescription: string;
  marketSize: string;
  targetCustomer: string;
  competitors: string;
  uniqueSellingProposition: string;
  revenueModel: string;
  marketingStrategy: string;
  teamMembers: string;
  fundingNeeds: string;
}

export async function generateSlideContent(formData: FormData) {
  try {
    const prompt = `Create a professional startup pitch deck with 6 slides based on the following information:
    Company Name: ${formData.companyName}
    Startup Idea: ${formData.startupIdea}
    Problem Statement: ${formData.problemStatement}
    Solution: ${formData.solution}
    Market Description: ${formData.marketDescription}
    Market Size: ${formData.marketSize}
    Target Customer: ${formData.targetCustomer}
    Competitors: ${formData.competitors}
    Unique Selling Proposition: ${formData.uniqueSellingProposition}
    Revenue Model: ${formData.revenueModel}
    Marketing Strategy: ${formData.marketingStrategy}
    Team Members: ${formData.teamMembers}
    Funding Needs: ${formData.fundingNeeds}

    For each slide, provide:
    1. A title
    2. 3-5 bullet points of content
    3. A prompt for DALL-E to generate an relevant image

    Return the result as a JSON object with this structure:
    {
      "slides": [
        {
          "title": "Slide Title",
          "content": ["Bullet point 1", "Bullet point 2", "Bullet point 3"],
          "imagePrompt": "Prompt for DALL-E to generate an image for this slide"
        },
        // ... (5 more slide objects)
      ]
    }`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });

    const slideContent = JSON.parse(response.choices[0].message.content || '{}');

    // Generate images for each slide
    for (const slide of slideContent.slides) {
      try {
        const image = await openai.images.generate({
          model: "dall-e-3",
          prompt: slide.imagePrompt,
          n: 1,
          size: "1024x1024",
        });

        slide.imageUrl = image.data[0].url;
      } catch (imageError) {
        console.error('Error generating image:', imageError);
        slide.imageUrl = undefined; // Set to undefined if image generation fails
      }
    }

    return slideContent;
  } catch (error) {
    console.error('Error generating slide content:', error);
    throw new Error('Failed to generate slide content');
  }
}
