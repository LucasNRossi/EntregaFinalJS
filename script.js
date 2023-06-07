document.addEventListener("DOMContentLoaded", function() {
  const listaPedido = document.getElementById("lista-pedido");
  const totalSpan = document.getElementById("total");
  const confirmarButton = document.getElementById("confirmar");
  const combosButtons = document.querySelectorAll("#combos button");
  const armarButton = document.getElementById("armar");
  const eliminarUltimoButton = document.getElementById("eliminar-ultimo");
  const limpiarCarritoButton = document.getElementById("limpiar-carrito");
  
  const precios = {
    pan: 75.00,
    hamburguesa: 80.00,
    lechuga: 40.00,
    tomate: 60.00,
    queso: 70.00,
    panceta: 90.00,
    papas: 150.00,
    gaseosa: 250.00
  };

  let pedido = [];

  function agregarProducto(nombre, cantidad, precio) {
    const producto = {
      nombre: nombre,
      cantidad: cantidad,
      precio: precio
    };
    pedido.push(producto);
  }

  function actualizarPedido() {
    listaPedido.innerHTML = "";
    let total = 0;
    pedido.forEach(function(producto) {
      const item = document.createElement("li");
      item.textContent = producto.cantidad + "x " + producto.nombre + " - $" + (producto.cantidad * producto.precio).toFixed(2);
      listaPedido.appendChild(item);
      total += producto.cantidad * producto.precio;
    });
    totalSpan.textContent = total.toFixed(2);
  
    // Guardar el pedido en el almacenamiento local
    localStorage.setItem("pedido", JSON.stringify(pedido));
  
    // Mostrar u ocultar el contenedor de pedido según si hay o no pedidos
    if (pedido.length === 0) {
      document.getElementById("pedido").style.display = "none";
    } else {
      document.getElementById("pedido").style.display = "block";
    }
  }
  
  confirmarButton.addEventListener("click", function() {
    // Enviar el pedido al servidor o realizar alguna acción adicional
    Swal.fire({
      position:'center',
      icon: 'success',
      title: 'Su pedido fue confirmado',
      showConfirmButton: false,
      timer: 2000
    });
    pedido = [];
    actualizarPedido();
    document.getElementById("pedido").style.display = "none";

    // Eliminar el pedido del almacenamiento local
    localStorage.removeItem("pedido");
  });

  // Verificar si hay un pedido guardado en el almacenamiento local
  if (localStorage.getItem("pedido")) {
    pedido = JSON.parse(localStorage.getItem("pedido"));
    actualizarPedido();
    document.getElementById("pedido").style.display = "block";
  }

  combosButtons.forEach(function(button) {
    button.addEventListener("click", function() {
      const comboId = button.id;
      switch (comboId) {
        case "combo1":
          agregarProducto("Combo 1", 1, precios.hamburguesa + precios.papas + precios.gaseosa);
          break;
        case "combo2":
          agregarProducto("Combo 2", 1, (precios.hamburguesa * 2) + precios.papas + precios.gaseosa);
          break;
      }
      actualizarPedido();
      document.getElementById("pedido").style.display = "block";
    });
  });

  armarButton.addEventListener("click", function() {
    const cantidadPan = parseInt(document.getElementById("cantidad-pan").value);
    const cantidadHamburguesas = parseInt(document.getElementById("cantidad-hamburguesas").value);
    const cantidadLechuga = parseInt(document.getElementById("cantidad-lechuga").value);
    const cantidadTomate = parseInt(document.getElementById("cantidad-tomate").value);
    const cantidadQueso = parseInt(document.getElementById("cantidad-queso").value);
    const cantidadPanceta = parseInt(document.getElementById("cantidad-panceta").value);
  
    if (cantidadPan > 0) {
      agregarProducto("Pan", cantidadPan, precios.pan);
    }
    if (cantidadHamburguesas > 0) {
      agregarProducto("Hamburguesa", cantidadHamburguesas, precios.hamburguesa);
    }
    if (cantidadLechuga > 0) {
      agregarProducto("Lechuga", cantidadLechuga, precios.lechuga);
    }
    if (cantidadTomate > 0) {
      agregarProducto("Tomate", cantidadTomate, precios.tomate);
    }
    if (cantidadQueso > 0) {
      agregarProducto("Queso", cantidadQueso, precios.queso);
    }
    if (cantidadPanceta > 0) {
      agregarProducto("Panceta", cantidadPanceta, precios.panceta);
    }
  
    actualizarPedido();
    document.getElementById("pedido").style.display = "block";
  
    // Restablecer valores a 0
    document.getElementById("cantidad-pan").value = 0;
    document.getElementById("cantidad-hamburguesas").value = 0;
    document.getElementById("cantidad-lechuga").value = 0;
    document.getElementById("cantidad-tomate").value = 0;
    document.getElementById("cantidad-queso").value = 0;
    document.getElementById("cantidad-panceta").value = 0;
  });
  

  eliminarUltimoButton.addEventListener("click", function() {
    pedido.pop();
    actualizarPedido();
    if (pedido.length === 0) {
      document.getElementById("pedido").style.display = "none";
    }
  });

  limpiarCarritoButton.addEventListener("click", function() {
    pedido = [];
    actualizarPedido();
    document.getElementById("pedido").style.display = "none";
  });
});

/*TOP HAMBURGUESAS*/

const burgerList = document.getElementById('burgerList');
const STORAGE_KEY = 'topBurgers';

// Comprobar si hay datos almacenados en el localStorage
const storedData = localStorage.getItem(STORAGE_KEY);

if (storedData) {
  // Si hay datos almacenados, utilizar esos datos en lugar de hacer la consulta a la API
  const data = JSON.parse(storedData);
  showBurgers(data);
} else {
  // Si no hay datos almacenados, hacer la consulta a la API
  fetch('https://burgers-hub.p.rapidapi.com/burgers', {
    method: 'GET',
    headers: {
      'x-rapidapi-host': 'burgers-hub.p.rapidapi.com',
      'x-rapidapi-key': 'f33ba252d0msh00302614018b7eap1d5b31jsn759fab2f5e82'
    }
  })
    .then(response => response.json())
    .then(data => {
      if (Array.isArray(data)) {
        // Ordenar las hamburguesas por precio de forma ascendente
        const sortedBurgers = data.sort((a, b) => a.price - b.price);

        // Tomar las 5 hamburguesas más baratas
        const top5Burgers = sortedBurgers.slice(0, 5);

        // Guardar los datos en el localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(top5Burgers));

        // Mostrar las hamburguesas en el DOM
        showBurgers(top5Burgers);
      } else {
        throw new Error("La respuesta de la API no es un array");
      }
    })
    .catch(error => {
      console.log("Error al obtener los datos:", error);
    });
}

function showBurgers(burgers) {
  // Mostrar las 5 hamburguesas más baratas en el DOM
  burgers.forEach(burger => {
    const listItem = document.createElement('li');
    const ingredients = burger.ingredients.map(ingredient => ingredient.name).join(', ');
    listItem.innerHTML = `
      <strong style="color: yellow;">Nombre:</strong> ${burger.name}<br>
      <strong style="color: yellow;">Ingredientes:</strong> ${ingredients}<br>
      <strong style="color: yellow;">Precio: USD </strong> ${burger.price}<br>
      <hr>
    `;
    burgerList.appendChild(listItem);
  });
}






