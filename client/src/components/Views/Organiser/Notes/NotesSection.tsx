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
	grid-template-rows: 40px 40px 1fr;
	row-gap: 20px;
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
						searchText={search}
						sortsList={options}
						defaultSort={sortedBy}
					/>
					<Suspense fallback={<LoaderPage imbedded />}>
						<Notes />
					</Suspense>
				</>
			)}
		</ContentContainer>
	);
};

export default NotesSection;
