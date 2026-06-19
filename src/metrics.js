// metrics utilities
export function calculateWpm(correctChars, elapsedSeconds) {
  const minutes = Math.max(elapsedSeconds / 60, 1/60); // avoid divide-by-zero
  return Math.round((correctChars / 5) / minutes);
}

export function calculateAccuracy(correctChars, totalTyped) {
  if (totalTyped === 0) return 100;
  return Math.round((correctChars / totalTyped) * 100);
}
