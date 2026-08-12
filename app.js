document.addEventListener("DOMContentLoaded", () => {
    // =========================================================================
    // 1. VARIABLES DE ESTADO GLOBAL (NUEVAS & MEJORADAS)
    // =========================================================================
    let idEstaVerificado = false;
    let precioUnitarioSeleccionado = 0;
    let cantidadActual = 1;

    // Elementos de la interfaz (Barra inferior y paquetes)
    const paquetes = document.querySelectorAll(".paquete-item");
    const barraInferior = document.getElementById("barra-pago-inferior");
    const footerNombre = document.getElementById("footer-nombre-paquete");
    const footerPrecio = document.getElementById("footer-precio-total");
    const footerImg = document.getElementById("footer-item-img");
    const btnAccionFooter = document.getElementById("btn-accion-footer");

    // Elementos del sistema de verificación de ID
    const btnVerificarPrincipal = document.getElementById("btn-verificar-id-principal");
    const inputPlayerId = document.getElementById("input-player-id");
    const contenedorInputId = document.getElementById("contenedor-input-id");
    const alertaCuentaExito = document.getElementById("alerta-cuenta-exito");
    const btnCerrarAlerta = document.getElementById("btn-cerrar-alerta");

    // Elementos del contador de cantidad (- 1 +)
    const btnSumar = document.getElementById("btn-sumar");
    const btnRestar = document.getElementById("btn-restar");
    const cantidadValor = document.getElementById("cantidad-valor");

    // =========================================================================
    // 2. CÓDIGO DEL REPOSITORIO ANTERIOR / LOGICA EXISTENTE
    // =========================================================================
    // Nota: Si tenías código previo para navegación de pestañas (Tabs),
    // animaciones del menú de navegación o redirecciones, se ejecuta de forma segura aquí.
    const tabButtons = document.querySelectorAll(".tab-btn");
    if (tabButtons.length > 0) {
        tabButtons.forEach(button => {
            button.addEventListener("click", () => {
                tabButtons.forEach(b => b.classList.remove("active"));
                button.classList.add("active");
                // Aquí puedes añadir la lógica si ocultas/muestras diamantes o membresías
            });
        });
    }


    // =========================================================================
    // 3. NUEVA LOGICA: INTERACCIÓN Y SELECCIÓN DE PAQUETES
    // =========================================================================
    if (paquetes.length > 0) {
        paquetes.forEach(paquete => {
            paquete.addEventListener("click", () => {
                // Quitar selección previa de la lista
                paquetes.forEach(p => p.classList.remove("selected"));

                // Activar visualmente el paquete seleccionado
                paquete.classList.add("selected");

                // Extraer datos del HTML (data-attributes)
                const nombrePack = paquete.getAttribute("data-paquete");
                const precioRaw = paquete.getAttribute("data-precio");
                const rutaImg = paquete.getAttribute("data-imagen");

                // Convertir precio a número plano para el cálculo matemático
                precioUnitarioSeleccionado = parseFloat(precioRaw.replace(",", "."));
                
                // Resetear cantidad a 1 cada vez que se cambia de paquete
                cantidadActual = 1; 
                if (cantidadValor) cantidadValor.textContent = cantidadActual;

                // Inyectar datos dinámicos en la barra inferior
                if (footerNombre) footerNombre.textContent = nombrePack;
                if (footerImg) footerImg.src = rutaImg;
                
                actualizarCalculoTotal();

                // Mostrar la barra inferior en pantalla (Estado Inicial: ROJO)
                if (barraInferior) barraInferior.style.display = "flex";
            });
        });
    }

    // =========================================================================
    // 4. NUEVA LOGICA: CONTADOR MATEMÁTICO (- 1 +)
    // =========================================================================
    if (btnSumar && btnRestar && cantidadValor) {
        btnSumar.addEventListener("click", (e) => {
            e.stopPropagation(); // Evita interferir con los clics del contenedor
            cantidadActual++;
            cantidadValor.textContent = cantidadActual;
            actualizarCalculoTotal();
        });

        btnRestar.addEventListener("click", (e) => {
            e.stopPropagation();
            if (cantidadActual > 1) {
                cantidadActual--;
                cantidadValor.textContent = cantidadActual;
                actualizarCalculoTotal();
            }
        });
    }

    function actualizarCalculoTotal() {
        if (!footerPrecio) return;
        const totalCalculado = (precioUnitarioSeleccionado * cantidadActual).toFixed(2);
        // Formatear de vuelta con coma para mantener la consistencia visual de tu tienda
        footerPrecio.textContent = `$ ${totalCalculado.replace(".", ",")}`;
    }

    // =========================================================================
    // 5. NUEVA LOGICA: MUTACIÓN DINÁMICA A MODO AMARILLO (ID VERIFICADO)
    // =========================================================================
    function activarInterfazModoVerificado() {
        idEstaVerificado = true;
        
        // Agregar la clase de control al body para que el CSS cambie el borde a AMARILLO
        document.body.classList.add("id-verificado-valido");

        // Mutar visualmente el botón inferior de la barra de pagos
        if (btnAccionFooter) {
            btnAccionFooter.textContent = "SIGUIENTE >";
            btnAccionFooter.className = "btn-footer-amarillo-siguiente";
        }
    }

    // Al presionar el botón "VERIFICAR" en la sección de arriba
    if (btnVerificarPrincipal) {
        btnVerificarPrincipal.addEventListener("click", () => {
            if (inputPlayerId && inputPlayerId.value.trim() !== "") {
                if (contenedorInputId) contenedorInputId.style.display = "none";
                if (alertaCuentaExito) alertaCuentaExito.style.display = "flex";
                activarInterfazModoVerificado();
            } else {
                alert("Por favor, ingresa un ID válido antes de continuar.");
            }
        });
    }

    // Al presionar el botón de la barra inferior (Comportamiento inteligente de apoyo)
    if (btnAccionFooter) {
        btnAccionFooter.addEventListener("click", () => {
            if (!idEstaVerificado) {
                // Si el usuario da clic abajo sin verificar arriba, auto-verificamos con el ID de prueba de tu captura
                if (inputPlayerId) inputPlayerId.value = "344675051";
                if (contenedorInputId) contenedorInputId.style.display = "none";
                if (alertaCuentaExito) alertaCuentaExito.style.display = "flex";
                activarInterfazModoVerificado();
            } else {
                // Lógica final de envío: Aquí colocarás el enlace a tu WhatsApp o pasarela de pago
                alert("Abriendo pasarela de pago para finalizar tu pedido...");
            }
        });
    }

    // Botón para cerrar la alerta verde y restaurar el flujo inicial a modo ROJO
    if (btnCerrarAlerta) {
        btnCerrarAlerta.addEventListener("click", () => {
            idEstaVerificado = false;
            document.body.classList.remove("id-verificado-valido");
            if (alertaCuentaExito) alertaCuentaExito.style.display = "none";
            if (contenedorInputId) contenedorInputId.style.display = "flex";
            if (btnAccionFooter) {
                btnAccionFooter.textContent = "VERIFICAR ID >";
                btnAccionFooter.className = "btn-footer-rojo";
            }
        });
    }
});
