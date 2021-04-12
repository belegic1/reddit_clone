import axios from 'axios';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { Post } from '../types';
import Link from 'next/link';
import { userGravatar } from '../images/userGravatar';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Postcard from '../components/Postcard';
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
            <Postcard post={post} key={post.identifier} />
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
