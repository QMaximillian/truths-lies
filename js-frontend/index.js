const nameField = document.getElementById('name')
const playerForm = document.getElementById('playerform')
const dropDown = document.getElementById('nameselect')
const PLAYER_URL = "http://localhost:3000/api/v1/players"
const QUIZ_URL = "http://localhost:3000/api/v1/quiz_cards"
const nameForm = document.getElementById('name-form')
const form = document.getElementById('formDiv')
const optOne = document.getElementById('1')
const optTwo = document.getElementById('2')
const optThree = document.getElementById('3')
const quizCardArea = document.getElementById('quiz-card-area')
playerForm.addEventListener('submit', handleNameSubmit)


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
    nameForm.className = "hidden"
    fetchCards()
  }
}

function showForm(resp){
  console.log(resp)
    nameForm.className = "hidden"
    form.className = "visible"
    form.dataset.id = resp.data.id
  }

form.addEventListener('submit', handleFormSubmit)

function promptUserForNumber(e){
  form.className = "hidden"
  nameForm.innerHTML = "Which was the lie? Press 1, 2 or 3 on the keyboard"
  nameForm.className = "visible"
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

  function fetchCards(){
      return fetch(QUIZ_URL).then( res => res.json()).then(formatCards)
  }

  function formatCards(response){
    response.data.forEach(function(card){
      quizCardArea.innerHTML += cardTemplate(card)
    })
    quizCardArea.addEventListener('click', handleNameSelect)
  }

  function handleNameSelect(e){
    // console.log(e.target)
    // if (e.target.className === "player-name"){
    //   let selectedCard = e.target.dataset.player;
    //   let allCards = document.querySelectorAll('.player-name')
    //   allCards.forEach(function(card){
    //
    //   })
    // }
    if (e.target.className === "player-name"){
    let currentCard = e.target.parentNode.childNodes[3]
    // let allCards = document.querySelectorAll('.player-name')
    currentCard.className = ""
          quizCardArea.removeEventListener('click', handleNameSelect)
  }
    // allCards.forEach(function(card){
    //   if(card.attributes[0].nodeValue !== currentCard.parentNode.dataset.card){
    //     card.className = 'player-name hidden'
    //   }
    // })
  }


  function cardTemplate(card){
    return `<div data-card="${card.id}" class="cards">
      <div data-player="${card.attributes.player.id}" class="player-name">
        ${card.attributes.player.name}
      </div>
      <div data-options="${card.id}" class="hidden">
        <ul class="options">
        <li>${card.attributes.option1} </li>
        <li>${card.attributes.option2} </li>
        <li>${card.attributes.option3} </li>
        </ul>
      </div>
    </div> `
  }
