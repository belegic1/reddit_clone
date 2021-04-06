import axios from 'axios';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { Post } from '../types';
import Link from 'next/link';
import { userGravatar } from '../images/userGravatar';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
// import { GetServerSideProps } from 'next';

dayjs.extend(relativeTime);

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    axios
      .get('/posts')
      .then((res) => setPosts(res.data))
      .catch((err) => console.log(err.message));
  }, []);
  return (
    <div className="pt-12">
      <Head>
        <title>Reddit: The front page of the internet!</title>
      </Head>
      <div className="container flex pt-4">
        <div className="w-160">
          {posts.map((post) => (
            <div className="flex mb-4 bg-white rounded" key={post.identifier}>
              <div className="w-10 text-center bg-gray-200 rounded-l">
                <p>v</p>
              </div>
              <div className="w-full p-2">
                <div className="flex items-center">
                  <Link href={`/r/${post.subName}`}>
                    <img
                      src={userGravatar}
                      className="w-6 h-6 mr-1 rounded-full cursor-pointer"
                    />
                  </Link>
                  <Link href={`/r/${post.subName}`}>
                    <a className="text-xs font-bold hover:underline">
                      /r/{post.subName}
                    </a>
                  </Link>
                  <p className="text-xs text-gray-500">
                    Posted by{' '}
                    <Link href={`/u/${post.username}`}>
                      <a className="mx-1 hover:underline">/u/{post.username}</a>
                    </Link>
                    <Link href={post.url}>
                      <a className="mx-1 hover:underline">
                        {dayjs(post.createdAt).fromNow()}
                      </a>
                    </Link>
                  </p>
                </div>
                <Link href={post.url}>
                  <a className="my-1 text-lg font-medium">{post.title}</a>
                </Link>
                {post.body && <p className="my-1 text-sm">{post.body}</p>}
                <div className="flex">
                  <Link href={post.url}>
                    <a>
                      <div className="px-1 py-1 mr-1 text-gray-400 rounded cursor-pointer hover:bg-gray-200">
                        <i className="mr-1 fas fa-comment-alt fa-xs"></i>
                        <span>20 Coments</span>
                      </div>
                    </a>
                  </Link>
                  <div className="px-1 py-1 mr-1 text-gray-400 rounded cursor-pointer hover:bg-gray-200">
                    <i className="mr-1 fas fa-share fa-xs"></i>
                    <span>share</span>
                  </div>
                  <div className="px-1 py-1 mr-1 text-gray-400 rounded cursor-pointer hover:bg-gray-200">
                    <i className="mr-1 fas fa-bookmark fa-xs"></i>
                    <span>Save</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   try {
//     const { data } = await axios.get('/posts');

//     return { props: { posts: data } };
//   } catch (error) {
//     return { props: { error: 'something went wrong' } };
//   }
// };
