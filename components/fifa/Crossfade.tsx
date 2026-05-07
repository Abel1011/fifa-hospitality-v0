"use client";

import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";

type Props = {
  /** unique key for the current content; when it changes, content crossfades */
  contentKey: string | number;
  children: ReactNode;
  /** transition duration in ms */
  duration?: number;
  /** vertical offset on enter (px) */
  y?: number;
  className?: string;
  style?: CSSProperties;
};

/**
 * Crossfade swap: keeps the previous children mounted briefly while
 * the new ones fade in on top, then unmounts the old.
 */
export default function Crossfade({
  contentKey,
  children,
  duration = 450,
  y = 8,
  className = "",
  style,
}: Props) {
  const [current, setCurrent] = useState({ key: contentKey, node: children });
  const [prev, setPrev] = useState<{ key: string | number; node: ReactNode } | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (contentKey === current.key) {
      // keep latest node reference so re-renders propagate
      setCurrent({ key: contentKey, node: children });
      return;
    }
    setPrev(current);
    setCurrent({ key: contentKey, node: children });
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setPrev(null), duration);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentKey, children]);

  return (
    <div className={`relative ${className}`} style={style}>
      {prev && (
        <div
          key={`prev-${prev.key}`}
          aria-hidden
          className="absolute inset-0"
          style={{
            animation: `cfOut ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) forwards`,
            willChange: "opacity, transform",
          }}
        >
          {prev.node}
        </div>
      )}
      <div
        key={`cur-${current.key}`}
        style={{
          animation: `cfIn ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) both`,
          ["--cf-y" as string]: `${y}px`,
          willChange: "opacity, transform",
        }}
      >
        {current.node}
      </div>
      <style jsx>{`
        @keyframes cfIn {
          from {
            opacity: 0;
            transform: translate3d(0, var(--cf-y), 0);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }
        @keyframes cfOut {
          from {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
          to {
            opacity: 0;
            transform: translate3d(0, calc(var(--cf-y, 8px) * -0.5), 0);
          }
        }
      `}</style>
    </div>
  );
}
