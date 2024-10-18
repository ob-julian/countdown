// const host = window.location.host;
// host is a relic from when the site reachable under multiple ddns domains
const host = "oberhofer.ddns.net";
let interval;

let dat,
    showMonths = false,
    showDays = false,
    showHours = false,
    showMinutes = false,
    showSeconds = false,
    showMilliseconds = false,
    count = 6,
    fix1 = false,
    fix2 = false;

window.addEventListener('DOMContentLoaded', function () {

    function setElementVisibility(elementId) {
        let storageShowElement = (localStorage.getItem(elementId) || "true") === "true";
        // invers because the checkbox is checked if the element is not shown
        const buttonId = elementId.substring(4).toLowerCase();
        document.getElementById(buttonId).checked = !storageShowElement;

        if (!storageShowElement) {
            count--;
        }

        return storageShowElement;
    }


    showMonths = setElementVisibility("showMonths");
    showDays = setElementVisibility("showDays");
    showHours = setElementVisibility("showHours");
    showMinutes = setElementVisibility("showMinutes");
    showSeconds = setElementVisibility("showSeconds");
    showMilliseconds = setElementVisibility("showMilliseconds");

    // logic for data input for the countdown
    if (window.location.search !== '') {
        const query = window.location.search;
        const queryCleaned = query.substring(1);
        let querySplit = queryCleaned.split("=rtz=og");
        for (let x in querySplit)
            querySplit[x] = decodeURI(querySplit[x]);
        document.getElementById("anlass0").innerText = querySplit[1];
        document.getElementById("name0").innerText = querySplit[2];
        document.getElementsByTagName('title')[0].innerText = "Countdown " + querySplit[2] + "'s " + querySplit[1];
        if (querySplit[3] === "imp") {
            document.getElementById("dl").innerText = "<div id='neue1'></div>";
        }
        const date = querySplit[0].split("-");
        const dateMapped = date.map(Number);
        let da;
        let akt = new Date;
        let xx = 0;
        do {
            da = new Date(dateMapped[0] + xx, dateMapped[1] - 1, dateMapped[2]);
            xx++;
        }
        while (da.getTime() < akt.getTime());
        document.getElementById("wh0").innerText = (xx - 1).toString();
        dat = da;
        los();
        interval = setIntervalBasedOnPrecision();
    } else {
        neu();
    }
});

function setIntervalBasedOnPrecision() {
    if (showMilliseconds) {
        return setInterval(los, 1);
    }
    let delay = new Date().getMilliseconds();
    if (showSeconds) {
        return setTimedInterval(1000, delay);
    }
    delay += new Date().getSeconds() * 1000;
    if (showMinutes) {
        return setTimedInterval(60000, delay);
    }
    delay += new Date().getMinutes() * 60000;
    if (showHours) {
        return setTimedInterval(3600000, delay);
    }
    delay += new Date().getHours() * 3600000;
    if (showDays) {
        return setTimedInterval(86400000, delay);
    }
    delay += new Date().getDate() * 86400000;
    if (showMonths) {
        return setTimedInterval(2592000000, delay);
    }
}

function setTimedInterval(interval, delay) {
    return setTimeout(() => {
        return setInterval(los, interval);
    }, interval - delay);
}

los = function () {
    let akt = new Date;
    if (dat.getTime() > akt.getTime()) {
        // calculate the difference between the current date and the date of the event

        // starting with just getting the different timings
        let datM = dat.getMonth() - akt.getMonth();
        let datD = dat.getDate() - akt.getDate();
        let datH = dat.getHours() - akt.getHours();
        let datMi = dat.getMinutes() - akt.getMinutes();
        let datS = dat.getSeconds() - akt.getSeconds();
        let datMs = dat.getMilliseconds() - akt.getMilliseconds();

        // make sure that the difference is positive
        while (datMs < 0) {
            datS--;
            datMs += 1000;
        }
        while (datS < 0) {
            datMi--;
            datS += 60;
        }
        while (datMi < 0) {
            datH--;
            datMi += 60;
        }
        while (datH < 0) {
            datD--;
            datH += 24;
        }
        while (datD < 0) {
            datM--;
            datD += monthday(akt.getMonth());
        }
        while (datM < 0) {
            datM += 12;
        }

        function changeElement(timeBool, timeId, pointBool, pointId, timeAmount, func) {
            let returnVal = 0;
            if (timeBool) {
                document.getElementById(timeId).style.display = "inline-block";
                document.getElementById(pointId).style.display = "inline";
            } else {
                if (func)
                    returnVal = func(timeAmount);

                document.getElementById(timeId).style.display = "none";
                if (pointBool)
                    document.getElementById(pointId).style.display = "none";
                else
                    document.getElementById(pointId).style.display = "inline";
            }
            return returnVal;
        }

        let cummulativeBool = true;
        function andCummulativeBool(bool) {
            cummulativeBool = cummulativeBool && bool;
        }
        datD += changeElement(showMonths, "showMonths", cummulativeBool, "mm", datM, (x) => {
            let cum = 0;
            for (let nt = x; nt > 0; nt--) {
                cum += monthday((akt.getMonth() + nt) % 12);
            }
            return cum;
        });

        andCummulativeBool(!showMonths);
        datH += changeElement(showDays, "showDays", cummulativeBool, "dd", datD, (x) => x * 24);

        andCummulativeBool(!showDays);
        datMi += changeElement(showHours, "showHours", cummulativeBool, "hh", datH, (x) => x * 60);

        andCummulativeBool(!showHours);
        datS += changeElement(showMinutes, "showMinutes", cummulativeBool, "mimi", datMi, (x) => x * 60);

        andCummulativeBool(!showMinutes);
        datMs += changeElement(showSeconds, "showSeconds", cummulativeBool, "ss", datS, (x) => x * 1000);

        if (showMilliseconds) {
            document.getElementById("showMilliseconds").style.display = "inline-block";
        } else {
            document.getElementById("showMilliseconds").style.display = "none";
        }

        if (datMs === 1000) datMs = "000";
        else if ((datMs <= 99) && (datMs >= 10)) datMs = "0" + datMs;
        else if ((datMs <= 9) && (datMs >= 0)) datMs = "00" + datMs;
        if (datS <= 9) datS = "0" + datS;
        if (datMi <= 9) datMi = "0" + datMi;
        if (datH <= 9) datH = "0" + datH;
        if (datD <= 9) datD = "0" + datD;
        if (datM <= 9) datM = "0" + datM;
        document.getElementById('mon').innerText = datM.toString();
        document.getElementById('day').innerText = datD.toString();
        document.getElementById('hour').innerText = datH.toString();
        document.getElementById('min').innerText = datMi.toString();
        document.getElementById('sec').innerText = datS.toString();
        document.getElementById('msec').innerText = datMs.toString();
    } else {
        document.getElementById('center').innerHTML = "<span id='hea'>Vorbei</span>"
    }
}

