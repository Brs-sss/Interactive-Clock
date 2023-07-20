/*-------获取元素区--------*/
//获取环形条
let progress_ring=document.getElementById("progress-ring")
const svgns = "http://www.w3.org/2000/svg"; //svg命名空间

//获取suv下面的数字显示器
let numerial_time=document.getElementById('numeral-time');

//获取设置时间的按钮
let settime_btn=document.getElementById('set-time-button');

/*---------------------------------*/

let length = 2 * Math.PI * progress_ring.getAttribute("r")

function setRingPercentage(percentage) {
    this.style.strokeDasharray=length;
    this.style.strokeDashoffset = length - length * percentage;
    //this.style.transition = "stroke-dashoffset .5s ease-in-out";

}

/*setRingPercentage.apply(progress_ring,[0.9])
setTimeout(()=>{setRingPercentage.apply(progress_ring,[0.7])},3000)*/

let clock=new Clock;


function drawClock(origin_tick) {
    setRingPercentage.apply(progress_ring,[clock.global_tick / origin_tick])
}

//画数字显示器
function drawNumerialTime() {
    numerial_time.textContent = clock.getTimeString();
}


settime_btn.addEventListener('click',()=>{
    var time=prompt('请输入时间',clock.getTimeString());
    let times=time.split(':').map((x)=>{return Number(x)})
    clock.setTime(...times,0)
    let origin_tick = clock.global_tick
    let timer_id=setInterval(()=>{
        drawClock(origin_tick)
        drawNumerialTime()
        console.log(clock.getTimeString())
        if(clock.jumpToPreviousTick()){
            clearInterval(timer_id)
        }
    },50)
},false)

