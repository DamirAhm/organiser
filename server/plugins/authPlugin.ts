import fp from 'fastify-plugin';
import { RawReplyDefaultExpression, RawRequestDefaultExpression, RawServerDefault } from 'fastify';

export default fp(async function(fastify, opts) {
	fastify.register(require("fastify-jwt"), {
		secret: process.env.JWT_SECRET,
	})

	fastify.decorate("authenticate", async function(request: RawRequestDefaultExpression<RawServerDefault> & {jwtVerify(): void}, reply: RawReplyDefaultExpression<RawServerDefault>) {
		try {
			await request.jwtVerify()
		} catch (err) {
			reply.end(err)
		}
	})
})