import "./index.css";
import {
  enableValidation,
  resetValidation,
  disableButton,
  config,
} from "../scripts/validation.js";
import Api from "../scripts/api.js";

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "c228edbe-b3ef-46b1-8551-1147d3861871",
    "Content-Type": "application/json",
  },
});

const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");
const profileAvatarEl = document.querySelector(".profile__avatar");

const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileForm = editProfileModal.querySelector(".modal__form");
const editProfileNameInput = editProfileModal.querySelector(
  "#profile-name-input",
);
const editProfileDescriptionInput = editProfileModal.querySelector(
  "#profile-description-input",
);
const editProfileButton = document.querySelector(".profile__edit-button");
const profileSubmitButton = editProfileModal.querySelector(".modal__submit");

const newPostModal = document.querySelector("#new-post-modal");
const newCardForm = newPostModal.querySelector(".modal__form");
const newPostButton = document.querySelector(".profile__add-button");
const imageInput = newPostModal.querySelector("#card-image-input");
const captionInput = newPostModal.querySelector("#caption-input");
const cardSubmitButton = newPostModal.querySelector(".modal__submit");

const avatarModal = document.querySelector("#avatar-modal");
const avatarForm = avatarModal.querySelector("#avatar-form");
const avatarInput = avatarModal.querySelector("#profile-avatar-input");
const avatarButton = document.querySelector(".profile__avatar-button");
const avatarSubmitButton = avatarModal.querySelector(".modal__submit");

const deleteModal = document.querySelector("#delete-modal");
const deleteConfirmButton = deleteModal.querySelector(".modal__delete-button");
const deleteCancelButton = deleteModal.querySelector(".modal__cancel-button");

const previewModal = document.querySelector("#preview-modal");
const previewImageEl = previewModal.querySelector(".modal__image");
const previewCaptionEl = previewModal.querySelector(".modal__caption");

const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");
const cardsList = document.querySelector(".cards__list");

let selectedCard = null;
let selectedCardId = null;

function openModal(modal) {
  modal.classList.add("modal_is-opened");
  document.addEventListener("keydown", handleEscapeKey);
  modal.addEventListener("click", handleOverlayClick);
}

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
  document.removeEventListener("keydown", handleEscapeKey);
  modal.removeEventListener("click", handleOverlayClick);

  if (modal === editProfileModal) {
    resetValidation(
      editProfileForm,
      [editProfileNameInput, editProfileDescriptionInput],
      config,
    );
  }
  if (modal === newPostModal) {
    resetValidation(newCardForm, [imageInput, captionInput], config);
  }
  if (modal === avatarModal) {
    resetValidation(avatarForm, [avatarInput], config);
  }
}

function handleEscapeKey(evt) {
  if (evt.key === "Escape") {
    const opened = document.querySelector(".modal_is-opened");
    if (opened) closeModal(opened);
  }
}

function handleOverlayClick(evt) {
  if (evt.target.classList.contains("modal")) {
    closeModal(evt.target);
  }
}

function renderButtonLoading(isLoading) {
  const text = isLoading ? "Saving..." : "Save";
  profileSubmitButton.textContent = text;
  cardSubmitButton.textContent = text;
  avatarSubmitButton.textContent = text;
}

function renderDeleteLoading(isDeleting) {
  deleteConfirmButton.textContent = isDeleting ? "Deleting..." : "Delete";
}

function getCardElement(data) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardTitleEl = cardElement.querySelector(".card__title");
  const likeButton = cardElement.querySelector(".card__like-button");
  const deleteButton = cardElement.querySelector(".card__delete-button");

  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;
  cardTitleEl.textContent = data.name;

  likeButton.addEventListener("click", () => {
    const isLiked = likeButton.classList.contains("card__like-button_active");

    const request = isLiked ? api.unlikeCard(data._id) : api.likeCard(data._id);

    request
      .then(() => {
        likeButton.classList.toggle("card__like-button_active");
      })
      .catch(console.error);
  });

  deleteButton.addEventListener("click", () => {
    selectedCard = cardElement;
    selectedCardId = data._id;
    openModal(deleteModal);
  });

  cardImageEl.addEventListener("click", () => {
    previewImageEl.src = data.link;
    previewImageEl.alt = data.name;
    previewCaptionEl.textContent = data.name;
    openModal(previewModal);
  });

  return cardElement;
}

function handleEditProfileSubmit(evt) {
  evt.preventDefault();
  renderButtonLoading(true);

  api
    .editUserInfo({
      name: editProfileNameInput.value,
      about: editProfileDescriptionInput.value,
    })
    .then((data) => {
      profileNameEl.textContent = data.name;
      profileDescriptionEl.textContent = data.about;
      closeModal(editProfileModal);
    })
    .catch(console.error)
    .finally(() => renderButtonLoading(false));
}

function handleAddCardSubmit(evt) {
  evt.preventDefault();
  renderButtonLoading(true);

  api
    .addCard({
      name: captionInput.value,
      link: imageInput.value,
    })
    .then((data) => {
      cardsList.prepend(getCardElement(data));
      newCardForm.reset();
      disableButton(cardSubmitButton, config);
      closeModal(newPostModal);
    })
    .catch(console.error)
    .finally(() => renderButtonLoading(false));
}

function handleAvatarSubmit(evt) {
  evt.preventDefault();
  renderButtonLoading(true);

  api
    .editAvatarInfo({ avatar: avatarInput.value })
    .then((data) => {
      profileAvatarEl.src = data.avatar;
      closeModal(avatarModal);
    })
    .catch(console.error)
    .finally(() => renderButtonLoading(false));
}

function handleDeleteSubmit(evt) {
  evt.preventDefault();
  renderDeleteLoading(true);

  api
    .removeCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
    })
    .catch(console.error)
    .finally(() => renderDeleteLoading(false));
}

editProfileButton.addEventListener("click", () => {
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value = profileDescriptionEl.textContent;
  openModal(editProfileModal);
});

newPostButton.addEventListener("click", () => openModal(newPostModal));
avatarButton.addEventListener("click", () => openModal(avatarModal));

editProfileForm.addEventListener("submit", handleEditProfileSubmit);
newCardForm.addEventListener("submit", handleAddCardSubmit);
avatarForm.addEventListener("submit", handleAvatarSubmit);

deleteConfirmButton.addEventListener("click", handleDeleteSubmit);
deleteCancelButton.addEventListener("click", () => closeModal(deleteModal));

api
  .getAppInfo()
  .then(([cards, user]) => {
    profileNameEl.textContent = user.name;
    profileDescriptionEl.textContent = user.about;
    profileAvatarEl.src = user.avatar;

    cards.forEach((card) => {
      cardsList.append(getCardElement(card));
    });
  })
  .catch(console.error);

enableValidation(config);
