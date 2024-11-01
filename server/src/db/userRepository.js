import bcrypt from 'bcrypt';
import pool from './index.js'; 

const SALT_ROUNDS = 10;

export async function getUserByEmail(email) {
  const query = 'SELECT * FROM users WHERE email = $1';
  const result = await pool.query(query, [email]);
  return result.rows[0];
}

export async function createUser({ email, password }) {
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  
  const query = `
    INSERT INTO users (email, password, email_verified) 
    VALUES ($1, $2, false) 
    RETURNING id, email
  `;
  
  const result = await pool.query(query, [email, hashedPassword]);
  return result.rows[0];
}

export async function verifyCredentials(email, password) {
  const user = await getUserByEmail(email);

  if (!user) {
    throw new Error('User not found');
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new Error('Incorrect password');
  }
  
  console.log('Credentials verified for user:', { id: user.id, email: user.email });
  return user;
}

export async function getUserById(id) {
  const query = 'SELECT * FROM users WHERE id = $1';
  const result = await pool.query(query, [id]);
  return result.rows[0];
}

export async function updateUserPassword(userId, newPassword) {
  const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
  
  const query = `
    UPDATE users 
    SET password = $1 
    WHERE id = $2 
    RETURNING id, email
  `;
  
  const result = await pool.query(query, [hashedPassword, userId]);
  return result.rows[0];
}

export async function markEmailAsVerified(userId) {
  const query = `
    UPDATE users 
    SET email_verified = true 
    WHERE id = $1 
    RETURNING id, email
  `;
  
  const result = await pool.query(query, [userId]);
  return result.rows[0];
}