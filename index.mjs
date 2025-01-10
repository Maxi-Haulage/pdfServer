import e from "express";
import cors from "cors";
import buildSMSIR from "./components/SMSIR.js";

const app = e()
app.use(cors())
app.use(e.json())

var corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

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

app.post("/SMSIR", cors(corsOptions), function (request, response) {
  const test = request.body
  console.log(test)
  const status = {
    "MSG": "data submitted"
  }
  buildSMSIR(test)
  response.send(status)
})

