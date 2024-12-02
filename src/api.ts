
import { FormResponse } from './types';

export const getFormData = (formType: string): Promise<FormResponse> => {
  if (formType === 'User Information') {
    return Promise.resolve({
      fields: [
        { name: 'firstName', type: 'text', label: 'First Name', required: true },
        { name: 'lastName', type: 'text', label: 'Last Name', required: true },
        { name: 'age', type: 'number', label: 'Age', required: false },
      ],
    });
  }

  if (formType === 'Address Information') {
    return Promise.resolve({
      fields: [
        { name: 'street', type: 'text', label: 'Street', required: true },
        { name: 'city', type: 'text', label: 'City', required: true },
        { name: 'state', type: 'dropdown', label: 'State', required: true, options: ['--Select State--','California', 'Texas', 'New York'] },
        { name: 'zipCode', type: 'text', label: 'Zip Code', required: false },
      ],
    });
  }

  if (formType === 'Payment Information') {
    return Promise.resolve({
      fields: [
        { name: 'cardNumber', type: 'text', label: 'Card Number', required: true },
        { name: 'expiryDate', type: 'date', label: 'Expiry Date', required: true },
        { name: 'cvv', type: 'password', label: 'CVV', required: true },
        { name: 'cardholderName', type: 'text', label: 'Cardholder Name', required: true },
      ],
    });
  }

  return Promise.reject('Form type not found');
};
