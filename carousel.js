window.Carousel = (function() {
        // 定义Carousel对象
        var Carousel = {},
                carousel = null,
                left = null,
                right = null,
                item = null,
                li_list = null,
                item_active_index = -1,
                item_next_index = -1,
                item_prev_index = -1,
                li_active = null,
                li_next = null,
                li_prev = null;
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
                    timer(args[0], args[1],args[2]);
                }
            }
        };

        TimerManager.prototype.next = function() {
            this.isFiring = false;
            this.fire();
        };

        // 定义左右移动函数
        function slideLeft (ele,left,callback){
                var current_left = ele.offsetLeft,
                        width = ele.offsetWidth,
                        incream =  width/(500/10);
                setLeft(current_left);
                function setLeft(current_left){
                    var timer = setTimeout(function(){
                        current_left -=incream;
                        ele.style.left = current_left+'px';
                        clearInterval(timer);
                        if(-current_left>=-left){
                            callback();
                            if (ele.__TimerManager__ && ele.__TimerManager__.constructor == TimerManager) {
                                ele.__TimerManager__.next();
                            }
                        } else {
                            setLeft(current_left);
                        }
                    },10);
                }
            }
            function slideRight (ele,left,callback){
                var current_left = ele.offsetLeft,
                        width = ele.offsetWidth,
                        incream =  width/(500/10);
                setLeft(current_left);
                function setLeft(current_left){
                    var timer = setTimeout(function(){
                        current_left +=incream;
                        ele.style.left = current_left+'px';
                        clearInterval(timer);
                        if(current_left>=left){
                            callback();
                            if (ele.__TimerManager__ && ele.__TimerManager__.constructor == TimerManager) {
                                ele.__TimerManager__.next();
                            }
                        } else {
                            setLeft(current_left);
                        }
                    },10);
                }
            }
        Carousel.prev = function(type,prev){
            if(type=='direction'){
                item_prev_index = item_active_index>0?item_active_index-1:0;
            } else if(type=='mouseover'){
                item_prev_index = prev;
            }
            addClass(item[item_prev_index],'prev');
            li_active = li_list[item_active_index];
            li_prev = li_list[item_prev_index];
            item[item_active_index].offsetWidth;
        }
        Carousel.next = function(type,next){
            if(type=='direction'){
                item_next_index = item_active_index<item.length?item_active_index+1:item_active_index;
            } else if(type=='mouseover'){
                item_next_index = next;
            }
            addClass(item[item_next_index],'next');
            li_active = li_list[item_active_index];
            li_next = li_list[item_next_index];
            item[item_active_index].offsetWidth;
        }
        // III.定义外部访问接口
        Carousel.swiper = function(id) {
            carousel = document.getElementById(id);
            left = carousel.querySelectorAll('.left')[0];
            right = carousel.querySelectorAll('.right')[0];
            item = carousel.querySelectorAll('.item');
            li_list = document.querySelectorAll('.btn-dot .li');
            for(var i=0;i<item.length;i++){
                var ele = item[i];
                if(hasClass(ele,'active')){
                    item_active_index = i;
                }
            }
            var that = this;
            addEvent(left,'click',function(e){
                that.prev('direction');
                var active = item[item_active_index],
                        prev = item[item_prev_index];

                TimerManager.makeInstance(active);
                active.__TimerManager__.add(slideRight, [active,active.offsetWidth,function(){
                    
                }]);

                TimerManager.makeInstance(prev);
                prev.__TimerManager__.add(slideRight, [prev,0,function(){
                    removeClass(active,'active');
                    removeClass(li_active,'active');
                    item_active_index = item_prev_index;

                    addClass(prev,'active');
                    addClass(li_prev,'active');
                    removeClass(prev,'prev');
                }]);
            })
            addEvent(right,'click',function(e){
                that.next('direction');
                var active = item[item_active_index],
                        next = item[item_next_index];

                TimerManager.makeInstance(active);
                active.__TimerManager__.add(slideLeft, [active,-active.offsetWidth,function(){
                    
                }]);

                TimerManager.makeInstance(next);
                next.__TimerManager__.add(slideLeft, [next,0,function(){
                    removeClass(active,'active');
                    removeClass(li_active,'active');
                    item_active_index = item_next_index;

                    addClass(next,'active');
                    addClass(li_next,'active');
                    removeClass(next,'next');
                }]);
            })

            for(var i=0;i<li_list.length;i++){
                var li = li_list[i];
                test(i);
                function test(i){
                    addEvent(li,'click',function(){
                        if(i>item_active_index&&i<item.length){
                            that.next('mouseover',i);
                            var active = item[item_active_index],
                                    next = item[item_next_index];

                            TimerManager.makeInstance(active);
                            active.__TimerManager__.add(slideLeft, [active,-active.offsetWidth,function(){
                                
                            }]);

                            TimerManager.makeInstance(next);
                            next.__TimerManager__.add(slideLeft, [next,0,function(){
                                removeClass(active,'active');
                                removeClass(li_active,'active');
                                item_active_index = item_next_index;

                                addClass(next,'active');
                                addClass(li_next,'active');
                                removeClass(next,'next');
                            }]);
                        } else if(i>=0&&i<item_active_index){

                            that.prev('mouseover',i);
                            var active = item[item_active_index],
                                    prev = item[item_prev_index];

                            TimerManager.makeInstance(active);
                            active.__TimerManager__.add(slideRight, [active,active.offsetWidth,function(){
                                
                            }]);

                            TimerManager.makeInstance(prev);
                            prev.__TimerManager__.add(slideRight, [prev,0,function(){
                                removeClass(active,'active');
                                removeClass(li_active,'active');
                                item_active_index = item_prev_index;

                                addClass(prev,'active');
                                addClass(li_prev,'active');
                                removeClass(prev,'prev');
                            }]);
                        }
                    })
                }
            }

            return this;
        };


        // 返回Carousel对象
        return Carousel;
    })();