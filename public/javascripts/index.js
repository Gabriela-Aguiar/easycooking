const input   = document.getElementById('input');
const add = document.getElementById('add');
const search  = document.getElementById('search-btn');
const tags    = document.getElementById('tags');
const items   = [];

add.addEventListener('click', text => {
    const newIngredient = input.value;

    if( newIngredient !== '' && checkIfNumber(newIngredient) && checkIfExists(newIngredient)){
      const span = document.createElement('span');
      const del = document.createElement('span');
      let splitText = newIngredient.split('');
      splitText[0] = splitText[0].toUpperCase();
      splitText = splitText.join('');
      span.classList.add('tag');  
      span.innerHTML = splitText  ;
      del.classList.add('delete');
      del.innerHTML = 'x';
      del.setAttribute('id', 'x-'+ newIngredient)
      del.addEventListener('click', elem => {
        let close = elem.target.id;
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
      items.push(newIngredient)
      input.value = ''
    }
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