import e from "express";
import cors from "cors";
import buildSMSIR from "./components/SMSIR.js";
import buildAccident from "./components/haulageAccident.js";

const app = e()

app.use(e.json())

const options = {
  "Access-Control-Allow-Origin": "*", // Required for CORS support to work
  "optionsSuccessStatus": 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(options))



const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server Listening on PORT:", PORT);
});

var rawBodyHandler = function (req, res, buf, encoding) {
  if (buf && buf.length) {
      req.rawBody = buf.toString(encoding || 'utf8');
      console.log('Raw body: ' + req.rawBody);
  }
}

app.get("/test", (request, response) => {
  const status = {
    "Status" : "Running"
  };
  response.send(status)
});

app.post("/SMSIR",  function (req, res) {
  res.json("data submitted")
  const formData = req.body
  buildSMSIR(formData, "SMSIR")
})

app.post("/haulageAccident",  function (req, res) {
  res.json("data submitted")
  const formDatat = req.body
  buildAccident(formData, "haulageAccident")
})

