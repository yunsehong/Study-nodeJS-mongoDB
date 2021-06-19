const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs'); 
const mongoose = require('mongoose');
app.use(express.json());
const { Schema } = mongoose;
const router = require('express').Router();


// mongo db connect
const connect = () => {
    if (process.env.NODE_ENV !== 'production') {
      mongoose.set('debug', true);
    }
    
    mongoose.connect('mongodb+srv://lexie:coldplay7878@cluster0.znjtj.mongodb.net/restaurant?retryWrites=true&w=majority');

    const db =  mongoose.connection;
    db.on('error', (error) => {
      console.error('mongodb connection error', error)
      process.exit(1);
    });
    db.on('disconnected', () => {
      console.error('mongodb disconnected try again');
      connect();
    });
    db.on('open',() => console.log("Connected!"));
}

connect();

app.listen(3005, () => console.log('listening on 3005'));



// Create Menu Schema
const menuSchema = new Schema({
  restaurantId: {type: Schema.Types.ObjectId, ref: 'Restaurant'},
  name: String,
  price: String,
},{ collection: 'menus', versionKey: false});

// Create Restaurant Schema
const restaurantSchema = new Schema({
  name:{
    type: String,
    required : true
  },
  location:{
    type: String,
    required : true
  },
  phone:{
    type: String,
    required : false
  },
  email:{
    type: String,
    required : false
  }
},{ collection: 'restaurants',versionKey: false });

// Create Model
const Menu = mongoose.model('Menu', menuSchema);
const Restaurant = mongoose.model('Restaurant', restaurantSchema);


// read restaurants list
app.get('/restaurants',(req, res) => {
  Restaurant.find((err, restaurants) => {
    if(err) return res.status(500).send({error: 'database failure'});
    if(err) return res.status(404).send({error: 'no restaurants'});
    res.json(restaurants);
  })
})

// read one restaurant
app.get('/restaurants/:restaurantId',(req, res) => {
  Restaurant.findOne({_id:req.params.restaurantId})
  .then(restaurant => {
    res.json(restaurant);
  }, err => {
    console.log('error : ',err);
  })
})

// add restaurant
app.post('/restaurants', (req, res) => {
  var newRestaurant = new Restaurant({
    name: req.body.name,
    location: req.body.location,
    phone: req.body.phone,
    email: req.body.email
  })

  newRestaurant.save().then(restaurant => {
    res.json(restaurant);
    console.log('new restaurant : ',restaurant);
  },(err) => {
    console.log('error : ', err);
  })
})

// update restaurant
// delete restaurant

// -------------------------

// read menus list
app.get('/restaurants/:restaurantId/menus', (req, res) => {
  Menu.find({ restaurantId: req.params.restaurantId })
  .then(menus => {
    res.json(menus);
    console.log('this restaurant menus are : ',menus);
  },(err) => console.log('error : ', err));
});


// read one menu
app.get('/restaurants/:restaurantId/menus/:menuId',(req, res) => {
  Menu.findOne({
    restaurantId: req.params.restaurantId,
    _id: req.params.menuId
  }).then(menu => {
    res.json(menu);
    console.log('menu : ',menu);
  },(err) => {
    console.log('error : ', err)
  })
})


// add a menu
app.post('/restaurants/:restaurantId/menus',(req, res) => {
  const restaurantId = req.params.restaurantId;

  // Create Document
  var newMenu = new Menu({
    restaurantId : restaurantId,
    name : req.body.name,
    price : req.body.price
  });

  // insert to db
  newMenu.save().then(menu => {
    res.json(menu); 
    console.log('new menu : ',menu);
  }, err => {
    console.log('error : ', err);
  }) 
})


// update a menu
app.put('/restaurants/:restaurantId/menus/:menuId', (req,res) => {
  Menu.findOneAndUpdate(
    { restaurantId: req.params.restaurantId,
      _id: req.params.menuId}, 
    { name: req.body.name,
      price: req.body.price}
  ).then(menu => {
    res.json(menu); 
    console.log('updated menu : ',menu);
  },
    err => {
      console.log('error : ', err);
    })
})


// delete a menu
app.delete('/restaurants/:restaurantId/menus/:menuId', (req,res) => {
  Menu.findOneAndDelete({
    restaurantId: req.params.restaurantId,
    _id: req.params.menuId
  })
  .then(menu => {
    res.json(menu); 
    console.log('deleted menu : ',menu);
  }, err => {
    console.log('error : ', err);
  })
})

