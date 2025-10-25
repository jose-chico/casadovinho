/**********************************************************
 * PRODUTOS
 * - agora suporta promoção (-20% OFF)
 *   precoOriginal = preço cheio
 *   desconto = true => mostra selo e aplica 20% off
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
 * HELPERS
 **********************************************************/
function precoComDesconto(prod) {
  if (!prod.desconto) return prod.precoOriginal;
  return prod.precoOriginal * 0.8; // 20% OFF
}

function formatarPreco(v) {
  return `R$ ${v.toFixed(2).replace('.', ',')}`;
}

function gerarEstrelas(av) {
  const full = Math.floor(av);
  return "★".repeat(full) + "☆".repeat(5 - full);
}

// áudio "ping" suave tipo cristal
const audioPing = new Audio(
  "data:audio/mp3;base64,//uQxAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAACcQCA..."
);
// Nota: esse base64 é ilustrativo. Em produção, coloque um base64 real de um som curto tipo 'ding'.
// Se não tiver ainda, o site continua funcionando sem som.

/**********************************************************
 * CARRINHO
 **********************************************************/
let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

function contarItensCarrinho() {
  return carrinho.reduce((acc, item) => acc + item.qtd, 0);
}

/* sincroniza contadores (topo + flutuante) */
function atualizarTodosContadores() {
  const cartCount = document.getElementById("cart-count");
  const cartCountFloat = document.getElementById("cart-count-float");
  const totalQtd = contarItensCarrinho();

  if (cartCount) cartCount.textContent = totalQtd;
  if (cartCountFloat) cartCountFloat.textContent = totalQtd;
}

function atualizarTodosContadores() {
  const cartCount = document.getElementById("cart-count");
  const cartCountFloat = document.getElementById("cart-count-float");
  const btnCart = document.getElementById("btn-cart"); // botão topo
  const btnCartFloat = document.getElementById("floating-cart"); // botão flutuante
  const totalQtd = contarItensCarrinho();

  if (cartCount) cartCount.textContent = totalQtd;
  if (cartCountFloat) cartCountFloat.textContent = totalQtd;

  // 🔒 Desativar ou ativar os botões conforme a quantidade de itens
  const desativar = totalQtd === 0;

  [btnCart, btnCartFloat].forEach(btn => {
    if (btn) {
      btn.disabled = desativar;
      btn.style.opacity = desativar ? "0.5" : "1";
      btn.style.cursor = desativar ? "not-allowed" : "pointer";
      btn.style.pointerEvents = desativar ? "none" : "auto";
    }
  });
}
mudarQuantidade

function salvarCarrinho() {
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
  atualizarTodosContadores();
}

function adicionarAoCarrinhoPorID(idProd) {
  const prod = produtos.find(p => p.id === idProd);
  if (!prod) return;

  const ja = carrinho.find(i => i.id === idProd);
  if (ja) {
    ja.qtd++;
  } else {
    carrinho.push({
      id: prod.id,
      nome: prod.nome,
      preco: precoComDesconto(prod),
      imagem: prod.imagem,
      qtd: 1
    });
  }

  salvarCarrinho();
  renderCarrinho();
  mostrarToast(`${prod.nome} adicionado ao carrinho!`);

  // tenta tocar som (não quebra se falhar autoplay)
  if (audioPing && audioPing.play) {
    audioPing.currentTime = 0;
    audioPing.play().catch(() => {});
  }
}

function mudarQuantidade(idProd, delta) {
  const item = carrinho.find(p => p.id === idProd);
  if (!item) return;
  item.qtd += delta;

  if (item.qtd <= 0) {
    carrinho = carrinho.filter(p => p.id !== idProd);
  }

  salvarCarrinho();
  renderCarrinho();

  // 🔒 Se o carrinho ficou vazio, fecha o modal automaticamente
  if (carrinho.length === 0) {
    const cartModal = document.getElementById("cart-modal");
    if (cartModal) {
      cartModal.setAttribute("aria-hidden", "true");
    }
  }
}

atualizarTodosContadores()
/**********************************************************
 * CARRINHO MODAL / RENDER
 **********************************************************/
