import { NewNote } from '../../../../../types';

export default function NoteEditingReducer(
	state: NewNote,
	{ type, payload }: ActionType
): NewNote {
	switch (type) {
		case 'changeTitle': {
			return {
				...state,
				title: payload,
			};
		}
		case 'changeDescription': {
			return {
				...state,
				description: payload,
			};
		}
		case 'addTag': {
			if (payload.trim() != '') {
				return {
					...state,
					tags: [...state.tags, payload],
				};
			} else {
				return state;
			}
		}
		case 'removeTag': {
			return {
				...state,
				tags: state.tags.filter((tag) => tag !== payload),
			};
		}
		case 'addFiles': {
			if (payload) {
				return {
					...state,
					files: state.files.concat(payload),
				};
			} else {
				return state;
			}
		}
		case 'removeFile': {
			return {
				...state,
				files: state.files.filter((file) => file.fileName !== payload),
			};
		}
		default: {
			console.log('WRONG action at note editing modal reducer', {
				type,
				payload,
			});

			return state;
		}
	}
}

export type ActionType =
	| {
			type: ActionTypes.CHANGE_TITLE;
			payload: string;
	  }
	| {
			type: ActionTypes.CHANGE_DESCRIPTION;
			payload: string;
	  }
	| {
			type: ActionTypes.ADD_TAG;
			payload: string;
	  }
	| {
			type: ActionTypes.REMOVE_TAG;
			payload: string;
	  }
	| {
			type: ActionTypes.ADD_FILES;
			payload: File[];
	  }
	| {
			type: ActionTypes.REMOVE_FILE;
			payload: string;
	  };

export enum ActionTypes {
	CHANGE_TITLE = 'changeTitle',
	CHANGE_DESCRIPTION = 'changeDescription',
	ADD_TAG = 'addTag',
	REMOVE_TAG = 'removeTag',
	ADD_FILES = 'addFiles',
	REMOVE_FILE = 'removeFile',
}
