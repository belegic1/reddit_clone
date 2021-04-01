import { User } from './../entity/User';
import { Request, Response, Router } from 'express';
import { validate } from 'class-validator';
import { QueryRunnerProviderAlreadyReleasedError } from 'typeorm';

const register = async (req: Request, res: Response) => {
  const { email, username, password } = req.body;
  try {
    let errors: any = {};
    const emailUser = await User.findOne({ email });
    const usernameUser = await User.findOne({ username });

    if (emailUser) errors.email = 'Email already in use';
    if (usernameUser) errors.username = 'Username already in use';

    if (Object.keys(errors).length > 0) {
      return res.status(400).json(errors);
    }

    const user = new User({ email, username, password });

    errors = await validate(user);

    if (errors.length > 0) return res.status(400).json({ errors });
    await user.save();
    return res.status(201).json(user);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const router = Router();

router.post('/register', register);

export default router;
