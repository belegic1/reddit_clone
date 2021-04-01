import { User } from './../entity/User';
import { json, Request, Response, Router } from 'express';
import { validate, isEmpty } from 'class-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import auth from '../migglewares/auth';

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
/////////////////////

const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    let errors: any = {};
    if (isEmpty(username)) errors.username = 'Username cannot be empty';
    if (isEmpty(password)) errors.password = 'Password cannot be empty';

    if (Object.keys(errors).length > 0) return res.status(400).json(errors);
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: 'User not exist' });

    const comparedPasswords = await bcrypt.compare(password, user.password);

    if (!comparedPasswords)
      return res.status(401).json({ password: 'Invalid password' });

    const token = await jwt.sign({ username }, process.env.JWT_SECRET);

    res.set(
      'Set-Cookie',
      cookie.serialize('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 3600,
        path: '/',
      })
    );

    return res.json(user);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

//////////////////////////////////

const me = async (_: Request, res: Response) => {
  return res.json(res.locals.user);
};
///////////////////////////////////
const logout = (_: Request, res: Response) => {
  res.set(
    'Set-Cookie',
    cookie.serialize('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: new Date(0),
      path: '/',
    })
  );

  return res.json({ succes: true });
};

////////////////////////////////////
const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', auth, logout);
router.get('/me', auth, me);

export default router;
