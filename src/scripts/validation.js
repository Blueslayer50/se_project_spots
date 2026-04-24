export const settings = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__submit-btn",
  inactiveButtonClass: "modal__submit-btn_inactive",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error",
};

export const showInputError = (formEl, inputEl, errorMsg, config) => {
  const errorEl = formEl.querySelector(`#${inputEl.id}-error`);
  if (!errorEl) return;

  errorEl.textContent = errorMsg;
  errorEl.classList.add(config.errorClass);
  inputEl.classList.add(config.inputErrorClass);
};

export const hideInputError = (formEl, inputEl, config) => {
  const errorEl = formEl.querySelector(`#${inputEl.id}-error`);
  if (!errorEl) return;

  errorEl.textContent = "";
  errorEl.classList.remove(config.errorClass);
  inputEl.classList.remove(config.inputErrorClass);
};

export const checkInputValidity = (formEl, inputEl, config) => {
  if (!inputEl.validity.valid) {
    showInputError(formEl, inputEl, inputEl.validationMessage, config);
  } else {
    hideInputError(formEl, inputEl, config);
  }
};

export const hasInvalidInput = (inputList) => {
  return inputList.some((input) => !input.validity.valid);
};

export const disableButton = (buttonEl, config) => {
  buttonEl.disabled = true;
  buttonEl.classList.add(config.inactiveButtonClass);
};

export const toggleButtonState = (inputList, buttonEl, config) => {
  if (hasInvalidInput(inputList)) {
    disableButton(buttonEl, config);
  } else {
    buttonEl.disabled = false;
    buttonEl.classList.remove(config.inactiveButtonClass);
  }
};

export const resetValidation = (formEl, inputList, config) => {
  inputList.forEach((input) => hideInputError(formEl, input, config));

  const buttonEl = formEl.querySelector(config.submitButtonSelector);
  disableButton(buttonEl, config); // Always disable on modal open
};

export const setEventListeners = (formEl, config) => {
  const inputList = Array.from(formEl.querySelectorAll(config.inputSelector));
  const buttonEl = formEl.querySelector(config.submitButtonSelector);

  toggleButtonState(inputList, buttonEl, config);

  inputList.forEach((inputEl) => {
    inputEl.addEventListener("input", () => {
      checkInputValidity(formEl, inputEl, config);
      toggleButtonState(inputList, buttonEl, config);
    });
  });
};

export const enableValidation = (config) => {
  const formList = Array.from(document.querySelectorAll(config.formSelector));
  formList.forEach((formEl) => setEventListeners(formEl, config));
};
