// fetching the hour min and sec elements
class Alarm {
    constructor(alarmHour, alarmMinutes, alarmSecomds, alarmAmPm, alarmTimeInString, alarmTimeInMilliSec) {
        this.alarmHour = alarmHour
        this.alarmMinutes = alarmMinutes;
        this.alarmSecomds = alarmSecomds;
        this.alarmAmPm = alarmAmPm;
        this.active = true;
        this.alarmTimeInString = alarmTimeInString;
        this.alarmTimeInMilliSec = alarmTimeInMilliSec;


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

const timeDifferenceMessageElem = document.querySelector('#time-difference-message');
let alarmTimeAmPmTextAreaElem = document.querySelector('#alarm-time-ampm-text-area');
let alarmTimeHoursTextAreaElem = document.querySelector('#alarm-time-hours-text-area');
let alarmTimeMinutesTextAreaElem = document.querySelector('#alarm-time-minutes-text-area');
let alarmTimeSecondsTextAreaElem = document.querySelector('#alarm-time-seconds-text-area');
let alarmListContainerElem = document.querySelector('#alarm-list-container')
let changeBackground = true;


document.onload = setInterval(updateCurrentTime, 1000);
// variables for current time
let currentTimeHours;
let currentTimeMinutes;
let currentTimeSeconds;
let currentTimeAMPM;
let currentTimeInString;
var alarmTimeInString;
let sortedAlarmList = [];
let alarmList = [];
let isUpdateTImeExecuteOnce = false;
let minuteTimout;
let secondTimeout;
let nightSymbolUrl = "./assets/images/night-symbol.png";
let sunriseSymbolUrl = "./assets/images/sunrise-symbol.png";
let noonSymbolUrl = "./assets/images/noon-symbol.png";
let sunsetSymbolUrl = "./assets/images/sunset-symbol.png";
let sleepingSymbolUrl = "./assets/images/sleeping-symbol.png";


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

    upadteAlarmListMessage();




}

function upadteAlarmListMessage() {
    if (typeof sortedAlarmList === 'undefined') {
        return;
    }
    for (let i = 0; i < sortedAlarmList.length; i++) {
        let hr = sortedAlarmList[i][0].alarmHour;
        let min = sortedAlarmList[i][0].alarmMinutes;
        let sec = sortedAlarmList[i][0].alarmSecomds;
        let ampm = sortedAlarmList[i][0].alarmAmPm;
        let targetElem = document.querySelector(`#alarm-list-${i}-time-difference`);
        targetElem.innerHTML = "";
        targetElem.innerHTML = "Alarm in ";
        alarmTimeInString = hr + ":" + min + ":" + sec + " " + ampm;

        let timeStart = new Date("01/01/2007 " + currentTimeInString);
        let timeEnd = new Date("01/01/2007 " + alarmTimeInString);
        let remainingSeconds = 0;


        let diff = (timeEnd - timeStart);

        if (diff < 0) {
            diff += 86400000;
        }
        // console.log(diff)
        if (diff < 60000) {
            remainingSeconds = diff / 1000;
        }
        diff = diff / 60000; //dividing by seconds and milliseconds
        // difference is in minutes



        //remainingSeconds = parseInt((diff % 1) * 60);
        let minutes = parseInt(diff % 60);
        let hours = parseInt(diff - minutes) / 60;
        if (hours > 0) {
            targetElem.innerHTML += `${hours} hours `;

        }
        if (minutes > 0) {
            targetElem.innerHTML += `${minutes} minutes `
                // setTimeout(() => targetElem.innerHTML = "", 8000);
        }
        //diff = parseInt(diff * 100);


        if (remainingSeconds != 0) {
            targetElem.innerHTML += `${remainingSeconds} seconds`;

            //setTimeout(() => targetElem.innerHTML = "", 8000)
        }






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




// setting the alarm set inputs


function fillTheAlarmSetInput(currentTimeHour, currentTimeMinutes, currentTimeSeconds, currentTimeAMPM) {
    console.log(currentTimeHour, currentTimeMinutes, currentTimeAMPM);
    alarmTimeAmPmTextAreaElem.value = currentTimeAMPM;
    alarmTimeHoursTextAreaElem.value = currentTimeHours;
    alarmTimeMinutesTextAreaElem.value = currentTimeMinutes;
    alarmTimeSecondsTextAreaElem.value = currentTimeSeconds;
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

    setAlarmMessage(timeDifferenceMessageElem, alarmTimeHoursTextAreaElem.value, alarmTimeMinutesTextAreaElem.value, alarmTimeSecondsTextAreaElem.value, alarmTimeAmPmTextAreaElem.value);

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


// function for getting dropdown list positioned exactly in the
// at text-area value
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


// function for displaying remaining time
const setAlarmtextAreaElem = document.querySelector('#alarm-time-hours-text-area');

setAlarmtextAreaElem.addEventListener('change', setAlarmMessage);

function setAlarmMessage(targetElem, alarmTimeHour, alarmTimeMin, alarmSec, alarmTimeAmPm) {
    // for showing remaining time remaining message

    targetElem.innerHTML = "";
    targetElem.innerHTML = "Alarm in ";
    alarmTimeInString = alarmTimeHour + ":" + alarmTimeMin + ":" + alarmSec + " " + alarmTimeAmPm;

    let timeStart = new Date("01/01/2007 " + currentTimeInString);
    let timeEnd = new Date("01/01/2007 " + alarmTimeInString);
    let remainingSeconds = 0;


    let diff = (timeEnd - timeStart);

    if (diff < 0) {
        diff += 86400000;
    }
    // console.log(diff)
    if (diff < 60000) {
        remainingSeconds = diff / 1000;
    }
    diff = diff / 60000; //dividing by seconds and milliseconds
    // difference is in minutes



    //remainingSeconds = parseInt((diff % 1) * 60);
    let minutes = parseInt(diff % 60);
    let hours = parseInt(diff - minutes) / 60;
    if (hours > 0) {
        targetElem.innerHTML += `${hours} hours `;

    }
    if (minutes > 0) {
        targetElem.innerHTML += `${minutes} minutes `;
        if (typeof minuteTimout !== 'undefined') {
            // console.log("cleared previous minute timeout")
            clearTimeout(minuteTimout);
        }
        minuteTimout = setTimeout(() => targetElem.innerHTML = "", 8000);
    }
    //diff = parseInt(diff * 100);


    if (remainingSeconds != 0) {
        targetElem.innerHTML += `${remainingSeconds} seconds`;
        if (typeof secondTimeout !== 'undefined') {
            clearTimeout(secondTimeout);
        }

        secondTimeout = setTimeout(() => targetElem.innerHTML = "", 8000)
    }



    // console.log(diff, parseInt((diff % 1) * 60));




}
// adding alarm to the list
function timeDifference(alarmTimeInString) {

    let timeStart = new Date("01/01/2007 " + currentTimeInString);
    let timeEnd = new Date("01/01/2007 " + alarmTimeInString);
    let remainingSeconds = 0;


    let diff = (timeEnd - timeStart);

    if (diff < 0) {
        diff += 86400000;
    }
    // console.log(diff);

    if (diff < 60000) {
        remainingSeconds = diff / 1000;
    }
    diff = diff / 60000; //dividing by seconds and milliseconds
    // difference is in minutes



    //remainingSeconds = parseInt((diff % 1) * 60);
    let minutes = parseInt(diff % 60);
    let hours = parseInt(diff - minutes) / 60;
    // if (hours > 0) {
    //     targetElem.innerHTML += `${hours} hours `;

    // }
    // if (minutes > 0) {
    //     targetElem.innerHTML += `${minutes} minutes `
    //     setTimeout(() => targetElem.innerHTML = "", 8000);
    // }
    //diff = parseInt(diff * 100);


    // if (remainingSeconds != 0) {
    //     targetElem.innerHTML += `${remainingSeconds} seconds`;

    //     setTimeout(() => targetElem.innerHTML = "", 8000)
    // }
    return {
        hr: hours,
        min: minutes,
        diff: diff
    };

}

function checkAlarams() {

    const isPresentinLocalStorage = localStorage.getItem("alarms");
    if (isPresentinLocalStorage) {
        alarmList = JSON.parse(isPresentinLocalStorage);
    }

    return alarmList;
}

function isAlarmAlredyPreset(alarmTimeInString) {

    if (typeof sortedAlarmList !== 'undefined') {
        console.log("inside", sortedAlarmList[0]);
        for (let value in sortedAlarmList) {
            if (sortedAlarmList[value][0].alarmTimeInString === alarmTimeInString) {
                return true;
            }
        }
        return false;

    } else {
        return false;
    }


}

function addAlarm() {

    alarmList = checkAlarams();

    //arraylist for storin alarms objects
    let hr = alarmTimeHoursTextAreaElem.value;
    let min = alarmTimeMinutesTextAreaElem.value;
    let sec = alarmTimeSecondsTextAreaElem.value;
    let ampm = alarmTimeAmPmTextAreaElem.value;
    alarmTimeInString = hr + ":" + min + ":" + sec + " " + ampm;

    var forAlarmTimeInMilliSec = new Date("01/01/2007 " + alarmTimeInString);
    if (isAlarmAlredyPreset(alarmTimeInString)) {
        window.alert(`Alarm already set for ${alarmTimeInString}`);
        return;
    }

    alarmList.push(new Alarm(hr, min, sec, ampm, alarmTimeInString, forAlarmTimeInMilliSec));
    // we can only store key value pair as string in localStorage
    // converting array to strings
    localStorage.setItem("alarms", JSON.stringify(alarmList));

    updateAlarmList();
    updateCurrentTime();



}



function sortAlarmListArray() {
    // if localstorage has some value for alarms
    sortedAlarmList = [];
    alarmList = JSON.parse(localStorage.getItem("alarms"));

    for (let value in alarmList) {
        let timeDifferenceObject = timeDifference(alarmList[value].alarmTimeInString);
        sortedAlarmList.push([alarmList[value], timeDifferenceObject.diff]);
    }
    sortedAlarmList.sort(function(a, b) { return a[1] - b[1] })

}

function getSymbolUrl(hr, ampm) {
    let symbolUrl;


    if (ampm == "AM" && hr > 5 && hr < 12) {
        // morning symbol
        symbolUrl = sunriseSymbolUrl;

    }
    if (ampm == "PM" && (hr >= 12 || hr >= 1) && hr < 5) {
        // noon symbol
        symbolUrl = noonSymbolUrl;

    }
    if (ampm == "PM" && hr >= 5 && hr < 7) {
        // evening symbol
        symbolUrl = sunsetSymbolUrl;

    }
    if (ampm == "PM" && hr >= 7 && hr < 12) {
        // night symbol
        symbolUrl = nightSymbolUrl;

    }
    if (ampm == "AM" && (hr >= 12 || hr >= 1) && hr < 5) {
        // sleeping symbol
        symbolUrl = sleepingSymbolUrl;

    }
    return symbolUrl;

}

function updateAlarmList() {
    // if (localStorage.getItem("alarms") == undefined); {
    //     return;

    // }
    const isPresentinLocalStorage = localStorage.getItem("alarms");

    if (isPresentinLocalStorage) {
        sortAlarmListArray();
        // console.log("hello")
        // console.log(sortedAlarmList);
    }
    // first clear the existing list in html 
    // for updated list to added
    alarmListContainerElem.innerHTML = "";

    // adding all the alarm list to the html

    for (let value = 0; value < sortedAlarmList.length; value++) {
        let hr = sortedAlarmList[value][0].alarmHour;
        let min = sortedAlarmList[value][0].alarmMinutes;
        let sec = sortedAlarmList[value][0].alarmSecomds;
        let ampm = sortedAlarmList[value][0].alarmAmPm;
        let obj = sortedAlarmList[value][0];
        let symbolUrl = getSymbolUrl(hr, ampm);





        alarmListContainerElem.innerHTML += `
        <div class="alarm-list-${value}-container common-alarm-list-container" id="alarm-list-${value}-container">
            <div class="alarm-list alarm-list-1" id="alarm-list-${value}">
                <div class="alarm-list-symbol" id="alarm-list-${value}-symbol"><img src=${symbolUrl} alt="" width="50" height="50"></div>
                <div class="alarm-list-time" id="alarm-list-1-time">
                    <span class="alram-list-hour" id="alarm-list-${value}-hour">${hr} : </span>
                    <span class="alram-list-min" id="alarm-list-${value}-min">${min}</span>
                    <span class="alram-list-ampm" id="alarm-list-${value}-ampm">${ampm}</span>
                </div>
                <div class="alarm-list-btn" id="alarm-list-${value}-btn">
                    <button type="button" onclick="event,deleteAlarm('${encodeURIComponent(JSON.stringify(obj))}')">Delete</button>
                </div>
            </div>
            <div class="alarm-list-time-difference-message text-center active" id="alarm-list-${value}-time-difference">
           
            </div>
            </div>
            
           `;
        // let targetElement = document.querySelector(`#alarm-list-${value}-time-difference`);
        // let frequency = 5000 + value * 5000;
        // alarmTimeMessage(targetElement, hr, min, sec, ampm, frequency);


    }



}

function alarmTimeMessage(targetElement, hr, min, sec, ampm, frequency) {

    let alarminterval = setInterval(function() {

        setAlarmMessage(targetElement, hr, min, sec, ampm);

    }, parseInt(frequency));
}

function deleteAlarm(obj) {
    // 
    // event.preventDefault();
    obj = JSON.parse(decodeURIComponent(obj))


    for (let i = 0; i < alarmList.length; i++) {
        if (obj.alarmTimeInString == alarmList[i].alarmTimeInString) {
            console.log("found you");
            alarmList.splice(i, 1);
            break;
        }

    }
    // console.log(alarmList[alarmList.length - 1])
    // console.log(alarmList.includes(obj));

    //update the localStorage
    localStorage.setItem("alarms", JSON.stringify(alarmList));
    // update the list 
    updateAlarmList();
    updateCurrentTime();


}





addAllHtmlElements();
updateCurrentTime();
updateAlarmList();