/**
 * Simple "VeeValidate-like" logic for Handlebars
 */
const initLiveValidation = (formId) => {
  const form = document.querySelector(formId);
  if (!form) return;

  const inputs = form.querySelectorAll('[rules]');

  const validateInput = (input) => {
    const rules = input.getAttribute('rules').split('|');
    const fieldName = input.getAttribute('fieldname') || 'Field ini';
    const value = input.value;
    let errorMessage = '';

    for (const rule of rules) {
      if (rule === 'required' && !value) {
        errorMessage = `${fieldName} wajib diisi`;
        break;
      }
      if (rule === 'email' && value && !/\S+@\S+\.\S+/.test(value)) {
        errorMessage = `${fieldName} tidak valid`;
        break;
      }
      if (rule === 'phone' && value && !/^[0-9]{10,14}$/.test(value)) {
        errorMessage = `${fieldName} tidak valid`;
        break;
      }
      if (rule.startsWith('min:')) {
        const min = rule.split(':')[1];
        if (value.length < min) {
          errorMessage = `${fieldName} minimal ${min} karakter`;
          break;
        }
      }
    }

    displayError(input, errorMessage);
    return !errorMessage;
  };

  const displayError = (input, message) => {
    // Cari atau buat elemen error-message
    let errorDisplay = input.parentElement.querySelector('.error-msg');
    if (!errorDisplay) {
      errorDisplay = document.createElement('p');
      errorDisplay.className = 'error-msg text-red-600 italic text-xs mt-1';
      input.parentElement.appendChild(errorDisplay);
    }

    errorDisplay.innerText = message;
    if (message) {
      input.classList.add('border-red-600');
      input.classList.remove('border-slate-300');
    } else {
      input.classList.remove('border-red-600');
      input.classList.add('border-slate-300');
    }
  };

  // Live validation on input & blur
  inputs.forEach(input => {
    input.addEventListener('input', () => validateInput(input));
    input.addEventListener('blur', () => validateInput(input));
  });

  // Final check on submit
  form.addEventListener('submit', (e) => {
    let isFormValid = true;
    inputs.forEach(input => {
      const isValid = validateInput(input);
      if (!isValid) isFormValid = false;
    });

    if (!isFormValid) e.preventDefault();
  });
};