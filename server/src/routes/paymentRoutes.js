// server/src/routes/paymentRoutes.js
import express from 'express';
import pool from '../db/index.js';
import Stripe from 'stripe';
import bcrypt from 'bcrypt';
import config from '../config/env.js';

const router = express.Router();

const stripe = new Stripe(config.STRIPE_SECRET_KEY);

// Signup endpoint
router.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user in database
    const user = await pool.query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING *',
      [email, hashedPassword]
    );

    // Create Stripe customer
    const customer = await stripe.customers.create({
      email: email
    });

    // Store Stripe customer ID
    await pool.query(
      'UPDATE users SET stripe_customer_id = $1 WHERE id = $2',
      [customer.id, user.rows[0].id]
    );

    res.json({ success: true, userId: user.rows[0].id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, userId } = req.body;
    
    // Get user's stripe_customer_id from database
    const userQuery = await pool.query(
      'SELECT stripe_customer_id FROM users WHERE id = $1',
      [userId]
    );
    
    let stripeCustomerId = userQuery.rows[0]?.stripe_customer_id;
    
    // If user doesn't have a stripe_customer_id, create one
    if (!stripeCustomerId) {
      // Get user email for creating Stripe customer
      const userEmailQuery = await pool.query(
        'SELECT email FROM users WHERE id = $1',
        [userId]
      );
      
      const userEmail = userEmailQuery.rows[0]?.email;
      
      if (!userEmail) {
        return res.status(400).json({ error: 'User not found' });
      }
      
      // Create new Stripe customer
      const customer = await stripe.customers.create({
        email: userEmail
      });
      
      // Save Stripe customer ID to database
      await pool.query(
        'UPDATE users SET stripe_customer_id = $1 WHERE id = $2',
        [customer.id, userId]
      );
      
      stripeCustomerId = customer.id;
    }
    
    // Create payment intent with Stripe customer ID
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      customer: stripeCustomerId,
      payment_method_types: ['card',],
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Payment intent error:', error);
    res.status(400).json({ error: error.message });
  }
});



export default router;

