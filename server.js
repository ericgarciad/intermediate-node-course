const express= require('express');
const mongoose= require('mongoose');
const bodyParser= require('body-parser');
const port=8000;
const app= express();
const User=require('./models/User');
mongoose.connect('mongodb://localhost/userData')

function sendResponse(res,err,data){
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

app.use(bodyParser.json());

app.listen(port, ()=>{
	console.log(`server is listening on port:${port}`)
})
/* Cuando desee crear un nuevo documento en MongoDB, simplemente puede llamar al método "crear" en su modelo de mangosta. El primer argumento es un objeto que contiene los valores del nuevo documento (almacenados en req.body). El siguiente argumento es una función de devolución de llamada, que maneja la respuesta (res) de la base de datos.*/

// CREATE
app.post('/users',(req,res)=>{
  User.create(
    {...req.body.newData},
    (err,data)=>{sendResponse(res,err,data)}
  )
})


/* Genial, tu usuario tiene una identificación de 606c1437e78235381c64cd46. Esto es lo que usaremos en lugar de: id, mientras hacemos las otras solicitudes. busque la ruta "READ" en nuestro archivo de servidor y reemplácela con este código:*/

// READ
app.route('/users/:id')
.get((req,res)=>{
  User.findById(
    req.params.id,
    (err,data)=>{sendResponse(res,err,data)})
})

/* Si desea actualizar un documento en mongoDB, puede hacerlo con el método User.findByIdAndUpdate. Esto toma tres argumentos (id, newData, callback). La identificación todavía proviene de "req.params", pero newData es un objeto enviado a través de "req.body". Además, de forma predeterminada, el método de actualización devolverá el documento sin modificar. Podemos agregar un argumento de "opciones" antes de la devolución de llamada ( {new:true}) para que devuelva el documento modificado.*/

// UPDATE
.put((req,res)=>{
  User.findByIdAndUpdate(
    req.params.id,
    {...req.body.newData},
    {new:true},
    (err,data)=>{sendResponse(res,err,data)})
})

// DELETE
.delete((req,res)=>{
  User.findByIdAndDelete(
    req.params.id,
    (err,data)=>{sendResponse(res,err,data)})
})

/* Entonces, en lugar de esto:

{ 
  nombre : req . cuerpo . newData . nombre , 
  correo electrónico : req . cuerpo . newData . correo electrónico , 
  contraseña : req . cuerpo . newData . contraseña 
}

podemos escribir la siguiente: {...req.body.newData}.

El código anterior es mucho más fácil de mantener. Además, con la sintaxis de propagación solo necesita incluir los valores que se están modificando. En la primera versión buscábamos explícitamente un valor en cada clave para actualizar. Si los valores no se incluyen, se establecerán en "nulo". Ahora nuestras rutas son más flexibles, ya que el objeto a actualizar lo define la solicitud. Esto puede parecer extraño al principio, pero el modelo debe mantener sus datos consistentes.*/