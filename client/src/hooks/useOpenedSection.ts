import {
	useNavigate,
	useParams,
	useMatch,
	useLocation,
} from 'react-router-dom';

export type sectionId = string | null;

type useOpenedSectionType = {
	openedSectionId: string | null;
	setOpenedSectionId: (newSectionId: string | null) => void;
};

export const useOpenedSection = (): useOpenedSectionType => {
	const navigate = useNavigate();

	const match = useMatch('/:sectionId/*');

	const openedSectionId = match?.params?.sectionId || null;

	return {
		openedSectionId,
		setOpenedSectionId: (newSectionId: string | null) =>
			navigate(`/${newSectionId || ''}`),
	};
};
