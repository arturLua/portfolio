/* ------------------------------------------------
   CONFIGURAÇÃO
------------------------------------------------ */
const CONFIG = {
  usuario: 'arturLua',

  maxRepos: 6,

  ocultarForks: true,

  /* Ordenar por: updated, stars ou created */
  ordenarPor: 'updated',
};


/* Cores que o GitHub usa */
const CORES_LINGUAGEM = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python:     '#3572A5',
  HTML:       '#e34c26',
  CSS:        '#563d7c',
  Shell:      '#89e051',
  C:          '#555555',
  'C++':      '#f34b7d',
  Java:       '#b07219',
  Rust:       '#dea584',
  Go:         '#00ADD8',
  PHP:        '#4F5D95',
  Kotlin:     '#A97BFF',
};


/* ------------------------------------------------
   ALTERNÂNCIA DE TEMA (dark / light)
   Com fade suave via CSS transition
------------------------------------------------ */
function iniciarTema() {
  const html   = document.documentElement;
  const botao  = document.getElementById('btn-tema');
  if (!botao) return;

  /* Aplica o tema salvo (já aplicado no <head> para evitar flash,
     mas repetimos aqui caso o script carregue após o DOMContentLoaded) */
  const temaSalvo = localStorage.getItem('tema') || 'dark';
  html.setAttribute('data-theme', temaSalvo);

  botao.addEventListener('click', () => {
    const atual  = html.getAttribute('data-theme');
    const novo   = atual === 'light' ? 'dark' : 'light';

    html.setAttribute('data-theme', novo);
    localStorage.setItem('tema', novo);
  });
}


/* ------------------------------------------------
   CARREGA REPOSITÓRIOS DO GITHUB
------------------------------------------------ */
async function carregarRepositorios() {
  const grid      = document.getElementById('repos-grid');
  const indicador = document.getElementById('live-indicator');

  try {
    const url = `https://api.github.com/users/${CONFIG.usuario}/repos?per_page=100&sort=${CONFIG.ordenarPor}`;

    const resposta = await fetch(url, {
      headers: {
        /* Versão da API */
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (!resposta.ok) {
      throw new Error(`GitHub API retornou ${resposta.status}`);
    }

    const repos = await resposta.json();

    const filtrados = repos.filter((r) => {
      if (CONFIG.ocultarForks && r.fork) return false;
      return true;
    });

    const selecionados = filtrados.slice(0, CONFIG.maxRepos);

    if (selecionados.length === 0) {
      grid.innerHTML = `<p class="repos-vazio">nenhum repositório público encontrado.</p>`;
      return;
    }

    grid.innerHTML = selecionados.map(renderizarCard).join('');

    if (indicador) indicador.title = 'repositórios carregados ao vivo da API do GitHub';

  } catch (erro) {
    console.error('Erro ao carregar repositórios:', erro);

    grid.innerHTML = `
      <p class="repos-erro">
        não foi possível carregar os repositórios.<br />
        <a href="https://github.com/${CONFIG.usuario}" target="_blank" rel="noopener"
           style="color: var(--acento);">
          ver no github ↗
        </a>
      </p>
    `;

    if (indicador) {
      indicador.style.background = '#555';
      indicador.style.animation  = 'none';
    }
  }
}


/* ------------------------------------------------
   RENDERIZA UM CARD DE REPOSITÓRIO
   Recebe o objeto de repo da API e retorna HTML
------------------------------------------------ */
function renderizarCard(repo) {
  const corLang = repo.language ? (CORES_LINGUAGEM[repo.language] ?? '#555550') : null;

  const htmlLinguagem = repo.language
    ? `<span class="repo-card__lang">
         <span class="repo-card__lang-dot" style="background:${corLang}"></span>
         ${repo.language}
       </span>`
    : `<span></span>`;

  const htmlEstrelas = repo.stargazers_count > 0
    ? `<span class="repo-card__estrelas">★ ${repo.stargazers_count}</span>`
    : '';

  const descricao = repo.description || '—';

  return `
    <a
      href="${repo.html_url}"
      target="_blank"
      rel="noopener"
      class="repo-card"
      title="${repo.full_name}"
    >
      <span class="repo-card__nome">${repo.name}</span>
      <span class="repo-card__desc">${descricao}</span>
      <div class="repo-card__rodape">
        ${htmlLinguagem}
        ${htmlEstrelas}
      </div>
    </a>
  `;
}


/* ------------------------------------------------
   INICIALIZAÇÃO
------------------------------------------------ */
document.addEventListener('DOMContentLoaded', () => {

  const ano = document.getElementById('year');
  if (ano) ano.textContent = new Date().getFullYear();

  iniciarTema();
  carregarRepositorios();

});