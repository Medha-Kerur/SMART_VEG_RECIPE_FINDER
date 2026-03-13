import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Clock, CheckCircle2, Sparkles, ChevronLeft, Utensils, ListChecks } from 'lucide-react';
import API_BASE from '../api';

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        </div>
      </div>

      <div className="recipe-content-grid">
        <section className="ingredients-section">
          <h2><ListChecks size={24} /> Ingredients</h2>
          <ul className="ingredients-list">
            {recipe.ingredients.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="instructions-section">
          <h2><Utensils size={24} /> Instructions</h2>
          <div className="instructions-text">
            {recipe.instructions || "Enjoy your delicious home-cooked meal! (Instructions coming soon)"}
          </div>
        </section>
      </div>
    </div>
  );
};

export default RecipeDetail;
