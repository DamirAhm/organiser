import { NewItem } from './../types';
import { Router } from 'express';
import { ItemModel, SectionModel } from '../database/models';
import { Deleted, Id, Item } from '../types';
import { populateItems, populateSubItems } from '../database/population';
import { STATUS_CODES } from '../constants';
import auth from '../auth';

export const itemsRouter = Router();

itemsRouter.post('/', auth.required, (req, res, next) => {
	(async () => {
		try {
			const { title, description, tags, parent, section } =
				req.body as NewItem;
			//@ts-ignore
			const { id: userId } = req.payload as authJSON;

			if (!title) {
				return res
					.status(STATUS_CODES.BAD)
					.json({ error: 'You must put title in your request' });
			} else if (!parent && !section) {
				return res.status(STATUS_CODES.BAD).json({
					error: 'You must put one of parentId or sectionId in your request',
				});
			}

			const newItem = await ItemModel.create({
				title,
				description,
				tags,
				parent,
				section,
				//@ts-ignore
				user: req.payload.id,
			});
			await newItem.save();

			if (parent) {
				const parentItem = await ItemModel.findById(parent);

				if (parentItem === null) {
					return res
						.status(STATUS_CODES.BAD)
						.json({ error: "Can't find parent" });
				} else if (parentItem.user.toString() !== userId) {
					return res.status(403).send({ error: 'Unauthorized' });
				}

				parentItem.subItems.push(newItem.id);
				await parentItem.save();
			}
			if (section) {
				const parentSection = await SectionModel.findById(section);

				if (parentSection === null) {
					return res
						.status(STATUS_CODES.BAD)
						.json({ error: "Can't find section" });
				} else if (parentSection.user.toString() !== userId) {
					return res.status(403).send({ error: 'Unauthorized' });
				}

				parentSection.items.push(newItem.id);
				await parentSection.save();
			}

			return res.json({ payload: newItem });
		} catch (e) {
			if (e instanceof Error) {
				res.status(STATUS_CODES.BAD).json({ error: e.message });
				next(e);
			}
			console.log(e);
		}
	})();
});

itemsRouter.delete('/:itemId', auth.required, (req, res, next) => {
	(async () => {
		try {
			const { itemId } = req.params as { itemId: string };
			//@ts-ignore
			const { id: userId } = req.payload as authJSON;

			const itemToDelete = await ItemModel.findById(itemId);

			if (itemToDelete === null) return res.json({});

			const { title, id } = itemToDelete;

			//@ts-ignore
			if (itemToDelete.user.toString() !== userId) {
				return res.status(403).send({ error: 'Unauthorized' });
			}

			if (itemToDelete.parent !== null) {
				const parentItem = await ItemModel.findById(
					itemToDelete.parent
				);

				if (parentItem) {
					parentItem.subItems = parentItem.subItems.filter(
						(id) => id.toString() !== itemId
					);
					await parentItem.save();
				}
			}
			if (itemToDelete.section !== null) {
				const section = await SectionModel.findById(
					itemToDelete.section
				);

				if (section) {
					section.items = section.items.filter(
						(id) => id.toString() !== itemId
					);
					await section.save();
				}
			}
			if (itemToDelete.subItems.length !== 0) {
				for (const subItemId of itemToDelete.subItems) {
					await ItemModel.deleteOne({ _id: subItemId });
				}
			}

			await itemToDelete.delete();

			res.json({ payload: { id, title } });
		} catch (e) {
			if (e instanceof Error) {
				res.status(STATUS_CODES.BAD).json({ error: e.message });
				next(e);
			} else {
				next(e);
			}
		}
	})();
});

itemsRouter.get('/', auth.required, (req, res, next) => {
	(async () => {
		try {
			const { sectionId } = req.query as {
				sectionId: string;
			};
			//@ts-ignore
			const { id: userId } = req.payload as authJSON;

			if (!sectionId) {
				return res.status(STATUS_CODES.BAD).json({
					error: 'You must pass sectionId into query string',
				});
			}

			const parentSection = await SectionModel.findById(sectionId);

			//@ts-ignore
			if (parentSection.user.toString() !== userId) {
				return res.status(403).send({ error: 'Unauthorized' });
			} else if (parentSection !== null) {
				const populatedSection = await populateItems(parentSection);

				res.json({ payload: populatedSection.items });
			}

			return res.json({ payload: null });
		} catch (e) {
			if (e instanceof Error) {
				res.status(STATUS_CODES.BAD).send({ error: e.message });
				next(e);
			} else {
				next(e);
			}
		}
	})();
});

