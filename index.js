const express = require('express')
const app = express()

// za env ucitat iz datoteke varijable iz eenv:
//require('dotenv').config()
const Poruka = require('./models/poruke')

// VJ3
const cors = require('cors')
app.use(cors())

//VJ4
app.use(express.json())
app.use(express.static('build'))


const zahtjevInfo = (req, res, next) => {
    console.log('Metoda:', req.method)
    console.log('Putanja:', req.path)
    console.log('Tijelo:', req.body)
    console.log('---')
    next()
  }
  
  app.use(zahtjevInfo)
  


let poruke = [
    {
        id: 4,
        sadrzaj: 'HTML nije jednostavan',
        vazno: true
    },
    {
        id: 8,
        sadrzaj: 'React koristi JSX sintaksu',
        vazno: false
    },
    {
        id: 13,
        sadrzaj: 'GET i POST su najvaznije metode HTTP protokola',
        vazno: true
    }
]

app.get('/', (req, res) => {
    res.send('<h1>Pozdrav od Express servera + nodemona</h1>')
})

//svePoruke:
app.get('/api/poruke', (req, res) => {
    //res.json(poruke)
    Poruka.find({}).then(result=>{
        res.json(result)
    })
})

app.get('/api/poruke/:id', (req, res,next) => {
    // const id = Number(req.params.id)
    // const poruka = poruke.find(p => p.id === id)

    // if (poruka) {
    //     res.json(poruka)
    // } else {
    //     res.status(404).end()
    // }
    const id=req.params.id
    Poruka.findById(id)
    .then(poruka =>{
        if(poruka){
            res.json(poruka)
        }
    else{
        res.status(404).end();
    }   
    })
    .catch(err => next(err))

})
/*app.delete('/api/poruke/:id', (req, res) => {
    const id = Number(req.params.id)
    poruke = poruke.filter(p => p.id !== id)
    res.status(204).end()

})*/
app.delete('/api/poruke/:id', (req, res) => {
    Poruka.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(err => next(err))
  })

/*app.put('/api/poruke/:id', (req, res) => {
    // const id = Number(req.params.id)
    // const podatak = req.body
    // poruke = poruke.map(p => p.id !== id ? p : podatak)
    // res.json(podatak)
    const id=req.params.id
    Poruka.findById(id)
    .then(poruka =>{
        res.json(poruka)
    })
    .catch(err => {
        console.log("Dogodila se greska",err)
    })

})*/
app.put('/api/poruke/:id', (req, res,next) => {
    const podatak = req.body
    const id = req.params.id
  
    const poruka = {
      sadrzaj: podatak.sadrzaj,
      vazno: podatak.vazno
    }
  
    Poruka.findByIdAndUpdate(id, poruka, {new: true})
    .then( novaPoruka => {
      res.json(novaPoruka)
    })
    .catch(err => next(err))
  
  })

app.post('/api/poruke', (req, res, next) => {
    //JER OVO MONGO SAD GENERIRA PA NE TREBAMO SAMI DEFINIRAT ZA ID
    // const maxId = poruke.length > 0
    // ? Math.max(...poruke.map(p => p.id))
    // : 0 

    const podatak = req.body
    // if(!podatak.sadrzaj){
    //     return res.status(400).json({
    //         error: 'Nedostaje sadržaj poruke'
    //     })
    // }
    const poruka = new Poruka({
        sadrzaj: podatak.sadrzaj,
        vazno: podatak.vazno || false,
        datum: new Date()
        //id: maxId + 1
    })

    poruka.save().then( result => {
        console.log("Podatak spremljen:")
        res.json(result)
        console.log(result)}).catch(err => next(err))
        

    // poruke = poruke.concat(poruka) 
    // res.json(poruka)
    
})

const nepoznataRuta = (req, res) => {
    res.status(404).send({ error: 'nepostojeca ruta' })
  }
  
  app.use(nepoznataRuta)

const errorHandler = (err, req, res, next) => {
    console.log("Middleware za pogreske");
    if(err.name == "CastError"){
        return res.status(400).send({error: "Krivi format ID parametra"})
    }
    else if(err.name="MongoParseError"){
        return res.status(400).send({error: "Krivi format podatka"})
    }
    next(err)
}
function zadnjiErrorHandler (err, req, res, next) {
    res.status(500)
    res.send('error', { error: err })
  }
app.use(errorHandler)
app.use(zadnjiErrorHandler)
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server sluša na portu ${PORT}`);
})
