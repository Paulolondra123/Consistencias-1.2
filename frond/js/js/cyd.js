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
/* const token = localStorage.getItem('token');
if (token) {
  console.log('Token JWT encontrado:', token);
} else {
  console.log('No se encontró ningún token JWT en el localStorage.');
} */
//***********************************crear categoria*************************************/
/* const formAgregarcod_dis = document.getElementById("myForm");

formAgregarcod_dis.addEventListener("submit", async function (event) {
  event.preventDefault(); // Evitar que se recargue la página al enviar el formulario

  // Obtener los valores del formulario
  const nombre_medida = document.getElementById("nombre_medida").value;
  const descripcion = document.getElementById("descripcion").value;

  try {
    // Verificar si el token está presente en el localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      // Si el token no está presente, redirigir al cod_dis a la página de inicio de sesión
      window.location.href = "http://127.0.0.1:5500/frond/Z.administrador/login.html";
      return; // Detener la ejecución del código
    }
    // Enviar los datos al servidor para crear el nuevo cod_dis
    const response = await fetch(
      "http://localhost:3009/DDE/create_medida",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre_medida,
          descripcion,
        }),
      }
    );

    if (response.ok) {
      // Destruir DataTable antes de eliminar la fila
      
      // Actualizar la tabla después de cambiar el estado
    } else {
      const errorData = await response.json();
       // Actualizar la tabla después de cambiar el estado
    }
  } catch (error) {
    console.error("Error al enviar la solicitud:", error);
    alert("Error al enviar la solicitud");
  }
}); */
//***********************************crear categoria*************************************/


document.getElementById("movimientopersonal").addEventListener("change", function () {
  if (this.checked) {
    document.getElementById("añosprovincia").checked = false;
    document.getElementById("ap").checked = false; 
    document.getElementById("observados").checked = false; 

  }
});

document.getElementById("añosprovincia").addEventListener("change", function () {
  if (this.checked) {
    document.getElementById("movimientopersonal").checked = false;
    document.getElementById("ap").checked = false; 
    document.getElementById("observados").checked = false; 
  }
});

document.getElementById("ap").addEventListener("change", function () {
  if (this.checked) {
    document.getElementById("movimientopersonal").checked = false;
    document.getElementById("añosprovincia").checked = false; 
    document.getElementById("observados").checked = false; 
  }
});

