// require('dotenv').config();

const input = document.getElementById("input");
const add = document.getElementById("add");
const search = document.getElementById("search");
const tags = document.getElementById("tags");
const searchForm = document.getElementById("search-form");
const items = [];
const autocomplete = document.getElementById('autocomplete')
const div = document.createElement('div')
let spans = ''
div.classList.add('autocomplete')
// const token = process.env["API_TOKEN"];
// const urlKey = `&apiKey=${token}`;


add.addEventListener("click", (text) => {
  div.innerHTML = ''
  const newIngredient = input.value;
  if (newIngredient !== "" && checkIfExists(newIngredient)) {
    // console.log(newIngredient);
    const span = document.createElement("span");
    const del = document.createElement("span");
    const inputIngredient = document.createElement("input");

    let splitText = newIngredient.split("");
    splitText[0] = splitText[0].toUpperCase();
    splitText = splitText.join("");
    span.classList.add("tag");
    span.setAttribute("name", newIngredient);
    span.setAttribute("value", newIngredient);
    span.innerHTML = splitText;

    inputIngredient.setAttribute("name", "ingredients");
    inputIngredient.setAttribute("type", "hidden");
    inputIngredient.setAttribute("value", newIngredient);
    inputIngredient.setAttribute("id", "i-" + newIngredient);

    del.classList.add("delete");
    del.innerHTML = "X";
    del.setAttribute("id", "x-" + newIngredient);
    del.addEventListener("click", (elem) => {
      let close = elem.target.id;
      let idInput = close.split("-");
      idInput = idInput[1];
      let getInput = document.getElementById("i-" + idInput);
      searchForm.removeChild(getInput);
      let parentClose = document.getElementById(close).parentElement;
      tags.removeChild(parentClose);
      items.forEach((item, index) => {
        if (item === newIngredient) {
          items.splice(index, 1);
          checkInput()
        }
      });
    });
    span.appendChild(del);
    tags.appendChild(span);
    searchForm.appendChild(inputIngredient);
    items.push(newIngredient);
    input.value = "";
  }
  checkInput();
});

function checkIfNumber(text) {
  const tSplit = text.split("");
  let can = true;
  const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "."];
  tSplit.forEach((l) => {
    if (numbers.includes(+l)) can = false;
  });
  return can;
}

function checkIfExists(text) {
  let exist = true;
  if (items.includes(text)) {
    const alert = document.getElementById("exist");
    alert.classList.remove("noMostrar");
    setTimeout(() => {
      alert.classList.add("noMostrar");
    }, 3000);
    exist = false;
  }
  return exist;
}

const checkInput = () => {
  if (items.length >= 0 && items.length <= 2) {
    searchForm.classList.add("noMostrar");
    input.disabled = false
  }

  if (items.length == 0) {
    input.placeholder = "What ingredients do you have?"
  } else if (items.length == 1) {
    input.placeholder = "Add two more ingredients";
  } else if (items.length == 2) {
    input.placeholder = "Add one more ingredient";
  } else {
    searchForm.classList.remove("noMostrar");
    input.placeholder = 'Click on Search!'
    input.disabled = true
  } 
  return;
};

window.onload = function () {
  document.getElementById("input").onkeypress = function searchKeyPress(event) {
    if (event.keyCode == 13) {
      document.getElementById("add").click();
    }
  };

  

  //  document.getElementById('add').onclick = doSomething;
};

input.addEventListener('keyup', (event) => {
  const { value } = event.target
  if (value.length < 3) return
  axios
    .get(`https://api.spoonacular.com/food/ingredients/autocomplete?query=${value}&number=5&apiKey=7eb554676862479cb1af0e683768a3c3`)
    .then(response => {
      if (response.data.length > 0) {
        const list = response.data.map((ingredient) => `<span class="search-options">${ingredient.name}</span>`)
        div.innerHTML = list
        autocomplete.appendChild(div)

        document
          .querySelectorAll('.search-options')
          .forEach(span => {
            span.addEventListener('click', (event) => {
              input.value = event.target.innerText
              add.click()
            })
          })
      } else {
        div.innerHTML = ''
      }
      // console.log(response.data)
    })
    .catch(error => console.log(error))
})

