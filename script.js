export default class Carrito {
   
    constructor() {
        this.productos = new Map(); //En vez de indicar que this.productos es un array, lo declaramos como Map. Nos permite almacenar una colección asociando cada elemento a una clave específica (SKU) en vez de a un índice
        //Además tiene ciertos métodos que nos facilitan su manipulación (como set, get, has)
        this.moneda = "";
    }

    actualizarUnidades(SKU, unidades) {
        if (this.productos.has(SKU)) {
            const prod = this.productos.get(SKU);
            if (typeof unidades === 'number' && !isNaN(unidades)) { //Nos aseguramos que unidades sea un numero
                prod.quantity = unidades;
                this.productos.set(SKU, prod);
                return "Unidades actualizadas"
            } else {
                prod.quantity = 0;
            }
        } else {
            return "Producto no existe en el carrito"
        }
    }

    obtenerInformacionProducto(SKU) {
        if (this.productos.has(SKU)) {
            const prod = this.productos.get(SKU);
            return { //Usamos la desestructuración de un objeto para poder acceder solo a cierta propiedad más adelante. 
                titulo: prod.title,
                unidades: prod.quantity,
                precio: prod.price
                };
         }else {
                return "Producto no existe en el carrito";
         }

    }

    obtenerCarrito() {
            let total = 0;
            const carrito = [];
            this.productos.forEach((producto) => { //Recorremos this.productos y todo prodcuto que tenga cantidad superior a 0 lo añadimos al array carrito
                if (producto.quantity > 0) {
                    carrito.push(producto);
                    total += parseFloat(producto.price) * producto.quantity; //Vamos acumulando el precio
                }
            });
        return { //Usamos la desestructuración de un objeto para poder acceder solo a cierta propiedad más adelante. En este caso devolvemos un objeto con dos propiedades
            productos: carrito, //Propiedad que contiene el array de prodcutos
            total: `${total.toFixed(2)}`  //Propiedad que contiene el precio total          
            } 

    }

    calcularTotal(SKU) {
         if (this.productos.has(SKU)) {
            const producto = this.productos.get(SKU);
            return (parseFloat(producto.price) * producto.quantity).toFixed(2);
        }
            return "0";
    }
        

}

