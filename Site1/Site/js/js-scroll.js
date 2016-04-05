$(document).ready(function() {
    $.fn.showLocation = function() {		
        var flag = false;
		var w1 = $("tbody.body-scroll tr:first").width();
		var w2 = $("tbody.body-scroll").width();
		
		$("tbody.body-scroll").css({"margin-right": (w1 - w2) + "px"});
		$(document).bind("mousewheel", stop_scroll);
		$(window).bind("scroll mousewheel", stop_scroll);		
		var autoScroll = setTimeout(function(){scrollingTable(1)}, 5000);
				
		function scrollingTable (item) {
			var number = $("tbody.body-scroll tr").length;
			var height = $("tbody.body-scroll tr:first").height();
			number = number - Math.floor(($("tbody.body-scroll").height())/height);
			if (!flag) {
				if (item <= (number)){
					$(".body-scroll").animate({scrollTop:height*item}, 'slow');
					item++;
					autoScroll = setTimeout(function () {scrollingTable(item)}, 2000);
				}
				else{
					item = 1;
					$(".body-scroll").animate({scrollTop:0}, number*100);
					autoScroll = setTimeout(function () {scrollingTable(item)}, 2000 + number*100);
				}
			}
			else{
				var full = $(".body-scroll").scrollTop();
				var pos = Math.floor(full/height);
				w1 = $("tbody.body-scroll tr:first").width();
				w2 = $("tbody.body-scroll").width();
				$("tbody.body-scroll").css({"margin-right": (w1 - w2) + "px"});
				flag = false;
				$(document).bind("mousewheel", stop_scroll);
				$(window).bind("scroll mousewheel", stop_scroll);
				$(".body-scroll").animate({scrollTop:full}, 100);
				autoScroll = setTimeout(function () {scrollingTable(pos+1)}, 2000);
			}
		}
		
		$("tbody.body-scroll").click(function () {
			$("tbody.body-scroll").css("margin-right", "0px");
			$(".body-scroll").stop(true);
			clearTimeout (autoScroll);
			flag = true;
			$(document).unbind("mousewheel");
			$(window).unbind("scroll mousewheel");
			autoScroll = setTimeout(function(){scrollingTable(1)}, 20000);
		});
		
		function stop_scroll(event) {
			event.preventDefault();
		}
    };
});