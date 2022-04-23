import AlertForm from './alert-form.js';

document.addEventListener( 'DOMContentLoaded', function () {
	// Alert Form
	document.querySelectorAll( '.alert-form' ).forEach( ( node ) => {
		new AlertForm({ node: node });

		let
			nameInput = node.querySelector( '[name="name"]' ),
			timeInput = node.querySelector( '[name="time"]' ),
			textInput = node.querySelector( '[name="text"]' );

		node.querySelectorAll( '[data-sample]' ).forEach( ( btnNode ) => {
			btnNode.addEventListener( 'click', function () {
				let sampleData = JSON.parse( this.getAttribute( 'data-sample' ) );
				if ( sampleData.name && sampleData.name.length ) {
					nameInput.value = sampleData.name;
				} else {
					nameInput.value = null;
				}

				if ( sampleData.text && sampleData.text.length ) {
					textInput.value = sampleData.text;
				} else {
					textInput.value = null;
				}

				if ( sampleData.time ) {
					timeInput.value = sampleData.time;
				} else {
					timeInput.value = null;
				}

				node.dispatchEvent( new Event( 'submit' ) );
			});
		});
	});

	document.querySelectorAll( '.output-stats' ).forEach( ( node ) => {
		let eventSource = new EventSource( '/stats' );

		eventSource.addEventListener( 'upd', ( event ) => {
			let data = JSON.parse( event.data );
			node.innerText = JSON.stringify( data, null, 2 );
		});
	});
});
