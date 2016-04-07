/**
 * tkSwitchAD 图片切换
 * id  string ul#id
 * bid string div#id 按钮
 * delay float  间隔时间
 * v     float  淡入淡出动画系数
*/
function tkSwitchAD(id,bid,delay,v){
	this.ul = document.getElementById(id);
	this.liArr = this.ul.getElementsByTagName('li');
	this.bid = document.getElementById(bid);
	this.aArr = [];
	this.size = this.liArr.length;
	this.timer = null;
	this.pid = 0;
	this.cid = 1;
	this.v = v || 30;
	this.delay = delay || 3000;
	
	//初始化
	this.init();
}
tkSwitchAD.prototype = {
	init:function(){
		this.addBtnlist();
		this.start();
		this.handler();
	},
	addBtnlist:function(){
		var btnStr = '';
		for(var i=1,len = this.size; i <= len; i++){
			var classStr = (i==1) ? 'class="current"':'';
			btnStr += '<a '+classStr+' href="">'+i+'</a>';
		}
		this.bid.innerHTML = btnStr;
		this.aArr = this.bid.childNodes;
	},
	handler:function(){
		var _this = this;
		for(var i=0,len = _this.size;i<len; i++){
			_this.liArr[i].onmouseover =(function(i){
					return function(){
						_this.stop();
					}
			})(i);
			_this.liArr[i].onmouseout =(function(i){
					return function(){
						_this.start();
					}
			})(i);
			
			_this.aArr[i].onmouseover =(function(i){
					return function(){
						_this.stop();
						_this.cid = (i==_this.size) ? 0:(i+1);
						_this.goto(i);
						_this.pid = i;
					}
			})(i);
			_this.aArr[i].onmouseout =(function(i){
					return function(){
						_this.start();
					}
			})(i);
			
		}
	},
	cycle:function(){
		if(this.cid == this.size) this.cid=0;
		this.goto(this.cid);
		this.pid = this.cid;
		this.cid++;
	},
	goto:function(index){
		if(this.pid==index) return;
		this.aArr[this.pid].className = "";
		this.fadeOut(this.pid);
		
		for(var i=0,len = this.size; i < len; i++){
			if(i!=index&i!=this.pid){
				this.aArr[i].className = "";
				this.setOpacity(this.liArr[i],0);
			}
		}
		this.aArr[index].className = "current";
		this.fadeIn(index);
		
	},
	fadeOut:function(index){
		var _this = this;
		var val=90,cli=_this.liArr[index];                                      
        var tt = setInterval(function(){ 
                if(val<=0){ 
                    clearInterval(tt); 
                } 
                 _this.setOpacity(cli,val); 
                val-=10; 
            },_this.v); 
	},
	fadeIn:function(index){
		var _this = this;
		var val=10,cli=_this.liArr[index];                                  
        var t = setInterval(function(){ 
                    if(val>=100){ 
                        clearInterval(t); 
                    } 
                    _this.setOpacity(cli,val); 
                    val+=10; 
             },_this.v);  
	},
	setOpacity:function(obj,val){
		 if(document.documentElement.filters){
			 obj.style.filter = "alpha(opacity="+val+")"; 
		}else{ 
			obj.style.opacity = val/100; 
		} 
	},
	start:function(){
		var _this = this;
		_this.timer = setInterval(function(){
			_this.cycle();
		},_this.delay);
	},
	stop:function(){
		clearInterval(this.timer);
	}
}