// 📝 Fetch all DOM nodes in jQuery and Snap SVG

var container = $('.container');
var card = $('#card');
var innerSVG = Snap('#inner');
var outerSVG = Snap('#outer');
var backSVG = Snap('#back');
var summary = $('#summary');
var date = $('#date');
var temp = $('#temperature');
var tempFormat = $('#format');
var weatherContainer1 = Snap.select('#layer1');
var weatherContainer2 = Snap.select('#layer2');
var weatherContainer3 = Snap.select('#layer3');
var innerRainHolder1 = weatherContainer1.group();
var innerRainHolder2 = weatherContainer2.group();
var innerRainHolder3 = weatherContainer3.group();
var innerLeafHolder = weatherContainer1.group();
var innerDustHolder = weatherContainer1.group();
var innerFlyingObjectHolder = weatherContainer1.group();
var innerSnowHolder = weatherContainer1.group();
var innerHailHolder = weatherContainer2.group();
//var innerCloudHolder = weatherContainer1.group();
var innerLightningHolder = weatherContainer1.group();
var leafMask = outerSVG.rect();
var dustMask = outerSVG.rect();
var flyingObjectMask = outerSVG.rect();
var leaf = Snap.select('#leaf');
var car = Snap.select('#car');
var cow = Snap.select('#cow');
var sun = Snap.select('#sun');
var sunburst = Snap.select('#sunburst');
var outerSplashHolder = outerSVG.group();
var outerLeafHolder = outerSVG.group();
var outerDustHolder = outerSVG.group();
var outerFlyingObjectHolder = outerSVG.group();
var outerSnowHolder = outerSVG.group();
var outerHailHolder = weatherContainer3.group();
var cloudsChanged = false;

var lightningTimeout;

// Set mask for leaf holder 

outerLeafHolder.attr({
  'clip-path': leafMask });


outerFlyingObjectHolder.attr({
  'clip-path': flyingObjectMask });


outerDustHolder.attr({
  'clip-path': dustMask });


// create sizes object, we update this later

var sizes = {
  container: { width: 0, height: 0 },
  card: { width: 0, height: 0 } };


// grab cloud groups 

var clouds = [
{ group: Snap.select('#cloud1') },
{ group: Snap.select('#cloud2') },
{ group: Snap.select('#cloud3') }];


var fog = [
{ group: Snap.select('#fog1') },
{ group: Snap.select('#fog2') },
{ group: Snap.select('#fog3') }];


var classes = ['night', 'day', 'hot', 'cold'];

