import { ObjectId, Document, Model } from 'mongoose';

export interface Item {
	files: string[],
	title: string,
	description: string,
	subItems: Id[],
	tags: string[],
	pinned: boolean,
	parent: Id | null,
	section: Id | null
}

export type ItemDocument = Document<any, any, Item> & Item & {
	id?: string,
	_id: ObjectId
}

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
	user: Id
}

export type SectionDocument = Document<any, any, Section> & Section & {
	id?: string,
	_id: ObjectId
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
	photo_url: AvatarUrl | null
}

export type UserDocument = Document<any, any, User> & User & {
	id?: string,
	_id: ObjectId
}

export interface UserModel extends Model<UserDocument> {
}

export interface PopulatedUser extends Omit<UserDocument, "sections"> {
	sections: SectionDocument[]
}

export type Name = string;
export type Id = ObjectId;
export type AvatarUrl = string

export type Deleted = {
	items?: Id[]
	sections?: Id[]
	users?: Id[]
}