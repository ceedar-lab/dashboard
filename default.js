/**
 * Initiation des variables globales
 */

// Variables de personnalisation du dashboard
let widget_number = 3 // le nombre de widget au chargement du dashboard
let openweathermap_key = 'your API key'
let radio_url = [
    'https://start-latina.ice.infomaniak.ch/start-latina-high.mp3',
    'https://latinafiesta.ice.infomaniak.ch/latinafiesta.mp3',
    'https://latinareggaeton.ice.infomaniak.ch/latinareggaeton.mp3',
    'https://latinabachata.ice.infomaniak.ch/latinasalsa.mp3',
    'https://latinawork.ice.infomaniak.ch/latinawork.mp3' ]

let menu = false // etat d'affichage du menu de sélection des widgets
// Stockage chronomètre
let chrono_on = []
let chrono_secondes_count = []
let chrono_minutes_count = []
// Stockage calculator
let calculator_screen_history = []
let calculator_screen_result = []
let current_operation = []
// Stockage infos widget
let widget_is_used = []
let widget_is = []
// Stockage meteo
let min_plus
let res
let chosen_city = []
let active = []
let city_active = []
// Stockage date
let now = [] // heure, minute, jour, numero_jour, mois
let day = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
let month = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'aout', 'septembre', 'octobre', 'novembre', 'décembre']
// Stockage radio
let radio_on = false
let audio

/**
 * Affiche le nombre de widgets demandés par l'utilisateur
 */

// choix du nombre de widgets (entre 0 et 20)
let widget_number_choice = document.getElementById('widget_number') // input text => choix du nombre de widgets

widget_number_choice.addEventListener('change', () => {
    error.remove()
    if (widget_number_choice.value <= 20) createWidget(widget_number_choice.value)
    else widget_number_choice.insertAdjacentElement("afterend", error)
})
// message en cas de mauvaise saisie
let error = document.createElement('p')
error.innerHTML = '* Nombre invalide !'
error.classList.add('error_message')

