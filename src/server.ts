import express from 'express';
const app = express();
import routes from './common/routes/routes'
import cors from 'cors'
import bodyParser from 'body-parser'

let port = process.env.PORT || 3000

app.use(cors());

app.use(express.json());

app.use("/", routes);

app.listen(port, () => {
    console.log("Aplicação rodando na porta " + port)
})