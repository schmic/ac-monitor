Handlebars.registerHelper("formatTimeOfDay", function(sunAngle) {
	var someDate = new Date(1970, 1, 1, 13, 0, 0, 0);
	someDate.setMinutes(someDate.getMinutes() + (sunAngle/16*60));
	return someDate.toLocaleTimeString();
});

Handlebars.registerHelper("formatTrack", function(track) {
	track = track.replace(/-/g, '').replace(/\./g, '');
	var tracks = {
		drag400: 'Dragstrip 400',
		drag1000: 'Dragstrip 1000',
		drift: 'Drift',
		imola: 'Imola',
		magione: 'Magione',
		monza: 'Monza',
		monza66: 'Monza \'66',
		mugello: 'Mugello',
		nurburgring: 'Nürgburgring GP',
		silverstone: 'Silverstone',
		silverstoneinternational: 'Silverstone Int.',
		vallelunga: 'Vallelunga',
		vallelungaclub: 'Vallelunga Club',
		nord_snoopy_: 'Nordschleife Tourist'
	}
	return tracks[track] != undefined ? tracks[track] : track;
});

Handlebars.registerHelper("formatCar", function(car) {
	car = car.replace(/-/g, '').replace(/\./g, '');
	var cars = {
		abarth500: 'Abarth 500',
		abarth500_s1: 'Abarth 500 EssEss',
		bmw_1m: 'BMW 1M',
		bmw_1m_s3: 'BMW 1M S3',
		bmw_m3_e30: 'BMW M3 E30',
		bmw_m3_e30_drift: 'BMW M3 E30 Drift',
		bmw_m3_e30_dtm: 'BMW M3 E30 DTM',
		bmw_m3_e30_gra: 'BMW M3 E30 GRA',
		bmw_m3_e30_s1: 'BMW M3 E30 S1',
		bmw_m3_e92: 'BMW M3 E92',
		bmw_m3_e92_drift: 'BMW M3 E92 Drift',
		bmw_m3_e92_s1: 'BMW M3 E92 S1',
		bmw_m3_gt2: 'BMW M3 GT2',
		bmw_z4: 'BMW Z4',
		bmw_z4_drift: 'BMW Z4 Drift',
		bmw_z4_gt3: 'BMW Z4 GT3',
		bmw_z4_s1: 'BMW Z4 S1',
		ferrari_312t: 'Ferrari 312t',
		ferrari_458: 'Ferrari 458',
		ferrari_458_s3: 'Ferrari 458 S3',
		ferrari_599xxevo: 'Ferrari 599xx Evo',
		ferrari_f40: 'Ferrari F40',
		ferrari_f40_s3: 'Ferrari F40 S3',
		ktm_xbow_r: 'KTM X-Bow R',
		lotus_2_eleven: 'Lotus 2-11',
		lotus_49: 'Lotus Type 49',
		lotus_elise_sc: 'Lotus Elise SC',
		lotus_elise_sc_s1: 'Lotus Elise SC S1',
		lotus_elise_sc_s2: 'Lotus Elise SC S2',
		lotus_evora_gtc: 'Lotus Evora GTC',
		lotus_evora_gte: 'Lotus Evora GTE',
		lotus_evora_gx: 'Lotus Evora GX',
		lotus_evora_s: 'Lotus Evora S',
		lotus_evora_s_s2: 'Lotus Evora S2',
		lotus_exige_240: 'Lotus Exige 240',
		lotus_exige_240_s3: 'Lotus Exige S3',
		lotus_exige_s_roadster: 'Lotus Exige S Roadster',
		lotus_exige_scura: 'Lotus Exige Scura',
		lotus_exos_125: 'Lotus Exos T125',
		lotus_exos_125_s1: 'Lotus Exos T125 S1',
		mclaren_mp412c: 'McLaren MP412c',
		mclaren_mp412c_gt3: 'McLaren MP412c GT3',
		p45_2011: 'P4/5 Competizione',
		pagani_huayra: 'Pagani Huayra',
		pagani_zonda_r: 'Pagani Zonda R',
		tatuusfa1: 'Tatuus F.Abarth'
	};
	return cars[car] != undefined ? cars[car] : car;
});


function replaceContent(html) {
	$('body div#content').html(html);
}

// -------------------------------------------------------------------------- //

var socket = io.connect();

socket.on('reconnect', function() {
	//window.location = '/';
});

socket.on('disconnect', function() {
	//replaceContent('<div class="container"><div class="jumbotron"><b>Connection lost, reconnecting...</b></div></div>');
});

socket.on('err', function(data) {
	console.log('ERROR:', data);
});

socket.on('replaceContent', replaceContent);

// -------------------------------------------------------------------------- //

function getPresets() {
    socket.emit('getPresets', { });
}
