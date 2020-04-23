
document.querySelectorAll( '.btn-like' ).forEach( elem => {
	elem.addEventListener( 'click', event => {
		event.preventDefault();
		const id = event.target.parentElement.id
		axios.post( `http://localhost:3000/updatelikes/${id}` )
			.then( () => {
				const classId = document.getElementById( `i-${id}` )

				classId.classList.add( 'liked-recipe' )
				classId.innerHTML = +classId.textContent + 1

				if(classId.classList.contains('liked-recipe')) {
					elem.disabled = true
				}

				console.log( document.getElementById( `i-${id}` ).textContent )
			} )
			.catch( error => console.log( error ) )
	} )
} )