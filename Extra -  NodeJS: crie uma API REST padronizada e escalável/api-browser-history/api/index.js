const express = require('express')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.json())
const sites = []

app.post('/api/sites', (req, res) => {
    try {
        const receivedData = req.body
    
        const site = {
            url: receivedData.url,
            accessDate: receivedData.accessDate
        }
    
        if(typeof site.url !== 'string' ||
            site.url.length === 0 ||
            typeof site.accessDate !== 'string' ||
            site.accessDate.length === 0 ){
                throw new Error('Invalid fields!!!')    
            }
            
        sites.push(site)
        res.status(201).send()        
    } catch (error) {
        res.status(400).send(JSON.stringify(error.message))
    }
})

app.get('/api/sites', (req, res) => {
    try {
        res.send(JSON.stringify(sites))
    } catch (error) {
        res.send(JSON.stringify(error))
    }
})

app.listen(3000, () => console.log('API is running...'))
