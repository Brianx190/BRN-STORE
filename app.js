const cartKey='brnCartCount';
let cartCount=Number(localStorage.getItem(cartKey)||0);
const count=document.getElementById('cartCount');
const toast=document.getElementById('toast');
const overlay=document.getElementById('cartOverlay');
const cartItems=document.getElementById('cartItems');
const cartTotal=document.getElementById('cartTotal');

function updateCart(){
  count.textContent=cartCount;
  cartTotal.textContent=cartCount;
  localStorage.setItem(cartKey,cartCount);
  cartItems.innerHTML=cartCount
    ? `<div class="cart-item"><span>🔥 Free Fire</span><b>x${cartCount}</b></div><p class="cart-note">Tus productos aparecerán aquí. Próximamente conectaremos el pago y la entrega automática.</p>`
    : '<div class="empty-cart">Tu carrito está vacío 🛒</div>';
}
function openCart(){ updateCart(); overlay.classList.add('show'); document.body.classList.add('no-scroll'); }
function closeCart(){ overlay.classList.remove('show'); document.body.classList.remove('no-scroll'); }
function showToast(text){
  toast.textContent=text;
  toast.classList.add('show');
  setTimeout(()=>toast.classList.remove('show'),1800);
}

document.getElementById('cartBtn').addEventListener('click',openCart);
document.getElementById('closeCart').addEventListener('click',closeCart);
overlay.addEventListener('click',e=>{if(e.target===overlay)closeCart();});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeCart();});

document.querySelectorAll('.product-btn[data-product]').forEach(btn=>{
  btn.addEventListener('click',()=>{
    cartCount++;
    updateCart();
    showToast(btn.dataset.product+' añadido al carrito 🛒');
  });
});

document.getElementById('checkoutBtn').addEventListener('click',()=>{
  if(!cartCount){ showToast('Tu carrito está vacío 🛒'); return; }
  showToast('Siguiente paso: configurar el pago 💙');
});

document.getElementById('whatsappBtn').addEventListener('click',e=>{
  e.preventDefault();
  showToast('Aquí pondremos tu WhatsApp 💙');
});

updateCart();