function renderCarrinho() {
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  if (!cartItems || !cartTotal) return;

  if (!carrinho.length) {
    cartItems.innerHTML = `<p style="text-align:center;color:var(--text-muted)">Carrinho vazio</p>`;
    cartTotal.textContent = "R$ 0,00";
    return;
  }

  let total = 0;
  cartItems.innerHTML = "";
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
      </div>
    `;
    cartItems.appendChild(div);
  });

  cartTotal.textContent = formatarPreco(total);

  // botões + e -
  cartItems.querySelectorAll(".cart-qtd-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      const id = e.currentTarget.getAttribute("data-id");
      const acao = e.currentTarget.getAttribute("data-action");
      mudarQuantidade(id, acao === "mais" ? 1 : -1);
    });
  });
}

function configurarModalCarrinho() {
  const btnCart = document.getElementById("btn-cart");
  const floatCart = document.getElementById("floating-cart");
  const cartModal = document.getElementById("cart-modal");
  const cartClose = document.getElementById("cart-close");

  if (!cartModal) return;

  function abrirCarrinho() {
    cartModal.setAttribute("aria-hidden", "false");
  }
  function fecharCarrinho() {
    cartModal.setAttribute("aria-hidden", "true");
  }

  btnCart && btnCart.addEventListener("click", abrirCarrinho);
  floatCart && floatCart.addEventListener("click", abrirCarrinho);
  cartClose && cartClose.addEventListener("click", fecharCarrinho);

  cartModal.addEventListener("click", e => {
    if (e.target === cartModal) fecharCarrinho();
  });
}

/**********************************************************
 * MENU LATERAL "Todos"
 **********************************************************/
function configurarSideMenu() {
  const sideMenu = document.getElementById("side-menu");
  if (!sideMenu) return;

  const btnMenu = document.getElementById("btn-menu");
  const closeMenu = document.getElementById("close-menu");
  const overlay = sideMenu.querySelector(".side-menu-overlay");

  function toggleMenu() {
    const aberto = sideMenu.getAttribute("aria-hidden") === "false";
    sideMenu.setAttribute("aria-hidden", aberto ? "true" : "false");
  }

  btnMenu && btnMenu.addEventListener("click", toggleMenu);
  closeMenu && closeMenu.addEventListener("click", () => sideMenu.setAttribute("aria-hidden", "true"));
  overlay && overlay.addEventListener("click", () => sideMenu.setAttribute("aria-hidden", "true"));

  sideMenu.querySelectorAll(".expand").forEach(li => {
    const trigger = li.querySelector(".submenu-trigger");
    trigger.addEventListener("click", () => {
      li.classList.toggle("open");
    });
  });
}

/**********************************************************
 * CARROSSEL HOME
 **********************************************************/
function configurarCarrossel() {
  const slidesWrapper = document.getElementById("slides");
  if (!slidesWrapper) return;

  const slides = slidesWrapper.querySelectorAll(".slide");
  const nextBtn = document.getElementById("next");
  const prevBtn = document.getElementById("prev");
  let idx = 0;

  function mostrarSlide() {
    slidesWrapper.style.transform = `translateX(-${idx * 100}%)`;
  }
  function avanca() {
    idx = (idx + 1) % slides.length;
    mostrarSlide();
  }
  function volta() {
    idx = (idx - 1 + slides.length) % slides.length;
    mostrarSlide();
  }

  nextBtn && nextBtn.addEventListener("click", avanca);
  prevBtn && prevBtn.addEventListener("click", volta);
  setInterval(avanca, 5000);
}

/**********************************************************
 * CONTADOR PROMOÇÃO SEMANAL
 **********************************************************/
function iniciarContadorPromocao() {
  const contadorEl = document.getElementById("contador");
  if (!contadorEl) return;

  const fim = new Date();
  fim.setDate(fim.getDate() + 2); // termina em 2 dias

  function atualizar() {
    const agora = new Date();
    const diff = fim - agora;
    if (diff <= 0) {
      contadorEl.textContent = "Encerrada!";
      return;
    }
    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / (1000 * 60)) % 60);
    const s = Math.floor((diff / 1000) % 60);
    contadorEl.textContent = `${d}d ${h}h ${m}m ${s}s`;
  }

  atualizar();
  setInterval(atualizar, 1000);
}

/**********************************************************
 * TEMA DARK/LIGHT
 **********************************************************/
function configurarTema() {
  const toggle = document.getElementById("theme-toggle");
  const htmlEl = document.documentElement;

  const salvo = localStorage.getItem("tema-adega");
  if (salvo === "light" || salvo === "dark") {
    htmlEl.setAttribute("data-theme", salvo);
  }

  toggle && toggle.addEventListener("click", () => {
    const atual = htmlEl.getAttribute("data-theme");
    const novo = atual === "dark" ? "light" : "dark";
    htmlEl.setAttribute("data-theme", novo);
    localStorage.setItem("tema-adega", novo);
  });
}

/**********************************************************
 * LISTA DE PRODUTOS (HOME)
 **********************************************************/
function renderCatalogo() {
  const lista = document.getElementById("lista-produtos");
  if (!lista) return;
  lista.innerHTML = "";

  produtos.forEach(prod => {
    const precoFinal = precoComDesconto(prod);
    const temDesconto = prod.desconto;

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <div class="card-img-wrapper">
        ${temDesconto ? `<span class="promo-tag">-20% OFF</span>` : ""}
        <img src="${prod.imagem}" alt="${prod.nome}">
      </div>

      <div class="card-body">
        <div class="card-title">
          <a href="produto.html?id=${encodeURIComponent(prod.id)}">
            ${prod.nome}
          </a>
        </div>

        <div class="card-rating">
          <span>${gerarEstrelas(prod.avaliacao)}</span>
          <small>${prod.avaliacao.toFixed(1)} (${prod.avaliacoesQtd})</small>
        </div>

        <div class="card-desc">${prod.descricaoCurta}</div>

        <div class="card-price">
          ${
            temDesconto
              ? `<div class="preco-antigo">${formatarPreco(prod.precoOriginal)}</div>`
              : ""
          }
          <div class="preco-final">${formatarPreco(precoFinal)}</div>
          <div class="preco-label">à vista</div>
        </div>

        <div class="card-actions">
          <button class="btn-add-cart" data-id="${prod.id}">
            <i class="fa-solid fa-cart-plus"></i>
            Adicionar ao carrinho
          </button>

          <a class="btn-detalhes" href="produto.html?id=${encodeURIComponent(prod.id)}">
            Ver detalhes
          </a>
        </div>
      </div>
    `;

    lista.appendChild(card);
  });

  // eventos botão adicionar carrinho
  lista.querySelectorAll(".btn-add-cart").forEach(btn => {
    btn.addEventListener("click", e => {
      const id = e.currentTarget.getAttribute("data-id");
      adicionarAoCarrinhoPorID(id);
    });
  });
}

