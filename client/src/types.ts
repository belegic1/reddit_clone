export interface Post {
  identifier: string;
  title: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  subName: string;
  body?: string;
  username: string;
  url: string;
  voteScore?: number;
  commentCount?: number;
  userVote?: number;
}
