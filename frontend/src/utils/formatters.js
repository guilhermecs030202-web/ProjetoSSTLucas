export const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  if (dateStr.includes('-')) return dateStr.split('-').reverse().join('/');
  return dateStr;
};

export const maskCNPJ = (event) => {
  let v = event.target.value.replace(/\D/g, "");
  if (v.length > 14) v = v.substring(0, 14);
  
  if (v.length > 12) {
    v = v.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{1,2}).*/, "$1.$2.$3/$4-$5");
  } else if (v.length > 8) {
    v = v.replace(/^(\d{2})(\d{3})(\d{3})(\d{1,4}).*/, "$1.$2.$3/$4");
  } else if (v.length > 5) {
    v = v.replace(/^(\d{2})(\d{3})(\d{1,3}).*/, "$1.$2.$3");
  } else if (v.length > 2) {
    v = v.replace(/^(\d{2})(\d{1,3}).*/, "$1.$2");
  }
  
  event.target.value = v;
};