import React, { useCallback, useState } from 'react';
import { useQueryClient } from 'react-query';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import useAuthToken from '../../../../hooks/useAuthToken';
import getSectionQuery, {
	GET_SECTION,
} from '../../../../api/Queries/getSection';
import { SectionPreview } from '../../../../types';

export const SectionNoteContainer = styled.li<{ isActive: boolean }>`
	padding: 20px;
	display: grid;
	${({ isActive }) =>
		isActive
			? 'border: 2px solid var(--positive);'
			: `
				border: 2px solid transparent;
				transition: 200ms;
				border-bottom: 2px solid var(--border-color);

				&:hover {
					border-color: var(--bold-text-color);
					cursor: pointer;
					color: var(--bold-text-color);
					border: 2px solid var(--border-color);
				}
	`}
	align-items: start;
	border-radius: 5px;
	font-size: 1.5rem;
	color: var(--bold-text-color);
	height: fit-content;
`;

const NavLinkStyled = styled(NavLink)`
	width: 100%;
	height: fit-content;
	box-sizing: border-box;
`;

type Props = React.HTMLAttributes<HTMLAnchorElement> & SectionPreview;

const SectionNote: React.FC<Props> = ({ name, id, pinned, ...rest }) => {
	const [prefetched, setPrefetched] = useState<boolean>(false);

	const queryClient = useQueryClient();
	const { authToken } = useAuthToken();

	const prefetchSection = useCallback(() => {
		if (!id.startsWith('placeholder') && !prefetched) {
			queryClient.prefetchQuery({
				queryKey: [GET_SECTION, id],
				queryFn: () => getSectionQuery(authToken, id),
			});

			setPrefetched(true);
		}
	}, [prefetched, setPrefetched, queryClient, authToken, id, GET_SECTION]);

	return (
		<NavLinkStyled to={`/${id}`} {...rest}>
			{({ isActive }) => (
				<SectionNoteContainer
					isActive={isActive}
					onMouseEnter={prefetchSection}
					onFocus={prefetchSection}
				>
					{name}
				</SectionNoteContainer>
			)}
		</NavLinkStyled>
	);
};

export default SectionNote;
