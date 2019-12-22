// module aliases
let Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies;

let inEngine, outEngine, inWorld, outWorld;
let ground, est, ovest;
let dipendenti = [];
let presenti;
let shake = false;

document.addEventListener('DOMContentLoaded', function() {

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
                uscita(codice, orario);
            } else {
                entrata(codice, orario, terminale, direzione);
            }
        }
    }
});

function entrata(codice, orario, terminale, direzione) {
    for (let i = 0; i < dipendenti.length; i++) {
        let obj = dipendenti[i];
        if (obj.codice == codice) {
            dipendenti.splice(i,1);
            Matter.Composite.remove(inWorld, obj.body);
            i --;
        }
    }

    let tag = new Dipendente(codice, orario, terminale, direzione);
    dipendenti.push(tag);
}

function uscita(codice, orario) {
    for (let i = 0; i < dipendenti.length; i++) {
        let obj = dipendenti[i];
        if (obj.codice == codice) {
            obj.setUscita();
            obj.setOrario(orario);
        }
    }
}


function setup() {
    let skecth = document.getElementById('myCanvas');
    let myCanvas = createCanvas(skecth.offsetWidth, skecth.offsetHeight);
    myCanvas.parent(skecth);

    // create an engine and run
    inEngine = Engine.create();
    outEngine = Engine.create();
    inWorld = inEngine.world;
    outWorld = outEngine.world;
    outWorld.gravity.y = -0.00001;

    Engine.run(inEngine);
    Engine.run(outEngine);

    ground = Bodies.rectangle(width/2, height, width, 20, { isStatic: true });
    est = Bodies.rectangle(0, height/2, 20, height*4, { isStatic: true });
    ovest = Bodies.rectangle(width, height/2, 20, height*4, { isStatic: true });
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
            dipendenti.push(new Dipendente(codice, orario, terminale));
        }
    }

}

function draw() {
    background(34,34,34);
    fill(255);
    textAlign(RIGHT);
    text(dipendenti.length, width, 10);

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
}

function mousePressed() {
    if (mouseX < width && mouseY > 0 && mouseY < height){
        shake = true;
        let position = {x: mouseX, y: mouseY};
        let scale = 0.1;
        let force = {x: 0* scale , y: -1* scale};
        for (let i = 0; i < dipendenti.length; i ++) {
            Matter.Body.applyForce(dipendenti[i].body, position, force);
        }
    }

}