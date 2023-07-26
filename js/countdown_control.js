/*-------获取元素区--------*/
// 获取环形条
let progress_ring=document.getElementById("progress-ring")
const svgns = "http://www.w3.org/2000/svg"; //svg命名空间

let ball=document.getElementById("ball")

// 获取suv下面的数字显示器
let numerial_time=document.getElementById('numeral-time');

// 获取设置时间的按钮
let submit_btn = document.querySelector('#submit_button');

// 获取时分秒输入框
let hour_bar = document.querySelector('#hour_bar')
let minute_bar = document.querySelector('#minute_bar')
let second_bar = document.querySelector('#second_bar')

// 获取交互按钮
let pause_btn = document.querySelector("#pause")
let reset_btn = document.querySelector("#reset")
let cancel_btn = document.querySelector("#cancel")

// 获取区域
let set_time_area = document.querySelector("#set_time_area")
let btn_area = document.querySelector("#button_area")
btn_area.style.visibility="hidden";

// 获取结束音频
let timeup = document.querySelector("#timeup")

/*---------------------------------*/

const cx=200,cy=200,r=160; 

// 环形的完整周长
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

// 画环形条缩减
function drawClock() {
    let percentage = clock.global_tick / origin_tick
    setRingPercentage.apply(progress_ring,[percentage])
    setBallPosition.apply(ball,[1-percentage])
}

// 画数字显示器
function drawNumerialTime() {
    numerial_time.textContent = clock.getTimeString();
}

// 倒计时运行控制
let timer = undefined
let origin_tick
let counting = false
function run(){
    drawClock()
    drawNumerialTime()
    if(clock.global_tick <= 0){
        setTimeout(()=>{alert("时间终了！")}, 50)
        timeup.play()
        set_time_area.style.visibility="visible";
        btn_area.style.visibility="hidden";
        pause_btn.style['background-image'] = 'url(\'../img/play.png\')'
        clearInterval(timer)
        timer = undefined
        counting = false
        return
    }
    //记录总时间，用于计算剩下时间的比例
    clock.jumpToPreviousTick()
}

// 交互部分——设置时间
let time = [0, 0, 0, 0]
submit_btn.addEventListener('click',()=>{
    time[0] = hour_bar.value
    time[1] = minute_bar.value
    time[2] = second_bar.value
    let all_zero = true
    // 输入合法性检查
    for(let i = 0; i < 3; i++){
        if(time[i] === ""){
            alert("请设置时间非空！")
            return
        }
        if(time[i] != 0)
            all_zero = false
    }
    if(all_zero){
        alert("请设置时间非0！")
        return
    }
    if(time[1] < 0 || time[1] >= 60 || time[2] < 0 || time[2] > 60){
        alert("请设置分、秒数小于60！")
        return
    }
    // 开始设置
    pause_btn.style['background-image'] = 'url(\'../img/pause.png\')'
    clock.setTime(...time) //给clock设置时间
    origin_tick = clock.global_tick
    if(timer === undefined){
        set_time_area.style.visibility="hidden";
        btn_area.style.visibility="visible";
        timer = setInterval("run()", 50)
        counting = true
    }
}, false)

// 交互部分——暂停
pause_btn.addEventListener('click', ()=>{
    if(!counting) return;
    if(timer === undefined){
        timer = setInterval("run(clock)", 50);
        pause_btn.style['background-image'] = 'url(\'../img/pause.png\')'
    }else{
        clearInterval(timer)
        timer = undefined
        pause_btn.style['background-image'] = 'url(\'../img/play.png\')'
    }
})

// 交互部分——重置
reset_btn.addEventListener('click', ()=>{
    for(let num of time){
        if(num != 0){
            clock.setTime(...time)
            drawClock()
            drawNumerialTime()
            return
        }
    }
})

// 交互部分——删除
cancel_btn.addEventListener('click', ()=>{
    time = [0, 0, 0, 0]
    clock.setTime(0, 0, 0, 0)
    setRingPercentage.apply(progress_ring, [1])
    setBallPosition.apply(ball, [1])
    drawNumerialTime()
    if(counting){
        set_time_area.style.visibility="visible";
        btn_area.style.visibility="hidden";
        pause_btn.style['background-image'] = 'url(\'../img/play.png\')'
        clearInterval(timer)
        counting = false
        timer = undefined
    }
})

