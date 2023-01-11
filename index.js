const config = require('config');
// require("dotenv").config();
const moongose = require('mongoose');
const customers = require('./routes/customers')
const genres = require('./routes/genres');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const auth = require('./routes/auth');
const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const app = express();

console.log(process.env.vidly_jwtPrivateKey);
if (!config.has('jwtPrivateKey')){
     console.error("FATAL Error: jwtPrivateKey is not defined.");
     process.exit(1);
}

     moongose.connect('mongodb://localhost/vidly')
    .then(() => console.log('Connected to MongoDB...'))
    .catch(() => console.error('Could not connect to MongoDb...'))

//

app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use(helmet());
app.use(compression());
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));

