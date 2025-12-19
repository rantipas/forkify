import * as model from './model';
import recipeView from './views/recipeView';
import searchView from './views/searchView';
import resultsView from './views/resultsView';
import paginationView from './views/paginationView';
import bookmarksView from './views/bookmarksView';
import addRecipeView from './views/addRecipeView';

import 'core-js/stable'; //polyfilling
import 'regenerator-runtime/runtime'; //support old browser
import { async } from 'regenerator-runtime';

// if (module.hot) {
//   module.hot.accept;
// }
// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

//=============288. Loading a Recipe from API========================
//async function run in the background and not blocking main execution
const controlRecipes = async function () {
  try {
    //will get dynamically change the value inside the "search-results" class and add to the api connection
    const id = window.location.hash.slice(1);
    console.log(id);
    if (!id) return; // to return home page when there is no ID result during page load

    recipeView.renderSpinner(); //render the spinner animation to the parent element

    //0  Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    //1 updating bookmarks view
    // debugger;
    bookmarksView.update(model.state.bookmarks);

    //2. Loading recipe from model.js with "id" and will return a promise
    await model.loadRecipe(id);
    //this make below template "${recipe" to work
    // const { recipe } = model.state;

    //3. Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    //1. Get search query
    const query = searchView.getQuery();
    if (!query) return;
    //2. Load search results
    await model.loadSearchResults(query);
    //3. Render results
    // console.log(model.state.search.results);
    // resultsView.render(model.state.search.results);
    console.log(model.getSearchResultsPage);
    resultsView.render(model.getSearchResultsPage(1));

    //4 Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  console.log(goToPage);
  //3. Render NEW results
  // console.log(model.state.search.results);
  // resultsView.render(model.state.search.results);
  console.log(model.getSearchResultsPage);
  resultsView.render(model.getSearchResultsPage(goToPage));

  //4 Render initial NEW pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //Update the recipe servings (in state)
  model.updateServings(newServings);
  //update the recipe view
  // recipeView.render(model.state.recipe); this will render all the recipeView
  recipeView.update(model.state.recipe); //this will only update text attribute in the DOM
};

const controlAddBookmark = function () {
  //1 Add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  //2 Update recipe view
  console.log(model.state.recipe);
  recipeView.update(model.state.recipe);

  //3 Render Bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = function (newRecipe) {
  console.log(newRecipe);

  //upload new recipe data
};
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
