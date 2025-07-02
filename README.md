# bc_app

Um cardápio digital moderno e eficiente que simplifica o processo de pedidos, enviando-os diretamente para o WhatsApp do estabelecimento. Desenvolvido para otimizar a gestão de pedidos e a experiência do cliente, eliminando a necessidade de lidar com anotações manuais.

## Visão Geral do Projeto

A `bc_app` é uma aplicação full-stack moderna, composta por um **backend** robusto desenvolvido em Ruby on Rails e um **frontend** dinâmico construído com React, Vite e TypeScript. A arquitetura é baseada em microsserviços conteinerizados, utilizando Docker para empacotamento e Docker Compose para orquestração em ambiente de desenvolvimento, facilitando o desenvolvimento, a implantação e a escalabilidade.

## Tecnologias Utilizadas

### Backend (Rails API)

*   **Linguagem:** Ruby
*   **Framework:** Ruby on Rails
*   **Banco de Dados:** PostgreSQL
*   **Conteinerização:** Docker

### Frontend (React/Vite/TypeScript)

*   **Linguagem:** TypeScript
*   **Biblioteca UI:** React
*   **Ferramenta de Build:** Vite
*   **Estilização:** Tailwind CSS, shadcn-ui
*   **Gerenciador de Pacotes:** Bun
*   **Servidor Web (Produção):** Nginx
*   **Conteinerização:** Docker

## Arquitetura

A aplicação segue um padrão de **microsserviços**, onde o backend e o frontend são unidades de implantação independentes que se comunicam via uma API RESTful. A **conteinerização** com Docker garante isolamento e portabilidade para ambos os serviços. Em desenvolvimento, o **Docker Compose** orquestra esses contêineres, enquanto em produção, a implantação pode ser feita com **Docker puro** em uma única instância ou com orquestradores de contêineres mais avançados.

Para uma análise aprofundada da arquitetura de software da aplicação, consulte o documento:
[ARCHITECTURE.md](ARCHITECTURE.md)

Para detalhes sobre a infraestrutura de implantação em produção, consulte o documento:
[INFRASTRUCTURE.md](INFRASTRUCTURE.md)

## Configuração e Execução (Ambiente de Desenvolvimento)

Para configurar e executar a `bc_app` localmente, você precisará ter o Docker e o Docker Compose instalados em sua máquina.

### Pré-requisitos

*   [Docker](https://docs.docker.com/get-docker/)
*   [Docker Compose](https://docs.docker.com/compose/install/)

### Passos para Configuração

1.  **Clone o Repositório:**

    ```bash
    git clone <URL_DO_SEU_REPOSITORIO>
    cd bc_app
    ```

2.  **Crie o Arquivo de Variáveis de Ambiente (`.env`):**
    Na raiz do projeto (`bc_app/`), crie um arquivo chamado `.env` com o seguinte conteúdo. **Substitua `<SUA_SENHA_POSTGRES>` e `<SUA_RAILS_MASTER_KEY>` por valores seguros.**

    ```env
    # Variáveis de Ambiente para o Backend (Rails)
    POSTGRES_PASSWORD=<SUA_SENHA_POSTGRES>
    RAILS_MASTER_KEY=<SUA_RAILS_MASTER_KEY>
    SECRET_KEY_BASE=<SUA_SECRET_KEY_BASE>

    # Variáveis de Ambiente para o Frontend (Vite/React)
    # Em desenvolvimento, o frontend se comunica com o backend via o nome do serviço Docker
    VITE_API_BASE_URL=http://localhost:3000/api/v1
    ```

    *   **`POSTGRES_PASSWORD`**: Senha para o usuário `postgres` do banco de dados.
    *   **`RAILS_MASTER_KEY`**: Chave mestra do Rails. Você pode gerar uma executando `rails secret` dentro do diretório `backend/` (após o `bundle install` inicial, se necessário).
    *   **`SECRET_KEY_BASE`**: Chave secreta para o ambiente de produção do Rails. Você pode gerar uma executando `rails secret` dentro do diretório `backend/`.
    *   **`VITE_API_BASE_URL`**: URL base da API do backend para o frontend. Em desenvolvimento, `localhost:3000` é o padrão.

3.  **Construa e Inicie os Contêineres com Docker Compose:**
    Na raiz do projeto (`bc_app/`), execute:

    ```bash
    docker compose up --build -d
    ```

    *   `--build`: Constrói as imagens Docker para o backend e frontend.
    *   `-d`: Executa os contêineres em modo detached (em segundo plano).

4.  **Execute as Migrações do Banco de Dados:**
    Após os contêineres estarem em execução, você precisará criar o banco de dados e executar as migrações.

    ```bash
    docker exec bc_app-web-1 bundle exec rails db:create db:migrate
    ```

    *   `bc_app-web-1`: É o nome padrão do contêiner do serviço `web` (backend) gerado pelo Docker Compose. Você pode verificar o nome exato com `docker ps`.

### Acessando a Aplicação

*   **Frontend:** Acesse `http://localhost:3001` no seu navegador.
*   **Backend API:** A API estará disponível em `http://localhost:3000/api/v1`.

## Live Demo

Você pode ver a aplicação funcionando em produção, acessível via HTTPS. **Atenção:** Como o certificado SSL/TLS é autoassinado (para fins de estudo e sem custo de domínio), seu navegador exibirá um aviso de segurança. Você precisará aceitar a exceção para prosseguir.
[https://3.16.179.21](https://3.16.179.21)

## Estrutura do Projeto

*   `backend/`: Contém a aplicação Ruby on Rails (API).
*   `frontend/`: Contém a aplicação React/Vite/TypeScript.
*   `ARCHITECTURE.md`: Documentação detalhada da arquitetura de software.
*   `INFRASTRUCTURE.md`: Documentação detalhada da infraestrutura de implantação.
*   `.env.example`: Exemplo do arquivo de variáveis de ambiente.

## Implantação em Produção

A implantação em produção é projetada para ser feita com **Docker puro** em uma única instância EC2, utilizando Nginx como reverse proxy. Para detalhes completos sobre a infraestrutura de produção e o processo de implantação, consulte o documento `INFRASTRUCTURE.md`.
