import mongoose from 'mongoose'
import config from './database/config/config'
import fastify from 'fastify';
import fastifyExpress from 'fastify-express'
import cors from 'cors';
import { itemsRouter, sectionsRouter } from './routes';

export const app = fastify();

(async () => {
	try {
		await mongoose.connect( config.MONGODB_URI )
		console.log( 'DataBase connected' );

		await app.register( itemsRouter, {prefix: '/items'} );
		await app.register( sectionsRouter, {prefix: '/sections'} );
		await app.register( fastifyExpress );
		app.use( cors() );

		const PORT = process.env.PORT ?? 3000;
		await app.listen( PORT )
		console.log( `Server is listening at ${ PORT }` );
	} catch ( e ) {
		if ( e instanceof Error ) console.log( "Unexpected error occurred", e );
		throw e;
	}
})();
