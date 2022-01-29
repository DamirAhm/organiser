import jwt from 'express-jwt';

const getTokenFromHeadersOrCookie = (req: any): string | null => {
	const { headers: { authorization }, cookies } = req;

	if(authorization && authorization.split(' ')[0] === 'Token') {
		return authorization.split(' ')[1];
	} else if (cookies.auth) {
		return cookies.auth;
	}

	return null;
};

const auth = {
	required: jwt({
		secret: process.env.SECRET as string,
		userProperty: 'payload',
		getToken: getTokenFromHeadersOrCookie,
		algorithms: ["HS256"]
	}),
	optional: jwt({
		secret: process.env.SECRET as string,
		userProperty: 'payload',
		getToken: getTokenFromHeadersOrCookie,
		credentialsRequired: false,
		algorithms: ["HS256"]
	}),
};

export default auth;