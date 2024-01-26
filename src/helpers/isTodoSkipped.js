export function isTodoSkipped(date) {
  const day = 84000000;
  const today = new Date();
  const deadline = new Date(date);

  return deadline.getTime() + day < today.getTime();
}