import { Router, Request, Response } from 'express';
import Comment from '../entity/Comment';
import Post from '../entity/Post';
import Sub from '../entity/Sub';
import auth from '../migglewares/auth';
import user from '../migglewares/user';

const createPost = async (req: Request, res: Response) => {
  const { title, body, sub } = req.body;

  const user = res.locals.user;

  if (title.trim() === '') {
    return res.status(400).json({ title: 'Title cannot be empty' });
  }

  try {
    const subRecord = await Sub.findOneOrFail({ name: sub });
    const post = new Post({ title, body, user, sub: subRecord });
    await post.save();

    return res.status(201).json(post);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

////////////////////////////////

const getPosts = async (_: Request, res: Response) => {
  try {
    const posts = await Post.find({
      order: { createdAt: 'DESC' },
      relations: ['comments', 'votes', 'sub'],
    });

    if (res.locals.user) {
      posts.forEach((p) => p.setUserVote(res.locals.user));
    }
    return res.json(posts);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};
//////////////////////////////////////
const getPost = async (req: Request, res: Response) => {
  const { identifier, slug } = req.params;
  try {
    const post = await Post.findOneOrFail(
      { identifier, slug },
      {
        relations: ['sub'],
      }
    );
    if (!post) return res.status(404).json('Post not found');
    return res.json(post);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

////////////////////////////////////////////////////////

const commentOnPOst = async (req: Request, res: Response) => {
  const { identifier, slug } = req.params;
  const body = req.body.body;

  try {
    const post = await Post.findOneOrFail({ identifier, slug });
    const comment = new Comment({ body, user: res.locals.user, post });
    await comment.save();
    return res.status(201).json(comment);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

////////////////////////////////////////

const router = Router();

router.post('/', user, auth, createPost);
router.get('/', user, getPosts);
router.get('/:identifier/:slug', getPost);
router.post('/:identifier/:slug/comments', user, auth, commentOnPOst);

export default router;
