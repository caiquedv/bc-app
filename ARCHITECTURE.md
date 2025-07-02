## Software Architecture Documentation for `bc_app`

### 1. Visão Geral e Princípios Arquiteturais

A aplicação `bc_app` exemplifica uma arquitetura de software moderna e distribuída, caracterizada por ser uma solução **full-stack** composta por dois serviços principais: um **backend** robusto desenvolvido em Ruby on Rails e um **frontend** dinâmico construído com React, Vite e TypeScript. Esta abordagem segue o padrão de **microsserviços**, onde cada componente (backend e frontend) é uma unidade de implantação independente, comunicando-se através de interfaces bem definidas.

Um pilar fundamental desta arquitetura é a **conteinerização**, utilizando **Docker** para empacotar cada serviço com suas dependências, garantindo isolamento e portabilidade. Para orquestração em ambiente de desenvolvimento, o **Docker Compose** é empregado, simplificando a gestão de múltiplos contêineres interconectados. Essa estratégia facilita o desenvolvimento, a implantação e a escalabilidade, permitindo que cada serviço seja desenvolvido, testado e implantado de forma independente.

### 2. Componentes da Arquitetura

#### 2.1. Backend (Rails API)

O backend atua como a camada de dados e lógica de negócio da aplicação, implementando uma **API RESTful** para comunicação com o frontend. Esta abordagem arquitetural permite uma separação clara de responsabilidades entre o cliente (frontend) e o servidor (backend).

*   **Tecnologia Principal:** Ruby on Rails (versão 3.3.0/3.3.6). Rails é um framework web que segue o padrão **Model-View-Controller (MVC)**, onde:
    *   **Modelos (Models):** Representam a lógica de negócio e a interação com o banco de dados (via Active Record).
    *   **Controladores (Controllers):** Gerenciam as requisições do usuário, interagem com os modelos e preparam os dados para as views (ou, neste caso, para as respostas da API).
    *   **Views:** Embora menos proeminentes em uma API pura, seriam responsáveis pela apresentação dos dados.
*   **Banco de Dados:** PostgreSQL (versão 16) é utilizado para persistência de dados. Escolhido por sua robustez, escalabilidade e conformidade com ACID, é um banco de dados relacional amplamente utilizado em aplicações de larga escala.
*   **Conteinerização (Docker):**
    *   **Imagem Base:** `ruby:3.3.6-slim`. A escolha de uma imagem `slim` visa otimizar o tamanho final do contêiner, reduzindo a superfície de ataque e o tempo de download.
    *   **Processo de Build:** Inclui a instalação de gems (`bundle install`), pré-compilação de assets e configuração do ambiente de produção. O **multi-stage build** (implícito pelo uso de `FROM base as build` e `FROM base` novamente) é uma técnica arquitetural que otimiza o tamanho da imagem final, removendo ferramentas de build desnecessárias em tempo de execução, resultando em contêineres mais leves e seguros.
    *   **Segurança:** O contêiner executa como um usuário `rails` não-root, uma prática de segurança recomendada para minimizar riscos em caso de comprometimento do contêiner.
    *   **Exposição de Porta:** A porta `3000` é exposta para comunicação, sendo a porta padrão para aplicações Rails.
*   **Orquestração (Docker Compose - `backend/docker-compose.yml` - Apenas para Desenvolvimento):**
    *   **Serviço `db`:** Utiliza a imagem `postgres:16`. Possui um volume persistente (`postgres_data`) para garantir a durabilidade dos dados do banco de dados entre as reinicializações do contêiner. Isso é crucial para o desenvolvimento, pois evita a perda de dados de teste.
    *   **Serviço `web`:** Constrói a imagem Docker a partir do `Dockerfile` local. Mapeia o diretório do código-fonte (`.:/rails`) para dentro do contêiner, permitindo que as alterações no código-fonte local sejam refletidas no contêiner durante o desenvolvimento. A porta `3000` do contêiner é mapeada para a porta `3000` do host, tornando a aplicação acessível externamente. Depende do serviço `db`, garantindo que o banco de dados esteja pronto antes que o serviço web tente se conectar. A conexão é estabelecida via `DATABASE_URL` (`postgresql://postgres:password@db`), utilizando o nome do serviço `db` como hostname dentro da rede Docker.

#### 2.1.1. Endpoints da API (v1)

A API expõe os seguintes recursos principais. A inclusão do prefixo `/v1` nas rotas é uma prática de **versionamento de API**, permitindo futuras iterações da API (ex: `/v2`) sem quebrar a compatibilidade com clientes existentes.

