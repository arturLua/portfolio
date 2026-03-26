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


/* ------------------------------------------------
   Cores que o GitHub usa
------------------------------------------------ */
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
};


async function carregarRepositorios() {
  const grid = document.getElementById('repos-grid');
  const indicador = document.getElementById('live-indicator');

  try {
    /* API do GitHub */
    const url = `https://api.github.com/users/${CONFIG.usuario}/repos?per_page=100&sort=${CONFIG.ordenarPor}`;

    const resposta = await fetch(url, {
      headers: {
        /* Versão da API */
        Accept: 'application/vnd.github.v3+json',
      },
    });

    /* Verifica a requisição */
    if (!resposta.ok) {
      throw new Error(`GitHub API retornou ${resposta.status}`);
    }

    const repos = await resposta.json();

    /* Filtra forks */
    const filtrados = repos.filter((r) => {
      if (CONFIG.ocultarForks && r.fork) return false;
      return true;
    });

    /* Limita o máximo configurado */
    const selecionados = filtrados.slice(0, CONFIG.maxRepos);

    /* Renderiza os cards */
    if (selecionados.length === 0) {
      grid.innerHTML = `<p class="repos-vazio">nenhum repositório público encontrado.</p>`;
      return;
    }

    grid.innerHTML = selecionados.map(renderizarCard).join('');

    /* Indica que carregou com sucesso */
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

    /* Para o piscar no erro */
    if (indicador) {
      indicador.style.background = '#555';
      indicador.style.animation = 'none';
    }
  }
}


/* ------------------------------------------------
   RENDERIZA UM CARD DE REPOSITÓRIO
   Recebe o objeto de repo da API e retorna HTML
------------------------------------------------ */
function renderizarCard(repo) {
  /* Cor da linguagem (cinza se não reconhecida) */
  const corLang = repo.language ? (CORES_LINGUAGEM[repo.language] ?? '#555550') : null;

  /* Badge de linguagem */
  const htmlLinguagem = repo.language
    ? `<span class="repo-card__lang">
         <span class="repo-card__lang-dot" style="background:${corLang}"></span>
         ${repo.language}
       </span>`
    : `<span></span>`;

  /* Estrelas */
  const htmlEstrelas = repo.stargazers_count > 0
    ? `<span class="repo-card__estrelas">★ ${repo.stargazers_count}</span>`
    : '';

  /* Descrição */
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

  carregarRepositorios();

});