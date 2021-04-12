import React from 'react';
import { userGravatar } from '../images/userGravatar';
import { Post } from '../types';
import Link from 'next/link';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import axios from 'axios';
// import { GetServerSideProps } from 'next';
import classNames from 'classnames';

dayjs.extend(relativeTime);

const ActionButton = ({ children }) => {
  return (
    <div className="px-1 py-1 mr-1 text-gray-400 rounded cursor-pointer hover:bg-gray-200">
      {children}
    </div>
  );
};

interface PostCard {
  post: Post;
}

const Postcard = ({
  post: {
    identifier,
    slug,
    title,
    body,
    subName,
    createdAt,
    voteScore,
    userVote,
    commentCount,
    url,
    username,
  },
}: PostCard) => {
  const vote = async (value) => {
    try {
      const res = await axios.post('/misc/vote', {
        identifier,
        slug,
        value,
      });
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="flex mb-4 bg-white rounded" key={identifier}>
      <div className="w-10 py-3 text-center bg-gray-200 rounded-l">
        <div
          className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500"
          onClick={() => vote(1)}
        >
          <i
            className={classNames('icon-arrow-up', {
              'text-red-500': userVote === 1,
            })}
          ></i>
        </div>
        <p className="text-xs font-bold">{voteScore}</p>
        <div
          className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-600"
          onClick={() => vote(-1)}
        >
          <i
            className={classNames('icon-arrow-down', {
              'text-blue-600': userVote === -1,
            })}
          ></i>
        </div>
      </div>
      <div className="w-full p-2">
        <div className="flex items-center">
          <Link href={`/r/${subName}`}>
            <img
              src={userGravatar}
              className="w-6 h-6 mr-1 rounded-full cursor-pointer"
            />
          </Link>
          <Link href={`/r/${subName}`}>
            <a className="text-xs font-bold hover:underline">/r/{subName}</a>
          </Link>
          <p className="text-xs text-gray-500">
            Posted by{' '}
            <Link href={`/u/${username}`}>
              <a className="mx-1 hover:underline">/u/{username}</a>
            </Link>
            <Link href={url}>
              <a className="mx-1 hover:underline">
                {dayjs(createdAt).fromNow()}
              </a>
            </Link>
          </p>
        </div>
        <Link href={url}>
          <a className="my-1 text-lg font-medium">{title}</a>
        </Link>
        {body && <p className="my-1 text-sm">{body}</p>}
        <div className="flex">
          <Link href={url}>
            <a>
              <ActionButton>
                <i className="mr-1 fas fa-comment-alt fa-xs"></i>
                <span>{commentCount} Coments</span>
              </ActionButton>
            </a>
          </Link>
          <ActionButton>
            <i className="mr-1 fas fa-share fa-xs"></i>
            <span>share</span>
          </ActionButton>
          <ActionButton>
            <i className="mr-1 fas fa-bookmark fa-xs"></i>
            <span>Save</span>
          </ActionButton>
        </div>
      </div>
    </div>
  );
};

export default Postcard;
