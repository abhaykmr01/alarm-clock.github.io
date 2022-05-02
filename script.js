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
}


const currDateElem = document.querySelector(".current-date");
const currSymbolElem = document.querySelector(".current-day-time-symbol");
const stopRingingBtn = document.querySelector("#stop-ring");
const ringingPopupElem = document.querySelector(".ringing-popup");
const ringingMsg = document.querySelector(".ringing-msg");
const bell = document.querySelector(".bell");
const overlayElem = document.querySelector(".overlay");
const hour = document.querySelector("#hour");
const minutes = document.querySelector("#minutes");
const seconds = document.querySelector("#seconds");
const ampm = document.querySelector("#am-pm");
const timeDifferenceMessageElem = document.querySelector('#time-difference-message');
const alarmTimeAmPmTextAreaElem = document.querySelector('#alarm-time-ampm-text-area');
const alarmTimeHoursTextAreaElem = document.querySelector('#alarm-time-hours-text-area');
const alarmTimeMinutesTextAreaElem = document.querySelector('#alarm-time-minutes-text-area');
const alarmTimeSecondsTextAreaElem = document.querySelector('#alarm-time-seconds-text-area');
const alarmSetContainer = document.querySelector('.alarm-set-container');
const alarmListContainerElem = document.querySelector('#alarm-list-container')
const btn = document.getElementById(".toggle-button");
const circle = document.getElementById(".circle");
let changeBackground = true;
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
const nightSymbolUrl = "./assets/images/night-symbol.png";
const sunriseSymbolUrl = "./assets/images/sunrise-symbol.png";
const noonSymbolUrl = "./assets/images/noon-symbol.png";
const sunsetSymbolUrl = "./assets/images/sunset-symbol.png";
const sleepingSymbolUrl = "./assets/images/sleeping-symbol.png";
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let currDateInString;
let changeDate = true;;
let changeSymbol = true;
let bellRinging;

document.onload = setInterval(updateCurrentTime, 1000);

stopRingingBtn.addEventListener("click", () => {
    window.clearTimeout(bellRinging);
    bell.pause();
    ringingPopupElem.style.display = "none";
    overlayElem.style.display = "none"
})

function updateCurrentTime() {
    // creating a object of Date class to get current time
    let currentTime = new Date();
    // getting hour min and sec from currentTime object
    // by calling relevant function


    // we are passing the the obtained time to append0ToSingleDigit
    // function to append 0 at starting of single digit number
    //By default hour will be in 0-24
    currentTimeHours = append0ToSingleDigit(currentTime.getHours());
    currentTimeMinutes = append0ToSingleDigit(currentTime.getMinutes());
    currentTimeSeconds = append0ToSingleDigit(currentTime.getSeconds());
    // writing arrow function in iife 
    currentTimeAMPM = (($currentTimeHours) => currentTimeHours >= 12 ? "PM" : "AM")();
    // Template literals (``)allow variables in strings:
    currentTimeHours = `${append0ToSingleDigit(currentTimeHours % 12 || 12)}`;
    hour.innerHTML = currentTimeHours + "&nbsp:&nbsp";
    minutes.innerHTML = currentTimeMinutes + "&nbsp:&nbsp";
    seconds.innerHTML = currentTimeSeconds + "&nbsp";
    ampm.innerHTML = currentTimeAMPM;
    currentTimeInString = currentTimeHours + ":" + currentTimeMinutes + ":" + currentTimeSeconds + " " + currentTimeAMPM;
    if (!isUpdateTImeExecuteOnce && currentTimeHours != undefined) {
        // call the fill function only once
        fillTheAlarmSetInput(currentTimeHours, currentTimeMinutes, currentTimeSeconds, currentTimeAMPM);
        isUpdateTImeExecuteOnce = true;
    }
    // cahnge date only once on starting of new day
    if (currentTimeAMPM == 'AM' && currentTimeHours == '12' && currentTimeMinutes == '00' && currentTimeSeconds == '01') {
        changeDate = true;
        changeSymbol = true;
    }
    if (currentTimeAMPM == 'AM' && currentTimeHours == '5' && currentTimeMinutes == '00' && currentTimeSeconds == '01') {
        changeSymbol = true;
    }
    if (currentTimeAMPM == 'PM' && currentTimeHours == '12' && currentTimeMinutes == '00' && currentTimeSeconds == '01') {

        changeSymbol = true;
    }
    if (currentTimeAMPM == 'PM' && currentTimeHours == '5' && currentTimeMinutes == '00' && currentTimeSeconds == '01') {

        changeSymbol = true;
    }
    if (currentTimeAMPM == 'PM' && currentTimeHours == '7' && currentTimeMinutes == '00' && currentTimeSeconds == '01') {

        changeSymbol = true;
    }

    let symbolUrl = getSymbolUrl(currentTimeHours, currentTimeAMPM);
    currSymbolElem.style = `background-image: url(${symbolUrl})`;

    let currDay = days[currentTime.getDay()];
    let currMonth = months[currentTime.getMonth()];
    let currDate = append0ToSingleDigit(currentTime.getDate());
    currDateInString = `${currDay},&nbsp${currDate}&nbsp${currMonth}`;
    currDateElem.innerHTML = currDateInString;

    upadteAlarmListMessage();
}


