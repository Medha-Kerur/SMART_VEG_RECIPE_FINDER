import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Clock, CheckCircle2, Sparkles, ChevronLeft, 
  Utensils, ListChecks, Users, Plus, Minus, Wand2, Loader2
} from 'lucide-react';
import API_BASE from '../api';

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Dynamic features state
  const [servings, setServings] = useState(1);
  const [checkedIngredients, setCheckedIngredients] = useState([]);
  const [chefTip, setChefTip] = useState('');
  const [loadingTip, setLoadingTip] = useState(false);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/recipes/${id}`);
        setRecipe(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Could not fetch recipe details.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  const toggleIngredient = (index) => {
    if (checkedIngredients.includes(index)) {
      setCheckedIngredients(checkedIngredients.filter(i => i !== index));
    } else {
      setCheckedIngredients([...checkedIngredients, index]);
    }
  };

  const fetchChefTip = async () => {
    if (chefTip) return; // Only fetch once
    setLoadingTip(true);
    try {
      const res = await axios.get(`${API_BASE}/api/recipes/${id}/tip`);
      setChefTip(res.data.tip);
    } catch (err) {
      console.error('Failed to fetch chef tip');
    } finally {
      setLoadingTip(false);
    }
  };

  // Helper to scale quantities in ingredient strings
  const formatIngredient = (text) => {
    if (servings === 1) return text;
    
    // Simple regex to find numbers/fractions at the beginning
    // e.g., "2 cups", "1/2 tsp", "1.5 kg"
    return text.replace(/^(\d+\/?\.?\d*)/, (match) => {
      if (match.includes('/')) {
        const [num, den] = match.split('/').map(Number);
        return ((num / den) * servings).toFixed(2).replace(/\.?0+$/, '');
      }
      return (Number(match) * servings).toString();
    });
  };

  if (loading) return <div className="loading-container"><div className="loader"></div><p>Sizzling your recipe...</p></div>;
  if (error) return (
    <div className="error-container">
      <div className="alert error">{error}</div>
      <button className="btn btn-primary" onClick={() => navigate('/')}>Back to Home</button>
    </div>
  );
  if (!recipe) return <div className="error-container"><p>Recipe not found.</p><button className="btn btn-primary" onClick={() => navigate('/')}>Back to Home</button></div>;

  return (
    <div className="recipe-detail-container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <ChevronLeft size={20} /> Back
      </button>

      <div className="recipe-header">
        <div className="recipe-image-hero">
          <img src={recipe.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'} alt={recipe.name} />
          {recipe.aiGenerated && (
            <span className="badge badge-ai-detail"><Sparkles size={16}/> AI Crafted</span>
          )}
        </div>
        
        <div className="recipe-title-section">
          <h1>{recipe.name}</h1>
          <div className="recipe-meta-badges">
            <span className="meta-item"><Clock size={20}/> {recipe.cookingTime || '30 mins'}</span>
            {recipe.isVeg && <span className="meta-item veg"><CheckCircle2 size={20}/> Pure Veg</span>}
          </div>

          <div className="servings-control">
            <span className="servings-label"><Users size={18} /> Servings:</span>
            <div className="counter">
              <button onClick={() => setServings(Math.max(1, servings - 1))} className="count-btn"><Minus size={14}/></button>
              <span className="count-val">{servings}</span>
              <button onClick={() => setServings(servings + 1)} className="count-btn"><Plus size={14}/></button>
            </div>
          </div>
        </div>
      </div>

      <div className="recipe-content-grid">
        <section className="ingredients-section">
          <div className="section-header-flex">
            <h2><ListChecks size={24} /> Ingredients</h2>
            <p className="hint">Click to check off items</p>
          </div>
          <ul className="ingredients-checklist">
            {recipe.ingredients.map((item, index) => (
              <li 
                key={index} 
                className={checkedIngredients.includes(index) ? 'checked' : ''}
                onClick={() => toggleIngredient(index)}
              >
                <div className="checkbox-indicator">
                   {checkedIngredients.includes(index) && <CheckCircle2 size={14}/>}
                </div>
                <span>{formatIngredient(item)}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="instructions-section">
          <div className="section-header-flex">
            <h2><Utensils size={24} /> Instructions</h2>
            <button className="btn-ai-tip" onClick={fetchChefTip} disabled={loadingTip}>
              {loadingTip ? <Loader2 size={16} className="spinner"/> : <Wand2 size={16}/>}
              {chefTip ? "Chef's Tip Applied" : "Ask for Chef's Tip"}
            </button>
          </div>
          
          {chefTip && (
            <div className="chef-tip-box fade-in">
              <Sparkles size={20} className="tip-icon" />
              <p>{chefTip}</p>
            </div>
          )}

          <div className="instructions-text">
            {recipe.instructions || "Enjoy your delicious home-cooked meal! (Instructions coming soon)"}
          </div>
        </section>
      </div>
    </div>
  );
};

export default RecipeDetail;
