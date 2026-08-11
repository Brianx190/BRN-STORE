// Claves y Configuración del Carrito
const cartKey = 'brnCartCount';
const cartItemsKey = 'brnCartItems';

// Intentar recuperar los datos guardados en LocalStorage (si existen)
let cartCount = Number(localStorage.getItem(cartKey)) || 0;
let savedItems = JSON.parse(localStorage.getItem(cartItemsKey)) || [];

// Selección de Elementos del DOM del Carrito
const count = document.getElementById('cartCount');
const toast = document.getElementById('toast');
const overlay = document.getElementById('cartOverlay');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');

// --- 1. FUNCIÓN PRINCIPAL: ACTUALIZAR EL CARRITO ---
function updateCart() {
  // Actualizar los contadores visuales en la interfaz
  if (count) count.textContent = cartCount;
  if (cartTotal) cartTotal.textContent = cartCount; // Muestra la cantidad total por ahora
  
  // Guardar cantidad actual en LocalStorage
  localStorage.setItem(cartKey, cartCount);
  localStorage.setItem(cartItemsKey, JSON.stringify(savedItems));
  
  // Validar si el contenedor de los items existe en el HTML
  if (!cartItems) return;

  // Renderizar la lista de productos de forma dinámica
  if (savedItems.length > 0) {
    cartItems.innerHTML = savedItems.map(item => `
      <div class="cart-item" style="display:flex; justify-content:space-between; align-items:center; padding:10px; border-bottom:1px solid #1a1f2c;">
        <span>🎮 ${item}</span>
        <button class="btn-remove" onclick="removeProduct('${item}')" style="background:transparent; border:none; color:#0066ff; cursor:pointer;"><i class="fas fa-trash"></i></button>
      </div>
    `).join('');
  } else {
    cartItems.innerHTML = `<div class="empty-cart">Tu carrito está vacío 🛒</div>`;
  }
}

// --- 2. LOGICÁ DE INTERACCIÓN: AGREGAR Y ELIMINAR ---
// Evento para capturar el clic en las tarjetas de juego (.game-card)
document.querySelectorAll('.game-card').forEach(card => {
  card.addEventListener('click', () => {
    // Si tienes un atributo 'data-product' en tu HTML lo lee, si no, toma el texto del título h3 de la tarjeta
    const productName = card.dataset.product || card.querySelector('h3')?.textContent || 'Producto';
    
    cartCount++;
    savedItems.push(productName);
    
    updateCart();
    showToast(`¡Añadido: ${productName}! 🚀`);
  });
});

// Función para remover un producto individual desde el carrito
window.removeProduct = function(productName) {
  const index = savedItems.indexOf(productName);
  if (index > -1) {
    savedItems.splice(index, 1);
    cartCount--;
    updateCart();
    showToast(`Eliminado: ${productName}`);
  }
};

// --- 3. FUNCIONES DE INTERFAZ (ABRIR, CERRAR Y NOTIFICACIONES) ---
function openCart() {
  updateCart();
  if (overlay) overlay.classList.add('show');
}

function closeCart() {
  if (overlay) overlay.classList.remove('show');
}

function showToast(text) {
  if (!toast) return;
  toast.textContent = text;
  toast.classList.add('show');
  
  // Quitar la notificación después de 3 segundos
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// Escuchadores de eventos para los botones de abrir/cerrar carrito
document.getElementById('cartBtn')?.addEventListener('click', openCart);
document.getElementById('closeCart')?.addEventListener('click', closeCart);

// Cerrar carrito al hacer clic fuera del contenedor (en el fondo oscuro)
overlay?.addEventListener('click', (e) => {
  if (e.target === overlay) closeCart();
});

// Cerrar carrito presionando la tecla Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeCart();
});

// Botón de Checkout / Pagar
document.getElementById('checkoutBtn')?.addEventListener('click', () => {
  if (!cartCount) {
    showToast('Tu carrito está vacío 🛒');
    return;
  }
  showToast('Siguiente paso: configurar el pago 💙');
});

// --- 4. SECCIÓN MENÚ MÓVIL ---
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');

if (menuBtn && mobileMenu) {
  menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('show');
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('show');
    });
  });
}

// --- 5. SECCIÓN DE BÚSQUEDA ---
document.getElementById('searchBtn')?.addEventListener('click', () => {
  const juegosSection = document.getElementById('juegos');
  if (juegosSection) {
    juegosSection.scrollIntoView({ behavior: 'smooth' });
    showToast('Aquí añadiremos el buscador 🔎');
  }
});

// Inicializar el estado del carrito al cargar la página por primera vez
document.addEventListener('DOMContentLoaded', () => {
  updateCart();
});
