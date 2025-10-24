/**********************************************************
 * PRODUTOS
 **********************************************************/
const produtos = [
  {
    id: "casillero-cabernet",
    nome: "Casillero del Diablo Cabernet Sauvignon",
    marca: "Concha y Toro",
    tipo: "Tinto Seco",
    volume: "750ml",
    teor: "13,5% vol",
    avaliacao: 4.7,
    avaliacoesQtd: 1287,
    precoOriginal: 99.90,
    desconto: true,
    descricaoCurta: "Tinto chileno encorpado, notas de frutas escuras e toque de carvalho.",
    descricaoLonga:
      "Equilíbrio entre corpo, taninos macios e aromas de amora, ameixa e baunilha. Ideal para carnes vermelhas e queijos curados.",
    imagem: "https://loja.vinicolaaurora.com.br/cdn/shop/files/VinhoCountryWineBordoSuave-1Litro.png?v=1755364408"
  },
  {
    id: "miolo-reserva-merlot",
    nome: "Miolo Reserva Merlot",
    marca: "Miolo",
    tipo: "Tinto Fino Seco",
    volume: "750ml",
    teor: "13% vol",
    avaliacao: 4.5,
    avaliacoesQtd: 642,
    precoOriginal: 64.50,
    desconto: false,
    descricaoCurta: "Macio e aromático, destaque brasileiro do Vale dos Vinhedos.",
    descricaoLonga:
      "Notas de frutas vermelhas maduras e leve toque de especiarias. Muito agradável para o dia a dia.",
    imagem: "https://loja.vinicolaaurora.com.br/cdn/shop/files/VinhoCountryWineBordoSuave-1Litro.png?v=1755364408"
  },
  {
    id: "salton-espumante-brut",
    nome: "Salton Espumante Brut",
    marca: "Salton",
    tipo: "Brut",
    volume: "750ml",
    teor: "11,5% vol",
    avaliacao: 4.8,
    avaliacoesQtd: 982,
    precoOriginal: 59.90,
    desconto: true,
    descricaoCurta: "Refrescante, perlage fina e aromas cítricos e florais.",
    descricaoLonga:
      "Equilíbrio entre acidez e frescor, com final leve e elegante. Ideal para comemorações.",
    imagem: "https://loja.vinicolaaurora.com.br/cdn/shop/files/VinhoCountryWineBordoSuave-1Litro.png?v=1755364408"
  },
  {
    id: "rose-provence",
    nome: "Rosé Provence Importado",
    marca: "Côtes de Provence",
    tipo: "Rosé Seco",
    volume: "750ml",
    teor: "12,5% vol",
    avaliacao: 4.6,
    avaliacoesQtd: 314,
    precoOriginal: 89.00,
    desconto: false,
    descricaoCurta: "Rosé francês leve, floral e refrescante. Ideal para dias quentes.",
    descricaoLonga:
      "Notas florais delicadas, frutas vermelhas frescas e final limpo. Perfeito para momentos ao ar livre.",
    imagem: "https://loja.vinicolaaurora.com.br/cdn/shop/files/VinhoCountryWineBordoSuave-1Litro.png?v=1755364408"
  }
];

/**********************************************************
 * FUNÇÕES AUXILIARES
 **********************************************************/
function precoComDesconto(prod) {
  return prod.desconto ? prod.precoOriginal * 0.8 : prod.precoOriginal;
}
function formatarPreco(v) {
  return `R$ ${v.toFixed(2).replace('.', ',')}`;
}
function gerarEstrelas(av) {
  const full = Math.floor(av);
  return "★".repeat(full) + "☆".repeat(5 - full);
}

// Som ping
const audioPing = new Audio("https://cdn.pixabay.com/download/audio/2022/03/15/audio_eb646f5ac5.mp3?filename=ping-82822.mp3");

/**********************************************************
 * CARRINHO
 **********************************************************/
let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

