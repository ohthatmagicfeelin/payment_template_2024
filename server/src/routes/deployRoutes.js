// server/src/routes/deployRoutes.js
import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    // Add any additional health checks here if needed
    res.status(200).json({ status: 'ok' });
});

export default router;