var from_curr=$("#id_from_curr");var to_curr=$("#id_to_curr");var from_value=$("#id_from_value");var to_value=$("#id_to_value");var rate;function getRate(){var xhttp=new XMLHttpRequest();xhttp.onreadystatechange=function(){if(this.readyState==4&&this.status==200){rate=obj=JSON.parse(this.responseText).rate;if(rate==null){rate=0;}}};xhttp.open("GET","/exchange-rate/"+from_curr.val()+"/"+to_curr.val()+"/",false);xhttp.send();}
getRate();var rounded=function(number){if(number===undefined){return number}
if(number>=0.01){return number.toFixed(2)}else{number=number.toFixed(-Math.ceil(Math.log(number)/Math.log(10))+2);var tail=number.split('.')[1];var new_tail='';for(i=0;i<tail.length;i++){new_tail+=tail[i];if(i>1&&tail[i-1]!='0'){break}}
return'0.'+new_tail}};function updateFromValue(){if(to_value.val()!=''){from_value.val(rounded(to_value.val()/rate));}else{from_value.val('')}}
function updateToValue(){if(from_value.val()!=''){to_value.val(rounded(from_value.val()*rate));}else{to_value.val('')}}
from_curr.change(function(){getRate();updateToValue();});to_curr.change(function(){getRate();updateToValue();});from_value.keyup(function(){updateToValue();});to_value.keyup(function(){updateFromValue();});;Chart.plugins.register({afterDatasetsDraw:function(chart){var drawCircle=function(chart){var activePoint=chart.tooltip._active[0],ctx=chart.ctx,x=activePoint.tooltipPosition().x,y=activePoint.tooltipPosition().y;ctx.beginPath();ctx.arc(x,y,4,0,2*Math.PI,false);ctx.fillStyle='#FFFFFF';ctx.fill();ctx.lineWidth=3;ctx.strokeStyle='#00abff';ctx.stroke();};function roundRect(ctx,x,y,width,height,radius,fill,stroke){if(typeof stroke=='undefined'){stroke=true;}
if(typeof radius==='undefined'){radius=5;}
if(typeof radius==='number'){radius={tl:radius,tr:radius,br:radius,bl:radius};}else{var defaultRadius={tl:0,tr:0,br:0,bl:0};for(var side in defaultRadius){radius[side]=radius[side]||defaultRadius[side];}}
ctx.beginPath();ctx.moveTo(x+radius.tl,y);ctx.lineTo(x+width-radius.tr,y);ctx.quadraticCurveTo(x+width,y,x+width,y+radius.tr);ctx.lineTo(x+width,y+height-radius.br);ctx.quadraticCurveTo(x+width,y+height,x+width-radius.br,y+height);ctx.lineTo(x+radius.bl,y+height);ctx.quadraticCurveTo(x,y+height,x,y+height-radius.bl);ctx.lineTo(x,y+radius.tl);ctx.quadraticCurveTo(x,y,x+radius.tl,y);ctx.closePath();if(fill){ctx.fill();}
if(stroke){ctx.strokeStyle=stroke;ctx.stroke();}}
var drawVerticalLine=function(chart){var activePoint=chart.tooltip._active[0],ctx=chart.ctx,y_axis=chart.scales['y-axis-0'],x=activePoint.tooltipPosition().x,y=activePoint.tooltipPosition().y,topY=y_axis.top,bottomY=y_axis.bottom;ctx.save();ctx.beginPath();ctx.moveTo(x,topY);ctx.lineTo(x,bottomY);ctx.lineWidth=3;ctx.strokeStyle='#00abff';ctx.stroke();ctx.restore();};var drawYValue=function(chart){var activePoint=chart.tooltip._active[0],ctx=chart.ctx,y_axis=chart.scales['y-axis-0'],topY=y_axis.top,x=activePoint.tooltipPosition().x,verticalPadding=5;var text="{0} {1}".format(activePoint._chart.config.data.datasets[0].data[activePoint._index].y,activePoint._chart.config.data.datasets[0].label);ctx.lineWidth=1;ctx.fillStyle='#FFFFFF';var horizontalPadding=10,startX=x-ctx.measureText(text).width/2-horizontalPadding-(ctx.lineWidth/2),endX=x+ctx.measureText(text).width/2+horizontalPadding,textHeight=12;if(ctx.canvas.clientWidth<endX){startX=ctx.canvas.clientWidth-(endX-startX);}
if(chart.scales['y-axis-0'].right>startX){startX=chart.scales['y-axis-0'].right;}
roundRect(ctx,startX,1,ctx.measureText(text).width+2*horizontalPadding,textHeight+2*verticalPadding,6,"#FFFFFF",'#00abff');ctx.font="{0}px Ubuntu".format(textHeight);ctx.fillStyle="rgba(0, 0, 0, 0.54)";ctx.textBaseline='middle';ctx.textAlign="left";ctx.fillText(text,startX+horizontalPadding,topY+ctx.lineWidth-12);};var drawXValue=function(chart){var activePoint=chart.tooltip._active[0],ctx=chart.ctx,y_axis=chart.scales['y-axis-0'],topY=y_axis.top,bottomY=y_axis.bottom,x=activePoint.tooltipPosition().x,verticalPadding=5;var text="{0}".format(chart.labels[activePoint._index]);var horizontalPadding=10,startX=x-ctx.measureText(text).width/2-horizontalPadding,endX=x+ctx.measureText(text).width/2+horizontalPadding,textHeight=12;ctx.lineWidth=1;ctx.fillStyle='#FFFFFF';if(ctx.canvas.clientWidth<endX){startX=ctx.canvas.clientWidth-(endX-startX);}
if(chart.scales['y-axis-0'].right>startX){startX=chart.scales['y-axis-0'].right-2;}
var areaHeight=textHeight+2*verticalPadding+2*ctx.lineWidth;roundRect(ctx,startX,bottomY-areaHeight/2,ctx.measureText(text).width+2*horizontalPadding,areaHeight,6,"#FFFFFF",'rgba(234, 234, 234, 0.78)');ctx.font="{0}px Ubuntu".format(textHeight);ctx.fillStyle="rgba(0, 0, 0, 0.54)";ctx.textBaseline='middle';ctx.textAlign="left";ctx.fillText(text,startX+horizontalPadding,bottomY);};if(chart.tooltip._active&&chart.tooltip._active.length){drawVerticalLine(chart);drawCircle(chart);drawYValue(chart);drawXValue(chart);}}});;$(function(){var myNewChart;var LABELS_COUNT=4;var DAY='DAY';var WEEK='WEEK';var MONTH='MONTH';var THREE_MONTHS='THREE_MONTHS';var YEAR='YEAR';var START_X_LABEL_PADDING=0.07;var displayPeriodChoices={'DAY':24,'WEEK':168,'MONTH':720,'THREE_MONTHS':2160,'YEAR':8760,};var timeFormatChoices={DAY:'LT',WEEK:'ddd hh A',MONTH:'MMM, DD',THREE_MONTHS:'MMM DD, YYYY',YEAR:'MMM, YYYY',};var baseStepChoicesForAssetChart={DAY:900000,WEEK:3600000,MONTH:86400000,THREE_MONTHS:86400000,YEAR:604800000,};var baseStepChoicesForLumenChart={DAY:600000,};var lastClickTimestamp=Date.now();var getDisplayPeriod=function(period){if(period<=displayPeriodChoices.DAY){return DAY;}else if(period<=displayPeriodChoices.WEEK){return WEEK;}else if(period<=displayPeriodChoices.MONTH){return MONTH;}else if(period<=displayPeriodChoices.THREE_MONTHS){return THREE_MONTHS;}else if(period){return YEAR;}
return YEAR;}
var updateCharts=function(){var period=$('.chart-periods .period.selected').attr('data-value');var periodKey=getDisplayPeriod(period);var counterAsset=null,baseAsset=new Asset({'code':StellarSdk.Asset.native().code,'issuer':StellarSdk.Asset.native().issuer});$('.chart .chart-loader-wrapper').show();if($('.selected-asset').length==2){counterAsset=new Asset({'code':$('.selected-asset.counter-asset').attr('data-asset-code'),'issuer':$('.selected-asset.counter-asset').attr('data-asset-issuer')||null});baseAsset=new Asset({'code':$('.selected-asset.base-asset').attr('data-asset-code'),'issuer':$('.selected-asset.base-asset').attr('data-asset-issuer')||null});}else if($('.selected-asset').length>0){counterAsset=new Asset({'code':$('.selected-asset').attr('data-asset-code'),'issuer':$('.selected-asset').attr('data-asset-issuer')||null});}
if(!counterAsset||(counterAsset.is_native&&baseAsset.is_native)){drawLobstrDataChart(period,periodKey);}else{drawAggregatedChart(period,periodKey,counterAsset,baseAsset);}};var drawAggregatedChart=function(period,periodKey,counterAsset,baseAsset){var CONFIG=window.HORIZON_CONFIG;var horizon=new StellarSdk.Server(CONFIG.HORIZON_URL);var resolution=baseStepChoicesForAssetChart[periodKey];var currencyCode=$('#chart-currency-code').attr('data-value');var clickTimestamp=Date.now();var lastClickTimestamp=clickTimestamp;if(period){var start_time=moment().subtract(moment.duration(parseInt(period),'h')).unix()*1000;}else{var start_time=moment("2014-01-01").unix()*1000;}
horizon.tradeAggregation(counterAsset.getStellarObject(),baseAsset.getStellarObject(),start_time,moment().unix()*1000+resolution,resolution,0).limit(200).call().then(function(response){if(lastClickTimestamp>clickTimestamp){return;}
resetChartHandler();var data=response.records;if(!data||data.length<2){return renderChartEmptyState();}
var open=parseFloat(data[0].open);var close=parseFloat(data[data.length-1].close);var rates=data.map(function(item){return{x:new Date(parseInt(item.timestamp)),y:parseFloat(item.avg)}});var extremeValues=data.reduce(function(a,b){var aHigh=parseFloat(a.high);var aLow=parseFloat(a.low);var bHigh=parseFloat(b.high);var bLow=parseFloat(b.low);return{high:Math.max(aHigh,bHigh),low:Math.min(aLow,bLow)}});return renderChart(counterAsset,currencyCode,rates,periodKey,resolution,open,close,extremeValues.high,extremeValues.low,baseAsset);}).catch(()=>{showNoDataMessage();$('.chart  .chart-loader-wrapper').hide();});};var drawLobstrDataChart=function(period,periodKey){var currencyCode=$('#chart-currency-code').attr('data-value');var resolution=baseStepChoicesForLumenChart[periodKey];var clickTimestamp=Date.now();var lastClickTimestamp=clickTimestamp;if(currencyCode==='XLM'){currencyCode='USD';}
var url=$('#exchange-rates-url').attr('data-value')+"?page_size=all&currency="+currencyCode+"&end_timestamp="+moment().unix();if(period){period=parseInt(period);url+="&start_timestamp="+moment().subtract(moment.duration(parseInt(period),'h')).unix();}
$.ajax({async:true,type:"GET",url:url,}).done(function(response){if(lastClickTimestamp>clickTimestamp){return;}
resetChartHandler();var data=response.results;if(!data||data.length<2){return renderChartEmptyState();}
var open=data[0].reverse_rate;var close=data[data.length-1].reverse_rate;var rates=data.map(function(item){return{x:new Date(item.timestamp*1000),y:item.reverse_rate}});var sortedDataValues=data.map(function(item){return item.reverse_rate}).sort();var low=sortedDataValues[0];var high=sortedDataValues[sortedDataValues.length-1];return renderChart(null,currencyCode,rates,periodKey,resolution,open,close,high,low);});};var showNoDataMessage=function(){$('.chart .box-content').addClass('hidden');$('.chart .no-chart-data-message').removeClass('hidden');$('.chart .chart-last-rate-info').addClass('invisible');};var hideNoDataMessage=function(){$('.chart .box-content').removeClass('hidden');$('.chart .no-chart-data-message').addClass('hidden');$('.chart .chart-last-rate-info').removeClass('invisible');};var getLabels=function(rates,periodKey,resolution){var labels=[];var min=new Date(rates[0].x);var max=new Date(rates[rates.length-1].x);var timeDifference=(max-min);var timeStep=timeDifference*(1-(START_X_LABEL_PADDING*2))/(LABELS_COUNT-1);var baseOffset=timeDifference*START_X_LABEL_PADDING;min.setTime(min.getTime()+baseOffset);var isNeedRoundLabels=function(timeDifference,periodKey,resolution){if(periodKey==DAY){return(timeDifference/(LABELS_COUNT+1))>=resolution}
return false};var isNeedRound=isNeedRoundLabels(timeDifference,periodKey,resolution);var roundTimeByPeriod=function(timestamp,resolution){return Math.round(timestamp/resolution)*resolution;};for(var i=0;i<LABELS_COUNT;i++){if(isNeedRound){min.setTime(roundTimeByPeriod(min.getTime(),resolution));}
labels.push(min);min=new Date(min.getTime()+timeStep);}
return labels};var getDatasetConfig=function(labelText,rates){return{label:labelText,pointRadius:0,fill:true,lineTension:0.1,borderWidth:1.5,data:rates};};var getOptions=function(periodKey,min,max){var updateYTicksOptions=function(ticks,min,max){var isValuesEqual=max==min;if(!isValuesEqual){return;}
if(max<=0){ticks['max']=0.0000001;ticks['min']=0;return;}
var DEFAULT_VALUE_CHANGE=0.1
var iterator=0;var approximation=null;var maxValue;var minValue;var valueDigit;do{valueDigit=Math.floor(Math.log10(max));valueDigit+=iterator;maxValue=Math.ceil10((max*(1+DEFAULT_VALUE_CHANGE)),valueDigit);minValue=Math.floor10((min*(1-DEFAULT_VALUE_CHANGE)),valueDigit);approximation=(max/maxValue)/(minValue/max);iterator-=1;}while(!approximation||(approximation<0.9||approximation>1.1));ticks['max']=maxValue;ticks['min']=minValue;};var layout={padding:{top:24,left:-5,},};var tooltips={enabled:false,mode:'x-axis',displayColors:false,callbacks:{title:function(){return"";}}};var xAxes=[{gridLines:{display:false},type:'time',time:{displayFormats:{hour:timeFormatChoices[periodKey],},unit:'hour',},ticks:{maxRotation:0,minRotation:0,padding:8,source:'labels',},afterFit:(scale)=>{scale.paddingRight=0;},}];var yAxes=[{gridLines:{display:false},ticks:{maxTicksLimit:6,padding:8,labelOffset:-5,},}];updateYTicksOptions(yAxes[0].ticks,min,max);var scales={xAxes:xAxes,yAxes:yAxes,};var legend={display:false,};return{layout:layout,tooltips:tooltips,scales:scales,legend:legend,};}
var renderChartEmptyState=function(){showNoDataMessage();$('.chart  .chart-loader-wrapper').hide();$('.box-header').show();}
var renderChart=function(counterAsset,currencyCode,rates,periodKey,resolution,open,close,high,low,baseAsset){var wallet=window.getCurrentUserWallet();var name=$('#chart-name').attr('data-value');var ctx=$("#"+name).get(0).getContext("2d");var wallet=window.getCurrentUserWallet();var ratesValues=[]
var labels=[]
if(!counterAsset&&!baseAsset){var labelText=currencyCode;}else{var labelText=baseAsset.code;}
if(!rates||rates.length===0){showNoDataMessage();}else{hideNoDataMessage();};$('.chart  .chart-loader-wrapper').hide();$('.box-header').show();if(rates.length<=1){myNewChart=new Chart(ctx,{type:'line',});wallet.runSynchronizerCallbacks();return};var ratesValues=rates.map(function(item){return item.y;});var sorted_rates=ratesValues.slice().sort(function(a,b){return(+a)-(+b);});var current=parseFloat(ratesValues[ratesValues.length-1]);renderStatInfo(name,current,labelText,low,high);labels=getLabels(rates,periodKey,resolution);var datasetConfig=getDatasetConfig(labelText,rates);setChartColorScheme(datasetConfig,ctx,name,open,close);var chart_data={labels:labels,datasets:[datasetConfig,]};var options=getOptions(periodKey,low,high);myNewChart=new Chart(ctx,{type:'line',data:chart_data,options:options});myNewChart.labels=rates.map(function(item,index){return moment(item.x).format("HH:mm DD-MM-YYYY");});wallet.runSynchronizerCallbacks();};var setChartColorScheme=function(datasetConfig,ctx,name,open,close){var line_color=null;var gradient=ctx.createLinearGradient(0,0,0,200);var change=0;if(open&&close){change=((close/open)-1)*100;}
change=parseFloat(change).toFixed(2);if(change>=0){if(change==0){$('#'+name+'_total').text('(0%)');$('.rate-img').attr('src','');}else{$('#'+name+'_total').text('(+ '+change+'%)');}
$('#'+name+'_total').addClass('green');gradient.addColorStop(0,'rgba(138,199,170,1)');gradient.addColorStop(1,'rgba(138,199,170,0)');line_color="#50c794";}else{$('#'+name+'_total').addClass('red');$('#'+name+'_total').text('(- '+(-change)+'%)');gradient.addColorStop(0,'rgba(255,100,100,1)');gradient.addColorStop(1,'rgba(255,100,100,0)');line_color="#D28273";}
datasetConfig.borderColor=line_color;datasetConfig.backgroundColor=gradient;};var renderStatInfo=function(name,current,labelText,min,max){$('#'+name+'_current').html('<span class="value">{0}</span> <span class="code">{1}</span>'.format(truncateZeros(current.toFixed(7)),labelText));$('#'+name+'_min').text('L: '+truncateZeros(min.toFixed(7)));$('#'+name+'_max').text('H: '+truncateZeros(max.toFixed(7)));};var resetStatInfo=function(name){$('#'+name+'_current').html('0');$('#'+name+'_min').text('L: 0');$('#'+name+'_max').text('H: 0');};updateCharts();var resetChartHandler=function(){if(myNewChart){resetStatInfo($('#chart-name').attr('data-value'));myNewChart.destroy();}};$(document).on('updateRateChart',function(){updateCharts();});$(document).on('resetRateChart',resetChartHandler);$('.chart-periods .period').on('click',function(e){$('.chart-periods .period').removeClass('selected');$(this).addClass('selected');$(document).trigger('updateRateChart');});});;