import React, { useCallback } from 'react';
import { GoPlus } from 'react-icons/go';
import styled from 'styled-components';
import PhotoPlaceholder from '../../../Common/PhotoPlaceholder';

export const SidebarHeaderContainer = styled.header`
	padding: 20px;
	display: flex;
	justify-content: space-between;
	align-notes: center;
	box-shadow: 0px 1px 2px -1px black;
	position: relative;
`;

const UserInfo = styled.div`
	display: flex;
	align-notes: center;
`;

const UserName = styled.span`
	font-size: 1.4rem;
	color: var(--bold-text-color);
`;

const Photo = styled.img`
	background-color: var(--border-color);
	border-radius: 50%;
	width: 50px;
	height: 50px;
	margin-right: 10px;
`;

const AddButton = styled.button`
	width: 50px;
	height: 50px;
	border-radius: 50%;

	& > * {
		fill: var(--positive);
	}

	&:hover,
	&:focus {
		background-color: var(--positive);

		svg {
			fill: white;
		}
	}
`;

type Props = {
	photo_url: string | null;
	name: string;
	showButton?: boolean;
	startCreating: () => void;
};

const SidebarHeader: React.FC<Props> = ({
	startCreating,
	name,
	photo_url,
	showButton = true,
}) => {
	const handleClick = useCallback(
		(e: React.MouseEvent<HTMLButtonElement>) => {
			e.stopPropagation();
			startCreating();
		},
		[]
	);

	return (
		<SidebarHeaderContainer>
			<UserInfo>
				{photo_url === null ? (
					<PhotoPlaceholder />
				) : (
					<Photo src={photo_url} />
				)}
				<UserName>{name}</UserName>
			</UserInfo>
			{showButton && (
				<AddButton onClick={handleClick}>
					<GoPlus size={30} />
				</AddButton>
			)}
		</SidebarHeaderContainer>
	);
};

export default SidebarHeader;
