const games=[
 {name:"Free Fire",region:"LATAM",cls:"ff",packages:[["100 + 10 Diamantes",0.90],["310 + 31 Diamantes",2.71],["520 + 52 Diamantes",4.45],["1060 + 106 Diamantes",8.80]]},
 {name:"Blood Strike",region:"GLOBAL",cls:"bs",packages:[["100 Gold",0.99],["500 Gold",4.49],["1000 Gold",8.49]]},
 {name:"Call of Duty: Mobile",region:"GLOBAL",cls:"cod",packages:[["80 CP",0.99],["420 CP",4.99],["880 CP",9.49]]},
 {name:"Mobile Legends",region:"GLOBAL",cls:"ml",packages:[["86 Diamonds",1.19],["172 Diamonds",2.29],["257 Diamonds",3.39]]}
];
const gifts=[["Apple Gift Card","$10"],["PlayStation Gift Card","$10"],["Xbox Gift Card","$10"]];
let cart=JSON.parse(localStorage.getItem("brn_cart")||"[]");
let orders=JSON.parse(localStorage.getItem("brn_orders")||"[]");
let current=null;

const $=id=>document.getElementById(id);
function money(n){return "$"+n.toFixed(2)}
function renderGames(){
 $("gameGrid").innerHTML=games.map((g,i)=>`<article class="game"><div class="art ${g.cls}">${g.name.toUpperCase()}</div><h3>${g.name}</h3><p>${g.region}</p><button onclick="openProduct(${i})">VER RECARGAS</button></article>`).join("");
 $("giftGrid").innerHTML=gifts.map(g=>`<div class="gift">${g[0]} · ${g[1]}</div>`).join("");
}
function openProduct(i){
 current=i; const g=games[i]; $("modalTitle").textContent=g.name;
 $("modalDesc").textContent="Selecciona una cantidad y coloca el ID del jugador.";
 $("packageSelect").innerHTML=g.packages.map((p,j)=>`<option value="${j}">${p[0]} — ${money(p[1])}</option>`).join("");
 $("playerId").value=""; updatePrice(); $("productModal").classList.remove("hidden");
}
function updatePrice(){if(current!==null){const p=games[current].packages[$("packageSelect").value];$("modalPrice").textContent=money(p[1])}}
$("packageSelect").addEventListener("change",updatePrice);
$("addBtn").onclick=()=>{
 const id=$("playerId").value.trim(); if(!id){alert("Coloca el ID del jugador.");return}
 const p=games[current].packages[$("packageSelect").value];
 cart.push({game:games[current].name,package:p[0],player:id,price:p[1]});
 localStorage.setItem("brn_cart",JSON.stringify(cart)); $("productModal").classList.add("hidden"); updateCart();
};
function updateCart(){ $("cartCount").textContent=cart.length; }
function renderCart(){
 if(!cart.length){$("cartItems").innerHTML='<p class="muted">Tu carrito está vacío.</p>'}
 else $("cartItems").innerHTML=cart.map((x,i)=>`<div class="cartrow"><div><b>${x.game}</b><br><small>${x.package} · ID ${x.player}</small></div><div>${money(x.price)} <button class="remove" onclick="removeCart(${i})">×</button></div></div>`).join("");
 const total=cart.reduce((a,x)=>a+x.price,0);$("cartTotal").textContent=money(total);
}
function removeCart(i){cart.splice(i,1);localStorage.setItem("brn_cart",JSON.stringify(cart));renderCart();updateCart()}
$("cartBtn").onclick=()=>{renderCart();$("cartModal").classList.remove("hidden")};
$("checkoutBtn").onclick=()=>{
 if(!cart.length)return alert("Tu carrito está vacío.");
 orders.unshift({id:"BRN-"+Date.now().toString().slice(-6),date:new Date().toLocaleString(),items:cart,total:cart.reduce((a,x)=>a+x.price,0),status:"Pendiente de pago"});
 localStorage.setItem("brn_orders",JSON.stringify(orders));cart=[];localStorage.setItem("brn_cart","[]");updateCart();renderOrders();$("cartModal").classList.add("hidden");alert("Pedido creado. El siguiente paso será conectar el pago real.");
};
function renderOrders(){
 const logged=localStorage.getItem("brn_user");
 if(!logged){$("orders").innerHTML='<p class="muted">Inicia sesión para consultar tus pedidos.</p>';return}
 if(!orders.length){$("orders").innerHTML='<p class="muted">Todavía no tienes pedidos.</p>';return}
 $("orders").innerHTML=orders.map(o=>`<div class="order"><span><b>${o.id}</b><br><small>${o.date} · ${o.status}</small></span><b>${money(o.total)}</b></div>`).join("");
}
$("loginBtn").onclick=()=>{$("loginModal").classList.remove("hidden")};
$("saveLogin").onclick=()=>{
 const email=$("email").value.trim(); if(!email)return alert("Coloca tu correo.");
 localStorage.setItem("brn_user",email); $("loginModal").classList.add("hidden"); $("loginBtn").textContent="MI CUENTA"; renderOrders();
};
document.querySelectorAll("[data-close]").forEach(b=>b.onclick=()=>b.closest(".modal").classList.add("hidden"));
renderGames();updateCart();renderOrders();