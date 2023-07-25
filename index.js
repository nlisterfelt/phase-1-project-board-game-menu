const firstLetters = []
document.addEventListener('DOMContentLoaded', ()=>{
    const newForm = document.getElementById('add-new-game')
    const filter = document.getElementById('filter')

    fetch('http://localhost:3000/games')
    .then(resp=>resp.json())
    .then(data=>data.forEach(game=>{
        smallGame(game)
        firstLetterFunc(game.name.charAt(0))
    }))

    moreInfo(1)

    newForm.addEventListener('submit', e=>{
        e.preventDefault()
        const played = timesPlayed(e.target.new_times_played.value)
        const game = {
            "name": e.target.new_title.value,
            "image": e.target.new_image.value,
            "minPlayers": e.target.new_min_players.value,
            "maxPlayers": e.target.new_max_players.value,
            "minTime": e.target.new_min_runtime.value,
            "maxTime": e.target.new_max_runtime.value,
            "timesPlayed": played,
            "category": e.target.new_category.value,
            "comments": e.target.new_comments.value
        }
        postNewGame(game)
        newForm.reset()
    })

    filter.addEventListener('select', e=>{
        e.preventDefault()
        filterFunc(e.target.value)
    })
})

function smallGame(gameInfo){
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

function postNewGame(gameInfo){
    fetch('http://localhost:3000/games',{
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            Accept: 'application/json'
        },
        body: JSON.stringify(gameInfo)
    })
    .then(resp=>resp.json())
    .then(data=>{smallGame({id: data.id, ...gameInfo})})
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
        players.innerText = `${data.minPlayers} - ${data.maxPlayers} players`
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

function timesPlayed(input){
    if(typeof(input)==='number'&&input>0){
        return input
    } else {
        return 0
    }
}
function firstLetterFunc(letter){
    if(firstLetters.includes(letter)===false){
        firstLetters.push(letter)
        firstLetters.sort()
    }

}

function filterFunc(selection){
    console.log(selection)
}