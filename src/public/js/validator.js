 

// 1. PINDAHKAN KE LUAR AGAR MENJADI GLOBAL
const displayError = (input, message) => {
  const isTomSelect = input.classList.contains('tomselected')
  const tomWrapper = input.nextElementSibling
  
  // Ambil elemen visual (kotak yang dilihat user)
  const visualTarget = (isTomSelect && tomWrapper?.classList.contains('ts-wrapper')) 
    ? tomWrapper.querySelector('.ts-control') 
    : input

  let errorDisplay = visualTarget.parentElement.querySelector('.error-msg')
  if (!errorDisplay) {
    errorDisplay = document.createElement('p')
    errorDisplay.className = 'error-msg text-red-600 italic text-[10px] mt-1 ml-1'
    visualTarget.parentElement.appendChild(errorDisplay)
  }

  errorDisplay.innerText = message

  if (message) {
    visualTarget.style.borderColor = '#dc2626'
    visualTarget.classList.add('border-red-600')
  } else {
    visualTarget.style.borderColor = ''
    visualTarget.classList.remove('border-red-600')
  }
}

const validateInput = (input) => {
  if (!input) return true 

  // Gunakan optional chaining (?.) untuk keamanan tambahan
  const rules = input.getAttribute('rules')?.split('|') || []
  const fieldName = input.getAttribute('fieldname') || 'Field ini'
  const value = input.value || ''
  let errorMessage = ''

  for (const rule of rules) {
    if (rule === 'required' && !value) {
      errorMessage = `${fieldName} wajib diisi`
      break
    }
    if (rule === 'email' && value && !/\S+@\S+\.\S+/.test(value)) {
      errorMessage = `${fieldName} tidak valid`
      break
    }
    if (rule === 'phone' && value && !/^[0-9]{10,14}$/.test(value)) {
      errorMessage = `${fieldName} tidak valid`
      break
    }
    if (rule.startsWith('min:')) {
      const min = rule.split(':')[1]
      if (value.length < min) {
        errorMessage = `${fieldName} minimal ${min} karakter`
        break
      }
    }
  }

  displayError(input, errorMessage)
  return !errorMessage
}

// Fungsi Utama
const initLiveValidation = (formId) => {
  const form = document.querySelector(formId)
  if (!form) return

  const inputs = form.querySelectorAll('[rules]')

  inputs.forEach(input => {
    input.addEventListener('input', () => validateInput(input))
    input.addEventListener('blur', () => validateInput(input))
  })

  form.addEventListener('submit', (e) => {
    let isFormValid = true
    inputs.forEach(input => {
      const isValid = validateInput(input)
      if (!isValid) isFormValid = false
    })

    if (!isFormValid) e.preventDefault()
  })
}

// Daftarkan ke window agar aman dipanggil dari file HBS manapun
window.displayError = displayError
window.validateInput = validateInput
window.initLiveValidation = initLiveValidation