/**
 * 
 * 
 * 
 * id="dropdown" day dropdown
 * id="prev-hour" previous hours
 * look up lunch because it's confusing
 * look up day/night
 * #startTimeHr #startTimeMin #endTimeHr #endTimeMin
 * submit
 */

var day = document.getElementById("dropdown");
var prevHr = document.getElementById("prev-hour");
var startTimeHr = document.getElementById("startTimeHr");
var startTimeMin = document.getElementById("startTimeMin");
var endTimeHr = document.getElementById("endTimeHr");
var endTimeMin = document.getElementById("endTimeMin");
var lunch = document.getElementById("");
var nightDayShift = 0;

var startTime, endTime, mornEnd, evenStart, regPossible;
var sd = 0;
var sdot = 0;
var count = 0;
var countOt = 0;
var totalHours;
var data = [];

//40 - totalhours = possible regular hours 
/**
 * 
240 x 6min = 1440min = 24hr
04.50 = 45
21.3 = 213
day[0-59] = morning shift dif
day [211-239] = evening shift dif
count x 10 => display
 * 
 */

 function yeet(){
    convertTime();

 }

function calculateDay(array){
for(var i = 0; i<array.length-1;i++){
    if(array[i] < 60 || array[i] > 210){
        if(regPossible>0){
        sd++, count++, regPossible--;
    }else{
        sdot++, countOt++;
        }
    }else if (regPossible>0){
        count++, regPossible--;
    }else if(regPossible<=0){
        countOt++;
    }
        
}
console.log("count: " + count + " countOt: " + countOt + " sd: " + sd.toFixed(1) + " sdot: " + sdot.toFixed(1));
}


function createDayShift(x){
    if (startTime > endTime) {
        castAlert();
    } else {
        totalHours = (endTime - startTime);
    }
    return createShiftArray(startTime, endTime);
}

function createNightShift(x){
    return createNightShiftArray();
}

function createNightShiftArray(){
    var time = [];
    for(var i = 0; i <= startTime; i++){
        time.push(i.toFixed(1));
    }
    for(var i = endTime; i < 240; i++){
        time.push(i.toFixed(1));
    }
    return time;
}

function createShiftArray(start, end){
    var time = [];
    for (var i = start; i <= end; i++) {
        time.push(i);
    }
    return time;
}

function castAlert(){
    $('#alert-text').text('Your shift cannot end before it starts. Did you mean Night Shift?');
        document.getElementById("alert").style.display = "block";
        document.getElementById("closebtn").style.display = "block";
}

function createDay(){
    var day = [];
    for (var i = 0; i<240; i+=1){
        day.push(i);
    }
    return day;
}

function convertTime(){
        startTime = (data[4].value + (data[5].value / 60).toFixed(1))*10;
        endTime = (data[6].value + (data[7].value / 60).toFixed(1))*10;

        if(data[3].value === "day"){
            regPossble = 40 - (endTime - startTime);
        }else if(data[3].value === "night"){
            regPossible = 40 ((24 - endTime) + startTime);
        }

}

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
    });
    //prevent page refresh on submit
    event.preventDefault();
    convertTime(data);
    (data[3].value === "night") ? calculateDay(createNightShift(data)) : calculateDay(createDayShift(data));
    prevHr = data[1].value;
    return data;

});

/**
 * useless nonesense
 * 0: {name: "day", value: "sat"}
1: {name: "prev-hr", value: 12}
2: {name: "lunch-toggler", value: 0}
3: {name: "shift-toggler", value: "day"}
4: {name: "startTimeHr", value: 6}
5: {name: "startTimeMin", value: 0}
6: {name: "endTimeHr", value: 18}
7: {name: "endTimeMin", value: 0}
 */

/***
 * input times to mock timesheet
 * document.getElementById("overtime-hour").value = overTimeHr;
    document.getElementById("reg-hr").value = regHr;
    document.getElementById("reg-hr-pm").value = ":^)"; //friday
    document.getElementById("shift-dif-ot").value = shiftDifHrOT;
    document.getElementById("shift-dif-reg").value = shiftDifHr;
    document.getElementById("shift-dif-reg-pm").value = 0; //friday
    
 */