const nameField = document.getElementById('name')
const playerForm = document.getElementById('playerform')
const dropDown = document.getElementById('nameselect')
const PLAYER_URL = "http://localhost:3000/api/v1/players"
const QUIZ_URL = "http://localhost:3000/api/v1/quiz_cards"
const mainDiv = document.getElementById('main')
const form = document.getElementById('formDiv')
const optOne = document.getElementById('1')
const optTwo = document.getElementById('2')
const optThree = document.getElementById('3')

//FIRST THINGS TO LAUNCH
loadNames()

function loadNames(){
  return fetch(PLAYER_URL).then( res => res.json()).then(renderNames)
}

function renderNames(resp){
  resp.data.forEach(function(player){
    dropDown.innerHTML += `<option value="${player.id}">${player.attributes.name}</option>`
  })
}

playerForm.addEventListener('submit', handleNameSubmit)

function handleNameSubmit(e){
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

function showForm(resp){
  console.log(resp)
    mainDiv.className = "hidden"
    form.className = "visible"
    form.dataset.id = resp.data.id
  }

form.addEventListener('submit', handleFormSubmit)

function promptUserForNumber(e){
  form.className = "hidden"
  mainDiv.innerHTML = "Which was the lie? Press 1, 2 or 3 on the keyboard"
  mainDiv.className = "visible"
  return getNumber()
}

function getNumber(){
  window.addEventListener('keydown', (event) => {
    let false_option_number = event.key
    handleFormSubmitPartTwo(false_option_number)
  })
}

  function handleFormSubmit(event){
    event.preventDefault();
    promptUserForNumber();
  }

  function handleFormSubmitPartTwo(fon){
    return fetch(QUIZ_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        player_id: form.dataset.id,
        option1: optOne.value,
        option2: optTwo.value,
        option3: optThree.value,
        false_option: fon
      })
    }).then(resp => resp.json()).then(console.log)
  }