/**********************************************************
 * PRODUTO DETALHE PAGE
 **********************************************************/
function getParamId() {
  const url = new URL(window.location.href);
  return url.searchParams.get("id");
}

function renderProdutoDetalhe() {
  const target = document.getElementById("produto-detalhe");
  if (!target) return;

  const id = getParamId();
  const prod = produtos.find(p => p.id === id);

  if (!prod) {
    target.innerHTML = `<p style="color:var(--text-muted)">Produto não encontrado.</p>`;
    return;
  }

  const precoFinal = precoComDesconto(prod);
  const parcela = precoFinal / 3;

  target.innerHTML = `
    <div class="produto-galeria">
      <div style="position:relative;">
        ${prod.desconto ? `<span class="promo-tag">-20% OFF</span>` : ""}
        <img src="${prod.imagem}" alt="${prod.nome}">
      </div>
    </div>

    <div class="produto-info">
      <h1>${prod.nome}</h1>

      <div class="produto-avaliacao">
        <span>${gerarEstrelas(prod.avaliacao)}</span>
        <small>${prod.avaliacao.toFixed(1)} (${prod.avaliacoesQtd} avaliações)</small>
      </div>

      <div class="produto-descricao">
        ${prod.descricaoLonga}
      </div>

      <ul class="produto-lista">
        <li><strong>Marca:</strong> ${prod.marca}</li>
        <li><strong>Tipo:</strong> ${prod.tipo}</li>
        <li><strong>Volume:</strong> ${prod.volume}</li>
        <li><strong>Teor alcoólico:</strong> ${prod.teor}</li>
      </ul>
    </div>

    <aside class="produto-comprar">
      ${
        prod.desconto
          ? `<div class="preco-antigo" style="text-decoration:line-through;color:var(--text-muted);font-size:.8rem;">
              ${formatarPreco(prod.precoOriginal)} (-20%)
            </div>`
          : ""
      }

      <p class="produto-preco">${formatarPreco(precoFinal)}</p>

      <p class="produto-parcela">ou 3x de ${formatarPreco(parcela)} sem juros</p>

      <p class="produto-estoque">Em estoque</p>

      <button class="btn-full-add" data-id="${prod.id}">
        <i class="fa-solid fa-cart-plus"></i>
        Adicionar ao carrinho
      </button>

      <button class="btn-full-buy">
        Comprar agora
      </button>

      <p style="font-size:.75rem;color:var(--text-muted);margin:0;">
        Enviado e vendido por Adega Premium.
      </p>
    </aside>
  `;

  const btnAdd = target.querySelector(".btn-full-add");
  btnAdd.addEventListener("click", () => {
    adicionarAoCarrinhoPorID(prod.id);
  });
}

