import React, { Suspense, useCallback, useState } from 'react';
import styled from 'styled-components';
import { useQuery } from 'react-query';

import getUser, {
	getUserType,
	GET_USER,
} from '../../../../api/Queries/getUser';
import useAuthToken from '../../../../hooks/useAuthToken';
import Loader from '../../../Common/Loader';
import SidebarHeader, { SidebarHeaderContainer } from './SidebarHeader';
import SectionsList from './SectionsList';
import SidebarFooter from './SidebarFooter';
import { useOpenedSection } from '../../../../hooks/useOpenedSection';
import useEscape from '../../../../hooks/useEscape';

const SidebarContainer = styled.aside`
	background-color: var(--background-color);
	display: grid;
	grid-template-rows: 70px 1fr 70px;
	position: fixed;
	width: var(--sidebar-width);
	height: 100%;
	color: var(--text-color);
	z-index: 9999;
`;

type Props = {};

const Sidebar: React.FC<Props> = ({}) => {
	const { authToken } = useAuthToken();
	const { openedSectionId } = useOpenedSection();

	const { isFetching: isFetchingUser, data: user } = useQuery<getUserType>(
		GET_USER,
		() => getUser(authToken),
		{
			staleTime: Infinity,
		}
	);

	const [isCreating, setIsCreating] = useState<boolean>(false);
	const [editableSection, setEditableSection] = useState<string | null>(null);

	const startCreating = useCallback(() => {
		stopEditing();
		setIsCreating(true);
	}, [setIsCreating]);
	const stopCreating = useCallback(
		() => setIsCreating(false),
		[setIsCreating]
	);

	const startEditing = useCallback((sectionId: string) => {
		stopCreating();
		setEditableSection(sectionId);
	}, []);
	const stopEditing = useCallback(() => {
		setEditableSection(null);
	}, []);

	const cancelAnyActions = useCallback(() => {
		stopCreating();
		stopEditing();
	}, [stopCreating, stopEditing]);

	useEscape(cancelAnyActions);

	return (
		<SidebarContainer onClick={cancelAnyActions}>
			{isFetchingUser || !user ? (
				<SidebarHeaderContainer>
					<Loader />
				</SidebarHeaderContainer>
			) : (
				<SidebarHeader
					name={user.name}
					photo_url={user.photo_url}
					showButton={!isCreating}
					startCreating={startCreating}
				/>
			)}
			<Suspense fallback={<ListFallback />}>
				<SectionsList
					isCreating={isCreating}
					stopCreating={stopCreating}
					stopEditing={stopEditing}
					startEditing={startEditing}
					editableSection={editableSection}
				/>
			</Suspense>
			{!openedSectionId?.startsWith('placeholder') && (
				<SidebarFooter
					startEditing={startEditing}
					isEditing={editableSection !== null}
				/>
			)}
		</SidebarContainer>
	);
};

const ListFallbackContainer = styled.div`
	padding: 10px;
	background-color: var(--background-color);
	display: flex;
	justify-content: center;
`;
const ListFallback: React.FC = () => {
	return (
		<ListFallbackContainer>
			<Loader />
		</ListFallbackContainer>
	);
};

export default Sidebar;
