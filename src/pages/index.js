import "./index.css";
import {
  enableValidation,
  resetValidation,
  config,
} from "../scripts/validation.js";
import Api from "../scripts/api.js";

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "7a9a1e2c-bb81-4ce6-b2b2-351a9d05e2af",
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

const newPostModal = document.querySelector("#new-post-modal");
const newCardForm = newPostModal.querySelector(".modal__form");
const newPostButton = document.querySelector(".profile__add-button");
const imageInput = newPostModal.querySelector("#card-image-input");
const captionInput = newPostModal.querySelector("#caption-input");

const avatarModal = document.querySelector("#avatar-modal");
const avatarForm = avatarModal.querySelector(".modal__form");
const avatarInput = avatarModal.querySelector("#profile-avatar-input");
const avatarButton = document.querySelector(".profile__avatar-button");

const deleteModal = document.querySelector("#delete-modal");
const deleteConfirmButton = document.querySelector(".modal__delete-button");
const deleteCancelButton = document.querySelector(".modal__cancel-button");

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

document.querySelectorAll(".modal__close-btn").forEach((btn) => {
  btn.addEventListener("click", () => closeModal(btn.closest(".modal")));
});

function renderLoading(
  isLoading,
  button,
  buttonText = "Save",
  loadingText = "Saving...",
) {
  button.textContent = isLoading ? loadingText : buttonText;
}

function handleSubmit(request, evt, loadingText = "Saving...") {
  evt.preventDefault();
  const submitButton = evt.submitter;
  const initialText = submitButton.textContent;

  renderLoading(true, submitButton, initialText, loadingText);

  request()
    .then(() => evt.target.reset())
    .catch(console.error)
    .finally(() => renderLoading(false, submitButton, initialText));
}

function getCardElement(data) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardTitleEl = cardElement.querySelector(".card__title");
  const likeButton = cardElement.querySelector(".card__like-btn");
  const deleteButton = cardElement.querySelector(".card__delete-btn");

  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;
  cardTitleEl.textContent = data.name;

  if (data.isLiked) {
    likeButton.classList.add("card__like-btn_active");
  }

  likeButton.addEventListener("click", () => {
    const isLiked = likeButton.classList.contains("card__like-btn_active");
    const request = isLiked ? api.unlikeCard(data._id) : api.likeCard(data._id);

    request
      .then(() => likeButton.classList.toggle("card__like-btn_active"))
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

editProfileButton.addEventListener("click", () => {
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value = profileDescriptionEl.textContent;

  resetValidation(
    editProfileForm,
    [editProfileNameInput, editProfileDescriptionInput],
    config,
  );

  openModal(editProfileModal);
});

newPostButton.addEventListener("click", () => {
  resetValidation(newCardForm, [imageInput, captionInput], config);
  openModal(newPostModal);
});

avatarButton.addEventListener("click", () => {
  resetValidation(avatarForm, [avatarInput], config);
  openModal(avatarModal);
});

editProfileForm.addEventListener("submit", (evt) =>
  handleSubmit(
    () =>
      api
        .editUserInfo({
          name: editProfileNameInput.value,
          about: editProfileDescriptionInput.value,
        })
        .then((data) => {
          profileNameEl.textContent = data.name;
          profileDescriptionEl.textContent = data.about;
          closeModal(editProfileModal);
        }),
    evt,
  ),
);

newCardForm.addEventListener("submit", (evt) =>
  handleSubmit(
    () =>
      api
        .addCard({
          name: captionInput.value,
          link: imageInput.value,
        })
        .then((data) => {
          cardsList.prepend(getCardElement(data));
          closeModal(newPostModal);
        }),
    evt,
  ),
);

avatarForm.addEventListener("submit", (evt) =>
  handleSubmit(
    () =>
      api.editAvatarInfo({ avatar: avatarInput.value }).then((data) => {
        profileAvatarEl.src = data.avatar;
        closeModal(avatarModal);
      }),
    evt,
  ),
);

deleteConfirmButton.addEventListener("click", () => {
  deleteConfirmButton.textContent = "Deleting...";

  api
    .removeCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
    })
    .catch(console.error)
    .finally(() => {
      deleteConfirmButton.textContent = "Delete";
    });
});

deleteCancelButton.addEventListener("click", () => closeModal(deleteModal));

api
  .getAppInfo()
  .then(([cards, user]) => {
    profileNameEl.textContent = user.name;
    profileDescriptionEl.textContent = user.about;
    profileAvatarEl.src = user.avatar;

    cards.forEach((card) => cardsList.append(getCardElement(card)));
  })
  .catch(console.error);

enableValidation(config);
