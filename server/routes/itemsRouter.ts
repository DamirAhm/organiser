import { Router } from 'express';
import { ItemModel, SectionModel } from '../database/models';
import { Deleted, Id, Item } from '../types';
import { populateItems, populateSubItems } from '../database/population';
import { STATUS_CODES } from '../constants';

export const itemsRouter = Router();

itemsRouter.post( '/', (req, res) => {
	(async () => {
		try {
			const { title, description, files, tags, parent, section } = req.body as Partial<Item>;

			if ( !title ) {
				return res.status( STATUS_CODES.BAD ).json( { error: 'You must put title in your request' } );
			} else if ( !parent && !section ) {
				return res.status( STATUS_CODES.BAD ).json( { error: 'You must put one of parentId or sectionId in your request' } );
			}

			const newItem = await ItemModel.create( {
				title,
				description,
				files,
				tags,
				parent,
				section,
			} );
			await newItem.save();

			if ( parent ) {
				const parentItem = await ItemModel.findById( parent );

				if ( parentItem === null ) {
					return res.status( STATUS_CODES.BAD ).json( { error: "Can't find parent" } );
				}

				parentItem.subItems.push( newItem.id );
				await parentItem.save();
			}
			if ( section ) {
				const parentSection = await SectionModel.findById( section );

				if ( parentSection === null ) {
					return res.status( STATUS_CODES.BAD ).json( { error: "Can't find section" } );
				}

				parentSection.items.push( newItem.id );
				await parentSection.save();
			}

			return res.json( { payload: newItem } );
		} catch ( e ) {
			if ( e instanceof Error ) {
				res.status( STATUS_CODES.BAD ).json( { error: e.message } );
				throw e;
			}
			console.log( e );
		}
	})();
} )

itemsRouter.delete( '/', (req, res) => {
	(async () => {
		try {
			const { id: itemId } = req.body as { id: unknown };

			if ( !itemId || typeof itemId !== 'string' ) {
				return res.status( STATUS_CODES.BAD ).json( { error: "You must pass id with type string" } );
			}

			const itemToDelete = await ItemModel.findByIdAndDelete( itemId );


			if ( itemToDelete === null ) return res.json({});
			const deleted: Deleted = { items: [ itemToDelete.id ] };

			if ( itemToDelete.parent !== null ) {
				const parentItem = await ItemModel.findById( itemToDelete.parent );

				if ( parentItem ) {
					parentItem.subItems = parentItem.subItems.filter( id => id.toString() !== itemId );
					await parentItem.save();
				}
			}
			if ( itemToDelete.section !== null ) {
				const section = await SectionModel.findById( itemToDelete.section );

				if ( section ) {
					section.items = section.items.filter( id => id.toString() !== itemId );
					await section.save();
				}
			}
			if ( itemToDelete.subItems.length !== 0 ) {
				for ( const subItemId of itemToDelete.subItems ) {
					await ItemModel.deleteOne( { _id: subItemId } );
					deleted.items?.push( subItemId );
				}
			}

			res.json( { payload: deleted } );
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

itemsRouter.get( '/', (req, res) => {
	(async () => {
		try {
			const { id: itemId, sectionId } = req.query as { id: unknown, sectionId: unknown };

			if ( !itemId && !sectionId ) {
				return res.status( STATUS_CODES.BAD ).json( { error: "You must pass any of id or sectionId" } );
			} else if ( itemId && sectionId ) {
				return res.status( STATUS_CODES.BAD ).json( { error: "You can`t pass both id and sectionId params, pass one at a time" } );
			} else if ( itemId ) {
				const item = await ItemModel.findById( itemId );

				if ( item !== null ) {
					return res.json( { payload: await populateSubItems( item ) } );
				}

				return res.json( { payload: null } )
			} else if ( sectionId ) {
				//TODO check if user owns section or not
				const parentSection = await SectionModel.findById( sectionId );

				if ( parentSection !== null ) {
					const populatedSection = await populateItems( parentSection );

					res.json( { payload: populatedSection.items } );
				}

				return res.json( { payload: null } );
			} else {
				throw new Error( "Unknown error at items router" );
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

itemsRouter.put( '/:id', (req, res) => {
	(async () => {
		try {
			const { id: itemId } = req.params as { id: string };


			const item = await ItemModel.findById( itemId );

			if ( item === null ) {
				return res.status( STATUS_CODES.BAD ).json( { error: "Can`t find item" } );

			}

			const { update } = req.body as { update: Partial<Item> | null }

			if ( update === null ) {
				return res.status( STATUS_CODES.BAD ).json( { error: "You must pass updates object to body" } );
			}

			for ( const key in update ) {
				if ( update.hasOwnProperty( key ) ) {
					if ( key === 'id' || key === '_id' ) {
						return res.status( STATUS_CODES.BAD ).json( { error: "You can`t change item id" } );
					} else if ( key === 'subItems' ) {
						return res.status( STATUS_CODES.BAD ).json( { error: "You can't change subItems" } );
					}

					if ( key === 'parent' ) {
						const parentItem = await ItemModel.findById( item.parent );

						if ( parentItem !== null ) {
							parentItem.subItems = parentItem.subItems.filter( id => id.toString() === itemId );
							await parentItem.save();
						}

						if ( update[key] !== null ) {
							const newParentItem = await ItemModel.findById( update[key] );

							if ( newParentItem !== null ) {
								newParentItem.subItems.push( item._id );
								await newParentItem.save();
							} else {
								update[key] = null;
							}
						}
					}
					if ( key === 'section' ) {
						const section = await SectionModel.findById( item.section );

						if ( section !== null ) {
							section.items = section.items.filter( id => id.toString() === itemId );
							await section.save();
						}

						if ( update[key] !== null ) {
							const newSection = await SectionModel.findById( update[key] );

							if ( newSection !== null ) {
								newSection.items.push( item._id );
								await newSection.save();
							} else {
								update[key] = null;
							}
						}
					}

					//@ts-ignore
					item[key] = update[key];
				}
			}

			await item.save()

			return res.json( { payload: item } );
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

itemsRouter.post( '/addSubItem', (req, res) => {
	(async () => {
		try {
			const { to, item: newSubItem } = req.body as { to?: Id, item?: Item };

			if ( !to || !newSubItem ) {
				return res.status( STATUS_CODES.BAD ).json( { error: "You must pass both id and item to body" } );
			}

			const newItem = await ItemModel.create( newSubItem );
			await newItem.save();

			const parentItem = await ItemModel.findById( to );

			if ( !parentItem ) {
				return res.status( STATUS_CODES.BAD ).json( { error: "Can't find parent item" } );
			}

			parentItem.subItems.push( newItem._id );
			await parentItem.save();

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

export default itemsRouter;