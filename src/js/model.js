import { async } from 'regenerator-runtime';
import 'regenerator-runtime/runtime'; // Support older browsers
import { API_URL, RES_PER_PAGE, API_KEY } from './config'; // ✅ Use API_KEY
import { getJSON } from './helpers';

// Global state object
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

// Load a single recipe
export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}/${id}?key=${API_KEY}`);
    const { recipe } = data.data;
    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceURL: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
    };
    state.recipe.bookmarked = state.bookmarks.some(b => b.id === id);
    state.search.page = 1;
  } catch (err) {
    console.error(`${err} 💥💥💥`);
    throw err;
  }
};

// Load search results
export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await getJSON(`${API_URL}?search=${query}&key=${API_KEY}`);
    state.search.results = data.data.recipes.map(rec => ({
      id: rec.id,
      title: rec.title,
      publisher: rec.publisher,
      image: rec.image_url,
    }));
    state.search.page = 1;
  } catch (err) {
    console.error(`${err} 💥💥💥`);
    throw err;
  }
};

// Get paginated search results
export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage; // e.g., 0 for page 1
  const end = page * state.search.resultsPerPage; // e.g., 10 for page 1
  return state.search.results.slice(start, end);
};

// Update ingredient quantities when servings change
export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });

  state.recipe.servings = newServings;
};

// Local storage helpers for bookmarks
const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

// Add a bookmark
export const addBookmark = function (recipe) {
  state.bookmarks.push(recipe);

  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
};

// Delete a bookmark
export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmarks();
};

// Initialize bookmarks from localStorage
const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};

init();

// For development: clear bookmarks
const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
// clearBookmarks();
