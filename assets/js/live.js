require('../css/live.css');

document.addEventListener('DOMContentLoaded', function() {
    let terminaleDiv = document.querySelector('.js-terminale-id');
    let idTerminale = terminaleDiv.dataset.idTerminale;
    let lista = document.getElementById('lista-timbrature');

    const es = new EventSource('http://192.168.10.10:3000/hub?topic=' + encodeURIComponent('http://europass.locale/online/' + idTerminale));
    es.onmessage = e => {
        // Will be called every time an update is published by the server
        let obj = JSON.parse(e.data);
        // console.log(obj);
        let divElement = document.createElement('div');
        divElement.setAttribute('role','alert');
        let direzione = obj.direzione;
        if (direzione === 1) {
            divElement.setAttribute('class', 'alert alert-success');
        } else {
            divElement.setAttribute('class', 'alert alert-danger');
        }
        let orario = new Date(obj.time.date);
        let divTxt = document.createTextNode(obj.codice +' '+ orario.getHours() + ':' + orario.getMinutes());
        divElement.appendChild(divTxt);

        lista.prepend(divElement);

        if (lista.childElementCount > 4) {
            lista.lastChild.remove();
        }
    }
});

