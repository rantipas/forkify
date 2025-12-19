//this will import the icons in dist folder and change in render part with
// ${icons}
import icons from 'url:../img/icons.svg'; //Parcel 2
import 'core-js/stable'; //polyfilling
import 'regenerator-runtime/runtime'; //support old browser

console.log(icons);
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
//will make spinner animation before loading recipe image
const renderSpinner = function (parentEl) {
  const markup = `
  <div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
        </div>
  `;
  parentEl.innerHTML = '';
  parentEl.insertAdjacentHTML('afterbegin', markup);
};
//=============288. Loading a Recipe from API========================
//async function run in the background and not blocking main execution
const showRecipe = async function () {
  try {
    //will get dynamically change the value inside the "search-results" class and add to the api connection
    const id = window.location.hash.slice(1);
    console.log(id);
    if (!id) return; // to return home page when there is no ID result during page load

    renderSpinner(recipeContainer); //render the spinner animation to the parent element
    //1. Loading recipe
    //make connection to the api and store in a variable
    const res = await fetch(
      // 'https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bcc40'
      `https://forkify-api.herokuapp.com/api/v2/recipes/${id}`
    );

    const data = await res.json(); //will convert into json format and return an object
    //throw an error if responce is not ok
    if (!res.ok) throw new Error(`${data.message} ${res.status}`);
    console.log(res, data);

    let { recipe } = data.data; //destructure
    //renaming the object field names
    recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceURL: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
    };
    console.log(recipe);

    //2. Rendering recipe
    const markup = `
    
<figure class="recipe__fig">
<img src="${recipe.image}" alt="${recipe.title}" class="recipe__img" />
<h1 class="recipe__title">
  <span>${recipe.title}</span>
</h1>
</figure>

<div class="recipe__details">
<div class="recipe__info">
  <svg class="recipe__info-icon">
    <use href="${icons}#icon-clock"></use>
  </svg>
  <span class="recipe__info-data recipe__info-data--minutes">${
    recipe.cookingTime
  }</span>
  <span class="recipe__info-text">minutes</span>
</div>
<div class="recipe__info">
  <svg class="recipe__info-icon">
    <use href="${icons}#icon-users"></use>
  </svg>
  <span class="recipe__info-data recipe__info-data--people">${
    recipe.servings
  }</span>
  <span class="recipe__info-text">servings</span>

  <div class="recipe__info-buttons">
    <button class="btn--tiny btn--increase-servings">
      <svg>
        <use href="${icons}#icon-minus-circle"></use>
      </svg>
    </button>
    <button class="btn--tiny btn--increase-servings">
      <svg>
        <use href="${icons}#icon-plus-circle"></use>
      </svg>
    </button>
  </div>
</div>

<div class="recipe__user-generated">
  <svg>
    <use href="${icons}#icon-user"></use>
  </svg>
</div>
<button class="btn--round">
  <svg class="">
    <use href="${icons}#icon-bookmark-fill"></use>
  </svg>
</button>
</div>

<div class="recipe__ingredients">
<h2 class="heading--2">Recipe ingredients</h2>
<ul class="recipe__ingredient-list">

${recipe.ingredients
  .map(ing => {
    //map method will loop to the ingredients sub object
    return `
  <li class="recipe__ingredient">
    <svg class="recipe__icon">
      <use href="src/img/icons.svg#icon-check"></use>
    </svg>
    <div class="recipe__quantity">${ing.quantity}</div>
    <div class="recipe__description">
      <span class="recipe__unit">${ing.unit}</span>
      ${ing.description}
    </div>
  </li>
  `;
  })
  //join will tranform array of string into a big string
  //see "notes" folder recipe_ingredients_before_join.jpg
  .join('')} 
</ul>
</div>

<div class="recipe__directions">
<h2 class="heading--2">How to cook it</h2>
<p class="recipe__directions-text">
  This recipe was carefully designed and tested by
  <span class="recipe__publisher">${recipe.publisher}</span>. Please check out
  directions at their website.
</p>
<a
  class="btn--small recipe__btn"
  href="${recipe.sourceURL}"
  target="_blank"
>
  <span>Directions</span>
  <svg class="search__icon">
    <use href="src/img/icons.svg#icon-arrow-right"></use>
  </svg>
</a>
</div>
`;
    // remove footer message<p>Start by searching for a recipe or an ingredient. Have fun!</p>
    recipeContainer.innerHTML = '';
    recipeContainer.insertAdjacentHTML('afterbegin', markup); //render the recipe
  } catch (err) {
    alert(err);
  }
};

// showRecipe(); //call the function
// he hashchange event is fired when the fragment identifier of the URL has changed (the part of the URL beginning with and following the # symbol).
// window.addEventListener('hashchange', showRecipe);
//will trigger any reload event in the browser
// window.addEventListener('load', showRecipe);

//showrter way for 2 or more event type using arrow function
['hashchange', 'load'].forEach(ev => window.addEventListener(ev, showRecipe));
