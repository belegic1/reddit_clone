import { isEmpty } from 'class-validator';
import { Router, Request, Response } from 'express';
import { getRepository } from 'typeorm';
import Sub from '../entity/Sub';
import auth from '../migglewares/auth';

const createSub = async (req: Request, res: Response) => {
  const { name, title, description } = req.body;

  const user = res.locals.user;

  try {
    let errors: any = {};

    if (isEmpty(name)) errors.name = 'Name cannot be empty';
    if (isEmpty(title)) errors.title = 'Title cannot be empty';

    const sub = await getRepository(Sub)
      .createQueryBuilder('sub')
      .where('lower(sub.name) = :name', { name: name.toLowerCase() })
      .getOne();

    if (sub) errors.name = 'Sub already exists. Your Sub must be unique';

    if (Object.keys(errors).length > 0) {
      throw errors;
    }
  } catch (err) {
    return res.status(400).json(err);
  }

  try {
    const newSub = new Sub({ name, description, title, user });
    const sub = await newSub.save();

    return res.status(201).json(sub);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const router = Router();

router.post('/', auth, createSub);

export default router;
