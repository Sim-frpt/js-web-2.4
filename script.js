
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

const displayCharacters = async() => {
  let charArray = await getCharacters();
  let myDiv = document.querySelector("#container");

  for(let i = 0; i < charArray.length; i++) {
    let card = document.createElement("div");
    let name = document.createElement("h5");
    let shortDescription = document.createElement("p");
    let image = new Image(100, 100);

    card.setAttribute("class", "card");
    name.setAttribute("class", "name");
    name.setAttribute("data-toggle", "modal");
    name.setAttribute("data-target", "#displayModal");
    name.addEventListener("click", function () {
      displayModalContent(charArray[i]);
    });
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


//Create a new character modal
const PostcreatorModal = async () => {
  let form = document.querySelector("#creationForm");
  let creationModal = document.querySelector("#charCreationModal");
  let creaTion = document.querySelector("#characterCard");
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

displayCharacters();

document.querySelector("#creationButton").addEventListener("click", function() {
  PostcreatorModal();
});
