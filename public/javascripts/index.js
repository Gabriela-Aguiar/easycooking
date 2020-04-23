const input   = document.getElementById('input');
const add     = document.getElementById('add');
const search  = document.getElementById('search');
const tags    = document.getElementById('tags');
const searchForm = document.getElementById('search-form')
const items   = [];

add.addEventListener('click', text => {
    const newIngredient = input.value;
    if( newIngredient !== '' && checkIfExists(newIngredient)){
      console.log(newIngredient);
      const span = document.createElement('span');
      const del = document.createElement('span');
      const inputIngredient = document.createElement('input')

      let splitText = newIngredient.split('');
      splitText[0] = splitText[0].toUpperCase();
      splitText = splitText.join('');
      span.classList.add('tag');  
      span.setAttribute('name', newIngredient)
      span.setAttribute('value', newIngredient)
      span.innerHTML = splitText  ;

      inputIngredient.setAttribute('name', 'ingredients')
      inputIngredient.setAttribute('type', 'hidden')
      inputIngredient.setAttribute('value', newIngredient)
      inputIngredient.setAttribute('id', 'i-'+newIngredient)

      del.classList.add('delete');
      del.innerHTML = 'x';
      del.setAttribute('id', 'x-'+ newIngredient)
      del.addEventListener('click', elem => {
        let close = elem.target.id;
        let idInput = close.split('-');
        idInput = idInput[1];
        let getInput = document.getElementById('i-'+ idInput);
        searchForm.removeChild(getInput);
        let parentClose = document.getElementById(close).parentElement;
        tags.removeChild(parentClose)
        items.forEach( (item,index) => {
          if(item === newIngredient){
            items.splice( index,1 );
          }
        })
      })
      span.appendChild(del);
      tags.appendChild(span)
      searchForm.appendChild(inputIngredient)
      items.push(newIngredient)
      if(items.length >=3){
        searchForm.classList.remove('noMostrar')
      }
      input.value = ''
    }
    checkInput();
  })

  function checkIfNumber(text){
    const tSplit = text.split('');
    let can = true;
    const numbers = [0,1,2,3,4,5,6,7,8,9,'.'];
    tSplit.forEach( l => {
      if( numbers.includes(+l) ) can = false;
    })
    return can;
  }
  
  function checkIfExists( text ){
    let exist = true;
    if(items.includes( text )) {
      const alert = document.getElementById('exist');
      alert.classList.remove('noMostrar')
      setTimeout( () => {
        alert.classList.add('noMostrar')
      },3000)
      exist = false
    }
    return exist;
  }

  const checkInput = () => {
    if(items.length == 1){
      input.placeholder = 'Add two more ingredients'
    } else if (items.length == 2) {
      input.placeholder = 'Add one more ingredient'
    } else {
      input.placeholder = "What ingredients do you have?"
    }
    return;
  }

  window.onload = function() {
    document.getElementById('input').onkeypress = function searchKeyPress(event) {
       if (event.keyCode == 13) {
           document.getElementById('add').click();
       }
   };

  //  document.getElementById('add').onclick = doSomething;
}

