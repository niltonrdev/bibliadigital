# Bíblia Digital

App simples para Nilton e Tamires lerem o **Novo Testamento** juntos (Bíblia Livre), com progresso compartilhado, marca-texto, comentários, plano diário e busca.

## 1. Criar um projeto novo no Supabase

Na organização que você já tem, clique em **New project**. Use qualquer nome (ex.: `bibliadigital`).

Em **Project Settings > API**, copie:

- Project URL
- anon public key

## 2. Banco de dados

No SQL Editor do projeto, cole e rode o arquivo `supabase/schema.sql`.

Isso cria as tabelas, a política do código do casal e o tempo real.

## 3. Variáveis locais

```bash
cp .env.example .env
```

Preencha `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`.

## 4. Rodar

```bash
npm install
npm run dev
```

No celular da mesma rede, use o endereço que o Vite mostrar (algo como `http://SEU-IP:5173`). Na primeira vez, o código do casal é `2508`. Depois, escolha Nilton ou Tamires.

No celular: menu do navegador > **Adicionar à tela inicial**.

## 5. GitHub + Vercel

```bash
git init
git add .
git commit -m "Primeira versão da Bíblia Digital"
git remote add origin https://github.com/niltonrdev/bibliadigital.git
git branch -M main
git push -u origin main
```

Na [Vercel](https://vercel.com): importe o repositório e cadastre as mesmas duas variáveis (`VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`). Não coloque a service role key.

## Créditos do texto

[Bíblia Livre](https://sites.google.com/site/biblialivre/) — Creative Commons Atribuição 3.0 Brasil.