/**********************************************************
 * CHECKOUT PAGE
 **********************************************************/
function renderCheckout() {
  const lista = document.getElementById("checkout-lista");
  const totalEl = document.getElementById("checkout-total");
  const msg = document.getElementById("msg");
  const confirmarBtn = document.getElementById("checkout-confirmar");
  if (!lista || !totalEl || !confirmarBtn) return;

  const dados = JSON.parse(localStorage.getItem("carrinho")) || [];
  let total = 0;

  lista.innerHTML = "";
  dados.forEach(item => {
    const subtotal = item.preco * item.qtd;
    total += subtotal;
    lista.innerHTML += `
      <div class="checkout-item">
        <div class="item-nome">${item.qtd}x ${item.nome}</div>
        <div class="item-preco">${formatarPreco(item.preco)} cada</div>
        <div class="item-preco">Subtotal: ${formatarPreco(subtotal)}</div>
      </div>
    `;
  });

  totalEl.textContent = formatarPreco(total);

  confirmarBtn.addEventListener("click", () => {
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
 * FRETE SIMULADO POR CEP
 * - lógica simples fake:
 *   até CEP começando com 0-4: frete R$19,90, 5 dias úteis
 *   5-7: frete R$24,90, 7 dias úteis
 *   8-9: frete R$29,90, 10 dias úteis
 **********************************************************/
function calcularFrete(cep) {
  if (!cep || cep.length < 5) return "CEP inválido.";
  const primeira = cep.replace(/\D/g, "")[0]; // 1º dígito numérico

  if (!primeira) return "CEP inválido.";

  if ("01234".includes(primeira)) {
    return "Frete: R$ 19,90 · prazo: 5 dias úteis";
  } else if ("567".includes(primeira)) {
    return "Frete: R$ 24,90 · prazo: 7 dias úteis";
  } else {
    return "Frete: R$ 29,90 · prazo: 10 dias úteis";
  }
}

function configurarFrete() {
  // modal carrinho
  const cepModal = document.getElementById("cep-input-modal");
  const btnModal = document.getElementById("calc-frete-modal");
  const resModal = document.getElementById("frete-resultado-modal");

  if (btnModal && cepModal && resModal) {
    btnModal.addEventListener("click", () => {
      resModal.textContent = calcularFrete(cepModal.value.trim());
    });
  }

  // checkout
  const cepCheckout = document.getElementById("cep-input-checkout");
  const btnCheckout = document.getElementById("calc-frete-checkout");
  const resCheckout = document.getElementById("frete-resultado-checkout");

  if (btnCheckout && cepCheckout && resCheckout) {
    btnCheckout.addEventListener("click", () => {
      resCheckout.textContent = calcularFrete(cepCheckout.value.trim());
    });
  }
}

/**********************************************************
 * TOAST
 **********************************************************/
function mostrarToast(msg) {
  const aviso = document.createElement("div");
  aviso.className = "toast";
  aviso.textContent = msg;
  document.body.appendChild(aviso);
  setTimeout(() => aviso.remove(), 2000);
}
atualizarTodosContadores()
/**********************************************************
 * INIT
 **********************************************************/
document.addEventListener("DOMContentLoaded", () => {
  // renderizações
  renderCatalogo();
  renderProdutoDetalhe();
  renderCheckout();

  // carrinho
  atualizarTodosContadores();
  renderCarrinho();
  configurarModalCarrinho();

  // ui e interação
  configurarSideMenu();
  configurarCarrossel();
  iniciarContadorPromocao();
  configurarTema();
  configurarFrete();
});
