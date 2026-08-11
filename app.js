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
    ? `<div class="cart-item"><span>🎮 Producto seleccionado</span><b>x${cartCount}</b></div><p class="cart-note">Tus productos aparecerán aquí. Próximamente conectaremos el pago y la entrega automática.</p>`
    : '<div class="empty-cart">Tu carrito está vacío 🛒</div>';
}
function openCart(){updateCart();overlay.classList.add('show');document.body.classList.add('no-scroll')}
function closeCart(){overlay.classList.remove('show');document.body.classList.remove('no-scroll')}
function showToast(text){toast.textContent=text;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),1800)}

document.getElementById('cartBtn').addEventListener('click',openCart);
document.getElementById('closeCart').addEventListener('click',closeCart);
overlay.addEventListener('click',e=>{if(e.target===overlay)closeCart()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeCart()});

document.querySelectorAll('.game-card').forEach(card=>{
  card.addEventListener('click',()=>{
    const product=card.dataset.product;
    if(product){cartCount++;updateCart();showToast(product+' seleccionado 🛒')}
  });
});

document.getElementById('checkoutBtn').addEventListener('click',()=>{
  if(!cartCount){showToast('Tu carrito está vacío 🛒');return}
  showToast('Siguiente paso: configurar el pago 💙');
});

// Menú móvil
const menuBtn=document.getElementById('menuBtn');
const mobileMenu=document.getElementById('mobileMenu');
menuBtn.addEventListener('click',()=>mobileMenu.classList.toggle('show'));
mobileMenu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>mobileMenu.classList.remove('show')));

// Búsqueda: por ahora lleva al apartado de juegos y deja preparado el punto para añadir buscador real.
document.getElementById('searchBtn').addEventListener('click',()=>{
  document.getElementById('juegos').scrollIntoView({behavior:'smooth'});
  showToast('Aquí añadiremos el buscador 🔎');
});

// Carrusel de eventos
const eventCards=[...document.querySelectorAll('.event-card')];
const eventDots=document.getElementById('eventDots');
let eventIndex=1;

eventCards.forEach((_,i)=>{
  const dot=document.createElement('button');
  dot.className='event-dot'+(i===eventIndex?' active':'');
  dot.setAttribute('aria-label','Mostrar evento '+(i+1));
  dot.addEventListener('click',()=>setEvent(i));
  eventDots.appendChild(dot);
});
function setEvent(index){
  eventIndex=(index+eventCards.length)%eventCards.length;
  eventCards.forEach((card,i)=>card.classList.toggle('active',i===eventIndex));
  const dots=[...eventDots.children];
  dots.forEach((dot,i)=>dot.classList.toggle('active',i===eventIndex));
  const track=document.getElementById('eventTrack');
  if(window.innerWidth<=800){
    const cardWidth=eventCards[0].getBoundingClientRect().width+10;
    track.style.transform=`translateX(calc(50% - ${(eventIndex+.5)*cardWidth}px))`;
  }else{
    const cardWidth=eventCards[0].getBoundingClientRect().width+24;
    track.style.transform=`translateX(calc(50% - ${(eventIndex+.5)*cardWidth}px))`;
  }
}
document.getElementById('prevEvent').addEventListener('click',()=>setEvent(eventIndex-1));
document.getElementById('nextEvent').addEventListener('click',()=>setEvent(eventIndex+1));
setTimeout(()=>setEvent(eventIndex),50);
window.addEventListener('resize',()=>setEvent(eventIndex));
setInterval(()=>setEvent(eventIndex+1),6500);

updateCart();
