var quote = {};

//Créer la chaine string qui contient les emplacements (id) des infos de la monnaie puis la rajoute à l'élément html

var header_pair = '';

var refreshAll = function() {
	location.reload(true);
}

var changeMod = function() {
	
	if ($('#content').hasClass('info')){
		$('#content').removeClass('info perso');
		$('.mode-button').html('<i class="fa fa-user fa-3x" aria-hidden="true"></i>');
		$('#content').addClass('perso');
	}
	else {
		$('#content').removeClass('info perso');
		$('.mode-button').html('<img src="favicon.ico" class="main-logo" />');
		$('#content').addClass('info');
	}

}

var myHeader = function(pair) {
	header_pair = pair;
	$('.selected-head').removeClass('selected-head');
	$('#bh_'+pair).addClass('selected-head');
}

var change_total = function(pair) {
	calc_total(pair);
}

var initStorage = function(pair, pre) {
	if (localStorage.getItem(pre + pair) == null || localStorage.getItem(pre + pair) == undefined) {
			localStorage.setItem(pre + pair, 0);
	}

	if (pre == 'loc_') {
		if ($("#calc_" + pair).val() != undefined /*&& $("#calc_" + pair).val() != 0*/) {
			localStorage.setItem(pre + pair, $("#calc_" + pair).val());
		}
	}
	
	if (pre == 'buy_') {
		if ($("#buy_" + pair).val() != undefined /*&& $("#calc_" + pair).val() != 0*/) {
			localStorage.setItem(pre + pair, $("#buy_" + pair).val());
		}
	}
}

var checkStorage = function(pair, pre) {


	if (localStorage.getItem(pre + pair) != null && localStorage.getItem(pre + pair) != undefined) {

		if (pre == 'loc_')
			$("#calc_" + pair).val(localStorage.getItem(pre + pair));

		if (pre == 'buy_')
			$("#buy_" + pair).val(localStorage.getItem(pre + pair));
	}	
}


var calc_buy = function(pair) {
	initStorage(pair, 'buy_');
	
	var priceBuy = document.getElementById("buy_"+pair).value;
	var sym = pair.substr(pair.length - 3);
	var priceNow = (+document.getElementById("hide_"+pair).value);
	var sum = document.getElementById("calc_"+pair).value;
	var btc = document.getElementById("hide_BTCUSD").value;

	if (sum != 'NaN' &&  priceNow != 'NaN' && 
		priceBuy != 'NaN' && priceBuy > 0 &&
		 sum > 0) {

		var variation = (priceNow - priceBuy) / priceBuy * 100;

		if (sym == 'BTC') {
			var ecart = (((priceBuy * btc) * sum ) - ((priceNow * btc) * sum));
			//ecart = 10000 * ecart;
		}
		else
			var ecart = ((priceBuy * sum) - (priceNow * sum));
		ecart *= (-1);
		


		document.getElementById("winloss_"+pair).innerHTML = variation.toFixed(2) + '%';
		document.getElementById("ecart_"+pair).innerHTML = ecart.toFixed(2) + '$';
		
		$('#winloss_'+pair).removeClass('down up none');
		if (variation >= 0)
			$('#winloss_'+pair).addClass('up');
		else
			$('#winloss_'+pair).addClass('down');

		$('#ecart_'+pair).removeClass('down up none');
		if (ecart >= 0)
			$('#ecart_'+pair).addClass('up');
		else
			$('#ecart_'+pair).addClass('down');

		initStorage(pair, 'buy_');
	}
	else {
		$('#ecart_'+pair).addClass('none');
		$('#ecart_'+pair).addClass('none');
	}
}

var calc_total = function(pair) {
	initStorage(pair, 'loc_');
	if (document.getElementById("calc_"+pair).value != 'NaN' &&  (+document.getElementById("price_"+pair).innerHTML) != 'NaN') {		
		var price = document.getElementById('price_' + pair).innerHTML.replace('$','');

		document.getElementById("total_"+pair).innerHTML = (document.getElementById("calc_"+pair).value * (+price)).toFixed(2) + '$';
		
		initStorage(pair, 'loc_');
	}
}

