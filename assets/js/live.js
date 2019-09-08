require('../css/live.css');

document.addEventListener('DOMContentLoaded', function() {
    let terminaleDiv = document.querySelector('.js-terminale-id');
    let idTerminale = terminaleDiv.dataset.idTerminale;
    let lista = document.getElementById('lista-timbrature');

    // const es = new EventSource('http://192.168.10.10:3000/hub?topic=' + encodeURIComponent('http://europass.locale/online/' + idTerminale));

    // URL is a built-in JavaScript class to manipulate URLs
    const u = new URL('http://192.168.10.10:3000/hub');
    u.searchParams.append('topic', 'http://europass.locale/online/' + idTerminale);
    // Subscribe to updates of several Book resources

    console.log(u);

    const es = new EventSource(u.href);

    es.onmessage = e => {
        // Will be called every time an update is published by the server
        let obj = JSON.parse(e.data);
        // console.log(obj);
        let divElement = document.createElement('div');
        // divElement.setAttribute('role','alert');
        let direzione = obj.direzione;
        if (direzione === 0) { //ENTRATA
            // divElement.setAttribute('class', 'alert alert-success text-right');
            divElement.setAttribute('class', 'tag entry text-right');
        } else { //USCITA
            // divElement.setAttribute('class', 'alert alert-danger');
            divElement.setAttribute('class', 'tag exit');
        }
        let orario = new Date(obj.time.date);
        let divTxt = document.createTextNode(obj.codice +' ore: '+ orario.getHours() + ':' + orario.getMinutes());
        divElement.appendChild(divTxt);

        lista.prepend(divElement);

        if (lista.childElementCount > 6) {
            lista.lastChild.remove();
        }
    }
});