*   **`GET /api/v1/categories`**: Retorna uma lista completa de todas as categorias de produtos.
*   **`GET /api/v1/categories/:slug`**: Retorna os detalhes de uma categoria específica, identificada pelo seu `slug` único.
*   **`GET /api/v1/products`**: Retorna uma lista completa de todos os produtos.
*   **`GET /api/v1/products/:slug`**: Retorna os detalhes de um produto específico, identificado pelo seu `slug` único.
*   **`/up`**: Endpoint de saúde padrão do Rails, utilizado para verificar se a aplicação está ativa e respondendo.

#### 2.1.2. Modelos de Dados (Active Record)

Os modelos representam as entidades do domínio e suas interações com o banco de dados.

*   **`Category`**:
    *   **Atributos:** `id` (chave primária), `name` (string), `image_url` (string), `slug` (string), `created_at` (datetime), `updated_at` (datetime).
    *   **Validações:** Garante a presença de `name`, `image_url` e `slug`. O `slug` deve ser único e case-insensitive.
    *   **Associações:** `has_many :products` (uma categoria pode ter múltiplos produtos associados).
    *   **Índices:** Um índice único é definido para o campo `slug` para otimização de busca e garantia de unicidade.
*   **`Product`**:
    *   **Atributos:** `id` (chave primária), `name` (string), `description` (text), `price` (decimal), `image_url` (string), `status` (integer, enum), `category_id` (bigint), `slug` (string), `created_at` (datetime), `updated_at` (datetime).
    *   **Validações:** Garante a presença de `name`, `price`, `status` e `slug`. O `price` deve ser um valor numérico maior ou igual a zero. O `slug` deve ser único e case-insensitive.
    *   **Associações:** `belongs_to :category` (um produto pertence a uma única categoria).
    *   **Enum:** O atributo `status` é um enum com os valores `active` (0) e `inactive` (1).
    *   **Chaves Estrangeiras:** `category_id` é uma chave estrangeira que referencia a tabela `categories`.
    *   **Índices:** Índices são definidos para `category_id` (para otimização de joins) e `slug` (único).

#### 2.2. Frontend (React/Vite/TypeScript)

O frontend é a interface do usuário da aplicação, responsável por consumir a API do backend e apresentar os dados de forma interativa. Ele segue o padrão de **Single Page Application (SPA)**, onde a maior parte da lógica de UI e roteamento é executada no lado do cliente, proporcionando uma experiência de usuário mais fluida.

*   **Tecnologias Principais:**
    *   **React:** Uma biblioteca JavaScript declarativa e baseada em componentes para construir interfaces de usuário. A arquitetura baseada em componentes promove a reutilização de código e a manutenibilidade.
    *   **Vite:** Uma ferramenta de build de próxima geração que oferece um ambiente de desenvolvimento extremamente rápido e otimiza o processo de build para produção. Sua abordagem de "no-bundle" durante o desenvolvimento e o uso de Rollup para produção resultam em tempos de carregamento e recarregamento instantâneos.
    *   **TypeScript:** Um superconjunto tipado de JavaScript que adiciona segurança de tipo em tempo de desenvolvimento, reduzindo erros e melhorando a manutenibilidade do código, especialmente em projetos maiores.
    *   **shadcn-ui:** Uma coleção de componentes de UI reutilizáveis e acessíveis, construídos sobre Radix UI e estilizados com Tailwind CSS. Promove um design consistente e acelera o desenvolvimento da interface.
    *   **Tailwind CSS:** Um framework CSS utilitário que permite a criação de designs personalizados diretamente no HTML/JSX, promovendo um desenvolvimento ágil e um CSS otimizado.
*   **Gerenciador de Pacotes:** Bun, um runtime JavaScript e gerenciador de pacotes rápido, utilizado para gerenciar as dependências do projeto.
*   **Servidor Web:** Nginx é utilizado para servir os arquivos estáticos do frontend em produção. É um servidor web leve e de alta performance, ideal para servir SPAs.
*   **Conteinerização (Docker - Multi-stage build):**
    *   **Estágio de Build (`builder`):** Utiliza a imagem `oven/bun:1`. Neste estágio, todas as dependências são instaladas e a aplicação é compilada para produção. O uso de `ARG` e `ENV` para `VITE_API_BASE_URL` demonstra a capacidade de injetar variáveis de ambiente em tempo de build, permitindo que o frontend saiba para qual API se conectar. O **multi-stage build** é uma técnica arquitetural que otimiza o tamanho da imagem final, removendo ferramentas de build desnecessárias em tempo de execução, resultando em contêineres mais leves e seguros.
    *   **Estágio de Serviço:** Utiliza a imagem `nginx:stable-alpine`. Este estágio é otimizado para servir apenas os artefatos de build gerados no estágio anterior, resultando em uma imagem final menor e mais segura. O Nginx é configurado para servir os arquivos estáticos e lidar com o roteamento de SPA (redirecionando todas as requisições para o `index.html` para que o `react-router-dom` possa assumir o controle).
