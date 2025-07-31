let mealinput = document.getElementById("meal");
let mealcontainer = document.getElementById("meals-container");
let btn = document.getElementById("btn");

btn.addEventListener('click', getMeal, false);

// function get meal
async function getMeal(e) {
  e.preventDefault();
  const meals = mealinput.value;
  const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${meals}`;
  let res = await fetch(url);
  let data = await res.json();
  console.log(res);
  console.log(data); // Data is being fetched from the API

  let mealsInfo = "";
  data.meals.forEach(m => {
    mealsInfo += `
      <div class='mealInfo' data-id='${m.idMeal}'>
        <div class='overlay'></div>
        <h4>${m.strMeal}</h4>
        <img src='${m.strMealThumb}'>
      </div>
      `;
  });

  mealcontainer.innerHTML = mealsInfo;
  mealcontainer.style.flexDirection = 'row';
}

// function one: fetch meal on search
mealcontainer.addEventListener('click', async function (e) {
  if (e.target.id !== 'back') {
    let mealDiv = e.composedPath()
      .find(item => item.classList?.contains('mealInfo'));
    if (!mealDiv) return;

    let mealId = mealDiv.getAttribute('data-id');
    if (!mealId) return;

    let [clickedMeal] = await getMealById(mealId);

    console.log(clickedMeal);

    // let's display ingredients
    let allowed = 'strIngredient';
    const filtered = Object.fromEntries(
      Object.entries(clickedMeal).filter(([key, val]) => key.includes(allowed) && val !== '')
    );

    console.log(filtered);

    let mealsInfo = `
<a href='#' class='back' id='back' onclick='getMeal(event)'> BACK </a>

<div class='meal-desc'>  
<h2>${clickedMeal.strMeal}</h2>
<img src='${clickedMeal.strMealThumb}' width='200'>
<h5>Category: ${clickedMeal.strCategory}</h5>
<p>${clickedMeal.strInstructions}</p>
</div>

<h5>INGREDIENTS</h5>

<table border='1' cellspacing='0' cellpadding='10'>
<tr>  
<th>Ingredient No:</th>
<th>Ingredient</th>
</tr>
`;

    Object.values(filtered).forEach((item, i) => {
      if (item) {
        mealsInfo += `
<tr>
<td>${i + 1}</td>
<td>${item}</td>
</tr>`;
      }
    });

    mealsInfo += `</table>`;
    mealcontainer.innerHTML = mealsInfo;
    mealcontainer.style.flexDirection = 'column';
  }
});

// function two: fetch particular meal based on id when clicked
async function getMealById(id) {
  let res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
  let data = await res.json();
  return data.meals;
}
