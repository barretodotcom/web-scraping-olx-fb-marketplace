import express from 'express';
const app = express();
import routes from './common/routes/routes'
import cors from 'cors'
import bodyParser from 'body-parser'
import timeout from 'connect-timeout'
let port = process.env.PORT || 3333

app.use(cors())

app.use(timeout("100s"))

app.use(express.json());

app.use(routes);

app.listen(port, () => {
    console.log("Aplicação rodando na porta " + port)
})