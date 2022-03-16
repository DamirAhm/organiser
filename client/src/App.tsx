import { Suspense, lazy, useEffect, useState } from 'react';
import { Route, Routes, useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery, useQueryClient } from 'react-query';
import styled from 'styled-components';

import getAuthorizedQuery, {
	GET_AUTHORIZED,
} from './api/Queries/getAuthorized';
import { AuthContextProvider, authToken } from './Contexts/AuthContext';
import { LoaderPage } from './components/Views/LoaderPage';
import getUserQuery, { GET_USER } from './api/Queries/getUser';
import getSectionQuery, { GET_SECTION } from './api/Queries/getSection';
import getSectionsListQuery, {
	GET_SECTIONS_LIST,
} from './api/Queries/getSectionsList';
import { sectionId } from './hooks/useOpenedSection';

const Auth = lazy(() => import('./components/Views/AuthPage'));
const Organiser = lazy(() => import('./components/Views/Organiser'));

const AppWrapper = styled.div`
	width: 100%;
	min-height: 100vh;
	display: flex;
	justify-content: center;
`;

function App() {
	const [urlSearchParams] = useSearchParams();
	const queryClient = useQueryClient();
	const hasAuth = urlSearchParams.has('auth');

	const [authToken, setAuthToken] = useState<authToken>(
		import.meta.env.VITE_AUTH_TOKEN ?? null
	);

	const { isLoading, data: authorized } = useQuery<
		boolean,
		{ status: number }
	>(GET_AUTHORIZED, () => getAuthorizedQuery(authToken), {
		staleTime: Infinity,
	});

	const navigate = useNavigate();

	useEffect(() => {
		if (hasAuth && import.meta.env.DEV) {
			setAuthToken(urlSearchParams.get('auth'));
			queryClient.prefetchQuery({
				queryKey: GET_USER,
				queryFn: () => getUserQuery(authToken),
			});
			queryClient.prefetchQuery({
				queryKey: GET_SECTIONS_LIST,
				queryFn: () => getSectionsListQuery(authToken),
			});
		}
	}, [hasAuth]);

	useEffect(() => {
		if (!isLoading) {
			if (!authorized) navigate('/auth');
		}
	}, [authorized, isLoading]);

	return (
		<AuthContextProvider
			value={{
				authToken,
				setAuthToken,
			}}
		>
			<AppWrapper className='App'>
				{isLoading ? (
					<div className='loader'>
						<LoaderPage />
					</div>
				) : (
					<Suspense fallback={<LoaderPage />}>
						<Routes>
							<Route path='/auth' element={<Auth />} />
							<Route path='/*' element={<Organiser />} />
						</Routes>
					</Suspense>
				)}
			</AppWrapper>
		</AuthContextProvider>
	);
}

export default App;