// set weather types ☁️ 🌬 🌧 ⛈ ☀️
var openWeatherCondMap = {
  200: { type: 'thunder', class: 'storm', intensity: .6, icon: 'wi-thunderstorm', name: 'Thunderstorms', main: "Thunderstorm", discription: "thunderstorm with light rain" },
  201: { type: 'thunder', class: 'storm', intensity: .7, icon: 'wi-thunderstorm', name: 'Thunderstorms', main: "Thunderstorm", discription: "thunderstorm with rain" },
  202: { type: 'thunder', class: 'storm', intensity: 1, icon: 'wi-thunderstorm', name: 'Thunderstorms', main: "Thunderstorm", discription: "thunderstorm with heavy rain" },
  210: { type: 'thunder', class: 'storm', intensity: .5, icon: 'wi-thunderstorm', name: 'Thunderstorms', main: "Thunderstorm", discription: "light thunderstorm" },
  211: { type: 'thunder', class: 'storm', intensity: .9, icon: 'wi-thunderstorm', name: 'Thunderstorms', main: "Thunderstorm", discription: "thunderstorm" },
  212: { type: 'severe', class: 'storm', intensity: 1.25, icon: 'wi-thunderstorm', name: 'Severe Thunderstorms', main: "Thunderstorm", discription: "heavy thunderstorm" },
  221: { type: 'severe', class: 'storm', intensity: 1.2, icon: 'wi-thunderstorm', name: 'Severe Thunderstorms', main: "Thunderstorm", discription: "ragged thunderstorm" },
  230: { type: 'thunder', class: 'storm', intensity: .1, icon: 'wi-storm-showers', name: 'Thundershowers', main: "Thunderstorm", discription: "thunderstorm with light drizzle" },
  231: { type: 'thunder', class: 'storm', intensity: .2, icon: 'wi-storm-showers', name: 'Scattered Thunderstorms', main: "Thunderstorm", discription: "thunderstorm with drizzle" },
  232: { type: 'thunder', class: 'storm', intensity: .4, icon: 'wi-storm-showers', name: 'Isolated Thunderstorms', main: "Thunderstorm", discription: "thunderstorm with heavy drizzle" },
  300: { type: 'rain', class: '', intensity: .15, icon: 'wi-sprinkle', main: "Drizzle", discription: "light intensity drizzle" },
  301: { type: 'rain', class: '', intensity: .25, icon: 'wi-sprinkle', main: "Drizzle", discription: "drizzle" },
  302: { type: 'rain', class: '', intensity: .35, icon: 'wi-sprinkle', main: "Drizzle", discription: "heavy intensity drizzle" },
  310: { type: 'rain', class: '', intensity: .45, icon: 'wi-sprinkle', main: "Drizzle", discription: "light intensity drizzle rain" },
  311: { type: 'rain', class: '', intensity: .55, icon: 'wi-sprinkle', main: "Drizzle", discription: "drizzle rain" },
  312: { type: 'rain', class: '', intensity: .65, icon: 'wi-sprinkle', main: "Drizzle", discription: "heavy intensity drizzle rain" },
  313: { type: 'rain', class: '', intensity: .75, icon: 'wi-sprinkle', main: "Drizzle", discription: "shower rain and drizzle" },
  314: { type: 'rain', class: '', intensity: .85, icon: 'wi-sprinkle', main: "Drizzle", discription: "heavy shower rain and drizzle" },
  321: { type: 'rain', class: '', intensity: .5, icon: 'wi-sprinkle', main: "Drizzle", discription: "shower drizzle" },
  500: { type: 'rain', class: '', intensity: .75, icon: 'wi-rain', name: 'Scattered Showers', main: "Rain", discription: "light rain" },
  501: { type: 'rain', class: '', intensity: .8, icon: 'wi-rain', name: 'Showers', main: "Rain", discription: "moderate rain" },
  502: { type: 'rain', class: '', intensity: 1, icon: 'wi-rain', name: 'Showers', main: "Rain", discription: "heavy intensity rain" },
  503: { type: 'rain', class: '', intensity: 1.15, icon: 'wi-rain', name: 'Showers', main: "Rain", discription: "very heavy rain" },
  504: { type: 'rain', class: '', intensity: 1.3, icon: 'wi-rain', name: 'Showers', main: "Rain", discription: "extreme rain" },
  511: { type: 'rain', class: 'cold', intensity: 1, icon: 'wi-rain-mix', name: 'Freezing Rain', main: "Rain", discription: "freezing rain" },
  520: { type: 'rain', class: '', intensity: .25, icon: 'wi-showers', name: 'Light Showers', mmain: "Rain", discription: "light intensity shower rain" },
  521: { type: 'rain', class: '', intensity: .55, icon: 'wi-showers', name: 'Scattered Showers', mmain: "Rain", discription: "shower rain" },
  522: { type: 'rain', class: '', intensity: .75, icon: 'wi-showers', name: 'Heavy Showers', mmain: "Rain", discription: "heavy intensity shower rain" },
  531: { type: 'rain', class: '', intensity: 1, icon: 'wi-showers', name: 'Rain Showers', mmain: "Rain", discription: "ragged shower rain" },
  600: { type: 'snow', class: 'cold', intensity: .5, icon: 'wi-snow', name: 'Snow Flurries', main: "Snow", discription: "light snow" },
  601: { type: 'snow', class: 'cold', intensity: .75, icon: 'wi-snow', name: 'Light Snow Showers', main: "Snow", discription: "Snow" },
  602: { type: 'snow', class: 'cold', intensity: 1, icon: 'wi-snow', name: 'Snow', main: "Snow", discription: "Heavy snow" },
  611: { type: 'sleet', class: 'cold', intensity: 1, icon: 'wi-sleet', name: 'Sleet', main: "Snow", discription: "Sleet" },
  612: { type: 'mix-rain-sleet', class: 'cold', intensity: .5, icon: 'wi-sleet', name: 'Light Rain and Sleet', main: "Snow", discription: "Light shower sleet" },
  613: { type: 'mix-rain-sleet', class: 'cold', intensity: 1, icon: 'wi-sleet', name: 'Mixed Rain and Sleet', main: "Snow", discription: "Shower sleet" },
  615: { type: 'mix-rain-snow', class: 'cold', intensity: .5, icon: 'wi-rain-mix', name: 'Light Rain and Snow', main: "Snow", discription: "Light rain and snow" },
  616: { type: 'mix-rain-snow', class: 'cold', intensity: 1, icon: 'wi-rain-mix', name: 'Mixed Rain and Snow', main: "Snow", discription: "Rain and snow" },
  620: { type: 'mix-snow-sleet', class: 'cold', intensity: .5, icon: 'wi-snow', name: 'Light Snow Shower', main: "Snow", discription: "Light shower snow" },
  621: { type: 'mix-snow-sleet', class: 'cold', intensity: .8, icon: 'wi-snow', name: 'Snow Shower', main: "Snow", discription: "Shower snow" },
  622: { type: 'mix-snow-sleet', class: 'cold', intensity: 1.2, icon: 'wi-snow', name: 'Heavey Snow Shower', main: "Snow", discription: "Heavy shower snow" },
  701: { type: 'rain', class: '', intensity: .05, icon: 'wi-fog', main: "Drizzle", discription: "light intensity drizzle", main: "Mist", discription: "mist" },
  711: { type: 'smoke', class: 'hot', intensity: .1, icon: 'wi-smoke', name: 'Smokey', main: "Smoke", discription: "Smoke" },
  721: { type: 'haze', class: '', intensity: .5, icon: 'wi-fog', name: 'Haze', main: "Haze", discription: "Haze" },
  731: { type: 'dust', class: 'hot', intensity: 1.5, icon: 'wi-sandstorm', name: 'Dust', main: "Dust", discription: "sand/ dust whirls" },
  741: { type: 'haze', class: '', intensity: .5, icon: 'wi-fog', name: 'Foggy', main: "Fog", discription: "fog" },
  751: { type: 'dust', class: 'hot', intensity: 1.5, icon: 'wi-sandstorm', name: 'Dust', main: "Sand", discription: "sand" },
  761: { type: 'dust', class: '', intensity: 1, icon: 'wi-sandstorm', name: 'Dust', main: "Dust", discription: "dust" },
  762: { type: 'smoke', class: 'hot', intensity: .21, icon: 'wi-smoke', name: 'Ash', main: "Ash", discription: "volcanic ash" },
  771: { type: 'severe', class: 'storm', intensity: 2.5, icon: 'wi-thunderstorm', name: 'Tropical Storm', main: "Squall", discription: "squalls" },
  781: { type: 'severe', class: 'severe', intensity: 5, icon: 'wi-tornado', name: 'Tornado', main: "Tornado", discription: "tornado" },
  800: { type: 'sun', class: '', intensity: 1, icon: 'wi-day-sunny', name: 'Sunny', main: "Clear", discription: "clear sky" },
  801: { type: 'cloud', class: '', intensity: .1, icon: 'wi-day-cloudy', name: 'Partly Cloudy', main: "Clouds", discription: "few clouds: 11-25%" },
  802: { type: 'cloud', class: '', intensity: .3, icon: 'wi-day-cloudy', name: 'Scattered Cloudy', main: "Clouds", discription: "scattered clouds: 25-50%" },
  803: { type: 'cloud', class: '', intensity: .7, icon: 'wi-day-cloudy', name: 'Mosty Cloudy', main: "Clouds", discription: "broken clouds: 51-84%" },
  804: { type: 'cloud', class: '', intensity: 1, icon: 'wi-cloudy', name: 'Cloudy', main: "Clouds", discription: "overcast clouds: 85-100%" } };

var weather = [
{ type: 'snow', class: '', intensity: 1, name: 'Snow' },
{ type: 'mix', class: '', intensity: 1, name: 'Winter Mix' },
{ type: 'mix-rain-sleet', class: '', intensity: 1, name: 'Winter Mix' },
{ type: 'mix-rain-snow', class: '', intensity: 1, name: 'Winter Mix' },
{ type: 'mix-snow-sleet', class: '', intensity: 1, name: 'Winter Mix' },
{ type: 'sleet', class: '', intensity: 1, name: 'Sleet' },
{ type: 'wind', class: '', intensity: 1, name: 'Windy' },
{ type: 'rain', class: '', intensity: 1, name: 'Rain' },
{ type: 'hail', class: '', intensity: 2, name: 'Hail Storm' },
{ type: 'thunder', class: '', intensity: 1, name: 'Storms' },
{ type: 'severe', class: '', intensity: 2, name: 'T Storms' },
{ type: 'cloud', class: '', intensity: 1, name: 'Cloudy' },
{ type: 'sun', class: '', intensity: 1, name: 'Sunny' },
{ type: 'haze', class: '', intensity: 1, name: 'Foggy' },
{ type: 'smoke', class: '', intensity: 1, name: 'Smoke' },
{ type: 'dust', class: '', intensity: 1, name: 'Dust' }];