function contarItensCarrinho() {
  return carrinho.reduce((acc, item) => acc + item.qtd, 0);
}
function atualizarTodosContadores() {
  const total = contarItensCarrinho();
  document.getElementById("cart-count")?.textContent = total;
  document.getElementById("cart-count-float")?.textContent = total;
}
function salvarCarrinho() {
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
  atualizarTodosContadores();
}
function adicionarAoCarrinhoPorID(id) {
  const prod = produtos.find(p => p.id === id);
  if (!prod) return;
  const existente = carrinho.find(p => p.id === id);
  if (existente) existente.qtd++;
  else carrinho.push({ id, nome: prod.nome, preco: precoComDesconto(prod), imagem: prod.imagem, qtd: 1 });
  salvarCarrinho();
  renderCarrinho();
  mostrarToast(`${prod.nome} adicionado ao carrinho!`);
  audioPing.currentTime = 0; audioPing.play().catch(()=>{});
}
function mudarQuantidade(id, delta) {
  const item = carrinho.find(p => p.id === id);
  if (!item) return;
  item.qtd += delta;
  if (item.qtd <= 0) carrinho = carrinho.filter(p => p.id !== id);
  salvarCarrinho();
  renderCarrinho();
}

/**********************************************************
 * MODAL CARRINHO
 **********************************************************/
function configurarModalCarrinho() {
  const btnCart = document.getElementById("btn-cart");
  const floatCart = document.getElementById("floating-cart");
  const cartModal = document.getElementById("cart-modal");
  const cartClose = document.getElementById("cart-close");
  if (!cartModal) return;

  function abrirCarrinho() {
    if (carrinho.length === 0) {
      mostrarToast("Carrinho vazio — adicione um produto primeiro!");
      return;
    }
    cartModal.setAttribute("aria-hidden", "false");
  }
  function fecharCarrinho() {
    cartModal.setAttribute("aria-hidden", "true");
  }

  btnCart?.addEventListener("click", abrirCarrinho);
  floatCart?.addEventListener("click", abrirCarrinho);
  cartClose?.addEventListener("click", fecharCarrinho);
  cartModal.addEventListener("click", e => { if (e.target === cartModal) fecharCarrinho(); });
}

/**********************************************************
 * RENDER CARRINHO
 **********************************************************/
