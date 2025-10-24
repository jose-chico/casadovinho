/**********************************************************
 * DADOS DOS PRODUTOS
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
    preco: 79.90,
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
    preco: 64.50,
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
    preco: 49.90,
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
    preco: 89.00,
    descricaoCurta: "Rosé francês leve, floral e refrescante. Ideal para dias quentes.",
    descricaoLonga:
      "Notas florais delicadas, frutas vermelhas frescas e final limpo. Perfeito para momentos ao ar livre.",
    imagem: "https://loja.vinicolaaurora.com.br/cdn/shop/files/VinhoCountryWineBordoSuave-1Litro.png?v=1755364408"
  }
];

/**********************************************************
 * HELPERS
 **********************************************************/
function formatarPreco(v) {
  return `R$ ${v.toFixed(2).replace('.', ',')}`;
}

function gerarEstrelas(av) {
  const full = Math.floor(av);
  return "★".repeat(full) + "☆".repeat(5 - full);
}

/**********************************************************
 * CARRINHO (estado + sincronização)
 **********************************************************/
let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

function contarItensCarrinho() {
  return carrinho.reduce((acc, item) => acc + item.qtd, 0);
}

/* Atualiza o número nos dois lugares:
   - bolinha no header (cart-count)
   - bolinha do botão flutuante (cart-count-float) */
function atualizarTodosContadores() {
  const cartCount = document.getElementById("cart-count");
  const cartCountFloat = document.getElementById("cart-count-float");
  const totalQtd = contarItensCarrinho();

  if (cartCount) cartCount.textContent = totalQtd;
  if (cartCountFloat) cartCountFloat.textContent = totalQtd;
}

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
      preco: prod.preco,
      imagem: prod.imagem,
      qtd: 1
    });
  }

  salvarCarrinho();
  renderCarrinho();
  mostrarToast(`${prod.nome} adicionado ao carrinho!`);
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
}

/**********************************************************
 * MODAL DO CARRINHO
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
 * MENU LATERAL (Todos)
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
 * CARROSSEL DA HOME
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

  // troca automática
  setInterval(avanca, 5000);
}

/**********************************************************
 * CONTADOR PROMOÇÃO
 **********************************************************/
function iniciarContadorPromocao() {
  const contadorEl = document.getElementById("contador");
  if (!contadorEl) return;

  // expira em 2 dias
  const fim = new Date();
  fim.setDate(fim.getDate() + 2);

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

  // carrega tema salvo
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
 * LISTA DE PRODUTOS NA HOME
 **********************************************************/
function renderCatalogo() {
  const lista = document.getElementById("lista-produtos");
  if (!lista) return;

  lista.innerHTML = "";

  produtos.forEach(prod => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <div class="card-img-wrapper">
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
          <strong>${formatarPreco(prod.preco)}</strong>
          <span>à vista</span>
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

  // botões "Adicionar ao carrinho"
  lista.querySelectorAll(".btn-add-cart").forEach(btn => {
    btn.addEventListener("click", e => {
      const id = e.currentTarget.getAttribute("data-id");
      adicionarAoCarrinhoPorID(id);
    });
  });
}

/**********************************************************
 * PÁGINA DE PRODUTO DETALHE
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

  const parcela = prod.preco / 3;

  target.innerHTML = `
    <div class="produto-galeria">
      <img src="${prod.imagem}" alt="${prod.nome}">
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
      <p class="produto-preco">${formatarPreco(prod.preco)}</p>
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

  // botão "Adicionar ao carrinho"
  const btnAdd = target.querySelector(".btn-full-add");
  btnAdd.addEventListener("click", () => {
    adicionarAoCarrinhoPorID(prod.id);
  });
}

/**********************************************************
 * CHECKOUT (resumo e finalizar)
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
 * TOAST (mensagem ao adicionar)
 **********************************************************/
function mostrarToast(msg) {
  const aviso = document.createElement("div");
  aviso.className = "toast";
  aviso.textContent = msg;
  document.body.appendChild(aviso);
  setTimeout(() => aviso.remove(), 2000);
}

/**********************************************************
 * INICIALIZAÇÃO
 **********************************************************/
document.addEventListener("DOMContentLoaded", () => {
  // renderizações por página
  renderCatalogo();
  renderProdutoDetalhe();
  renderCheckout();

  // carrinho
  atualizarTodosContadores();
  renderCarrinho();
  configurarModalCarrinho();

  // ui
  configurarSideMenu();
  configurarCarrossel();
  iniciarContadorPromocao();
  configurarTema();
});
