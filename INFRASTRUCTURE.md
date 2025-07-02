## Infrastructure Documentation for `bc_app`

### 1. Visão Geral da Infraestrutura

A infraestrutura da aplicação `bc_app` é projetada para ser leve e eficiente, utilizando serviços da Amazon Web Services (AWS) e conteinerização Docker para implantação em produção. O objetivo é fornecer um ambiente robusto para a aplicação full-stack (backend Rails API e frontend React/Vite), garantindo acessibilidade e separação de responsabilidades.

### 2. Componentes da Infraestrutura

A infraestrutura é construída sobre os seguintes pilares:

#### 2.1. Provedor de Nuvem: Amazon Web Services (AWS)

A AWS é a plataforma de nuvem escolhida para hospedar a aplicação, aproveitando seus serviços para computação, rede e armazenamento.

#### 2.2. Instância de Computação: AWS EC2

*   **Tipo de Instância:** `t2.micro` (adequada para cargas de trabalho leves e ambientes de desenvolvimento/teste).
*   **Sistema Operacional:** Ubuntu Server 24.04 LTS.
*   **Key Pair:** `bc-app.pem` (utilizado para acesso SSH seguro à instância).
*   **Elastic IP:** Um endereço IP público estático (`3.16.179.21`) é associado à instância EC2. Isso garante que o IP público da aplicação permaneça o mesmo, mesmo após reinicializações da instância, facilitando a configuração de DNS e o acesso consistente.

#### 2.3. Rede e Segurança: AWS Security Group e Docker Network

*   **Security Group (`bc-app-sg`):** Atua como um firewall virtual para a instância EC2, controlando o tráfego de entrada e saída. As seguintes portas estão abertas:
    *   **Porta 22 (SSH):** Para acesso administrativo à instância.
    *   **Porta 80 (HTTP):** Para tráfego web não criptografado, servido pelo Nginx.
    *   **Porta 443 (HTTPS):** Para tráfego web criptografado (preparação para futura configuração SSL/TLS).
*   **Docker Network (`bc-app-network`):** Uma rede interna Docker é criada na instância EC2 para permitir a comunicação segura e isolada entre os contêineres da aplicação (PostgreSQL, Backend, Frontend, Nginx). Isso garante que os serviços possam se comunicar usando seus nomes de contêiner (ex: `postgres-db`, `backend-app`) sem expor portas diretamente ao host ou à internet.

#### 2.4. Armazenamento: Docker Volume para PostgreSQL

*   **Docker Volume (`postgres-data`):** Um volume Docker persistente é criado e montado no contêiner PostgreSQL (`/var/lib/postgresql/data`). Isso garante que os dados do banco de dados não sejam perdidos quando o contêiner é reiniciado, removido ou atualizado, desacoplando o ciclo de vida dos dados do ciclo de vida do contêiner.

#### 2.5. Registro de Imagens Docker: Docker Hub

*   **Repositório:** `defcaique/bc_app` no Docker Hub.
*   **Tags:** Imagens do backend (`:backend`) e frontend (`:frontend`) são construídas localmente e publicadas no Docker Hub. Isso serve como um registro centralizado para as imagens Docker da aplicação, facilitando a implantação em qualquer ambiente que tenha acesso ao Docker Hub.

### 3. Modelo de Implantação: Docker Puro em Produção

A `bc_app` adota uma estratégia de implantação em produção baseada em **Docker puro**, o que significa que os contêineres são gerenciados diretamente com comandos Docker na instância EC2, sem a necessidade de orquestradores mais complexos como Docker Compose (que é usado apenas em desenvolvimento) ou Kubernetes.

#### 3.1. Imagens Docker da Aplicação

*   **Backend (`defcaique/bc_app:backend`):** Contém a aplicação Rails API.
*   **Frontend (`defcaique/bc_app:frontend`):** Contém a aplicação React/Vite, servida por Nginx.

#### 3.2. Orquestração de Contêineres (Comandos Docker)

Os serviços são iniciados e gerenciados através de comandos `docker run` e `docker exec` na instância EC2. A sequência de inicialização é crucial para garantir que as dependências estejam disponíveis:

1.  **Criação da Rede Docker:** `docker network create bc-app-network`
2.  **Criação do Volume PostgreSQL:** `docker volume create postgres-data`
3.  **Início do Contêiner PostgreSQL:** O contêiner `postgres-db` é iniciado, conectado à `bc-app-network` e com o volume `postgres-data` montado.
4.  **Início do Contêiner Backend:** O contêiner `backend-app` é iniciado, conectado à `bc-app-network`, com variáveis de ambiente para o banco de dados e chaves secretas.
5.  **Execução de Migrações do Banco de Dados:** Após o backend iniciar, as migrações do Rails são executadas via `docker exec` para configurar o esquema do banco de dados.
6.  **Início do Contêiner Frontend:** O contêiner `frontend-app` é iniciado, conectado à `bc-app-network`, com a `VITE_API_BASE_URL` configurada.
7.  **Início do Contêiner Nginx Reverse Proxy:** O contêiner `nginx-proxy` é iniciado, conectado à `bc-app-network`, mapeando a porta 80 do host para a porta 80 do contêiner. Ele utiliza um arquivo `nginx.conf` customizado para rotear as requisições.

