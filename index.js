const express = require('express')
var morgan = require('morgan')
const app = express()

morgan.token('content', function getName (req) { 
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  }
  else {
    return []
  }
})

app.use(express.json(), morgan(':method :url :status :res[content-length] - :response-time ms :content'))

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-6423122"
    }
]

app.get('/api/persons', (request,response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request,response) => {
    const id = Number(request.params.id)
    const person = persons.find(pax => pax.id === id)

  if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })

app.get('/api/info', (request,response) => {
    const numofpersons = persons.length
    response.send(
        `<p1>Phonebook has info for ${numofpersons} people <br/> </p1> 
        <br/> 
        <p1>${new Date()}</p1>`)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(pax => pax.id !== id)
  
    response.status(204).end()
  })

app.post('/api/persons', (request, response) => {
    const body = request.body

    if(!body.name || !body.number) {
      return response.status(400).json({
        error: 'name and number must both be provided'
      })
    }
    if(persons.map(p => p.name).includes(body.name)) {
      return response.status(400).json({
        error: 'name must be unique'
      })
    }
    const pax = {
      id: Math.round(Math.random()*10000),
      name: body.name,
      number: body.number
    }
    persons = persons.concat(pax)
  
    response.json(pax)
  })

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})