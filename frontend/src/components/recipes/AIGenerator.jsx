import { useState } from 'react';
import axios from 'axios';
import { Sparkles, Loader2, CheckCircle2 } from 'lucide-react';

const AIGenerator = ({ onIngredientsGenerated, userToken }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await axios.post(
        'http://localhost:5005/api/recipes/generate-ingredients',
        { prompt },
        { headers: { Authorization: `Bearer ${userToken}` } }
      );

      const aiData = response.data;
      
      // Pass the generated data back to the parent form
      onIngredientsGenerated({
        name: aiData.name,
        ingredients: aiData.ingredients.join(', '), // Convert array to string for the textarea
        aiGenerated: true
      });
      
      setSuccess(true);
      setPrompt('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate from AI');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-generator-box">
      <div className="ai-header">
        <h3><Sparkles size={20} className="ai-icon" /> AI Kitchen Assistant</h3>
        <p>Tell us what ingredients you have, or what you're craving!</p>
      </div>

      <form onSubmit={handleGenerate} className="ai-form">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., I have potatoes, peas, and some spices..."
          className="ai-input"
          disabled={loading}
        />
        <button type="submit" className="btn-ai" disabled={loading || !prompt.trim()}>
          {loading ? <Loader2 size={18} className="spinner" /> : 'Generate Idea'}
        </button>
      </form>

      {error && <div className="alert error sm mt-2">{error}</div>}
      {success && (
        <div className="alert success sm mt-2 ai-success">
          <CheckCircle2 size={16} /> Recipe structured successfully! Check the fields below.
        </div>
      )}
    </div>
  );
};

export default AIGenerator;
