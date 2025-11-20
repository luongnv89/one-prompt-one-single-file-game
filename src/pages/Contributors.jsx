import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function extractGithubUsername(author) {
  if (!author?.url) return '';
  const match = author.url.match(/github\.com\/([^/]+)(?:\/|$)/i);
  return match ? match[1] : '';
}

function buildContributors(games) {
  const map = new Map();

  games.forEach((game) => {
    const author = game.author || {};
    const username = extractGithubUsername(author);
    const id = (username || author.url || author.name || '').trim();
    if (!id) return;

    const key = id.toLowerCase();
    if (!map.has(key)) {
      map.set(key, {
        key,
        displayName: author.name || username || 'Unknown contributor',
        username: username || '',
        url: author.url || (username ? `https://github.com/${username}` : ''),
        gameCount: 0,
      });
    }
    const entry = map.get(key);
    entry.gameCount += 1;
  });

  return Array.from(map.values()).sort((a, b) => b.gameCount - a.gameCount || a.key.localeCompare(b.key));
}

export default function Contributors() {
  const navigate = useNavigate();
  const [contributors, setContributors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch('/games-manifest.json');
        if (!response.ok) throw new Error(`Failed to load games: ${response.status}`);
        const manifest = await response.json();
        setContributors(buildContributors(manifest.games || []));
        setError(null);
      } catch (err) {
        console.error('Error loading contributors:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const totals = useMemo(() => {
    const games = contributors.reduce((sum, c) => sum + c.gameCount, 0);
    return { contributors: contributors.length, games };
  }, [contributors]);

  const handleSelect = (contributorKey) => {
    navigate(`/?contributor=${encodeURIComponent(contributorKey)}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-gray-600">Loading contributors...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Contributors</h1>
          <p className="text-gray-600 mb-6">We hit a snag loading the contributor list.</p>
          <p className="text-red-600 mb-8">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-full bg-primary px-6 py-3 text-white font-semibold hover:bg-primary-dark transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-12">
        <div className="mb-10 flex flex-col gap-6 rounded-3xl border border-gray-200 bg-white px-6 py-8 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-gray-500">
                Community
              </p>
              <h1 className="text-3xl font-bold text-gray-900">Arcade contributors</h1>
              <p className="text-gray-600 mt-2 max-w-2xl">
                Each card shows a contributor’s GitHub profile, their link, and how many AI single-file games they’ve added.
              </p>
            </div>
            <div className="flex gap-4">
              <div className="rounded-2xl border border-primary/30 bg-primary-lighter px-4 py-3 text-center">
                <p className="text-xs uppercase tracking-wide text-primary-dark">Contributors</p>
                <p className="text-2xl font-bold text-gray-900">{totals.contributors}</p>
              </div>
              <div className="rounded-2xl border border-primary/30 bg-primary-lighter px-4 py-3 text-center">
                <p className="text-xs uppercase tracking-wide text-primary-dark">Games</p>
                <p className="text-2xl font-bold text-gray-900">{totals.games}</p>
              </div>
            </div>
          </div>
        </div>

        {contributors.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-10 text-center shadow-sm">
            <p className="text-gray-700 text-lg font-semibold">No contributors yet</p>
            <p className="text-gray-500 mt-2">
              Be the first to add an AI single-file game and you’ll appear here automatically.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {contributors.map((contributor) => {
              const avatarSrc = contributor.username
                ? `https://github.com/${contributor.username}.png?size=160`
                : '/logo-mark.svg';
              return (
                <article
                  key={contributor.key}
                  className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 overflow-hidden rounded-full border border-gray-200 bg-gray-100">
                      <img
                        src={avatarSrc}
                        alt={`${contributor.displayName} avatar`}
                        className="h-full w-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <div className="space-y-1">
                      <p className="text-base font-semibold text-gray-900">{contributor.displayName}</p>
                      {contributor.username && (
                        <p className="text-sm text-gray-600">@{contributor.username}</p>
                      )}
                      {contributor.url && (
                        <a
                          href={contributor.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary-dark"
                        >
                          GitHub profile
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 7l-10 10m11-6v5a2 2 0 01-2 2h-5"
                            />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      <span className="font-semibold text-gray-900">{contributor.gameCount}</span> game
                      {contributor.gameCount !== 1 ? 's' : ''} contributed
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSelect(contributor.key)}
                      className="rounded-full border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:border-primary hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                    >
                      View games
                    </button>
                  </div>
                  <div className="pointer-events-none absolute inset-0 rounded-2xl border border-transparent transition-colors group-hover:border-primary/40" />
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