// Création des widgets
function createWidget(number) {
    widget_number = number
    widget_number_choice.value = "" // réinitialise le champs de texte
    document.getElementById('widget__container').firstElementChild.remove()
    let widget = document.createElement('section')
    if (number == 0) {
        document.getElementById('widget__container').insertAdjacentElement('afterbegin', widget)
        return
    } else {
        for (let i = 0; i < number; i++) {
            let html = `<div id="widget_${i}" class="widget">
                            <header class="widget__header">
                                <span class="-hide"><i class="fas fa-cog"></i></span>
                                <span class="-hide"><i class="fas fa-expand-alt"></i></span>
                                <span class="-hide"><i class="fas fa-compress-alt"></i></span>
                            </header>
                            <div class="widget__content">
                                <div class="widget__content_select -hide">
                                    <select id="widget_list_${i}">
                                        <option value="calculator">Calculatrice</options>
                                        <option value="chronometre">Chronomètre</options>
                                        <option value="meteo">Méteo</options>
                                        <option value="radio">Radio</options>
                                    </select>
                                    <button id="widget_list_button_${i}">Valider</button>
                                </div>
                                <div id="calculator_${i}" class="widget__content_calculator -hide">
                                    <div id="calculator__screen">
                                        <p id="calculator__screen_history_${i}"></p>
                                        <h3 id="calculator__screen_result_${i}">0</h3>
                                    </div>
                                    <div>
                                        <div>
                                            <button id="calculator_1_${i}" value="1">1</button>
                                            <button id="calculator_2_${i}" value="2">2</button>
                                            <button id="calculator_3_${i}" value="3">3</button>
                                            <button id="calculator_4_${i}" value="4">4</button>
                                            <button id="calculator_5_${i}" value="5">5</button>
                                            <button id="calculator_6_${i}" value="6">6</button>
                                            <button id="calculator_7_${i}" value="7">7</button>
                                            <button id="calculator_8_${i}" value="8">8</button>
                                            <button id="calculator_9_${i}" value="9">9</button>
                                            <button id="calculator_10_${i}" value="0">0</button>
                                            <button id="calculator_11_${i}" value=".">.</button>
                                            <button id="calculator_12_${i}" value="d">DEL</button>
                                        </div>
                                        <div>
                                            <button id="calculator_13_${i}" value="+">+</button>
                                            <button id="calculator_14_${i}" value="-">-</button>
                                            <button id="calculator_15_${i}" value="*">*</button>
                                            <button id="calculator_16_${i}" value="/">/</button>
                                            <button id="calculator_17_${i}" value="=">=</button>
                                        </div>
                                    </div>
                                </div>
                                <div id="chronometre_${i}" class="widget__content_chronometre -hide">                                    
                                    <img src="images/img-clock.png" alt="">
                                    <img id="button_left_${i}" class="button -left" src="images/img-clock-button_left.png" alt="">
                                    <img id="button_right_${i}" class="button -right" src="images/img-clock-button_right.png" alt="">
                                    <img id="button_up_${i}" class="button -up" src="images/img-clock-button_up.png" alt="">
                                    <img id="needle_small_${i}"  class="needle -small" src="images/img-clock-needle_small.png" alt="">
                                    <img id="needle_big_${i}" class="needle -big" src="images/img-clock-needle_big.png" alt="">
                                </div>
                                <div id="meteo_${i}" class="widget__content_meteo -hide">
                                    <div>
                                        <h2 id="meteo_country_${i}"></h2>
                                        <p id="meteo_hour_${i}"></p>
                                        <p id="meteo_date_${i}"></p>
                                        <p id="meteo_weather_${i}"></p>
                                    </div>
                                    <div>
                                        <i class="fas fa-map-marker-alt"></i>
                                        <input type="text" id="meteo_input_${i}" class="hide" placeholder="Choisissez une ville">
                                    </div>
                                </div>
                                <div id="radio_${i}" class="widget__content_radio -hide">
                                    <img src="images/img-radio.png">
                                    <img id="radio_play_${i}" src="images/img-radio-play.png">
                                    <img id="radio_stop_${i}" src="images/img-radio-stop.png">
                                    <img id="radio_baffle_left_${i}" src="images/img-radio-baffle_left.png">
                                    <img id="radio_baffle_right_${i}" src="images/img-radio-baffle_right.png">
                                    <input id="radio_input_${i}" type="range" min="1" max="5" value="1">
                                </div>
                            </div>
                        </div>`                        
            widget.insertAdjacentHTML('beforeend', html)
        }
        document.getElementById('widget__container').insertAdjacentElement('afterbegin', widget)
        document.getElementById('widget_per_row').value = '3'
        resizeWidgetInit()
        expandWidgetInit()
        showIconInit(0, true)
        showIconInit(1, true)
        showIconInit(2, false)
        showWidgetSelectMenuInit()
        widgetSelectorInit()
        chronometer()
        calculator()
        meteo()        
        music_player()
        changeStation()
    }
}

// Affiche les widgets lors du premier chargement de la page
createWidget(widget_number)

/**
 * Disposition des widgets
 */

// Redimensionne les widgets en fonction du choix de l'utilisateur
function resizeWidgetInit() {
    document.getElementById('widget_per_row').addEventListener('change', () => {
        widget_per_row = parseInt(document.getElementById('widget_per_row').value)
        if (widget_per_row <= 2) showIconInit(1, false) // évite un bug d'affichage
        else showIconInit(1, true)
        resizeWidgetContent(widget_per_row)
        for (let i = 0; i < widget_number; i++) {
            document.getElementById(`widget_${i}`).style.width = `calc(100vw / ${(widget_per_row + 0.5)})`
            document.getElementById(`widget_${i}`).style.height = `calc(3/4 * (100vw / ${(widget_per_row + 0.5)}))`
        }
    })
}

// Adapte toutes les tailles exprimées en rem 
function resizeWidgetContent(widgets_per_row) {
    let html = document.firstElementChild
    switch (widgets_per_row) {
        case 1: html.style.fontSize = "170%"; break;
        case 2: html.style.fontSize = "105%"; break;
        case 3: html.style.fontSize = "75%"; break;
        case 4: html.style.fontSize = "62.5%"; break;
        default: html.style.fontSize = "52%";
    }
}

