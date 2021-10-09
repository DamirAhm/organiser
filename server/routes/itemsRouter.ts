import { FastifyPluginCallback, RawServerDefault } from "fastify";
import { Item } from '../types';
import { STATUS_CODES } from '../constants';
import ItemModel from '../database/models/item';
import { ObjectId } from 'mongoose';
import SectionModel from '../database/models/section';
import { populateSubItems } from '../database/population/itemPopulation';
import { populateItems } from '../database/population/sectionPopulation';

// ? Path: /items
const itemsRouter: FastifyPluginCallback<any, RawServerDefault> = (router, opts, done) => {
	//@ts-ignore
	router.post( '/', async (req, res) => {
		const { title, description, files, tags, parent, section } = req.body as Partial<Item>;

		if ( !title ) {
			res.status( STATUS_CODES.BAD );

			return { error: 'You must put title in your request' };
		}

		const newItem = await ItemModel.create( { title, description, files, tags, parent, section } );
		await newItem.save();

		if ( parent ) {
			const parentItem = await ItemModel.findById( parent );

			if ( parentItem === null ) {
				res.status( STATUS_CODES.BAD );

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

	router.get( '/', async (req, res) => {
		const { id: itemId, sectionId } = req.query as { id: unknown, sectionId: unknown };

		if (!itemId && !sectionId) {
			res.status(STATUS_CODES.BAD);

			return {error: "You must pass any of id or sectionId"}
		}
		if (itemId && sectionId) {
			res.status(STATUS_CODES.BAD);

			return {error: "You can`t pass both id and section params, pass one at a time"}
		}
		if (itemId) {
			const item = await ItemModel.findById(itemId);

			if (item !== null) {
				return {payload: await populateSubItems(item)}
			}

			return {payload: null}
		}
		if (sectionId) {
			//TODO check if user owns section or not
			const section = await SectionModel.findById(sectionId);

			if (section !== null) {
				const populatedSection = await populateItems(section);

				return {payload: populatedSection.items};
			}

			return {payload: null}
		}
	} )

	done();
}
export default itemsRouter