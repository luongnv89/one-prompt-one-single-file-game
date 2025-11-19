import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const SCROLL_OFFSET = 200;

export default function ScrollContributionCTA() {
  const location = useLocation();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setVisible(false);
    setDismissed(false);
  }, [location.pathname]);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return undefined;

    let frameId;
    const isContributeRoute = location.pathname.startsWith('/contribute');

    const updateVisibility = () => {
      if (dismissed || isContributeRoute) {
        setVisible(false);
        return;
      }

      const scrollY = window.scrollY || window.pageYOffset;
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const docHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
      const nearBottom = scrollY + viewportHeight >= docHeight - SCROLL_OFFSET;

      setVisible(nearBottom);
    };

    const handleScroll = () => {
      if (frameId) window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(updateVisibility);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    updateVisibility();

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [dismissed, location.pathname]);

  if (!visible || dismissed) {
    return null;
  }

  const handleContribute = () => {
    navigate('/contribute');
  };

  return (
    <div className="fixed inset-x-0 bottom-4 z-30 flex justify-center px-4">
      <div className="flex w-full max-w-4xl flex-col gap-4 rounded-3xl border border-gray-100 bg-white/95 px-5 py-4 shadow-2xl backdrop-blur md:flex-row md:items-center md:gap-6">
        <div className="flex flex-1 flex-col gap-1 text-gray-900">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
            Contribute
          </p>
          <p className="text-lg font-semibold">Bring your AI single-file game to the gallery.</p>
          <p className="text-sm text-gray-600">
            Follow the one-file rule, sandbox guardrails, and prompt transparency — share what you
            build.
          </p>
        </div>
        <div className="flex items-center gap-3 self-start md:self-stretch">
          <button
            type="button"
            onClick={handleContribute}
            className="inline-flex min-w-[148px] items-center justify-center gap-2 rounded-full border border-primary-dark/40 bg-white px-5 py-2.5 text-sm font-semibold text-primary-dark shadow-sm transition-transform transition-colors hover:scale-[1.01] hover:border-primary hover:bg-primary hover:text-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 focus:ring-offset-white"
          >
            Share your game
          </button>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="rounded-full border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:border-gray-300 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20"
            aria-label="Hide contribute call-to-action"
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}
