var express = require('express')

var route = require("./routes")();
var bodyParser = require('body-parser');

var logger = require('morgan');

var port = 3000;


var app = express();

var compression = require('compression');  


app.use(compression());  


app.use(logger("dev"));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));

app.use(route);

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')());

app.use(express.static('dist'));





app.listen(port, function(err) {
    if (err) {
        console.log(err)
        return
    }
    var uri = 'http://localhost:' + port
    console.log('Listening at ' + uri + '\n')
})