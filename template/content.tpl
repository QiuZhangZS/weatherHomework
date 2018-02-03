<section>
	<h3>实时天气</h3>
	{{#width today}}
	<div class="temp">
		<div class="currentTemp">
			<span>11℃</span>
		</div>
		<div>
			<span>{{weather}}</span>
			<span>{{#width ks}} {{humidity}} {{/width}}</span>
			<span>风向:{{wind}}</span>
			<span>{{date_y}}</span>
		</div>
	</div>
	<div class="suggest">
		<span>体感温度:{{dressing_index}}</span>
		<span>{{dressing_advice}}</span>
		<span>洗衣指数:{{wash_index}}</span>
		<span>旅行指数:{{travel_index}}</span>
		<span>锻炼指数:{{exercise_index}}</span>
	</div>
	{{/width}}
</section>
<section>
	<h3>预报天气</h3>
	<div class="future">
		{{#each future}}
		<div class="futureTemp">
			<div class="top">
				<div class="left">
					<span class="big">{{temperature}}</span>
					<span>{{weather}}</span>
				</div>
				<div class="right"><i class="fa fa-bolt fa-4x" aria-hidden="true"></i></div>
			</div>
			<div class="medium">
				<span>{{date}}</span>
				<span>{{week}}</span>
			</div>
			<div class="bottom">
				<span>{{wind}}</span>
			</div>
		</div>
		{{/each}}
	</div>
</section>
<section>
	<h3>温度曲线</h3>
	<div id="tempQu"></div>
</section>