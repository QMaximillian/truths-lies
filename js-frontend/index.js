console.log("hello world")
fetch("http://localhost:3000/api/v1/players").then( res => res.json()).then(console.log)

const nameField = document.getElementById('name')
// const optOneField = document.getElementById('1')
// const optTwoField = document.getElementById('2')
// const optThreeField = document.getElementById('3')
const playerForm = document.getElementById('player-form')

playerForm.addEventListener('submit', () => handleSubmit(event, nameField))

function handleSubmit(e, nameField){
e.preventDefault();
if (nameField.value.length > 0){
    return fetch('http://localhost:3000/api/v1/players', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: nameField.value
      })
    })

  }

}
