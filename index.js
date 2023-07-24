document.addEventListener('DOMContentLoaded', ()=>{
    const newForm = document.getElementById('add-new-game')

    fetch('http://localhost:3000/games')
    .then(resp=>resp.json())
    .then(data=>data.forEach(game=>addGame(game)))

    moreInfo(1)

    newForm.addEventListener('submit', e=>{
        e.preventDefault()
        const playersArr = playersArray(e.target.new_min_players.value,e.target.new_max_players.value)
        const played = timesPlayed(e.target.new_times_played.value)
        const game = {
            "name": e.target.new_title.value,
            "image": e.target.new_image.value,
            "players": playersArr,
            "minTime": e.target.new_min_runtime.value,
            "maxTime": e.target.new_max_runtime.value,
            "timesPlayed": played,
            "category": e.target.new_category.value,
            "comments": e.target.new_comments.value
        }
        moreInfo(game)
        addGame(game)
    })
})

function addGame(gameInfo){
    const gameContainer = document.getElementById('game-container')
    const div = document.createElement('div')
    div.id = gameInfo.id
    div.className = 'small-game-info'

    const image = document.createElement('img')
    image.src = gameInfo.image
    image.title = gameInfo.name
    image.className = 'small-image'
    image.imgID = gameInfo.id

    div.appendChild(image)
    gameContainer.appendChild(div)

    div.addEventListener('click', e=>{
        e.preventDefault()
        moreInfo(e.target.imgID)
    })
}

function addNewGame(gameInfo){
    const playersArray = []
    const played = timesPlayed(e.target.new_times_played.value)
    fetch('http://localhost:3000/games',{
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            Accept: 'application/json'
        },
        body: JSON.stringify({
            "name": gameInfo.name,
            "image": gameInfo.image,
            "players": playersArray,
            "minTime": gameInfo.minTime,
            "maxTime": gameInfo.maxTime,
            "timesPlayed": played,
            "category": gameInfo.category,
            "comments": gameInfo.comments
        })
    })
}

function moreInfo(id){
    fetch(`http://localhost:3000/games/${id}`)
    .then(resp=>resp.json())
    .then(data=>{
        const moreInfoContainer = document.getElementById('more-info')

        const image = moreInfoContainer.querySelector('img')
        image.src = data.image
        image.title = data.name
        image.className = 'big-image'

        const name = moreInfoContainer.querySelector('h2')
        name.innerText = data.name
        const players = moreInfoContainer.querySelector('p[title=players]')
        players.innerText = `${data.players[0]} - ${data.players[data.players.length-1]} players`
        const runtime = moreInfoContainer.querySelector('p[title=runtime]')
        runtime.innerText = `${data.minTime} - ${data.maxTime} minutes`
        const timesPlayed = moreInfoContainer.querySelector('p[title=times-played]')
        timesPlayed.innerText = `Times played: ${data.timesPlayed}`
        const category = moreInfoContainer.querySelector('p[title=category]')
        category.innerText = `Category: ${data.category}`
        const comments = moreInfoContainer.querySelector('p[title=comments]')
        comments.innerText = data.comments
    })
}
function playersArray(min, max){
    const playersArr = []
    for(let i=parseInt(min); i<=max; i++){
        playersArr.push(i)
    }
    return playersArr
}
function timesPlayed(input){
    if(typeof(input)==='number'&&input>=0){
        return input
    } else {
        return 0
    }
}