//import {Clock} from './clock.js'
//bug：import这里一直不行，大家也可以试一试。就是import Clock这个类时浏览器一直会报错
//所以目前为了不耽误进度，只能手动吧Clock的代码复制过来，大家需要Clock时也先复制吧

/*-----------获取html元素区----------*/
//获取svg画布元素
let canvas=document.getElementById('main-canvas');
const svgns = "http://www.w3.org/2000/svg"; //svg命名空间

//获取suv下面的数字显示器
let numerial_time=document.getElementById('numeral-time');

//获取设置时间的按钮
let settime_btn=document.getElementById('set-time-button');

/*---------------------------------*/

//将角度转化为弧度
function Rad(degree){
    return degree*Math.PI/180;
}


///页面初始化时，绘制所有的表盘刻度（包括大刻度和小刻度）
var lineContainer=document.createDocumentFragment();
const cx=250,cy=250,r_in=170,r_mid=180,r_out=190;  //表盘的中心、内径、中径、外径
for(let i=0;i<60;i++)
{
    const newLine=document.createElementNS(svgns,'line');
    if(i%5!=0)
    {
        newLine.setAttribute('x1',cx+r_mid*Math.sin(Rad(6*i)));
        newLine.setAttribute('y1',cy-r_mid*Math.cos(Rad(6*i)));
        newLine.setAttribute('x2',cx+r_out*Math.sin(Rad(6*i)));
        newLine.setAttribute('y2',cy-r_out*Math.cos(Rad(6*i)));
        newLine.setAttribute('stroke',' #67af9e');
        newLine.setAttribute('stroke-width','2px');
        lineContainer.appendChild(newLine);
    }
    else{
        newLine.setAttribute('x1',cx+r_in*Math.sin(Rad(6*i)));
        newLine.setAttribute('y1',cy-r_in*Math.cos(Rad(6*i)));
        newLine.setAttribute('x2',cx+r_out*Math.sin(Rad(6*i)));
        newLine.setAttribute('y2',cy-r_out*Math.cos(Rad(6*i)));
        newLine.setAttribute('stroke','#00F4E4');
        newLine.setAttribute('stroke-width','7px');
        lineContainer.appendChild(newLine);
    }
}
canvas.append(lineContainer);




/****设置时分秒针的角度****
 * @param {Number} degree 时分秒针的角度
 * @param {Number} radius 针的长度
*********/
function drawAngle(degree,radius)
{
    this.setAttribute('x2',cx+radius*Math.sin(Rad(degree)));
    this.setAttribute('y2',cy-radius*Math.cos(Rad(degree)));
    //console.log('angle:'+degree);
}


//获取秒针 分针 时针的元素
let secondHand=document.getElementById('second-hand');
let minuteHand=document.getElementById('minute-hand');
let hourHand=document.getElementById('hour-hand');
//设定秒针 分针 时针的长度
const r_sec=190, r_min=160, r_hour=100;

//新建控制图形表盘的clock
let clock=new Clock();

/**
 * 将时分秒绘制到页面上  具体画的样式由drawAngle规定。每个表盘可以实现不同的绘制方法
 * @param {*} hour_angle 
 * @param {*} minute_angle 
 * @param {*} second_angle 
 */
function drawClock(hour_angle, minute_angle, second_angle) {
    drawAngle.apply(secondHand,[second_angle,r_sec])
    drawAngle.apply(minuteHand,[minute_angle,r_min])
    drawAngle.apply(hourHand,[hour_angle,r_hour])
}

//画数字显示器
function drawNumerialTime() {
    numerial_time.textContent = clock.getTimeString();
    // console.log('time', clock.getTimeString)
}


/**
 * 表盘和数字显示器运行函数 每隔一个tick 更新一次绘制的样式
 * @return 返回此setInterval函数的id，用于将来停止运行
 */
function clockRun() {
    return setInterval(()=> {
    drawClock(...clock.getAngle())
    drawNumerialTime()
    clock.jumpToNextTick()
},50)}

let initial_run_id=clockRun()  //开始运行,initial_run_id就是初始化那一次运行的函数id
//可以用


//点击按钮设置时间
settime_btn.addEventListener('click',()=>{
    var time=prompt('请输入时间',clock.getTimeString());
    let times=time.split(':').map((x)=>{return Number(x)})
    clock.setTime(...times,0)
},false)

/**
 * 
 * @param {Number} degree 该针一秒走的角度（°） 时针：30/(60*60) 分针：6/60 秒针:6
 * 函数原理：获取该针移动的角度，计算出global_tick的变化量，更新
 */

function addMouseEvent(degree) {
    let dragging = false

    this.addEventListener('mousedown', (event)=> {
        dragging = true
        this.style.cursor = 'grab' // 改变光标的样式
        delta_x = event.clientX - (cx+canvas.getBoundingClientRect().left);
        delta_y = event.clientY - (cy+canvas.getBoundingClientRect().top); // 获得中心点在整个窗口中的坐标
        //clearInterval(initial_run_id)
        window.addEventListener('mouseup', (event) => {
            //initial_run_id=clockRun()
            dragging = false
        })
    })

    window.addEventListener('mousemove', (event) => {
        if(dragging) { // 获得此时的时间
            let current_ticks = clock.global_tick
            this.style.cursor = 'grab' // 改变光标的样式
            console.log('current_ticks: ', current_ticks)
            let angles = clock.getAngle()
            console.log('angles: ', angles)
            delta_x = event.clientX - (cx+canvas.getBoundingClientRect().left);
            delta_y = event.clientY - (cy+canvas.getBoundingClientRect().top);
            let index = 0; // 时针：0 分针：1 秒针：2
            if (degree==6) index = 2
            else if (degree==6/60) index = 1
            else if (degree==30/(60*60)) index = 0
            delta_angle = function(){
                temp_angle = Math.atan2(Math.abs(delta_x), Math.abs(delta_y))
                if (delta_x>=0 && delta_y>=0) return Math.PI-temp_angle
                if (delta_x>=0 && delta_y<0) {
                    if (angles[index]>=350) {
                        console.log('special', [angles[index],  2*Math.PI+temp_angle, (2*Math.PI+temp_angle)*180/Math.PI, (2*Math.PI+temp_angle)*180/Math.PI-angles[index]])
                        return 2*Math.PI+temp_angle
                    } 
                      return temp_angle
                }
                if (delta_x<0 && delta_y>=0)  return Math.PI+temp_angle
                else if (delta_x<0 && delta_y<0) {
                    console.log('<0 <0', [angles[index]<=10, angles[index]])
                    if (angles[index]<=10) {
                        console.log('special', -1*temp_angle)
                        return -1*temp_angle
                    } 
                    return 2*Math.PI-temp_angle
                } 
                
            } 
            if (current_ticks+parseInt((180*delta_angle()/Math.PI-angles[index])/degree*20) < 0) clock.global_tick = 0
            else clock.global_tick = current_ticks+parseInt((180*delta_angle()/Math.PI-angles[index])/degree*20)
            console.log("new global_tick: ", clock.global_tick)
        }
    })
    
}

/**
 * 对时分秒针进行监听
 */
function addClockEventListener() {
    secondHand.draggable = true
    minuteHand.draggable = true
    hourHand.draggable = true
    
    addMouseEvent.apply(secondHand, [6])
    addMouseEvent.apply(minuteHand, [6/60])
    addMouseEvent.apply(hourHand, [30/(60*60)])
}

addClockEventListener()





















