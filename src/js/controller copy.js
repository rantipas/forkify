import * as model from './model';
import recipeView from './views/recipeView';

import 'core-js/stable'; //polyfilling
import 'regenerator-runtime/runtime'; //support old browser

// console.log(icons);
const recipeContainer = document.querySelector('.recipe');

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

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

    //1. Loading recipe
    //returns a promise so need await so we can move to execution function
    await model.loadRecipe(id);
    // to enable again the recipe variable because of splitting the code
    const { recipe } = model.state;
    //2. Rendering recipe
    recipeView.render(model.state.recipe);
    // console.log(recipeView);
  } catch (err) {
    alert(err);
  }
};

// showRecipe(); //call the function
// he hashchange event is fired when the fragment identifier of the URL has changed (the part of the URL beginning with and following the # symbol).
// window.addEventListener('hashchange', showRecipe);
//will trigger any page load with recipe ID event in the browser
// window.addEventListener('load', showRecipe);

//showrter way for 2 or more event type using arrow function
['hashchange', 'load'].forEach(ev =>
  window.addEventListener(ev, controlRecipes)
);
