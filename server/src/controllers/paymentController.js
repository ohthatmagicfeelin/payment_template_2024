import * as paymentService from '../services/paymentService.js'

export const createUser = async (req, res) => {
    try {
        const result = await paymentService.createUser(req.body);
        res.json({ success: true, userId: result.userId });
    } catch (error) {
        cconsole.error(error);
        res.status(500).json({ error: 'Failed to create user' });
    }
}


export const createPaymentIntent = async (req, res) => {
    try {
        const result = await paymentService.createPaymentIntent(req.body);
        res.json({ clientSecret: result.clientSecret });
    } catch (error) {
        cconsole.error(error);
        res.status(500).json({ error: 'Failed to create payment intent' });
    }
}


