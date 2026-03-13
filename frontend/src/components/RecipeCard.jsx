import { Link } from 'react-router-dom';
import { Clock, CheckCircle2, Sparkles } from 'lucide-react';

const RecipeCard = ({ recipe }) => {
  return (
    <Link to={`/recipe/${recipe._id}`} className="recipe-card-link">
      <div className="recipe-card">
        <div className="img-container">
          <img 
            src={recipe.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'} 
            alt={recipe.name} 
          />
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
    </Link>
  );
};

export default RecipeCard;
