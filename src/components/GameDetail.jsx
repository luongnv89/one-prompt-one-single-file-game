import React, { useState } from 'react';
import SandboxIframe from './SandboxIframe';

/**
 * GameDetail - Displays a game with its details and sandboxed iframe
 *
 * @param {Object} props
 * @param {Object} props.game - Game object with metadata
 */
export default function GameDetail({ game }) {
  const [showPrompt, setShowPrompt] = useState(false);
  const [promptContent, setPromptContent] = useState(null);
  const [loadingPrompt, setLoadingPrompt] = useState(false);

  if (!game) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-700">No game selected</p>
      </div>
    );
  }

  const handleViewPrompt = async () => {
    if (showPrompt) {
      setShowPrompt(false);
      return;
    }

    setLoadingPrompt(true);
    try {
      const promptPath = game.path.replace('index.html', 'prompt.md');
      const response = await fetch(promptPath);

      if (!response.ok) {
        throw new Error('Prompt file not found');
      }

      const content = await response.text();
      setPromptContent(content);
      setShowPrompt(true);
    } catch (error) {
      console.error('Error loading prompt:', error);
      setPromptContent('⚠️ Prompt file not available for this game.');
      setShowPrompt(true);
    } finally {
      setLoadingPrompt(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{game.name}</h1>

        <div className="flex flex-wrap gap-2 mb-6">
          <span className="px-3 py-1 bg-primary-lighter text-primary-dark rounded-full text-sm font-medium">
            {game.genre}
          </span>
          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
            {game.difficulty}
          </span>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
            {game.model}
          </span>
          {game.hasPrompt && (
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
              ✓ Prompt Available
            </span>
          )}
        </div>

        <p className="text-gray-700 mb-6 text-lg leading-relaxed">{game.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {game.author && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Author
              </h3>
              <p className="text-gray-900">{game.author.name}</p>
            </div>
          )}

          {game.duration && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Duration
              </h3>
              <p className="text-gray-900">{game.duration}</p>
            </div>
          )}

          {game.controls && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Controls
              </h3>
              <p className="text-gray-900 text-sm">{game.controls.instructions}</p>
            </div>
          )}

          {game.version && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Version
              </h3>
              <p className="text-gray-900">{game.version}</p>
            </div>
          )}
        </div>

        {game.tags && game.tags.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {game.tags.map((tag, index) => (
                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="p-6 border-b border-gray-200">
        <div className="flex gap-3">
          <button
            onClick={handleViewPrompt}
            disabled={loadingPrompt}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {showPrompt ? (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
                Hide Prompt
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                {loadingPrompt ? 'Loading...' : 'View Prompt'}
              </>
            )}
          </button>
        </div>

        {showPrompt && (
          <div className="mt-4 bg-gray-50 rounded-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Prompt Used</h3>
            <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800 bg-white p-4 rounded border overflow-x-auto">
              {promptContent}
            </pre>
          </div>
        )}
      </div>

      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Play Game</h2>
        <SandboxIframe
          src={game.path}
          title={game.name}
          className="w-full"
          onError={(error) => console.error('Game load error:', error)}
        />
      </div>
    </div>
  );
}
