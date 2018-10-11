const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
//Map Global Promise - get rid of warning
mongoose.Promise = global.Promise;
//Connect to mongoose
mongoose.connect('mongodb://db_sheef:Bioshock12*@ds151917.mlab.com:51917/db_vidjot', { useNewUrlParser: true })
.then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err));
//Load Idea model
require('./models/Idea');
const Idea = mongoose.model('ideas');
// Handlebars Middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
//Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
//Index route
app.get('/',(req,res) => {
  const title = 'Welcome1';
  res.render('index',{
    title:title
  });
});

//About Route
app.get('/about', (req,res)=>{
  res.render('about')
});
// Idea index Page
app.get('/ideas',(req,res) =>{
  Idea.find({})
  .sort({date:'desc'})
  .then(ideas => {
    res.render('ideas/index', {
      ideas:ideas
    });
  });
});
//Add Idea Form
app.get('/ideas/add', (req,res)=>{
  res.render('ideas/add')
});
//Edit Idea Form
app.get('/ideas/edit/:id', (req,res)=>{
  Idea.findOne({
    _id: req.params.id
  })
  .then(idea => {
    res.render('ideas/edit', {
      idea:idea
    });
  });
});
//Process form
app.post('/ideas',(req,res)=>{
  let errors = [];
  if(!req.body.title){
    errors.push({text:'Please add a title'});
  }
  if(!req.body.details){
    errors.push({text:'Please add some details'});
  }
  if(errors.length > 0){
    res.render('ideas/add', {
      errors:errors,
      title:req.body.title,
      details:req.body.details
    });
  }else{
    const newUser = {
      title:req.body.title,
      details:req.body.details
    }
    new Idea(newUser)
    .save()
    .then(idea => {
      res.redirect('/ideas');
    })
  }
});
const port = 5000;

app.listen(port,()=>{
console.log(`Server started on port ${port}`);
});
