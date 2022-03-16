import React, { useCallback, useState } from 'react';
import { HeaderTitle, PoleName, TagsContainer } from './NoteModalsStyles';
import styled from 'styled-components';
import Tag from './Tag';
import { useQuery } from 'react-query';
import getNoteQuery, {
	getNoteType,
	GET_NOTE,
} from '../../../../../api/Queries/getNote';
import useAuthToken from '../../../../../hooks/useAuthToken';
import { LoaderPage } from '../../../LoaderPage';
import { GoTrashcan, GoPencil } from 'react-icons/go';
import { ColloredButton } from '../../../../CommonStyled';
import { NewNote, Note } from '../../../../../types';
import NoteEditingModalContent from './NoteEditingModal';
import { replaceHrefsByAnchors } from '../../../../../utils/replaceHrefsByAnchors';

const Description = styled.span`
	font-size: 1.2rem;
`;

const NoteModalHeader = styled.div`
	width: 100%;
	display: grid;
	grid-template-columns: 100px 1fr 100px;

	& ${HeaderTitle} {
		grid-column: 2;
	}
`;

const HeaderControls = styled.div`
	grid-column: 3;
	display: grid;
	grid-template-columns: 40px 40px;
	grid-gap: 20px;
`;

const HeaderButton = styled(ColloredButton)`
	border-radius: 50%;
`;

type Props = {
	noteId: string;
	deleteNote: () => void;
	changeNote: (changedNote: NewNote, noteId: string) => void;
};

const NoteModalContent: React.FC<Props> = ({
	noteId,
	changeNote,
	deleteNote,
}) => {
	const { authToken } = useAuthToken();
	const { data, isLoading } = useQuery<getNoteType>([GET_NOTE, noteId], () =>
		getNoteQuery(authToken, noteId)
	);

	const [isChanging, setIsChanging] = useState(false);

	const confirmChange = useCallback(
		(changedNote: NewNote) => {
			setIsChanging(false);
			changeNote(changedNote, noteId);
		},
		[setIsChanging, changeNote, noteId]
	);

	const descriptionWithReplacedHrefs = data
		? replaceHrefsByAnchors(data.description)
		: [];

	return (
		<>
			{isLoading ? (
				<LoaderPage imbedded />
			) : (
				<>
					{data &&
						(!isChanging ? (
							<>
								<NoteModalHeader>
									<HeaderTitle>{data.title}</HeaderTitle>
									<HeaderControls>
										<HeaderButton
											onClick={() => setIsChanging(true)}
											color='var(--border-color)'
										>
											<GoPencil size={30} />
										</HeaderButton>
										<HeaderButton
											color='var(--negative)'
											onClick={deleteNote}
										>
											<GoTrashcan
												size={30}
												viewBox='0 0 13 16'
											/>
										</HeaderButton>
									</HeaderControls>
								</NoteModalHeader>
								<TagsContainer>
									{data.tags.map((tag) => (
										<Tag
											key={tag}
											name={tag}
											removable={false}
										/>
									))}
								</TagsContainer>
								<hr />
								<Description>
									{descriptionWithReplacedHrefs}
								</Description>
								<PoleName>Файлы</PoleName>
								<span>В разработке....</span>
							</>
						) : (
							<NoteEditingModalContent
								onFilled={confirmChange}
								onRejected={() => setIsChanging(false)}
								initialState={data}
							/>
						))}
				</>
			)}
		</>
	);
};

export default NoteModalContent;
