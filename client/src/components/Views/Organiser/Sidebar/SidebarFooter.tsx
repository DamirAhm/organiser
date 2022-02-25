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
import { sectionsList } from '../../../../types';
import { SidebarHeaderContainer } from './SidebarHeader';

const SidebarFooterContainer = styled(SidebarHeaderContainer)`
	background-color: var(--background-color);
	box-shadow: inset 0px 1px 2px -1px black;
	position: relative;
`;
const Pen = styled.button`
	width: 50px;
	height: 50px;
	color: var(--text-color);
	border-radius: 50%;

	& > * {
		fill: var(--bold-text-color);
	}

	&:hover,
	&:focus {
		background-color: var(--bold-text-color);

		svg {
			fill: white;
		}
	}
`;
const Trash = styled.button`
	width: 50px;
	height: 50px;
	color: var(--text-color);
	border-radius: 50%;

	& > * {
		fill: var(--negative);
	}

	&:hover,
	&:focus {
		background-color: var(--negative);
	}

	&:hover > svg,
	&:focus > svg {
		fill: white;
	}
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
				<Pen onClick={() => startEditing(openedSectionId!)}>
					<GoPencil size={30} />
				</Pen>
			) : (
				<div></div>
			)}
			<Trash onClick={deleteSection}>
				<GoTrashcan size={30} />
			</Trash>
		</SidebarFooterContainer>
	);
};

export default SidebarFooter;