*   **Orquestração (Docker Compose - `frontend/docker-compose.yml` - Apenas para Desenvolvimento):**
    *   **Serviço `frontend`:** Constrói a imagem Docker a partir do `Dockerfile` local. A porta `80` do contêiner (Nginx) é mapeada para a porta `3001` do host, tornando o frontend acessível durante o desenvolvimento.
    *   **Rede:** Utiliza uma rede `bc_app_network` para permitir a comunicação entre os serviços Docker, garantindo que o frontend possa se comunicar com o backend dentro do ambiente Docker Compose.

#### 2.2.1. Estrutura da Aplicação e Roteamento

A arquitetura do frontend, como uma SPA, depende de um sistema de roteamento robusto para gerenciar a navegação sem recarregar a página inteira. O `react-router-dom` é a biblioteca escolhida para implementar o **roteamento client-side**.

*   **Ponto de Entrada:** `frontend/src/main.tsx` é o arquivo principal que inicializa a aplicação React, renderizando o componente `App` no DOM. Este é o ponto de partida para toda a árvore de componentes da aplicação.
*   **Componente Principal:** `frontend/src/App.tsx` atua como o componente raiz da aplicação. Ele é responsável por configurar o roteamento global (`BrowserRouter` e `Routes`) e os provedores de contexto que disponibilizam dados e funcionalidades para toda a aplicação (ex: `CartProvider`, `TooltipProvider`).
*   **Roteamento (react-router-dom):** Define as rotas da aplicação, mapeando URLs a componentes React específicos:
    *   **`/`**: Mapeado para o componente `Menu` (página inicial, provavelmente exibindo categorias e produtos). Esta é a rota principal da aplicação.
    *   **`/product/:id`**: Mapeado para o componente `ProductDetails`, exibindo informações detalhadas de um produto. O `:id` é um **parâmetro de rota** que corresponde ao `slug` do produto, permitindo URLs amigáveis e semânticas.
    *   **`/cart`**: Mapeado para o componente `Cart`, exibindo o conteúdo do carrinho de compras.
    *   **`*`**: Uma rota curinga que direciona para o componente `NotFound` para URLs não reconhecidas, garantindo uma experiência de usuário consistente para páginas inexistentes.
    *   **`RedirectHandler`**: Um componente auxiliar que lida com redirecionamentos específicos, como os necessários para implantações em ambientes como GitHub Pages, onde o roteamento client-side pode exigir configurações adicionais para funcionar corretamente.

#### 2.2.2. Gerenciamento de Estado e Contexto

Em aplicações React, o gerenciamento de estado é crucial. Para o estado global do carrinho de compras, a aplicação utiliza a **Context API** do React, um padrão para compartilhar dados que podem ser considerados "globais" para uma árvore de componentes, sem a necessidade de passar props manualmente em cada nível.

*   **`CartProvider` (via `frontend/src/hooks/useCart.tsx`):**
    *   Implementa um contexto React (`CartContext`) e utiliza o hook `useState` para gerenciar o estado local do carrinho. O `CartProvider` encapsula a lógica de estado e as funções de manipulação do carrinho, disponibilizando-as para qualquer componente aninhado que utilize o hook `useCart`.
    *   **Persistência:** O estado do carrinho é salvo e carregado do `localStorage` do navegador, utilizando a chave `bigchicken-cart`. Esta estratégia garante que o carrinho persista entre as sessões do usuário, melhorando a experiência ao retornar à aplicação.
    *   **Interfaces de Dados do Carrinho:** A tipagem rigorosa com TypeScript é aplicada para definir a estrutura dos dados do carrinho, garantindo consistência e prevenindo erros em tempo de desenvolvimento:
        *   **`CartItem`**: Define a estrutura de um item no carrinho, incluindo `id` (identificador único do item no carrinho), `productId` (ID do produto), `name`, `price`, `quantity`, `image` (URL da imagem do produto), `observations` (opcional) e `additionals` (opcional, para itens adicionais como acompanhamentos).
        *   **`CartItemAdditional`**: Define a estrutura de itens adicionais associados a um `CartItem`, incluindo `id`, `name`, `price` e `quantity`.
    *   **Funções Expostas:** O `CartProvider` expõe um conjunto de funções para manipular o carrinho de forma controlada, como `addToCart`, `removeFromCart`, `updateQuantity`, `updateItem`, `clearCart`, `getTotalPrice` e `getTotalItems`.

