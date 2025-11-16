import { useEffect, useRef, useCallback } from 'react';

interface BehaviorTrackingOptions {
  page: string;
  propertyId?: string;
  userId?: string;
}

function getSessionId(): string {
  let sessionId = localStorage.getItem('behavior_session_id');
  if (!sessionId) {
    sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('behavior_session_id', sessionId);
  }
  return sessionId;
}

export function useBehaviorTracking({ page, propertyId, userId }: BehaviorTrackingOptions) {
  const startTimeRef = useRef<number>(Date.now());
  const scrollDepthRef = useRef<number>(0);
  const clicksRef = useRef<Array<{ element: string; timestamp: string }>>([]);
  const interactionsRef = useRef<Array<{ type: string; data: any; timestamp: string }>>([]);
  const hasTrackedRef = useRef<boolean>(false);
  const handleScrollRef = useRef<() => void>();
  const handleClickRef = useRef<(event: MouseEvent) => void>();

  if (!handleScrollRef.current) {
    handleScrollRef.current = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const scrollPercentage = ((scrollTop + windowHeight) / documentHeight) * 100;
      
      if (scrollPercentage > scrollDepthRef.current) {
        scrollDepthRef.current = Math.min(Math.round(scrollPercentage), 100);
      }
    };
  }

  if (!handleClickRef.current) {
    handleClickRef.current = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const element = target.tagName + (target.id ? `#${target.id}` : '') + (target.className ? `.${target.className.split(' ')[0]}` : '');
      
      clicksRef.current.push({
        element,
        timestamp: new Date().toISOString(),
      });
    };
  }

  useEffect(() => {
    startTimeRef.current = Date.now();
    hasTrackedRef.current = false;

    const scrollHandler = handleScrollRef.current!;
    const clickHandler = handleClickRef.current!;

    window.addEventListener('scroll', scrollHandler);
    document.addEventListener('click', clickHandler);

    return () => {
      window.removeEventListener('scroll', scrollHandler);
      document.removeEventListener('click', clickHandler);

      if (hasTrackedRef.current) return;
      hasTrackedRef.current = true;

      const timeOnPage = Math.round((Date.now() - startTimeRef.current) / 1000);

      if (timeOnPage > 2) {
        fetch('/api/behavior', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            sessionId: !userId ? getSessionId() : undefined,
            page,
            scrollDepth: scrollDepthRef.current,
            timeOnPage,
            clicks: clicksRef.current,
            interactions: interactionsRef.current,
            propertyId,
          }),
        }).catch(err => console.error('Failed to track behavior:', err));
      }
    };
  }, [page, propertyId, userId]);

  return {
    trackInteraction: useCallback((type: string, data: any) => {
      interactionsRef.current.push({
        type,
        data,
        timestamp: new Date().toISOString(),
      });
    }, []),
  };
}
