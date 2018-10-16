    'use strict'
    //Require para utilizar express
    const express = require('express');
    const app = new express();

    //require para el sistema a modelar
    const Planeta = require('./Planeta.js');
    const Posicion = require('./Posicion.js');
    const Sistema = require('./Sistema.js');
    
    //Centro del sistema, la predicción es invariante 
    //respecto del centro, es solo si se requiere graficar
    const centro = new Posicion(507,244);
    
    //Creo los planetas del sistema con fase inicial 'fi',
    //distancia al centro 'r', vel. angular 'w' y sentido de 
    //rotación (horario por defecto)
    //Ferengi
    var ferengi = new Planeta();
    ferengi.centro = centro;
    ferengi.w = 1.0;
    ferengi.r = 500;
    ferengi.fi = -90.0;
    
    //Betasoide
    var betasoide = new Planeta();
    betasoide.centro = centro;
    betasoide.w = 3.0;
    betasoide.r = 2000;
    betasoide.fi = -90.0;
    
    //Vulcano
    var vulcano = new Planeta();
    vulcano.centro = centro;
    vulcano.w = 5.0;
    vulcano.r = 1000;
    vulcano.fi = -90.0;
    vulcano.sentidoHorario = false;
    
    // console.log(ferengi);
    // console.log("Posicion actual ");
    // console.log(ferengi.getPosicion(0));
    
    //Creo el sistema solar con los tres planetas
    var sistema = new Sistema(centro, ferengi, betasoide, vulcano);
    
    /////////////////////// Api REST ///////////////////////////////

    //Path para la prediccion de un día en particular
    app.get('/clima/:dia', function(req, res){
        var dia = req.params.dia;
        res.json(sistema.predecir(dia));

    });
    //Path genera un reporte con los dias en que comienza cada período 
    //en el rango de 0 a dias-1, por ejemplo si dias=360, genera el reporte
    //de todos los períodos dentro del rango de 0 a 359
    app.get('/clima/periodo/:dias', function(req, res){
        var dias = req.params.dias;
        res.json(sistema.prediccionPeriodo(dias));

    });

    // levanto la api en en puerto 8080
    app.listen(8080, function(){
        console.log("server up...")
    });