document.getElementById("observados").addEventListener("change", function () {
  if (this.checked) {
    document.getElementById("movimientopersonal").checked = false;
    document.getElementById("añosprovincia").checked = false; 
    document.getElementById("ap").checked = false; 
  }
});
document.getElementById("formbuscar").addEventListener("submit", async function (event) {
  event.preventDefault(); // Evitar que se recargue la página al enviar el formulario

  // Obtener los valores del formulario
  //const gestion = document.getElementById("gestion").value;
  const carnet = document.getElementById("carnet").value;
  const spinner = document.getElementById("spinner");

  // Verificar si el campo de carnet está vacío
  if (!carnet) {
    const Toast = Swal.mixin({
      toast: true,
      position: "bottom-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });

    Toast.fire({
      icon: "warning",
      title: 'Por favor, ingrese el número de carnet',
    });
    return; // Detener la ejecución del código si el carnet está vacío
  }

  // Determinar qué checkbox está seleccionado
  const movimientopersonalChecked = document.getElementById("movimientopersonal").checked;
  const añosprovinciaChecked = document.getElementById("añosprovincia").checked;
  const prdChecked = document.getElementById("ap").checked;
  const observadosChecked = document.getElementById("observados").checked;



  if (!movimientopersonalChecked && !añosprovinciaChecked && !prdChecked && !observadosChecked) {
    const Toast = Swal.mixin({
      toast: true,
      position: "bottom-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });

    Toast.fire({
      icon: "warning",
      title: 'Por favor, seleccione una opción',
    });
    return; // Detener la ejecución del código si no se ha seleccionado ninguna opción
  }

  //const queryType = movimientopersonalChecked ? 'first' : 'second';

  let queryType = '';

  if (movimientopersonalChecked) {
    queryType = 'first';
  }
  if (añosprovinciaChecked) {
    queryType = 'second';
  }
  if (prdChecked) {
    queryType = 'tercer';
  }
  if (observadosChecked) {
    queryType = 'cuarto';
  }
 



  //console.log("Tipo de dato:", typeof carn);

  try {
    // Mostrar el spinner y ajustar la opacidad
    spinner.classList.add("show");
    spinner.style.opacity = "0.5"; // Ajusta la opacidad aquí

    // Hacer una solicitud HTTP al servidor para obtener el token
    const token = localStorage.getItem("token");
    if (!token) {
      // Si el token no está presente, redirigir al cod_dis a la página de inicio de sesión
      window.location.href = "http://127.0.0.1:5500/frond/login.html";
      return; // Detener la ejecución del código
    }

    // Enviar los datos al servidor para realizar la búsqueda
    const response = await fetch(
      'http://localhost:3009/DDE/buscar', // Cambia la URL según tu endpoint
      {
        method: "POST", // Usa POST si estás enviando datos
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          carnet,
          queryType
        })
      }
    );

    // Ocultar el spinner después de recibir la respuesta
    spinner.classList.remove("show");

    if (response.ok) {
      const data = await response.json();
      // Manejar la respuesta exitosa (por ejemplo, actualizar la tabla)
      //console.log("Datos recibidos:", data);
      // Mostrar los datos en un formulario
      mostrarDatosEnFormulari(data, queryType);
    } else {
      const errorData = await response.json();
      console.error("Error al enviar la solicitud:", error);
      const Toast = Swal.mixin({
        toast: true,
        position: "bottom-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });

      Toast.fire({
        icon: "error",
        title: 'Carnet no encontrado',
      });
      limpiarTabla();
      
    }
  } catch (error) {
    console.error("Error al enviar la solicitud:", error);
    const Toast = Swal.mixin({
      toast: true,
      position: "bottom-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });

    Toast.fire({
      icon: "error",
      title: 'Carnet no encontrado',
    });
  }
});


// Función para mostrar los datos en la tabla HTML
const mostrarDatosEnFormulari = (data, queryType) => {
  // Obtener referencia a la tabla
  const table = document.getElementById('myTable');
  table.innerHTML = ''; // Limpiar el contenido anterior de la tabla

  // Crear el encabezado de la tabla
  const thead = document.createElement('thead');
  thead.innerHTML = `
    <tr class="text-white">
    ${queryType === 'first' 
      ? `<th>GESTION</th><th>MES</th><th>DISTRITO</th><th>SERVICIO</th><th>ITEM</th><th>HORAS</th>`
      : queryType === 'second' 
          ? `<th>GESTION</th><th>DISTRITO</th><th>MAESTRO_A</th><th>CARGO</th><th>SERVICIO</th><th>ITEM</th><th>HORAPR</th><th>CANTIDAD_MESES</th>`
          : queryType === 'tercer'
          ? `<th>COD_RDA</th><th>MAESTRO_A</th><th>NOMBRE2</th><th>NUM_DOC</th><th>FRONTERA</th><th>DESDE</th><th>HASTA</th><th>HORAS</th>`
          : `<th>CARNET</th><th>PATERNO</th><th>MATERNO</th><th>NOMBRE1</th><th>NOMBRE2</th><th>MOTIVO</th>`
          }
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
    tr.innerHTML = queryType === 'first' 
  ? `
    <td>${row.gestion}</td>
    <td>${row.mes}</td>
    <td>${row.cod_dis}</td>
    <td>${row.servicio}</td>
    <td>${row.item}</td>
    <td>${row.horas}</td>
  `
  : queryType === 'second' 
    ? `
      <td>${row.GESTION}</td>
      <td>${row.DISTRITO}</td>
      <td>${row.MAESTRO_A}</td>
      <td>${row.CARGO}</td>
      <td>${row.servicio}</td>
      <td>${row.item}</td>
      <td>${row.horapr}</td>
      <td>${row.CANTIDAD_MESES}</td>
    `
    : queryType === 'tercer'
    ? `
      <td>${row.cod_rda}</td>
      <td>${row.MAESTRO_A}</td>
      <td>${row.nombre2}</td>
      <td>${row.NUM_DOC}</td>
      <td>${row.FRONTERA}</td>
      <td>${row.DESDE}</td>
      <td>${row.HASTA}</td>
      <td>${row.HORAS}</td>
    `
    : `
      <td>${row.carnet}</td>
      <td>${row.PATERNO}</td>
      <td>${row.MATERNO}</td>
      <td>${row.nombre1}</td>
      <td>${row.NOMBRE2}</td>
      <td>${row.MOTIVO}</td>
    `;
    tbody.appendChild(tr);
  });
};
