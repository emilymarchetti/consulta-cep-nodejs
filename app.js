const express = require('express');
const request = require('request');
const favicon = require('serve-favicon');
const app = express();
const path = require('path');
const router = express.Router();

router.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/getCep', function (req, res) {
    var cep = req.query.cep;
    request('https://viacep.com.br/ws/' + cep + '/json/', function (error, response, json) {
        res.send(json);
    });
});

app.get('/getUf', function (req, res) {
    request('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome', function (error, response, json) {
        res.send(json);
    });
});

app.get('/getCidades', function (req, res) {
    var uf = req.query.uf;
    request('https://servicodados.ibge.gov.br/api/v1/localidades/estados/' + uf + '/municipios?orderBy=nome', function (error, response, json) {
        res.send(json);
    });
});

app.get('/getCepByEndereco', function (req, res) {
    var uf = req.query.uf.toLowerCase();
    var localidade = req.query.localidade.toLowerCase();
    var logradouro = req.query.logradouro.toLowerCase();
    var url = encodeURI('https://viacep.com.br/ws/' + uf + '/' + localidade + '/' + logradouro + '/json/');

    request(url, function (error, response, json) {
        res.send(json);
    });
});

app.use('/', router);
app.use(express.static('public'));
app.use(favicon(__dirname + '/public/images/favicon.ico'));
app.listen(process.env.port || 3000);