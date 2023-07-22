var time_now;

/*-------实时更新时间--------*/
var mySet=setInterval(function () {
    showLocalTime();
},1000)


function showLocalTime() {
    var now=new Date();//创建一个Date对象
    var year=now.getFullYear();//获取年份
    var month=now.getMonth();//月份
    var date=now.getDate();
    var day=now.getDay();
    var hour=now.getHours();
    var minute=now.getMinutes();
    var second=now.getSeconds();

    var xqObj=document.getElementById("xq");
    var riqiObj=document.getElementById("riqi");
    var nianObj=document.getElementById("nian");
    var yueObj=document.getElementById("yue");
    var shijianObj=document.getElementById("shijian");

    switch(day){
        case 1:
            day='一';
            break;
        case 2:
            day='二';
            break;
        case 3:
            day='三';
            break;
        case 4:
            day='四';
            break;
        case 5:
            day='五';
            break;
        case 6:
            day='六';
            break;
        case 7:
            day='日';
            break;
        default:
            break;
    }

    xqObj.innerHTML=day;
    riqiObj.innerHTML=date;
    nianObj.innerHTML=year;
    yueObj.innerHTML=month;
    
    

    if(hour<10){
        hour="0"+hour;
    }
    if(minute<10){
        minute="0"+minute;
    }
    if(second<10){
        second="0"+second;
    }
    shijianObj.innerHTML=hour+":"+minute+":"+second;
    time_now=hour+":"+minute+":"+second;
}




/*-------初始化页面--------*/
window.onload = function () {
    var btn = document.querySelector(".submit-btn");
    var input = document.getElementsByTagName("input")[0];
    var text = document.getElementsByClassName("empty-todos")[0];
    var hidden = document.getElementsByClassName("hidden")[0];
    load();

    // 点击submit按钮
    btn.onmousedown = function () {
      // 点击按钮后阴影消失
      btn.className = btn.className.replace(" submit-btn1", "");
   
      // 输入框不为空s
      if (input.value.trim()) {
        // 先读取本地存储原来的数据
        var local = getData();
        // 当输入时，先更新数组，再替换本地存储
        local.push({ text: input.value, done: false});
        saveData(local);
   
        // 渲染加载数据
        load();
      }
    };
    
    var mySet=setInterval(function () {
        var data = getData();
        var arr = [];
        data = data.filter((item) => item.done == false);
        data.forEach((element, index) => {
            if(element.text==time_now){
                alert(time_now+"的闹钟时间到了");
            }
        });
    },1000)
    
    // 渲染加载数据
    function load() {
      var todolist = document.querySelector(".todo-list");
      var str = "";
   
      // 读取本地存储

      var data = getData();
      var arr = [];
      data = data.filter((item) => item.done == false);
      data.forEach((element, index) => {
      str ='<li class="todo-item"><div class="todo-text">' +
            element.text +
            '</div><i class="iconfont del">&#xe61d;</i></div></li>' +
            str;
      });
   
      input.value = "";
   
      if (str) {
        text.style.display = "none";
        hidden.style.display = "block";
        todolist.innerHTML = str;
      } else {
        text.style.display = "block";
        hidden.style.display = "none";
      }
   
      del();
      updata();
    }
   
    //更改状态
    function updata() {
      var left = document.querySelectorAll(".left-icon");
      left.forEach((element) => {
        element.onclick = function () {
          // 获取本地数据
          var data = getData();
   
          //修改数据
          var index = element.parentNode.children[2].getAttribute("id");
          if (element.checked) {
            data[index].done = true;
          } else {
            data[index].done = false;
          }
          // 保存本地存储
          saveData(data);
   
          // 重新渲染
          load();
        };
      });
    }
   
    // 删除操作
    function del() {
      var del = document.querySelectorAll(".del");
      del.forEach((element) => {
        element.onclick = function () {
          // 先获取本地存储
          var data = getData();
          // 修改数据
          var index = element.parentNode.getAttribute("id");
          data.splice(index, 1);
          // 保存本地
          saveData(data);
          // 重新渲染
          load();
        };
      });
    }
    
   
    // 读取本地储存的数据
    function getData() {
      var data = localStorage.getItem("todolist");
      if (data) {
        return JSON.parse(data);
      } else {
        return [];
      }
    }
    //保存本地存储
    function saveData(data) {
      localStorage.setItem("todolist", JSON.stringify(data));
    }
   
   

  };