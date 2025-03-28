import { catchAsync } from '../../../../utils/catchAsync.js';

export const loginController = {
    getCsrfToken: catchAsync(async (req, res) => {
        const token = req.csrfToken();
        req.session.csrfToken = token;
        res.json({ csrfToken: token });
    }) 
}