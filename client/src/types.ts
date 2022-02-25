export type optionType<Value = string> = {
	value: Value;
	label: string;
};

export interface User {
	email: string;
	name: Name;
	sections: Id[];
	photo_url: AvatarUrl | null;
	hash?: string;
	salt?: string;
	googleId?: string;
	id: string;
}

export type authJSON = {
	id: Id;
	email: string;
	name: string;
	token: string;
};

export type Name = string;
export type Id = string;
export type AvatarUrl = string;

export type Deleted = {
	items?: Id[];
	sections?: Id[];
	users?: Id[];
};

export type Item =
	| {
			files: string[];
			title: string;
			description: string;
			subItems: Id[];
			tags: string[];
			pinned: boolean;
			user: Id;
			id: string;
			section: Id | null;
	  }
	| {
			files: string[];
			title: string;
			description: string;
			subItems: Id[];
			tags: string[];
			pinned: boolean;
			id: string;
			user: Id;
			parent: Id | null;
	  };

export type NewItem = Omit<Item, 'files' | 'subItems' | 'pinned'>;
export type ItemPreview = {
	name: string;
	id: string;
	pinned: boolean;
};

export interface Section {
	name: string;
	items: string[];
	pinned: boolean;
	user: string;
	id: string;
}

export type SectionPreview = Omit<Section, 'items' | 'user'>;

export type sectionsList = SectionPreview[];
