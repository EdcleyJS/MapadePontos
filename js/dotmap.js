var novaDist,bounds,width,height,area,nump,cont,cor,p,markerCircle,opcoes=[],anoSelecionado,featurename,mesSelecionado,anoSelecionado,diaSelecionado,trimestreSelecionado,layerTuto3;
var mapVis03 = L.map('vis03').setView([-8.305448,-37.822426], 8);
var mapDot = L.map('vis3').setView([-8.305448,-37.822426], 8);
var mapTaxi = L.map('vistaxi').setView([40.752866,-73.986023], 13);
var gradesDot=[0,20,40,60,80,100,120,140,160];
var gradesTaxi=[43,6000,12000,18000,24000,30000,36000,42000,54469];
var myRenderer = L.canvas({ padding: 0.5 });
var myRendererTaxi = L.canvas({ padding: 0.5 });
var LayerDotMap,LayerTaxi,pontos,pontos2,pontos3;
var database,dots=[],dotsZ1=[],dotsZ2=[],dotsZ3=[],dotsTaxi=[],dotsZ1Taxi=[],dotsZ2Taxi=[],dotsZ3Taxi=[];

//-- MAPA DE PONTOS DA ETAPA DE PERGUNTAS AO USUÁRIO. --
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
  attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
  maxZoom: 18,
  id: 'mapbox.streets',
  accessToken: 'pk.eyJ1IjoiZWRjbGV5OTQ1MiIsImEiOiJjamdvMGdmZ2owaTdiMndwYTJyM2tteTl2In0.2q25nBNRxzFxeaYahFGQ6g'
}).addTo(mapDot);
mapDot.on('zoomend', function() {
  inicioDotMap(dataset);
});
//-- DIV INFO DO MAPA CONTROLADO --
var infoDot = L.control();
infoDot.onAdd = function (mymap) {
  this._div = L.DomUtil.create('div', 'info');
  this.update();
  return this._div;
};
//-- DIV LEGENDA DO MAPA CONTROLADO --
var legendDot = L.control({position: 'bottomright'});
legendDot.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'info legend');
  for (var i = (gradesDot.length-1); i >=0 ; i--) {
    div.innerHTML +='<i style="color:'+colorD(gradesDot[i])+'; background:'+colorD(gradesDot[i])+'"></i>'+gradesDot[i]+'</br>';
  }
  return div;
};
legendDot.addTo(mapDot);
//-- FUNÇÃO QUE DESENHA E CONTROLA OS PONTOS NO MAPA --
function inicioDotMap(dataset){
  if(LayerDotMap!= null){
    LayerDotMap.clearLayers();
  }
  if (pontos2!=null) {
    pontos2.clearLayers();
  }
  //dots = [];
  LayerDotMap =L.geoJson(dataset,
    {
      style: function(feature){
        if(opcoes.includes(feature.properties.name)){
          if(opcoes[0]==feature.properties.name){
            return {
              weight: 3.5,
              opacity: 1,
              fillOpacity: 0,
              color: '#c51b7d'
            };
          }else{
            return {
              weight: 3.5,
              opacity: 1,
              fillOpacity: 0,
              color: '#053061'
            };            
          }
        }else{
          return{
            weight:0.8,
            opacity: 0.5,
            fillOpacity: 0,
            color: 'black',
          };
        }
      },
      onEachFeature: function (feature, layer) {
        layer.bindPopup(""+feature.properties.name);
        layer.on('mouseover', function (e) {
            this.openPopup();
        });
        layer.on('mouseout', function (e) {
            this.closePopup();
        });
  }}).addTo(mapDot);
  var nZoom= mapDot.getZoom();
  if(nZoom>11){
    pontos2 = L.layerGroup(dotsZ3);
  }else if(nZoom>9){
    pontos2 = L.layerGroup(dotsZ2);
  }else if(nZoom>8){
    pontos2 = L.layerGroup(dotsZ1);
  }else{
    pontos2 = L.layerGroup(dots);
  }
  pontos2.addTo(mapDot);
  infoDot.update = function (props) {
    this._div.innerHTML= infoprops(props);
  };
  infoDot.addTo(mapDot);
}
//-- MAPA DE PONTOS DA ETAPA DE TUTORIAL DO USUÁRIO. --
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
  attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
  maxZoom: 18,
  id: 'mapbox.streets',
  accessToken: 'pk.eyJ1IjoiZWRjbGV5OTQ1MiIsImEiOiJjamdvMGdmZ2owaTdiMndwYTJyM2tteTl2In0.2q25nBNRxzFxeaYahFGQ6g'
}).addTo(mapVis03);
mapVis03.on('zoomend', function() {
  Vis03TutorialFunction(dataset);
});
//-- DIV INFO DO MAPA CONTROLADO --
var infoVis03=L.control();
infoVis03.onAdd = function (mymap) {
  this._div = L.DomUtil.create('div', 'info');
  this.update();
  return this._div;
};
//-- DIV LEGENDA DO MAPA CONTROLADO --
var legendVis03 = L.control({position: 'bottomright'});
legendVis03.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'info legend');
  for (var i = (gradesDot.length-1); i >=0 ; i--) {
    div.innerHTML +='<i style="color:'+colorD(gradesDot[i])+'; background:'+colorD(gradesDot[i])+'"></i>'+gradesDot[i]+'</br>';
  }
  return div;
};
legendVis03.addTo(mapVis03);
var dots;
var tentativa=[];
//-- FUNÇÃO QUE DESENHA E CONTROLA OS PONTOS NO MAPA --
function Vis03TutorialFunction(dataset){
  if(layerTuto3!= null){
    layerTuto3.clearLayers();
    pontos.clearLayers();
  }
  //dots = [];
  layerTuto3 =L.geoJson(dataset,
    {
      style: function(feature){
        if(opcoes.includes(feature.properties.name)){
          if(opcoes[0]==feature.properties.name){
            return {
              weight: 3.5,
              opacity: 1,
              fillOpacity: 0,
              color: '#c51b7d'
            };
          }else{
            return {
              weight: 3.5,
              opacity: 1,
              fillOpacity: 0,
              color: '#053061'
            };            
          }
        }else{
          return{
            weight:0.8,
            opacity: 0.5,
            fillOpacity: 0,
            color: 'black',
          };
        }
      },
      onEachFeature: function (feature, layer) {
        layer.bindPopup(""+feature.properties.name);
        layer.on('mouseover', function (e) {
            this.openPopup();
        });
        layer.on('mouseout', function (e) {
            this.closePopup();
        });
  }}).addTo(mapVis03);
  var nZoom= mapVis03.getZoom();
  if(nZoom>11){
    pontos = L.layerGroup(dotsZ3);
  }else if(nZoom>9){
    pontos = L.layerGroup(dotsZ2);
  }else if(nZoom>8){
    pontos = L.layerGroup(dotsZ1);
  }else{
    pontos = L.layerGroup(dots);
  }
  pontos.addTo(mapVis03);
  infoVis03.update = function (props) {
    this._div.innerHTML= infoprops(props);
  };
  infoVis03.addTo(mapVis03);
}

function InicioDot(){
var recife;
var pointsdots = [];
var xMin,yMin,xMax,yMax;
var contdots=0;
  L.geoJson(dataset,{
    onEachFeature: async function (feature, layer) {
        await sleep(3000);
        novaDist= dotMapPrep(getDis(feature.properties.name));
        
        //console.log(Math.max.apply(Math, getDis(feature.properties.name)));
        bounds = layer.getBounds();
        width = Math.abs(bounds._northEast.lng - bounds._southWest.lng);
        height = Math.abs(bounds._northEast.lat - bounds._southWest.lat);
        area= (turf.area(feature.geometry)/10000000);     
        //area= area/3;
          xMin = Infinity;
          yMin = Infinity;
          xMax = -Infinity;
          yMax = -Infinity;
        /*var LatLngs=layer.getLatLngs()[0];  
        LatLngs.forEach(p=>{
          var nova= map.unproject([p.lat,p.lng]);
          p.lat=nova.lat;
          p.lng=nova.lng;
        });*/
        
        layer.getLatLngs()[0].forEach(function(p,i){
            if (p.lat<xMin) xMin = p.lat;
            if (p.lat>xMax) xMax = p.lat;
            if (p.lng<yMin) yMin = p.lng;
            if (p.lng>yMax) yMax = p.lng;
        });
        var widthh = layer.getBounds().getNorth()-layer.getBounds().getSouth();//(xMax - xMin); 
        var heightt = layer.getBounds().getEast()-layer.getBounds().getWest();//(yMax - yMin);
        var polygon=layer.getLatLngs()[0];
        //console.log(widthh+'-'+heightt);
                  //console.log(bounds);
        //console.log(width+" "+height);
        //console.log(feature.properties.name);
        var enveloped = turf.envelope(feature);
        var a=turf.bbox(enveloped);
        var grid = turf.pointGrid(a,2);
        //console.log(grid.features.length);
        var pointsGrid=[];
        grid.features.forEach(function(d){
            var aux=d.geometry.coordinates;
            var q=L.latLng(aux[1],aux[0]);
            //if (leafletPip.pointInLayer(q, L.geoJSON(layer.toGeoJSON()), true).length > 0) {console.log('circulo dentro');}
            //p = L.latLng(bounds._southWest.lat + Math.random() * height, bounds._southWest.lng + Math.random() * width);
            if (leafletPip.pointInLayer(q, L.geoJSON(layer.toGeoJSON()), true).length > 0) {
              pointsGrid.push(q);
            }
        });
        var indice=0;
        pointsGrid=shuffle(pointsGrid);
        var pdisponiveis= pointsGrid.length;
        novaDist.forEach(function(d){
          cor= colorD(d[0]);
          var limite=Math.round((pointsGrid.length)*d[1]);
          var i= indice;
          var l=limite+indice;
          for (i; i<l; i++) {
              if (pdisponiveis>0) {
                dots.push(L.circleMarker(pointsGrid[i], {radius: 1.3, weight: 1,fillColor: cor,fillOpacity:1, color: cor,renderer: myRenderer}));
                dotsZ1.push(L.circleMarker(pointsGrid[i], {radius: 2.2, weight: 1,fillColor: cor,fillOpacity:1, color: cor,renderer: myRenderer}));
                dotsZ2.push(L.circleMarker(pointsGrid[i], {radius: 3.0, weight: 1,fillColor: cor,fillOpacity:1, color: cor,renderer: myRenderer}));
                dotsZ3.push(L.circleMarker(pointsGrid[i], {radius: 4.6, weight: 1,fillColor: cor,fillOpacity:1, color: cor,renderer: myRenderer}));
                pdisponiveis--; 
                //indice++;              
              }
          }
          indice+=limite;
        });
    }
  });
}

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
  attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
  maxZoom: 18,
  id: 'mapbox.streets',
  accessToken: 'pk.eyJ1IjoiZWRjbGV5OTQ1MiIsImEiOiJjamdvMGdmZ2owaTdiMndwYTJyM2tteTl2In0.2q25nBNRxzFxeaYahFGQ6g'
}).addTo(mapTaxi);
mapTaxi.on('zoomend', function() {
  inicioTaxi(datasettaxi);
});
//-- DIV INFO DO MAPA CONTROLADO --
var infoTaxi = L.control();
infoTaxi.onAdd = function (mymap) {
  this._div = L.DomUtil.create('div', 'info');
  this.update();
  return this._div;
};
//-- DIV LEGENDA DO MAPA CONTROLADO --
var legendTaxi = L.control({position: 'bottomright'});
legendTaxi.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'info legend');
  for (var i = (gradesTaxi.length-1); i >=0 ; i--) {
    div.innerHTML +='<i style="color:'+colorDT(gradesTaxi[i])+'; background:'+colorDT(gradesTaxi[i])+'"></i>'+gradesTaxi[i]+'</br>';
  }
  return div;
};
legendTaxi.addTo(mapTaxi);
//-- FUNÇÃO QUE DESENHA E CONTROLA OS PONTOS NO MAPA --
function inicioTaxi(dataset){
  if(LayerTaxi!= null){
    LayerTaxi.clearLayers();
  }
  if (pontos3!=null) {
    pontos3.clearLayers();
  }
  //dots = [];
  LayerTaxi =L.geoJson(datasettaxi,
    {
      style: function(feature){
        if(opcoes.includes(feature.properties.OBJECTID)){
          if(opcoes[0]==feature.properties.OBJECTID){
            return {
              weight: 3.5,
              opacity: 1,
              fillOpacity: 0,
              color: '#c51b7d'
            };
          }else{
            return {
              weight: 3.5,
              opacity: 1,
              fillOpacity: 0,
              color: '#053061'
            };            
          }
        }else{
          return{
            weight:0.8,
            opacity: 0.5,
            fillOpacity: 0,
            color: 'black',
          };
        }
      },
      onEachFeature: function (feature, layer) {
        layer.bindPopup(""+feature.properties.zone);
        layer.on('mouseover', function (e) {
            this.openPopup();
        });
        layer.on('mouseout', function (e) {
            this.closePopup();
        });
  }}).addTo(mapTaxi);
  var nZoom= mapTaxi.getZoom();
  if(nZoom>15){
    pontos3 = L.layerGroup(dotsZ3Taxi);
  }else if(nZoom>14){
    pontos3 = L.layerGroup(dotsZ2Taxi);
  }else if(nZoom>13){
    pontos3 = L.layerGroup(dotsZ1Taxi);
  }else{
    pontos3 = L.layerGroup(dotsTaxi);
  }
  pontos3.addTo(mapTaxi);
  infoTaxi.update = function (props) {
    this._div.innerHTML= infopropsTaxi(props);
  };
  infoTaxi.addTo(mapTaxi);
}
function inicioDotTaxi(){
var recife;
var pointsdots = [];
var xMin,yMin,xMax,yMax;
var contdots=0;
  L.geoJson(datasettaxi,{
    onEachFeature: async function (feature, layer) {
        await sleep(3000);
        novaDist= dotMapPrep(distribuicaoNYC(feature.properties.OBJECTID));
        //console.log(Math.max.apply(Math, getDis(feature.properties.name)));
        bounds = layer.getBounds();
        width = Math.abs(bounds._northEast.lng - bounds._southWest.lng);
        height = Math.abs(bounds._northEast.lat - bounds._southWest.lat);
        area= (turf.area(feature.geometry)/10000000);     
        //area= area/3;
          xMin = Infinity;
          yMin = Infinity;
          xMax = -Infinity;
          yMax = -Infinity;
        /*var LatLngs=layer.getLatLngs()[0];  
        LatLngs.forEach(p=>{
          var nova= map.unproject([p.lat,p.lng]);
          p.lat=nova.lat;
          p.lng=nova.lng;
        });*/
        
        layer.getLatLngs()[0].forEach(function(p,i){
            if (p.lat<xMin) xMin = p.lat;
            if (p.lat>xMax) xMax = p.lat;
            if (p.lng<yMin) yMin = p.lng;
            if (p.lng>yMax) yMax = p.lng;
        });
        var widthh = layer.getBounds().getNorth()-layer.getBounds().getSouth();//(xMax - xMin); 
        var heightt = layer.getBounds().getEast()-layer.getBounds().getWest();//(yMax - yMin);
        var polygon=layer.getLatLngs()[0];
        //console.log(widthh+'-'+heightt);
                  //console.log(bounds);
        //console.log(width+" "+height);
        //console.log(feature.properties.name);
        var enveloped = turf.envelope(feature);
        var a=turf.bbox(enveloped);
        var grid = turf.pointGrid(a,0.1);
        //console.log(grid.features.length);
        var pointsGrid=[];
        grid.features.forEach(function(d){
            var aux=d.geometry.coordinates;
            var q=L.latLng(aux[1],aux[0]);
            //if (leafletPip.pointInLayer(q, L.geoJSON(layer.toGeoJSON()), true).length > 0) {console.log('circulo dentro');}
            //p = L.latLng(bounds._southWest.lat + Math.random() * height, bounds._southWest.lng + Math.random() * width);
            if (leafletPip.pointInLayer(q, L.geoJSON(layer.toGeoJSON()), true).length > 0) {
              pointsGrid.push(q);
            }
        });
        var indice=0;
        pointsGrid=shuffle(pointsGrid);
        var pdisponiveis= pointsGrid.length;
        novaDist.forEach(function(d){
          cor= colorDT(d[0]);
          var limite=Math.round((pointsGrid.length)*d[1]);
          var i= indice;
          var l=limite+indice;
          for (i; i<l; i++) {
              if (pdisponiveis>0) {
                dotsTaxi.push(L.circleMarker(pointsGrid[i], {radius: 1.6, weight: 1,fillColor: cor,fillOpacity:1, color: cor,renderer: myRendererTaxi}));
                dotsZ1Taxi.push(L.circleMarker(pointsGrid[i], {radius: 2.2, weight: 1,fillColor: cor,fillOpacity:1, color: cor,renderer: myRendererTaxi}));
                dotsZ2Taxi.push(L.circleMarker(pointsGrid[i], {radius: 3.0, weight: 1,fillColor: cor,fillOpacity:1, color: cor,renderer: myRendererTaxi}));
                dotsZ3Taxi.push(L.circleMarker(pointsGrid[i], {radius: 4.6, weight: 1,fillColor: cor,fillOpacity:1, color: cor,renderer: myRendererTaxi}));
                pdisponiveis--; 
                //indice++;              
              }
          }
          indice+=limite;
        });
    }
  });
}
InicioDot();
inicioDotTaxi();