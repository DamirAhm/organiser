import React, { useCallback } from 'react';
import { GoPencil, GoTrashcan } from 'react-icons/go';
import { useMutation, useQueryClient } from 'react-query';
import styled from 'styled-components';
import useAuthToken from '../../../../hooks/useAuthToken';
import { useOpenedSection } from '../../../../hooks/useOpenedSection';
import deleteSectionMutation, {
	deleteSectionArgs,
	deleteSectionType,
} from '../../../../api/Mutations/deleteSection';
import {
	GET_SECTIONS_LIST,
	getSectionsListType,
} from '../../../../api/Queries/getSectionsList';
import { SidebarHeaderContainer } from './SidebarHeader';
import { ColloredButton } from '../../../CommonStyled';

const SidebarFooterContainer = styled(SidebarHeaderContainer)`
	background-color: var(--background-color);
	box-shadow: inset 0px 1px 2px -1px black;
	position: relative;
`;

const FooterButton = styled(ColloredButton)`
	width: 50px;
	height: 50px;
	color: var(--text-color);
	border-radius: 50%;
`;

type Props = {
	onSectionDelete?: (deletedSectionId: string) => void;
	startEditing: (sectionId: string) => void;
	isEditing: boolean;
};

const SidebarFooter: React.FC<Props> = ({
	onSectionDelete = () => {},
	startEditing,
	isEditing,
}) => {
	const { openedSectionId } = useOpenedSection();
	const { authToken } = useAuthToken();

	const queryClient = useQueryClient();
	const { mutateAsync: deleteAsync } = useMutation<
		deleteSectionType,
		{},
		deleteSectionArgs
	>(deleteSectionMutation, {
		onMutate: ({ sectionId }) => {
			queryClient.cancelQueries(GET_SECTIONS_LIST);

			const previousSectionsList =
				queryClient.getQueryData<getSectionsListType>(
					GET_SECTIONS_LIST
				);

			queryClient.setQueryData<getSectionsListType>(
				GET_SECTIONS_LIST,
				(oldSectionsList) =>
					oldSectionsList === undefined
						? []
						: oldSectionsList.filter(({ id }) => id !== sectionId)
			);

			return () =>
				queryClient.setQueryData(
					GET_SECTIONS_LIST,
					previousSectionsList
				);
		},
	});

	const deleteSection = useCallback(async () => {
		if (
			openedSectionId !== null &&
			!openedSectionId.startsWith('placeholder')
		) {
			onSectionDelete(openedSectionId);
			await deleteAsync({ sectionId: openedSectionId, authToken });
		}
	}, [openedSectionId]);

	return (
		<SidebarFooterContainer as='footer'>
			{!isEditing ? (
				<FooterButton
					color='var(--border-color)'
					onClick={() => startEditing(openedSectionId!)}
				>
					<GoPencil size={30} />
				</FooterButton>
			) : (
				<div></div>
			)}
			<FooterButton color='var(--negative)' onClick={deleteSection}>
				<GoTrashcan size={30} />
			</FooterButton>
		</SidebarFooterContainer>
	);
};

export default SidebarFooter;
