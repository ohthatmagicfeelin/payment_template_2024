// server/src/services/paymentService.js
import * as paymentRepository from '../db/paymentRepository.js';
import Stripe from 'stripe';
import bcrypt from 'bcrypt';
import config from '../config/env.js';


const stripe = new Stripe(config.STRIPE_SECRET_KEY);

export const createStripeCustomer = async (email, userId) => {
    const customer = await stripe.customers.create({
        email: email
    });

    await paymentRepository.updateStripeCustomerId(customer.id, userId);

    return customer.id;
}


export const createUser = async ({ email, password }) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = await paymentRepository.createUser(email, hashedPassword);
    await createStripeCustomer(email, userId)
    return { userId };
}


export const createPaymentIntent = async ({ amount, userId }) => {
	let stripeCustomerId = await paymentRepository.getStripeCustomerId(userId);

	// If user doesn't have a stripe_customer_id, create one
	if (!stripeCustomerId) {
		const userEmail = await paymentRepository.getUserEmail(userId);
		if (!userEmail) {
			throw new Error('User not found');
		}
		stripeCustomerId = await createStripeCustomer(userEmail, userId)
	}

	// Create payment intent with Stripe customer ID
	const paymentIntent = await stripe.paymentIntents.create({
		amount,
		currency: 'usd',
		customer: stripeCustomerId,
		payment_method_types: ['card',],
	});

	return { clientSecret: paymentIntent.client_secret };

}
