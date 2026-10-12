export function Arrow({ diagonal = false, direction = "right" }: { diagonal?: boolean; direction?: "left" | "right" }) {
  const transform = diagonal || direction === "right" ? undefined : "rotate(180 12 12)";
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path transform={transform} d={diagonal ? "M6 18 18 6M6 6h12v12" : "M4 12h15m-6-6 6 6-6 6"} /></svg>;
}
