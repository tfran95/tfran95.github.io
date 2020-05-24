//24hr time format
//total hours > 40 = overtime
//hours in range 2100-0600 (21-6), or >21, <6 are shift differential
//friday specific case: hours on friday after 1200 are PM
//start time h.m
//end time h.m
//0.5 lunch
var prevHr;
var startTime;
var endTime;
var regHr;
var overTimeHr;
var totalHours;
var morningHour;
var eveningHour;
var shiftDifHr;
var shiftDifHrOT;
var lunch;
var day = 1; //idk what i was doing with this, maybe friday functionality idk

/*
data[0].value = "sun"
data[1].value = lunchTime as int (0 = day, 1 = night)
data[2].value = shift-toggler as 'day' or 'night' - used to choose calc function
data[3].value = startTimeHr as int
data[4].value = startTimeMin as int
data[5].value = endTimeHr as int
data[6].value = endTimeMin as int 

*/

//create dataArray of form data {name:value}
$('#timesheet-form').submit(function (event) {
    var dataArray = $(this).serializeArray(),
        dataObj = {};

    $(dataArray).each(function (i, field) {
        dataObj[field.name] = field.value;
    });
    //convert value properties to int
    data = dataArray.map(function (obj) {
        var value;
        //only convert strings of numbers
        (!isNaN(obj.value)) ? (value = parseFloat(obj.value)) : (value = obj.value);
        return {
            name: obj.name,
            value: value
        };
    })
    //prevent page refresh on submit
    event.preventDefault();
    //(data[2].value === "night") ? nightShift() : dayShift();
    prevHr = data[1].value;
    lunch = data[2].value;
    calculateHours();
    subLunch();
    console.log(totalHours);
    console.log(shiftDifHr);
    console.log(overTimeHr);
    document.getElementById("overtime-hour").value = overTimeHr;
    document.getElementById("reg-hr").value = regHr;
    document.getElementById("reg-hr-pm").value = "N/A"; //friday
    document.getElementById("shift-dif-ot").value = shiftDifHrOT;
    document.getElementById("shift-dif-reg").value = shiftDifHr;
    document.getElementById("shift-dif-reg-pm").value = 0; //friday
    
});
//Toggle help tesk for day/night shifts -----
$(function () {
    $("[id=toggler-night]").click(function () {
        $('#time-label-start').text('Time your earlier shift ended:');
        $('#time-label-end').text('Time your later shift started::');
        $('#time-help-text').show();

    });
    $("[id=toggler-day]").click(function () {
        $('#time-label-start').text('Start:');
        $('#time-label-end').text('End:');
        $('#time-help-text').hide();

    });
});





function calculateHours() {
    regHr = (data[3].value === "night") ? nightShift() : dayShift();
    if ((regHr + prevHr - 0.5) > 40.0) {
        overTime();
        calcShiftDif();
    } else {
        regularTime(); // only regular time
        calcShiftDif();
    }
}

function subLunch() {
    if (lunch = 0) {
        regHr -= 0.5;
        console.log("subtracted from reg")
    } else {
        if(regHr >= 0.5){
        regHr -= 0.5;
        }else{
            overTimeHr -= 0.5;
        }

        if(shiftDifHr >=0.5){
        shiftDifHr -= 0.5;
        }else{
            shiftDifHrOT -=0.5;
        }
        console.log("subtracted from shiftdif")
    }
    console.log("didnt do shit");
}

function nightShift() {
    endHr = data[4].value;
    endMin = data[5].value / 60;
    startHr = data[6].value;
    startMin = data[7].value / 60;
    morningHour = (endHr + endMin);
    eveningHour = 24 - (startHr + startMin);

    totalHours = (morningHour + eveningHour);
    return totalHours;
}

function dayShift() {
    startHr = data[4].value;
    endHr = data[6].value;
    startMin = data[5].value / 60;
    endMin = data[7].value / 60;
    startTime = startHr + startMin;
    endTime = endHr + endMin;
    if (startHr > endHr) {
        $('#alert-text').text('Your shift cannot end before it starts. Did you mean Night Shift?');
        document.getElementById("alert").style.display = "block";
        document.getElementById("closebtn").style.display = "block";
    } else {
        totalHours = (endTime - startTime);
        return totalHours;
    }
}

function isFriday() {

}

function overTime() {

    if (prevHr < 40) {
        regHr = (40 - prevHr);
        console.log(regHr + " regular hours")
        overTimeHr = totalHours - regHr;
        console.log(overTimeHr + " overtime hours");
    } else {
        overTimeHr = totalHours;
        regHr = 0;
        console.log(overTimeHr + " only overtime");
    }
}

function calcShiftDif() {
    if (day === 0) {
        if (startTime > 6.0 && endTime < 21.0) {
            shiftDifHr = 0;
        }
        else if (startTime < 6.0 && endTime < 21.0) {
            shiftDifHr = 6 - startTime;
        }
        else if (startTime > 6.0 && endTime > 21.0) {
            shiftDifHr = endTime - 21;
        }
        else if (startTime < 6 && endTime > 21) {
            shiftDifHr = (6 - startTime) + (endtime - 21);
        }
        else {
            console.log("by no means should you be seeing this");
        }
        console.log(shiftDifHr + " hours to shift dif");


    } else if (day === 1) {
        var morningShiftDif;
        var eveningShiftDif;

        //check mornings
        if (morningHour >= 6.0) {
            morningShiftDif = 6;
        } else if (morningHour < 6.0) {
            morningShiftDif = morningHour;
        } else {
            morningShiftDif = 0;
        }
        //check evening
        if ((24 - eveningHour) < 21.0) {
            eveningShiftDif = 3.0;
        } else if ((24 - eveningHour) >= 21) {
            eveningShiftDif = eveningHour;
        }

        shiftDifHr = eveningShiftDif + morningShiftDif;
    }

    if(prevHr >= 40){
        shiftDifHrOT = shiftDifHr;
        shiftDifHr = 0;
    }else if((prevHr + shiftDifHr) > 40){
        shiftDifHr = (40 - prevHr);
        shiftDifHrOT = ((prevHr + shiftDifHr) - 40);
    }
    
}

function regularTime(b) {
    overTimeHr = 0;
    regHr = totalHours;
}


function inRange(x, min, max) {
    return ((x - min) * (x - max) <= 0);
}