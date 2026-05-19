
export const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  if (dateStr.includes('-')) return dateStr.split('-').reverse().join('/');
  return dateStr;
};