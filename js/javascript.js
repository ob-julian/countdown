// const host = window.location.host;
// host is a relic from when the site reachable under multiple ddns domains
const host = "oberhofer.ddns.net";
let dat,
    months = false,
    days = false,
    hours = false,
    minutes = false,
    seconds = false,
    milliseconds = false,
    count = 6,
    fix1 = false,
    fix2 = false;

window.addEventListener('DOMContentLoaded', function () {
    let tmp;

    tmp = localStorage.getItem("a1");
    if (tmp === null) {
        localStorage.setItem("a1", "false");
    } else if (tmp === "true") {
        months = true;
        document.getElementById("months").checked = true;
        count--;
    }

    tmp = localStorage.getItem("a2");
    if (tmp === null) {
        localStorage.setItem("a2", "false");
    } else if (tmp === "true") {
        days = true;
        document.getElementById("days").checked = true;
        count--;
    }

    tmp = localStorage.getItem("a3");
    if (tmp === null) {
        localStorage.setItem("a3", "false");
    } else if (tmp === "true") {
        hours = true;
        document.getElementById("hours").checked = true;
        count--;
    }

    tmp = localStorage.getItem("a4");
    if (tmp === null) {
        localStorage.setItem("a4", "false");
    } else if (tmp === "true") {
        minutes = true;
        document.getElementById("minutes").checked = true;
        count--;
    }

    tmp = localStorage.getItem("a5");
    if (tmp === null) {
        localStorage.setItem("a5", "false");
    } else if (tmp === "true") {
        seconds = true;
        document.getElementById("seconds").checked = true;
        count--;
    }

    if (count > 1) {
        tmp = localStorage.getItem("a6");
        if (tmp === null) {
            localStorage.setItem("a6", "false");
        } else if (tmp === "true") {
            milliseconds = true;
            document.getElementById("milliseconds").checked = true;
            count--;
        }
    }


    // logic for data input for the countdown
    if (window.location.search !== '') {
        const query = window.location.search;
        const queryCleaned = query.replace("?", "");
        let querySplit = queryCleaned.split("=rtz=og");
        for (let x in querySplit)
            querySplit[x] = decodeURI(querySplit[x]);
        document.getElementById("anlass0").innerHTML = querySplit[1];
        document.getElementById("name0").innerHTML = querySplit[2];
        document.getElementsByTagName('title')[0].innerHTML = "Countdown " + querySplit[2] + "'s " + querySplit[1];
        if (querySplit[3] === "imp") {
            document.getElementById("dl").innerHTML = "<div id='neue1'></div>";
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
        document.getElementById("wh0").innerHTML = (xx - 1).toString();
        dat = da;
        los();
        setInterval(los, 1);
    } else {
        neu();
    }
});

los = function () {
    let akt = new Date;
    if (dat.getTime() > akt.getTime()) {
        // calculate the difference between the current date and the date of the event

        // starting with just getting the different timings
        let aktM = akt.getMonth();
        let datM = dat.getMonth() - aktM;
        let aktD = akt.getDate();
        let datD = dat.getDate() - aktD;
        let aktH = akt.getHours();
        let datH = dat.getHours() - aktH;
        let aktMi = akt.getMinutes();
        let datMi = dat.getMinutes() - aktMi;
        let aktS = akt.getSeconds();
        let datS = dat.getSeconds() - aktS;
        let aktMs = akt.getMilliseconds();
        let datMs = dat.getMilliseconds() - aktMs;

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

        if (months) {
            for (let nt = datM; nt > 0; nt--) {
                datD += monthday((akt.getMonth() + nt) % 12);
            }
            document.getElementById("m").style.display = "none";
            document.getElementById("mm").style.display = "none";
        } else {
            document.getElementById("m").style.display = "inline-block";
            document.getElementById("mm").style.display = "inline";
        }

        if (days) {
            datH += datD * 24;
            document.getElementById("d").style.display = "none";
            if (months) document.getElementById("dd").style.display = "none";
            else document.getElementById("dd").style.display = "inline";
        } else {
            document.getElementById("d").style.display = "inline-block";
            document.getElementById("dd").style.display = "inline";
        }

        if (hours) {
            datMi += datH * 60;
            document.getElementById("h").style.display = "none";
            if (months && days) document.getElementById("hh").style.display = "none";
            else document.getElementById("hh").style.display = "inline";
        } else {
            document.getElementById("h").style.display = "inline-block";
            document.getElementById("hh").style.display = "inline";
        }

        if (minutes) {
            datS += datMi * 60;
            document.getElementById("mi").style.display = "none";
            if (months && days && hours) document.getElementById("mimi").style.display = "none";
            else document.getElementById("mimi").style.display = "inline";
        } else {
            document.getElementById("mi").style.display = "inline-block";
            document.getElementById("mimi").style.display = "inline";
        }

        if (seconds) {
            datMs += datS * 1000;
            document.getElementById("s").style.display = "none";
            if (months && days && hours && minutes) document.getElementById("ss").style.display = "none";
            else document.getElementById("ss").style.display = "inline";
        } else {
            document.getElementById("s").style.display = "inline-block";
            document.getElementById("ss").style.display = "inline";
        }

        if (milliseconds) {
            document.getElementById("ms").style.display = "none";
        } else {
            document.getElementById("ms").style.display = "inline-block";
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

const le = leapYear(new Date().getFullYear());

function leapYear(year) {
    if ((year % 100 === 0) && (year % 400 !== 0)) return false;
    else return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
}

function leap() {
    if (le) return 29;
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
    if (hh.id === "months") {
        months = document.getElementById(hh.id).checked;
        localStorage.setItem("a1", document.getElementById(hh.id).checked);
    } else if (hh.id === "days") {
        days = document.getElementById(hh.id).checked;
        localStorage.setItem("a2", document.getElementById(hh.id).checked);
    } else if (hh.id === "hours") {
        hours = document.getElementById(hh.id).checked;
        localStorage.setItem("a3", document.getElementById(hh.id).checked);
    } else if (hh.id === "minutes") {
        minutes = document.getElementById(hh.id).checked;
        localStorage.setItem("a4", document.getElementById(hh.id).checked);
    } else if (hh.id === "seconds") {
        seconds = document.getElementById(hh.id).checked;
        localStorage.setItem("a5", document.getElementById(hh.id).checked);
    } else if (hh.id === "milliseconds") {
        milliseconds = document.getElementById(hh.id).checked;
        localStorage.setItem("a6", document.getElementById(hh.id).checked);
    }
    if (document.getElementById(hh.id).checked)
        count--;
    else count += 1;
    if (count === 1) {
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
}

function monthday(gg) {
    switch (gg) {
        case 0:
            return 31;
        case 1:
            return leap();
        case 2:
            return 31;
        case 3:
            return 30;
        case 4:
            return 31;
        case 5:
            return 30;
        case 6:
            return 31;
        case 7:
            return 31;
        case 8:
            return 30;
        case 9:
            return 31;
        case 10:
            return 30;
        case 11:
            return 31;
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