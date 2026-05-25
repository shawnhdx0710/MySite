import { useState } from 'react';

export default function VideoPlayer({ src, poster, caption }) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className="my-8 rounded-2xl border border-gray-200 bg-gray-50 p-8 text-center">
        <p className="text-sm text-soft-ink">Video failed to load.</p>
        {src && (
          <a href={src} class="text-xs text-accent underline mt-1 inline-block">
            Download instead
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="my-8 rounded-2xl overflow-hidden border border-gray-200 bg-black">
      <video
        src={src}
        poster={poster}
        preload="metadata"
        className="w-full block"
        playsInline
        controls
        onError={() => setError(true)}
      >
        Your browser does not support the video tag.
      </video>

      {caption && (
        <p className="px-4 py-3 text-sm text-gray-400 text-center">{caption}</p>
      )}
    </div>
  );
}
