jQuery.noConflict();

(function($) {
    $(function() {
		$(document).ready(function(){
			const keyMaster = '3721f68c1e46f804b66000eca7843f24';
			
			$('.listaTemp').delegate('.btnTry','click',function(e){
				e.preventDefault();
				let item = $(this).parents('.card');
				let cidade = item.attr('data-city');
				updateWeather(cidade, item);
			});
			
			function loadTemp(){
				$('.listaTemp li').each(function(idx,item){
					let cidade = $(item).attr('data-city');
					updateWeather(cidade, item);
				});
			}
			
			function getMoment(){
				let data = new Date();
				let hora = data.getHours();
				let minutos = data.getMinutes();
				let segundos = data.getSeconds();
				let resultado = hora;
				let extensao = '';
				if(hora > 12){
					extensao = 'PM';
					hora = (hora - 12);
					resultado = hora;
					if(hora < 10){
						resultado = "0" + hora;
					}else if(hora == 12){
						hora = "00";
						extensao = 'AM';
					}
				}
				else if(hora < 12){
					resultado = ((hora < 10) ? "0" + hora : hora);
					extensao = 'AM';
				}else if(hora == 12){
					extensao = 'PM';
				}
				if(minutos < 10){
					minutos = "0" + minutos; 
				}
				if(segundos < 10){
					segundos = "0" + segundos; 
				}
				let time = resultado + ':' + minutos + ':' + segundos + ' ' + extensao; 
				return time;
			}
			
			function updateWeather(city, item){
				$.ajax({
					url: "https://api.openweathermap.org/data/2.5/weather",
					data: {q: city, units: "metric", lang: "pt_br", appid: keyMaster},
					type: "GET",
					dataType: "JSON",
					beforeSend: function() {
						$(item).find('.meta').addClass('loading').html("<img src='assets/images/loader.svg'>");
					},
					success:function(data){
						let temperatura = '';
						let umidade = '<div><h5>Humidity</h5><strong>'+data.main.humidity+'<small>%</small></strong></div>';
						let pressao = '<div><h5>Pressure</h5><strong>'+data.main.pressure+'<small>hPa</small></strong></div>';
						if(data.main.temp <= 5){
							temperatura = " cold";
						} else if(data.main.temp > 25){
							temperatura = " hot";
						}
						$(item).find('.meta').removeClass('loading error').html('<div class="temp'+temperatura+'">'+parseInt(data.main.temp, 10)+'º</div>');
						$(item).find('.meta').append('<div class="info">'+umidade+pressao+'</div>');
						$(item).find('.meta').append('<div class="update">Updated at '+getMoment()+'</div>');
					},
					error:function(){
						$(item).find('.meta').removeClass('loading').addClass('error').html('<h4>Somenthing went wrong</h4><a href="#" title="Try Again" class="btnTry">Try Again</a>');
					}
				});
			}
			
			loadTemp();
			
			setInterval(loadTemp, 600000);
			
		});
	});
})(jQuery);
