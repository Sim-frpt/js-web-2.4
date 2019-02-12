
// import some polyfill to ensure everything works OK
import "babel-polyfill"

// import bootstrap's javascript part
import 'bootstrap';

/*
  Put the JavaScript code you want below.
*/

import axios from "axios";
import {markdown} from "markdown";


const getCharacters = async() => {
  try {
    const response = await axios.get("https://character-database.becode.xyz/characters");
    console.log(response.data);
    return response.data;
  } catch(error) {
    console.log(error);
  }
};

const addFieldsFromAPI = async() => {
  let charArray = await getCharacters();
  let myDiv = document.querySelector("#container");

  for(let i = 0; i < charArray.length; i++) {
    let card = document.createElement("div");
    let name = document.createElement("h5");
    let shortDescription = document.createElement("p");
    let image = new Image(100, 100);
      //add button for editing
    let editButton = document.createElement("button");

    card.setAttribute("class", "card");
    name.setAttribute("class", "name");
    name.setAttribute("data-toggle", "modal");
    name.setAttribute("data-target", "#displayModal");
    editButton.setAttribute("type", "button");
    editButton.setAttribute("class", "editButton");
    editButton.setAttribute("data-toggle", "modal");
    editButton.setAttribute("data-target", "#editModal");
    editButton.classList.add("btn");
    editButton.classList.add("btn-primary");
    editButton.innerText = "Edit Character";


    name.addEventListener("click", function () {
      displayModalContent(charArray[i]);
    });

    editButton.addEventListener("click", function () {
      editCharacters(charArray[i]);
    })
    shortDescription.setAttribute("class", "shortDescript");
    image.setAttribute("class", "image");

    name.innerText = charArray[i].name;
    shortDescription.innerText = charArray[i].shortDescription;

    myDiv.appendChild(card);
    card.appendChild(name);
    card.appendChild(shortDescription);


    if(charArray[i].image) {
      image.src = "data:image/jpeg;base64," + charArray[i].image;
      card.appendChild(image);
    }
    card.appendChild(editButton);
  }
};

//Create the content of the display modal
const displayModalContent = (arrayElement) => {
  let myModal = document.querySelector("#displayModal");
  let modalTitle = document.querySelector("#characterCard");
  let modalContent = document.querySelector("#displayContent");
  modalContent.innerHTML = "";
  let name = document.createElement("h5");
  let shortDescription = document.createElement("p");
  let image = new Image(100, 100);
  let description = document.createElement("p");

  name.setAttribute("class", "modalName");
  shortDescription.setAttribute("class", "modalShortDescript");
  image.setAttribute("class", "modalImage");
  description.setAttribute("class", "modalDescription");
  modalTitle.innerText = "Character Card";
  name.innerText = arrayElement.name;
  shortDescription.innerText = arrayElement.shortDescription;
  description.innerHTML = markdown.toHTML(arrayElement.description);

  if(arrayElement.image) {
    image.src = "data:image/jpeg;base64," + arrayElement.image;
    displayContent.appendChild(image);
  }
  displayContent.appendChild(name);
  displayContent.appendChild(shortDescription);
  displayContent.appendChild(description);
  displayContent.appendChild(image);
};

//Create a new edit modal
const editCharacters = (arrayElement) => {
  let editDiv = document.querySelector("#editContent");
  let characterName = document.querySelector("#editName");
  let charShortDescription = document.querySelector("#editShortDescription");
  let charDescription = document.querySelector("#editDescription");
  characterName.value = arrayElement.name;
  charShortDescription.value = arrayElement.shortDescription;
  charDescription.value = arrayElement.description;
};

//posts edits from edit modal DOES NOT DO ANYTHING YET FIGURE IT OUT
const postEdits = () => {
  let newName = document.querySelector("#editName").value;
  let newCharShortDescription = document.querySelector("#editShortDescription").value;
  let newCharDescription = document.querySelector("#editDescription").value;

  let newCharacterObject = {
    name: newName,
    shortDescription: newCharShortDescription,
    description: newCharDescription
  };
}

//Create a new character modal
const postCreatorModal = async () => {
  let characterName = document.querySelector("#addName").value;
  let charShortDescription = document.querySelector("#addShortDescription").value;
  let charDescription = document.querySelector("#addDescription").value;
  let newCharacter = {
    name: characterName,
    shortDescription: charShortDescription,
    description: charDescription
  }

  document.querySelector("#addName").value = "";
  document.querySelector("#addShortDescription").value = "";
  document.querySelector("#addDescription").value = "";
  await axios.post("https://character-database.becode.xyz/characters", newCharacter);
  window.location.reload();
};

addFieldsFromAPI();

//Add event when you click on submit button of creator modal
document.querySelector("#creationButton").addEventListener("click", function() {
  postCreatorModal();
});

//add cleaning of creator modal fields when simply clicking close
document.querySelector("#closeCreator").addEventListener("click", function() {
  document.querySelector("#addName").value = "";
  document.querySelector("#addShortDescription").value = "";
  document.querySelector("#addDescription").value = "";
});
