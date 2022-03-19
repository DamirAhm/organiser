export const SERVER_PORT = 8000;

export const SERVER_URL = import.meta.env.PROD
	? ''
	: `http://localhost:${SERVER_PORT}`;

export const HARDNESS_TAGS = ['easy', 'medium', 'hard'];
export const URGENCY_TAGS = ['urgent', 'waitable', 'longterm'];