var weatherMap = {
  0: { type: 'severe', class: 'severe', intensity: 5, icon: 'wi-tornado', name: 'Tornado' },
  1: { type: 'severe', class: 'storm', intensity: 2.5, icon: 'wi-thunderstorm', name: 'Tropical Storm' }, //tropical storm
  2: { type: 'severe', class: 'severe', intensity: 5, icon: 'wi-hurricane', name: 'Hurricane' }, //hurricane
  3: { type: 'severe', class: 'storm', intensity: 1.25, icon: 'wi-thunderstorm', name: 'Severe Thunderstorms' }, //severe thunderstorms
  4: { type: 'thunder', class: 'storm', intensity: 1, icon: 'wi-thunderstorm', name: 'Thunderstorms' }, //thunderstorms
  5: { type: 'mix-rain-snow', class: 'cold', intensity: 1, icon: 'wi-rain-mix', name: 'Mixed Rain and Snow' }, //mixed rain and snow
  6: { type: 'mix-rain-sleet', class: 'cold', intensity: 1, icon: 'wi-sleet', name: 'Mixed Rain and Sleet' }, //mixed rain and sleet
  7: { type: 'mix-snow-sleet', class: 'cold', intensity: 1, icon: 'wi-sleet', name: 'Mixed Snow and Sleet' }, //mixed snow and sleet
  8: { type: 'rain', class: 'cold', intensity: .5, icon: 'wi-rain-mix', name: 'Freezing Drizzle' }, //freezing drizzle
  9: { type: 'rain', class: '', intensity: .5, icon: 'wi-sprinkle', name: 'Drizzle' }, //drizzle
  10: { type: 'rain', class: 'cold', intensity: 1, icon: 'wi-rain-mix', name: 'Freezing Rain' }, //freezing rain
  11: { type: 'rain', class: '', intensity: 1, icon: 'wi-rain', name: 'Showers' }, //showers
  12: { type: 'rain', class: '', intensity: 1, icon: 'wi-rain', name: 'Showers' }, //showers
  13: { type: 'snow', class: 'cold', intensity: .5, icon: 'wi-snow', name: 'Snow Flurries' }, //snow flurries
  14: { type: 'snow', class: 'cold', intensity: .75, icon: 'wi-snow', name: 'Light Snow Showers' }, //light snow showers
  15: { type: 'snow', class: 'cold', intensity: .5, icon: 'wi-snow', name: 'Blowing Snow' }, //blowing snow
  16: { type: 'snow', class: 'cold', intensity: 1, icon: 'wi-snow', name: 'Snow' }, //snow
  17: { type: 'hail', class: 'storm', intensity: 1.5, icon: 'wi-hail', name: 'Hail' }, //hail
  18: { type: 'sleet', class: 'cold', intensity: 1, icon: 'wi-sleet', name: 'Sleet' }, //sleet
  19: { type: 'dust', class: 'hot', intensity: 1.5, icon: 'wi-sandstorm', name: 'Dust' }, //dust
  20: { type: 'haze', class: '', intensity: .5, icon: 'wi-fog', name: 'Foggy' }, //foggy
  21: { type: 'haze', class: '', intensity: .5, icon: 'wi-fog', name: 'Haze' }, //haze
  22: { type: 'smoke', class: 'hot', intensity: .1, icon: 'wi-smoke', name: 'Smokey' }, //smoky
  23: { type: 'wind', class: '', intensity: 4, icon: 'wi-cloudy-gusts', name: 'Blustery' }, //blustery
  24: { type: 'wind', class: '', intensity: 1, icon: 'wi-strong-wind', name: 'Windy' }, //windy
  25: { type: 'sun', class: 'cold', intensity: 1, icon: 'wi-snowflake-cold', name: 'Cold' }, //cold
  26: { type: 'cloud', class: '', intensity: 1, icon: 'wi-cloudy', name: 'Cloudy' }, //cloudy
  27: { type: 'cloud', class: 'night', intensity: .3, icon: 'wi-night-cloudy', name: 'Mosty Cloudy (Night)' }, //mostly cloudy (night)
  28: { type: 'cloud', class: '', intensity: .3, icon: 'wi-day-cloudy', name: 'Mosty Cloudy' }, //mostly cloudy (day)
  29: { type: 'cloud', class: 'night', intensity: .1, icon: 'wi-night-cloudy', name: 'Partly Cloudy (Night)' }, //partly cloudy (night)
  30: { type: 'cloud', class: '', intensity: .1, icon: 'wi-day-cloudy', name: 'Partly Cloudy' }, //partly cloudy (day)
  31: { type: 'sun', class: 'night', intensity: 1, icon: 'wi-night-clear', name: 'Clear (Night)' }, //clear (night)
  32: { type: 'sun', class: '', intensity: 1, icon: 'wi-day-sunny', name: 'Sunny' }, //sunny
  33: { type: 'sun', class: 'night', intensity: 1, icon: 'wi-night-clear', name: 'Fair (Night)' }, //fair (night)
  34: { type: 'sun', class: '', intensity: 1, icon: 'wi-day-sunny', name: 'Fair (Day)' }, //fair (day)
  35: { type: 'hail', class: 'storm', intensity: 1, icon: 'wi-hail', name: 'Mixed Rain and Hail' }, //mixed rain and hail
  36: { type: 'sun', class: 'hot', intensity: 1, icon: 'wi-day-sunny', name: 'Hot' }, //hot
  37: { type: 'thunder', class: 'storm', intensity: .25, icon: 'wi-storm-showers', name: 'Isolated Thunderstorms' }, //isolated thunderstorms
  38: { type: 'thunder', class: 'storm', intensity: .5, icon: 'wi-storm-showers', name: 'Scattered Thunderstorms' }, //scattered thunderstorms
  39: { type: 'thunder', class: 'storm', intensity: .5, icon: 'wi-storm-showers', name: 'Scattered Thunderstorms' }, //scattered thunderstorms
  40: { type: 'rain', class: '', intensity: .75, icon: 'wi-showers', name: 'Scattered Showers' }, //scattered showers
  41: { type: 'snow', class: 'cold', intensity: 1.75, icon: 'wi-snow', name: 'Heavy Snow' }, //heavy snow
  42: { type: 'snow', class: 'cold', intensity: .5, icon: 'wi-snow', name: 'Scattered Snow Showers' }, //scattered snow showers
  43: { type: 'snow', class: 'cold', intensity: 1.75, icon: 'wi-snow', name: 'Heavy Snow' }, //heavy snow
  44: { type: 'cloud', class: '', intensity: .1, icon: 'wi-day-cloudy', name: 'Partly Cloudy' }, //partly cloudy
  45: { type: 'thunder', class: 'storm', intensity: .5, icon: 'wi-storm-showers', name: 'Thundershowers' }, //thundershowers
  46: { type: 'snow', class: 'cold', intensity: .75, icon: 'wi-snow', name: 'Snow Showers' }, //snow showers
  47: { type: 'thunder', class: 'storm', intensity: .25, icon: 'wi-storm-showers', name: 'Isolated Thunderstorms' } //isolated thundershowers
};

