import { Question, QuestionType } from '../types';

// In a real app, this would call GPT-4o. Here we simulate the response.
// The System Prompt in the spec describes how the real AI should behave.

export const generateQuestion = async (type: QuestionType, difficulty: 'easy' | 'hard'): Promise<Question> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  if (type === 'math') {
    if (difficulty === 'easy') {
      const a = Math.floor(Math.random() * 5) + 1;
      const b = Math.floor(Math.random() * 5) + 1;
      const ans = a + b;
      return {
        id: Date.now().toString(),
        type: 'math',
        text: `${a} + ${b} = ?`,
        options: [
          (ans + 1).toString(),
          ans.toString(),
          (ans - 1).toString(),
          (ans + 2).toString()
        ].sort(() => Math.random() - 0.5),
        correctAnswer: ans.toString()
      };
    } else {
      const a = Math.floor(Math.random() * 10) + 5;
      const b = Math.floor(Math.random() * 10) + 1;
      const ans = a - b;
      return {
        id: Date.now().toString(),
        type: 'math',
        text: `${a} - ${b} = ?`,
        options: [
          (ans + 1).toString(),
          ans.toString(),
          (ans - 2).toString(),
          (ans + 3).toString()
        ].sort(() => Math.random() - 0.5),
        correctAnswer: ans.toString()
      };
    }
  } else {
    // English
    const vocab = [
      { word: 'Apple', zh: '蘋果' },
      { word: 'Cat', zh: '貓' },
      { word: 'Dog', zh: '狗' },
      { word: 'Bus', zh: '公車' },
      { word: 'Red', zh: '紅色' }
    ];
    const target = vocab[Math.floor(Math.random() * vocab.length)];
    
    return {
      id: Date.now().toString(),
      type: 'english',
      text: `${target.word} 是什麼意思?`,
      options: [
        target.zh,
        '香蕉',
        '飛機',
        '藍色'
      ].sort(() => Math.random() - 0.5),
      correctAnswer: target.zh
    };
  }
};