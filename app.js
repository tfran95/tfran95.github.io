var startTime = 45; //input
var endTime = 100; //input
var mornEnd = 52; //input
var evenStart = 162; //input
const day = createDay();
var sd = 0;
var sdot = 0;
var reg = 0;
var ot = 0;
var prevHr; //input 
var count = 0;
var countOt = 0;

//40 - totalhours = possible regular hours 
var regPossible = 150;

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
    (data[2].value === "night") ? calculateDay(createDayShift) : calculateDay(createNightShift);
    return data;
});

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


function createDayShift(){
    if (startTime > endTime) {
        castAlert();
    } else {
        totalHours = (endTime - startTime);
    }
    return createShiftArray(startTime, endTime);
}

function createNightShift(){
    return createNightShiftArray(mornEnd, evenStart);
}

function createNightShiftArray(){
    var time = [];
    for(var i = 0; i <= morn; i++){
        time.push(i.toFixed(1));
    }
    for(var i = even; i < 240; i++){
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


/***
 * 
 * document.getElementById("overtime-hour").value = overTimeHr;
    document.getElementById("reg-hr").value = regHr;
    document.getElementById("reg-hr-pm").value = ":^)"; //friday
    document.getElementById("shift-dif-ot").value = shiftDifHrOT;
    document.getElementById("shift-dif-reg").value = shiftDifHr;
    document.getElementById("shift-dif-reg-pm").value = 0; //friday
    
 */