// 🛠 app settings
// in an object so the values can be animated in tweenmax

var settings = {
  windSpeed: 2,
  rainCount: 0,
  hailCount: 0,
  leafCount: 0,
  dustCount: 0,
  flyingObjectCount: 0,
  snowCount: 0,
  fogCount: 0,
  cloudHeight: 100,
  cloudSpace: 30,
  cloudArch: 50,
  renewCheck: 10,
  splashBounce: 80 };


var tickCount = 0;
var rain = [];
var leafs = [];
var dusts = [];
var flyingObjects = [];
var snow = [];
var hail = [];

if (!location.pathname.match(/fullcpgrid/i)) {
  // ⚙ initialize app
  init();

  // 👁 watch for window resize
  $(window).resize(onResize);

  // 🏃 start animations
  requestAnimationFrame(tick);

  // 📌 set location to get weather
  getLocation();
} else {
  updateDateText();
}

function init()
{
  onResize();

  updateDateText();
  // 🖱 bind weather menu buttons
  // ☁️ draw clouds

  for (var i = 0; i < clouds.length; i++)
  {
    clouds[i].offset = Math.random() * sizes.card.width;
    drawCloud(clouds[i], i);
  }
  for (var i = 0; i < fog.length; i++)
  {
    fog[i].offset = Math.random() * sizes.card.width;
    drawFog(fog[i], i);
  }

  // ☀️ set initial sun attr
  TweenMax.set(sun.node, { x: sizes.card.width / 2, y: -100 });
  TweenMax.set(sunburst.node, { opacity: 0 });

  changeWeather(weather[12]);
}

function onResize()
{
  // 📏 grab window and card sizes 

  sizes.container.width = container.width();
  sizes.container.height = container.height();
  sizes.card.width = card.width();
  sizes.card.height = card.height();
  sizes.card.offset = card.offset();

  // 📐 update svg sizes

  innerSVG.attr({
    width: sizes.card.width,
    height: sizes.card.height });


  outerSVG.attr({
    width: sizes.container.width,
    height: sizes.container.height });


  backSVG.attr({
    width: sizes.container.width,
    height: sizes.container.height });


  TweenMax.set(sunburst.node, { transformOrigin: "50% 50%", x: sizes.card.width / 2 + sizes.card.offset.left, y: sizes.card.height / 2 + sizes.card.offset.top });
  TweenMax.fromTo(sunburst.node, 20, { rotation: 0 }, { rotation: 360, repeat: -1, ease: Power0.easeInOut });
  // 🍃 The leaf mask is for the leafs that float out of the
  // container, it is full window height and starts on the left
  // inline with the card

  leafMask.attr({ x: sizes.card.offset.left, y: 0, width: sizes.container.width - sizes.card.offset.left, height: sizes.container.height });
  dustMask.attr({ x: sizes.card.offset.left, y: 0, width: sizes.container.width - sizes.card.offset.left, height: sizes.container.height });
  flyingObjectMask.attr({ x: sizes.card.offset.left, y: 0, width: sizes.container.width - sizes.card.offset.left, height: sizes.container.height });
}

function drawCloud(cloud, i)
{
  /* 
  
  ☁️ We want to create a shape thats loopable but that can also
  be animated in and out. So we use Snap SVG to draw a shape
  with 4 sections. The 2 ends and 2 arches the same width as
  the card. So the final shape is about 4 x the width of the
  card.
  
  */
  var space = settings.cloudSpace * i;
  var height = space + settings.cloudHeight;
  var arch = height + settings.cloudArch + Math.random() * settings.cloudArch;
  var width = sizes.card.width;

  var points = [];
  points.push('M' + [-width, 0].join(','));
  points.push([width, 0].join(','));
  points.push('Q' + [width * 2, height / 2].join(','));
  points.push([width, height].join(','));
  points.push('Q' + [width * 0.5, arch].join(','));
  points.push([0, height].join(','));
  points.push('Q' + [width * -0.5, arch].join(','));
  points.push([-width, height].join(','));
  points.push('Q' + [-(width * 2), height / 2].join(','));
  points.push([-width, 0].join(','));

  var path = points.join(' ');
  if (!cloud.path) cloud.path = cloud.group.path();
  cloud.path.animate({
    d: path },
  0);
}
function drawFog(cloud, i)
{
  /* 	
  	☁️ We want to create a shape thats loopable but that can also
  	be animated in and out. So we use Snap SVG to draw a shape
  	with 4 sections. The 2 ends and 2 arches the same width as
  	the card. So the final shape is about 4 x the width of the
  	card.
  	
  	*/
  var space = settings.cloudSpace * i;
  var height = space + settings.cloudHeight;
  var arch = height + settings.cloudArch + Math.random() * settings.cloudArch;
  var width = sizes.card.width;
  var bottom = sizes.card.height;
  var top = sizes.card.height - height;
  var half = sizes.card.height - height / 2;
  var points = [];
  points.push('M' + [-width, height].join(','));
  points.push([width, height].join(','));
  points.push('Q' + [width * 2, height / 2].join(','));
  points.push([width, 0].join(','));
  points.push('Q' + [width * 0.5, -arch + height].join(','));
  points.push([0, 0].join(','));
  points.push('Q' + [width * -0.5, -arch + height].join(','));
  points.push([-width, 0].join(','));
  points.push('Q' + [-(width * 2), height / 2].join(','));
  points.push([-width, height].join(','));

  var path = points.join(' ');
  if (!cloud.path) cloud.path = cloud.group.path();
  cloud.path.animate({
    d: path },
  0);
}

function makeRain()
{
  // 💧 This is where we draw one drop of rain

  // first we set the line width of the line, we use this
  // to dictate which svg group it'll be added to and 
  // whether it'll generate a splash

  var lineWidth = Math.random() * 3;

  // ⛈ line length is made longer for stormy weather 

  var lineLength = currentWeather.type == 'thunder' || currentWeather.type == 'severe' || currentWeather.type == 'hail' ? 35 : 14;

  // Start the drop at a random point at the top but leaving 
  // a 20px margin 

  var x = Math.random() * (sizes.card.width - 40) + 20;

  // Draw the line

  var line = this['innerRainHolder' + (3 - Math.floor(lineWidth))].path('M0,0 0,' + lineLength).attr({
    fill: 'none',
    stroke: currentWeather.type == 'thunder' || currentWeather.type == 'severe' || currentWeather.type == 'hail' ? '#777' : '#86a3f9',
    strokeWidth: lineWidth });


  // add the line to an array to we can keep track of how
  // many there are.

  rain.push(line);

  // Start the falling animation, calls onRainEnd when the 
  // animation finishes.
  var windOffset = settings.windSpeed * 10;
  TweenMax.fromTo(line.node, 1, { x: x - windOffset, y: 0 - lineLength }, { delay: Math.random(), y: sizes.card.height, x: x, ease: Power2.easeIn, onComplete: onRainEnd, onCompleteParams: [line, lineWidth, x, currentWeather.type] });
}