// Redimension des widgets quand on change la taille de la fenêtre
window.addEventListener('resize', () => {
    let window_width = window.innerWidth
    // Supprime le logo <CDEV CAMP/> et le label 'Configuration' quand la fenêtre est réduite
    if (window_width <= 350) document.body.firstElementChild.firstElementChild.innerHTML = '<h1>Dashboard</h1>'
    else document.body.firstElementChild.firstElementChild.innerHTML = '<img id="dashboard_logo" src="images/logo-cdev_camp-green.png" alt="logo"><h1>Dashboard</h1>'
    if (window_width <= 510) document.querySelector('#dashboard_config + label').innerHTML = '<i class="fas fa-chevron-circle-down"></i>';
    else document.querySelector('#dashboard_config + label').innerHTML = 'Configuration&nbsp;&nbsp;<i class="fas fa-chevron-circle-down"></i>';
    // Redimensionne la police des widgets calculatrice et meteo
    for (let i = 0; i < widget_number; i++) {
        document.getElementById(`meteo_${i}`).style.fontSize = `calc(${window_width}em/1500)`
        document.getElementById(`calculator_${i}`).style.fontSize = `calc(${window_width}em/1500)`
    }
})

/**
 * Fonction de zoom du widget
 */

// Zoom le widget lorsque on appuie sur la flèche
function expandWidgetInit() {
    for (let i = 0; i < widget_number; i++) {
        document.querySelector(`#widget_${i} .fa-expand-alt`).addEventListener('click', () => resizeWidget(i, 2, true)) 
        document.querySelector(`#widget_${i} .fa-compress-alt`).addEventListener('click', () => resizeWidget(i, 1, false)) 
    }
}

// Mise en forme du widget 'zoomé'
function resizeWidget(i, scale, boolean) {
    let widget = document.getElementById(`widget_${i}`)
    if (boolean) {
        widget.style.position = 'absolute'
        widget.style.top = '19rem'
        widget.style.zIndex = '4' 
        widget.style.boxShadow = 'none'
        showIconInit(0, false)
        showIconInit(1, false)
        showIconInit(2, true)
    } else {
        widget.style.position = 'relative'
        widget.style.top = '0'
        widget.style.zIndex = '1' 
        widget.style.boxShadow = '0 0 0.5rem 0.1rem var(--widget-border)'
        showIconInit(0, true)
        showIconInit(1, true)
        showIconInit(2, false)
    }    
    widget.style.transform = `scale(${scale})`
}

/**
 * Montre ou cache les icones du widget
 */

// Rend visible ou non la cog et flèches de zoom et dézoom au survol de l'élement 
function showIconInit(icon_number, visible) {
    for (let i = 0; i < widget_number; i++) {
        if (visible) {
            document.getElementById(`widget_${i}`).addEventListener('mouseover', () => showIcon(i, icon_number, true))
            document.getElementById(`widget_${i}`).addEventListener('mouseout', () => showIcon(i, icon_number, false))
        } else {
            document.getElementById(`widget_${i}`).addEventListener('mouseover', () => showIcon(i, icon_number, false))
        }
    }
}

// Affiche ou cache l'icone choisi
function showIcon(i, icon_number, visible) {
    if (visible) document.querySelectorAll(`#widget_${i} span`)[icon_number].classList.remove('-hide')
    else document.querySelectorAll(`#widget_${i} span`)[icon_number].classList.add('-hide')
}


/**
 * Changement du thème du dashboard
 */

// Change la couleur du logo CDEV CAMP
function changeLogo (color) {
    let dash_logo = document.getElementById('dashboard_logo')
    dash_logo.src = dash_logo.removeAttribute('src'); 
    dash_logo.setAttribute('src', `images/logo-cdev_camp-${color}.png`)
}

// Ajoute la stylesheet css au head
document.getElementById('theme').addEventListener('change', () => {
    document.head.firstElementChild.remove()    
    let linkElement = document.createElement('link');
    linkElement.setAttribute('rel', 'stylesheet');
    switch (document.getElementById('theme').value) {
        case 'blue': linkElement.setAttribute('href', 'css/theme-dark_blue.css');
            changeLogo('blue'); break;
        case 'red': linkElement.setAttribute('href', 'css/theme-dark_red.css');
            changeLogo('red'); break;
        default: linkElement.setAttribute('href', 'css/theme-default.css');
            changeLogo('green');
    }
    document.head.insertAdjacentElement('afterbegin', linkElement)
})

/**
 * Apparition du menu de selection des widgets
 */

// Permet d'afficher le menu de selection du widget lorsqu'on survole sur la cog, ou le cache
function showWidgetSelectMenuInit() {
    for (let i = 0; i < widget_number; i++) {
        document.querySelector(`#widget_${i} .fa-cog`).addEventListener('click', () => {
            if (menu) showWidgetSelectMenu(i, false)
            else showWidgetSelectMenu(i, true)
        })
        document.getElementById('widget_' +i).addEventListener('mouseleave', () => showWidgetSelectMenu(i, false))
    }
}

