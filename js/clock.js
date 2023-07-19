/**
 * Clock类是一个控制表的运行逻辑的类
 */
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