function onRainEnd(line, width, x, type)
{
  // first lets get rid of the drop of rain 💧

  line.remove();
  line = null;

  // We also remove it from the array

  for (var i in rain)
  {
    if (!rain[i].paper) rain.splice(i, 1);
  }

  // If there is less rain than the rainCount we should
  // make more.

  if (rain.length < settings.rainCount)
  {
    makeRain();

    // 💦 If the line width was more than 2 we also create a 
    // splash. This way it looks like the closer (bigger) 
    // drops hit the the edge of the card

    if (width > 2) makeSplash(x, type);
  }
}

function makeSplash(x, type)
{
  // 💦 The splash is a single line added to the outer svg.

  // The splashLength is how long the animated line will be
  var splashLength = type == 'thunder' || type == 'severe' || type == 'hail' ? 30 : 20;

  // splashBounce is the max height the line will curve up
  // before falling
  var splashBounce = type == 'thunder' || type == 'severe' || type == 'hail' ? 120 : 100;

  // this sets how far down the line can fall
  var splashDistance = 80;

  // because the storm rain is longer we want the animation
  // to last slighly longer so the overall speed is roughly
  // the same for both
  var speed = type == 'thunder' || type == 'severe' || type == 'hail' ? 0.7 : 0.5;

  // Set a random splash up amount based on the max splash bounce
  var splashUp = 0 - Math.random() * splashBounce;

  // Sets the end x position, and in turn defines the splash direction
  var randomX = Math.random() * splashDistance - splashDistance / 2;

  // Now we put the 3 line coordinates into an array. 

  var points = [];
  points.push('M' + 0 + ',' + 0);
  points.push('Q' + randomX + ',' + splashUp);
  points.push(randomX * 2 + ',' + splashDistance);

  // Draw the line with Snap SVG

  var splash = outerSplashHolder.path(points.join(' ')).attr({
    fill: "none",
    stroke: type == 'thunder' || type == 'severe' || type == 'hail' ? '#777' : '#86a3f9',
    strokeWidth: 1 });


  // We animate the dasharray to have the line travel along the path 

  var pathLength = Snap.path.getTotalLength(splash);
  var xOffset = sizes.card.offset.left; //(sizes.container.width - sizes.card.width) / 2
  var yOffset = sizes.card.offset.top + sizes.card.height;
  splash.node.style.strokeDasharray = splashLength + ' ' + pathLength;

  // Start the splash animation, calling onSplashComplete when finished
  TweenMax.fromTo(splash.node, speed, { strokeWidth: 2, y: yOffset, x: xOffset + 20 + x, opacity: 1, strokeDashoffset: splashLength }, { strokeWidth: 0, strokeDashoffset: -pathLength, opacity: 1, onComplete: onSplashComplete, onCompleteParams: [splash], ease: SlowMo.ease.config(0.4, 0.1, false) });
}

function onSplashComplete(splash)
{
  // 💦 The splash has finished animating, we need to get rid of it

  splash.remove();
  splash = null;
}

function makeLeaf()
{
  var scale = 0.5 + Math.random() * 0.5;
  var newLeaf;

  var areaY = sizes.card.height / 2;
  var y = areaY + Math.random() * areaY;
  var endY = y - (Math.random() * (areaY * 2) - areaY);
  var x;
  var endX;
  var colors = ['#76993E', '#4A5E23', '#6D632F'];
  var color = colors[Math.floor(Math.random() * colors.length)];
  var xBezier;

  if (scale > 0.8)
  {
    newLeaf = leaf.clone().appendTo(outerLeafHolder).
    attr({
      fill: color });

    y = y + sizes.card.offset.top / 2;
    endY = endY + sizes.card.offset.top / 2;

    x = sizes.card.offset.left - 100;
    xBezier = x + (sizes.container.width - sizes.card.offset.left) / 2;
    endX = sizes.container.width + 50;
  } else

  {
    newLeaf = leaf.clone().appendTo(innerLeafHolder).
    attr({
      fill: color });

    x = -100;
    xBezier = sizes.card.width / 2;
    endX = sizes.card.width + 50;

  }

  leafs.push(newLeaf);


  var bezier = [{ x: x, y: y }, { x: xBezier, y: Math.random() * endY + endY / 3 }, { x: endX, y: endY }];
  TweenMax.fromTo(newLeaf.node, 2, { rotation: Math.random() * 180, x: x, y: y, scale: scale }, { rotation: Math.random() * 360, bezier: bezier, onComplete: onLeafEnd, onCompleteParams: [newLeaf], ease: Power0.easeIn });
}

function onLeafEnd(leaf)
{
  leaf.remove();
  leaf = null;

  for (var i in leafs)
  {
    if (!leafs[i].paper) leafs.splice(i, 1);
  }

  if (leafs.length < settings.leafCount)
  {
    makeLeaf();
  }
}

function makeDust()
{
  var scale = 0.5 + Math.random() * 0.5;
  var newDust;

  var areaY = sizes.card.height / 2;
  var y = areaY + Math.random() * areaY;
  var endY = y - (Math.random() * (areaY * 2) - areaY);
  var x;
  var endX;
  var colors = currentWeather.type == 'smoke' ?
  ['#E89586', '#EDD7C8', '#A39491', '#726F77', '#FCE8EB', '#88716F', '#C5B1B8', '#483A49'] :
  ['#D6CBCF', '#CCB9A6', '#D69AA0', '#B68083', '#874F5C', '#E6E1DD', '#CAAA9B', '#B28C7F'];
  var color = colors[Math.floor(Math.random() * colors.length)];
  var xBezier;
  var size = 1.5 * scale;

  if (scale > 0.8)
  {
    newDust = outerDustHolder.circle(0, 0, size).
    attr({
      fill: color });

    y = y + sizes.card.offset.top / 2;
    endY = endY + sizes.card.offset.top / 2;

    x = sizes.card.offset.left - 100;
    xBezier = x + (sizes.container.width - sizes.card.offset.left) / 2;
    endX = sizes.container.width + 50;
  } else

  {
    newDust = innerDustHolder.circle(size * scale, 0, size).
    attr({
      fill: color });

    x = -100;
    xBezier = sizes.card.width / 2;
    endX = sizes.card.width + 50;

  }

  dusts.push(newDust);


  var bezier = [{ x: x, y: y }, { x: xBezier, y: Math.random() * endY + endY / 3 }, { x: endX, y: endY }];
  TweenMax.fromTo(newDust.node, 2, { rotation: Math.random() * 180, x: x, y: y, scale: scale }, { rotation: Math.random() * 360, bezier: bezier, onComplete: onDustEnd, onCompleteParams: [newDust], ease: Power0.easeIn });
}

