import { GET_NOTES_LIST, getNotesType } from './../api/Queries/getNotesList';
import { useOpenedSection } from './useOpenedSection';
import { useQueryClient } from 'react-query';
import { useMemo } from 'react';
import { HARDNESS_TAGS, URGENCY_TAGS } from '../constants';

const useNotesTags = () => {
	const queryClient = useQueryClient();
	const { openedSectionId } = useOpenedSection();

	const notes = queryClient.getQueryData<getNotesType>([
		GET_NOTES_LIST,
		openedSectionId,
	]);

	const allTags =
		notes
			?.map(({ tags }) => tags)
			.flat()
			.map((tag) => tag.toLowerCase()) ?? [];

	const extendedTags = allTags.concat(HARDNESS_TAGS, URGENCY_TAGS);

	const uniqueTags = useMemo(
		() => extendedTags.filter((tag, i) => i === allTags.lastIndexOf(tag)),
		[notes]
	);

	return { tags: uniqueTags };
};

export default useNotesTags;
