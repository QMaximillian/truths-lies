console.log("hello world")
fetch("http://localhost:3000/api/v1/players").then( res => res.json()).then(console.log)