// Change la propriété du menu select
function showWidgetSelectMenu(number, visible) {
    let widget_select = document.getElementsByClassName('widget__content_select')[number]
    if (visible) {
        widget_select.classList.remove("-hide")
        menu = true
    } else {
        widget_select.classList.add("-hide")
        menu = false
    }
}


/**
 * Paramètre du menu de selection des widgets
 */

// Fait apparaitre le widget demandé lorsqu'on clic sur valider
function widgetSelectorInit() {
    for (let i = 0; i < widget_number; i++) {
        document.getElementById(`widget_list_button_${i}`).addEventListener('click', () => {
            let widget_value = document.getElementById(`widget_list_${i}`).value
            showWidget(i, widget_value)
            document.querySelector(`#widget_${i} .fa-cog`).addEventListener('click', () => {
                if (widget_is_used[i]) removeWidget(i, widget_is[i])
            })
        })
    }
}

// Affiche le widget
function showWidget(i, name) {
    document.getElementById(`${name}_${i}`).classList.remove('-hide')
    document.getElementsByClassName('widget__content_select')[i].classList.add('-hide')
    widget_is_used[i] = true
    widget_is[i] = name    
}

// Cache le widget
function removeWidget(i, name) {
    document.getElementById(`${name}_${i}`).classList.add('-hide')
}



/**
 * Widget chronomètre
 */

// Initialisation du chronomètre 
function chronometer() {
    for (let i = 0; i < widget_number; i++) {
        let start_timer // Variable de la fonction setInterval
        let button_left = document.getElementById('button_left_' +i)
        let button_right = document.getElementById('button_right_' +i)
        let button_up = document.getElementById('button_up_' +i)
        chrono_on[i] = false // Etat du chronomètre
        chrono_secondes_count[i] = 0
        chrono_minutes_count[i] = 0
        
        // Démarrage du chronomètre
        button_right.addEventListener('click', () => { 
            click(button_right, 'button_right')
            if (chrono_on[i] == false) {
                chrono_on[i] = true
                start_timer = setInterval(() => {
                    chrono_secondes_count[i]++;
                    secondeRotation(i)
                    minutesIteration(i)
                    minuteRotation(i)
                }, 1000)
            }
        })

        // Arret du chronomètre
        button_left.addEventListener('click', () => {
            click(button_left, 'button_left')
            chrono_on[i] = false
            clearInterval(start_timer)
        })

        // Remise à zéro du chronomètre
        button_up.addEventListener('click', () => {
            click(button_up, 'button_up')
            chrono_secondes_count[i] = 0
            chrono_minutes_count[i] = 0
            secondeRotation(i)
            minuteRotation(i)
        })
    }
}

// Fonction de rotation des aiguilles
function secondeRotation(i) {
    let needle_big = document.getElementById(`needle_big_${i}`)
    needle_big.style.transform = `rotate(${chrono_secondes_count[i]*6}deg)`
}
function minuteRotation(i) {
    let needle_small = document.getElementById(`needle_small_${i}`)
    needle_small.style.transform = `rotate(${chrono_minutes_count[i]*12}deg)`
}
function minutesIteration(i) {
    let modulo = chrono_secondes_count[i] % 60
    if (modulo == 0) chrono_minutes_count[i]++
}

// Effet de clic des boutons
function click(element, name) {
    element.removeAttribute('src')
    element.setAttribute('src', `images/img-clock-${name}-press.png`)
    setTimeout( () => {        
        element.removeAttribute('src')
        element.setAttribute('src', `images/img-clock-${name}.png`)
    }, 100)
}

/**
 * Widget calculatrice
 */

// Initialisation de la calculatrice
function calculator() {
    for (let i = 0; i < widget_number; i++) {
        current_operation[i] = '0'
        for (let y = 1; y <= 17; y++) {
            let calculator_button = document.getElementById(`calculator_${y}_${i}`)
            calculator_button.addEventListener('click', function(event) {
                let cible = event.target ? event.target : event.srcElement
                parseOperation(i, y, cible.value)
            })
        }
    }
}

