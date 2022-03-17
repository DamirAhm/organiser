import React, { Suspense, useState } from 'react';
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

const FiltersWrapper = styled.div``;

const NotesSection: React.FC<Props> = ({}) => {
	const { openedSectionId } = useOpenedSection();
	const { authToken } = useAuthToken();

	const { data: sectionData } = useQuery<getSectionType>(
		[GET_SECTION, openedSectionId],
		() => getSectionQuery(authToken, openedSectionId!)
	);

	const [search, setSearch] = useState('');
	const [usedTags, setUsedTags] = useState<string[]>([]);
	const [sortedBy, setSortedBy] = useState<string | undefined>();

	const options = ['1', '2', '3', '4'];

	return (
		<ContentContainer>
			{sectionData && (
				<>
					<Title>{sectionData.name}</Title>
					<FiltersWrapper
						as={Filters}
						onSearchChange={setSearch}
						onSortChange={setSortedBy}
						sortsList={options}
						defaultSort={sortedBy}
						onTagsChange={setUsedTags}
					/>
					<Suspense fallback={<LoaderPage imbedded />}>
						<Notes search={search} usedTags={usedTags} />
					</Suspense>
				</>
			)}
		</ContentContainer>
	);
};

export default NotesSection;