document.addEventListener('DOMContentLoaded', function (event) {
    
    function cargarTabla(productos, moneda, miCarrito) {
        const tablaProducts = document.getElementById("tablaProductos");
        productos.forEach(producto => {

            //CELDA PRODUCTO: creamos la celda producto, dentro de ella un div que contendrá 2 párrafos a los que les pasaremos el SKUproducto y el nombre(título)
            const prod = document.createElement('td');
            const divCabecera = document.createElement('div');
            const parrTitle = document.createElement('p');
            const parrSku = document.createElement('p');
            parrSku.classList.add('parrSku');
            parrTitle.classList.add('parrTitle');
            
            parrTitle.textContent = producto.title;
            parrSku.textContent = producto.SKU;
            divCabecera.append(parrTitle, parrSku);
            prod.appendChild(divCabecera);
           

            //CELDA PRECIO
            const precio = document.createElement('td');
            precio.innerText = producto.price + moneda;

            //CELDA CANTIDAD + BOTONES: Creamos la celda cantidad, dentro de ella un div que contendrá los btn y el input
            const unidades = document.createElement('td');
            const divBtnCant = document.createElement('div');
            divBtnCant.classList.add('contenedor-BtnCant');
           
            //Botones + Input
            const btnDecr = document.createElement('button');
            btnDecr.innerText = '-';
            btnDecr.classList.add('btn-decre');
            
            const cantidad = document.createElement('input')
            cantidad.type = 'number';
            cantidad.value = producto.quantity || 0; //Indicamos que la cantidad inicial es 0.
            cantidad.classList.add('cantidad-input');

            const btnIncr = document.createElement('button');
            btnIncr.innerText = '+';
            btnIncr.classList.add('btn-incre');

            //Funcionalidad btn y input:
            
            btnDecr.addEventListener('click',()=> { //Cuando suceda un evento click en btnDecr queremos que se ejecute lo siguiente:
                const nuevaCant = Math.max(0,parseInt(cantidad.value) - 1); //Usamos Math.max para asegurarnos que no disminuye de 0. Porque siempre devolverá el número mayor y siempre que el otro sea negativo devolverá 0.
                cantidad.value = nuevaCant; //Usamos parseInt para convertir el valor de cantidad a int.
                miCarrito.actualizarUnidades(producto.SKU, nuevaCant);
                total.innerText = `${miCarrito.calcularTotal(producto.SKU)} ${moneda}`;

                cargarCarrito(miCarrito, moneda); //Pasamos la información actualizada a la función cargarCarrito para que se ejecute si cumple los requisitos.
            });

            cantidad.addEventListener('click', () => { //Cuando hacemos click en el input para escribir nueva cantidad, se pone la casilla en blanco
                const nuevaCant = '';
                cantidad.value = nuevaCant; //Esta variable no queremos convertirla a número por ejemplo.
                miCarrito.actualizarUnidades(producto.SKU, nuevaCant);
                total.innerText = `${miCarrito.calcularTotal(producto.SKU)} ${moneda}`;
                cargarCarrito(miCarrito, moneda);
            });

            cantidad.addEventListener('blur', () => { //Cuando quitamos el foco en esa casilla queremos que:
                if (!isNaN(cantidad.value) && cantidad.value !== '') { //SI es un número, se mantenga esa cantidad
                     const nuevaCant = parseInt(cantidad.value, 10); //Indicamos que es un número de base decimal para que se puedan realizar correctamente los cálculos
                     miCarrito.actualizarUnidades(producto.SKU, nuevaCant);
                     cantidad.value = nuevaCant; 
                    
                } else { //Pero cuando no lo sea, se ponga la casilla a 0.
                    cantidad.value = 0;
                    miCarrito.actualizarUnidades(producto.SKU, 0);
                    
                }
                total.innerText = `${miCarrito.calcularTotal(producto.SKU)} ${moneda}`;
                cargarCarrito(miCarrito, moneda);
            });

            cantidad.addEventListener('input', () => { //Cuando modifiquemos el contenido de input
                // Verificamos si el valor del input es un número y si lo es realizamos la actualización de unidades.
                if (!isNaN(cantidad.value) && cantidad.value !== '') {
                    const nuevaCant = Math.max(0, parseInt(cantidad.value)) || 0; // Impedimos que sea inferior de 0
                    miCarrito.actualizarUnidades(producto.SKU, nuevaCant);
                    total.innerText = `${miCarrito.calcularTotal(producto.SKU)} ${moneda}`;
                    cargarCarrito(miCarrito, moneda);
                } else {
                    // En cambio si no lo es usamos una expresión regular para substituir cualquier carácter no numérico por una cadena una en blanco (para que se resetee la casilla automáticamente). y actualiza el carrito.
                    cantidad.value = cantidad.value.replace(/[^0-9]/g, '');
                    miCarrito.actualizarUnidades(producto.SKU, cantidad.value);
                    total.innerText = `${miCarrito.calcularTotal(producto.SKU)} ${moneda}`;
                    cargarCarrito(miCarrito, moneda);
                    
                    
                }
            });
            

            btnIncr.addEventListener('click', () => {
                const nuevaCant = parseInt(cantidad.value) + 1;
                cantidad.value = nuevaCant;
                miCarrito.actualizarUnidades(producto.SKU, nuevaCant);
                total.innerText = `${miCarrito.calcularTotal(producto.SKU)} ${moneda}`;

                cargarCarrito(miCarrito, moneda);
            });
            

            //Los añadimos a la celda:
            divBtnCant.append(btnDecr, cantidad, btnIncr);
            unidades.appendChild(divBtnCant);


            //CELDA TOTAL
            const total = document.createElement('td');
            total.innerText = (miCarrito.calcularTotal(producto.SKU)) +" "+ moneda; //Como la cantidad inicial del producto es 0, el total inicial es 0.00



            //CARGAR FILA + TABLA
            const tr = document.createElement('tr');
            tr.append(prod, precio, unidades, total); 
            tablaProducts.append(tr);
        })
    }

    function cargarCarrito(miCarrito, moneda) {
        const contenedorProductosCarrito = document.getElementById("productosCarrito");
        const contenedorTotalFinal = document.getElementById("totalFinal");

        // Limpiar el contenido del carrito antes de cargar los productos para evitar que se dupliquen cada vez que se actualice el carrito
        contenedorProductosCarrito.innerHTML = '';
        
        // Obtenemos la información del carrito
        const { productos, total } = miCarrito.obtenerCarrito(); //Se usa la desestructuración para poder crear varibales y al mismo tiempo asignarles el contenido que te facilita miCarrito.obtenerCarrito

        
        productos.forEach(producto => {
            const itemCarrito = document.createElement('div');
            itemCarrito.classList.add('item-carrito');
            const parte1div = document.createElement('div');
            parte1div.classList.add('part-1');
            const parte2div = document.createElement('div');
            parte2div.classList.add('part-2');

            const {titulo, unidades, precio} = miCarrito.obtenerInformacionProducto(producto.SKU);
            parte1div.innerText = unidades +" "+ 'x' +" " + titulo;
            parte2div.innerText = unidades +" " + 'x' +" " + precio + moneda;

            itemCarrito.append(parte1div, parte2div);
            contenedorProductosCarrito.appendChild(itemCarrito);
        });

        // Actualizar el total final en el contenedor del total
        contenedorTotalFinal.innerText = `${total}${moneda}`;
    }
    
    
    const miCarrito = new Carrito;
    
    fetch('https://jsonblob.com/api/1300466049122951168')
        .then(response => response.json())
        .then(data => {
            // Creamos dos variables para acceder al valor de las propiedades: products y currency del objeto JSON. 
            const moneda = data.currency;
            const productos = data.products;

            //Asignamos un valor a la propiedad moneda de nuestro carrito (obtenido de la API)
            miCarrito.moneda = moneda;


            // Recorremos el array productos del JSOn y añadimos cada producto encontrado a la propiedad productos de miCarrito.
            productos.forEach(producto => {
                    miCarrito.productos.set(producto.SKU, { ...producto, quantity: 0 }); 
            }); //Añadimos cada producto utilizando SKU como clave.
            //...producto: copia todas las propiedades del objeto producto.
            //añadimos una nueva propiedad con valor 0. 

            
            //Llamamos a la función y le pasamos los datos obtenidos:
            cargarTabla(productos, moneda, miCarrito);

        
        })
        .catch(error => console.error('Error al obtener los productos:', error));

    
});