var createDom = function(pair) {
	var wrapper = document.getElementById("content");
	var div = document.createElement("div");
	var curr = "";
	//if (pair == 'POWRBTC')
	//	curr = "Ƀ";
	var html = '<div class="wrapper">';
	html += '<button title="The price will be in the header of this page" class="b-header" id="bh_'+pair+'" onClick="myHeader(\''+pair+'\')"><i class="fa fa-arrow-up" aria-hidden="true"></i></button>';
	html += '<h1><span class="pairname" id="fsym_'+ pair +'"></span><span class="under-pair" id="tsym_'+ pair +'"></span><strong><span title="Price in dollar" class="price" id="price_'+ pair +'"></span> '+curr+'</strong></h1>';
	html += '<div class="label changer" title="24h Change of the price"><span class="value none" id="change_'+ pair +'"></span> <span class="value imp percent" id="changepct_'+ pair +'"></span></div>';
	//html += '<div class="label none">Last Market: <span class="market" id="market_'+ pair +'"></span></div>';
	html += '<input type="hidden" id="hide_'+pair+'" />';	
	//html += '<div class="label">Last Trade Id: <span class="value" id="tradeid_'+ pair +'"></span></div>';
	//html += '<div class="label none">Last Trade Volume: <span class="value" id="volume_'+ pair +'"></span></div>';
	//html += '<div class="label none">Last Trade VolumeTo: <span class="value" id="volumeto_'+ pair +'"></span></div>';
	//html += '<div class="label none">24h Volume: <span class="value" id="24volume_'+ pair +'"></span></div>';
	//html += '<div class="label none">24h VolumeTo: <span class="value" id="24volumeto_'+ pair +'"></span></div>';
	//html += '<div class="source none"> Source: <a href="http://www.cryptocompare.com">CryptoCompare</a></div>';
	
	
	/*if (pair == 'POWRBTC'){
		html += '<div class="label total none" title="Your funds of this currency"><span id="total_'+pair+'" class="totalpair"></span> $</div>';
		html += '<input class="i-calc none" id="calc_'+pair+'" type="number" step="0.001" title="Write how many ' + pair + ' you have, it will be save" onchange="calc_total(\''+pair+'\')">';
	}
	else{*/
		html += '<div class="label total" title="Your funds of this currency"><span id="total_'+pair+'" class="totalpair"></span><br /><span id="ecart_'+pair+'" class="ecart"></span><br /><span id="winloss_'+pair+'" class="winloss"></span></div>';
		html += '<div class="inputed"><label>Price ('+ pair.substr(pair.length - 3)+')</label><input class="i-calc downed" id="buy_'+pair+'" type="number" step="0.001" title="Write how much price  you buy ' + pair + '" onchange="calc_buy(\''+pair+'\')">';
		html += '<label>Quantity</label><input class="i-calc" id="calc_'+pair+'" type="number" step="0.001" title="Write how many ' + pair + ' you have, it will be save" onchange="calc_total(\''+pair+'\')"></div>';
		
	//}

	html += '</div>';
	div.innerHTML = html;
	wrapper.appendChild(div);
	if (firstCheck > 0) {
		checkStorage(pair, 'loc_');
		checkStorage(pair, 'buy_');
		firstCheck -= 1;
	}
};

var custom_change = function(pair) {

	var cust = document.getElementById("hide_" + pair);
	var btc = document.getElementById("hide_" + 'BTCUSD');

	var total = 0.0;

	if (cust != null && btc != null) {
		total = (+cust.value) * (+btc.value);
		if (document.getElementById('price_' + pair) != null){
			document.getElementById('price_' + pair).innerHTML = total.toFixed(2);
		}
	}
}

var totalAllPair = function() {

    var sum = 0.0;
	$('.totalpair').each(function(){
	    sum += parseFloat($(this).text());  // Or this.innerHTML, this.innerText
	});
	if (sum.toFixed(2) != 'NaN')
		$('#myTotal').text(sum.toFixed(2));

}




