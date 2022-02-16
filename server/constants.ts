export const RESPONSE_TYPES = {
	JSON: 'application/json',
	HTML: 'text/html',
	TEXT: 'text/plain',
};

export const STATUS_CODES = {
	BAD: 400,
	GOOD: 200,
};

export const GOOGLE_AUTH_LINK = `http://localhost:${
	process.env.PORT ?? 8080
}/google/callback`;

export const CLIENT_PORT = 3000;

export const CLIENT_URL =
	process.env.NODE_ENV === 'production'
		? '/'
		: `http://localhost:${CLIENT_PORT}`;
