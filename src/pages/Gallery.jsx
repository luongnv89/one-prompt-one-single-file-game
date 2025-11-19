import React, { useState, useEffect, useMemo } from 'react';
import GameCard from '../components/GameCard';
import GameDetail from '../components/GameDetail';
import Footer from '../components/Footer';

/**
 * Gallery - Main gallery page displaying all games
 */
export default function Gallery() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState(null);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadGames();
  }, []);

  const loadGames = async () => {
    try {
      setLoading(true);
      const response = await fetch('/games-manifest.json');

      if (!response.ok) {
        throw new Error(`Failed to load games: ${response.status}`);
      }

      const manifest = await response.json();
      setGames(manifest.games || []);
      setError(null);
    } catch (err) {
      console.error('Error loading games:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGameClick = (game) => {
    setSelectedGame(game);
  };

  const handleBackToGallery = () => {
    setSelectedGame(null);
  };

  // Filter games based on search query
  const filteredGames = useMemo(() => {
    if (!searchQuery.trim()) {
      return games;
    }

    const query = searchQuery.toLowerCase();
    return games.filter((game) => {
      return (
        game.name.toLowerCase().includes(query) ||
        game.description.toLowerCase().includes(query) ||
        game.model.toLowerCase().includes(query) ||
        game.genre.toLowerCase().includes(query) ||
        (game.tags && game.tags.some((tag) => tag.toLowerCase().includes(query)))
      );
    });
  }, [games, searchQuery]);

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  if (selectedGame) {
    return (
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={handleBackToGallery}
          className="mb-6 px-4 py-2 text-primary hover:text-primary-dark font-medium flex items-center gap-2 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Gallery
        </button>
        <GameDetail game={selectedGame} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">AI One-File Arcade</h1>
          <p className="text-gray-700 text-lg">Explore AI-generated single-file games</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading games...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Games</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={loadGames}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && games.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <p className="text-gray-700 text-lg">No games available yet.</p>
          </div>
        )}

        {!loading && !error && games.length > 0 && (
          <>
            <div className="mb-8">
              <div className="relative max-w-2xl mx-auto">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
                    placeholder="Search games by name, description, model, or tags..."
                    aria-label="Search games"
                  />
                  {searchQuery && (
                    <button
                      onClick={handleClearSearch}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      aria-label="Clear search"
                    >
                      <svg
                        className="h-5 w-5 text-gray-400 hover:text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <p className="text-gray-700">
                  {searchQuery ? (
                    <>
                      Found <span className="font-semibold">{filteredGames.length}</span> of{' '}
                      <span className="font-semibold">{games.length}</span> game
                      {games.length !== 1 ? 's' : ''}
                      {searchQuery && (
                        <span className="ml-1">
                          matching "<span className="font-medium">{searchQuery}</span>"
                        </span>
                      )}
                    </>
                  ) : (
                    <>
                      Showing <span className="font-semibold">{games.length}</span> game
                      {games.length !== 1 ? 's' : ''}
                    </>
                  )}
                </p>
              </div>
            </div>

            {filteredGames.length === 0 && searchQuery && (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <p className="text-gray-700 text-lg mb-2">No games found</p>
                <p className="text-gray-500">Try adjusting your search terms</p>
              </div>
            )}

            {filteredGames.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGames.map((game) => (
                  <GameCard key={game.slug} game={game} onClick={handleGameClick} />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
