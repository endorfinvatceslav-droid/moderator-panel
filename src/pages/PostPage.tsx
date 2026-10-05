import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { endpoints } from '../api/endpoints';
import { AuthorBadge } from '../components/AuthorBadge';
import { CommentForm } from '../components/CommentForm';
import { CommentList } from '../components/CommentList';
import { ErrorMessage } from '../components/ErrorMessage';
import { Loader } from '../components/Loader';
import { useFetch } from '../hooks/useFetch';
import type { Comment, Post } from '../types';

export default function PostPage() {
  const { postId = '' } = useParams();
  const [newComments, setNewComments] = useState<Comment[]>([]);

  const {
    data: post,
    isLoading: postLoading,
    error: postError,
    status: postStatus,
    refetch: refetchPost,
  } = useFetch<Post>(endpoints.post(postId));

  const {
    data: comments,
    isLoading: commentsLoading,
    error: commentsError,
    refetch: refetchComments,
  } = useFetch<Comment[]>(endpoints.postComments(postId));

  function handleCreated(comment: Comment) {
    setNewComments(comments => [
      ...comments,
      { ...comment, id: Date.now() },
    ]);
  }

  if (postLoading) return <Loader />;

  if (postStatus === 404) {
    return (
      <section>
        <p>Пост не найден</p>
        <Link to="/posts">К списку постов</Link>
      </section>
    );
  }

  if (postError || !post) {
    return (
      <ErrorMessage
        message={postError ?? 'Пост не найден'}
        onRetry={refetchPost}/>
    );
  }

  const allComments = [...(comments ?? []), ...newComments];

  return (
    <section>
      <Link to="/posts" className="back-link">
        К списку постов
      </Link>

      <h1>{post.title}</h1>
      <p className="card__text">{post.body}</p>

      <AuthorBadge userId={post.userId} />

      <h2>Комментарии</h2>

      {commentsLoading && <Loader text="Загружаем комментарии..." />}

      {commentsError && (
        <ErrorMessage
          message={commentsError}
          onRetry={refetchComments}/>
      )}

      {!commentsLoading && !commentsError && (
        <CommentList comments={allComments} />
      )}

      <CommentForm
        postId={post.id}
        onCreated={handleCreated}/>
    </section>
  );
}