
//为什么找不到我的这个 JS呢
var tetris={
	CSIZE:26,//一个格子的宽高
	OFFSET:15,//顶部和左测得偏移量
	RN:20,//总行数
	CN:10,//总列数
	pg:null,//保存容器DIV
	shape:null,//保存主角图形
	nextShape:null,//保存备胎图形
	timer:null,
	interval:500,//每次时间间隔
	wall:null,//保存所有停止下落的单元格的二维数组
	lines:0,//保存删除的总行数
	score:0,//保存目前的得分
	scores:[0,10,50,120,250],
	state:1,//保存游戏状态
	GAMEOVER:0,//游戏结束
	RUNNING:1,
	PAUSE:2,
	start:function(){//启动游戏
		this.lines=0;
		this.score=0;
		this.state=this.RUNNING;
		this.wall=[];
		for(var r=0;r<this.RN;r++){
			this.wall[r]=new Array(this.CN);
		}
		this.pg=document.getElementsByClassName("playground")[0];
		this.shape=this.randomShape();
		this.nextShape=this.randomShape();
		this.paint();
		this.timer=setInterval(this.moveDown.bind(this),this.interval);

		//document.addEventListener("keydown",this.keyDown.bind(this));
		document.onkeydown=this.keyDown.bind(this);

	},
	keyDown:function(e){
		switch(e.keyCode){
			case 40:this.state==this.RUNNING&&this.moveDown();break;
			case 37:this.state==this.RUNNING&&this.moveLeft();break;
			case 39:this.state==this.RUNNING&&this.moveRight();break;
			case 38:this.state==this.RUNNING&&this.rotateR();break;
			case 90:this.state==this.RUNNING&&this.rotateL();break;
			case 83:this.state==this.GAMEOVER&&this.start();break;
			case 80:this.pause();break;
			case 67:this.myContinue();break;
			case 32:this.landToBottom();break;
			case 81:this.quit();break;
		}
	},
	quit:function(){
		if(this.state==this.RUNNING){
			this.state=this.GAMEOVER;
			clearTimeout(this.timer);
			this.timer=null;
			this.paint();
		}
	},
	landToBottom:function(){//下降
		if(this.state==this.RUNNING){
			while(this.canDown()){
				this.moveDown();
			}
		}  
	},
	pause:function(){
		if(this.state==this.RUNNING){
			this.state=this.PAUSE;
			clearInterval(this.timer);
			this.timer=null;
			this.paint();
		}
	},
	myContinue:function(){
		if(this.state==this.PAUSE){
			this.state=this.RUNNING;
			this.timer=setInterval(this.moveDown.bind(this),this.interval);
			this.paint();
		}
	},
	rotateR:function(){//让shape旋转1次
		this.shape.rotateR();
		if(!this.canRotate()){
			this.shape.rotateL();
		}
	},
	rotateL:function(){//让shape旋转1次
		this.shape.rotateL();
		if(!this.canRotate()){
			this.shape.rotateR();
		}
	},
	canRotate:function(){//检测旋转后的图形，是否越界或撞墙
		for(var i=0;i<this.shape.cells.length;i++){
			var cell=this.shape.cells[i];
			if(cell.r<0||cell.r>=this.RN
				||cell.c<0||cell.c>=this.CN
					||this.wall[cell.r][cell.c]!==undefined){
				return false;
			}
		}return true;
	},
	canLeft:function(){
		for(var i=0;i<this.shape.cells.length;i++){
			var cell=this.shape.cells[i];
			if(cell.c==0||this.wall[cell.r][cell.c-1]!==undefined){return false;}
		}return true;
	},
	moveLeft:function(){
		if(this.canLeft()){
			this.shape.moveLeft();
		}
		this.paint();
	},
	canRight:function(){
		for(var i=0;i<this.shape.cells.length;i++){
			var cell=this.shape.cells[i];
			if(cell.c==this.CN-1||this.wall[cell.r][cell.c+1]!==undefined){return false;}
		}return true;
	},
	moveRight:function(){
		if(this.canRight()){
			this.shape.moveRight();
		}
		this.paint();
	},
	canDown:function(){//检查是否可以下路
		for(var i=0;i<this.shape.cells.length;i++){
			var cell=this.shape.cells[i];
			if(cell.r==this.RN-1||this.wall[cell.r+1][cell.c]!==undefined){return false;}
		}return true;
	},
	moveDown:function(){
		if(this.canDown()){
			this.shape.moveDown();
		}else{
			this.landIntoWall();
			var ls=this.deleteRows();
			this.lines+=ls;
			this.score+=this.scores[ls];
			if(!this.isGAMEOVER()){
				this.shape=this.nextShape;
				this.nextShape=this.randomShape();
			}else{
				this.state=this.GAMEOVER;
				clearTimeout(this.timer);
				this.timer=null;
			}
		}
		this.paint();
	},
	isGAMEOVER:function(){
		for(var i=0;i<this.nextShape.cells.length;i++){
			var cell=this.nextShape.cells[i];
			if(this.wall[cell.r][cell.c]!==undefined){
				return true;
			}
		}return false;
	},
	paintState:function(){
		if(this.state==this.GAMEOVER){
			var img=new Image();
			img.src="img/game-over.png";
			this.pg.appendChild(img);
		}else if(this.state==this.PAUSE){
			var img=new Image();
			img.src="img/pause.png";
			this.pg.appendChild(img);
		}
	},
	paintScore:function(){
		document.getElementById("score").innerHTML=this.score;
		document.getElementById("lines").innerHTML=this.lines;
	},
	deleteRows:function(){//删除所有满格行
		for(var r=this.RN-1,lines=0;r>=0;r--){
			if(this.wall[r].join("")==""){
				break;
			}else if(this.isFullRow(r)){
				this.deleteRow(r);
				r++;
				lines++;
				if(lines==4){
					break;
				}
			}
		}return lines;
	},
	isFullRow:function(r){//判断当前行是否满格
		return String(this.wall[r]).search(/^,|,,|,$/)==-1;
	},
	deleteRow:function(delr){//删除当前行
		for(var r=delr;r>=0;r--){
			this.wall[r]=this.wall[r-1];
			for(var c=0;c<this.wall[r].length;c++){
				if(this.wall[r][c]){
					this.wall[r][c].r++;
				}
			}
			this.wall[r-1]=new Array(this.CN);
				if(this.wall[r-2].join("")==""){
					break;
				}
		}
	},
	landIntoWall:function(){
		for(var i=0;i<this.shape.cells.length;i++){
			var cell=this.shape.cells[i];
			this.wall[cell.r][cell.c]=cell;
		}
	},
	randomShape:function(){//随机形成1个
		var r=parseInt(Math.random()*7);
		switch(r){
			case 0:return new O();
			case 1:return new I();
			case 2:return new T();
			case 3:return new S();
			case 4:return new Z();
			case 5:return new L();
			case 6:return new J();
		}
	},
	paint:function(){//重绘一切
		var reg=/<img[^>]*?>/g;
		this.pg.innerHTML=this.pg.innerHTML.replace(reg,"");
		this.paintShape();
		this.paintWall();
		this.paintNextShape();
		this.paintScore();
		this.paintState();
	},
	paintWall:function(){//绘制墙Wall的格子
		var frag=document.createDocumentFragment();
		for(var r=this.RN-1;r>=0;r--){
			if(this.wall[r].join("")==""){
				break;
			}
			for(var c=0;c<this.wall[r].length;c++){
				var cell=this.wall[r][c];
				if(cell){
					var img=new Image();
					img.src=cell.src;
					img.style.left=this.CSIZE*cell.c+this.OFFSET+"px";
					img.style.top=this.CSIZE*cell.r+this.OFFSET+"px";
					frag.appendChild(img);
				}
			}
		}
		this.pg.appendChild(frag);
	},
	paintNextShape:function(){//绘制备胎格子
		var frag=document.createDocumentFragment();
		for(var i=0;i<this.nextShape.cells.length;i++){
			var cell=this.nextShape.cells[i];
			var img=new Image();
			img.src=cell.src;
			img.style.left=this.CSIZE*(cell.c+10)+this.OFFSET+"px";
			img.style.top=this.CSIZE*(cell.r+1)+this.OFFSET+"px";
			frag.appendChild(img);
		}
		this.pg.appendChild(frag);
	},
	paintShape:function(){//专门绘制主角图形shape
		var frag=document.createDocumentFragment();
		for(var i=0;i<this.shape.cells.length;i++){
			var cell=this.shape.cells[i];
			var img=new Image;
			img.src=cell.src;
			img.style.left=this.CSIZE*cell.c+this.OFFSET+"px";
			img.style.top=this.CSIZE*cell.r+this.OFFSET+"px";
			frag.appendChild(img);
		}
		this.pg.appendChild(frag);
	}
}
window.onload=function(){tetris.start();};