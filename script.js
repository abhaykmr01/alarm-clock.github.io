// fetching the hour min and sec elements
class Alarm {
    constructor(alarmHour, alarmMinutes, alarmSecomds, alarmAmPm) {
        this.alarmHour = alarmHour
        this.alarmMinutes = alarmMinutes;
        this.alarmSecomds = alarmSecomds;
        this.alarmAmPm = alarmAmPm;


    }

    getInMilliSec() {
        // if (this.alrmAmPm == "AM") {
        //     return 0001;
        // }
        let hr = this.alarmHour;
        let min = this.alarmMinutes;
        let sec = this.alarmSecomds;
        let AmPm = this.alarmAmPm;
        if (AmPm == "PM") {
            hr = hr + 12

        }
        sec = sec * 1000;
        min = min * 60 * 1000 + sec;
        hr = hr * 60 * 60 * 1000 + min;
        return hr;

    }
}
let hour = document.querySelector("#hour");
let minutes = document.querySelector("#minutes");
let seconds = document.querySelector("#seconds");
let ampm = document.querySelector("#am-pm");
let changeBackground = true;
//arraylist for storin alarms objects
let alarmSet = [];
alarmSet.push(new Alarm(1, 1, 1, "AM"));
console.log(alarmSet[0].getInMilliSec());

document.onload = setInterval(updateCurrentTime, 1000)
    // variables for current time
let currentTimeHours;
let currentTimeMinutes;
let currentTimeSeconds;
let currentTimeAMPM;
let currentTimeInString;
let isUpdateTImeExecuteOnce = false;


function updateCurrentTime() {
    // creating a object of Date class to get current time
    let currentTime = new Date();


    // getting hour min and sec from currentTime object
    // by calling relevant
    // function

    // we are passing the the obtained time to formmatTime
    // function to append 0 at starting of single digit number
    //hour will be in 0-24 currentTimeHour format
    currentTimeHours = append0ToSingleDigit(currentTime.getHours());
    currentTimeMinutes = append0ToSingleDigit(currentTime.getMinutes());
    currentTimeSeconds = append0ToSingleDigit(currentTime.getSeconds());
    // writing arrow function in iife 
    currentTimeAMPM = (($currentTimeHours) => currentTimeHours >= 12 ? "PM" : "AM")();
    // Template literals (``)allow variables in strings:
    currentTimeHours = `${append0ToSingleDigit(currentTimeHours % 12 || 12)}`;
    hour.innerHTML = currentTimeHours + ":";
    minutes.innerHTML = currentTimeMinutes + ":";
    seconds.innerHTML = currentTimeSeconds + "&nbsp";
    ampm.innerHTML = currentTimeAMPM;
    currentTimeInString = currentTimeHours + ":" + currentTimeMinutes + ":" + currentTimeSeconds + " " + currentTimeAMPM;



    if (!isUpdateTImeExecuteOnce && currentTimeHours != undefined) {
        // call the fill function only once
        fillTheAlarmSetInput(currentTimeHours, currentTimeMinutes, currentTimeSeconds, currentTimeAMPM);
        isUpdateTImeExecuteOnce = true;
    }




}
// format time 
// add 0 to single digit time
function append0ToSingleDigit(timeElem) {
    // this function return the timeElem 
    // by appending 0 to single digit number
    return timeElem < 10 ? "0" + timeElem : timeElem;
}
//setAmPm function is an onClick function and is being called 
// when when we select any option from am pm dropdoun
let alarmTimeAmPmTextAreaElem = document.querySelector('#alarm-time-ampm-text-area');
let alarmTimeHoursTextAreaElem = document.querySelector('#alarm-time-hours-text-area');
let alarmTimeMinutesTextAreaElem = document.querySelector('#alarm-time-minutes-text-area');
let alarmTimeTextAreaSeconds = document.querySelector('#alarm-time-seconds-text-area');



// setting the alarm set inputs


function fillTheAlarmSetInput(currentTimeHour, currentTimeMinutes, currentTimeSeconds, currentTimeAMPM) {
    console.log(currentTimeHour, currentTimeMinutes, currentTimeAMPM);
    alarmTimeAmPmTextAreaElem.value = currentTimeAMPM;
    alarmTimeHoursTextAreaElem.value = currentTimeHours;
    alarmTimeMinutesTextAreaElem.value = currentTimeMinutes;
    alarmTimeTextAreaSeconds.value = currentTimeSeconds;
}

let currentOpenedDropdownElem = null;
let textAreaHidden = null;

function fillAlarmTimeTextArea() {
    const eventvalue = event.target.innerHTML;
    // console.log(eventvalue);


    //option->optioncontainer->dropdowncontainer->input:type text
    event.target.parentElement.parentElement.firstElementChild.value = eventvalue;
    // event.target.parentElement.style.display = 'none';

    event.target.parentElement.classList.toggle('toggle-alarm-time-display');
    textAreaHidden.classList.toggle('hide-alarm-textArea-display');
    textAreaHidden = null;
    currentOpenedDropdownElem = null;

    // call the setAlarmMessage  function to display the message
    const timeDifferenceMessageElem = document.querySelector('#time-difference-message');
    const AlarmTimeHourstextAreaElem = document.querySelector('#alarm-time-hours-text-area').value;
    const AlarmTimeMinutestextAreaElem = document.querySelector('#alarm-time-minutes-text-area').value;
    const AlarmTimesecondstextAreaElem = document.querySelector('#alarm-time-seconds-text-area').value;
    const AlarmTimeAmpPmtextAreaElem = document.querySelector('#alarm-time-ampm-text-area').value;
    setAlarmMessage(timeDifferenceMessageElem, AlarmTimeHourstextAreaElem, AlarmTimeMinutestextAreaElem, AlarmTimesecondstextAreaElem, AlarmTimeAmpPmtextAreaElem);

}






