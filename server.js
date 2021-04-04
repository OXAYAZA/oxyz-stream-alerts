let
  server    = require( 'oxyz-express' ),
  multipart = require( 'connect-multiparty' );

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
    app.post( /.+alrreq$/, multipartMiddleware, function ( req, res ) {
      console.log( '[alr req]', req.body );
      let response = req.body;
      console.log( '[alr res]', response );
      res.send( response );
    });
  }
});
