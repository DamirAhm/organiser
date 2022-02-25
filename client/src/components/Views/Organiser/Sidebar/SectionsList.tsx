import React, { Fragment, SetStateAction, useCallback, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import styled from 'styled-components';
import useAuthToken from '../../../../hooks/useAuthToken';
import { useOpenedSection } from '../../../../hooks/useOpenedSection';
import createSection, {
	createSectionArgs,
	createSectionType,
} from '../../../../api/Mutations/createSection';
import getSectionsList, {
	getSectionsListType,
	GET_SECTIONS_LIST,
} from '../../../../api/Queries/getSectionsList';
import { SectionPreview } from '../../../../types';
import SectionNote from './SectionItem';
import SectionNamingNote from './SectionNamingItem';
import renameSection, {
	renameSectionArgs,
	renameSectionType,
} from '../../../../api/Mutations/renameSection';

const List = styled.ul`
	overflow-y: auto;
	padding: 10px;
	background-color: var(--background-color);
	display: grid;
	grid-gap: 20px;
	grid-template-rows: repeat(auto-fill, 76px);
`;

type Props = {
	isCreating: boolean;
	stopCreating: () => void;
	editableSection: string | null;
	stopEditing: () => void;
	startEditing: (sectionId: string) => void;
};

const SectionsList: React.FC<Props> = ({
	isCreating,
	stopCreating,
	editableSection,
	startEditing,
	stopEditing,
}) => {
	const { authToken } = useAuthToken();
	const { setOpenedSectionId, openedSectionId } = useOpenedSection();
	const { data: sectionsData } = useQuery<getSectionsListType>(
		GET_SECTIONS_LIST,
		() => getSectionsList(authToken)
	);

	const queryClient = useQueryClient();
	const { mutateAsync: createAsync } = useMutation<
		createSectionType,
		{},
		createSectionArgs
	>(createSection, {
		onMutate: ({ name }) => {
			queryClient.cancelQueries(GET_SECTIONS_LIST);

			const previousTodos =
				queryClient.getQueryData<getSectionsListType>(
					GET_SECTIONS_LIST
				);

			queryClient.setQueryData<getSectionsListType>(
				GET_SECTIONS_LIST,
				(old) => [
					...(old || []),
					{
						name,
						pinned: false,
						id: 'placeholder' + new Date().getTime().toString(),
					},
				]
			);

			return () =>
				queryClient.setQueryData(GET_SECTIONS_LIST, previousTodos);
		},
	});

	const { mutateAsync: renameAsync } = useMutation<
		renameSectionType,
		{},
		renameSectionArgs
	>(renameSection, {
		onMutate: ({ sectionId, name }) => {
			queryClient.cancelQueries(GET_SECTIONS_LIST);

			const previousSectionsList =
				queryClient.getQueryData<getSectionsListType>(
					GET_SECTIONS_LIST
				);

			queryClient.setQueryData<getSectionsListType>(
				GET_SECTIONS_LIST,
				(old) =>
					old === undefined
						? []
						: old.map((section) =>
								section.id !== sectionId
									? section
									: { ...section, name }
						  )
			);

			return () =>
				queryClient.setQueryData(
					GET_SECTIONS_LIST,
					previousSectionsList
				);
		},
	});

	const rename = useCallback(
		(sectionId: string, name: string, previousName: string) => {
			if (openedSectionId !== null) {
				stopEditing();
				if (previousName !== sectionId) {
					renameAsync({ authToken, sectionId, name });
				}
			}
		},
		[stopEditing, renameAsync, authToken, openedSectionId]
	);

	//Refetch sections list query after getting new section created
	const onNewSectionFetched = useCallback((newSection: SectionPreview) => {
		setOpenedSectionId(newSection.id);

		queryClient.refetchQueries(GET_SECTIONS_LIST, {
			exact: true,
		});
	}, []);

	const creationConfirmed = useCallback(
		async (name: string) => {
			if (name.trim() === '') {
				alert('Название не должно быть пустой строкой');
			}

			stopCreating();
			const newSection = await createAsync({ authToken, name });

			if (newSection !== null) {
				onNewSectionFetched(newSection);
			}
		},
		[authToken, createAsync]
	);

	//If opened section got deleted navigates to first section in the list
	useEffect(() => {
		if (
			sectionsData?.every(
				({ id: sectionId }) => sectionId !== openedSectionId
			)
		) {
			setOpenedSectionId(sectionsData?.[0]?.id || null);
		}
	}, [sectionsData?.length]);

	return (
		<List>
			{isCreating && <SectionNamingNote onSubmit={creationConfirmed} />}
			{sectionsData && (
				<>
					{sectionsData.map((section) => (
						<Fragment key={section.id}>
							{section.id === editableSection ? (
								<SectionNamingNote
									defaultValue={section.name}
									onSubmit={(name: string) =>
										rename(section.id, name, section.name)
									}
								/>
							) : (
								<SectionNote
									onDoubleClick={() =>
										startEditing(section.id)
									}
									{...section}
								/>
							)}
						</Fragment>
					))}
				</>
			)}
		</List>
	);
};

export default SectionsList;