neu = function () {
    if (fix1) document.getElementById("neue1").style.display = "none";
    else {
        document.getElementById("neue1").style.display = "block";
        document.getElementById("neue2").style.display = "none";
        fix2 = false;
    }
    fix1 = !fix1;
}

opt = function () {
    if (fix2) document.getElementById("neue2").style.display = "none";
    else {
        document.getElementById("neue2").style.display = "block";
        document.getElementById("neue1").style.display = "none";
        fix1 = false;
    }
    fix2 = !fix2;
}

const isNotLeapYear = leapYear(new Date().getFullYear());

function leapYear(year) {
    if ((year % 100 === 0) && (year % 400 !== 0)) return false;
    else return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
}

function leap() {
    if (isNotLeapYear) return 29;
    else return 28;
}

but = function () {
    const date = document.getElementById("date").value;
    const anlass = document.getElementById("anlass").value;
    const name = document.getElementById("name").value;
    if (date && anlass && name) {
        const result = "https://" + host + "/countdown?" + date + "=rtz=og" + anlass + "=rtz=og" + name;
        const encodeResult = encodeURI(result);
        const input = document.getElementById("fertig")
        input.value = result;
        input.select();
        copyToClipboard(encodeResult);
    } else {
        document.getElementById("fertig").value = "Fehler, bitte alle Felder ausfüllen";
    }
}

cp = function () {
    const input = document.getElementById("fertig");
    input.select();
    copyToClipboard(input.value);
}

let disabledStatus = false,
    disabledElement,
    alle = ["months", "days", "hours", "minutes", "seconds", "milliseconds"];

dis = function (hh) {
    // invers because the checkbox is checked if the element is not shown
    const change = !hh.checked;

    switch (hh.id) {
        case "months":
            showMonths = change;
            localStorage.setItem("showMonths", change);
            break;
        case "days":
            showDays = change;
            localStorage.setItem("showDays", change);
            break;
        case "hours":
            showHours = change;
            localStorage.setItem("showHours", change);
            break;
        case "minutes":
            showMinutes = change;
            localStorage.setItem("showMinutes", change);
            break;
        case "seconds":
            showSeconds = change;
            localStorage.setItem("showSeconds", change);
            break;
        case "milliseconds":
            showMilliseconds = change;
            localStorage.setItem("showMilliseconds", change);
            break;
    }

    if (!change)
        count--;
    else
        count += 1;

    if (count <= 1) {
        // force the user to have at least one element visible
        for (let ii in alle) {
            if (!document.getElementById(alle[ii]).checked) {
                document.getElementById(alle[ii]).setAttribute("disabled", "");
                disabledStatus = true;
                disabledElement = alle[ii];
                break;
            }
        }
    } else {
        if (disabledStatus) document.getElementById(disabledElement).removeAttribute("disabled");
        disabledStatus = false;
    }

    // update the interval to reflect the new precision
    clearInterval(interval);
    los();
    interval = setIntervalBasedOnPrecision();
}

function monthday(gg) {
    switch (gg) {
        case 0:
        case 2:
        case 4:
        case 6:
        case 7:
        case 9:
        case 11:
            return 31;
        case 1:
            return leap();
        case 3:
        case 5:
        case 8:
        case 10:
            return 30;
    }
}

window.onclick = function(event) {
    // check if the click was outside the boxes for inputting the data and close them if it was
    let fou = false;
    // get element on which the click occurred
    let target = event.target;
    // check if the element or one of its parents has the class "di"
    while (target !== document.documentElement) {
        if(target.classList[0] === "di"){
            fou = true;
            break;
        }
        target = target.parentElement;
    }

    if(!fou){
        document.getElementById("neue1").style.display = "none";
        document.getElementById("neue2").style.display = "none";
        fix1 = fix2 = false;
    }
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
      .catch((error) => {
        console.error("Could not copy text: ", error);
      });
}