function updateLocalStorage(sortedListObj, property, update) {
    for (let i = 0; i < alarmList.length; i++) {
        if (sortedListObj.alarmTimeInString == alarmList[i].alarmTimeInString) {
            alarmList[property] = update;
            break;
        }
    }
    localStorage.setItem("alarms", JSON.stringify(alarmList));
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
        //ring the bell when diff becomes 0 and alarm is not paused
        if (diff == 0 && sortedAlarmList[i][0].active) {
            ringTheBell(alarmTimeInString);
            // console.log("bells ringing for", alarmTimeInString);
            sortedAlarmList[i][0].active = false;
            updateLocalStorage(sortedAlarmList[i][0], "active", "true");
            updateAlarmList();
        }
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
        }
        //diff = parseInt(diff * 100);


        if (remainingSeconds != 0) {
            targetElem.innerHTML += `${remainingSeconds} seconds`;

        }
    }
}

function ringTheBell(alarmTimeInString) {
    ringingPopupElem.style.display = "block";
    overlayElem.style.display = "block";
    ringingMsg.innerHTML = `Alarm ringing for ${alarmTimeInString}`;
    ringing();
    window.clearTimeout(bellRinging);
    bellRinging = window.setTimeout(stopRinging, 10000);
    updateCurrentTime();
}

function ringing() {
    bell.loop = true;
    bell.play();

}

function stopRinging() {
    window.clearTimeout(bellRinging);
    bell.pause();
    ringingPopupElem.style.display = "none";
    overlayElem.style.display = "none"
}


function append0ToSingleDigit(timeElem) {
    // this function return the timeElem 
    // by appending 0 to single digit number
    return timeElem < 10 ? "0" + timeElem : timeElem;
}


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
    //option->optioncontainer->dropdowncontainer->input:type text
    event.target.parentElement.parentElement.firstElementChild.value = eventvalue;
    event.target.parentElement.classList.toggle('toggle-alarm-time-display');
    textAreaHidden.classList.toggle('hide-alarm-textArea-display');
    textAreaHidden = null;
    currentOpenedDropdownElem = null;
    // call the setAlarmMessage  function to display the message
    setAlarmMessage(timeDifferenceMessageElem, alarmTimeHoursTextAreaElem.value, alarmTimeMinutesTextAreaElem.value, alarmTimeSecondsTextAreaElem.value, alarmTimeAmPmTextAreaElem.value);
}

function toggleOption() {
    if (currentOpenedDropdownElem != null) {
        //close any other options which are opened
        currentOpenedDropdownElem.classList.toggle('toggle-alarm-time-display');
        textAreaHidden.classList.toggle('hide-alarm-textArea-display');
        currentOpenedDropdownElem = null;
        textAreaHidden = null;
    }
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



// closees the dropdown button if clicked anywhere on the window
document.addEventListener("click", e => {
    // console.log(e.target.value)
    if (typeof e.target.value === 'undefined') {
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
    }
})

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
}



function timeDifference(alarmTimeInString) {
    let timeStart = new Date("01/01/2007 " + currentTimeInString);
    let timeEnd = new Date("01/01/2007 " + alarmTimeInString);
    let remainingSeconds = 0;
    let diff = (timeEnd - timeStart);
    if (diff < 0) {
        diff += 86400000;
    }
    if (diff < 60000) {
        remainingSeconds = diff / 1000;
    }
    diff = diff / 60000; //dividing by seconds and milliseconds
    // difference is in minutes
    //remainingSeconds = parseInt((diff % 1) * 60);
    let minutes = parseInt(diff % 60);
    let hours = parseInt(diff - minutes) / 60;
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
    //arraylist for storing alarms objects
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
    // sortedAlarmList contain alarmList objext and timeDifference betweeen current time
    sortedAlarmList.sort(function(a, b) { return a[1] - b[1] })

}

