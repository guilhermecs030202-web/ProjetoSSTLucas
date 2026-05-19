
export const calculateStatus = (dateStr) => {
  if (!dateStr) return 'Válido';
  
  let date;
  if (dateStr.includes('/')) {
    const [d, m, y] = dateStr.split('/');
    date = new Date(y, m - 1, d);
  } else {
    date = new Date(dateStr);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const diffTime = date - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 'Vencido';
  if (diffDays <= 30) return 'Vencendo';
  return 'Válido';
};