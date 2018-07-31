const nameField = document.getElementById('name')
const playerForm = document.getElementById('playerform')
const dropDown = document.getElementById('nameselect')
const PLAYER_URL = "http://localhost:3000/api/v1/players"
const optOneField = document.getElementById('1')
const optTwoField = document.getElementById('2')
const optThreeField = document.getElementById('3')
const mainDiv = document.getElementById('main')
const form = document.getElementById('formDiv')

//FIRST THINGS TO LAUNCH
loadNames()

playerForm.addEventListener('submit', () => handleSubmit(event, nameField))

//FUNCTION LIBRARY

function showForm(resp){
  console.log(resp)
    mainDiv.className = "hidden"
    form.className = "visible"
    form.dataset.id = resp.data.id
  }

function loadNames(){
  return fetch(PLAYER_URL).then( res => res.json()).then(renderNames)
}

function renderNames(resp){
  resp.data.forEach(function(player){
    dropDown.innerHTML += `<option value="${player.id}">${player.attributes.name}</option>`
  })
}

function handleSubmit(e){
e.preventDefault();
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
    }).then(resp => resp.json()).then(showForm)
  }
  else {
    const playerId = dropDown.value
    console.log(playerId)
  }

}
