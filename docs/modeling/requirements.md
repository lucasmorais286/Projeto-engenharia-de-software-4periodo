# 📄 Documentação de Requisitos – Sistema de Geração e Agendamento de Posts

## 1. Visão Geral
O sistema foi desenvolvido para facilitar e automatizar a criação de conteúdo para o Instagram, permitindo que o usuário gere imagens e legendas com IA, agende e publique seus posts diretamente na rede social.

---

## 2. Metodologia de Elicitação

- Entrevistas com stakeholders
- Brainstorming com a equipe
- Estudo de ferramentas similares no mercado

---

## 3. Requisitos Funcionais (RF)

| Código | Requisito                                                                 | Prioridade | Status         |
|--------|---------------------------------------------------------------------------|------------|----------------|
| RF01   | Permitir login com conta do Instagram                                     | Alta       | Implementado   |
| RF02   | Gerar automaticamente imagens e legendas utilizando IA                   | Alta       | Implementado   |
| RF03   | Permitir escolha entre sugestões geradas pelo sistema                     | Média      | Implementado   |
| RF04   | Agendar postagens para data e hora específicas                             | Alta       | Implementado   |
| RF05   | Visualizar histórico de agendamentos e publicações                        | Média      | Implementado   |
| RF06   | Visualizar o status de execução de posts agendados                        | Média      | Implementado   |

---

## 4. Requisitos Não Funcionais (RNF)

| Código | Requisito                                                                 | Prioridade |
|--------|--------------------------------------------------------------------------|------------|
| RNF01  | Interface responsiva para dispositivos móveis                            | Alta       |
| RNF02  | Tempo de resposta inferior a 2 segundos                                   | Alta       |
| RNF03  | Suportar múltiplos usuários simultaneamente                               | Média      |
| RNF04  | Compatibilidade com navegadores modernos (Chrome, Firefox, Edge, Safari) | Média      |
| RNF05  | Proteção contra injeções maliciosas (ex: SQL Injection)                  | Alta       |
| RNF06  | Armazenamento seguro de senhas e tokens (hash e criptografia)            | Alta       |

---

## 5. Rastreabilidade de Requisitos

| Requisito | Casos de Uso                     | Módulo/Componente        | Arquivo/Serviço            |
|-----------|----------------------------------|---------------------------|-----------------------------|
| RF01      | Login com Instagram              | AuthService               | `auth.service.ts`          |
| RF02      | Geração de Conteúdo com IA       | PostService               | `post.service.ts`          |
| RF03      | Seleção de Sugestões             | Frontend / PostService    | `post-selection.tsx`       |
| RF04      | Agendamento de Publicações       | SchedulerService          | `scheduler.service.ts`     |
| RF05      | Histórico de Publicações         | Frontend / Scheduler      | `history.page.tsx`         |
| RF06      | Verificação de Status            | SchedulerService          | `scheduler.service.ts`     |

---
