export const validateClient = (clientData) => {
  const errors = [];

  if (!clientData.nombre || clientData.nombre.trim().length < 2) {
    errors.push('Nombre debe tener al menos 2 caracteres');
  }

  if (!clientData.email || !isValidEmail(clientData.email)) {
    errors.push('Email no válido');
  }

  if (clientData.telefono && !isValidPhone(clientData.telefono)) {
    errors.push('Teléfono no válido');
  }

  if (!clientData.empresa || clientData.empresa.trim().length < 1) {
    errors.push('Empresa es requerida');
  }

  if (!clientData.industria) {
    errors.push('Industria es requerida');
  }

  if (!clientData.estado) {
    errors.push('Estado es requerido');
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const isValidPhone = (phone) => {
  const regex = /^[\d\s\-\+\(\)]{7,}$/;
  return regex.test(phone);
};
