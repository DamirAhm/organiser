import React, { useState } from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { useAuthToken } from '../../../../Contexts/AuthContext';
import { useOpenedSection } from '../../../../hooks/useOpenedSection';
import getSection, { GET_SECTION } from '../../../../api/Queries/getSection';
import Filters from '../../../Common/Filters';
import Notes from './Notes';

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

	const sectionData = useQuery([GET_SECTION, openedSectionId], () =>
		getSection(authToken, openedSectionId!)
	);

	const [search, setSearch] = useState('');
	const [sortedBy, setSortedBy] = useState<string | undefined>();

	const options = ['1', '2', '3', '4'];

	return (
		<ContentContainer>
			{sectionData && sectionData?.data && (
				<>
					<Title>{sectionData.data.name}</Title>
					<FiltersWrapper
						as={Filters}
						onSearchChange={setSearch}
						onSortChange={setSortedBy}
						searchText={search}
						sortsList={options}
						defaultSort={sortedBy}
					/>
					<Notes />
				</>
			)}
		</ContentContainer>
	);
};

export default NotesSection;