function renderCarrinho() {
  const itens = document.getElementById("cart-items");
  const totalEl = document.getElementById("cart-total");
  if (!itens || !totalEl) return;
  if (!carrinho.length) {
    itens.innerHTML = `<p style="text-align:center;color:var(--text-muted)">Carrinho vazio</p>`;
    totalEl.textContent = "R$ 0,00";
    return;
  }
  itens.innerHTML = "";
  let total = 0;
  carrinho.forEach(item => {
    total += item.preco * item.qtd;
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <img src="${item.imagem}" alt="${item.nome}">
      <div class="cart-item-info">
        <div class="nome">${item.nome}</div>
        <div class="preco">${formatarPreco(item.preco)}</div>
      </div>
      <div class="cart-item-qtd">
        <div class="cart-item-qtd-controls">
          <button class="cart-qtd-btn" data-action="menos" data-id="${item.id}">-</button>
          <span>${item.qtd}</span>
          <button class="cart-qtd-btn" data-action="mais" data-id="${item.id}">+</button>
        </div>
      </div>`;
    itens.appendChild(div);
  });
  totalEl.textContent = formatarPreco(total);
  itens.querySelectorAll(".cart-qtd-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      const id = e.target.dataset.id;
      mudarQuantidade(id, e.target.dataset.action === "mais" ? 1 : -1);
    });
  });
}

/**********************************************************
 * FRETE POR CEP
 **********************************************************/
function calcularFrete(cep) {
  if (!cep || cep.length < 5) return "CEP inválido.";
  const num = cep.replace(/\D/g, "")[0];
  if (!num) return "CEP inválido.";
  if ("01234".includes(num)) return "Frete: R$ 19,90 · 5 dias úteis";
  if ("567".includes(num)) return "Frete: R$ 24,90 · 7 dias úteis";
  return "Frete: R$ 29,90 · 10 dias úteis";
}
function configurarFrete() {
  const configs = [
    ["cep-input-modal", "calc-frete-modal", "frete-resultado-modal"],
    ["cep-input-checkout", "calc-frete-checkout", "frete-resultado-checkout"]
  ];
  configs.forEach(([idIn, idBtn, idOut]) => {
    const input = document.getElementById(idIn);
    const btn = document.getElementById(idBtn);
    const out = document.getElementById(idOut);
    if (btn && input && out) {
      btn.addEventListener("click", () => out.textContent = calcularFrete(input.value.trim()));
    }
  });
}

/**********************************************************
 * CATÁLOGO
 **********************************************************/
function renderCatalogo() {
  const lista = document.getElementById("lista-produtos");
  if (!lista) return;
  lista.innerHTML = "";
  produtos.forEach(prod => {
    const precoFinal = precoComDesconto(prod);
    lista.innerHTML += `
      <div class="card">
        <div class="card-img-wrapper">
          ${prod.desconto ? `<span class="promo-tag">-20% OFF</span>` : ""}
          <img src="${prod.imagem}" alt="${prod.nome}">
        </div>
        <div class="card-body">
          <div class="card-title"><a href="produto.html?id=${prod.id}">${prod.nome}</a></div>
          <div class="card-rating"><span>${gerarEstrelas(prod.avaliacao)}</span>
            <small>${prod.avaliacao.toFixed(1)} (${prod.avaliacoesQtd})</small></div>
          <div class="card-desc">${prod.descricaoCurta}</div>
          <div class="card-price">
            ${prod.desconto ? `<div class="preco-antigo">${formatarPreco(prod.precoOriginal)}</div>` : ""}
            <div class="preco-final">${formatarPreco(precoFinal)}</div>
            <div class="preco-label">à vista</div>
          </div>
          <div class="card-actions">
            <button class="btn-add-cart" data-id="${prod.id}">
              <i class="fa-solid fa-cart-plus"></i> Adicionar ao carrinho
            </button>
            <a class="btn-detalhes" href="produto.html?id=${prod.id}">Ver detalhes</a>
          </div>
        </div>
      </div>`;
  });
  lista.querySelectorAll(".btn-add-cart").forEach(btn => {
    btn.addEventListener("click", e => adicionarAoCarrinhoPorID(e.target.closest("button").dataset.id));
  });
}

/**********************************************************
 * DETALHE PRODUTO
 **********************************************************/
function renderProdutoDetalhe() {
  const target = document.getElementById("produto-detalhe");
  if (!target) return;
  const id = new URL(window.location.href).searchParams.get("id");
  const prod = produtos.find(p => p.id === id);
  if (!prod) { target.innerHTML = "<p>Produto não encontrado.</p>"; return; }
  const precoFinal = precoComDesconto(prod);
  target.innerHTML = `
    <div class="produto-galeria">
      ${prod.desconto ? `<span class="promo-tag">-20% OFF</span>` : ""}
      <img src="${prod.imagem}" alt="${prod.nome}">
    </div>
    <div class="produto-info">
      <h1>${prod.nome}</h1>
      <div class="produto-avaliacao">${gerarEstrelas(prod.avaliacao)} 
        <small>${prod.avaliacao.toFixed(1)} (${prod.avaliacoesQtd})</small></div>
      <div class="produto-descricao">${prod.descricaoLonga}</div>
      <ul class="produto-lista">
        <li><b>Marca:</b> ${prod.marca}</li>
        <li><b>Tipo:</b> ${prod.tipo}</li>
        <li><b>Volume:</b> ${prod.volume}</li>
        <li><b>Teor alcoólico:</b> ${prod.teor}</li>
      </ul>
    </div>
    <aside class="produto-comprar">
      ${prod.desconto ? `<div class="preco-antigo">${formatarPreco(prod.precoOriginal)}</div>` : ""}
      <p class="produto-preco">${formatarPreco(precoFinal)}</p>
      <p class="produto-parcela">ou 3x de ${formatarPreco(precoFinal/3)} sem juros</p>
      <p class="produto-estoque">Em estoque</p>
      <button class="btn-full-add" data-id="${prod.id}"><i class="fa-solid fa-cart-plus"></i> Adicionar ao carrinho</button>
    </aside>`;
  target.querySelector(".btn-full-add").addEventListener("click", () => adicionarAoCarrinhoPorID(prod.id));
}

/**********************************************************
 * CHECKOUT
 **********************************************************/
function renderCheckout() {
  const lista = document.getElementById("checkout-lista");
  const totalEl = document.getElementById("checkout-total");
  const btn = document.getElementById("checkout-confirmar");
  const msg = document.getElementById("msg");
  if (!lista || !btn) return;
  const dados = JSON.parse(localStorage.getItem("carrinho")) || [];
  lista.innerHTML = "";
  let total = 0;
  dados.forEach(p => {
    total += p.preco * p.qtd;
    lista.innerHTML += `<div class="checkout-item"><div class="item-nome">${p.qtd}x ${p.nome}</div>
      <div class="item-preco">${formatarPreco(p.preco)}</div></div>`;
  });
  totalEl.textContent = formatarPreco(total);
  btn.addEventListener("click", () => {
    localStorage.removeItem("carrinho");
    carrinho = [];
    atualizarTodosContadores();
    renderCarrinho();
    lista.innerHTML = "";
    totalEl.textContent = "R$ 0,00";
    msg.textContent = "Pedido confirmado! 🍷 Obrigado pela preferência.";
  });
}

/**********************************************************
 * MENU, CARROSSEL, TEMA, CONTADOR, TOAST
 **********************************************************/
function configurarSideMenu() {
  const menu = document.getElementById("side-menu");
  if (!menu) return;
  const btn = document.getElementById("btn-menu");
  const close = document.getElementById("close-menu");
  const overlay = menu.querySelector(".side-menu-overlay");
  function toggle() {
    const aberto = menu.getAttribute("aria-hidden") === "false";
    menu.setAttribute("aria-hidden", aberto ? "true" : "false");
  }
  btn?.addEventListener("click", toggle);
  close?.addEventListener("click", () => menu.setAttribute("aria-hidden", "true"));
  overlay?.addEventListener("click", () => menu.setAttribute("aria-hidden", "true"));
  menu.querySelectorAll(".expand").forEach(li => {
    li.querySelector(".submenu-trigger").addEventListener("click", () => li.classList.toggle("open"));
  });
}

function configurarCarrossel() {
  const slides = document.querySelector("#slides");
  if (!slides) return;
  let i = 0;
  setInterval(() => {
    i = (i + 1) % slides.children.length;
    slides.style.transform = `translateX(-${i * 100}%)`;
  }, 5000);
}

function iniciarContadorPromocao() {
  const el = document.getElementById("contador");
  if (!el) return;
  const fim = new Date(); fim.setDate(fim.getDate() + 2);
  setInterval(() => {
    const diff = fim - new Date();
    if (diff <= 0) { el.textContent = "Encerrada!"; return; }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff / 3600000) % 24);
    const m = Math.floor((diff / 60000) % 60);
    const s = Math.floor((diff / 1000) % 60);
    el.textContent = `${d}d ${h}h ${m}m ${s}s`;
  }, 1000);
}

function configurarTema() {
  const btn = document.getElementById("theme-toggle");
  const html = document.documentElement;
  const salvo = localStorage.getItem("tema-adega");
  if (salvo) html.setAttribute("data-theme", salvo);
  btn?.addEventListener("click", () => {
    const novo = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
    html.setAttribute("data-theme", novo);
    localStorage.setItem("tema-adega", novo);
  });
}

function mostrarToast(msg) {
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2000);
}

/**********************************************************
 * INIT
 **********************************************************/
document.addEventListener("DOMContentLoaded", () => {
  renderCatalogo();
  renderProdutoDetalhe();
  renderCheckout();
  configurarModalCarrinho();
  renderCarrinho();
  configurarSideMenu();
  configurarCarrossel();
  iniciarContadorPromocao();
  configurarTema();
  configurarFrete();
  atualizarTodosContadores();
});
