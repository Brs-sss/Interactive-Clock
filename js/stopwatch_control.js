// import { Clock } from "./clock.js";

// 获取背景盒
let box = document.querySelector('.box');
const svgns = "http://www.w3.org/2000/svg"; //svg命名空间

function Rad(degree) {
    return degree*Math.PI/180;
}

/**
 * 为circle对象设置几何相关参数
 * @param {Number} cx 圆心的x坐标
 * @param {Number} cy 圆心的y坐标
 * @param {Number} r 半径
 */
function setGeometry(cx, cy, r){
    this.setAttribute('cx', cx)
    this.setAttribute('cy', cy)
    this.setAttribute('r', r)
}

// 页面初始化 —— 表盘绘制
var circleContainer = document.createDocumentFragment()
let marks = [], marks_color = []
const cx = 250, cy = 250, r = 180, dot_r = 4 //表盘的中心、内径、半径
for(let i = 0; i < 60; i++)
{
    let newCircle = document.createElementNS(svgns, 'circle')

    setGeometry.apply(newCircle, 
    [cx + r * Math.sin(Rad(6*i)), cy - r * Math.cos(Rad(6*i)), dot_r])

    newCircle.setAttribute('fill', 'Gainsboro') // #DCDCDC
    newCircle.setAttribute('stroke','gray')
    newCircle.setAttribute('stroke-width','0px')
    circleContainer.appendChild(newCircle)
    marks.push(newCircle)
    marks_color.push(0)
}
box.append(circleContainer);

// 表针绘制
let pointer = document.querySelector('#pointer');
const inside_r = 160
setGeometry.apply(pointer, [cx, cy - inside_r, 6])

// 动画效果制作
let time_content = document.querySelector("#time")
// 渐变颜色数组
let Colors = ['Gainsboro', '#C6D4DF', '#B1CDE3', '#9CC3E3', '#87BAEB', '#72B2EF', '#5DA9F3', '#48A1F7', '#3398FB', 'DodgerBlue']
let clock = new Clock  // 内核逻辑时钟

// 自增函数
function run(clock) {
    let angle = clock.getAngle()[2]
    // 更新指针位置
    setGeometry.apply(pointer, 
    [cx + inside_r * Math.sin(Rad(angle)), cy - inside_r * Math.cos(Rad(angle)), 5])
    // 更新标记点颜色
    if(clock.tick == 0){
        let pointed = clock.second
        marks_color[pointed] = 9;
        marks[pointed].setAttribute('fill', Colors[9])
        for(let i = 1; i < 10; i++){
            let tar = pointed - i
            if(tar < 0) tar += 60
            if(marks_color[tar] > 0){
                marks[tar].setAttribute('fill', Colors[--(marks_color[tar])])
            }
        }
    }
    clock.printNow();
    time_content.textContent = clock.getTimeString() + (Math.floor(clock.tick/2) * 0.1).toFixed(1).substring(1)
    clock.jumpToNextTick()
}

// 按钮控制
let timer = undefined;
let pauseBtn = document.querySelector("#pause")
pauseBtn.addEventListener('click', ()=>{
    if(timer === undefined){
        timer = setInterval("run(clock)", 50);
        pauseBtn.style['background-image'] = 'url(\'../img/pause.png\')'
    }else{
        clearInterval(timer)
        timer = undefined
        pauseBtn.style['background-image'] = 'url(\'../img/play.png\')'
    }
})

let resetBtn = document.querySelector("#reset")
resetBtn.addEventListener('click', ()=>{
    if(timer === undefined){
        // 清空颜色
        let pointed = clock.second
        while(marks_color[pointed] != 0){
            marks_color[pointed] = 0
            marks[pointed].setAttribute('fill', Colors[0])
            pointed--
            if(pointed < 0) pointed += 60
        }
        // 设置文本
        clock.setTime(0, 0, 0, 0)
        time_content.textContent = '00:00:00.0'
        setGeometry.apply(pointer, [cx, cy - inside_r, 6])
    }
})