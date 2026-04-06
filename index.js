const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
let isdrawing=false;
let points=[];

//functions
function calculateperimeter(){
    let perimeter=0;
    for (let i = 0; i < points.length-1; i++) {
    perimeter = perimeter + Math.sqrt(Math.pow(points[i+1].x - points[i].x, 2) + Math.pow(points[i+1].y - points[i].y, 2))
}
    return perimeter;
}
function determinecenter(){
    let center = {x: 0, y: 0}
    for (let i = 0; i < points.length-1; i++) {
        center.x=center.x+points[i].x;
        center.y=center.y+points[i].y;
    }
    center.x=center.x/points.length;
    center.y=center.y/points.length;
    return center;
}
function calculateradius(center){
    let radius=0;
    for (let i = 0; i < points.length-1; i++) {
        radius=radius+(Math.sqrt(Math.pow(points[i].x - center.x, 2) + Math.pow(points[i].y - center.y, 2)))
}
     radius=radius/points.length;
     return radius;
}
function calculatepi(radius, perimeter){
    let pi=perimeter/(2*radius);
    return pi;
}
function checkiscircle(center,radius){
    iscircle = false;
    // deviation check
    let deviation = 0;
    for(let i = 0; i < points.length-1; i++){
        let distance = Math.sqrt(Math.pow(points[i].x - center.x, 2) + Math.pow(points[i].y - center.y, 2));
        deviation += Math.abs(distance - radius);
    }
    let averagedeviation = deviation / points.length;
    let deviationper = averagedeviation / radius;
    // bounding box ratio check
    let minX = Math.min(...points.map(p => p.x));
    let maxX = Math.max(...points.map(p => p.x));
    let minY = Math.min(...points.map(p => p.y));
    let maxY = Math.max(...points.map(p => p.y));
    let ratio = (maxX - minX) / (maxY - minY);
    console.log("deviation:", deviationper, "ratio:", ratio)
    if(deviationper < 0.5 ){
        iscircle = true;
    }
    return iscircle;
}

function calculateaccuracy(pi){
    let diffrence = Math.abs(Math.PI-pi);
    let accuracy= 100 - (diffrence / Math.PI )* 100;
    return accuracy;
}
function accuracymsg(accuracy){
    if (accuracy >= 98) {
    return "Almost perfect !!"}
     else if (accuracy >= 95 && accuracy < 98) {
    return "You were so close !!"}
     else if (accuracy >= 80 && accuracy < 95) {
    return "Well done !!"}
     else if (accuracy >= 50 && accuracy < 80) {
    return "Nice try"}
     else {return "CHAOS"}
}
//mouse events
canvas.addEventListener('mousedown', function(e) {
    points=[];
    isdrawing=true;
})
canvas.addEventListener('mousemove', function(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (isdrawing==true && points.length > 0){
        ctx.beginPath()
        ctx.moveTo(points[points.length-1].x, points[points.length-1].y)
        ctx.lineTo(x, y)
        ctx.stroke()
        }
        if (isdrawing==true){
         points.push({x, y})
    }
    })


//giving the values
canvas.addEventListener("mouseup",function(e){
    if(points.length < 10) return;
    isdrawing=false;
    let startPoint = points[0]
    let endPoint = points[points.length-1]
    let gap = Math.sqrt(Math.pow(endPoint.x - startPoint.x, 2) + Math.pow(endPoint.y - startPoint.y, 2))
    let center=determinecenter();
    let radius=calculateradius(center);
    if (gap >50 || !checkiscircle(center,radius)) {
        document.getElementById('error').innerHTML = "Make sure to draw the circle correctly !!<br> <span id='tip'>Tip: make sure to close it at the end</span>"
        document.getElementById('error').style.visibility = 'visible';
        return
}
    let perimeter=calculateperimeter();
    let pi=calculatepi(radius,perimeter);
    let accuracy=calculateaccuracy(pi);
    let msg=accuracymsg(accuracy);
    document.getElementById('result').innerHTML = "Your π: " + pi.toFixed(5);
    document.getElementById('accuracy').innerHTML = "your circle is " + accuracy.toFixed(2) + "% close to a perfect circle ";
    document.getElementById('msg').innerHTML = msg;
    document.getElementById('result').style.visibility = 'visible';
    document.getElementById('accuracy').style.visibility = 'visible';
    document.getElementById('msg').style.visibility = 'visible';
})