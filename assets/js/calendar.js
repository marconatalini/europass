import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';

// import timeGridPlugin from '@fullcalendar/timegrid';
// import interactionPlugin from '@fullcalendar/interaction';
// import bootstrapPlugin from '@fullcalendar/bootstrap';

// import moment from "moment";

document.addEventListener('DOMContentLoaded', function() {
    let calendarEl = document.getElementById('calendar');

    let urlJson = document.getElementById('urlTimbratureJson');

    let calendar = new Calendar(calendarEl, {
        locale: 'it',
        timeZone: 'Europe/Rome',
        // contentHeight: 'auto',
        plugins: [ dayGridPlugin ],
        defaultView: 'dayGridMonth',

        eventSources: [
            {
                // url: 'http://tennis.locale/prenotazione/json',
                url: urlJson.getAttribute('href'),
                method: 'GET',
            },
        ],

        eventColor: '#e6e6e6',
        height: 'parent',
    });

    calendar.render();
    // calendar.updateSize();
});

require('../css/calendar.css');