itemsRouter.get('/:itemId', auth.required, (req, res, next) => {
	(async () => {
		try {
			const { itemId } = req.params as { itemId: string };
			//@ts-ignore
			const { id: userId } = req.payload as authJSON;

			const item = await ItemModel.findById(itemId);

			if (item !== null) {
				if (item.user.toString() !== userId)
					return res.json({ payload: await populateSubItems(item) });
			}

			return res.json({ payload: null });
		} catch (e) {
			if (e instanceof Error) {
				res.status(STATUS_CODES.BAD).json({ error: e.message });
				next(e);
			} else {
				console.log(e);
			}
		}
	})();
});

itemsRouter.put('/:itemId', auth.required, (req, res, next) => {
	(async () => {
		try {
			const { itemId } = req.params as { itemId: string };
			//@ts-ignore
			const { id: userId } = req.payload as authJSON;

			const item = await ItemModel.findById(itemId);

			if (item === null) {
				return res
					.status(STATUS_CODES.BAD)
					.json({ error: 'Can`t find item' });
			} else if (item.user.toString() !== userId) {
				return res.status(403).send({ error: 'Unauthorized' });
			}

			const { update } = req.body as { update: Partial<Item> | null };

			if (update === null) {
				return res
					.status(STATUS_CODES.BAD)
					.json({ error: 'You must pass updates object to body' });
			}

			for (const key in update) {
				if (update.hasOwnProperty(key)) {
					if (key === 'id' || key === '_id') {
						return res
							.status(STATUS_CODES.BAD)
							.json({ error: 'You can`t change item id' });
					} else if (key === 'subItems') {
						return res
							.status(STATUS_CODES.BAD)
							.json({ error: "You can't change subItems" });
					}

					if (key === 'parent') {
						const parentItem = await ItemModel.findById(
							item.parent
						);

						if (parentItem !== null) {
							parentItem.subItems = parentItem.subItems.filter(
								(id) => id.toString() === itemId
							);
							await parentItem.save();
						}

						if (update[key] !== null) {
							const newParentItem = await ItemModel.findById(
								update[key]
							);

							if (newParentItem !== null) {
								newParentItem.subItems.push(item._id);
								await newParentItem.save();
							} else {
								update[key] = null;
							}
						}
					}
					if (key === 'section') {
						const section = await SectionModel.findById(
							item.section
						);

						if (section !== null) {
							section.items = section.items.filter(
								(id) => id.toString() === itemId
							);
							await section.save();
						}

						if (update[key] !== null) {
							const newSection = await SectionModel.findById(
								update[key]
							);

							if (newSection !== null) {
								newSection.items.push(item._id);
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

			await item.save();

			return res.json({ payload: item });
		} catch (e) {
			if (e instanceof Error) {
				res.status(STATUS_CODES.BAD).json({ error: e.message });
				next(e);
			} else {
				console.log(e);
			}
		}
	})();
});

itemsRouter.post('/addSubItem', auth.required, (req, res, next) => {
	(async () => {
		try {
			const { to, item: newSubItem } = req.body as {
				to?: Id;
				item?: NewItem;
			};
			//@ts-ignore
			const { id: userId } = req.payload as authJSON;

			if (!to || !newSubItem) {
				return res
					.status(STATUS_CODES.BAD)
					.json({ error: 'You must pass both id and item to body' });
			}

			const parentItem = await ItemModel.findById(to);

			if (!parentItem) {
				return res
					.status(STATUS_CODES.BAD)
					.json({ error: "Can't find parent item" });
			} else if (parentItem.user !== userId) {
				return res.status(403).send({ error: 'Unauthorized' });
			}
			const newItem = await ItemModel.create({
				...newSubItem,
				user: userId,
			});
			await newItem.save();

			parentItem.subItems.push(newItem._id);
			await parentItem.save();

			return res.json({ payload: newItem });
		} catch (e) {
			if (e instanceof Error) {
				res.status(STATUS_CODES.BAD).json({ error: e.message });
				next(e);
			} else {
				console.log(e);
			}
		}
	})();
});

export default itemsRouter;
