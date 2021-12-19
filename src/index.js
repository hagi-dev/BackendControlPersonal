const Express= require("express");
const morgan = require("morgan");
const app = Express();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const keys = require("./keys");
const express = require("express");
const res = require("express/lib/response");
const pool = require('./database');
//------------------------------------------------------------------------------
//settings port
app.set("port", process.env.PORT || 3000);
app.set("key",keys.key);
console.log(app.get("key"));
//Middlewares
app.use(express.urlencoded({extended:false}));
app.use(morgan('dev'));
app.use(Express.json());
app.use(cors());
//------------------------------------------------------------------------------
const rutasProtegidas = Express.Router(); 
rutasProtegidas.use((req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    if (token) {
      if(token.startsWith('Bearer ')){
        token = token.slice(7, token.length);
        jwt.verify(token, app.get('key'), (err, decoded) => {      
          if (err) {
            return res.json({ mensaje: 'Token inválida' });    
          } else {
            req.decoded = decoded;    
            next();
          }
        });

      }
      
    } else {
      res.json({ 
          mensaje: 'Token no proveída.' 
      });
    }
 }); 

//Routes
app.use(require("./routes/login"),rutasProtegidas);
app.use(require("./routes/asistencia"),rutasProtegidas);
app.use(require("./routes/personal"),rutasProtegidas);
app.use(require("./routes/contrato"),rutasProtegidas);
app.use(require("./routes/entradaYSalida"),rutasProtegidas);
app.use(require("./routes/horario"),rutasProtegidas);
app.use(require("./routes/jornadaLaboral"),rutasProtegidas);
app.use(require("./routes/permiso"),rutasProtegidas);
app.use(require("./routes/sancion"),rutasProtegidas);
app.use(require("./routes/tipoTrabajador"),rutasProtegidas);

//Starting the server
app.listen(app.get("port"), () => {
  console.log("Server on port", app.get("port"));
});

