const Posicion = require('./Posicion.js');
const Clima = require('./Clima');
const Reporte = require('./Reporte.js');
const Util = require('./Util.js')

module.exports = class Sistema
{

    constructor(centro, ferengi, betasoide, vulcano) {
        this.p0 = centro;
        this.ferengi = ferengi;
        this.betasoide = betasoide;
        this.vulcano = vulcano;

    }

    predecir(t) {

        var clima = new Clima();

        clima.dia = Number(t);
        
        var siguiente = clima.dia + 1;

        var angFuturo = 0.0;
        var ang = 0.0;

        var p1f = new Posicion(this.ferengi.getPosicion(siguiente).x, this.ferengi.getPosicion(siguiente).y);
        var p2f = new Posicion(this.betasoide.getPosicion(siguiente).x, this.betasoide.getPosicion(siguiente).y);
        var p3f = new Posicion(this.vulcano.getPosicion(siguiente).x, this.vulcano.getPosicion(siguiente).y);

        var p1 = new Posicion(this.ferengi.getPosicion(t).x, this.ferengi.getPosicion(t).y);
        var p2 = new Posicion(this.betasoide.getPosicion(t).x, this.betasoide.getPosicion(t).y);
        var p3 = new Posicion(this.vulcano.getPosicion(t).x, this.vulcano.getPosicion(t).y);
        //calculos area total del triangulo
        var at = this.area(p1, p2, p3);
        //calculo sub areas respecto del sol
        var sa1 = this.area(p1, p2, this.p0);
        var sa2 = this.area(p2, p3, this.p0);
        var sa3 = this.area(p1, p3, this.p0);

        //calculo total sumando subareas
        var sat = sa1 + sa2 + sa3;

        //diferencia entre at y sat, si es menor que cero el sol esta afuera
        var dif = at - sat;


        var peri = this.perimetro(p1, p2, p3);
        
        ////Calculo si los planetas estan alineados
        var pendiente1 = this.pendiente(p1, p2);
        var pendiente2 = this.pendiente(p2, p3);
        var pendiente3 = this.pendiente(this.p0, p2);
        
        angFuturo = this.angulo(p1f, p2f, p3f);
        ang = this.angulo(p1, p2, p3);

        //Asigno cero a intensidad solo le doy valor si Estado es Lluvia
        clima.intensidad = 0;
        //predicción
        if (Math.abs(Util.round(pendiente1, 5)) == Math.abs(Util.round(pendiente2, 5)) && Math.abs(Util.round(pendiente2, 5)) == Math.abs(Util.round(pendiente3, 5)))
        {
            clima.estado = "Sequía";
            clima.estadoCod = "S";
        }
        else if (!Number.isFinite(pendiente1) && !Number.isFinite(pendiente2) && !Number.isFinite(pendiente3) )
        {
            clima.estado = "Sequía";
            clima.estadoCod = "S";
        }
        else if (ang >= 0.0 && angFuturo <= 0.0 || ang <= 0.0 && angFuturo >= 0.0)
        {
            clima.estado = "Alineados, cond opt";
            clima.estadoCod = "O";
        }
        else if (Util.round(dif, 2) == 0)
        {
            clima.estado = "Lluvia"; //calcular el máximo
            clima.intensidad = peri;
            clima.estadoCod = "L";
        }
        else if (dif < 0)
        {
            clima.estado = "Indeterminado";
            clima.estadoCod = "I";
        }
        else
        {
            clima.estado = "Error de pred";
            clima.estadoCod = "E";
        }
        //Solo para log
        //console.log("dia: " + t + " P: " + clima.estadoCod + " Dif: "+Util.round(dif, 2) + " | Peri: " + Util.round(peri, 2) + " | Ang: " + Util.round(ang, 2) + " | Pen3: " +  Util.round(pendiente3, 5) + " | Pen1: " + Util.round(pendiente1, 5) + " | Pen2: " + Util.round(pendiente2, 5));
        

        return clima;
    }

    area(p1, p2, p3)
    {
        var a = ((p1.x * p2.y + p2.x * p3.y + p3.x * p1.y) - (p2.x * p1.y + p3.x * p2.y + p1.x * p3.y)) / 2;
        return Math.abs(a);
    }

    perimetro( p1, p2, p3)
    {

        //distancia p1 a p2
        var d12 = Math.sqrt(Math.pow((p2.x - p1.x), 2) + Math.pow((p2.y - p1.y), 2));
        //distancia p2 a p3
        var d23 = Math.sqrt(Math.pow((p3.x - p2.x), 2) + Math.pow((p3.y - p2.y), 2));
        //distancia p3 a p1
        var d31 = Math.sqrt(Math.pow((p1.x - p3.x), 2) + Math.pow((p1.y - p3.y), 2));

        var p = d12 + d23 + d31;

        return p;
    }
    pendiente(p1, p2)
    {
        var divisor = (p1.x - p2.x);
        return (p1.y - p2.y) / Util.round(divisor, 2);
    }

    angulo(p1, p2, p3)
    {
        ////Calculo si los planetas estan alineados
        var pendiente1 = this.pendiente(p1, p2);
        var pendiente2 = this.pendiente(p2, p3);
        var pendiente3 = this.pendiente(this.p0, p2);
        var angulo = (180.0 / Math.PI) * Math.atan((pendiente1 - pendiente2) / (1 + pendiente1 * pendiente2));
        return angulo;
    }

    ///////////////////////////////// Estadistica /////////////////////////
    //Genera un modelo Reporte con información de los peridos transcurridos
    //y en caso de ser lluvia, indica el dia de mayor intensidad
    // Retorna r que es un reporte con arreglos que indican que dia comienza 
    // el período en cuestión, en el caso de lluvia son dos arreglos
    // uno uindica el dia que comienza el período y el otro el día de mayor 
    // intensidad en ese período.
    ///////////////////////////////////////////////////////////////////////

    prediccionPeriodo(dias = 0) {
        var r = new Reporte();
        var intAnterior = 0;
        var diaLluviaMax = 0;
    
        var intMax=0;
        var  diaMax=0;
        var estadoCodeAnterior = "";
    
        var dia;
        for (dia = 0; dia < dias; dia++){
    
            //prediccion para un día en particular
            var clima = this.predecir(dia);
    
            //si lluvia, track max intensidad
            if (clima.estadoCod == "L")
            {
                if (intAnterior < clima.intensidad)
                {
                    intAnterior = clima.intensidad;
                    diaLluviaMax = clima.dia;
                }
    
                if (intMax < Util.round(clima.intensidad,6))
                {
                    intMax = Util.round(clima.intensidad,6);
                    diaMax = clima.dia;
                }
    
            }
            else
            {
                if (intAnterior != 0)
                {
                    r.lluviaDia.push(diaLluviaMax);
                    r.lluviaInt.push(Util.round(intAnterior, 6));
                    intAnterior = 0;
                }
            }
    
            if (estadoCodeAnterior != clima.estadoCod) {
                estadoCodeAnterior = clima.estadoCod;
                switch (clima.estadoCod)
                {
                    case "S":
                        r.sequia.push(clima.dia);
                        break;
                    case "L":
                        r.lluvia.push(clima.dia);
                        break;
                    case "O":
                        r.optimo.push(clima.dia);
                        break;
                    case "I":
                        r.indeterminado.push(clima.dia);
                        break;
                    case "E":
                        r.error.push(clima.dia);
                        break;
                }
            }
        }
        //respuesta al test de ml
        console.log("In: " + intMax + " M: " + diaMax + " S: " + r.sequia.length + " L: " + r.lluvia.length + " LD: " + r.lluviaDia.length + " O: " + r.optimo.length + " I: " + r.indeterminado.length + " E: " + r.error.length);
        return r;
    }
}