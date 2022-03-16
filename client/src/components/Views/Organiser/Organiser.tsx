import React, { Suspense, useEffect } from 'react';
import { useQuery } from 'react-query';
import { Route, Routes, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
	getSectionsListType,
	GET_SECTIONS_LIST,
} from '../../../api/Queries/getSectionsList';
import { useOpenedSection } from '../../../hooks/useOpenedSection';
import { LoaderPage } from '../LoaderPage';

import NotesSection from './Notes';
import Sidebar from './Sidebar';

const View = styled.div`
	display: flex;
	width: 100%;
	min-height: 100vh;
	justify-content: center;
	height: fit-content;
	min-height: 100vh;
`;

const Container = styled.div`
	--sidebar-width: 350px;
	display: grid;
	grid-template-columns: var(--sidebar-width) 1fr;
	width: min(100vw, var(--container-width));
	min-height: 100%;
`;

export const ContentPlaceholder = styled.section`
	width: 100%;
	height: 100%;
	background-color: var(--background-color);
`;

export const LoaderPageWrapper = styled.div`
	width: 100%;
	height: 100%;
	grid-column: 2;
`;

const Organiser: React.FC = () => {
	const { data: sectionsList } =
		useQuery<getSectionsListType>(GET_SECTIONS_LIST);
	const { openedSectionId } = useOpenedSection();
	const navigate = useNavigate();

	useEffect(() => {
		if (!openedSectionId && sectionsList && sectionsList.length > 0) {
			navigate(sectionsList[0].id);
		}
	}, [openedSectionId]);

	return (
		<View>
			<Container>
				<Sidebar />
				<Suspense
					fallback={
						<LoaderPageWrapper>
							<LoaderPage imbedded />
						</LoaderPageWrapper>
					}
				>
					<Routes>
						<Route path=':sectionId/*' element={<NotesSection />} />
						<Route path='' element={<ContentPlaceholder />} />
					</Routes>
				</Suspense>
			</Container>
		</View>
	);
};

export default Organiser;
