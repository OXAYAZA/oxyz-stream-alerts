const
	server    = require( 'oxyz-express' ),
	multipart = require( 'connect-multiparty' ),
	sse       = require( 'server-sent-events' ),
	Emitter   = require( 'events' ),
	fs        = require('fs');

const
	emitter = new Emitter(),
	defDelay = 3000,
	defDuration = 2000,
	queue = [];

let
	state = 'ready',
	uid = 0;

// GIPHY
// https://developers.giphy.com/docs/api/schema
// https://developers.giphy.com/dashboard/

// Main alert processing
emitter.on( 'upd', () => {
	if ( state === 'ready' ) {
		if ( queue.length ) {
			state = 'busy';

			let item = queue[0];
			emitter.emit( 'alert', item );

			setTimeout( () => {
				queue.shift();
				state = 'ready';
				emitter.emit( 'upd', queue );
			}, item.time + defDelay );
		}
	}
});

server({
	pug: {
		root: 'dev'
	},
	sass: {
		root: 'dev'
	},
	cb: function ( app ) {
		let multipartMiddleware = multipart();

		// alert request handler
		app.post( '/alrreq', multipartMiddleware, function ( req, res ) {
			let data = req.body;
			data.id = uid++;
			console.log( '[alert add]', data );
			data.time = parseInt( data.time ) || defDuration;
			queue.push( data );
			emitter.emit( 'upd', queue );
			res.send( 'ok' );
		});

		// stats sender
		app.get( '/stats', sse, function( req, res ) {
			let client = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
			console.log( '[sub stats]', client );

			function respond ( data ) {
				console.log( '[stats send]', client );
				let msg = 'event: upd\ndata: '+ ( JSON.stringify( data ) ) +'\n\n';
				res.sse( msg );
			}

			emitter.addListener( 'upd', respond );
			emitter.emit( 'upd', queue );

			req.on( 'close', () => {
				console.log( '[unsub stats]', client );
				emitter.removeListener( 'upd', respond );
			});
		});

		// event sender
		app.get( '/events', sse, function( req, res ) {
			let client = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
			console.log( '[sub events]', client );

			function respond ( data ) {
				console.log( '[alert send]', client, data );
				let msg = 'event: alert\ndata: '+ ( JSON.stringify( data ) ) +'\n\n';
				res.sse( msg );
			}

			emitter.addListener( 'alert', respond );

			req.on( 'close', () => {
				console.log( '[unsub events]', client );
				emitter.removeListener( 'alert', respond );
			});
		});

		app.get( '/imglist', function ( req, res ) {
			let list = fs.readdirSync( './dev/assets/img' );
			res.send( list );
		});

		app.get( '/soundlist', function ( req, res ) {
			let list = fs.readdirSync( './dev/assets/sound' );
			res.send( list );
		});
	}
});
