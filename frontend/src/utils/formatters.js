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

export const maskCPF = (event) => {
  let v = event.target.value.replace(/\D/g, "");
  if (v.length > 11) v = v.substring(0, 11);
  
  if (v.length > 9) {
    v = v.replace(/^(\d{3})(\d{3})(\d{3})(\d{1,2}).*/, "$1.$2.$3-$4");
  } else if (v.length > 6) {
    v = v.replace(/^(\d{3})(\d{3})(\d{1,3}).*/, "$1.$2.$3");
  } else if (v.length > 3) {
    v = v.replace(/^(\d{3})(\d{1,3}).*/, "$1.$2");
  }
  
  event.target.value = v;
};

export const validateCPF = (cpf) => {
  cpf = cpf.replace(/[^\d]+/g, '');
  if (cpf === '' || cpf.length !== 11) return false;
  
  // Reject known invalid CPFs
  if (/^(\d)\1{10}$/.test(cpf)) return false;
  
  let add = 0;
  for (let i = 0; i < 9; i++) add += parseInt(cpf.charAt(i)) * (10 - i);
  let rev = 11 - (add % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== parseInt(cpf.charAt(9))) return false;
  
  add = 0;
  for (let i = 0; i < 10; i++) add += parseInt(cpf.charAt(i)) * (11 - i);
  rev = 11 - (add % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== parseInt(cpf.charAt(10))) return false;
  
  return true;
};