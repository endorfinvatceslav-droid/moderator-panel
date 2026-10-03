import { useState } from 'react';
import { endpoints, POSTS_PER_PAGE } from '../api/endpoints';
import { Pagination } from '../components/Pagination';
import { PostCard } from '../components/PostCard';
import { useDebounce } from '../hooks/useDebounce';
import { useFetch } from '../hooks/useFetch';
import type { Post } from '../types';

export default function PostsPage() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  const debouncedQuery = useDebounce(query, 500);

  const { data: posts, isLoading } = useFetch<Post[]>(
    endpoints.posts({ page, query: debouncedQuery })
  );

  function handleQueryChange(value: string) {
    setQuery(value);
    setPage(1);
  }

  const hasNext = (posts?.length ?? 0) === POSTS_PER_PAGE;

  return (
    <section>
      <h1>Посты</h1>

      <input
        className="input"
        value={query}
        onChange={e => handleQueryChange(e.target.value)}
        placeholder="Поиск по заголовку и тексту"/>


      <ul className="list">
        {posts?.map(post => ( <PostCard key={post.id} post={post} />))}
      </ul>

      <Pagination
        page={page}
        hasNext={hasNext}
        isDisabled={isLoading}
        onChange={setPage}/>
    </section>
  );
}