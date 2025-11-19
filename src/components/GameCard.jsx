import React from 'react';

/**
 * GameCard - Displays a game in a card format
 *
 * @param {Object} props
 * @param {Object} props.game - Game object from manifest
 * @param {Function} props.onClick - Click handler
 */
export default function GameCard({ game, onClick }) {
  return (
    <div
      onClick={() => onClick && onClick(game)}
      className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border border-gray-200 hover:border-primary-light hover:-translate-y-1"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-1">
            {game.name}
          </h3>
          {game.hasPrompt && (
            <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Prompt
            </span>
          )}
        </div>

        <p className="text-gray-700 text-sm mb-4 line-clamp-2 leading-relaxed">
          {game.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-3 py-1 bg-primary-lighter text-primary-dark rounded-full text-xs font-medium">
            {game.genre}
          </span>
          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
            {game.difficulty}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm mb-3">
          <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
            {game.model}
          </span>
          <span className="text-gray-500 text-xs">{game.author.name}</span>
        </div>

        {game.tags && game.tags.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex flex-wrap gap-1.5">
              {game.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-0.5 bg-gray-50 text-gray-600 rounded text-xs hover:bg-primary-lighter hover:text-primary-dark transition-colors"
                >
                  #{tag}
                </span>
              ))}
              {game.tags.length > 3 && (
                <span className="px-2 py-0.5 bg-gray-50 text-gray-600 rounded text-xs">
                  +{game.tags.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="flex items-center text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            <span>Play Game</span>
            <svg
              className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
