import * as P5 from 'p5';
import * as Matter from 'matter-js';
import Dipendente from '../js/dipendente';

import '../css/presenze.css';

let presenti;
let dipendenti = [];

const sketch = ( p ) => {

    // module aliases
    let Engine = Matter.Engine,
        World = Matter.World,
        Bodies = Matter.Bodies;

    let inEngine, outEngine, inWorld, outWorld;
    let ground, est, ovest;

// create an engine and run
    inEngine = Engine.create();
    outEngine = Engine.create();
    inWorld = inEngine.world;
    outWorld = outEngine.world;
    outWorld.gravity.y = -0.00001;

    Engine.run(inEngine);
    Engine.run(outEngine);

    p.setup = function () {
        let myCanvas = document.getElementById('myCanvas');
        let cnv = p.createCanvas(myCanvas.offsetWidth, myCanvas.offsetHeight);



        ground = Bodies.rectangle(p.width/2, p.height, p.width, 20, { isStatic: true });
        est = Bodies.rectangle(0, p.height/2, 20, p.height*4, { isStatic: true });
        ovest = Bodies.rectangle(p.width, p.height/2, 20, p.height*4, { isStatic: true });
        World.add(inWorld, [ground,est,ovest]);

        for (let j = 0; j < 1; j++) { //per simulare + utenti
            for (let i = 0; i < presenti.length; i++) {
                const tag = presenti[i];
                let codice = tag.codice;
                let terminale = tag.terminale;
                let orario = new Date(tag.timestamp).toLocaleTimeString('it', {
                    hour: '2-digit',
                    minute: '2-digit'
                });
                // console.log(codice, orario, terminale);
                let dipendente = new Dipendente(p, codice, orario, terminale);
                dipendenti.push(dipendente);
                World.add(inWorld, dipendente.body);
            }
        }
    };

    p.draw = function () {
        p.background(34,34,34);
        p.fill(255);
        p.textAlign(p.CENTER);
        p.text('PRESENTI  ' + dipendenti.length, p.width/2, p.height/3);

        for (let i = 0; i < dipendenti.length; i++) {
            const dip = dipendenti[i];
            if (dip.inUscita) {
                Matter.Composite.move(inWorld, dip.body, outWorld);
            }
            dip.show();
            if (dip.body.position.y < -200) {
                dipendenti.splice(i,1);
                Matter.Composite.remove(outWorld, dip.body);
                Matter.Composite.remove(inWorld, dip.body);
                i --;
            }
        }
    };

    p.mousePressed = function() {
        if (p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height){
            let position = {x: p.mouseX, y: p.mouseY};
            let scale = 0.1;
            let force = {x: 0* scale , y: -1* scale};
            for (let i = 0; i < dipendenti.length; i ++) {
                Matter.Body.applyForce(dipendenti[i].body, position, force);
            }
        }

    };

    p.newEntry = function (codice, orario, terminale, direzione) {
        for (let i = 0; i < dipendenti.length; i++) {
            let obj = dipendenti[i];
            if (obj.codice == codice) {
                dipendenti.splice(i,1);
                Matter.Composite.remove(inWorld, obj.body);
                i --;
            }
        }

        let dipendente = new Dipendente(p, codice, orario, terminale, direzione);
        dipendenti.push(dipendente );
        World.add(inWorld, dipendente.body);
    };

    p.exit = function (codice, orario) {
        for (let i = 0; i < dipendenti.length; i++) {
            let obj = dipendenti[i];
            if (obj.codice == codice) {
                obj.setUscita();
                obj.setOrario(orario);
            }
        }
    }
};


document.addEventListener('DOMContentLoaded', (event) => {
    let terminals = [1,2,3];
    let ess = [];

    presenti = JSON.parse(document.querySelector('.js-presenti').dataset.presenti);
    // console.log(presenti);

    for (const terminale of terminals) {
        // URL is a built-in JavaScript class to manipulate URLs

        let u = new URL('http://192.168.10.10:3000/.well-known/mercure');
        u.searchParams.append('topic', 'http://europass.locale/online/' + terminale);
        // Subscribe to updates of several Book resources
        // console.log(u);

        ess.push(new EventSource(u.href));
    }

    for (const es of ess) {
        es.onmessage = e => {
            // Will be called every time an update is published by the server
            let obj = JSON.parse(e.data);
            // console.log(e.data, obj);
            let orario = new Date(obj.time.date).toLocaleTimeString('it', {
                hour: '2-digit',
                minute: '2-digit'
            });
            let direzione = obj.direzione;
            let codice = obj.codice;
            let terminale = obj.terminale;

            if (direzione == 1) { //uscita
                myp5.exit(codice, orario);
            } else {
                myp5.newEntry(codice, orario, terminale, direzione);
            }
        }
    }

    let myp5 = new P5(sketch,'myCanvas');
});