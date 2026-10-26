# Auditoria de SEO — Prisma Pesquisa

Data da auditoria: 26 de outubro de 2026  
Domínio oficial: https://prismapesquisa.com.br/

## Escopo e arquitetura

O projeto é um site estático em HTML, CSS e JavaScript, publicado pelo GitHub Pages com domínio personalizado definido em `CNAME`. Não há framework, processo de build, gerenciador de pacotes, lint ou suíte de testes configurados. Foram auditadas 16 páginas públicas e indexáveis, além da página 404, `robots.txt`, `sitemap.xml`, scripts, estilos e configuração de domínio.

## Problemas reais encontrados

- O H1 da página inicial descrevia a proposta, mas não citava diretamente a marca "Prisma Pesquisa".
- A página inicial possuía `Organization`, mas não declarava o nó `WebSite` recomendado para reforçar o nome do site.
- A maior parte das páginas dependia do fallback de Open Graph para Twitter/X Cards, sem título, descrição, imagem e texto alternativo explícitos.
- A Política de Privacidade não possuía descrição nem imagem Open Graph.
- As páginas de artigos tinham `Article`, mas não possuíam `BreadcrumbList` correspondente à navegação visível.
- A página de conteúdos não possuía dados estruturados próprios.
- As URLs antigas com `?servico=` ainda podiam ser acessadas como variações da página inicial.
- As datas `lastmod` do sitemap não refletiam as alterações significativas recentes em marcação, links e metadados.
- Os links de marca com imagem e texto poderiam gerar nomes acessíveis redundantes sem um rótulo explícito no link.

## Alterações implementadas

- O H1 passou a ser `Prisma Pesquisa: soluções em dados, estatística e tecnologia` e o subtítulo preserva a mensagem de transformação de desafios e ideias em resultados.
- A homepage agora declara `WebSite` e `Organization` em um único grafo JSON-LD, com `@id` estáveis, nome, domínio, logotipo de 512 × 512 px, telefone e catálogo real de serviços.
- Foi removido o tipo `ProfessionalService`, que poderia sugerir um estabelecimento local e exigir informações físicas inexistentes.
- Open Graph e Twitter/X Cards foram completados nas 16 páginas indexáveis, com `og:locale`, imagem válida, dimensões e texto alternativo.
- Os três artigos agora possuem `Article` e `BreadcrumbList`; a página de conteúdos possui `CollectionPage` e `BreadcrumbList`.
- Todas as páginas preservam title e meta description próprios, uma canonical absoluta, `lang="pt-BR"` e um único H1.
- URLs legadas conhecidas com `?servico=` passam a levar o visitante à página específica do serviço. Parâmetros adicionais, como UTM, são preservados.
- Links internos continuam usando URLs limpas sem `?servico=`; o preenchimento automático do orçamento continua funcionando por armazenamento temporário da sessão.
- O sitemap foi atualizado com as 16 URLs canônicas e `lastmod` real de 2026-10-26.
- Os links do logotipo receberam rótulo acessível explícito sem alterar o layout.

## Arquivos modificados

- `index.html`
- `sobre/index.html`
- `privacidade/index.html`
- `conteudos/index.html` e os três artigos em `conteudos/`
- As nove páginas em `servicos/`
- `sitemap.xml`
- `SEO_AUDITORIA.md`

`CNAME`, `robots.txt`, o arquivo de verificação do Google, estilos, formulário e configuração do WhatsApp foram preservados.

## Itens que já estavam corretos

- Título preferencial da homepage.
- Domínio canônico `https://prismapesquisa.com.br/` em todas as páginas.
- HTTP, `www` e o endereço antigo do GitHub Pages redirecionando em um único salto 301 para o domínio oficial.
- URLs sem barra final redirecionando por 301 para a versão com barra.
- Titles e descriptions exclusivos e coerentes.
- Uma única canonical e um único H1 por página indexável.
- Páginas de serviços completas, com público, aplicações, entregáveis, etapas, perguntas frequentes e CTA.
- Links relacionados entre serviços e links descritivos.
- `robots.txt` permitindo rastreamento e apontando para o sitemap.
- Página 404 retornando HTTP 404 e usando `noindex,follow`.
- CSS e JavaScript locais e pequenos, scripts com `defer`, imagens com dimensões definidas, ausência de fontes externas e respeito a `prefers-reduced-motion`.
- Nenhum depoimento, avaliação, cliente, certificação ou resultado comercial inventado.

