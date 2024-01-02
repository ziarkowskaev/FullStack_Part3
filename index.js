const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())

// create "middleware"

//create a token 
morgan.token('data', function(req, res) {
        return JSON.stringify(req.body); 
});

//custom "tiny"
app.use(
    morgan(':method :url :status :res[content-length] - :response-time ms :data', {
        skip: function(req, res) {return req.method !== 'POST'} // skip if method is not POST
    }));

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/info', (request, response) => {
    const num = persons.length
    const date = new Date().toString()
    response.send(`<p>Phonebook has info for ${num} people</p></br><p>${date}</p>`)
  })

  
app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {

    const id = Number(request.params.id)
    const person = persons.find(note => note.id === id)
    
    if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    
    response.status(204).end()
})

  app.post('/api/persons', (request, response) => {

    const body = request.body

    console.log(body.name)
  
    if (!body.name || !body.number) {
      return response.status(400).json({ 
        error: 'The name or number is missing' 
      })
    }

    if (persons.some(person => person.name === body.name)) {
        return response.status(400).json({ 
          error: 'The name already exists in the phonebook' 
        })
      }
  
    const person = {
        "id": Math.floor(Math.random() * 500),
        "name": body.name, 
        "number": body.number
    }
  
    persons = persons.concat(person)
  
    response.json(person)
  })

  const PORT = 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })