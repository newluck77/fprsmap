(function(global) {
  'use strict';

  /* Utils */
  function fetchJSON(url) {
    return fetch(url)
      .then(function(response) {
        return response.json();
      });
  }

  /* Constants */
  // Local Fairphone Communities forum thread
  var FORUM_THREAD_URL = 'https://forum.fairphone.com/t/pencil2-local-fairphoners-address-book-fairphone-communities/3815/';

  var CUSTOM_MARKER = L.icon({
    iconUrl: 'FairphoneMarker.png',
    iconSize: [31.8, 50],
    iconAnchor: [15.9, 49],
  });

  /* Variables (state) */
  var s,
      map,
      mapLayer,
      baseMaps,
      overlayMaps,
      defaultlayer = [];
  /* Overlay Layergroups */
  var groupslayer = L.layerGroup(),
      shops = L.layerGroup(),
      angels = L.layerGroup(),
      meetups = L.layerGroup();

  /* Functions */
  function initMap(defaultlayer) {
    map = L.map('mapid', {
    center: [49.8158683, 6.1296751],
    zoom: 4,
    layers: defaultlayer
    })
    mapLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors, <a href="https://www.gnu.org/licenses/gpl-3.0.en.html">GNU GPLv3</a>',
      maxZoom: 18,
    });
    mapLayer.addTo(map);
  }

  function initControls(){
    // Make a key value pair for controls
    baseMaps = {

    };
    overlayMaps = { "Fairphoners groups": groupslayer,
                        "T-Mobile Shops": shops,
                      "Fairphone Angels": angels,
                      "Meetups & Events": meetups
    };
    L.control.layers(baseMaps, overlayMaps, {collapsed:false})
      .addTo(map);
  }

  function getQueries(){
    if(location.search){
      if(location.search.includes('angels')) defaultlayer.push(angels);
      if(location.search.includes('shops')) defaultlayer.push(shops);
      if(location.search.includes('meetups')) defaultlayer.push(meetups);
    }
    else {
      defaultlayer.push(groupslayer);
    }
  }

  /* Main */
  getQueries();
  initMap(defaultlayer);
  initControls();


  fetchJSON('https://newluck77.github.io/fprsmap/communities.json')
    .then(function(json) {
      // Add a marker per Local Fairphone Community
      json.list.forEach(function(group) {
        var marker = L.marker(group.lat_lng, { icon: CUSTOM_MARKER, riseOnHover: true })
          .bindPopup(
            '<a href="' + FORUM_THREAD_URL + group.post_nr + '" target="_blank">' + group.location + '</a>',
            { offset: new L.Point(0, -25) }
          );
        groupslayer.addLayer(marker);
      })
    });
}(this));