## Testes realizados

- 16 páginas publicadas: HTTP 200, canonical própria, title, description, H1, Open Graph e Twitter/X Card.
- Todas as páginas indexáveis sem `noindex`.
- JSON-LD analisado como JSON válido em todas as páginas que o utilizam.
- Sitemap XML analisado com 16 URLs HTTPS, únicas, canônicas e sem parâmetros ou fragmentos.
- `robots.txt`, sitemap e imagem Open Graph acessíveis no domínio oficial.
- Verificação local de todos os links e âncoras: nenhum destino ausente.
- JavaScript principal e script inline verificados sintaticamente.
- Nove mapeamentos antigos de `?servico=` testados; os parâmetros UTM adicionais foram preservados.
- Teste em navegador publicado: URL antiga de análise estatística levou à página correta e o CTA retornou à homepage com `Análise estatística` pré-selecionada no formulário.
- Redirecionamentos: HTTP, `www`, URL antiga do GitHub Pages e ausência de barra retornaram 301 para o destino esperado.
- URL inexistente retornou HTTP 404.
- `git diff --check` executado sem erros.

## Desempenho e acessibilidade

Não foram encontrados recursos remotos bloqueantes, imagens sem dimensões, scripts síncronos externos ou bibliotecas desnecessárias. O logo principal possui 63 KB e os arquivos locais de CSS e JavaScript possuem aproximadamente 25 KB e 12 KB, respectivamente.

A API oficial do PageSpeed Insights não forneceu métricas nesta auditoria porque a cota pública respondeu com HTTP 429. O navegador disponível para automação não expôs emulação de viewport móvel e não conseguiu acessar o servidor local; por isso, não foram declaradas pontuações de Lighthouse nem uma inspeção visual móvel automatizada. A responsividade foi verificada na estrutura CSS existente, incluindo media queries, navegação mobile e redução de movimento, sem alteração de layout.

## Limitações e pendências externas

- O GitHub Pages não oferece regra de redirecionamento HTTP baseada em query string. O tratamento de `?servico=` é feito no navegador. Um 301 por parâmetro exigiria uma camada de CDN/proxy configurável; não é necessário mudar DNS apenas por esse relatório.
- Rich Results Test e Schema Markup Validator não oferecem uma validação automatizada integrada ao repositório. A sintaxe e a coerência dos JSON-LD foram validadas localmente e no HTML publicado.
- A busca pública amostrada pela marca ainda não retornou o domínio entre os resultados observados. Isso é compatível com um site recente e não contradiz a confirmação de indexação da homepage no Search Console.
- Posicionamento, impressão e CTR dependem de novo rastreamento, concorrência, autoridade e comportamento dos usuários; não há garantia de posição.

## URLs definitivas

- Sitemap: https://prismapesquisa.com.br/sitemap.xml
- Robots: https://prismapesquisa.com.br/robots.txt

## Ações recomendadas após a publicação

1. No Google Search Console, inspecionar `https://prismapesquisa.com.br/`, executar o teste da URL publicada e solicitar novo rastreamento.
2. Reenviar ou confirmar o sitemap `https://prismapesquisa.com.br/sitemap.xml`.
3. Solicitar indexação das páginas de serviço mais importantes, começando por análise estatística, automação de planilhas, dashboards e consultoria científica. Não solicitar indexação das URLs com `?servico=` ou da versão HTTP.
4. Não tratar o redirecionamento HTTP → HTTPS como erro; essa versão não deve ser indexada.
5. No Bing Webmaster Tools, adicionar o mesmo sitemap e confirmar a propriedade, caso ainda não tenha sido feito.
6. Acompanhar consultas, CTR e páginas indexadas por algumas semanas antes de realizar novas mudanças de título ou conteúdo.

Referências técnicas utilizadas: [nome do site](https://developers.google.com/search/docs/appearance/site-names), [dados de organização](https://developers.google.com/search/docs/appearance/structured-data/organization), [URLs canônicas](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls), [sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap) e [redirecionamentos](https://developers.google.com/search/docs/crawling-indexing/301-redirects).
