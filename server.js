const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema');
const cors = require('cors');

const app = express();

//allow cross-origin requests
app.use(cors());

// Router to use graphql. Inside it, should go schema
app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));

app.listen(4000, () => {
    console.log("Listening for request on port 4000");
})