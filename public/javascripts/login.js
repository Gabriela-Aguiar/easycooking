const slideAnimation = () => {
  let slideBox = document.getElementById('slideBox')
  let topLayer = document.querySelector('.topLayer')

  slideBox.style.marginLeft = '0%'
  topLayer.style.marginLeft = '100%'
}

if(document.getElementById('error-msg-signup')){
  slideAnimation()
}


$( document ).ready( function () {
  $( '#goRight' ).on( 'click', function () {
    $( '#slideBox' ).animate( {
      'marginLeft': '0'
    } );
    $( '.topLayer' ).animate( {
      'marginLeft': '100%'
    } );
  } );

  $( '#goLeft' ).on( 'click', function () {
    $( '#slideBox' ).animate( {
      'marginLeft': '50%'
    } );
    $( '.topLayer' ).animate( {
      'marginLeft': '0'
    } );
  } );
} );

