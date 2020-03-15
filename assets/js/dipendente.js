import * as Matter from 'matter-js';

export default class Dipendente{
    constructor(sketch, codice, orario, terminale=1, direzione=0, r = 50){
        this.sketch = sketch;
        this.codice = codice;
        this.orario = orario;
        this.r = r;
        this.direzione = direzione;
        this.terminale = terminale;
        this.body = this.setBody(terminale);
        this.colore = [0,128,0];
        this.inUscita = false;
    }

    setBody(){
        if (this.terminale == 3) {
            return Matter.Bodies.rectangle(this.sketch.random(this.r, this.sketch.width-this.r),0, this.r*2, this.r*1.5 );
        } else {
            return Matter.Bodies.polygon(this.sketch.random(this.r, this.sketch.width-this.r),0,6,this.r);
        }
    }

    setOrario(orario){
        this.orario = orario;
    }

    setUscita(){
        this.inUscita = true;
        this.setColore(1);
        Matter.Body.setAngle(this.body, 0);
    }

    setColore(direzione){
        if (direzione == 1) {
            //USCITA
            this.colore = [255,0,0];
        } else {
            //0 = ENTRATA
            this.colore = [0,128,0];
        }
    }

    show(){
        let pos = this.body.position;
        let angle = this.body.angle;

        this.sketch.push();
        this.sketch.translate(pos.x, pos.y);
        this.sketch.rotate(angle);
        this.sketch.stroke(this.colore);
        this.sketch.strokeWeight(3);
        this.sketch.noFill();

        if (this.terminale == 3) {
            this.sketch.rectMode(this.sketch.CENTER);
            this.sketch.rect(0,0,this.r*2, this.r*1.5);
        } else {
            this.sketch.ellipse(0,0,this.r*2);
        }

        this.sketch.fill(255);
        this.sketch.noStroke();
        this.sketch.textAlign(this.sketch.CENTER, this.sketch.CENTER);
        this.sketch.textSize(this.r/2);
        this.sketch.text(this.codice , 0, 0);
        this.sketch.textSize(this.r/4);
        this.sketch.text(this.orario, 0, this.sketch.textSize()*1.5);
        this.sketch.pop();
    }
}