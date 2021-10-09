import { FastifyPluginCallback, RawServerDefault } from "fastify";
import { Item } from '../types';
import { RESPONSE_TYPES, STATUS_CODES } from '../constants';
import ItemModel from '../database/models/item';
import { ObjectId } from 'mongoose';

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

			parentItem.subItems.push( newItem.id );
			await parentItem.save();

		}
		return { payload: newItem }
	} )

	router.delete( '/', async (req, res) => {
		const { id: itemId } = req.body as { id: unknown };

		if ( !itemId || typeof itemId !== 'string' ) {
			res.status( STATUS_CODES.BAD );
			res.type( RESPONSE_TYPES.JSON );
			return { error: "You must pass id with type string" }
		}

		const itemToDelete = await ItemModel.findByIdAndDelete( itemId );


		if ( itemToDelete === null ) return {};
		const deleted: ObjectId[] = [ itemToDelete.id ];

		if ( itemToDelete.parent !== null ) {
			const parentItem = await ItemModel.findById( itemToDelete.parent );

			if ( parentItem ) {
				parentItem.subItems = parentItem.subItems.filter( id => id.toString() !== itemId );
				await parentItem.save();
			}
		}
		if ( itemToDelete.subItems.length !== 0 ) {
			for ( const subItemId of itemToDelete.subItems ) {
				await ItemModel.deleteOne( { _id: subItemId } );
				deleted.push( subItemId );
			}
		}


		return { payload: deleted };
	} )


	done();
}
export default itemsRouter