class Dipendente{
    constructor(codice, orario, terminale=1, direzione=0, r = 50){
        this.codice = codice;
        this.orario = orario;
        this.r = r;
        this.direzione = direzione;
        this.terminale = terminale;
        this.body = this.setBody(terminale);
        this.colore = [0,128,0];
        this.inUscita = false;
        World.add(inWorld, this.body);
    }

    setBody(){
        if (this.terminale == 3) {
            return Bodies.rectangle(random(this.r, width-this.r),0, this.r*2, this.r*1.5 );
        } else {
            return Bodies.polygon(random(this.r, width-this.r),0,6,this.r);
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

        push();
        translate(pos.x, pos.y);
        rotate(angle);
        stroke(this.colore);
        strokeWeight(3);
        noFill();

        if (this.terminale == 3) {
            rectMode(CENTER);
            rect(0,0,this.r*2, this.r*1.5);
        } else {
            ellipse(0,0,this.r*2);
        }

        fill(255);
        noStroke();
        textAlign(CENTER, CENTER);
        textSize(this.r/2);
        text(this.codice , 0, 0);
        textSize(this.r/4);
        text(this.orario, 0, textSize()*1.5);
        pop();
    }
}