import { FastifyPluginCallback, RawServerDefault } from "fastify";
import { Item } from '../types';
import { RESPONSE_TYPES, STATUS_CODES } from '../constants';
import ItemModel from '../database/models/item';

// ? Path: /items
const itemsRouter: FastifyPluginCallback<any, RawServerDefault> = (router, opts, done) => {
	//@ts-ignore
	router.post( '/', async (req, res) => {
		const { title, description, files, tags, parent, section } = req.body as Partial<Item>;

		if ( !title ) {
			res.status( STATUS_CODES.BAD );
			res.type( RESPONSE_TYPES.JSON )
			return { error: 'You must put title in your request' };
		}

		const newItem = await ItemModel.create( { title, description, files, tags, parent, section } );
		await newItem.save();

		if ( parent ) {
			const parentItem = await ItemModel.findById( parent );

			if ( parentItem === null ) {
				res.status( STATUS_CODES.BAD );
				res.type( RESPONSE_TYPES.JSON );
				return { error: "Parent property must be string or ObjectId" };
			}

			parentItem.subItems.push(newItem.id);
			await parentItem.save();

			return { payload: newItem }
		}
	} )

	done();
}
export default itemsRouter