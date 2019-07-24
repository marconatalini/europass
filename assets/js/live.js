require('../css/live.css');

document.addEventListener('DOMContentLoaded', function() {
    let terminaleDiv = document.querySelector('.js-terminale-id');
    let idTerminale = terminaleDiv.dataset.idTerminale;
    let lista = document.getElementById('lista-timbrature');

    const es = new EventSource('http://192.168.10.10:3000/hub?topic=' + encodeURIComponent('http://europass.locale/online/' + idTerminale));
    es.onmessage = e => {
        // Will be called every time an update is published by the server
        let obj = JSON.parse(e.data);
        console.log(obj);
        let liElement = document.createElement('li');
        let liTxt = document.createTextNode(obj.codice +' -> '+ obj.time.getHours() +' '+ obj.direzione );
        liElement.appendChild(liTxt);

        lista.prepend(liElement);
    }
});