function onDustEnd(dust)
{
  dust.remove();
  dust = null;

  for (var i in dusts)
  {
    if (!dusts[i].paper) dusts.splice(i, 1);
  }

  if (dusts.length < settings.dustCount)
  {
    makeDust();
  }
}

function makeFlyingObject()
{
  var scale = 5 + Math.random() * 5 * settings.flyingObjectCount;
  var newFlyingObject;

  var areaY = sizes.card.height / 2;
  var y = areaY + Math.random() * areaY;
  var endY = y - (Math.random() * (areaY * 2) - areaY);
  var x;
  var endX;
  var colors = ['#CC0024', '#00AD5A', '#A1C9D9', '#866E61', '#262628', '#F38433', '#86878A'];
  var color = colors[Math.floor(Math.random() * colors.length)];
  var xBezier;

  if (scale > 9.5)
  {
    newFlyingObject = car.clone().appendTo(outerFlyingObjectHolder).
    attr({
      fill: color });

    y = y + sizes.card.offset.top / 2;
    endY = endY + sizes.card.offset.top / 2;

    x = sizes.card.offset.left - 250;
    xBezier = x + (sizes.container.width - sizes.card.offset.left) / 2;
    endX = sizes.container.width + 250;
  } else
  if (scale > 8.75)
  {
    newFlyingObject = car.clone().appendTo(innerFlyingObjectHolder).
    attr({
      fill: color });

    x = -250;
    xBezier = sizes.card.width / 2;
    endX = sizes.card.width + 250;

  } else
  if (scale > 7.9)
  {
    scale = 3.4;
    colors = ['#ebe6d4', '#d4b496', '#e5e3e9', '#decba3'];
    color = colors[Math.floor(Math.random() * colors.length)];
    newFlyingObject = cow.clone().appendTo(innerFlyingObjectHolder).
    attr({
      fill: color });

    x = -250;
    xBezier = sizes.card.width / 2;
    endX = sizes.card.width + 250;

  } else
  {
    colors = ['#76993E', '#4A5E23', '#6D632F'];
    color = colors[Math.floor(Math.random() * colors.length)];
    scale = .7;
    newFlyingObject = leaf.clone().appendTo(innerFlyingObjectHolder).
    attr({
      fill: color });

    x = -10;
    xBezier = sizes.card.width / 2;
    endX = sizes.card.width + 150;
  }

  flyingObjects.push(newFlyingObject);


  var bezier = [{ x: x, y: y }, { x: xBezier, y: Math.random() * endY + endY / 3 }, { x: endX, y: endY }];
  TweenMax.fromTo(newFlyingObject.node, 2, { rotation: Math.random() * 180, x: x, y: y, scale: scale }, { rotation: Math.random() * 360, bezier: bezier, onComplete: onFlyingObjectEnd, onCompleteParams: [newFlyingObject], ease: Power0.easeIn });
}

function onFlyingObjectEnd(flyingObject)
{
  flyingObject.remove();
  flyingObject = null;

  for (var i in flyingObjects)
  {
    if (!flyingObjects[i].paper) flyingObjects.splice(i, 1);
  }

  if (flyingObjects.length < settings.flyingObjectCount)
  {
    makeFlyingObject();
  }
}

function makeHail()
{
  var windOffset = settings.windSpeed * 10;
  var offset = 0.25 * currentWeather.intensity;
  var scale = offset + Math.random() * offset;
  var newHail;

  var x;
  var endX; // = x - ((Math.random() * (areaX * 2)) - areaX)
  var y = -10;
  var endY;
  var size = 5 * scale;
  if (size > 4)
  {
    x = Math.random() * (sizes.card.width - 40) + 20 - windOffset;
    newHail = outerHailHolder.circle(0, 0, size).
    attr({
      fill: currentWeather.type == 'sleet' || currentWeather.type.indexOf('mix') > -1 ? '#86a3f9' : '#FFF' });

    endY = sizes.container.height + 10;
    //y = sizes.card.offset.top + settings.cloudHeight;
    x = x + sizes.card.offset.left;
    //xBezier = x + (sizes.container.width - sizes.card.offset.left) / 2;
    //endX = sizes.container.width + 50;
  } else

  {
    x = Math.random() * (sizes.card.width - 40) + 20 - windOffset;
    newHail = innerHailHolder.circle(0, 0, size).
    attr({
      fill: currentWeather.type == 'sleet' || currentWeather.type.indexOf('mix') > -1 ? '#86a3f9' : '#FFF' });

    endY = sizes.card.height + 10;
    //x = -100;
    //xBezier = sizes.card.width / 2;
    //endX = sizes.card.width + 50;

  }

  hail.push(newHail);

  // Start the falling animation, calls onHailEnd when the 
  // animation finishes.
  TweenMax.fromTo(newHail.node, 1, { x: x - windOffset, y: y }, { delay: Math.random(), y: endY, x: x, ease: Power2.easeIn, onComplete: onHailEnd, onCompleteParams: [newHail, size, x, currentWeather.type] });
  //TweenMax.fromTo(newHail.node, 3 + (Math.random() * 5), {x: x, y: y}, {y: endY, onComplete: onHailEnd, onCompleteParams: [newHail, size, x, currentWeather.type], ease: Power2.easeIn})
}

function onHailEnd(stone, size, x, type)
{
  // first lets get rid of the hail stone 🌩️

  stone.remove();
  stone = null;

  // We also remove it from the array

  for (var i in hail)
  {
    if (!hail[i].paper) hail.splice(i, 1);
  }

  // If there is less rain than the rainCount we should
  // make more.

  if (hail.length < settings.hailCount)
  {
    makeHail();
  }
}

