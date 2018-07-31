const nameField = document.getElementById('name')
const playerForm = document.getElementById('player-form')
const dropDown = document.getElementById('name-select')
const PLAYER_URL = "http://localhost:3000/api/v1/players"
const mainDiv = document.getElementById('main')
const optOneField = document.getElementById('1')
const optTwoField = document.getElementById('2')
const optThreeField = document.getElementById('3')

//FIRST THINGS TO LAUNCH
loadNames()

playerForm.addEventListener('submit', () => handleSubmit(event, nameField))

//FUNCTION LIBRARY

function createCard(mainDiv){
}

function clearMainDiv(){
  mainDiv.innerHTML = ''
}

function loadNames(){
  return fetch(PLAYER_URL).then( res => res.json()).then(renderNames)
}

function renderNames(resp){
  resp.data.forEach(function(player){
    dropDown.innerHTML += `<option value="${player.id}">${player.attributes.name}</option>`
  })
}

function handleSubmit(e, nameField, dropDown){
e.preventDefault();
clearMainDiv()
if (nameField.value.length > 0){
    return fetch(PLAYER_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: nameField.value
      })
    }).then(createCard)
  }
  else {
    const player = dropDown.value
  }

}
