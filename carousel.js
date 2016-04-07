window.Carousel = (function() {
        // 定义Carousel对象
        var Carousel = {};

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

        // 定义左右移动函数
        function slideLeft (ele,current_left,width,left,callback){
                var incream =  width/(500/10);
                var timer = setTimeout(function(){
                    current_left -=incream;
                    ele.style.left = current_left+'px';
                    clearInterval(timer);
                    if(-current_left>=-left){
                        callback();
                    } else {
                        slideLeft(ele,current_left,width,left,callback);
                    }
                },10);
            }
            function slideRight (ele,current_left,width,left,callback){
                var incream =  width/(500/10);
                var timer = setTimeout(function(){
                    current_left +=incream;
                    ele.style.left = current_left+'px';
                    clearInterval(timer);
                    if(current_left>=left){
                        callback();
                    } else {
                        slideRight(ele,current_left,width,left,callback);
                    }
                },10);
            }

        // III.定义外部访问接口

        Carousel.swiper = function(id) {
            this.element = document.getElementById(id);
            var left = this.element.querySelectorAll('.left')[0];
            var right = this.element.querySelectorAll('.right')[0];
            addEvent(right,'click',function(e){
                var target = e.target;
            });
            //TimerManager.makeInstance(element);
            //element.__TimerManager__.add(fnSlideDown, arguments);
            console.log(this);
            return this;
        };


        // 返回Carousel对象
        return Carousel;
    })();