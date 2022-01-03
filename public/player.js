
var player = videojs('content_video');
var xmlhttp = new XMLHttpRequest();
var videoUrl = '';
var adUrl = '';
var imaOptions = {};  

const setImaOptions = () => {
  imaOptions = {
    id: 'content_video',
    adTagUrl: adUrl
  }
};

var setPlayerUrls = () => {
  const newVideoUrl = document.getElementById('videoUrl').value;
  const newAdUrl = document.getElementById('adUrl').value;

  videoUrl = newVideoUrl && videoUrl !== newVideoUrl ? newVideoUrl : videoUrl;
  adUrl = newAdUrl && newAdUrl !== adUrl ? newAdUrl : adUrl;

  setImaOptions();

  player.src(videoUrl);
  player.ima(imaOptions);
};

const onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
    const { entitlements = []} = JSON.parse(xmlhttp.responseText);
    const mediaObject = entitlements.find(ent => ent.type === 'media');
    const { url: vUrl = '', ads = [] } = {  ...mediaObject };
    const adObject = ads.find(ad => ad.type === 'preroll')
    const {  url: aUrl } = { ...adObject };

    videoUrl = vUrl;
    adUrl = aUrl;

    setInputFields();
    setImaOptions();
    player.src(videoUrl);
    player.ima(imaOptions);
  } else if (this.readyState === 4 && this.status != 200) {
    console.log('Error while fetching the info');
  }
};

var fetchAndLoadOnPlayer = () => {
  const fetchUrl = document.getElementById('fetchUrl').value;
  const jwt = document.getElementById('jwt').value;

  if (fetchUrl && jwt) {
    const checkedJwt = jwt.includes("JWT ") ? jwt : `JWT ${jwt}`;

    xmlhttp.open("GET", fetchUrl, true);
    xmlhttp.setRequestHeader('Content-type', 'application/json');
    xmlhttp.setRequestHeader('Authorization', checkedJwt);
    xmlhttp.onreadystatechange = onreadystatechange;
    xmlhttp.send();
  } 

};

var setInputFields = () => {
  document.getElementById('videoUrl').value = videoUrl;
  document.getElementById('adUrl').value = adUrl;
}

var setExampleValues = () => {
  videoUrl = 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
  adUrl = 'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/ad_rule_samples&ciu_szs=300x250&ad_rule=1&impl=s&gdfp_req=1&env=vp&output=vmap&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ar%3Dpreonly&cmsid=496&vid=short_onecue&correlator=';
  setInputFields();
  setPlayerUrls();
}

setImaOptions()
// player.src(videoUrl);
// player.ima(imaOptions);
// On mobile devices, you must call initializeAdDisplayContainer as the result
// of a user action (e.g. button click). If you do not make this call, the SDK
// will make it for you, but not as the result of a user action. For more info
// see our examples, all of which are set up to work on mobile devices.
// player.ima.initializeAdDisplayContainer();
