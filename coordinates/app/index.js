// # Librería de Servicios Web Geográficos de Bogotá D.C.
// <https://www.ideca.gov.co>

/* 
 Obtiene las coordenadas (x,y) de una dirección específica, así como la
 información de localidad, unidad de planeamiento, barrio, estrato y 
 código postal, a través de los servicios web geográficos dispuestos 
 por la Infraestructura de Datos Espaciales de Bogotá (IDECA).
 
 Librería desarrollada para promover el aprovechamiento de los recursos 
 geográficos producidos para y por la Administración Distrital
*/

// ## index.js
// Este archivo de información

// ## config.js
// Archivo que contiene las URL de conexión a los servicios
// y la definición del objeto de almacenamiento datosBogota
/*
{
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
}
*/

// ## search.js
// Control desarrollado para consumir la API de búsqueda por
// direcciones y CHIP de IDECA

// ## main.js
// Archivo principal de la aplicación