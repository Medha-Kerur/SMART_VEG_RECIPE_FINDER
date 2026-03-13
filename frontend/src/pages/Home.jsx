import { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, CheckCircle2, Sparkles } from 'lucide-react';
import API_BASE from '../api';

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/recipes/search`);
        setRecipes(res.data);
      } catch (err) {
        setError('Could not connect to backend to load recipes.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecipes();
  }, []);

  return (
    <div className="home-container">
      <header className="hero">
        <div className="hero-content">
          <h1>Discover Pure Vegetarian Delights</h1>
          <p>Find, share, and generate recipes daily.</p>
        </div>
      </header>
      
      <main className="recipe-grid-container">
        <h2>Latest Recipes</h2>
        {loading && <p>Loading delicious recipes...</p>}
        {error && <div className="alert error">{error}</div>}
        
        {!loading && !error && recipes.length === 0 && (
          <div className="empty-state">
             <p>No recipes found yet. Be the first to add one!</p>
          </div>
        )}
        
        <div className="recipe-grid">
          {recipes.map(recipe => (
            <div key={recipe._id} className="recipe-card">
              <div className="img-container">
                <img src={recipe.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'} alt={recipe.name} />
                {recipe.aiGenerated && (
                  <span className="badge badge-ai-absolute"><Sparkles size={12}/> AI Recipe</span>
                )}
              </div>
              <div className="card-body">
                <h3>{recipe.name}</h3>
                
                <div className="card-meta">
                  <span><Clock size={16}/> {recipe.cookingTime || '30 mins'}</span>
                  {recipe.isVeg && <span className="veg-badge"><CheckCircle2 size={16}/> Pure Veg</span>}
                </div>
                
                <div className="ingredients-preview">
                  <strong>Ingredients:</strong>
                  <p>{recipe.ingredients.slice(0, 3).join(', ')}{recipe.ingredients.length > 3 ? '...' : ''}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;