
var Posicion = require('./Posicion.js');

module.exports = class Planeta
{
    constructor()
    {
        this.C1 = Math.PI / 180;
        this.fi = 0.0;
        this.x = 0.0;
        this.y = 0.0;
        this.r = 0.0;
        this.w = 0.0;
        this.sentidoHorario = true;
        this.centro = new Posicion(0,0);
    }

    //Obtiene posición en coordenadas cartesianas a partir del día indicado 
    getPosicion(dia)
    {
        if (this.sentidoHorario) dia = dia * -1;
        
        this.x = this.centro.x + this.r * Math.cos((this.w * this.C1 * dia) + (this.fi * this.C1));
        this.y = this.centro.y + this.r * Math.sin((this.w * this.C1 * dia) + (this.fi * this.C1));
        
        return new Posicion(this.x,this.y);
    }

}

