// # search.js

// ## Control de búsqueda
L.Control.Search = L.Control.extend({
  // Opciones del control
  options: {
    // topright, topleft, bottomleft, bottomright
    position: 'topright',
    placeholder: 'Buscar...'
  },
  
  // ## Función de inicialización
  initialize: function (options) {
    // constructor
    L.Util.setOptions(this, options);
  },
  
  // ## Función de agregar el control al mapa
  onAdd: function (map) {
    var container = L.DomUtil.create('div', 'search-container');
    this.form = L.DomUtil.create('form', 'form', container);
    var group = L.DomUtil.create('div', 'form-group', this.form);
    this.input = L.DomUtil.create('input', 'form-control input-sm', group);
    this.input.type = 'text';
    this.input.id = 'querySearch';
    this.input.placeholder = this.options.placeholder;
    L.DomEvent.addListener(this.input, 'keyup', _.debounce(this.keyup, 300), this);
    L.DomEvent.addListener(this.form, 'submit', this.submit, this);
    L.DomEvent.disableClickPropagation(container);
    return container;
  },
  
  // ## Función de eliminación del control
  onRemove: function (map) {
    L.DomEvent.removeListener(this._input, 'keyup', this.keyup, this);
    L.DomEvent.removeListener(form, 'submit', this.submit, this);
  },
  
  // ## Función de detección de ingresar valores
  keyup: function (e) {
    if (e.keyCode === 38 || e.keyCode === 40) {
      // do nothing
      // Si el usuario ejecuta el Enter
    } else if (e.keyCode === 13) {
      // Valida que la búsqueda tenga al menos 5 caracteres
      if (this.input.value.length > 5) {
        // Muestra el loading control
        loadingControl._showIndicator();
        // Construye la URL de búsqueda
        var _url = urlBusqueda + 'cmd=direccion_chip&query=' + escape(this.input.value) + '&xmin=-8250193.129653922&ymin=520211.13382162683&xmax=-8249951.278119187&ymax=520435.6675921458&spatialReference=102100&extent=false';
        // Ejecuta la petición asincrónica
        $.ajax({
          url: _url,
          type: 'GET',
          dataType: 'json',
          success: function (data) {
            // Si la petición contesta correctamente, ingresa
            if (data.status) {
              if (data.resultados.length == 1) {
                // Centra la pantalla en el resultado
                map.setView(L.latLng(data.resultados[0].Y, data.resultados[0].X), 19);
              } else if (data.resultados.length > 1) {
                // Centra la pantalla en el centroide de resultados
                map.setView(L.latLng(data.latitud, data.longitud), 19);
              } else {
                // Muestra mensaje que no se encontraron datos
                swal("", "No se encontraron coincidencias", "error");
              }
            }
            // Quita el control de loading
            loadingControl._hideIndicator();
          },
          // Si falla muestra el error
          error: function (xhr, status, error) {
            swal("", error, "error");
          }
        });
      }
    }
  },
  // Previene la ejecución normal del formulario
  submit: function (e) {
    L.DomEvent.preventDefault(e);
  }
});

// Crea el control de búsqueda
L.control.search = function (id, options) {
  return new L.Control.Search(id, options);
}