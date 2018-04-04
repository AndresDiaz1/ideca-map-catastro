// # main.js

// Definición de variables del Mapa y del control del GPS
var map, locateControl, loadingControl;
// Definición de las capas de posición, lote y área de geolocalización
var markerLayer, loteLayer;
// Definición de la variable que almacenará los datos requeridos
var datosBogota;

// ## Ready 
$(document).ready(function () {
  "use strict";
  // Extensión del Objeto String para incluir función de reemplazar todo
  String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
  };

  // Recorre los servicios y verifica que estos contestan
  for (const key in urlServices) {
    if (urlServices.hasOwnProperty(key)) {
      statServices(urlServices[key]);
    }
  }

  // Inicialización del mapa con ubicación inicial en la Plaza de Bolívar
  map = L.map('map', {
    crs: L.CRS.EPSG3857,
    maxZoom: 20,
    minZoom: 12,
  }).setView([4.5981, -74.0758], 18);

  // Definición de la atribución del mapa
  map.attributionControl.addAttribution('<a href="https://www.ideca.gov.co" target="_blank">IDECA, La IDE de Bogotá</a>');

  // Definición de las conexiones que apuntan a los servicios de mapas base
  var basemaps = [
    L.esri.tiledMapLayer({
      url: urlServices.urlHibrido,
      maxZoom: 20
    }),
    L.esri.tiledMapLayer({
      url: urlServices.urlBaseMap,
      maxZoom: 20
    })
  ];

  // Creación de un control de leaflet con el logo de IDECA
  var logo = L.control({
    position: 'bottomleft'
  });
  logo.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'myclass');
    div.innerHTML = "<img class='logo' src='http://mapas.bogota.gov.co/images/logo-med.png'/>";
    return div;
  }
  logo.addTo(map);

  loadingControl = L.Control.loading({
    spinjs: true
  });
  map.addControl(loadingControl);

  // Uso del control de intercambio de mapa base
  map.addControl(L.control.basemaps({
    basemaps: basemaps,
    tileX: 150,
    tileY: 249,
    tileZ: 9
  }));

  // Inicialización de las capas de elementos
  markerLayer = new L.LayerGroup();
  loteLayer = new L.LayerGroup();

  // Se agregan las capas al mapa en espera de datos a mostrar
  markerLayer.addTo(map);
  loteLayer.addTo(map);

  // Agrega el control de GPS al mapa
  locateControl = L.control.locate({
    position: 'topleft',
    drawCircle: false,
    drawMarker: false,
    icon: 'fa fa-location-arrow',
    enableHighAccuracy: true
  }).addTo(map);

  // Si se genera un error en la localización por GPS muestra error
  map.on('locationerror', onLocationError);

  // Si el usuario da clic en el mapa se recupera las coordenadas
  // y se ejecuta la función marcador
  map.on('click', function (e) {
    marcador(e.latlng);
  });

  L.control.search().addTo(map);
});

// ##   marcador
// Función que recupera los datos de los servicios geográficos

// *   latlng: Par coordenado definido por el usuario
function marcador(latlng) {
  "use strict";

  // Detiene el GPS
  locateControl.stop();

  // Limpia las capas de datos del mapa
  loteLayer.clearLayers();
  markerLayer.clearLayers();

  // Inicializa la variable de datos
  datosBogota = constructorDatosBogota();

  var serviceCatastro = L.esri.mapService({
      url: urlServices.urlCatastro
  });
  serviceCatastro.query()
      .layer(9)
      .where("PRECHIP = 'AAA0029XRSY'")
      .fields('BARMANPRE')
      .returnGeometry(false)
      .run(function (error, featureCollection, response) {

        if (featureCollection.features.length > 0) {
          var BARMANPRE = featureCollection.features[0].properties.BARMANPRE;

            serviceCatastro.query()
                .layer(3)
                .where("LOTCODIGO = '" + BARMANPRE + "'")
                .fields('*')
                .returnGeometry(true)
                .run(function (error, featureCollection, response) {
                    var lote = L.geoJSON(featureCollection);
                    lote.addTo(loteLayer);

                    var bounds = lote.getBounds();
                    map.fitBounds(bounds);

                    // Obtener centroide del lote
                    var centroid = turf.centroid(featureCollection.features["0"].geometry);

                    // Crea una marcador con las coordenadas recuperadas del mapa
                    //var newMarker = new L.marker(centroid);
                    var newMarker = L.geoJSON(centroid);

                    // Adiciona el marcador al mapa
                    newMarker.addTo(markerLayer);

                });
        }
      });

  return;

}

// ##   onLocationError
// Función que muestra el mensaje de error del posicionamiento
function onLocationError(e) {
  swal("", e.message, "error");
}

// ##   statServices
// Función que valida el estado de los servicios que consume la aplicación
// *   urlServicio: URL del servicio a consultar
function statServices(urlServicio) {
  $.ajax({
    type: "GET",
    url: urlServicio + '/healthcheck?f=json&callback=?',
    dataType: "jsonp",
    async: false,
    success: function (json) {
      if (json.currentVersion) {

		// Servicio OK
      }
    },
    error: function (e) {
      console.log(e.message);
    }
  });
}

// ##   identifyDatos
// Función que ejecuta la tarea de identificación sobre el servicio
// *   urlServicio: URL del servicio a consultar.
// *   latlng: Par coordenado a consultar.
// *   layer: ID del layer a consultar en el servicio.
// *   tolerancia: Número de pixeles dentro de los que el sistema realizará la búsqueda.
// *   geometria: Define si devuelve la geometría del elemento encontrado.
// *   callback: Función que recupera la respuesta de la petición.
function identifyDatos(urlServicio, latlng, layer, tolerancia, geometria, callback) {
  var mapService = L.esri.mapService({
    url: urlServicio
  });

  // Ejecuta el llamado de la API REST de ArcGIS Server con la URL del servicio enviado
  mapService.identify()
    .on(map)
    .at([latlng.lat, latlng.lng])
    .layers(layer)
    .tolerance(tolerancia)
    .returnGeometry(geometria)
    .run(function (error, featureCollection, response) {
      if (error) {
        console.log(error.message);
      } else {

        // Si recupera registros los devuelve
        if (featureCollection.features.length > 0) {
          callback(featureCollection.features[0]);
        }
      }
    });
}