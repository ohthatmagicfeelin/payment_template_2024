import { catchAsync } from '../../../../utils/catchAsync.js';
import { signupService } from '../services/signupService.js';

export const signupController = {
  signup: catchAsync(async (req, res) => {
    const { email, password } = req.body;
    const { user, message } = await signupService.signup(email, password);
    
    res.status(201).json({ 
      user: { id: user.id, email: user.email },
      message
    });
  })
}; 