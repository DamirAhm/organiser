import { Router } from 'express';
import { ItemModel, SectionModel, UserModel } from '../database/models';
import { Deleted, Id, Item, Section } from '../types';
import { populateItems, populateSections } from '../database/population';
import { STATUS_CODES } from '../constants';
import auth from './auth';

export const sectionsRouter = Router();

sectionsRouter.post( '/', auth.required, (req, res) => {
	(async () => {
		try {
			const { name } = req.body as Partial<Section>;
			//@ts-ignore
			const { id: userId } = req.payload as { id: string };

			if ( !name ) {
				return res.status( STATUS_CODES.BAD ).json( { error: 'You must pass name in your request' } );
			}

			const newSection = await SectionModel.create( { name, user: userId } );
			await newSection.save();

			const parentUser = await UserModel.findById( userId );

			if ( parentUser === null ) {
				return res.status( STATUS_CODES.BAD ).json( { error: "Can`t find user" } );
			}

			parentUser.sections.push( newSection.id );
			await parentUser.save();

			return res.json( { payload: newSection } );
		} catch ( e ) {
			if ( e instanceof Error ) {
				res.status( STATUS_CODES.BAD ).json( { error: e.message } );
				throw e;
			} else {
				console.log( e );
			}
		}
	})()
} )

sectionsRouter.delete( '/', auth.required, (req, res) => {
	(async () => {
		try {
			const { id: sectionId } = req.body as { id: unknown };

			if ( !sectionId || typeof sectionId !== 'string' ) {
				return res.status( STATUS_CODES.BAD ).json( { error: "You must pass id with type string" } );
			}

			const sectionToDelete = await SectionModel.findByIdAndDelete( sectionId );

			if ( sectionToDelete === null ) return res.json( { payload: null } );

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

			return res.json( { payload: deleted } );
		} catch ( e ) {
			if ( e instanceof Error ) {
				res.status( STATUS_CODES.BAD ).json( { error: e.message } );
				throw e;
			} else {
				console.log( e );
			}
		}
	})();
} )

sectionsRouter.get( '/', (req, res) => {
	(async () => {
		try {
			const { id: sectionId, userId } = req.query as { id: unknown, userId: unknown };

			if ( !sectionId && !userId ) {
				return res.status( STATUS_CODES.BAD ).json( { error: "You must pass any of id or userId" } );
			}
			if ( sectionId && userId ) {
				return res.status( STATUS_CODES.BAD ).json( { error: "You can`t pass both id and userId params, pass one at a time" } );
			}
			if ( sectionId ) {
				const section = await SectionModel.findById( sectionId );

				if ( section !== null ) {
					return res.status( STATUS_CODES.BAD ).json( { payload: await populateItems( section ) } );
				}

				return res.json( { payload: null } );
			}
			if ( userId ) {
				//TODO check if it`s user himself or not
				const user = await UserModel.findById( userId );

				if ( user !== null ) {
					const populatedUser = await populateSections( user );

					return res.json( { payload: populatedUser.sections } );
				}

				return res.status( STATUS_CODES.BAD ).json( { payload: null } );
			}
		} catch ( e ) {
			if ( e instanceof Error ) {
				res.status( STATUS_CODES.BAD ).json( { error: e.message } );
				throw e;
			} else {
				console.log( e );
			}
		}
	})();
} )

sectionsRouter.put( '/:id', (req, res) => {
	(async () => {
		try {
			const { id: sectionId } = req.params as { id: string };

			const section = await SectionModel.findById( sectionId );

			if ( section === null ) {
				return res.status( STATUS_CODES.BAD ).json( { error: "Can`t find section" } );
			}

			const { update } = req.body as { update: Partial<Section> | null }

			if ( update === null ) {
				return res.status( STATUS_CODES.BAD ).json( { error: "You must pass updates object to body" } );
			}

			for ( const key in update ) {
				if ( update.hasOwnProperty( key ) ) {
					if ( key === 'id' || key === '_id' ) {
						return res.status( STATUS_CODES.BAD ).json( { error: "You can`t change item id" } );
					} else if ( key === 'items' ) {
						res.status( STATUS_CODES.BAD );
						return res.status( STATUS_CODES.BAD ).json( { error: "You can't change items" } );
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

			return res.json( { payload: section } );
		} catch ( e ) {
			if ( e instanceof Error ) {
				res.status( STATUS_CODES.BAD ).json( { error: e.message } );
				throw e;
			} else {
				console.log( e );
			}
		}
	})();
} )

sectionsRouter.post( "/addItem", (req, res) => {
	(async () => {
		try {
			const { to, item } = req.body as { to?: Id, item?: Item }

			if ( !to || !item ) {
				return res.status( STATUS_CODES.BAD ).json( { error: "You must pass both id and item to body" } );
			}

			const newItem = await ItemModel.create( item );
			await newItem.save();

			const section = await SectionModel.findById( to );

			if ( !section ) {
				return res.status( STATUS_CODES.BAD ).json( { error: "Can't find section" } );
			}

			section.items.push( newItem._id );
			await section.save();

			return res.json( { payload: newItem } );
		} catch ( e ) {
			if ( e instanceof Error ) {
				res.status( STATUS_CODES.BAD ).json( { error: e.message } );
				throw e;
			} else {
				console.log( e );
			}
		}
	})();
} )
