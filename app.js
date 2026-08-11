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
  if (count) count.textContent = cartCount;
  if (cartTotal) cartTotal.textContent = cartCount; 
  
  localStorage.setItem(cartKey, cartCount);
  localStorage.setItem(cartItemsKey, JSON.stringify(savedItems));
  
  if (!cartItems) return;

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
document.querySelectorAll('.game-card').forEach(card => {
  card.addEventListener('click', () => {
    const productName = card.dataset.product || card.querySelector('h3')?.textContent || 'Producto';
    
    cartCount++;
    savedItems.push(productName);
    
    updateCart();
    showToast(`¡Añadido: ${productName}! 🚀`);
  });
});

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
  if (overlay) overlay.style.display = 'flex';
}

function closeCart() {
  if (overlay) overlay.classList.remove('show');
  if (overlay) overlay.style.display = 'none';
}

function showToast(text) {
  if (!toast) return;
  toast.textContent = text;
  toast.style.display = 'block';
  
  setTimeout(() => {
    toast.style.display = 'none';
  }, 3000);
}

document.getElementById('cartBtn')?.addEventListener('click', openCart);
document.getElementById('closeCart')?.addEventListener('click', closeCart);

overlay?.addEventListener('click', (e) => {
  if (e.target === overlay) closeCart();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeCart();
});

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
    if (mobileMenu.style.display === 'none') {
      mobileMenu.style.display = 'block';
    } else {
      mobileMenu.style.display = 'none';
    }
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

// --- 6. SISTEMA DE BANNER AUTOMÁTICO (SLIDER) ---
let currentSlide = 0;
const bannerTrack = document.getElementById('bannerTrack');
const dot1 = document.getElementById('dot1');
const dot2 = document.getElementById('dot2');

if (bannerTrack && dot1 && dot2) {
  setInterval(() => {
    if (currentSlide === 0) {
      bannerTrack.style.transform = 'translateX(-50%)';
      dot1.classList.remove('active');
      dot2.classList.add('active');
      currentSlide = 1;
    } else {
      bannerTrack.style.transform = 'translateX(0%)';
      dot2.classList.remove('active');
      dot1.classList.add('active');
      currentSlide = 0;
    }
  }, 4000); // Cambia cada 4 segundos de forma automática
}

document.addEventListener('DOMContentLoaded', () => {
  updateCart();
});
