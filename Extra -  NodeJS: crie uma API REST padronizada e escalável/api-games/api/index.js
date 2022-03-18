const express = require('express')
const bodyParser = require('body-parser')

// Bootstrap
const app = express()
app.use(bodyParser.json())

const games = []

app.post('/api/games', (req, res) => {
    try {
        const received = req.body
        const game = {
            name: received.name,
            platform: received.platform
        }
    
        if(typeof game.name === 'string' &&
            game.name.length > 0 &&
            typeof game.platform === 'string' &&
            game.platform.length > 0
        ){
            games.push(game)
            res.send(JSON.stringify(game))
        } else {
            throw new Error("Invalid fields!!!")
        }    
    } catch (error) {
        res.send(JSON.stringify({
            message: error.message
        }))
    }
})

app.get('/api/games', (req, res) => {
    res.send(JSON.stringify(games))
})

// App
app.listen(3000, () => console.log('API is running'))