    /* addEventListener */
    function addEvent(ele,event,listener){
        if (typeof ele.addEventListener != "undefined") {
            ele.addEventListener(event,listener,false);
        } else {
            ele.attachEvent(event,listener);
        } 
    }
    /* removeEventListener */
    function removeEvent(ele,event,listener){
        if (typeof ele.removeEventListener != "undefined") {
            ele.removeEventListener(event,listener,false);
        } else {
            ele.detachEvent(event,listener);
        } 
    }
    /* hasClass */
    function hasClass(ele,class_name){
        if(ele.classList){
            return ele.classList.contains(class_name);
        } else {
            var reg = new RegExp('(^| )' + class_name + '( |$)', 'gi');
            return reg.test(ele.className);
        }
    }
    /* addClass */
    function addClass(ele,class_name){
        if(!hasClass(ele,class_name)){
            if(ele.classList){
                ele.classList.add(class_name);
            } else {
                ele.className +=class_name;
            }
        }
    }
    /* removeClass */
    function removeClass(ele,class_name){
        if(ele.classList){
            ele.classList.remove(class_name);
        } else {
           ele.className =  ele.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    }
    /* siblings */
    function siblings(ele,sibling_class){
        var siblings = Array.prototype.slice.call(ele.parentNode.children);
        var result=[];
        for (var i = siblings.length; i--;) {
          if (siblings[i] === ele) {
            siblings.splice(i, 1);
            break;
          }
        }
        for (var i = siblings.length; i--;) {
          if (hasClass(siblings[i],sibling_class)) {
            result = siblings.splice(i, 1);
            break;
          }
        }
        if(result.length){
            return result[0];
        } else {
            return null;
        }
    }
    /* insertAfter */
    function insertAfter(new_ele,target_ele){
        var parent = target_ele.parentNode;
        if(parent.lastChild === target_ele){
            parent.appendChild(new_ele);
        } else {
            parent.insertBefore(new_ele,target_ele.nextSibling);
        }
    }
    /* string to dom */
    function parseToDOM(str){
       var div = document.createElement("div");
       if(typeof str == "string"){
           div.innerHTML = str;
       }
       return div.childNodes;
    }
    /* parents */
    function parents(ele,target){
        var parent = ele.parentNode;
        var name = (/^(\.|\#)(.+)/).exec(target)[2];
        if(parent.id == name||hasClass(parent,name)){
            return parent;
        } else {
            return parents(parent,target);
        }
    }
    /*get offset*/
    function getOffset(ele,offset){
        if(!offset){
            offset = {};
            offset.top = 0;
            offset.left = 0;
        }
        if(ele!=null){
            offset.top += ele.offsetTop;
            offset.left += ele.offsetLeft;
        } else {
            return offset;
        }
        return getOffset(ele.offsetParent,offset);
    }
    /* offsetBottom */
    function offsetBottom(offset_top){
        var scroll_top = document.body.scrollTop,
                window_height = document.body.clientHeight;
        return scroll_top+window_height-offset_top;
    }
    /* slideUp */
    window.Slider = (function() {
        // 定义Slider对象
        var Slider = {};

        // I.定义一个TimerManager类

        // 1）构造函数
        function TimerManager() {
            this.timers = [];       // 保存定时器
            this.args = [];         // 保存定时器的参数
            this.isFiring = false;
        }

        // 2）静态方法：为element添加一个TimerManager实例
        TimerManager.makeInstance = function(element) {
            // 如果element.__TimerManager__上没有TimerManager，就为其添加一个
            if (!element.__TimerManager__ || element.__TimerManager__.constructor != TimerManager) {
                element.__TimerManager__ = new TimerManager();
            }
        };

        // 3）扩展TimerManager原型，分别实现add，fire，next方法
        TimerManager.prototype.add = function(timer, args) {
            this.timers.push(timer);
            this.args.push(args);
            this.fire();
        };

        TimerManager.prototype.fire = function() {
            if ( !this.isFiring ) {
                var timer = this.timers.shift(),        // 取出定时器
                    args  = this.args.shift();          // 取出定时器参数
                if (timer && args) {
                    this.isFiring = true;
                    // 传入参数，执行定时器函数
                    timer(args[0], args[1]);
                }
            }
        };

        TimerManager.prototype.next = function() {
            this.isFiring = false;
            this.fire();
        };

        // II. 修改动画函数并在定时器结束后调用element.__TimerManager__.next()

        // 1）下滑函数
        function fnSlideDown(element, time) {
            if (element.offsetHeight == 0) {  //如果当前高度为0，则执行下拉动画
                // 获取元素总高度
                element.style.display = "block";            // 1.显示元素，元素变为可见
                var totalHeight = element.offsetHeight;     // 2.保存总高度
                element.style.height = "0px";               // 3.再将元素高度设置为0，元素又变为不可见
                // 定义一个变量保存元素当前高度
                var currentHeight = 0;                      // 当前元素高度为0
                // 计算每次增加的值
                var increment = totalHeight / (time/10);
                // 开始循环定时器
                function setHeight(currentHeight){
                    var timer = setTimeout(function(){
                        // 增加一部分高度
                        currentHeight = currentHeight + increment;
                        // 把当前高度赋值给height属性
                        element.style.height = currentHeight + "px";
                        // 如果当前高度大于或等于总高度则关闭定时器
                        if (currentHeight >= totalHeight) {
                            // 关闭定时器
                            clearInterval(timer);
                            // 把高度设置为总高度
                            element.style.height = totalHeight + "px";
                            if (element.__TimerManager__ && element.__TimerManager__.constructor == TimerManager) {
                                element.__TimerManager__.next();
                            }
                        } else {
                            clearInterval(timer);
                            setHeight(currentHeight);
                        }
                    },10)
                }
                setHeight(currentHeight);
            } else {  // 如果当前高度不为0，则直接执行队列里的下一个函数
                if (element.__TimerManager__ && element.__TimerManager__.constructor == TimerManager) {
                    element.__TimerManager__.next();
                }
            }
        }

        // 2）上拉函数
        function fnSlideUp(element, time) {
            if (element.offsetHeight > 0) {  // 如果当前高度不为0，则执行上滑动画
                // 获取元素总高度
                var totalHeight = element.offsetHeight;
                // 定义一个变量保存元素当前高度
                var currentHeight = totalHeight;
                // 计算每次减去的值
                var decrement = totalHeight / (time/10);
                // 开始循环定时器
                function setHeight(currentHeight){
                    var timer = setTimeout(function(){
                        // 减去当前高度的一部分
                        currentHeight = currentHeight - decrement;
                        // 把当前高度赋值给height属性
                        element.style.height = currentHeight + "px";
                        // 如果当前高度小于等于0，就关闭定时器
                        if (currentHeight <= 0) {
                            // 关闭定时器
                            clearInterval(timer);
                            // 把元素display设置为none
                            element.style.display = "none";
                            // 把元素高度值还原
                            element.style.height = totalHeight + "px";
                            if (element.__TimerManager__ && element.__TimerManager__.constructor == TimerManager) {
                                element.__TimerManager__.next();
                            }
                        } else {
                            clearInterval(timer);
                            setHeight(currentHeight);
                        }
                    },10);
                }
                setHeight(currentHeight);
            } else {  // 如果当前高度为0， 则直接执行队列里的下一个函数
                if (element.__TimerManager__ && element.__TimerManager__.constructor == TimerManager) {
                    element.__TimerManager__.next();
                }
            }
        }

        // III.定义外部访问接口

        // 1）下拉接口
        Slider.slideDown = function(element, time) {
            TimerManager.makeInstance(element);
            element.__TimerManager__.add(fnSlideDown, arguments);
            return this;
        };

        // 2）上滑接口
        Slider.slideUp = function(element, time) {
            TimerManager.makeInstance(element);
            element.__TimerManager__.add(fnSlideUp, arguments);
            return this;
        };

        // 返回Slider对象
        return Slider;
    })();

    /* get,post*/
    function createxmlHttpRequest(){
        if(window.ActiveXObject){
            xhr = new ActiveXObject('Microsoft.XMLHTTP');
        } else if(window.XMLHttpRequest){
            xhr = new XMLHttpRequest();
        }
    }
    function doGet(url){
        createxmlHttpRequest();
        xhr.open('GET',url,true);
        //xhr.setRequestHeader('Content-Type','application/octet-stream');
        xhr.send(null);
        xhr.onload = function(){
            var data = xhr.response;        //服务端返回的数据
            console.log(data);
        }
    }
    function doPost(url,data){
        createxmlHttpRequest();
        xhr.open('POST',url,true);
        xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');   //以表格数据发送
        xhr.send(data);
        xhr.onreadystatechange = function(){
            if(xhr.readyState == 4 && xhr.status == 200){
            //success;
            } else {
            //error;
            }
        }
    }