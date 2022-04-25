function resize () {
	document.documentElement.style.fontSize = `${window.innerWidth * .05}px`;
}

document.addEventListener( 'DOMContentLoaded', function () {
	resize();
	window.addEventListener( 'resize', resize );

	// Alert output
	document.querySelectorAll( '.output' ).forEach( ( node ) => {
		let eventSource = new EventSource( '/events' );

		eventSource.addEventListener( 'alert', ( event ) => {
			console.log( '[event]', event );
			node.innerHTML = null;

			let data = JSON.parse( event.data );

			if ( data.img ) {
				let elImg = document.createElement( 'img' );
				elImg.className = 'output-img';
				elImg.setAttribute( 'src', data.img );
				elImg.setAttribute( 'alt', '' );
				node.appendChild( elImg );
			}

			if ( data.name ) {
				let elName = document.createElement( 'h1' );
				elName.className = 'output-name';
				elName.innerText = data.name;
				node.appendChild( elName );
			}

			if ( data.text ) {
				let elText = document.createElement( 'div' );
				elText.className = 'output-text';
				elText.innerText = data.text;
				node.appendChild( elText );
			}

			if ( data.sound ) {
				let elAudio = document.createElement( 'audio' );
				elAudio.className = 'output-audio';
				elAudio.setAttribute( 'src', data.sound );
				node.appendChild( elAudio );
				elAudio.play();
			}
		});
	});
});