#### 2.2.3. Comunicação com a API

A comunicação entre o frontend e o backend é um aspecto crítico de qualquer aplicação distribuída. Na `bc_app`, essa comunicação é gerenciada de forma centralizada para promover a consistência e a manutenibilidade.

*   A comunicação com a API do backend é centralizada no arquivo `frontend/src/lib/api.ts`. Esta abordagem cria uma **camada de abstração** para as chamadas de API, desacoplando os componentes da UI da lógica de requisição de dados.
*   **Tecnologia:** Utiliza a API `fetch` nativa do navegador para realizar requisições HTTP. A escolha do `fetch` em vez de bibliotecas de terceiros como Axios pode ser motivada pela simplicidade para casos de uso básicos e pela redução do tamanho do bundle.
*   **Configuração da URL Base:** A URL base da API (`API_BASE_URL`) é configurada dinamicamente através da variável de ambiente `VITE_API_BASE_URL` (injetada durante o build do Vite). Um fallback para `http://localhost:3000/api/v1` é fornecido para ambientes de desenvolvimento. Em ambientes de produção, esta URL é configurada para usar **HTTPS** (ex: `https://<seu-ip-publico>/api/v1`), garantindo a segurança da comunicação. Isso demonstra um padrão de **configuração adaptável ao ambiente**, essencial para implantações em diferentes estágios (desenvolvimento, produção).
*   **Funções de Requisição:** Contém funções assíncronas como `fetchCategories()` e `fetchProducts()` para buscar dados do backend. Essas funções encapsulam a lógica de requisição e tratamento de erros básicos, facilitando o consumo da API pelos componentes.
*   **Interfaces de Dados:** Define as interfaces TypeScript `Category`, `Product` e `ProductAdditional` para garantir a tipagem correta dos dados recebidos da API. O uso de TypeScript para definir contratos de dados entre frontend e backend é uma prática de **design-first** que melhora a segurança de tipo, a autocompleção e a detecção de erros em tempo de desenvolvimento.

#### 2.2.4. Ferramentas de Build, Desenvolvimento e Estilização

A escolha das ferramentas de build, desenvolvimento e estilização é fundamental para a produtividade do time e a qualidade do produto final. A `bc_app` adota um conjunto de ferramentas modernas que otimizam o ciclo de desenvolvimento frontend.

*   **Vite:** É a ferramenta de build e servidor de desenvolvimento utilizada, otimizando o processo de desenvolvimento frontend. Sua arquitetura baseada em módulos ES nativos e o uso de Rollup para produção resultam em tempos de inicialização e hot module replacement (HMR) extremamente rápidos, impactando diretamente a **produtividade do desenvolvedor**.
*   **`vite.config.ts`:** Este arquivo de configuração define como o Vite deve operar. As configurações incluem:
    *   Configuração do servidor de desenvolvimento para escutar em `host: "::"` e `port: 8080`, tornando-o acessível em diferentes ambientes de rede.
    *   Integração do plugin `@vitejs/plugin-react-swc` para suporte a React com SWC (Speedy Web Compiler), que oferece compilação de código JavaScript/TypeScript em alta velocidade.
    *   Definição de um **alias de caminho** `@` que resolve para o diretório `src` (`path.resolve(__dirname, "./src")`), simplificando as importações de módulos e melhorando a legibilidade do código.
