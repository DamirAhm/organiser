import { ObjectId, Document, Model } from 'mongoose';

export type Note =
	| {
			files: string[];
			title: string;
			description: string;
			subNotes: Id[];
			tags: string[];
			pinned: boolean;
			user: Id;
			parent: undefined;
			section: Id | null;
			id: Id;
	  }
	| {
			files: string[];
			title: string;
			description: string;
			subNotes: Id[];
			tags: string[];
			pinned: boolean;
			user: Id;
			parent: Id | null;
			section: undefined;
			id: Id;
	  };

export type NewNote = Omit<Note, 'subNotes' | 'pinned' | 'id' | 'user'>;
export type NotePreview = {
	title: string;
	id: string;
	pinned: boolean;
};

export type NoteDocument = Document<any, any, Note> &
	Note & {
		id?: string;
		_id: ObjectId;
	};

export interface NoteModel extends Model<NoteDocument> {}

export interface PopulatedNoteDocument
	extends Omit<NoteDocument, 'subNotes' | 'parent' | 'section'> {
	subNotes: Note[];
	parent: NoteDocument;
	section: SectionDocument;
}

export interface Section {
	name: string;
	notes: Id[];
	pinned: boolean;
	user: Id;
}

export type SectionDocument = Document<any, any, Section> &
	Section & {
		id?: string;
		_id: ObjectId;
	};

export interface SectionModel extends Model<SectionDocument> {}

export interface PopulatedSectionDocument
	extends Omit<SectionDocument, 'notes' | 'user'> {
	notes: NoteDocument[];
	user: UserDocument;
}

export interface User {
	email: string;
	name: Name;
	sections: Id[];
	photo_url: AvatarUrl | null;
	hash?: string;
	salt?: string;
	googleId?: string;
}

export interface RegisterUser extends User {
	password: string;
}

export type UserDocument = Document<any, any, User> &
	User & {
		id?: string;
		_id: ObjectId;

		setPassword(password: string): void;
		validatePassword(password: string): boolean;
		generateJWT(): string;
		toAuthJSON(): authJSON;
	};

export type authJSON = {
	id: string;
	email: string;
	name: string;
};

export interface UserModel extends Model<UserDocument> {}

export interface PopulatedUser extends Omit<UserDocument, 'sections'> {
	sections: SectionDocument[];
}

export type Name = string;
export type Id = ObjectId;
export type AvatarUrl = string;

export type Deleted = {
	notes?: Id[];
	sections?: Id[];
};