function toggleOption() {
    let alarmTimeInputContaniner = document.getElementById('alarm-set-input-container');
    // if same button is clicked twice toggle
    // if (!alarmTimeInputContaniner.contains(event.target)) {
    //     return;
    // }


    if (currentOpenedDropdownElem != null) {
        //close any other options which are opened
        // console.log(currentOpenedDropdownElem);
        // currentOpenedDropdownElem.style.display = 'none';
        currentOpenedDropdownElem.classList.toggle('toggle-alarm-time-display');
        textAreaHidden.classList.toggle('hide-alarm-textArea-display');
        currentOpenedDropdownElem = null;
        textAreaHidden = null;
        // return;

    }

    // event.target.nextElementSibling.style.display = 'block';
    event.target.classList.toggle('hide-alarm-textArea-display');
    textAreaHidden = event.target;
    currentOpenedDropdownElem = event.target.nextElementSibling;



    event.target.nextElementSibling.classList.toggle('toggle-alarm-time-display');
    scrollToHighlightedvalueInOption(event.target);
}


function getElementPosition(elem) {
    // console.log(elem.getBoundingClientRect());
    // getBoundingRect() will return null if the elements'display is  set to none
    return {
        x: elem.getBoundingClientRect().x,
        y: elem.getBoundingClientRect().y
    }

}

function scrollToHighlightedvalueInOption(textAreaElem) {

    // we have to find the elements having same innerhtml as it's
    // sibling's child
    let siblingElem = textAreaElem.nextElementSibling;
    //storing all the child element in array
    let optionsList = [].slice.call(document.getElementById(siblingElem.id).getElementsByTagName('*'), 0);
    // finding the exact div element as the valueof text are
    let targetOptionElem;
    let prevToTargetOption;
    for (let i = 0; i < optionsList.length; i++) {

        if (optionsList[i].innerHTML == textAreaElem.value) {
            targetOptionElem = optionsList[i];
            // console.log("found it", targetOptionElem);
            if (i != 0 && i != optionsList.length) {
                targetOptionElem = prevToTargetOption;
            }
            break;
        }
        prevToTargetOption = optionsList[i];

    }

    targetOptionElem.scrollIntoView()

}
// window.addEventListener("click", toggleOption);
function addAllHtmlElements() {


    // adding hours option
    const alarmTimeHoursDropdownContainerElem = document.getElementById("alarm-time-hours-dropdown-container");
    for (let i = 1; i <= 12; i++) {
        if (i < 10) {
            i = "0" + i;
        }
        alarmTimeHoursDropdownContainerElem.innerHTML += `<div onclick="event,fillAlarmTimeTextArea()" class="alarm-time-hours-option alarm-time text-center" id="alarm-time-hours-${i}">${i}</div>`

    }
    // adding minutes option
    const alarmTimeMinutesDropdownContainerElem = document.getElementById("alarm-time-minutes-dropdown-container");
    for (let i = 0; i <= 59; i++) {
        if (i < 10) {
            i = "0" + i;
        }
        alarmTimeMinutesDropdownContainerElem.innerHTML += `<div onclick="event,fillAlarmTimeTextArea()" class="alarm-time-minutes-option alarm-time text-center" id="alarm-time-minutes-${i}">${i}</div>`

    }
    // adding seconds option
    const alarmTimeSecondsDropdownContainerElem = document.getElementById("alarm-time-seconds-dropdown-container");
    for (let i = 0; i <= 59; i++) {
        if (i < 10) {
            i = "0" + i;
        }
        alarmTimeSecondsDropdownContainerElem.innerHTML += `<div onclick="event,fillAlarmTimeTextArea()" class="alarm-time-seconds-option alarm-time text-center" id="alarm-time-seconds-${i}">${i}</div>`

    }



}
addAllHtmlElements();

// function for displaying remaining time
const setAlarmtextAreaElem = document.querySelector('#alarm-time-hours-text-area');

setAlarmtextAreaElem.addEventListener('change', setAlarmMessage);

function setAlarmMessage(targetElem, alarmTimeHour, alarmTimeMin, alarmSec, alarmTimeAmPm) {
    // for showing remaining time remaining message
    targetElem.innerHTML = "Alarm in ";
    var alarmTime = alarmTimeHour + ":" + alarmTimeMin + ":" + alarmSec + " " + alarmTimeAmPm;

    var timeStart = new Date("01/01/2007 " + currentTimeInString);
    var timeEnd = new Date("01/01/2007 " + alarmTime);
    let remainingSeconds = 0;


    var diff = (timeEnd - timeStart);

    if (diff < 0) {
        diff += 86400000;
    }
    console.log(diff)
    if (diff < 60000) {
        remainingSeconds = diff / 1000;
    }
    diff = diff / 60000; //dividing by seconds and milliseconds
    // difference is in minutes



    //remainingSeconds = parseInt((diff % 1) * 60);
    var minutes = parseInt(diff % 60);
    var hours = parseInt(diff - minutes) / 60;
    if (hours > 0) {
        targetElem.innerHTML += `${hours} hours `;

    }
    if (minutes > 0) {
        targetElem.innerHTML += `${minutes} minutes `
        setTimeout(() => targetElem.innerHTML = "", 8000);
    }
    //diff = parseInt(diff * 100);


    if (remainingSeconds != 0) {
        targetElem.innerHTML += `${remainingSeconds} seconds`;

        setTimeout(() => targetElem.innerHTML = "", 8000)
    }



    console.log(diff, parseInt((diff % 1) * 60));




}


updateCurrentTime();