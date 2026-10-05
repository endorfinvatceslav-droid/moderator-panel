import { memo, useCallback, useMemo, useRef, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { endpoints } from '../api/endpoints';
import { ErrorMessage } from '../components/ErrorMessage';
import { Loader } from '../components/Loader';
import { useFetch } from '../hooks/useFetch';
import type { Photo } from '../types';
import { simulateHeavyRender } from '../utils/simulateHeavyRender';

const ALBUM_IDS = Array.from({ length: 100 }, (_, i) => i + 1);

type PhotoRowProps = {
  photo: Photo;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
};

const PhotoRow = memo(function PhotoRow({
  photo,
  isFavorite,
  onToggleFavorite,
}: PhotoRowProps) {
  simulateHeavyRender();

  return (
    <div className="photo-row">
      <span className="photo-row__id">#{photo.id}</span>
      <span className="photo-row__title">{photo.title}</span>
      <span className="muted">Альбом {photo.albumId}</span>
      <button
        type="button"
        className="button"
        onClick={() => onToggleFavorite(photo.id)}
      >
        {isFavorite ? 'Убрать' : 'В избранное'}
      </button>
    </div>
  );
});

export default function PhotosPage() {
  const {
    data: photos,
    isLoading,
    error,
    refetch,
  } = useFetch<Photo[]>(endpoints.photos);

  const [query, setQuery] = useState('');
  const [albumId, setAlbumId] = useState('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [favorites, setFavorites] = useState<number[]>([]);
  const [secondsOnPage] = useState(0);

  const parentRef = useRef<HTMLDivElement>(null);

  const visiblePhotos = useMemo(() => {
    return (photos ?? [])
      .filter(
        photo =>
          albumId === 'all' || photo.albumId === Number(albumId)
      )
      .filter(photo =>
        photo.title.toLowerCase().includes(query.toLowerCase())
      )
      .sort((a, b) =>
        sortOrder === 'asc'
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title)
      );
  }, [photos, query, albumId, sortOrder]);

  const handleToggleFavorite = useCallback((id: number) => {
    setFavorites(favorites => {
      if (favorites.includes(id)) {
        return favorites.filter(favoriteId => favoriteId !== id);
      }

      return [...favorites, id];
    });
  }, []);

  const virtualizer = useVirtualizer({
    count: visiblePhotos.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 56,
  });

  if (isLoading) return <Loader text="Загружаем медиатеку..." />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;

  return (
    <section>
      <h1>Медиатека</h1>

      <p className="muted">Вы на странице {secondsOnPage} с</p>

      <div className="toolbar">
        <input
          className="input"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Поиск по названию"/>

        <select
          className="input"
          value={albumId}
          onChange={e => setAlbumId(e.target.value)}>
          <option value="all">Все альбомы</option>
          {ALBUM_IDS.map(id => (
            <option key={id} value={id}>
              Альбом {id}
            </option>
          ))}
        </select>

        <select
          className="input"
          value={sortOrder}
          onChange={e =>
            setSortOrder(e.target.value as 'asc' | 'desc')
          }>
          <option value="asc">А–Я</option>
          <option value="desc">Я–А</option>
        </select>
      </div>

      <p>
        Показано: {visiblePhotos.length} из {photos?.length ?? 0}.
        В избранном: {favorites.length}
      </p>

      <div ref={parentRef} className="photo-list">
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            position: 'relative',
          }}>
          {virtualizer.getVirtualItems().map(item => {
            const photo = visiblePhotos[item.index];

            return (
              <div
                key={photo.id}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${item.size}px`,
                  transform: `translateY(${item.start}px)`,
                }}>
                <PhotoRow
                  photo={photo}
                  isFavorite={favorites.includes(photo.id)}
                  onToggleFavorite={handleToggleFavorite}/>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}