import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

export const generateIngredients = async (prompt) => {
  if (!genAI) {
    const p = prompt.toLowerCase();
    if (p.includes('potato') || p.includes('aloo'))
      return { name: 'Aloo Matar (Mock)', ingredients: ['2 Potatoes', '1 cup Peas', '1 Onion', '2 Tomatoes', '1 tsp Garam Masala', 'Salt'] };
    if (p.includes('paneer'))
      return { name: 'Palak Paneer (Mock)', ingredients: ['250g Paneer', '1 bunch Spinach', '1 Onion', '2 Garlic cloves', '1 tbsp Cream', 'Salt'] };
    return { name: 'Mixed Veg Curry (Mock)', ingredients: ['1 cup Mixed Vegetables', '2 Onions', '2 Tomatoes', '1 tsp Turmeric', 'Salt, Oil'] };
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const result = await model.generateContent(
    `You are a vegetarian chef. For the input: "${prompt}", return ONLY valid JSON (no markdown):
    {"name":"Recipe Name","ingredients":["item 1","item 2"]}`
  );
  return JSON.parse(result.response.text().replace(/```json|```/g, '').trim());
};

export const getChefTip = async (recipeName, ingredients) => {
  if (!genAI) {
    return "Chef's Tip: Use fresh herbs for a more vibrant flavor! (Mock Tip)";
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const result = await model.generateContent(
    `You are a professional vegetarian chef. For the recipe "${recipeName}" with ingredients [${ingredients.join(', ')}], provide a short, helpful professional chef's tip or a possible secret ingredient/substitution to make it taste premium. Keep it under 2 sentences.`
  );
  return result.response.text().trim();
};
