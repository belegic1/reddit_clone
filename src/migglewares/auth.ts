import { userGravatar } from './../../client/src/images/userGravatar';
import User from './../entity/User';
import { Request, Response, NextFunction } from 'express';

export default async (_: Request, res: Response, next: NextFunction) => {
  try {
    // const token = req.cookies.token;
    // if (!token) throw new Error('Unauthenticated');
    // const { username }: any = jwt.verify(token, process.env.JWT_SECRET!);
    // const user = await User.findOne({ username });
    // if (!user) throw new Error('unauthenticated');

    // res.locals.user = user;
    const user: User | undefined = res.locals.user;
    if (!user) throw new Error('unauthenticated');

    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauntheticated' });
  }
};
