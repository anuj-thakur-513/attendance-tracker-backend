export const calculateLecturesNeeded = (
  currentLectures: number,
  currentAttended: number,
  targetPercentage: number
): number => {
  const targetRatio = targetPercentage / 100;
  const lecturesNeeded =
    (targetRatio * currentLectures - currentAttended) / (1 - targetRatio);
  return Math.max(Math.ceil(lecturesNeeded), 0);
};

export const calculateLecturesCanSkip = (
  currentLectures: number,
  currentAttended: number,
  requiredPercentage: number
): number => {
  const requiredRatio = requiredPercentage / 100;
  const maxLectures = currentAttended / requiredRatio;
  const lecturesCanSkip = Math.floor(maxLectures - currentLectures);
  return lecturesCanSkip >= 0 ? lecturesCanSkip : 0;
};
