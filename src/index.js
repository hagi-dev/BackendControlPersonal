const Express= require("express");
const morgan = require("morgan");
const app = Express();
const cors = require("cors");
//------------------------------------------------------------------------------
//settings port
app.set("port", process.env.PORT || 3000);

//Middlewares
app.use(morgan('dev'));
app.use(Express.json());
app.use(cors());

//Routes
app.use(require("./routes/asistencia"));
app.use(require("./routes/personal"));
app.use(require("./routes/contrato"));
app.use(require("./routes/entradaYSalida"));
app.use(require("./routes/horario"));
app.use(require("./routes/jornadaLaboral"));
app.use(require("./routes/permiso"));
app.use(require("./routes/sancion"));
app.use(require("./routes/tipoTrabajador"));

//Starting the server
app.listen(app.get("port"), () => {
  console.log("Server on port", app.get("port"));
});