function makeSnow()
{
  var offset = 0.5 * currentWeather.intensity;
  var scale = offset + Math.random() * offset;
  var newSnow;

  var x = 20 + Math.random() * (sizes.card.width - 40);
  var endX; // = x - ((Math.random() * (areaX * 2)) - areaX)
  var y = -10;
  var endY;

  if (scale > 0.8)
  {
    newSnow = outerSnowHolder.circle(0, 0, 5).
    attr({
      fill: 'white' });

    endY = sizes.container.height + 10;
    y = sizes.card.offset.top + settings.cloudHeight;
    x = x + sizes.card.offset.left;
    //xBezier = x + (sizes.container.width - sizes.card.offset.left) / 2;
    //endX = sizes.container.width + 50;
  } else

  {
    newSnow = innerSnowHolder.circle(0, 0, 5).
    attr({
      fill: 'white' });

    endY = sizes.card.height + 10;
    //x = -100;
    //xBezier = sizes.card.width / 2;
    //endX = sizes.card.width + 50;

  }

  snow.push(newSnow);


  TweenMax.fromTo(newSnow.node, 3 + Math.random() * 5, { x: x, y: y }, { y: endY, onComplete: onSnowEnd, onCompleteParams: [newSnow], ease: Power0.easeIn });
  TweenMax.fromTo(newSnow.node, 1, { scale: 0 }, { scale: scale, ease: Power1.easeInOut });
  TweenMax.to(newSnow.node, 3, { x: x + (Math.random() * 150 - 75), repeat: -1, yoyo: true, ease: Power1.easeInOut });
}

function onSnowEnd(flake)
{
  flake.remove();
  flake = null;

  for (var i in snow)
  {
    if (!snow[i].paper) snow.splice(i, 1);
  }

  if (snow.length < settings.snowCount)
  {
    makeSnow();
  }
}

function tick()
{
  tickCount++;
  var check = tickCount % settings.renewCheck;
  if (check)
  {
    if (rain.length < settings.rainCount) makeRain();
    if (leafs.length < settings.leafCount) makeLeaf();
    if (dusts.length < settings.dustCount) makeDust();
    if (flyingObjects.length < settings.flyingObjectCount) makeFlyingObject();
    if (snow.length < settings.snowCount) makeSnow();
    if (hail.length < settings.hailCount) makeHail();

  }

  for (var i = 0; i < clouds.length; i++)
  {
    if (currentWeather.type == 'sun')
    {
      if (clouds[i].offset > -(sizes.card.width * 1.5)) clouds[i].offset += settings.windSpeed / (i + 1);
      if (clouds[i].offset > sizes.card.width * 2.5) clouds[i].offset = -(sizes.card.width * 1.5);
      clouds[i].group.transform('t' + clouds[i].offset + ',' + 0);
    } else

    {
      clouds[i].offset += settings.windSpeed / (i + 1);
      if (clouds[i].offset > sizes.card.width) clouds[i].offset = 0 + (clouds[i].offset - sizes.card.width);
      clouds[i].group.transform('t' + clouds[i].offset + ',' + 0);
    }
  }


  for (var i = 0; i < fog.length; i++)
  {
    if (currentWeather.type == 'haze' || currentWeather.type == 'smoke' || currentWeather.type == 'dust')
    {
      fog[i].offset += settings.windSpeed / (i + 1);
      if (fog[i].offset > sizes.card.width) fog[i].offset = 0 + (fog[i].offset - sizes.card.width);
      fog[i].group.transform('t' + fog[i].offset + ',' + (sizes.card.height - settings.cloudHeight - settings.cloudSpace * i));
    } else

    {
      if (fog[i].offset > -(sizes.card.width * 1.5)) fog[i].offset += settings.windSpeed / (i + 1);
      if (fog[i].offset > sizes.card.width * 2.5) fog[i].offset = -(sizes.card.width * 1.5);
      fog[i].group.transform('t' + fog[i].offset + ',' + (sizes.card.height - settings.cloudHeight - settings.cloudSpace * i));
    }
  }
  requestAnimationFrame(tick);
}

function reset()
{
  for (var i = 0; i < weather.length; i++)
  {
    container.removeClass(weather[i].type);
    if (weather[i].button) weather[i].button.removeClass('active');
  }
  for (var j = 0; j < classes.length; j++)
  {
    container.removeClass(classes[j]);
  }
}

function updateTempText(newTemp, newFormat)
{
  temp.html(newTemp);
  tempFormat.html(newFormat);
  TweenMax.fromTo(temp, 1.5, { x: 30 }, { opacity: 1, x: 0, ease: Power4.easeOut });
  TweenMax.fromTo(tempFormat, 1.5, { x: 30 }, { opacity: 1, x: 0, ease: Power4.easeOut });
}

function updateDateText()
{
  var d = new Date();
  var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  date.html(days[d.getDay()] + " " + d.getDate() + " " + months[d.getMonth()]);
  TweenMax.fromTo(date, 1.5, { x: 30 }, { opacity: 1, x: 0, ease: Power4.easeOut });
}

function updateSummaryText()
{
  summary.html(currentWeather.name);
  TweenMax.fromTo(summary, 1.5, { x: 30 }, { opacity: 1, x: 0, ease: Power4.easeOut });
}

function startLightningTimer()
{
  if (lightningTimeout) clearTimeout(lightningTimeout);
  if (currentWeather.type == 'thunder' || currentWeather.type == 'severe' || currentWeather.type == 'hail')
  {
    lightningTimeout = setTimeout(lightning, Math.random() * 6000);
  }
}

function lightning()
{
  startLightningTimer();
  TweenMax.fromTo(card, 0.75, { y: -30 }, { y: 0, ease: Elastic.easeOut });

  var pathX = 30 + Math.random() * (sizes.card.width - 60);
  var yOffset = 20;
  var steps = 20;
  var points = [pathX + ',0'];
  for (var i = 0; i < steps; i++)
  {
    var x = pathX + (Math.random() * yOffset - yOffset / 2);
    var y = sizes.card.height / steps * (i + 1);
    points.push(x + ',' + y);
  }

  var strike = weatherContainer1.path('M' + points.join(' ')).
  attr({
    fill: 'none',
    stroke: 'white',
    strokeWidth: 2 + Math.random() });


  TweenMax.to(strike.node, 1, { opacity: 0, ease: Power4.easeOut, onComplete: function () {strike.remove();strike = null;} });
}

