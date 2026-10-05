import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Loader } from './components/Loader';

const PostsPage = lazy(() => import('./pages/PostsPage'));
const PostPage = lazy(() => import('./pages/PostPage'));
const UsersPage = lazy(() => import('./pages/UsersPage'));
const PhotosPage = lazy(() => import('./pages/PhotosPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/posts" replace />} />

        <Route
          path="/posts"
          element={
            <Suspense fallback={<Loader />}>
              <PostsPage />
            </Suspense>
          }/>

        <Route
          path="/posts/:postId"
          element={
            <Suspense fallback={<Loader />}>
              <PostPage />
            </Suspense>
          }/>

        <Route
          path="/users"
          element={
            <Suspense fallback={<Loader />}>
              <UsersPage />
            </Suspense>
          }/>

        <Route
          path="/photos"
          element={
            <Suspense fallback={<Loader />}>
              <PhotosPage />
            </Suspense>
          }/>

        <Route
          path="*"
          element={
            <Suspense fallback={<Loader />}>
              <NotFoundPage />
            </Suspense>
          }/>
      </Route>
    </Routes>
  );
}