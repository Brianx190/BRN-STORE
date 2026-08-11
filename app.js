
// Claves y Configuración del Carrito
const cartKey = 'brnCartCount';
const cartItemsKey = 'brnCartItems';

let cartCount = Number(localStorage.getItem(cartKey)) || 0;
let savedItems = JSON.parse(localStorage.getItem(cartItemsKey)) || [];

const count = document.getElementById('cartCount');
const toast = document.getElementById('toast');
const overlay = document.getElementById('cartOverlay');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');

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

function openCart() {
  updateCart();
  if (overlay) {
    overlay.classList.add('show');
    overlay.style.display = 'flex';
  }
}

function closeCart() {
  if (overlay) {
    overlay.classList.remove('show');
    overlay.style.display = 'none';
  }
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

const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');

if (menuBtn && mobileMenu) {
  menuBtn.addEventListener('click', () => {
    mobileMenu.style.display = mobileMenu.style.display === 'none' ? 'block' : 'none';
  });
}

document.getElementById('searchBtn')?.addEventListener('click', () => {
  const juegosSection = document.getElementById('juegos');
  if (juegosSection) {
    juegosSection.scrollIntoView({ behavior: 'smooth' });
    showToast('Aquí añadiremos el buscador 🔎');
  }
});

// --- MOVIMIENTO AUTOMÁTICO DE LOS BANNERS LIMPIOS ---
let currentSlide = 0;
const bannerTrack = document.getElementById('bannerTrack');

if (bannerTrack) {
  setInterval(() => {
    if (currentSlide === 0) {
      bannerTrack.style.transform = 'translateX(-50%)';
      currentSlide = 1;
    } else {
      bannerTrack.style.transform = 'translateX(0%)';
      currentSlide = 0;
    }
  }, 4000); // Se desplaza automáticamente cada 4 segundos
}

document.addEventListener('DOMContentLoaded', () => {
  updateCart();
});
