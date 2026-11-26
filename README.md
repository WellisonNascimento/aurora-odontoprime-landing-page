# Aurora OdontoPrime

Landing page responsiva para uma clínica odontológica brasileira, feita com React, Vite, HTML semântico e CSS. A interface inclui canvas de partículas com profundidade sutil, revelação no scroll, cards com inclinação 3D, comparador antes/depois, carrossel editorial, FAQ em acordeão e modal acessível de pré-agendamento.

## Executar

```bash
npm install
npm run dev
```

Para gerar a versão de produção:

```bash
npm run build
npm run preview
```

## Testar online

A versão compilada é publicada pelo branch `gh-pages`:

https://wellisonnascimento.github.io/aurora-odontoprime-landing-page/

Para atualizar o site após mudanças, execute `npm run build` e publique o conteúdo de `dist/` no branch `gh-pages`.

## Arquivos principais

- `index.html`: idioma pt-BR, metadados e política CSP inicial.
- `style.css`: identidade visual, responsividade, animações, superfícies translúcidas e estados de acessibilidade.
- `src/App.tsx`: composição React e interações da página.
- `script.js`: sanitização, validação e simulação local do serviço de pré-agendamento.
- `.env.example`: exemplo de configuração exclusiva para um futuro backend.
- `.gitignore`: protege arquivos de ambiente e artefatos locais.

## Privacidade e segurança

- O formulário não transmite, registra ou persiste dados. `submitAppointmentRequest` simula uma resposta em memória; o formulário é limpo após a simulação e ao fechar o modal.
- Nenhum dado pessoal ou clínico é salvo em `localStorage`, `sessionStorage` ou cookies. O formulário não solicita informações de saúde.
- Nome, telefone brasileiro com DDD, e-mail e assunto passam por sanitização e validação estrita. O conteúdo do usuário nunca é inserido como HTML; mensagens de estado são escritas em `textContent`.
- O formulário exige consentimento LGPD, inclui campo honeypot e limita tentativas no cliente a três por minuto, com intervalo mínimo entre envios. Esses controles melhoram a experiência, mas não substituem validação, rate limit, honeypot e monitoramento no servidor.
- Não existem chaves de API no bundle. Para integrar CRM, e-mail ou agenda, conecte o cliente a um endpoint same-origin, por exemplo `POST /api/leads`, e mantenha URLs privadas, tokens e credenciais somente no backend. Use TLS, validação independente no servidor, controles contra CSRF conforme a arquitetura, política de retenção e acesso mínimo.
- A CSP em `index.html` é uma camada inicial via meta tag. Em produção, configure os mesmos controles também como cabeçalhos HTTP; `frame-ancestors`, HSTS e `X-Content-Type-Options` devem ser definidos no servidor. Revise a allowlist de fontes e imagens se trocar os fornecedores externos.
- Como o plugin de build entrega o JavaScript inline, `script-src` autoriza o hash SHA-256 exato do bundle atual em vez de liberar scripts inline. Se o código JavaScript ou as dependências mudarem, recalcule e atualize esse hash depois do build.
- O aviso de privacidade pode ser dispensado apenas durante a sessão da página; a preferência não é gravada.

### Integração futura do endpoint

O arquivo `.env.example` descreve variáveis para um servidor Node, não para o bundle Vite. Não renomeie credenciais para `VITE_*`: qualquer variável com esse prefixo pode ser incorporada ao JavaScript público. Antes de ativar um endpoint real, implemente no servidor autenticação interna com o provedor, limites de uso, validação e resposta sem ecoar dados sensíveis.

## Conteúdo demonstrativo

Os textos do carrossel estão identificados como relatos demonstrativos e não devem ser apresentados como avaliações verificadas. Substitua-os por depoimentos reais, verificados e autorizados antes da publicação. As imagens do comparador foram geradas para demonstração e não representam pacientes ou garantem resultados. Fotos de especialidades são hospedadas pelo Pexels e dependem de conexão externa.

Créditos das imagens Pexels usadas na interface:

- Laura Beauty Designer | Brasil: [consulta odontológica](https://www.pexels.com/photo/dentist-holding-dental-model-in-belo-horizonte-clinic-32852534/), [alinhadores](https://www.pexels.com/photo/invisalign-28407749/).
- Kaboompics: [planejamento de cor](https://www.pexels.com/photo/a-dentist-holding-a-dental-shade-guide-in-front-of-a-patient-6627575/), [conversa com paciente](https://www.pexels.com/photo/a-dentist-explaining-to-a-patient-using-a-dental-cast-5355723/).