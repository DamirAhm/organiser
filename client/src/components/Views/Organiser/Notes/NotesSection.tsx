import React, { Suspense, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import useAuthToken from '../../../../hooks/useAuthToken';
import { useOpenedSection } from '../../../../hooks/useOpenedSection';
import getSectionQuery, {
	getSectionType,
	GET_SECTION,
} from '../../../../api/Queries/getSection';
import Filters from '../../../Common/Filters';
import Notes from './Notes';
import { LoaderPage } from '../../LoaderPage';
import { useCallback } from 'react';
import { NotePreview } from '../../../../types';
import { HARDNESS_TAGS, URGENCY_TAGS } from '../../../../constants';
import useNotesTags from '../../../../hooks/useNotesTags';

type Props = {};

const ContentContainer = styled.section`
	padding: 20px;
	display: grid;
	grid-template-rows: 40px auto 1fr;
	grid-gap: 10px;
	grid-column: 2;
	background-color: var(--darken-background-color);
`;

const Title = styled.h1`
	font-size: 1.7rem;
	color: var(--bold-text-color);
`;

enum sortOptions {
	NO_SORT = 'Без сортировки',
	TITLE = 'По названию',
	TAGS = 'По тегам',
	HARDNESS = 'По сложности',
	URGENCY = 'По срочности',
}

const sorts: { [K: string]: (a: NotePreview, b: NotePreview) => number } = {
	[sortOptions.NO_SORT]: () => -1,
	[sortOptions.TITLE]: (a, b) => {
		return a.title > b.title ? 1 : -1;
	},
	[sortOptions.TAGS]: (a, b) => {
		const aTags = a.tags.sort((i, j) => (i > j ? 1 : -1));
		const bTags = b.tags.sort((i, j) => (i > j ? 1 : -1));

		for (let i = 0; i < Math.min(aTags.length, bTags.length); i++) {
			if (aTags[i] > bTags[i]) return 1;
		}

		return aTags.length > bTags.length ? 1 : -1;
	},
	[sortOptions.HARDNESS]: (a, b) => {
		if (a.tags.some((tag) => HARDNESS_TAGS.includes(tag))) {
			if (b.tags.some((tag) => HARDNESS_TAGS.includes(tag))) {
				const aHardnessTag = a.tags.find((tag) =>
					HARDNESS_TAGS.includes(tag)
				) as string;
				const bHardnessTag = b.tags.find((tag) =>
					HARDNESS_TAGS.includes(tag)
				) as string;

				return HARDNESS_TAGS.indexOf(aHardnessTag) >
					HARDNESS_TAGS.indexOf(bHardnessTag)
					? -1
					: 1;
			} else {
				return -1;
			}
		}

		return 1;
	},
	[sortOptions.URGENCY]: (a, b) => {
		if (a.tags.some((tag) => URGENCY_TAGS.includes(tag))) {
			if (b.tags.some((tag) => URGENCY_TAGS.includes(tag))) {
				const aUrgencyTag = a.tags.find((tag) =>
					URGENCY_TAGS.includes(tag)
				) as string;
				const bUrgencyTag = b.tags.find((tag) =>
					URGENCY_TAGS.includes(tag)
				) as string;

				return URGENCY_TAGS.indexOf(aUrgencyTag) >
					URGENCY_TAGS.indexOf(bUrgencyTag)
					? -1
					: 1;
			} else {
				return -1;
			}
		}

		return 1;
	},
};

const NotesSection: React.FC<Props> = ({}) => {
	const { openedSectionId } = useOpenedSection();
	const { authToken } = useAuthToken();
	const { tags } = useNotesTags();

	const { data: sectionData } = useQuery<getSectionType>(
		[GET_SECTION, openedSectionId],
		() => getSectionQuery(authToken, openedSectionId!)
	);

	const [search, setSearch] = useState('');
	const [usedTags, setUsedTags] = useState<string[]>([]);
	const [sortedBy, setSortedBy] = useState<string>(sortOptions.NO_SORT);

	const toggleTag = useCallback(
		(tag: string) => {
			if (usedTags.includes(tag)) {
				setUsedTags(usedTags.filter((usedTag) => usedTag !== tag));
			} else {
				setUsedTags([...usedTags, tag]);
			}
		},
		[usedTags, setUsedTags]
	);

	const sortsList = useMemo(() => {
		let sorts = Object.values(sortOptions);

		if (tags.every((tag) => !HARDNESS_TAGS.includes(tag))) {
			sorts = sorts.filter((sort) => sort !== sortOptions.HARDNESS);
		}
		if (tags.every((tag) => !URGENCY_TAGS.includes(tag))) {
			sorts = sorts.filter((sort) => sort !== sortOptions.URGENCY);
		}

		return sorts;
	}, [tags]);

	return (
		<ContentContainer>
			{sectionData && (
				<>
					<Title>{sectionData.name}</Title>
					<Filters
						onSearchChange={setSearch}
						onSortChange={setSortedBy}
						sortsList={sortsList}
						defaultSort={sortedBy}
						onTagsChange={setUsedTags}
						usedTags={usedTags}
					/>
					<Suspense fallback={<LoaderPage imbedded />}>
						<Notes
							search={search}
							sort={sorts[sortedBy]}
							toggleTag={toggleTag}
							usedTags={usedTags}
						/>
					</Suspense>
				</>
			)}
		</ContentContainer>
	);
};

export default NotesSection;
