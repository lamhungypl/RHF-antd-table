export const validateRow = (inputValue, record, index) => {
  const quantityInput = parseInt(inputValue, 10);

  const validObject = {
    quantity: quantityInput,
    error: { type: 'default', message: '' },
  };
  if (quantityInput < 10) {
    return validObject;
  }
  if (quantityInput <= 20) {
    return {
      ...validObject,
      error: { type: 'warning', message: 'Too much' },
    };
  } else {
    return {
      ...validObject,
      quantity: 20,
      error: { type: 'error', message: 'Not Enough' },
    };
  }
};
