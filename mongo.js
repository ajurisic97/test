// MongoDB i Mongoose
const mongoose = require('mongoose')
const password = 'ajurisic97' //inače ne pisati pw u plain txtu
const dbname = 'poruke-api'

// ConnectionString:
const url = `mongodb+srv://ajurisic97:${password}@cluster0.fvhxr.mongodb.net/${dbname}?retryWrites=true&w=majority`

// connect prima 2 param: 1. ConnStr, 2. je objekt sa postavkama konekcije
// znj

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  })

const porukaSchema = new mongoose.Schema({
    sadrzaj: String,
    datum: Date,
    vazno: Boolean
})

	
//const Poruka = mongoose.model('Poruka', porukaSchema)
const Poruka = mongoose.model('Poruka', porukaSchema,'poruke')

const novaPoruka = new Poruka({
    sadrzaj: 'Druga poruka',
    datum: new Date(),
    vazno: true
  })

/*novaPoruka.save().then(result => {
    console.log('Poruka spremljena')
    console.log(result);
    mongoose.connection.close()
  })*/


 // ako zelimo naci sve poslat cemo prazni objekt

/*
Poruka.find({})
  .then(result => {
    result.forEach(poruka =>{
      console.log(poruka)
    })
    mongoose.connection.close()
  })
*/