import { useEffect, useRef, useState } from 'react';

function formatTime(s) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

export default function AudioPlayer({ src, title, artist }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onMeta = () => setDuration(a.duration);
    const onTime = () => setCurrent(a.currentTime);
    const onEnd = () => setPlaying(false);
    a.addEventListener('loadedmetadata', onMeta);
    a.addEventListener('timeupdate', onTime);
    a.addEventListener('ended', onEnd);
    return () => {
      a.removeEventListener('loadedmetadata', onMeta);
      a.removeEventListener('timeupdate', onTime);
      a.removeEventListener('ended', onEnd);
    };
  }, []);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) a.pause();
    else a.play();
    setPlaying(!playing);
  };

  const seek = (e) => {
    const a = audioRef.current;
    if (!a || !duration) return;
    const pct = (e.clientX - e.currentTarget.getBoundingClientRect().left) / e.currentTarget.offsetWidth;
    a.currentTime = pct * duration;
  };

  const progress = duration ? (current / duration) * 100 : 0;

  return (
    <div className="my-8 rounded-2xl border border-gray-200 bg-white p-5">
      <audio ref={audioRef} src={src} preload="metadata" />
      <div className="flex items-center gap-4">
        <button
          onClick={toggle}
          className="flex-shrink-0 w-11 h-11 rounded-full bg-ink flex items-center justify-center hover:opacity-85 transition-opacity"
          aria-label={playing ? 'Pause' : 'Play'}
        >
          {playing ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <polygon points="5,3 19,12 5,21" />
            </svg>
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="font-medium text-sm truncate text-ink">
              {title || 'Audio'}
            </span>
            <span className="text-xs text-soft-ink flex-shrink-0">
              {formatTime(current)} / {formatTime(duration)}
            </span>
          </div>
          {artist && (
            <p className="text-xs text-soft-ink mt-0.5">{artist}</p>
          )}
          <div
            className="mt-3 h-1.5 bg-gray-100 rounded-full cursor-pointer group"
            onClick={seek}
          >
            <div
              className="h-full bg-ink rounded-full transition-[width] duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
