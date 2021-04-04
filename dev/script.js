document.addEventListener( 'DOMContentLoaded', function () {

  // Alert Form
  document.querySelectorAll( '.alert-form' ).forEach( ( node ) => {
    let out = document.querySelector( '.alert-form-out' );

    new AlertForm({
      node: node,
      onResponse: ( res ) => {
        try {
          out.innerText = JSON.stringify( JSON.parse( res ), null, 2 );
        } catch ( error ) {
          out.innerText = 'json parse error';
        }
      }
    });
  });

});
