const
  server    = require( 'oxyz-express' ),
  multipart = require( 'connect-multiparty' ),
  sse       = require( 'server-sent-events' ),
  Emitter   = require( 'events' );

server({
  pug: {
    root: 'dev'
  },
  sass: {
    root: 'dev'
  },
  cb: function ( app ) {
    let
      multipartMiddleware = multipart(),
      emitter = new Emitter();

    // alert request handler
    app.post( '/alrreq', multipartMiddleware, function ( req, res ) {
      console.log( '[alr req]', req.body );
      let response = req.body;
      emitter.emit( 'alert', response );
      console.log( '[alr res]', response );
      res.send( response );
    });

    // event sender
    app.get( '/events', sse, function( req, res ) {
      console.log( '[sub]', req.headers['x-forwarded-for'] || req.connection.remoteAddress );

      emitter.on( 'alert', ( data ) => {
        let msg = 'event: alert\ndata: '+ ( JSON.stringify( data ) ) +'\n\n';
        res.sse( msg );
      });
    });
  }
});
