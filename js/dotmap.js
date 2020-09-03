var left=200,right=500,dots=[];
var mapVis02 = L.map('vis02',{zoomControl: false,preferCanvas: true,attributionControl: false,crs: L.CRS.Simple}).setView([0.203125,0.6640625], 6);
var mapVisPerguntas = L.map('visPerguntas',{zoomControl: false,preferCanvas: true,attributionControl: false,crs: L.CRS.Simple}).setView([0.203125,0.6640625], 6);
mapVis02.doubleClickZoom.disable();
mapVis02.scrollWheelZoom.disable();
mapVisPerguntas.doubleClickZoom.disable();
mapVisPerguntas.scrollWheelZoom.disable();
var myRenderer = L.canvas({ padding: 0.5 });
var grades;
var geodata;
var url_string = window.location.href
var url = new URL(url_string);
var polyfile,polygon;
var distributionfile;
var distribution,distribution_data;
var pontos,pontos_perguntas;
var etapa_perguntas=false;
function Start_Update_data(){
  if(!polyfile) {
    polyfile = "./data/polygons.geojson";
  }else{
    polyfile = polygon;
  }
  d3.json(polyfile,function(error,polygons_far){
    geodata=polygons_far;
  });
  if(!distributionfile) {
    distributionfile = "./data/distribuicao.json";
  }else{
    distributionfile = distribution;
  }
  d3.json(distributionfile,function(error,dist){
    menor = Infinity
    maior = -Infinity
    for(let key in dist){
      let values = dist[key];
      for(key2 in values){
          let value = values[key2];
          if(value < menor) menor = value;
          if(value > maior) maior = value;
      }
    }
    //
    colorScale = d3.scale.quantile().domain([menor,maior]).range(['#f7fcfd','#e5f5f9','#ccece6','#99d8c9','#66c2a4','#41ae76','#238b45','#006d2c','#00441b']); 
    grades = d3.scale.linear().domain([menor,maior]).ticks(12);

    addLegend();
    distribution_data=Object.keys(dist).map(function(key) {
      return [dist[key]];
    });
    gera_pontos();
  });
}
var infoVis02=L.control();
var legendVis02 = L.control({position: 'bottomright'});
var infoVisPerguntas=L.control();
var legendVisPerguntas = L.control({position: 'bottomright'});
function addLegend(){
  infoVis02.onAdd = function (mymap) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
  };
  legendVis02.onAdd = function (mapprob_gerada) {
    var div = L.DomUtil.create('div', 'info legend');
    for (var i = (grades.length-1); i >=0 ; i--) {
        div.innerHTML +='<i style="color:'+color(grades[i])+'; background:'+color(grades[i])+'"></i>'+grades[i]+'</br>';
    }
    return div;
  };
  legendVis02.addTo(mapVis02);
  infoVisPerguntas.onAdd = function (mymap) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
  };
  legendVisPerguntas.onAdd = function (mapprob_gerada) {
    var div = L.DomUtil.create('div', 'info legend');
    for (var i = (grades.length-1); i >=0 ; i--) {
        div.innerHTML +='<i style="color:'+color(grades[i])+'; background:'+color(grades[i])+'"></i>'+grades[i]+'</br>';
    }
    return div;
  };
  legendVisPerguntas.addTo(mapVisPerguntas);
}
//-- FUNÇÃO QUE DESENHA E CONTROLA AS AREAS NO MAPA --
var layerTuto2,layerPerguntas;
function Vis02TutorialFunction(){
  if(layerTuto2!= undefined){
      layerTuto2.clearLayers();
    }
    layerTuto2=L.geoJson(geodata,
      {style: function(feature){
        if(feature.properties.highlight==1){
          if(feature.properties.id==0){
            return {
              weight: 3.5,
              opacity: 1,
              fillOpacity: 0,
              color: '#e66101'
            };
          }else if(feature.properties.id==1){
            return {
              weight: 3.5,
              opacity: 1,
              fillOpacity: 0,
              color: '#d01c8b'
            };
          }else if(feature.properties.id==48){
            return {
              weight: 3.5,
              opacity: 1,
              fillOpacity: 0,
              color: '#dfc27d'
            };
          }else if(feature.properties.id==16){
            return {
              weight: 3.5,
              opacity: 1,
              fillOpacity: 0,
              color: '#2d004b'
            };
          }
        }else{
              return {
                weight: 0.5,
                opacity: 1,
                color: 'black',
                fillOpacity: 0
              };
          }
      }
  }).addTo(mapVis02);
  pontos = L.layerGroup(dots);
  pontos.addTo(mapVis02);
  infoVis02.update = function (props) {
    this._div.innerHTML= infoprops(props);
  };
  infoVis02.addTo(mapVis02);
}
function VisPerguntas(){
    if(layerPerguntas!= undefined){
      layerPerguntas.clearLayers();
    }
    layerPerguntas=L.geoJson(geodata,
      {style: function(feature){
        if(feature.properties.highlight==1){
          if(feature.properties.id==0){
            return {
              weight: 3.5,
              opacity: 1,
              fillOpacity: 0,
              color: '#e66101'
            };
          }else{
            return {
              weight: 3.5,
              opacity: 1,
              fillOpacity: 0,
              color: '#d01c8b'
            };
          }
        }else{
              return {
                weight: 0.5,
                opacity: 1,
                color: 'black',
                fillOpacity: 0
              };
          }
      }
  }).addTo(mapVisPerguntas);
  pontos_perguntas = L.layerGroup(dots);
  pontos_perguntas.addTo(mapVisPerguntas);
  infoVisPerguntas.update = function (props) {
    this._div.innerHTML= infoprops(props);
  };
  infoVisPerguntas.addTo(mapVisPerguntas);
}

function gera_pontos(){
  if(pontos){
    pontos.clearLayers();
  }
  if(pontos_perguntas){
    pontos_perguntas.clearLayers();
  }
  dots = [];
  var xMin,yMin,xMax,yMax,ndist;
  var contdots=0;
  L.geoJson(geodata,{
    onEachFeature: function (feature, layer) {
        //await sleep(100);
        var buffered = turf.buffer(layer.toGeoJSON(), -5, {units: 'miles'});
        ndist= dotMapPrep(distribuicaoSin(feature.properties.id,distribution_data));
        var enveloped = turf.envelope(feature);
        var a=turf.bbox(enveloped); 
        var grid = turf.pointGrid(a,12);
        var pointsGrid=[];
        grid.features.forEach(function(d){
          var aux=d.geometry.coordinates; 
          var q=L.latLng(aux[1],aux[0]);
          if (turf.inside(turf.point([q.lng,q.lat]),buffered)) {
            pointsGrid.push(q);
          }
        });
        var indice=0;
        pointsGrid=shuffle(pointsGrid); 
        var pdisponiveis= pointsGrid.length;
        ndist.forEach(function(d){
          cor= color(d[0]);
          var limite=Math.round((pointsGrid.length)*d[1]);
          var i= indice;
          var l=limite+indice;
          for (i; i<l; i++) {
            if (pdisponiveis>0) {
              dots.push(L.circleMarker(pointsGrid[i], {radius: 3.2, stroke:true, weight: 0.5,fillColor: cor,fillOpacity:1, color: 'gray',renderer: myRenderer}));//.bindPopup(""+d[0]));             
              pdisponiveis--; 
            }
          }
          indice+=limite;
        });
    }
  });
  if(etapa_perguntas==true){
    VisPerguntas();
    bring_front(mapVisPerguntas);
    mapVisPerguntas.invalidateSize();
  }
}