#### 3.3. Roteamento de Tráfego: Nginx Reverse Proxy

O Nginx atua como um **reverse proxy** e ponto de entrada para a aplicação. Ele é configurado para:

*   **Servir o Frontend:** Requisições para a raiz (`/`) são encaminhadas para o contêiner `frontend-app`.
*   **Encaminhar para o Backend:** Requisições para `/api/` são encaminhadas para o contêiner `backend-app`.
*   **Configuração (`nginx/nginx.conf`):**
    ```nginx
    server {
        listen 80;
        server_name <Elastic IP ou Domínio>; # Ex: 3.16.179.21

        location / {
            proxy_pass http://frontend-app:80; # Encaminha para o contêiner frontend
            # Headers para proxy
        }

        location /api/ {
            proxy_pass http://backend-app:3000; # Encaminha para o contêiner backend
            # Headers para proxy
        }
    }
    ```
    Esta configuração permite que o frontend e o backend sejam acessados através de um único ponto de entrada (o Nginx), simplificando a exposição da aplicação e permitindo futuras configurações de SSL/TLS no Nginx.

### 4. Processo de Implantação (Foco na Infraestrutura)

O processo de implantação em produção envolve as seguintes etapas de infraestrutura:

1.  **Preparação da Imagem Docker:**
    *   Construção das imagens Docker do backend e frontend localmente.
    *   Publicação das imagens no Docker Hub.
2.  **Configuração da Instância EC2:**
    *   Criação de uma instância EC2 (`t2.micro`, Ubuntu).
    *   Associação de um Elastic IP para um endereço público fixo.
    *   Configuração do Security Group para permitir tráfego SSH, HTTP e HTTPS.
3.  **Preparação do Servidor:**
    *   Conexão SSH à instância EC2.
    *   Instalação do Docker na instância.
    *   Criação de diretórios para a aplicação e arquivos de configuração (ex: `nginx/nginx.conf`, `.env`).
    *   Configuração do `nginx.conf` e do arquivo `.env` com as variáveis de ambiente necessárias (senhas, chaves, URLs da API).
4.  **Execução dos Contêineres:**
    *   Criação da rede Docker (`bc-app-network`).
    *   Criação do volume Docker para o PostgreSQL (`postgres-data`).
    *   Início dos contêineres PostgreSQL, Backend, Frontend e Nginx na ordem correta, utilizando os comandos `docker run` e conectando-os à rede Docker.
    *   Execução das migrações do banco de dados no contêiner do backend.

### 5. Escalabilidade e Alta Disponibilidade (Considerações Futuras)

A arquitetura atual, baseada em uma única instância EC2 e Docker puro, é adequada para ambientes de desenvolvimento, teste e pequenas cargas de trabalho. Para escalabilidade e alta disponibilidade em produção, as seguintes melhorias seriam consideradas:

*   **Balanceamento de Carga:** Utilização de um AWS Application Load Balancer (ALB) para distribuir o tráfego entre múltiplas instâncias do frontend e/ou backend.
*   **Serviços Gerenciados:** Migração do banco de dados PostgreSQL para um serviço gerenciado como AWS RDS, que oferece backups automáticos, replicação, escalabilidade e alta disponibilidade sem a necessidade de gerenciar o banco de dados diretamente em um contêiner.
*   **Orquestração de Contêineres:** Adoção de um orquestrador de contêineres como AWS ECS (Elastic Container Service) ou Kubernetes (via AWS EKS) para gerenciar o ciclo de vida dos contêineres, escalabilidade automática, auto-healing e implantações contínuas.
*   **Auto Scaling:** Configuração de grupos de Auto Scaling para EC2 para ajustar automaticamente o número de instâncias com base na demanda.

### 6. Monitoramento e Logging (Considerações Futuras)

Atualmente, o monitoramento e logging seriam feitos através dos logs do Docker (`docker logs <container_name>`) e ferramentas básicas do sistema operacional. Para um ambiente de produção robusto, seria essencial implementar:

*   **Logs Centralizados:** Utilização de serviços como AWS CloudWatch Logs ou um stack ELK (Elasticsearch, Logstash, Kibana) para coletar, armazenar e analisar logs de todos os contêineres.
*   **Métricas de Performance:** Coleta de métricas de CPU, memória, rede e disco da instância EC2 (via CloudWatch Metrics) e métricas de aplicação (ex: tempo de resposta da API, erros) para identificar gargalos e problemas.
*   **Alertas:** Configuração de alertas (ex: via AWS SNS) para notificar a equipe sobre anomalias ou falhas críticas.
