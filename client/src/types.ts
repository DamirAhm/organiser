export type optionType<Value = string> = {
	value: Value;
	label: string;
};

export interface User {
	email: string;
	name: Name;
	sections: string[];
	photo_url: AvatarUrl | null;
	hash?: string;
	salt?: string;
	googlestring?: string;
	id: string;
}

export type authJSON = {
	id: string;
	email: string;
	name: string;
	token: string;
};

export type Name = string;
export type AvatarUrl = string;

export type Deleted = {
	notes?: string[];
	sections?: string[];
	users?: string[];
};

export type File = {
	fileName: string;
	mimeType: string;
	originalName: string;
};

export type Note =
	| {
			title: string;
			description: string;
			tags: string[];
			files: File[];
			subNotes: string[];
			pinned: boolean;
			user: string;
			id: string;
			section: string | null;
	  }
	| {
			title: string;
			description: string;
			tags: string[];
			files: File[];
			subNotes: string[];
			pinned: boolean;
			id: string;
			user: string;
			parent: string | null;
	  };

export type NewNote = Omit<Note, 'subNotes' | 'pinned' | 'id' | 'user'>;
export type NotePreview = {
	tags: string[];
	title: string;
	id: string;
	pinned: boolean;
};

export interface Section {
	name: string;
	notes: string[];
	pinned: boolean;
	user: string;
	id: string;
}

export type SectionPreview = Omit<Section, 'notes' | 'user'>;

export type sectionsList = SectionPreview[];