function getSymbolUrl(hr, ampm) {
    let symbolUrl;
    if (ampm == "AM" && hr >= 5 && hr < 12) {
        // morning symbol
        symbolUrl = sunriseSymbolUrl;
    }
    if (ampm == "PM" && ((hr >= 12) || (hr >= 1 && hr < 5))) {
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
    if (ampm == "AM" && ((hr >= 12) || (hr >= 1 && hr < 5))) {
        // sleeping symbol
        symbolUrl = sleepingSymbolUrl;
    }
    return symbolUrl;
}

function updateAlarmList() {
    const isPresentinLocalStorage = localStorage.getItem("alarms");
    if (isPresentinLocalStorage) {
        sortAlarmListArray();
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
            <div class="alarm-list alarm-list-${value}" id="alarm-list-${value}">
                <div class="alarm-list-symbol" id="alarm-list-${value}-symbol" style='background-image: url(${symbolUrl})'></div>
                <div class="alarm-list-time" id="alarm-list-1-time">
                <div class="text-center">
                    <span class="alram-list-hour" id="alarm-list-${value}-hour">${hr} :&nbsp</span>
                    <span class="alram-list-min" id="alarm-list-${value}-min">${min}&nbsp</span>
                    <span class="alram-list-ampm" id="alarm-list-${value}-ampm">${ampm}</span>
                    </div>
                    <div class="alarm-list-time-difference-message text-center active" id="alarm-list-${value}-time-difference">
           
                    </div>
                </div>
                <div class="alarm-list-btn" id="alarm-list-${value}-btn">
                    <button type="button" onclick="event,deleteAlarm('${encodeURIComponent(JSON.stringify(obj))}')">  <i class="fas fa-trash-alt icon trash-icon"></i></button>
                    <div class="toggle-button" id="toggle-button-${value}" onclick="event,toggleOFF('${encodeURIComponent(JSON.stringify(obj))}',${value})">
                    <div class="circle animate" id="toggle-circle-${value}"></div>
                </div>
                </div>
            </div>
           
            </div>
            
           `;
        const circleElem = document.getElementById(`toggle-circle-${value}`);
        const btnElem = document.getElementById(`toggle-button-${value}`);
        let alarmListElem = document.getElementById(`alarm-list-${value}`);
        let alarmListMsg = document.querySelector(`#alarm-list-${value}-time-difference`);
        if (!obj.active) {
            circleElem.style.cssText = `transform:translateX(-0.6rem)`;
            // all except last one is opaque
            alarmListElem.style.backgroundColor = "rgba(42, 39, 42, 0.3)";
            alarmListElem.children[0].style.opacity = "0.5";
            alarmListElem.children[1].style.opacity = "0.5";
            btnElem.style.backgroundColor = "grey";
            alarmListMsg.style.display = "none";
        } else {
            circleElem.style.cssText = `transform:translateX(0)`;
            btnElem.style.backgroundColor = "rgb(24, 159, 221)";
        }
    }
}


function deleteAlarm(obj) {
    obj = JSON.parse(decodeURIComponent(obj))
    for (let i = 0; i < alarmList.length; i++) {
        if (obj.alarmTimeInString == alarmList[i].alarmTimeInString) {
            // remove that element from list
            alarmList.splice(i, 1);
            break;
        }
    }
    //update the localStorage
    localStorage.setItem("alarms", JSON.stringify(alarmList));
    // update the list 
    updateAlarmList();
    updateCurrentTime();
}

function toggleOFF(obj, val) {
    obj = JSON.parse(decodeURIComponent(obj))
    const circleElem = document.getElementById(`toggle-circle-${val}`);
    const btnElem = document.getElementById(`toggle-button-${val}`);
    let alarmListElem = document.getElementById(`alarm-list-${val}`);
    let alarmListMsg = document.querySelector(`#alarm-list-${val}-time-difference`);
    let alarmActive;
    let i;
    // finding that particular object in alarmList
    for (let value in alarmList) {
        if (alarmList[value].alarmTimeInString === obj.alarmTimeInString) {
            alarmActive = alarmList[value].active;
            i = value;
            break;
        }
    }
    if (alarmActive) {
        circleElem.style.cssText = `transform:translateX(-0.7rem)`;
        alarmListElem.style.backgroundColor = "rgba(42, 39, 42, 0.3)";
        alarmListElem.children[0].style.opacity = "0.5";
        alarmListElem.children[1].style.opacity = "0.5";
        btnElem.style.backgroundColor = "grey";
        btnElem.style.opacity = "1"
        alarmListMsg.style.display = "none";
        alarmActive = false;

    } else {
        circleElem.style.cssText = `transform:translateX(0)`;
        alarmListElem.style.backgroundColor = "rgba(42, 39, 42, 1)";
        alarmListElem.children[0].style.opacity = "1";
        alarmListElem.children[1].style.opacity = "1";
        btnElem.style.backgroundColor = "rgb(24, 159, 221)";
        alarmListMsg.style.display = "block";
        alarmActive = true;
    }
    sortedAlarmList[val][0].active = alarmActive;
    alarmList[i].active = alarmActive;
    // update the list
    localStorage.setItem("alarms", JSON.stringify(alarmList));
}

addAllHtmlElements();
updateCurrentTime();
updateAlarmList();