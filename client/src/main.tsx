import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {
	QueryCache,
	MutationCache,
	QueryClientProvider,
	QueryClient,
} from 'react-query';
import { HashRouter, BrowserRouter } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';

const queryClient = new QueryClient({
	queryCache: new QueryCache(),
	mutationCache: new MutationCache(),
	defaultOptions: {
		queries: {
			suspense: false,
			retry: 0,
		},
	},
});

ReactDOM.render(
	<React.StrictMode>
		<ErrorBoundary>
			<BrowserRouter>
				<QueryClientProvider client={queryClient}>
					<App />
				</QueryClientProvider>
			</BrowserRouter>
		</ErrorBoundary>
	</React.StrictMode>,
	document.getElementById('root')
);
