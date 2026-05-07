"use client";

import {
  createElement,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
} from "react";

type Props = {
  children: ReactNode;
  /** delay in ms */
  delay?: number;
  /** y-axis translation in px when hidden */
  y?: number;
  /** duration in ms */
  duration?: number;
  /** play once (default) or every time it enters */
  once?: boolean;
  /** intersection threshold */
  threshold?: number;
  /** root margin */
  rootMargin?: string;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
  style?: CSSProperties;
};

export default function Reveal({
  children,
  delay = 0,
  y = 24,
  duration = 700,
  once = true,
  threshold = 0.15,
  rootMargin = "0px 0px -10% 0px",
  className = "",
  as = "div",
  style,
}: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            setShown(false);
          }
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once, threshold, rootMargin]);

  return createElement(
    as,
    {
      ref: ref as Ref<HTMLElement>,
      className,
      style: {
        ...style,
        opacity: shown ? 1 : 0,
        transform: shown ? "translate3d(0,0,0)" : `translate3d(0, ${y}px, 0)`,
        transition: `opacity ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
        willChange: "opacity, transform",
      },
    } as HTMLAttributes<HTMLElement> & { ref: Ref<HTMLElement> },
    children
  );
}
