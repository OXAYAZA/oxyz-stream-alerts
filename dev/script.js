import AlertForm from './alert-form.js';
import req from './request.js';

document.addEventListener( 'DOMContentLoaded', async function () {
	let
		imgList = await req.get( '/imglist' ),
		soundList = await req.get( '/soundlist' );

	document.querySelectorAll( '[data-imglist]' ).forEach( ( node ) => {
		node.innerHTML = null;

		imgList.forEach( item => {
			let el = document.createElement( 'input' );
			el.className = 'flag-img';
			el.setAttribute( 'type', 'radio' );
			el.setAttribute( 'name', 'img' );
			el.setAttribute( 'value', `assets/img/${item}` );
			el.style.backgroundImage = `url(assets/img/${item})`;
			node.appendChild( el );
		});
	});

	document.querySelectorAll( '[data-soundlist]' ).forEach( ( node ) => {
		node.innerHTML = null;

		soundList.forEach( item => {
			let elWrap = document.createElement( 'div' );
			elWrap.className = 'form-sound';
			node.appendChild( elWrap );

			let elInput = document.createElement( 'input' );
			elInput.className = 'sound-flag';
			elInput.setAttribute( 'type', 'radio' );
			elInput.setAttribute( 'name', 'sound' );
			elInput.setAttribute( 'value', `assets/sound/${item}` );
			elWrap.appendChild( elInput );

			let elAudio = document.createElement( 'audio' );
			elAudio.className = 'sound-media';
			elAudio.setAttribute( 'src', `assets/sound/${item}` );
			elWrap.appendChild( elAudio );

			let elButton = document.createElement( 'button' );
			elButton.className = 'sound-btn btn';
			elButton.setAttribute( 'type', 'button' );
			elButton.innerText = 'Play';
			elButton.addEventListener( 'click', () => {
				elAudio.play();
			});
			elWrap.appendChild( elButton );
		});
	});

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

	// Queue info
	document.querySelectorAll( '.output-stats' ).forEach( ( node ) => {
		let eventSource = new EventSource( '/stats' );

		eventSource.addEventListener( 'upd', ( event ) => {
			let data = JSON.parse( event.data );
			node.innerText = JSON.stringify( data, null, 2 );
		});
	});
});