*   **`package.json`:** Este arquivo não apenas lista as dependências do projeto, mas também define os **scripts de automação** para o ciclo de vida do desenvolvimento e build. Os scripts incluem `dev` (iniciar o servidor de desenvolvimento), `build` (compilar para produção), `build:dev` (compilar para desenvolvimento), `lint` (executar o linter para garantir a qualidade do código) e `preview` (pré-visualizar o build de produção). As dependências refletem as escolhas arquiteturais e de UI, incluindo `react`, `react-dom`, `react-router-dom`, componentes `@radix-ui/*` (base para `shadcn-ui`), `class-variance-authority`, `clsx`, `lucide-react` (ícones), `sonner` (para notificações toast), `react-hook-form` (gerenciamento de formulários), `zod` (validação de esquemas), `tailwind-merge` e `tailwindcss-animate`. As `devDependencies` contêm ferramentas de desenvolvimento como `typescript`, `eslint`, `tailwindcss` e `autoprefixer`, essenciais para o **pipeline de desenvolvimento**.
*   **Tailwind CSS (`tailwind.config.ts`):**
    *   Utilizado para estilização utilitária, permitindo a criação de designs personalizados diretamente no HTML/JSX. A filosofia do Tailwind promove um desenvolvimento ágil e um CSS otimizado, pois gera apenas o CSS necessário para os estilos utilizados, resultando em **bundles menores e carregamento mais rápido**.
    *   Configura cores personalizadas, raios de borda e animações, alinhando-se com o tema do `shadcn-ui`, garantindo **consistência visual** em toda a aplicação.
    *   Integra o plugin `tailwindcss-animate` para facilitar a criação de animações CSS, adicionando dinamismo à interface do usuário.
*   **shadcn-ui:** Fornece um conjunto de componentes de UI reutilizáveis e acessíveis, construídos sobre Radix UI e estilizados com Tailwind CSS. A adoção de uma biblioteca de componentes como `shadcn-ui` acelera o desenvolvimento da UI, garante **acessibilidade** e promove um **design system** consistente.

### 3. Fluxo de Comunicação

A comunicação entre o frontend e o backend é um exemplo clássico do **modelo cliente-servidor** em uma arquitetura distribuída. O frontend atua como o cliente, solicitando dados e serviços, enquanto o backend atua como o servidor, processando as requisições e fornecendo as respostas.

*   O **frontend**, servido pelo Nginx na porta `3001` do host, inicia as requisições HTTP. Essas requisições são tipicamente para buscar dados (GET) ou enviar informações (POST, PUT, DELETE) para o backend.
*   Essas requisições são direcionadas ao **backend**, que está escutando na porta `3000` do host. Dentro do ambiente Docker Compose, a comunicação entre os serviços `frontend` e `web` (backend) ocorre através da rede interna do Docker, utilizando os nomes dos serviços como hostnames.
*   A URL base da API do backend é configurada no frontend através da variável de ambiente `VITE_API_BASE_URL` durante o processo de build do Docker. Isso garante que o frontend saiba para onde enviar suas requisições, adaptando-se ao ambiente de execução (desenvolvimento ou produção).

### 4. Considerações Adicionais

### 4. Considerações Adicionais e Decisões Arquiteturais

Esta seção aborda algumas decisões arquiteturais e considerações importantes que moldam a `bc_app`.

*   **Estratégia de Implantação (Desenvolvimento vs. Produção):**
    *   **Ambiente de Desenvolvimento:** O **Docker Compose** é a ferramenta central para o ambiente de desenvolvimento local. Ele facilita a configuração e o gerenciamento de múltiplos serviços interconectados (backend, banco de dados, frontend) com um único comando. Isso promove um ambiente de desenvolvimento consistente e isolado, minimizando problemas de "funciona na minha máquina".
    *   **Ambiente de Produção:** A conteinerização e o uso de Dockerfiles individuais para cada serviço permitem que a aplicação seja implantada em ambientes de produção utilizando **Docker puro**, sem a necessidade do Docker Compose. Em produção, orquestradores de contêineres como Kubernetes ou Docker Swarm seriam utilizados para gerenciar a escala, resiliência e automação da implantação, aproveitando as imagens Docker construídas. Esta separação de ferramentas (Compose para dev, orquestrador para prod) é uma prática comum que otimiza cada fase do ciclo de vida da aplicação.
*   **Modularidade e Escalabilidade:** A arquitetura de microsserviços, com backend e frontend separados e conteinerizados, promove a modularidade. Cada serviço pode ser desenvolvido, testado e implantado de forma independente. Além disso, a conteinerização facilita a escalabilidade horizontal, permitindo que instâncias de cada serviço sejam adicionadas ou removidas conforme a demanda, sem afetar os outros componentes.
*   **Manutenibilidade:** A separação de responsabilidades e o uso de tecnologias bem definidas para cada camada (Rails para backend, React para frontend) contribuem para a manutenibilidade do código. A tipagem forte com TypeScript no frontend e as convenções do Rails no backend ajudam a reduzir erros e facilitam a colaboração entre desenvolvedores.
*   **Desempenho:** A escolha de ferramentas como Vite para o frontend e Nginx para servir os assets estáticos, juntamente com a otimização de imagens Docker (multi-stage builds), visa garantir um bom desempenho da aplicação, tanto em termos de tempo de carregamento quanto de responsividade.