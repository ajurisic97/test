// MongoDB i Mongoose
const mongoose = require('mongoose')
//const password = 'ajurisic97'
//inače ne pisati pw u plain txtu

const password = process.env.ATLAS_PASS
const dbname = 'poruke-api'

// ConnectionString:
const url = `mongodb+srv://ajurisic97:${password}@cluster0.fvhxr.mongodb.net/${dbname}?retryWrites=true&w=majority`

// connect prima 2 param: 1. ConnStr, 2. je objekt sa postavkama konekcije
// znj
console.log("Spajam se na bazuuu bazu");
mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  }).then(result => {
    console.log("Spojeni smo na bazu");
  }).catch(error => {
    console.log("Greška pri spajanju", error.message);
  })

  const porukaSchema = new mongoose.Schema({
    sadrzaj: {
      type: String,
      required: true,
      minlength: 5
    },
    datum: {
      type: Date,
    required: true},
    vazno: {
      type: Boolean,
    default:false
  }
})
porukaSchema.set('toJSON',{
    transform: (doc, ret) => {
        ret.id = doc._id.toString()
        delete ret._id
        delete ret.__v
        return ret
    }
})
	
module.exports = mongoose.model('Poruka', porukaSchema,'poruke')