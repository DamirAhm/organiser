import { ObjectId, Document, Model } from 'mongoose';

export interface Item {
	files: string[],
	title: string,
	description: string,
	subItems: Id[],
	tags: string[],
	pinned: boolean,
	id: Id,
	parent: Id | null,
	section: Id | null
}

export interface ItemDocument extends Document<Item> {
	files: string[],
	title: string,
	description: string,
	subItems: Id[],
	tags: string[],
	pinned: boolean,
	id: Id,
	parent: Id | null,
	section: Id | null
}
const a = {}
export interface ItemModel extends Model<ItemDocument> {
}

export interface PopulatedItemDocument extends Omit<ItemDocument, "subItems" | "parent" | "section"> {
	subItems: Item[],
	parent: ItemDocument,
	section: SectionDocument
}

export interface Section {
	name: string,
	items: Id[],
	pinned: boolean,
	id: Id,
	user: Id
}

export interface SectionDocument extends Document<Section> {
	name: string,
	items: Id[],
	pinned: boolean,
	id: Id,
	user: Id
}

export interface SectionModel extends Model<SectionDocument> {
}

export interface PopulatedSectionDocument extends Omit<SectionDocument, "items" | "user"> {
	items: ItemDocument[],
	user: UserDocument
}

export interface User {
	name: Name,
	sections: Id[],
	id: Id,
	photo_url: AvatarUrl | null
}

export interface UserDocument extends Document<User> {
	name: Name,
	sections: Id[],
	id: Id,
	photo_url: AvatarUrl | null
}

export interface UserModel extends Model<UserDocument> {
}

export interface PopulatedUser extends Omit<UserDocument, "sections"> {
	sections: SectionDocument[]
}

export type Name = string;
export type Id = ObjectId;
export type AvatarUrl = string