function changeWeather(weather)
{
  if (weather.data) weather = weather.data;
  reset();

  currentWeather = weather;
  TweenMax.killTweensOf(summary);
  TweenMax.to(summary, 1, { opacity: 0, x: -30, onComplete: updateSummaryText, ease: Power4.easeIn });

  container.addClass(weather.type);
  container.addClass(weather.class);

  if (weather.button) weather.button.addClass('active');

  // windSpeed

  switch (weather.type) {

    case 'severe':
    case 'wind':
    case 'smoke':
      TweenMax.to(settings, 3, { windSpeed: 3 * weather.intensity, ease: Power2.easeInOut });
      break;
    case 'sun':
      TweenMax.to(settings, 3, { windSpeed: 20, ease: Power2.easeInOut });
      break;
    case 'haze':
    case 'cloud':
      TweenMax.to(settings, 3, { windSpeed: 1, ease: Power2.easeInOut });
      break;
    default:
      TweenMax.to(settings, 3, { windSpeed: 0.5, ease: Power2.easeOut });
      break;}


  // rainCount

  switch (weather.type) {

    case 'mix':
    case 'mix-rain-snow':
    case 'mix-rain-sleet':
    case 'rain':
      TweenMax.to(settings, 3, { rainCount: 20 * weather.intensity, ease: Power2.easeInOut });
      break;
    case 'hail':
      TweenMax.to(settings, 3, { rainCount: 5 * weather.intensity, ease: Power2.easeInOut });
      break;
    case 'severe':
    case 'thunder':
      TweenMax.to(settings, 3, { rainCount: 30 * weather.intensity, ease: Power2.easeInOut });
      break;
    default:
      TweenMax.to(settings, 1, { rainCount: 0, ease: Power2.easeOut });
      break;}


  // hailCount

  switch (weather.type) {

    case 'mix':
      TweenMax.to(settings, 3, { hailCount: 3 * weather.intensity, ease: Power2.easeInOut });
      break;
    case 'mix-snow-sleet':
    case 'mix-rain-sleet':
      TweenMax.to(settings, 3, { hailCount: 10 * weather.intensity, ease: Power2.easeInOut });
      break;
    case 'sleet':
      TweenMax.to(settings, 3, { hailCount: 20 * weather.intensity, ease: Power2.easeInOut });
      break;
    case 'severe':
      TweenMax.to(settings, 3, { hailCount: 3 * weather.intensity, ease: Power2.easeInOut });
      break;
    case 'hail':
      TweenMax.to(settings, 3, { hailCount: 20 * weather.intensity, ease: Power2.easeInOut });
      break;
    default:
      TweenMax.to(settings, 1, { hailCount: 0, ease: Power2.easeOut });
      break;}


  // leafCount

  switch (weather.type) {

    case 'severe':
    case 'wind':
      TweenMax.to(settings, 3, { leafCount: 5 * weather.intensity, ease: Power2.easeInOut });
      break;
    default:
      TweenMax.to(settings, 1, { leafCount: 0, ease: Power2.easeOut });
      break;}


  // dustCount

  switch (weather.type) {

    case 'dust':
      TweenMax.to(settings, 3, { dustCount: 100 * weather.intensity, ease: Power2.easeInOut });
      break;
    case 'smoke':
      TweenMax.to(settings, 3, { dustCount: 40 * weather.intensity, ease: Power2.easeInOut });
      break;
    case 'wind':
      TweenMax.to(settings, 3, { dustCount: 10 * weather.intensity, ease: Power2.easeInOut });
      break;
    default:
      TweenMax.to(settings, 1, { dustCount: 0, ease: Power2.easeOut });
      break;}


  // flyingObjectCount

  switch (weather.type) {

    case 'severe':
    case 'wind':
      TweenMax.to(settings, 3, { flyingObjectCount: .4 * weather.intensity - 1, ease: Power2.easeInOut });
      break;
    default:
      TweenMax.to(settings, 1, { flyingObjectCount: 0, ease: Power2.easeOut });
      break;}


  // snowCount

  switch (weather.type) {

    case 'mix':
    case 'mix-rain-snow':
    case 'mix-snow-sleet':
    case 'snow':
      TweenMax.to(settings, 3, { snowCount: 40 * weather.intensity, ease: Power2.easeInOut });
      break;
    default:
      TweenMax.to(settings, 1, { snowCount: 0, ease: Power2.easeOut });
      break;}


  // sun position

  switch (weather.type) {

    case 'sun':
      TweenMax.to(sun.node, 4, { x: sizes.card.width / 2, y: sizes.card.height / 2, ease: Power2.easeInOut });
      TweenMax.to(sunburst.node, 4, { scale: 1, opacity: 0.8, x: sizes.card.offset.left + sizes.card.width / 2, y: sizes.card.height / 2 + sizes.card.offset.top, ease: Power2.easeInOut });
      break;
    case 'cloud':
      var ypos = sizes.card.height / 2 - sizes.card.height / 2 * weather.intensity;
      TweenMax.to(sun.node, 4, { x: sizes.card.width / 2, y: ypos, ease: Power2.easeInOut });
      TweenMax.to(sunburst.node, 2, { scale: 0.1, opacity: 0, x: sizes.card.offset.left + sizes.card.width / 2, y: ypos + sizes.card.offset.top, ease: Power2.easeInOut });
      break;
    default:
      TweenMax.to(sun.node, 2, { x: sizes.card.width / 2, y: -100, leafCount: 0, ease: Power2.easeInOut });
      TweenMax.to(sunburst.node, 2, { scale: 0.1, opacity: 0, x: sizes.card.offset.left + sizes.card.width / 2, y: sizes.container.height / 2 - 100, ease: Power2.easeInOut });
      break;}


  // lightning

  startLightningTimer();
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
}

function showPosition(position) {


  var openWeatherObject = {
    url: "https://api.openweathermap.org/data/2.5/weather",
    method: "GET",
    data: {
      lat: position.coords.latitude,
      lon: position.coords.longitude,
      units: 'Imperial',
      appid: '6661e00f389ed77d30141ee97e9d05d3' },

    success: function (data) {
      var weather = data;
      setWeather(weather);
    } };


  var ajaxObject = getWeatherAjax(position);
  ajaxObject.success = function (data) {
    var weather = data.current_observation;
    setWeather(weather);
  };

  $.ajax(openWeatherObject);
}

function setWeather({ weather, main, sys }) {
  //var condition = weather.condition;
  //var forecast = weather.forecast[0];
  //changeWeather(weatherMap[forecast.code]);
  //updateTempText(forecast.high, "°F");

  let weatherData = {};
  while (weather.length > 0) {
    let item = weather.pop();
    openWeatherCondMap[item.id];
    Object.assign(weatherData, openWeatherCondMap[item.id]);
  }

  if (main.temp > 80) {
    weatherData.class += ' hot';
  } else if (main.temp < 32) {
    weatherData.class += ' cold';
  }

  let sunrise = sys.sunrise;
  let sunset = sys.sunset;
  let now = Date.now();
  if (sunset < now && now < sunrise) {
    weatherData.class += ' night';
  }

  changeWeather(weatherData);
  updateTempText(Math.round(main.temp), "°F");
}

function timeConvertor(time) {
  var PM = time.match('pm') ? true : false;

  time = time.split(':');
  var min = parseInt(time[1]);

  if (PM) {
    var hour = 12 + parseInt(time[0], 10);
  } else {
    var hour = parseInt(time[0]);
  }

  return new Date().setHours(hour, min);
}

class ViewModel {
  constructor() {
    this.weatherMap = Object.values(weatherMap);
  }
  changeWeather(data, event) {
    changeWeather(data);
  }}


const app = new ViewModel();

const aurelia = new au.Aurelia();
aurelia.
use.
standardConfiguration().
developmentLogging();
aurelia.
start().
then(() => {
  aurelia.enhance(app, document.body);
});