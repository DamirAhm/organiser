import { FastifyPluginCallback } from "fastify";
import { Deleted, Id, Section, User } from '../types';
import { STATUS_CODES } from '../constants';
import { UserModel, SectionModel } from '../database/models';
import { populateSections } from '../database/population';

// ? Path: /items
export const usersRouter: FastifyPluginCallback<any, any> = (router, opts, done) => {
	router.post( '/', async (req, res) => {
		const { name, photo_url } = req.body as Partial<User>;

		if ( !name ) {
			res.status( STATUS_CODES.BAD );

			return { error: 'You must pass name in your request' };
		}

		const newUser = await UserModel.create( { name, photo_url } );
		await newUser.save();

		return { payload: newUser }
	} )

	router.delete( '/', async (req, res) => {
		const { id: userId } = req.body as { id: unknown };

		if ( !userId || typeof userId !== 'string' ) {
			res.status( STATUS_CODES.BAD );

			return { error: "You must pass id with type string" }
		}

		const UserToDelete = await UserModel.findByIdAndDelete( userId );

		if ( UserToDelete === null ) return {};

		const deleted: Deleted = { users: [ UserToDelete.id ] };

		if ( UserToDelete.sections.length !== 0 ) {
			deleted.sections = [];
			for ( const sectionId of UserToDelete.sections ) {
				await SectionModel.deleteOne( { _id: sectionId } );
				deleted.sections.push( sectionId );
			}
		}

		return { payload: deleted };
	} )

	router.get( '/', async (req, res) => {
		const { id: userId } = req.query as { id: unknown };

		if ( !userId ) {
			res.status( STATUS_CODES.BAD );

			return { error: "You must pass any of id" }
		} else {
			const user = await UserModel.findById( userId );

			if ( user !== null ) {
				return { payload: await populateSections( user ) }
			}

			return { payload: null }
		}
	} )

	router.put( '/:id', async (req, res) => {
		const { id: userId } = req.params as { id: string };

		const user = await UserModel.findById( userId );

		if ( user === null ) {
			res.status( STATUS_CODES.BAD )

			return { error: "Can`t find user" };
		}

		const { update } = req.body as { update: Partial<User> | null }

		if ( update === null ) {
			res.status( STATUS_CODES.BAD )

			return { error: "You must pass updates object to body" }
		}

		for ( const key in update ) {
			if ( update.hasOwnProperty( key ) ) {
				if ( key === 'id' || key === '_id' ) {
					res.status( STATUS_CODES.BAD );
					return { error: "You can`t change item id" }
				} else if ( key === 'sections' ) {
					res.status( STATUS_CODES.BAD );
					return { error: "You can't change sections" }
				}

				//@ts-ignore
				user[key] = update[key];
			}
		}

		await user.save()

		return { payload: user }
	} )

	router.post("/addSection", async (req, res) => {
		const {to, section} = req.body as { to?: Id, section?: Section}

		if (!to || !section) {
			res.status(STATUS_CODES.BAD);
		}

		const newSection = await SectionModel.create(section);
		await newSection.save();

		const user = await UserModel.findById(to);

		if (!user) {
			res.status(STATUS_CODES.BAD);
			return {error: "Can't find user"}
		}

		user.sections.push(newSection._id);
		await user.save();

		return {payload: section};
	})

	done();
}