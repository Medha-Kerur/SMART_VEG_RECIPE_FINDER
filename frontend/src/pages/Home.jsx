import { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, CheckCircle2, Sparkles } from 'lucide-react';
import RecipeCard from '../components/RecipeCard';
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
            <RecipeCard key={recipe._id} recipe={recipe} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;