// Effectue l'opération
function parseOperation(i, button, value) {
    if (button == 10) {
        if (current_operation[i] != 0) {
            current_operation[i] += parseInt(value)
            writeResultOnScreen(current_operation[i], i)
        } 
    }
    else if (button < 10 && current_operation[i] == 0) {
        current_operation[i] = ''
        current_operation[i] += parseInt(value)
        writeResultOnScreen(current_operation[i], i)
    } else if (button < 10) {
        current_operation[i] += parseInt(value)
        writeResultOnScreen(current_operation[i], i)
    } else if (button == 11 || (button >= 13 && button != 17)) {
        current_operation[i] += value
        writeResultOnScreen(current_operation[i], i)
    } else if (button == 17) {
        let result = eval(current_operation[i])
        if (eval) {
            writeResultOnHistory(`${current_operation[i]} = ${result}`, i)
            writeResultOnScreen((Math.round(result*1000000)/1000000), i)
            current_operation[i] = result
        } else {
            writeResultOnScreen('INVALIDE', i)
        }    
    } else if (button == 12) {
        current_operation[i] = ''
        writeResultOnHistory('', i)
        writeResultOnScreen('0', i)
    }
}

// Ecrit le résultat sur l'écran de la calculatrice
function writeResultOnScreen(operation, i) {
    document.getElementById(`calculator__screen_result_${i}`).innerHTML = operation
}

// Ecrit le résultat dans l'historique de la calculatrice
function writeResultOnHistory(operation, i) {
    document.getElementById(`calculator__screen_history_${i}`).innerHTML = operation
}

/**
 * Widget méteo
 */

// Initialisation du widget méteo
function meteo() {
    for (let i = 0; i < widget_number; i++) {
        document.getElementById(`meteo_input_${i}`).addEventListener('change', () => {
            chosen_city[i] = document.getElementById(`meteo_input_${i}`).value.toLowerCase()
            getWeather(chosen_city[i], i)
        })
    }
}

