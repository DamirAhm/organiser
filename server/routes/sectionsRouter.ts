import { FastifyPluginCallback } from "fastify";
import { Deleted, Id, Item, Section } from '../types';
import { STATUS_CODES } from '../constants';
import { UserModel, SectionModel, ItemModel } from '../database/models';
import { populateItems, populateSections } from '../database/population';

// ? Path: /items
export const sectionsRouter: FastifyPluginCallback<any, any> = (router, opts, done) => {
	router.post( '/', async (req, res) => {
		const { name, user } = req.body as Partial<Section>;

		if ( !name ) {
			res.status( STATUS_CODES.BAD );

			return { error: 'You must pass name in your request' };
		} else if ( !user ) {
			res.status( STATUS_CODES.BAD );

			return { error: "You must pass userId in your request" }
		}

		const newSection = await SectionModel.create( { name, user } );
		await newSection.save();

		if ( user ) {
			const parentUser = await UserModel.findById( user );

			if ( parentUser === null ) {
				res.status( STATUS_CODES.BAD );

				return { error: "Can`t find user" };
			}

			parentUser.sections.push( newSection.id );
			await parentUser.save();

		}
		return { payload: newSection }
	} )

	router.delete( '/', async (req, res) => {
		const { id: sectionId } = req.body as { id: unknown };

		if ( !sectionId || typeof sectionId !== 'string' ) {
			res.status( STATUS_CODES.BAD );

			return { error: "You must pass id with type string" }
		}

		const sectionToDelete = await SectionModel.findByIdAndDelete( sectionId );


		if ( sectionToDelete === null ) return {};

		const deleted: Deleted = { sections: [ sectionToDelete.id ] };

		if ( sectionToDelete.user !== null ) {
			const user = await UserModel.findById( sectionToDelete.user );

			if ( user ) {
				user.sections = user.sections.filter( id => id.toString() !== sectionId );
				await user.save();
			}
		}
		if ( sectionToDelete.items.length !== 0 ) {
			deleted.items = [];
			for ( const itemId of sectionToDelete.items ) {
				await ItemModel.deleteOne( { _id: itemId } );
				deleted.items.push( itemId );
			}
		}

		return { payload: deleted };
	} )

	router.get( '/', async (req, res) => {
		const { id: sectionId, userId } = req.query as { id: unknown, userId: unknown };

		if ( !sectionId && !userId ) {
			res.status( STATUS_CODES.BAD );

			return { error: "You must pass any of id or userId" }
		}
		if ( sectionId && userId ) {
			res.status( STATUS_CODES.BAD );

			return { error: "You can`t pass both id and userId params, pass one at a time" }
		}
		if ( sectionId ) {
			const section = await SectionModel.findById( sectionId );

			if ( section !== null ) {
				return { payload: await populateItems( section ) }
			}

			return { payload: null }
		}
		if ( userId ) {
			//TODO check if it`s user himself or not
			const user = await UserModel.findById( userId );

			if ( user !== null ) {
				const populatedUser = await populateSections( user );

				return { payload: populatedUser.sections };
			}

			return { payload: null }
		}
	} )

	router.put( '/:id', async (req, res) => {
		const { id: sectionId } = req.params as { id: string };

		const section = await SectionModel.findById( sectionId );

		if ( section === null ) {
			res.status( STATUS_CODES.BAD )

			return { error: "Can`t find section" };
		}

		const { update } = req.body as { update: Partial<Section> | null }

		if ( update === null ) {
			res.status( STATUS_CODES.BAD )

			return { error: "You must pass updates object to body" }
		}

		for ( const key in update ) {
			if ( update.hasOwnProperty( key ) ) {
				if ( key === 'id' || key === '_id' ) {
					res.status( STATUS_CODES.BAD );
					return { error: "You can`t change item id" }
				} else if ( key === 'items' ) {
					res.status( STATUS_CODES.BAD );
					return { error: "You can't change items" }
				}

				if ( key === 'user' ) {
					const user = await UserModel.findById( section.user );

					if ( user !== null ) {
						user.sections = user.sections.filter( id => id.toString() === sectionId );
						await user.save();
					}

					if ( update[key] !== null ) {
						const newUser = await UserModel.findById( update[key] );

						if ( newUser !== null ) {
							newUser.sections.push( section._id );
							await newUser.save();
						} else {
							//@ts-ignore
							update[key] = null;
						}
					}
				}

				//@ts-ignore
				section[key] = update[key];
			}
		}

		await section.save()

		return { payload: section }
	} )

	router.post("/addItem", async (req, res) => {
		const {to, item} = req.body as { to?: Id, item?: Item}

		if (!to || !item) {
			res.status(STATUS_CODES.BAD)
			return {error: "You must pass both id and item to body"}
		}

		const newItem = await ItemModel.create(item);
		await newItem.save();

		const section = await SectionModel.findById(to);

		if (!section) {
			res.status(STATUS_CODES.BAD);
			return {error: "Can't find section"}
		}

		section.items.push(newItem._id);
		await section.save();

		return {payload: newItem};
	})

	done();
}