import React, { useCallback } from 'react';
import { GoPlus } from 'react-icons/go';
import styled from 'styled-components';
import PhotoPlaceholder from '../../../Common/PhotoPlaceholder';
import { ColloredButton } from '../../../CommonStyled';

export const SidebarHeaderContainer = styled.header`
	padding: 20px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	box-shadow: 0px 1px 2px -1px black;
	position: relative;
`;

const UserInfo = styled.div`
	display: flex;
	align-items: center;
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

const HeaderButton = styled(ColloredButton)`
	width: 50px;
	height: 50px;
	border-radius: 50%;
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
				<HeaderButton color='var(--positive)' onClick={handleClick}>
					<GoPlus size={30} />
				</HeaderButton>
			)}
		</SidebarHeaderContainer>
	);
};

export default SidebarHeader;
