/** Concentric circular CSS corners measured from the same box edge, in CSS px. */
export function nestedRadius(outer: number, inset: number): number {
  if (
    !Number.isFinite(outer) ||
    !Number.isFinite(inset) ||
    outer < 0 ||
    inset < 0
  )
    throw new RangeError("Radius and inset must be finite nonnegative values.");
  return Math.max(0, outer - inset);
}
