window.onload = function(){
	zoom(1920,1048)
	//getData()
}
window.onresize = function(){
	zoom(1920,1048)
}
function zoom(x,y){
	var width = 1920;
	var height = 1048;
	var x = window.innerWidth/width;
	var y = window.innerHeight/height;
	var body = document.getElementsByTagName('body')[0]
	body.style.webkitTransform= 'scale(' + x + ',' + y + ')'
	body.style.msTransform= 'scale(' + x + ',' + y + ')'
	body.style.mozTransform='scale(' + x + ',' + y + ')'
	body.style.oTransform='scale(' + x + ',' + y + ')'
}
function jsonpCallBack(res){
	console.log(res.result)
	let contentContain = document.getElementsByClassName('content')[0]
	let source = document.getElementById('template').innerHTML
	
	let myTemplate = Handlebars.compile(source)
	contentContain.innerHTML = myTemplate(res.result)
	let week = []
	let dayTemp = []
	let nightTemp = []
	let future = res.result.future
	for(let key in future){
		week.push(future[key].week)
		let str = future[key].temperature
		let index = str.indexOf('~')
		dayTemp.push(getTemp(str.slice(0,index)))
		nightTemp.push(getTemp(str.slice(index+1)))
	}
	buildLine(week,dayTemp,nightTemp)
	changeIcon()
}
function getTemp(str){
	let index = str.indexOf('℃')
	return Number(str.slice(0,index))
}
function buildLine(week,dayTemp,nightTemp){
		var xdata = week
		var testdata = d3.range(7)
		var data1 = dayTemp
		var data2 = nightTemp
		var allData = data1.concat(data2)
		var maxData = d3.max(allData)*1.2
		//配置宽高等属性
		var width = 500, height = 400, margin = {left:35, top:17, right:2,bottom:57},
		g_width = width - margin.left - margin.right,
		g_height = height - margin.top - margin.bottom;

		//获取div，向里面添加svg
		var svg = d3.select('#tempQu')
					.append('svg:svg')//在“highway”中插入svg
					.attr('width', g_width)//设置svg的宽度
					.attr('height', height)//设置svg的高度
		//画网格线
		var grid = svg.selectAll('.grid')
					  .data(testdata)
					  .enter()
					  .append('g')
					  .attr('class','grid')
					  .attr('transform','translate('+margin.left+','+margin.top+')')
		//竖线
		grid.append('line')
			.attr('x1',function(d,i){
				return i*(g_width/data1.length)
			})
			.attr('x2',function(d,i){
				return i*(g_width/data1.length)
			})
			.attr('y1',0)
			.attr('y2',g_height)
			.attr('stroke','#27314d')
		//横线
		grid.append('line')
			.attr('y1',function(d,i){
				return (i+1)*(g_height/data1.length)
			})
			.attr('y2',function(d,i){
				return (i+1)*(g_height/data1.length)
			})
			.attr('x1',0)
			.attr('x2',g_width)
			.attr('stroke','#27314d')
			.attr('stroke-dasharray',5)

		//设置比例尺		
		var scale_x = d3.scale.linear()//把曲线沿x轴按比例放大
							  .domain([0,data1.length])
							  .range([0, g_width])
		var scale_y = d3.scale.linear()//把曲线沿y轴按比例放大
							  .domain([0, maxData])
							  .range([g_height,0])//使y轴按照数学中的方式显示，而不是浏览器的格式
		//曲线生成器
		var line_generator = d3.svg.line()//d3中绘制曲线的函数
		  					   .x(function(d,i){return i*(g_width/data1.length)})
		  					   .y(function(d){return scale_y(d)})
		  					   .interpolate('cardinal')
		//绘制曲线
		svg.append('path')
		  .attr('d',line_generator(data1))
		  .attr('transform','translate('+margin.left+','+margin.top+')')
		  .attr('stroke','#888')
		  .attr('stroke-width',2)
		  .attr('opacity','0.5')
		  .attr('fill','none')
		//绘制曲线
		svg.append('path')
		  .attr('d',line_generator(data2))
		  .attr('transform','translate('+margin.left+','+margin.top+')')
		  .attr('stroke','#000')
		  .attr('stroke-width',2)
		  .attr('opacity','0.5')
		  .attr('fill','none')
		//添加圆点
		var circle1 = svg.append('g')
						   .attr('transform','translate('+margin.left+','+margin.top+')')
						   .attr('id','circle1')
		circle1.selectAll('circle')
			   .data(data1)
			   .enter()
			   .append('circle')
			   .attr('cx',function(d,i){
			   		return i*(g_width/data1.length)
			   })
			   .attr('cy',function(d,i){
			   		return scale_y(d)
			   })
			   .attr('r',5)
			   .attr('stroke-width',1)
			   .attr('stroke','white')
			   .attr('fill','black')
		//添加圆点
		var circle2 = svg.append('g')
						   .attr('transform','translate('+margin.left+','+margin.top+')')
						   .attr('id','circle2')
		circle2.selectAll('circle')
			   .data(data2)
			   .enter()
			   .append('circle')
			   .attr('cx',function(d,i){
			   		return i*(g_width/data1.length)
			   })
			   .attr('cy',function(d,i){
			   		return scale_y(d)
			   })
			   .attr('r',5)
			   .attr('stroke-width',1)
			   .attr('stroke','white')
			   .attr('fill','black')
		//添加文本
		var text = svg.append('g')
					  .attr('transform','translate('+(margin.left/2)+','+(margin.top+g_height)+')')
					  .attr('id','contentText')
		text.selectAll('text')
			.data(xdata)
			.enter()
			.append('text')
			.attr('x',function(d,i){
				return i*(g_width/data1.length)
			})
			.text(function(d,i){
				return d
			})
			.attr('dx',-8)
			.attr('dy',17)
			.attr('fill','#000')
			.attr('font-size',15)
		//添加Y轴
		var y_axis = d3.svg.axis().scale(scale_y).orient('left')
		svg.append('g')
		 .call(y_axis)
		 .attr('id','y')
		 .attr('class','axis')
		 .attr('stroke','#000')
		 .attr('stroke-width',1)
		 .attr('transform','translate('+(margin.left)+','+margin.top+')')
		 .selectAll('text')
		 .attr('x',-13)
		 .attr('font-size',30)
		 .attr('fill','#000')
		d3.select('#y').selectAll('path')
		 .attr('stroke','#000') 
		//添加标识
		svg.append('line')
		   .attr('x1',0)
		   .attr('y1',0)
		   .attr('x2',50)
		   .attr('y2',0)
		   .attr('stroke','#888')
		   .attr('stroke-width',5)
		   .attr('transform','translate(200,10)')
		svg.append('text')
		   .text('日间气温')
		   .attr({
		   	'font-size': '15px',
		   	'transform': 'translate(260,15)'
		   });
		svg.append('line')
		   .attr({
		   	'x1': '0',
		   	'x2': '50',
		   	'y1': '0',
		   	'y2': '0',
		   	'stroke': '#000',
		   	'stroke-width': 5,
		   	'transform': 'translate(330,10)'
		   });
		svg.append('text')
		   .text('夜间气温')
		   .attr({
		   	'font-size': '15px',
		   	'transform': 'translate(390,15)'
		   });
}
function changeIcon(){
	console.log(12321)
	let types = document.getElementsByClassName('weather')
	let icons = document.getElementsByClassName('right')
	for(let i =0;i<types.length;i++){
		let content = types[i].innerHTML;
		console.log(content.indexOf())
		if(content.indexOf('雨')!= -1){
			icons[i].childNodes[0].className = 'fa fa-tint fa-4x'
		}
		else if(content.indexOf('雪')!= -1){
			icons[i].childNodes[0].className = 'fa fa-snowflake-o fa-4x'
		}
		else if(content.indexOf('雷')!= -1){
			icons[i].childNodes[0].className = 'fa fa-bolt fa-4x'
		}
		else if(content.indexOf('阴')!= -1){
			icons[i].childNodes[0].className = 'fa fa-cloud fa-4x'
		}
		else if(content.indexOf('云')!= -1){
			icons[i].childNodes[0].className = 'fa fa-cloud fa-4x'
		}
		else if(content.indexOf('晴')!= -1){
			icons[i].childNodes[0].className = 'fa fa-sun-o fa-4x'
		}
	}
}
