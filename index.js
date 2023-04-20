let express = require('express');
const path = require('path');
const env = require('dotenv');
const app = express();
const port = 5000;

env.config(
    {
        path: './.env'
    }
);

app.use(express.urlencoded(
    {
        extended: true
    }
));
app.use(express.json());
app.set('view engine', 'hbs');

app.use('/', require('./routes/register_routes'));
app.use('/auth', require('./routes/auth'));


app.listen(port,()=>{
    console.log(`Server has started!`)
});