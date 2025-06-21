# 🔐 ZeroTrust_VCs – Acesso Seguro à Nuvem com Zero Trust e Credenciais Verificáveis

Bem-vindo ao **ZeroTrust_VCs**, uma aplicação de prova de conceito que demonstra uma **Arquitetura Zero Trust (ZTA)** para acesso seguro à nuvem. Este projeto utiliza **contratos inteligentes**, **Credenciais Verificáveis (VCs)** e **Identificadores Descentralizados (DIDs)** para garantir **segurança**, **controle de acesso** e **auditabilidade** em um ambiente descentralizado.

Este repositório é o trabalho final da disciplina **IA012 – Segurança em Comunicação de Dados**, da Faculdade de Engenharia Elétrica e de Computação (FEEC), UNICAMP.

## 📘 Tema do Projeto

**Objetivo:**  
Explorar os desafios de tornar técnicas de **Zero Trust** mais **amigáveis** e **acessíveis** sem comprometer o alto nível de segurança esperado em sistemas modernos.


## Slides:
[Slides da apresentação](https://www.canva.com/design/DAGqW0uCK-M/JF1jZ3MrgiXaxCY4BvDsKA/edit?utm_content=DAGqW0uCK-M&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)


## 🚀 Funcionalidades

- **Arquitetura Zero Trust (ZTA):** Implementa os princípios da NIST SP 800-207 para verificação contínua e acesso mínimo.
- **Contratos Inteligentes:** Gerencia autenticação e autorização via blockchain Ethereum.
- **Identidade Descentralizada:** Utiliza DIDs para gestão de identidade auto-soberana.
- **Credenciais Verificáveis (VCs):** Garante identidades seguras e verificáveis para usuários e organizações.
- **Avaliação Dinâmica de Confiança:** Determina a elegibilidade para colaborações com base em interações passadas e reputação.
- **Registro em Blockchain:** Armazena interações e identidades para transparência e auditabilidade.

## 📁 Estrutura do Repositório

```plaintext
ZeroTrust_VCs/
├── backend/           # Projeto Hardhat com contratos inteligentes
├── frontend/          # Aplicação web frontend (React/Next.js)
├── slides/            # Slides da apresentação final (PDF)
├── README.md          # Este arquivo
```

## ⚙️ Tecnologias Utilizadas

- **Solidity**: Desenvolvimento de contratos inteligentes Ethereum.
- **Hardhat**: Ambiente de desenvolvimento para compilação, teste e deploy de contratos.
- **Ethers.js**: Integração entre frontend e blockchain.
- **React.js / Next.js**: Interface de usuário interativa.
- **Blockchain**: Rede local Hardhat ou compatível com EVM (ex.: Ethereum Sepolia).
- **DIDs / VCs**: Padrões de identidade auto-soberana para autenticação segura.

## 🧠 Conceitos Centrais

O projeto é baseado nos princípios da **Arquitetura Zero Trust (NIST SP 800-207)**:
- **Verificação Contínua:** Toda solicitação de acesso é verificada, autenticada e autorizada.
- **Acesso Mínimo:** Usuários e sistemas recebem apenas os privilégios necessários, baseados em políticas dinâmicas.
- **Segmentação de Rede:** Comunicação segura, mesmo dentro da mesma rede.
- **Monitoramento em Tempo Real:** Rastreia tráfego, acessos e comportamentos para detectar anomalias.
- **Confiança Baseada em Blockchain:** Usa contratos inteligentes e DIDs/VCs para gestão descentralizada de identidade e confiança.

## 💻 Como Executar

Siga os passos abaixo para configurar e executar o projeto localmente.

### Pré-requisitos

- **Node.js** (v18 ou superior)
- **Yarn** ou **npm**
- **Hardhat** (instalado via npm)
- **MetaMask** ou outra carteira compatível com Ethereum (para testes)
- Navegador web moderno

### Instalação e Configuração

1. **Clonar o Repositório**
   ```bash
   git clone https://github.com/vdsilveira/ZeroTrust_VCs.git
   cd ZeroTrust_VCs
   ```

2. **Configurar o Backend (Contratos Inteligentes)**
   ```bash
   cd backend
   npm install
   npx hardhat compile
   npx hardhat node
   npx hardhat run scripts/deploy.js --network localhost
   ```
   - Isso inicia uma rede local Hardhat e faz o deploy dos contratos inteligentes.
   - Anote o endereço do contrato exibido no terminal para configuração do frontend.

3. **Configurar o Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   - O frontend estará disponível em `http://localhost:3000` (ou outra porta, se especificada).
   - Certifique-se de configurar o frontend com o endereço do contrato implantado (atualize no arquivo de configuração, se necessário).
Demonstração em Vídeo

[![Demonstração em vídeo](https://img.youtube.com/vi/dQcuyVOn_Jc/0.jpg)](https://www.youtube.com/watch?v=dQcuyVOn_Jc)

### Exemplo de Uso
- Acesse a interface web e autentique-se usando um par DID/VC.
- O contrato inteligente verificará as credenciais e concederá acesso com base em políticas de confiança dinâmica.
- Monitore logs de acesso e pontuações de confiança via blockchain.

## 📊 Resultados Obtidos

- **Autenticação Robusta:** Autenticação segura de usuários e organizações usando DIDs e VCs via contratos inteligentes.
- **Avaliação Dinâmica de Confiança:** Mecanismo de inferência de confiança para determinar elegibilidade de colaboração com base na qualidade de recursos fornecidos anteriormente.
- **Auditabilidade:** Todas as interações e identidades são registradas na blockchain para transparência.

## ⚠️ Desafios e Limitações

- **Fricção do Usuário:** Autenticação frequente (ex.: MFA) pode prejudicar a experiência do usuário.
- **Problemas de Integração:** Algumas aplicações podem não se integrar bem com soluções Zero Trust.
- **Visibilidade:** Controle e visibilidade limitados para usuários não técnicos.
- **Escalabilidade:** Gerenciamento de dados de alta entropia e autenticação em tempo real em ambientes de nuvem complexos.

## 🌟 Tornando o Zero Trust Mais Amigável

Para abordar os desafios de usabilidade, o projeto explora:
- **Autenticação Adaptativa:** Ajusta os requisitos de autenticação com base no risco e contexto (ex.: dispositivo, localização, comportamento).
- **SSO com MFA Leve:** Combina Single Sign-On (SSO) com autenticação multifator rápida e fluida (ex.: reconhecimento facial, tokens via aplicativo).
- **Segurança Invisível:** Monitoramento em segundo plano e análise comportamental para minimizar interrupções.
- **Design Centrado no Usuário:** Interfaces intuitivas e painéis de controle simples para facilitar a gestão de acessos e políticas.

## 🔍 Oportunidades de Pesquisa

- **Estabelecimento de Confiança Inicial:** Como confiar em entidades sem interações prévias.
- **Gestão de Confiança Dinâmica:** Avaliação contínua de confiabilidade com base em contexto e histórico.
- **Ameaças Internas:** Mitigação de riscos de usuários privilegiados maliciosos ou negligentes.
- **Alta Entropia de Dados:** Gerenciamento de grandes volumes de dados heterogêneos e ruidosos.
- **Dispositivos IoT:** Implementação de Zero Trust em dispositivos com recursos computacionais limitados.
- **Privacidade vs. Eficiência:** Balanceamento entre proteção de dados sensíveis e desempenho em tempo real.

## 📚 Referências

1. Khan, Muhammad Kashif et al. *A Survey on Zero Trust Architecture: Challenges and Future Trends.* Wiley, 2022. [Link](https://onlinelibrary.wiley.com/doi/full/10.1155/2022)
2. Challener, John et al. *Zero Trust Architecture.* NIST SP 800-207, 2020. [Link](https://nvlpubs.nist.gov/nistpubs/specialpublications/NIST.SP.800-207.pdf)
3. Bouazizi, Mohamed Salah et al. *Security Strategy for Collaboration Systems.* IEEE ISNCC 2023. [DOI](https://doi.org/10.1109/ISNCC58260.2023.10323311)
4. Silveira, Vinicius D. *ZeroTrust_VCs.* GitHub, 2025. [Link](https://github.com/vdsilveira/ZeroTrust_VCs)

## 🎓 Créditos

- **Autor:** Vinicius D. Silveira
- **Orientador:** Prof. Marco A. Amaral Henriques
- **Curso:** Engenharia de Computação, UNICAMP
- **Disciplina:** IA012 – Segurança em Comunicação de Dados
- **Data:** Junho de 2025

## 🙏 Agradecimentos

Este projeto aplica conceitos avançados de **segurança da informação**, **blockchain** e **identidade descentralizada** para enfrentar desafios reais de colaboração interorganizacional segura em ambientes de nuvem. Agradecimentos especiais à comunidade da FEEC-UNICAMP pelo apoio e orientação.

## 📬 Contato

Para perguntas ou feedback, abra uma issue no repositório ou entre em contato com o autor via GitHub.
