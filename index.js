const firstLetters = []
const gameContainer = document.getElementById('game-container')
const playedButton = document.getElementById('played-btn')
const bigTimesPlayed = document.querySelector('p[title=times-played]')

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
        const played = timesPlayedFunc(e.target.new_times_played.value)
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

    filter.addEventListener('change', e=>{
        e.preventDefault()
        filterFunc(document.getElementById('game-id').innerText)
    })

    playedButton.addEventListener('click', e=>{
        e.preventDefault()
        playedIncrease(document.getElementById('game-id').innerText)
    })
})

function smallGame(gameInfo){

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
    .then(data=>{
        smallGame({id: data.id, ...gameInfo})
        moreInfo(data.id)
        firstLetterFunc(gameInfo.name.charAt(0))
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

        moreInfoContainer.querySelector('h2').innerText = data.name
        document.getElementById('game-id').innerText = data.id
        moreInfoContainer.querySelector('p[title=players]').innerText = `${data.minPlayers} - ${data.maxPlayers} players`
        moreInfoContainer.querySelector('p[title=runtime]').innerText = `${data.minTime} - ${data.maxTime} minutes`
        bigTimesPlayed.innerText = `Times played: ${data.timesPlayed}`
        bigTimesPlayed.value = data.timesPlayed
        moreInfoContainer.querySelector('p[title=category]').innerText = `Category: ${data.category}`
        moreInfoContainer.querySelector('p[title=comments]').innerText = data.comments
    })
}

function timesPlayedFunc(input){
    const inputNumber = parseInt(input)
    if(typeof(inputNumber)==='number'&&inputNumber>0){
        return inputNumber
    } else {
        return 0
    }
}
function firstLetterFunc(letter){
    const filterContainer = document.getElementById('filter')
    if(firstLetters.includes(letter)===false){
        firstLetters.push(letter)
        firstLetters.sort()
        document.getElementById('filter').innerText = ''

        const allGamesOption = document.createElement('option')
        allGamesOption.id = 'all-games-filter'
        allGamesOption.innerText = 'All games'
        filterContainer.appendChild(allGamesOption)
        firstLetters.forEach(possibleLetter => {
            const letterOption = document.createElement('option')
            letterOption.id = `${possibleLetter}-filter`
            letterOption.innerText = possibleLetter
            filterContainer.appendChild(letterOption)
        })
    }
}

function filterFunc(letter){
    gameContainer.innerText = ''
    fetch('http://localhost:3000/games')
    .then(resp=>resp.json())
    .then(data=>{
        if(letter==='All games'){
            data.forEach(game=>smallGame(game))
        } else {
            data.forEach(game=>{
                if(game.name.charAt(0)===letter){
                    smallGame(game)
                }
            })
        }
    })
}

function playedIncrease(playedID){
    const newTimesPlayed = bigTimesPlayed.value+1
    fetch(`http://localhost:3000/games/${playedID}`,{
        method: 'PATCH',
        headers: {
            'content-type': 'application/json',
            Accept: 'application/json'
        },
        body: JSON.stringify({
            timesPlayed: newTimesPlayed
        })
    })
    .then(resp=>resp.json())
    .then(data=>{
        moreInfo(playedID)
    })
}