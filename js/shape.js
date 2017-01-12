function Cell(r,c,src){//描述一个格子对象的类型
	this.r=r;
	this.c=c;
	this.src=src;
}
function Shape(cells,src,orgi,states,statei){//所有图形类型的父类型
	this.cells=cells;
	for(var i=0;i<this.cells.length;i++){//集中设置格子src
		this.cells[i].src=src;
	}
	this.orgi=orgi;
	this.states=states;
	this.statei=0;
}
function State(r0,c0,r1,c1,r2,c2,r3,c3){//描述图形一种旋转状态
	this.r0=r0;
	this.c0=c0;
	this.r1=r1;
	this.c1=c1;
	this.r2=r2;
	this.c2=c2;
	this.r3=r3;
	this.c3=c3;
}
Shape.prototype.IMGS={//在原型对象中集中保存图片路径
	T:"img/T.png",
	O:"img/O.png",
	I:"img/I.png",
	S:"img/S.png",
	Z:"img/Z.png",
	L:"img/L.png",
	J:"img/J.png",
};
Shape.prototype.moveDown=function(){
	for(var i=0;i<this.cells.length;i++){
		this.cells[i].r++;
	}
};
Shape.prototype.moveLeft=function(){
	for(var i=0;i<this.cells.length;i++){
		this.cells[i].c--;
	}
};
Shape.prototype.moveRight=function(){
	for(var i=0;i<this.cells.length;i++){
		this.cells[i].c++;
	}
};
Shape.prototype.rotateR=function(){
	this.statei++;
	if(this.statei==this.states.length){this.statei=0;};
	this.rotate();
};
Shape.prototype.rotate=function(){
	var orgr=this.cells[this.orgi].r;
	var orgc=this.cells[this.orgi].c;
	var state=this.states[this.statei];
	for(var i=0;i<this.cells.length;i++){
		if(i!=this.orgi){
			this.cells[i].r=orgr+state["r"+i];
			this.cells[i].c=orgc+state["c"+i];
		}
	}
},
Shape.prototype.rotateL=function(){
	this.statei--;
	if(this.statei<0){this.statei=this.states.length-1;};
	this.rotate();
};
function T(){//专门描述所有T型图形的构造函数
	//1.借用父类型构造函数
	Shape.apply(this,[
		[
			new Cell(0,3),
			new Cell(0,4),
			new Cell(0,5),
			new Cell(1,4),
		],
		this.IMGS.T,
		1,[
			new State(0,-1, 0,0, 0,1, 1,0),
			new State(-1,0, 0,0, 1,0, 0,-1),
			new State(0,1, 0,0, 0,-1, -1,0),
			new State(1,0, 0,0, -1,0, 0,1),
		]
		]);
}
//2.设置继承原型
Object.setPrototypeOf(T.prototype,Shape.prototype);
function O(){//专门描述所有O型图形的构造函数
	Shape.apply(this,[
		[
			new Cell(0,4),
			new Cell(0,5),
			new Cell(1,4),
			new Cell(1,5),
		],
		this.IMGS.O,
		0,[
			new State(0,0, 0,1, 1,0, 1,1),
		]
		]);
}
Object.setPrototypeOf(O.prototype,Shape.prototype);
function I(){//专门描述所有I型图形的构造函数
	Shape.apply(this,[
		[
			new Cell(0,3),
			new Cell(0,4),
			new Cell(0,5),
			new Cell(0,6),
		],
		this.IMGS.I,
		1,[
			new State(0,-1, 0,0, 0,1, 0,2),
			new State(-1,0, 0,0, 1,0, 2,0),
		]
		]);
}
Object.setPrototypeOf(I.prototype,Shape.prototype);
function S(){//专门描述所有S型图形的构造函数
	Shape.apply(this,[
		[
			new Cell(0,4),
			new Cell(0,5),
			new Cell(1,3),
			new Cell(1,4),
		],
		this.IMGS.S,
		3,[
			new State(0,-1, 1,-1, -1,0, 0,0),
			new State(1,0, 1,1, 0,-1, 0,0),
		]
		]);
}
Object.setPrototypeOf(S.prototype,Shape.prototype);
function Z(){//专门描述所有S型图形的构造函数
	Shape.apply(this,[
		[
			new Cell(0,3),
			new Cell(0,4),
			new Cell(1,4),
			new Cell(1,5),
		],
		this.IMGS.Z,
		2,[
			new State(-1,-1, -1,0, 0,0, 0,1),
			new State(-1,1, 0,1, 0,0, 1,0),
		]
		]);
}
Object.setPrototypeOf(Z.prototype,Shape.prototype);
function L(){//专门描述所有S型图形的构造函数
	Shape.apply(this,[
		[
			new Cell(0,3),
			new Cell(0,4),
			new Cell(0,5),
			new Cell(1,3),
		],
		this.IMGS.L,
		1,[
			new State(0,-1, 0,0, 0,1, 1,-1),
			new State(-1,0, 0,0, 1,0, -1,-1),
			new State(0,-1, 0,0, 0,1, -1,1),
			new State(-1,0, 0,0, 1,0, 1,1),
		]
		]);
}
Object.setPrototypeOf(L.prototype,Shape.prototype);
function J(){//专门描述所有S型图形的构造函数
	Shape.apply(this,[
		[
			new Cell(0,3),
			new Cell(0,4),
			new Cell(0,5),
			new Cell(1,5),
		],
		this.IMGS.J,
		1,[
			new State(0,-1, 0,0, 0,1, 1,1),
			new State(-1,0, 0,0, 1,0, 1,-1),
			new State(0,1, 0,0, 0,-1, -1,-1),
			new State(1,0, 0,0, -1,0, -1,1),
		]
		]);
}
Object.setPrototypeOf(J.prototype,Shape.prototype);