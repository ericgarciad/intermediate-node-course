const express= require('express');
const mongoose= require('mongoose');
const bodyParser= require('body-parser');
const port=8000;
const app= express();
const User=require('./models/User');
mongoose.connect('mongodb://localhost/userData')

app.use(bodyParser.json());

app.listen(port, ()=>{
	console.log(`server is listening on port:${port}`)
})
/* Cuando desee crear un nuevo documento en MongoDB, simplemente puede llamar al método "crear" en su modelo de mangosta. El primer argumento es un objeto que contiene los valores del nuevo documento (almacenados en req.body). El siguiente argumento es una función de devolución de llamada, que maneja la respuesta (res) de la base de datos.*/

// CREATE
app.post('/users',(req,res)=>{
  User.create(
    {
      name:req.body.newData.name,
      email:req.body.newData.email,
      password:req.body.newData.password
    },
    (err,data)=>{
    if (err){
      res.json({success: false,message: err})
    } else if (!data){
      res.json({success: false,message: "Not Found"})
    } else {
      res.json({success: true,data: data})
    }
  })
})

app.route('/users/:id')

/* Genial, tu usuario tiene una identificación de 606c1437e78235381c64cd46. Esto es lo que usaremos en lugar de: id, mientras hacemos las otras solicitudes. busque la ruta "READ" en nuestro archivo de servidor y reemplácela con este código:*/

// READ
.get((req,res)=>{
  User.findById(req.params.id,(err,data)=>{
    if (err){
      res.json({
        success: false,
        message: err
      })
    } else if (!data){
      res.json({
        success: false,
        message: "Not Found"
      })
    } else {
      res.json({
        success: true,
        data: data
      })
    }
  })
})

/* Si desea actualizar un documento en mongoDB, puede hacerlo con el método User.findByIdAndUpdate. Esto toma tres argumentos (id, newData, callback). La identificación todavía proviene de "req.params", pero newData es un objeto enviado a través de "req.body". Además, de forma predeterminada, el método de actualización devolverá el documento sin modificar. Podemos agregar un argumento de "opciones" antes de la devolución de llamada ( {new:true}) para que devuelva el documento modificado.*/

// UPDATE
.put((req,res)=>{
  User.findByIdAndUpdate(
    req.params.id,
    {
      name:req.body.newData.name,
      email:req.body.newData.email,
      password:req.body.newData.password
    },
    {
      new:true
    },
    (err,data)=>{
      if (err){
        res.json({
          success: false,
          message: err
        })
      } else if (!data){
        res.json({
          success: false,
          message: "Not Found"
        })
      } else {
        res.json({
          success: true,
          data: data
        })
      }
    }
  )
})

// DELETE
.delete((req,res)=>{
  User.findByIdAndDelete(
    req.params.id,
    (err,data)=>{
      if (err){
        res.json({
          success: false,
          message: err
        })
      } else if (!data){
        res.json({
          success: false,
          message: "Not Found"
        })
      } else {
        res.json({
          success: true,
          data: data
        })
      }
    }
  )
})