import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { Trash2, Edit, Loader2, Plus, X, Save } from 'lucide-react';
import API_BASE from '../api';

const EMPTY_FORM = {
  name: '',
  ingredients: '',
  instructions: '',
  cookingTime: '',
  image: '',
  isVeg: true,
};

const AdminDashboard = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const { user } = useContext(AuthContext);

  const authHeader = { Authorization: `Bearer ${user.token}` };

  const fetchRecipes = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/admin/recipes`, {
        headers: authHeader,
      });
      setRecipes(res.data);
    } catch {
      setError('Failed to fetch recipes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRecipes(); }, []);

  const openCreate = () => {
    setEditingRecipe(null);
    setFormData(EMPTY_FORM);
    setFormError('');
    setShowModal(true);
  };

  const openEdit = (recipe) => {
    setEditingRecipe(recipe);
    setFormData({
      name: recipe.name || '',
      ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients.join(', ') : '',
      instructions: recipe.instructions || '',
      cookingTime: recipe.cookingTime || '',
      image: recipe.image || '',
      isVeg: recipe.isVeg ?? true,
    });
    setFormError('');
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setEditingRecipe(null); };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const toPayload = () => ({
    ...formData,
    ingredients: formData.ingredients.split(',').map(i => i.trim()).filter(Boolean),
  });

  const handleCreate = async () => {
    if (!formData.name.trim()) return setFormError('Recipe name is required');
    setSaving(true); setFormError('');
    try {
      const res = await axios.post(`${API_BASE}/api/admin/recipes`, toPayload(), { headers: authHeader });
      setRecipes(prev => [res.data, ...prev]);
      closeModal();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create recipe');
    } finally { setSaving(false); }
  };

  const handleUpdate = async () => {
    if (!formData.name.trim()) return setFormError('Recipe name is required');
    setSaving(true); setFormError('');
    try {
      const res = await axios.put(
        `${API_BASE}/api/admin/recipes/${editingRecipe._id}`,
        toPayload(),
        { headers: authHeader }
      );
      setRecipes(prev => prev.map(r => r._id === editingRecipe._id ? res.data : r));
      closeModal();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to update recipe');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this recipe? This cannot be undone.')) return;
    try {
      await axios.delete(`${API_BASE}/api/admin/recipes/${id}`, { headers: authHeader });
      setRecipes(prev => prev.filter(r => r._id !== id));
    } catch { alert('Error deleting recipe'); }
  };

  if (loading) return (
    <div className="loading-state">
      <Loader2 className="spinner" size={28} /> Loading dashboard…
    </div>
  );

  return (
    <div className="admin-container">
      <div className="admin-header">
        <div>
          <h2>Admin Dashboard</h2>
          <p>Manage all recipes on the platform</p>
        </div>
        <button className="btn-primary" onClick={openCreate}>
          <Plus size={18} /> Add Recipe
        </button>
      </div>

      {error && <div className="alert error">{error}</div>}

      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Ingredients</th>
              <th>Cook Time</th>
              <th>Veg</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {recipes.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center empty-row">
                  No recipes yet — click "Add Recipe" to create one.
                </td>
              </tr>
            ) : (
              recipes.map(recipe => (
                <tr key={recipe._id}>
                  <td>
                    <img
                      src={recipe.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=80&q=60'}
                      alt={recipe.name}
                      className="admin-recipe-img"
                    />
                  </td>
                  <td><strong>{recipe.name}</strong></td>
                  <td className="ingredient-cell">
                    {recipe.ingredients?.slice(0, 3).join(', ')}{recipe.ingredients?.length > 3 ? '…' : ''}
                  </td>
                  <td>{recipe.cookingTime || 'N/A'}</td>
                  <td>
                    {recipe.isVeg
                      ? <span className="badge badge-veg">🌿 Veg</span>
                      : <span className="badge badge-nonveg">Non-Veg</span>}
                  </td>
                  <td className="actions-cell">
                    <button className="btn-icon text-edit" title="Edit" onClick={() => openEdit(recipe)}>
                      <Edit size={18} />
                    </button>
                    <button className="btn-icon text-danger" title="Delete" onClick={() => handleDelete(recipe._id)}>
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingRecipe ? 'Edit Recipe' : 'Add New Recipe'}</h3>
              <button className="btn-icon" onClick={closeModal}><X size={20} /></button>
            </div>

            {formError && <div className="alert error sm" style={{ margin: '0 1.5rem 1rem' }}>{formError}</div>}

            <div className="modal-body">
              <div className="form-group">
                <label>Recipe Name *</label>
                <input name="name" value={formData.name} onChange={handleFormChange} placeholder="e.g. Palak Paneer" />
              </div>
              <div className="form-group">
                <label>Ingredients (comma separated)</label>
                <textarea name="ingredients" value={formData.ingredients} onChange={handleFormChange} rows="3" placeholder="Spinach, Paneer, Garlic, Cream..." />
              </div>
              <div className="form-group">
                <label>Instructions</label>
                <textarea name="instructions" value={formData.instructions} onChange={handleFormChange} rows="4" placeholder="Step-by-step cooking instructions..." />
              </div>
              <div className="form-row">
                <div className="form-group half">
                  <label>Cooking Time</label>
                  <input name="cookingTime" value={formData.cookingTime} onChange={handleFormChange} placeholder="e.g. 30 mins" />
                </div>
                <div className="form-group half">
                  <label>Image URL</label>
                  <input name="image" value={formData.image} onChange={handleFormChange} placeholder="https://..." />
                </div>
              </div>
              <div className="form-group checkbox-group">
                <label className="checkbox-container">
                  <input type="checkbox" name="isVeg" checked={formData.isVeg} onChange={handleFormChange} />
                  <span className="checkmark"></span>
                  Pure Vegetarian Recipe
                </label>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={closeModal}>Cancel</button>
              <button className="btn-primary" onClick={editingRecipe ? handleUpdate : handleCreate} disabled={saving}>
                {saving ? <Loader2 size={16} className="spinner" /> : <Save size={16} />}
                {saving ? 'Saving…' : editingRecipe ? 'Update Recipe' : 'Create Recipe'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
