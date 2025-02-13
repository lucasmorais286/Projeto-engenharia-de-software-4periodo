export const fullYear = new Date().getFullYear();

export const formatToInstagramDate = (toFormatDate: Date) => {
  const date = new Date(toFormatDate);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  if (days < 7) return `${days}d`;
  if (weeks < 4) return `${weeks}sem`;
  if (months < 12) return `${months}m`;
  return `${years}a`;
}
