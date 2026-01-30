const previewModal = document.querySelector("#preview-modal");
const newPostModal = document.querySelector("#new-post-modal");
const editProfileModal = document.querySelector("#edit-profile-modal");
const closeButtons = document.querySelectorAll(".modal__close-btn");
const newSubmitBtn = newPostModal.querySelector(".modal__submit-btn");
const previewImageEl = previewModal.querySelector(".modal__image");
const previewCaptionEl = previewModal.querySelector(".modal__caption");
const cardsList = document.querySelector(".cards__list");

const initialCards = [
  {
    name: "Golden Gate Bridge",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
  },
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },
  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
];

function escapePress(evt) {
  if (evt.key === "Escape") {
    closeModal(currentModal);
  }
}

function openModal(modal) {
  modal.classList.add("modal_is-opened");
  currentModal = modal;
  document.addEventListener("keydown", escapePress);
}

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
  document.removeEventListener("keydown", escapePress);
  currentModal = "";
}

const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");
let currentModal = "";

function getCardElement(data) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardTitleEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");

  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;
  cardTitleEl.textContent = data.name;

  const cardLikeBtnEl = cardElement.querySelector(".card__like-btn");
  cardLikeBtnEl.addEventListener("click", () => {
    cardLikeBtnEl.classList.toggle("card__like-btn_active");
  });

  const cardDeleteBtnEl = cardElement.querySelector(".card__delete-btn");
  cardDeleteBtnEl.addEventListener("click", () => {
    cardElement.remove();
  });

  cardImageEl.addEventListener("click", () => {
    previewImageEl.src = data.link;
    previewImageEl.alt = data.name;
    previewCaptionEl.textContent = data.name;
    openModal(previewModal);
  });
  return cardElement;
}

const editProfileBtn = document.querySelector(".profile__edit-button");
const editProfileCloseBtn = editProfileModal.querySelector(".modal__close-btn");
const editProfileForm = document.forms["profile-form"];
const editProfileNameInput = editProfileModal.querySelector(
  "#profile-name-input"
);
const editProfileDescriptionInput = editProfileModal.querySelector(
  "#profile-description-input"
);

const newPostBtn = document.querySelector(".profile__add-button");
const newPostCloseBtn = newPostModal.querySelector(".modal__close-btn");

const newCardForm = document.forms["new-post-form"];
const newCardImageInput = newPostModal.querySelector("#card-image-input");
const newCardDescriptionInput = newPostModal.querySelector(
  "#card-description-input"
);

const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");

closeButtons.forEach((button) => {
  const popup = button.closest(".modal");
  button.addEventListener("click", () => closeModal(popup));
});

editProfileBtn.addEventListener("click", function () {
  editProfileNameInput.value = profileName.textContent;
  editProfileDescriptionInput.value = profileDescription.textContent;

  if (typeof resetValidation === "function") {
    resetValidation(
      editProfileForm,
      [editProfileNameInput, editProfileDescriptionInput],
      settings
    );
  }

  openModal(editProfileModal);
});

newPostBtn.addEventListener("click", function () {
  openModal(newPostModal);
});

function renderCard(item, method = "prepend") {
  const cardElement = getCardElement(item);
  cardsList[method](cardElement);
}

function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  profileName.textContent = editProfileNameInput.value;
  profileDescription.textContent = editProfileDescriptionInput.value;
  closeModal(editProfileModal);
}

editProfileForm.addEventListener("submit", handleProfileFormSubmit);

function handleCardFormSubmit(evt) {
  evt.preventDefault();
  const inputValues = {
    name: newCardDescriptionInput.value,
    link: newCardImageInput.value,
  };
  renderCard(inputValues, "prepend");
  evt.target.reset();
  if (typeof disableButton === "function") {
    disableButton(newSubmitBtn, settings);
  }
  closeModal(newPostModal);
}

newCardForm.addEventListener("submit", handleCardFormSubmit);

initialCards.forEach(function (item) {
  renderCard(item, "append");
});

const onClickOff = () => {
  const modalList = document.querySelectorAll(".modal");
  modalList.forEach((formEl) => {
    formEl.addEventListener("click", function (evt) {
      if (evt.target.classList.contains("modal")) {
        closeModal(formEl);
      }
    });
  });
};

onClickOff();
