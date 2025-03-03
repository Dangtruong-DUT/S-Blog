import OpenAI from 'openai';
import { env } from '@/config/env';

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY
});

interface GenerateContentParams {
  topic: string;
  keywords?: string[];
  type: 'outline' | 'full' | 'title';
  language?: 'vi' | 'en';
}

export class AIService {
  static async generateContent({
    topic,
    keywords = [],
    type,
    language = 'vi'
  }: GenerateContentParams) {
    try {
      let prompt = '';
      const keywordsText = keywords.length > 0 ? `Từ khóa: ${keywords.join(', ')}\n` : '';

      switch (type) {
        case 'outline':
          prompt = `Tạo dàn ý chi tiết cho một bài viết về chủ đề: ${topic}\n${keywordsText}`;
          break;
        case 'full':
          prompt = `Viết một bài viết hoàn chỉnh về chủ đề: ${topic}\n${keywordsText}Yêu cầu:\n- Bài viết phải có cấu trúc rõ ràng\n- Đảm bảo tính chuyên nghiệp và dễ đọc\n- Tối ưu SEO với các từ khóa đã cho`;
          break;
        case 'title':
          prompt = `Đề xuất 5 tiêu đề hấp dẫn cho bài viết về chủ đề: ${topic}\n${keywordsText}`;
          break;
      }

      if (language === 'en') {
        prompt = `Please write in English:\n${prompt}`;
      }

      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "Bạn là một chuyên gia viết nội dung chuyên nghiệp, có kinh nghiệm trong SEO và marketing content."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        model: "gpt-3.5-turbo",
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error('AI Service error:', error);
      throw new Error('Failed to generate content');
    }
  }

  static async improveContent(content: string) {
    try {
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "Bạn là một biên tập viên chuyên nghiệp. Hãy cải thiện nội dung sau đây, giữ nguyên ý chính nhưng làm cho nó hấp dẫn và chuyên nghiệp hơn."
          },
          {
            role: "user",
            content: content
          }
        ],
        model: "gpt-3.5-turbo",
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error('AI Service error:', error);
      throw new Error('Failed to improve content');
    }
  }

  static async analyzeContentSimilarity(content: string, interests: string): Promise<number> {
    try {
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "Bạn là một chuyên gia phân tích nội dung. Hãy đánh giá độ phù hợp giữa nội dung bài viết và sở thích của người dùng, trả về một số từ 0 đến 1 (0: không liên quan, 1: rất phù hợp)."
          },
          {
            role: "user",
            content: `Nội dung bài viết:\n${content}\n\nSở thích người dùng: ${interests}`
          }
        ],
        model: "gpt-3.5-turbo",
      });

      const result = completion.choices[0].message.content;
      // Chuyển kết quả thành số từ 0-1
      const score = parseFloat(result) || 0;
      return Math.max(0, Math.min(1, score));
    } catch (error) {
      console.error('AI Service error:', error);
      return 0;
    }
  }
} 