const Express= require("express");
const morgan = require("morgan");
const app = Express();
//------------------------------------------------------------------------------
//settings port
app.set("port", process.env.PORT || 3000);

//Middlewares
app.use(morgan('dev'));
app.use(Express.json());

//Routes
app.use(require("./routes/personal"));

//Starting the server
app.listen(app.get("port"), () => {
  console.log("Server on port", app.get("port"));
});