import express from 'express';
const app = express();
import routes from './common/routes/routes'
import cors from 'cors'
import bodyParser from 'body-parser'

app.use(express.json());

app.use("/", routes);



app.listen(3333, () => {
    console.log("http://localhost:3333")
})