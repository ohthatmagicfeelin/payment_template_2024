// server/src/db/paymentRepository.js
import pool from './index.js';

export async function createUser(email, hashedPassword) {
    // Create user in database
    const query = `INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING *`
    const user = await pool.query(query, [email, hashedPassword]);
    return user.rows[0].id
}


export async function updateStripeCustomerId(customerId, userId) {
    const query = `UPDATE users SET stripe_customer_id = $1 WHERE id = $2`
    await pool.query(query, [customerId, userId]);
}


export async function getStripeCustomerId(userId) {
    const query = `SELECT stripe_customer_id FROM users WHERE id = $1`
    const user = await pool.query(query, [userId]);
    return user.rows[0].stripe_customer_id
}

export async function getUserEmail(userId) {
    const query = `SELECT email FROM users WHERE id = $1`
    const user = await pool.query(query, [userId]);
    return user.rows[0].email
}