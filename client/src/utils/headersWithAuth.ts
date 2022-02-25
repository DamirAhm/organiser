export default (authToken: string | null) =>
	authToken ? { headers: { Authorization: 'Token ' + authToken } } : {};
