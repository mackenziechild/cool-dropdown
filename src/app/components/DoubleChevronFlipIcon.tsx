import { useEffect, useRef } from "react";
import { animate, cubicBezier } from "motion";

type Props = {
  open: boolean;              // false = pointing out; true = pointing in
  size?: number;              // rendered px size
  stroke?: string;
  strokeWidth?: number;
  durationMs?: number;
};

export function DoubleChevronFlipIcon({
  open,
  size = 16,
  stroke = "var(--color-accent)",
  strokeWidth = 1.5,
  durationMs = 400,
}: Props) {
  const topRef = useRef<SVGPolylineElement | null>(null);
  const bottomRef = useRef<SVGPolylineElement | null>(null);
  const pRef = useRef(0);

  const X = { L: 2.5, C: 6, R: 9.5 };

  // CLOSED = pointing out (top = ^, bottom = v)
  const CLOSED = {
    top:    { L: 3.5,  C: 0.75, R: 3.5 },
    bottom: { L: 8.5,  C: 11.25, R: 8.5 },
  };

  // OPEN = pointing in (top = v, bottom = ^)
  const OPEN = {
    top:    { L: 1.25, C: 4.0,  R: 1.25 },
    bottom: { L: 10.75, C: 8.0, R: 10.75 },
  };

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  const setPoints = (t: number) => {
    const make = (which: "top" | "bottom") => {
      const s = CLOSED[which];
      const e = OPEN[which];
      const Ly = lerp(s.L, e.L, t);
      const Cy = lerp(s.C, e.C, t);
      const Ry = lerp(s.R, e.R, t);
      return `${X.L},${Ly} ${X.C},${Cy} ${X.R},${Ry}`;
    };
    topRef.current?.setAttribute("points", make("top"));
    bottomRef.current?.setAttribute("points", make("bottom"));
  };

  // initial paint
  useEffect(() => { pRef.current = open ? 1 : 0; setPoints(pRef.current); /* eslint-disable-line */ }, []);

  // animate on toggle
  useEffect(() => {
    const from = pRef.current;
    const to = open ? 1 : 0;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (reduced || from === to) {
      pRef.current = to;
      setPoints(to);
      return;
    }

    const state = { p: from };
    const controls = animate(
      state,
      { p: to },
      {
        duration: durationMs / 1000,
        ease: cubicBezier(0.25, 0, 0.06, 1),
        onUpdate: (latest: number | { p: number }) => {
          const p = typeof latest === "number" ? latest : latest.p;
          pRef.current = p;
          setPoints(p);
        },
      }
    );
    return () => controls.cancel();
  }, [open, durationMs]);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
      className="block"
      style={{ shapeRendering: "geometricPrecision" }}
    >
      <polyline
        ref={topRef}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        points={`${X.L},${CLOSED.top.L} ${X.C},${CLOSED.top.C} ${X.R},${CLOSED.top.R}`}
      />
      <polyline
        ref={bottomRef}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        points={`${X.L},${CLOSED.bottom.L} ${X.C},${CLOSED.bottom.C} ${X.R},${CLOSED.bottom.R}`}
      />
    </svg>
  );
}