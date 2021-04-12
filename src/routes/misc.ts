import { Router, Request, Response } from 'express';
import User from '../entity/User';
import Post from '../entity/Post';
import auth from '../migglewares/auth';
import Vote from '../entity/Vote';
import Comment from '../entity/Comment';
import user from '../migglewares/user';

const vote = async (req: Request, res: Response) => {
  const { identifier, slug, commentIdentifier, value } = req.body;

  if (![-1, 0, 1].includes(value)) {
    return res.status(400).json({ value: 'value must be -1 , 0 or 1' });
  }

  try {
    const user: User = res.locals.user;
    let post = await Post.findOneOrFail({ identifier, slug });
    let vote: Vote | undefined;
    let comment: Comment | undefined;

    if (commentIdentifier) {
      comment = await Comment.findOneOrFail({ identifier: commentIdentifier });
      vote = await Vote.findOne({ user, comment });
    } else {
      vote = await Vote.findOne({ user, post });
    }
    if (!vote && value === 0) {
      return res.status(404).json({ error: 'vote vas not found' });
    } else if (!vote) {
      vote = new Vote({ user, value });
      if (comment) vote.comment = comment;
      else vote.post = post;
      await vote.save();
    } else if (value === 0) {
      await vote.remove();
    } else if (vote.value !== value) {
      vote.value = value;
      await vote.save();
    }
    post = await Post.findOneOrFail(
      { identifier, slug },
      { relations: ['comments', 'comments.votes', 'sub', 'votes'] }
    );

    post.setUserVote(user);
    post.comments.forEach((c) => c.setUserVote(user));
    return res.json(post);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const router = Router();

router.post('/vote', user, auth, vote);
export default router;
