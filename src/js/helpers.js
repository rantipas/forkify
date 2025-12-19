import { async } from 'regenerator-runtime';
import { TIMEOUT_SECONDS } from './config';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const getJSON = async function (url) {
  try {
    const fetchPro = fetch(url);
    //1. Loading recipe
    //make connection to the api and store in a variable and return a response
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SECONDS)]);

    // 'https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bcc40'
    // `${API_URL}/${id}`

    //will convert into json format and return an object, await is needed in order to return a promise
    const data = await res.json();
    //throw an error if responce is not ok
    if (!res.ok) throw new Error(`${data.message} ${res.status}`);
    return data;
    console.log(res, data);
  } catch (err) {
    throw err;
  }
};
