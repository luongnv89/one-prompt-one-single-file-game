import React, { useEffect, useRef, useState } from 'react';

/**
 * SandboxIframe - Securely displays a game in a sandboxed iframe
 *
 * @param {Object} props
 * @param {string} props.src - URL to the game file
 * @param {string} props.title - Title of the game for accessibility
 * @param {string} props.className - Optional CSS classes
 * @param {Function} props.onError - Optional error callback
 */
export default function SandboxIframe({ src, title, className = '', onError }) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenError, setFullscreenError] = useState('');
  const containerRef = useRef(null);
  const iframeRef = useRef(null);

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
    if (onError) {
      onError(`Failed to load game from ${src}`);
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const getFullscreenElement = () => {
    if (typeof document === 'undefined') return null;
    return (
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.msFullscreenElement ||
      null
    );
  };

  const handleFullscreenChange = () => {
    const activeElement = getFullscreenElement();
    const isActive =
      activeElement === iframeRef.current || activeElement === containerRef.current;

    setIsFullscreen(Boolean(isActive));
  };

  useEffect(() => {
    if (typeof document === 'undefined') return undefined;
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  const requestElementFullscreen = async (element) => {
    if (!element) {
      throw new Error('Fullscreen element not available.');
    }
    const request =
      element.requestFullscreen ||
      element.webkitRequestFullscreen ||
      element.msRequestFullscreen;
    if (!request) {
      throw new Error('Fullscreen is not supported in this browser.');
    }
    await request.call(element);
  };

  const exitDocumentFullscreen = async () => {
    if (typeof document === 'undefined') return;
    const exit =
      document.exitFullscreen || document.webkitExitFullscreen || document.msExitFullscreen;
    if (!exit) {
      throw new Error('Unable to exit fullscreen in this browser.');
    }
    await exit.call(document);
  };

  const toggleFullscreen = async () => {
    setFullscreenError('');
    try {
      if (isFullscreen) {
        await exitDocumentFullscreen();
        return;
      }
      const target = iframeRef.current || containerRef.current;
      await requestElementFullscreen(target);
    } catch (error) {
      setFullscreenError(
        error instanceof Error ? error.message : 'Unable to toggle fullscreen mode.'
      );
      console.error('Fullscreen toggle failed:', error);
    }
  };

  if (!src) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
        <p className="text-red-600">Game source not provided</p>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
        <h3 className="text-lg font-semibold text-red-800 mb-2">Unable to Load Game</h3>
        <p className="text-red-600 mb-4">
          The game file could not be loaded. This might be due to:
        </p>
        <ul className="text-left text-red-600 mb-4 list-disc list-inside">
          <li>File not found or moved</li>
          <li>Network connectivity issues</li>
          <li>Browser security restrictions</li>
        </ul>
        <p className="text-sm text-red-500">Source: {src}</p>
      </div>
    );
  }

  const fullscreenLabel = isFullscreen ? 'Exit full screen' : 'Full screen';

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <div className="absolute right-3 top-3 z-20 flex gap-2">
        <button
          type="button"
          onClick={toggleFullscreen}
          className="rounded-full bg-gray-900/80 px-3 py-1.5 text-sm font-medium text-white shadow-sm backdrop-blur hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-white"
          aria-pressed={isFullscreen}
          aria-label={fullscreenLabel}
        >
          {fullscreenLabel}
        </button>
      </div>

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading game...</p>
          </div>
        </div>
      )}

      <iframe
        ref={iframeRef}
        src={src}
        title={title || 'Game'}
        sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-forms"
        className="w-full h-full border-0 rounded-lg bg-white"
        onError={handleError}
        onLoad={handleLoad}
        allow="fullscreen; pointer-lock"
        allowFullScreen
        style={{ minHeight: '800px' }}
        data-version="v1.3"
      />

      <div className="mt-2 text-xs text-gray-500 flex items-center gap-2">
        <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
        <span>Game runs in a secure sandbox</span>
        {fullscreenError && <span className="text-red-500">{fullscreenError}</span>}
      </div>
    </div>
  );
}
