/*-------获取元素区--------*/
//获取环形条
let progress_ring=document.getElementById("progress-ring")
const svgns = "http://www.w3.org/2000/svg"; //svg命名空间

let ball=document.getElementById("ball")

//获取suv下面的数字显示器
let numerial_time=document.getElementById('numeral-time');

//获取设置时间的按钮
let settime_btn=document.getElementById('set-time-button');

/*---------------------------------*/

const cx=250,cy=250,r=200; 

//环形的完整周长
let length = 2 * Math.PI * progress_ring.getAttribute("r")

/**
 * 用于设置page上的环形部分的比例
 * @param {Number} percentage 环形橙色填充部分的百分率
 */
function setRingPercentage(percentage) {
    this.style.strokeDasharray=length;
    this.style.strokeDashoffset = length - length * percentage;
    //this.style.transition = "stroke-dashoffset .5s ease-in-out";

}

function Rad_percentage(percentage) {
    return Math.PI * 2 *percentage;
}



function setBallPosition(percentage) {
    this.setAttribute('cx',cx - r * Math.sin(Rad_percentage(percentage)))
    this.setAttribute('cy',cy - r * Math.cos(Rad_percentage(percentage)))
}

let clock=new Clock;

//画环形条缩减
function drawClock(origin_tick) {
    let percentage = clock.global_tick / origin_tick
    setRingPercentage.apply(progress_ring,[percentage])
    setBallPosition.apply(ball,[1-percentage])
}

//画数字显示器
function drawNumerialTime() {
    numerial_time.textContent = clock.getTimeString();
}


settime_btn.addEventListener('click',()=>{
    var time = prompt('请输入时间',clock.getTimeString()); //点击按钮弹出输入框
    let times = time.split(':').map((x)=>{return Number(x)}) //解析用户输入
    clock.setTime(...times,0) //给clock设置时间
    let origin_tick = clock.global_tick //记录总时间，用于计算剩下时间的比例
    let stop = false;  //倒计时是否停止？
    let timer_id = setInterval(()=>{  //保留id便于停止倒计时
        drawClock(origin_tick)
        drawNumerialTime()
        if(stop) { //如果倒计时停止
            clearInterval(timer_id) 
            setTimeout(()=>{   //延迟50ms弹出提示框，原因在于防止浏览器渲染不及时，导致环形条无法正常清零
                alert("时间到了！")  
            },50)
        }
        stop = clock.jumpToPreviousTick()
    },50)
},false)

