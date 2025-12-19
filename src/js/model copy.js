import 'regenerator-runtime/runtime'; //support old browser
export const state = {
  recipe: {},
};

//Fetching recipe data in API
//make connection to the api and store in a variable
export const loadRecipe = async function (id) {
  try {
    const res = await fetch(
      // 'https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bcc40'
      `https://forkify-api.herokuapp.com/api/v2/recipes/${id}`
    );

    const data = await res.json(); //will convert into json format and return an object
    //throw an error if responce is not ok
    if (!res.ok) throw new Error(`${data.message} ${res.status}`);
    console.log(res, data);

    const { recipe } = data.data; //destructure
    //renaming the object field names
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
    console.log(state.recipe);
  } catch {
    err;
    alert(err);
  }
};
