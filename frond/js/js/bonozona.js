// Función para obtener el token del servidor
const obtenerToken = async () => {
    try {
      // Hacer una solicitud HTTP al servidor para obtener el token
      const token = localStorage.getItem("token");
      if (!token) {
        // Si el token no está presente, redirigir al usuario a la página de inicio de sesión
        window.location.href = "http://127.0.0.1:5500/frond/login.html";
        return; // Detener la ejecución del código
      }
      const respuesta = await fetch('http://localhost:3009/DDE/usuario_aut', {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include' // Incluir cookies en la solicitud
      });
  
      // Verificar si la respuesta fue exitosa (código de estado 200)
      if (respuesta.ok) {
        const datosUsuario = await respuesta.json();
        // Mostrar los datos en un formulario
        mostrarDatosEnFormulario(datosUsuario);
      } else {
        console.error('Error al obtener el token:', respuesta.statusText);
      }
    } catch (error) {
      console.error('Error al obtener el token:', error.message);
    }
  };
  
  // Función para mostrar los datos en un formulario HTML
  const mostrarDatosEnFormulario = (datosUsuario) => {
  
      const userNavTop = document.getElementById('usernavtop');
      const userNav = document.getElementById('usernav');
      const perfi = document.getElementById('perfi');
  
      // Obtener los datos del usuario
      let { nombres, apellidos, perfil } = datosUsuario;
  
      // Convertir la primera letra de cada palabra a mayúscula y el resto a minúscula
      nombres = nombres.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
      apellidos = apellidos.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
      perfill = perfil.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
  
  
      // Obtener el primer nombre y el primer apellido
      const primerNombre = nombres.split(' ')[0];
      const primerApellido = apellidos.split(' ')[0];
  
  
      // Establecer el valor del span con el nombre del usuario
      userNavTop.textContent = `${primerNombre} ${primerApellido}`;
  
      // Establecer el valor del h6 con el nombre del usuario
      userNav.textContent = `${primerNombre} ${primerApellido}`;
  
      perfi.textContent = `${perfill}`;
  };
  // Llamar a la función para obtener el token
  obtenerToken();
  
  
  
  
  //*********************************poner en mayuscula**********************************/
  function mayus(e) {
    e.value = e.value.toUpperCase();
  }
  //*********************************poner en mayuscula**********************************/
  
  
  const getAlldistrito = async () => {
    try {
      // Verificar si el token está presente en el localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        // Si el token no está presente, redirigir al usuario a la página de inicio de sesión
        window.location.href = "http://127.0.0.1:5500/frond/login.html";
        return; // Detener la ejecución del código
      }
      const response = await fetch("http://localhost:3009/DDE/distrito",{
        method:"GET",
        headers:{
          Authorization: `Bearer ${token}`,
        }
      });
      if (!response.ok) {
        throw new Error("Error en la solicitud");
      }
      const result = await response.json();
      //console.log(result.data)
      if (result.error) {
        console.error("Error:", result.message);
        return [];
      } else {
        return result.data;
      }
    } catch (error) {
      console.error("Error:", error.message);
      return [];
    }
  };
  
  /* const getAllgestion = async () => {
    try {
      // Verificar si el token está presente en el localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        // Si el token no está presente, redirigir al usuario a la página de inicio de sesión
        window.location.href = "http://127.0.0.1:5500/frond/login.html";
        return; // Detener la ejecución del código
      }
      const response = await fetch("http://localhost:3009/DDE/gestion",{
        method:"GET",
        headers:{
          Authorization: `Bearer ${token}`,
        }
      });
      if (!response.ok) {
        throw new Error("Error en la solicitud");
      }
      const result = await response.json();
      console.log(result.data)
      if (result.error) {
        console.error("Error:", result.message);
        return [];
      } else {
        return result.data;
      }
    } catch (error) {
      console.error("Error:", error.message);
      return [];
    }
  }; */

  const populateSelect = (selectElement, options, valueFieldName, textFieldName) => {
    selectElement.innerHTML = '<option value="">Seleccione una opción</option>';
    options.forEach(option => {
        const optionElement = document.createElement("option");
        optionElement.value = option[valueFieldName];
        optionElement.textContent = option[textFieldName];
        selectElement.appendChild(optionElement);
    });
  };
  
  const populateFormSelects = async () => {
      const distritoSelect = document.getElementById("distrito");
      //const gestionSelect = document.getElementById("gestion");
  
      const distrito = await getAlldistrito();
      //const gestion = await getAllgestion();
  
      populateSelect(distritoSelect, distrito, "cod_dis", "distrito_descripcion");
      //populateSelect(gestionSelect, gestion,"gestion", "gestion");
  
      // Inicializa Select2 en los selectores después de haber poblado las opciones
      $(document).ready(function() {
          $('#distrito').select2();
          //$('#gestion').select2();
      });
  };
  
  // Llama a esta función para poblar los select cuando la página se carga
  populateFormSelects();





  let datosTabla = [];


  document.getElementById("formbuscar").addEventListener("submit", async function (event) {
    event.preventDefault(); // Evitar que se recargue la página al enviar el formulario
  
    // Obtener los valores del formulario
    const distrito = document.getElementById("distrito").value;
    const gestion = document.getElementById("gestion").value;
    const mes = document.getElementById("mes").value;
  
    // Validar campos
    if (!distrito || !gestion || !mes) {
      showWarningToast('Por favor, complete todos los campos requeridos');
      return;
    }
  
    // Realizar la búsqueda
    await realizarBusqueda({ distrito, gestion, mes });
  });
  
  document.getElementById("buscarmaestros").addEventListener("submit", async function (event) {
    event.preventDefault(); // Evitar que se recargue la página al enviar el formulario
  
    // Obtener los valores del formulario
    const distrito = document.getElementById("distrito").value;
    const gestion = document.getElementById("gestion").value;
    const mes = document.getElementById("mes").value;
    const coddis = document.getElementById("coddis").value;
  
    // Validar campos
    if (!distrito || !gestion || !mes || !coddis) {
      showWarningToast('Por favor, complete todos los campos requeridos');
      return;
    }
  
    // Realizar la búsqueda
    await realizarBusqueda({ distrito, gestion, mes, coddis });
  });
  
  const realizarBusqueda = async (params) => {
    try {
      // Mostrar el spinner y ajustar la opacidad
      spinner.classList.add("show");
      spinner.style.opacity = "0.5"; // Ajusta la opacidad aquí
  
      // Hacer una solicitud HTTP al servidor para obtener el token
      const token = localStorage.getItem("token");
      if (!token) {
        // Si el token no está presente, redirigir al usuario a la página de inicio de sesión
        window.location.href = "http://127.0.0.1:5500/frond/login.html";
        return; // Detener la ejecución del código
      }
  
      // Enviar los datos al servidor para realizar la búsqueda
      const response = await fetch('http://localhost:3009/DDE/bonozona', {
        method: "POST", // Usa POST si estás enviando datos
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(params)
      });
  
      // Ocultar el spinner después de recibir la respuesta
      spinner.classList.remove("show");
  
      if (response.ok) {
        const data = await response.json();
        datosTabla = data.data; // Almacena los datos de la tabla
        mostrarDatosdelaUE(data, params.coddis);
        // Mostrar el botón de imprimir
        document.getElementById("imprimir").style.display = "block";
      } else {
        const errorData = await response.json();
        console.error("Error al enviar la solicitud:", errorData);
        showErrorToast('U.E. no encontrada');
        // Ocultar el botón de imprimir en caso de error
        document.getElementById("imprimir").style.display = "none";
      }
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
      showErrorToast('Error al hacer la consulta');
      // Ocultar el botón de imprimir en caso de error
      document.getElementById("imprimir").style.display = "none";
    }
  };
  
  // Función para mostrar un toast de advertencia
  const showWarningToast = (message) => {
    const Toast = Swal.mixin({
      toast: true,
      position: "bottom-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
  
    Toast.fire({
      icon: "warning",
      title: message,
    });
  };
  
  // Función para mostrar un toast de error
  const showErrorToast = (message) => {
    const Toast = Swal.mixin({
      toast: true,
      position: "bottom-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
  
    Toast.fire({
      icon: "error",
      title: message,
    });
  };
  
  // Función para mostrar los datos en la tabla HTML
  const mostrarDatosdelaUE = (data, coddis) => {
    // Obtener referencia a la tabla
    const table = document.getElementById('myTable');
    table.innerHTML = ''; // Limpiar el contenido anterior de la tabla
  
    // Crear el encabezado de la tabla
    const thead = document.createElement('thead');
    thead.innerHTML = `
      <tr class="text-white">
        ${coddis ? `
          <th>RDA</th>
          <th>MAESTRO_A</th>
          <th>CARGO</th>
          <th>SERVICIO_ITEM</th>
        ` : `
          <th>DISTRITO</th>
          <th>UNIDAD EDUCATIVA</th>
        `}
      </tr>
    `;
    table.appendChild(thead);
  
    // Obtener referencia al cuerpo de la tabla
    const tbody = document.createElement('tbody');
    tbody.id = 'medida';
    table.appendChild(tbody);
  
    // Iterar sobre los datos recibidos y crear filas dinámicamente
    data.data.forEach((row) => {
      const tr = document.createElement('tr');
      tr.innerHTML = coddis ? `
        <td>${row.RDA}</td>
        <td>${row.MAESTRO_A}</td>
        <td>${row.CARGO}</td>
        <td>${row.SERVICIO_ITEM}</td>
      ` : `
        <td>${row.DISTRITO}</td>
        <td>${row.UNIDAD_EDUCATIVA}</td>
      `;
      tbody.appendChild(tr);
    });
  };
  

  document.getElementById('imprimir').addEventListener('click', async function(event) {
    event.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "http://127.0.0.1:5500/frond/login.html";
        return;
    }

    // Obtener los datos de la tabla
    const table = document.getElementById('myTable');
    const rows = table.getElementsByTagName('tr');
    const datosTabla = [];

    for (let i = 1; i < rows.length; i++) { // Empezar en 1 para saltar el encabezado
        const cells = rows[i].getElementsByTagName('td');
        const rowData = [];
        for (let j = 0; j < cells.length; j++) {
            rowData.push(cells[j].innerText);
        }
        datosTabla.push(rowData);
    }

    try {
        const response = await fetch('http://localhost:3009/DDE/pdf', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ datosTabla }) // Enviar datos de la tabla
        });

        if (!response.ok) {
            throw new Error('Error en la solicitud');
        }

        const blob = await response.blob();

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'reporte.pdf';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);

    } catch (error) {
        console.error('Error:', error.message);
        alert('Error al generar el PDF');
    }
});
