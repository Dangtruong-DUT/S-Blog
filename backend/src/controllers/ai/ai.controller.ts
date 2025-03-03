import { Request, Response } from 'express';
import { AIService } from '@/services/ai.service';

export const generateContent = async (req: Request, res: Response) => {
  try {
    const { topic, keywords, type, language } = req.body;
    
    const content = await AIService.generateContent({
      topic,
      keywords,
      type,
      language
    });

    res.json({ content });
  } catch (error) {
    console.error('Generate content error:', error);
    res.status(500).json({ message: 'Failed to generate content' });
  }
};

export const improveContent = async (req: Request, res: Response) => {
  try {
    const { content } = req.body;
    
    const improvedContent = await AIService.improveContent(content);

    res.json({ content: improvedContent });
  } catch (error) {
    console.error('Improve content error:', error);
    res.status(500).json({ message: 'Failed to improve content' });
  }
}; 