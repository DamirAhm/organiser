import mongoose from 'mongoose'
import config from './database/config/config'

(async () => {
	try {
		await mongoose.connect( config.MONGODB_URI )
		console.log( 'DataBase connected' );

	} catch ( e ) {
		if ( e instanceof Error ) console.log( "Unexpected error occurred", e );
		throw e;
	}
})();