//attribut les infos que contienne _quote à chaque emplacement de la div
var displayQuote = function(_quote) {

	var fsym = CCC.STATIC.CURRENCY.SYMBOL[_quote.FROMSYMBOL];
	var tsym = CCC.STATIC.CURRENCY.SYMBOL[_quote.TOSYMBOL];
	var pair = _quote.FROMSYMBOL + _quote.TOSYMBOL;
	
	//document.getElementById("market_" + pair).innerHTML = _quote.LASTMARKET;
	document.getElementById("fsym_" + pair).innerHTML = _quote.FROMSYMBOL;
	document.getElementById("tsym_" + pair).innerHTML = _quote.TOSYMBOL;
	document.getElementById("price_" + pair).innerHTML = _quote.PRICE;
	document.getElementById("hide_" + pair).value = _quote.PRICE;

	//document.getElementById("volume_" + pair).innerHTML = CCC.convertValueToDisplay(fsym, _quote.LASTVOLUME);
	//document.getElementById("volumeto_" + pair).innerHTML = CCC.convertValueToDisplay(tsym, _quote.LASTVOLUMETO);
	//document.getElementById("24volume_" + pair).innerHTML = CCC.convertValueToDisplay(fsym, _quote.VOLUME24HOUR);	
	//document.getElementById("24volumeto_" + pair).innerHTML = CCC.convertValueToDisplay(tsym, _quote.VOLUME24HOURTO);

	//document.getElementById("tradeid_" + pair).innerHTML = _quote.LASTTRADEID.toFixed(0);
	//document.getElementById("tradeid_" + pair).innerHTML = _quote.LASTTRADEID.toFixed(0);

	document.getElementById("change_" + pair).innerHTML = CCC.convertValueToDisplay(tsym, _quote.CHANGE24H);
	document.getElementById("changepct_" + pair).innerHTML = _quote.CHANGEPCT24H.toFixed(2) + "%";
	
	initStorage(pair, 'loc_');
	initStorage(pair, 'buy_');
	
	totalAllPair();
	if (pair.substr(pair.length - 3) == "BTC")
		custom_change(pair);
	calc_buy(pair);
	calc_total(pair);



	if (_quote.CHANGEPCT24H > 0){
		document.getElementById("changepct_" + pair).className = "up";
	} 
	else if (_quote.CHANGEPCT24H < 0) {
		document.getElementById("changepct_" + pair).className = "down";
	}
	else
		document.getElementById("changepct_" + pair).className = "equal";

	if (header_pair != '') {
		var header_value = document.getElementById("price_" + header_pair).innerHTML + ' ~ ' + header_pair.slice(0, -3) + ' ~ WajiCoin';
		document.title = header_value;		
	}
}

//fonction qui met à jour la variable quote pour ensuite la display avec la fonction au dessus
var updateQuote = function(result) {

	var keys = Object.keys(result);
	var pair = result.FROMSYMBOL + result.TOSYMBOL;
	if (!quote.hasOwnProperty(pair)) {
		quote[pair] = {}
		createDom(pair);
	}
	for (var i = 0; i <keys.length; ++i) {
		quote[pair][keys[i]] = result[keys[i]];
	}

	quote[pair]["CHANGE24H"] = quote[pair]["PRICE"] - quote[pair]["OPEN24HOUR"];
	quote[pair]["CHANGEPCT24H"] = quote[pair]["CHANGE24H"]/quote[pair]["OPEN24HOUR"] * 100;
	displayQuote(quote[pair]);
}

var socket = io.connect('https://streamer.cryptocompare.com/');

//Format: {SubscriptionId}~{ExchangeName}~{FromSymbol}~{ToSymbol}
//Use SubscriptionId 0 for TRADE, 2 for CURRENT and 5 for CURRENTAGG

//ici les currency que tu veux, je ne sais pas pourquoi le BTC bug parfois (et fait tout buguer)
var subscription = [
					'5~CCCAGG~BTC~USD',
					'5~CCCAGG~MIOTA~USD',
 					'5~CCCAGG~ADA~BTC',
					'5~CCCAGG~ADX~BTC',
 					'5~CCCAGG~XLM~BTC',
 					'5~CCCAGG~ETH~USD',
 					'5~CCCAGG~REQ~BTC',
					'5~CCCAGG~ORN~USDT',

					];//, '5~CCCAGG~BTC~USD'];

var firstCheck = subscription.length;

socket.emit('SubAdd', {subs:subscription} );

socket.on("m", function(message){
	var messageType = message.substring(0, message.indexOf("~"));
	var res = {};
	if (messageType === CCC.STATIC.TYPE.CURRENTAGG) {
		res = CCC.CURRENT.unpack(message);
		updateQuote(res);
	}						
});

/*
var chart = new cryptowatch.Embed('bitfinex', 'iotusd', {
	timePeriod: '1d',
  width: 400,
  customColorScheme: {
    bg:           "000000",
    text:         "b2b2b2",
    textStrong:   "e5e5e5",
    textWeak:     "7f7f7f",
    short:        "FD4600",
    shortFill:    "FF672C",
    long:         "6290FF",
    longFill:     "002782",
    cta:          "363D52",
    ctaHighlight: "414A67",
    alert:        "FFD506",
	}
});
chart.mount('#chart-container');
*/