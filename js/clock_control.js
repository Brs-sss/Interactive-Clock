//import {Clock} from './clock.js'
//bug：import这里一直不行，大家也可以试一试。就是import Clock这个类时浏览器一直会报错
//所以目前为了不耽误进度，只能手动吧Clock的代码复制过来，大家需要Clock时也先复制吧
class Clock{
    //{hour,minute,second,tick}是唯一的tick坐标
    //tick的含义是50ms，每个tick表面会更新动画一次，tick=0意思是{hour,min,sec,milli}={0,0,0,0}
            //tick=1意味着{hour,min,sec,milli}={0,0,0,50} 那么当表盘的周期hour=12h,对应的tick数是864,000
    constructor() {
        this.hour = 0;   //时针1h（60000*3600ms）转30度 2min=120,000ms转1度 
        this.minute = 0; //分针1min（60000ms）转 6度
        this.second = 0; //秒针1s转 6度
        this.tick = 0;     
    }


    /**
     * global的tick数，范围是0～864,000
     */
    get global_tick() {
        return this.hour * 72000 + this.minute * 1200 + this.second * 20 + this.tick
    }

    set global_tick(g) {
        this.tick = g % 20
        g = Math.floor(g / 20)
        this.second = g % 60
        g = Math.floor(g / 60)
        this.minute = g % 60
        g = Math.floor(g / 60)
        this.hour = g % 12
    }

    /**
     * 用于tick自增,考虑时分秒的进位
     */
    jumpToNextTick() {
        this.tick++;
        if(this.tick === 20){
            this.tick = 0;
            this.second++;
            if(this.second === 60){
                this.second = 0;
                this.minute++;
                if(this.minute === 60){
                    this.minute = 0;
                    this.hour++;
                    if(this.hour === 12){
                        this.hour = 0;
                    }
                }
            }
        }
    }

    /**
     * 用于tick自减，适用于倒计时
     */
    jumpToPreviousTick() {
        if(this.global_tick > 0) this.global_tick--;
        return this.global_tick === 0;
    }

    /**
     * 
     * @param {Number} _tick 将要把this.tick置为_tick 以下同理
     */
    setTick(_tick) {
        this.tick = _tick
    }

    setSecond(_sec) {
        this.second = _sec
    }

    setMinute(_min) {
        this.minute = _min
    }

    setHour(_hour) {
        this.hour = _hour
    }

    /**
     * 将时间设置为以下的时分秒tick
     * @param {Number} _hour 
     * @param {Number} _min
     * @param {Number} _sec
     * @param {Number} _tick 
     */
    setTime(_hour, _min, _sec, _tick) {
        this.setTick(_tick)
        this.setSecond(_sec)
        this.setMinute(_min)
        this.setHour(_hour)
    }

    /**
     * 获取当前时刻时分秒针的角度
     * @returns 数组！！以此为当前时刻表盘上时分秒针的角度（小数）
     */
    getAngle() {
        let second_angle = (this.second + this.tick / 20) * 6 
        let minute_angle = this.minute * 6 + second_angle / 60
        let hour_angle = this.hour * 30 + minute_angle / 12

        return [hour_angle, minute_angle, second_angle]
    }

    /**
     * 用于debug输出当前时刻
     */
    printNow(){
        console.log(this.hour + ':' + this.minute + ':'+this.second + ':' + this.tick)
    }

    /**
     * 获取当前的时分秒的时间string eg  01:15:26
     */
    getTimeString() {
        return padding(this.hour) + ':' + padding(this.minute) + ':' + padding(this.second)
    }
}

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

//格式化成两位数字：0=>00  9=>09   12=>12
function padding(num){
    if(num < 10) return '0'+num
    else return `${num}`
}

///页面初始化时，绘制所有的表盘刻度（包括大刻度和小刻度）
var lineContainer=document.createDocumentFragment();
const cx=250,cy=250,r_in=180,r_mid=190,r_out=200;  //表盘的中心、内径、中径、外径
for(let i=0;i<60;i++)
{
    const newLine=document.createElementNS(svgns,'line');
    if(i%5!=0)
    {
        newLine.setAttribute('x1',cx+r_mid*Math.sin(Rad(6*i)));
        newLine.setAttribute('y1',cy-r_mid*Math.cos(Rad(6*i)));
        newLine.setAttribute('x2',cx+r_out*Math.sin(Rad(6*i)));
        newLine.setAttribute('y2',cy-r_out*Math.cos(Rad(6*i)));
        newLine.setAttribute('stroke','gray');
        newLine.setAttribute('stroke-width','2px');
        lineContainer.appendChild(newLine);
    }
    else{
        newLine.setAttribute('x1',cx+r_in*Math.sin(Rad(6*i)));
        newLine.setAttribute('y1',cy-r_in*Math.cos(Rad(6*i)));
        newLine.setAttribute('x2',cx+r_out*Math.sin(Rad(6*i)));
        newLine.setAttribute('y2',cy-r_out*Math.cos(Rad(6*i)));
        newLine.setAttribute('stroke','black');
        newLine.setAttribute('stroke-width','5px');
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
const r_sec=190, r_min=150, r_hour=100;

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

const initial_run_id=clockRun()  //开始运行,initial_run_id就是初始化那一次运行的函数id
//可以用


//点击按钮设置时间
settime_btn.addEventListener('click',()=>{
    var time=prompt('请输入时间',clock.getTimeString());
    let times=time.split(':').map((x)=>{return Number(x)})
    clock.setTime(...times,0)
},false)
