// Connexion à l'API de https://openweathermap.org/
function getWeather(city, i) {    
    let xhr = new XMLHttpRequest
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${openweathermap_key}`
    xhr.open('GET', url)
    xhr.send()
    xhr.onload = () => {
        if (xhr.status == 200 && xhr.status == 200) writeMeteo(i, xhr.response)
        else writeMeteo(i, 'Ville introuvable')
    }
}

// Indique les conditions méteo en français
function parseWeather(weather, desc) {
    if (weather == 'Clear') return 'Beau temps'
    else if (weather == 'Clouds' && desc == 'few clouds' || desc == 'scattered clouds') return 'Quelques nuages'
    else if (weather == 'Clouds') return 'Nuageux'
    else if (weather == 'Drizzle') return 'Pluie'
    else if (weather == 'Rain') return 'Pluie'
    else if (weather == 'Snow') return 'Chuttes de neige'
    else if (weather == 'Thunderstorm') return 'Orages'
    else return 'Brouillard'    
}

// Indique l'heure locale pour la ville choisie
function parseTime(i) {
    let h
    switch (i) {
        case -39600: h = now[0] - 11; break;
        case -34200: h = now[0] - 9; break;
        case -36000: h = now[0] - 10; break;
        case -32400: h = now[0] - 9; break;
        case -28800: h = now[0] - 8; break;
        case -25200: h = now[0] - 7; break;
        case -21600: h = now[0] - 6; break;
        case -18000: h = now[0] - 5; break;
        case -14400: h = now[0] - 4; break;
        case -10800: h = now[0] - 3; break;
        case -9000: h = now[0] - 2; break;
        case -7200: h = now[0] - 2; break;
        case -3600: h = now[0] - 1; break;
        case 0: h = now[0] - 0; break;
        case 3600: h = now[0] + 1; break;
        case 7200: h = now[0] + 2; break;
        case 10800: h = now[0] + 3; break;
        case 14400: h = now[0] + 4; break;
        case 16200: h = now[0] + 4; break;
        case 18000: h = now[0] + 5; break;
        case 19800: h = now[0] + 5; break;
        case 20700: h = now[0] + 6; break;
        case 21600: h = now[0] + 6; break;
        case 23400: h = now[0] + 7; break;
        case 25200: h = now[0] + 7; break;
        case 28800: h = now[0] + 8; break;
        case 31500: h = now[0] + 8; break;
        case 32400: h = now[0] + 9; break;
        case 34200: h = now[0] + 9; break;
        case 36000: h = now[0] + 10; break;
        case 37800: h = now[0] + 10; break;
        case 39600: h = now[0] + 11; break;
        case 43200: h = now[0] + 12; break;
        case 45900: h = now[0] + 13; break;
        case 46800: h = now[0] + 13; break;
        case 50400: h = now[0] + 14; break;
        default: h = now[0] = date.getHours();
    }
    if (h < 10) return `0${h}`
    else if (h >= 24) return `0${h - 24}`
    else return h
}

// Ecrit les paramètres du widget
function writeMeteo(i, response) {
    if (response != 'Ville introuvable') {        
        res = JSON.parse(response)
        active[i] = true // un array qui indique quel widget méteo est actif (sert à la fonction update)
        city_active[i] = res.name; // un array qui indique la ville dans le widget actif (sert à la fonction update)
        (() => { // l'heure à m+1. Permet de lancer le update lorsque l'horloge avance d'une minute
            min_plus = parseInt(now[1]) + 1
            if (min_plus == 60) return min_plus = 0
            else return min_plus
        })()
        document.getElementById(`meteo_country_${i}`).innerHTML = `${res.name} - ${res.sys.country}`
        document.getElementById(`meteo_hour_${i}`).innerHTML = `${parseTime(res.timezone)}:${now[1]}`
        document.getElementById(`meteo_date_${i}`).innerHTML = `${now[2]} ${now[3]} ${now[4]}`
        document.getElementById(`meteo_weather_${i}`).innerHTML = `${Math.round((res.main.temp-273.15)*10)/10}°C - ${parseWeather(res.weather[0].main, res.weather[0].description)}`
        if (res.weather[0].main == 'Clouds' && (res.weather[0].description == 'few clouds' || res.weather[0].description == 'scattered clouds')) {
            document.getElementById(`meteo_${i}`).style.backgroundImage = `url("images/meteo-few_clouds.gif")`
        } else document.getElementById(`meteo_${i}`).style.backgroundImage = `url("images/meteo-${res.weather[0].main.toLowerCase()}.gif")`
    }
}

// Met à jour les paramètres chaque minutes
(function update() {
    setInterval( () => {
        if (min_plus == parseInt(now[1])) {
            for (let i = 0; i < widget_number; i++) {
                if (active[i]) getWeather(city_active[i], i)
            }
        }
    }, 1000)
})()

// Récupération et mise à jour de l'heure système toutes les secondes
setInterval( () => {
    let date = new Date()
    now[0] = date.getUTCHours()
    now[1] = (date.getMinutes() < 10) ? `0${date.getMinutes()}` : date.getMinutes()
    now[2] = day[date.getDay()]        
    now[3] = date.getDate()
    now[4] = month[date.getMonth()]
}, 1000)

/**
 * Widget radio
 */

// Initialisation du widget radio
function music_player() {
    for (let i = 0; i < widget_number; i++) {    
        document.getElementById(`radio_play_${i}`).addEventListener('click', () => { if (!radio_on) playStation(i) })       
        document.getElementById(`radio_stop_${i}`).addEventListener('click', () => { if (radio_on) stopStation(i) })
    }
}

// Allume la radio
function playStation(i) {    
    radio_on = true
    let url
    let station_id = document.getElementById(`radio_input_${i}`).value
    switch (parseInt(station_id)) {
        case 1: url = radio_url[0]; break;
        case 2: url = radio_url[1]; break;
        case 3: url = radio_url[2]; break;
        case 4: url = radio_url[3]; break;
        default: url = radio_url[4];
    }
    audio = new Audio(url)
    audio.play()
    setTimeout(() => { document.getElementById(`radio_baffle_left_${i}`).classList.add('-shake') }, 1000)
    setTimeout(() => { document.getElementById(`radio_baffle_right_${i}`).classList.add('-shake') }, 1000)
}

// Arrête la radio
function stopStation(i) {
    radio_on = false  
    audio.pause()
    document.getElementById(`radio_baffle_left_${i}`).classList.remove('-shake')
    document.getElementById(`radio_baffle_right_${i}`).classList.remove('-shake')
}

// Change de station quand on deplace le curseur range
function changeStation() {
    for (let i = 0; i < widget_number; i++) {
        document.getElementById(`radio_input_${i}`).addEventListener('change', () => {
            if (radio_on) {
                stopStation(i)
                playStation(i)
            }
        })
    }
}
