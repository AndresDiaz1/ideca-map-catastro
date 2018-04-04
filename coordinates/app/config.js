// # config.js

// ## urlWebServices
var urlServices = {
    // URL de los servicios web utilizados por la aplicación para recuperar los datos. Directorio de Servicios Web: http://serviciosgis.catastrobogota.gov.co/arcgis/rest/services
    urlCatastro: 'http://serviciosgis.catastrobogota.gov.co/arcgis/rest/services/ordenamientoterritorial/catastro/MapServer',
    urlBarrio: 'http://serviciosgis.catastrobogota.gov.co/arcgis/rest/services/ordenamientoterritorial/entidadterritorial/MapServer',
    urlCodigoPostal: 'http://visor.codigopostal.gov.co/arcgis/rest/services/Mapa472/MapServer',
    urlPlaneacion: 'http://sinupotp.sdp.gov.co:6080/arcgis/rest/services/SERVICIOS_GEOGRAFICOS/ESTRATIFICACION/MapServer',
    // URL de los servicios web de mapas a visualizar
    urlBaseMap: 'http://serviciosgis.catastrobogota.gov.co/arcgis/rest/services/Mapa_Referencia/mapa_base_3857/MapServer',
    urlHibrido: 'http://serviciosgis.catastrobogota.gov.co/arcgis/rest/services/Mapa_Referencia/mapa_hibrido/MapServer',
};

// ##  IDECA SearchServices 
// Buscador de direcciones en Bogotá
var urlBusqueda = 'http://vmprowls10.eastus.cloudapp.azure.com:7201/PMBWeb/web/buscar?';

// ##  DataBuilding
// Constructor del elemento de almacenamiento de las respuestas
function constructorDatosBogota() {
    "use strict";
    return {
        Coordenadas: {
            latitud: 0,
            Longitud: 0
        },
        Estrato: '',
        Direccion: '',
        Barrio: '',
        Sector: '',
        UPZ: {
            Codigo: '',
            Nombre: ''
        },
        CodigoPostal: '',
        Localidad: '',
    };
}