# 📱 Aplicação Mobile de Blogging (React Native)

Este repositório contém a aplicação mobile da plataforma de blogging, desenvolvida com **React Native + Expo** na pasta `mobile/`.

A interface foi organizada para atender os requisitos acadêmicos de:
- leitura e busca de posts;
- criação/edição/administração de postagens (docentes);
- CRUD administrativo de docentes e alunos(as);
- autenticação e autorização por perfil.

## ✅ Requisitos funcionais atendidos

1. **Página principal (lista de posts)**
   - Listagem de posts com título, autor e descrição.
   - Campo de busca por palavras-chave.
2. **Página de leitura de post**
   - Exibição completa do conteúdo.
   - Envio de comentários (opcional) no endpoint de comentários.
3. **Página de criação de postagens (docentes)**
   - Formulário com título, conteúdo e autor.
4. **Página de edição de postagens (docentes)**
   - Carregamento do post por ID e atualização.
5. **Criação de professores**
   - Formulário administrativo para cadastro.
6. **Edição de professores**
   - Reaproveita o mesmo formulário em modo de edição.
7. **Listagem paginada de professores**
   - Ações de editar e excluir por item.
8. **Requisitos 5, 6 e 7 para estudantes**
   - CRUD e listagem paginada seguindo o padrão de docentes.
9. **Página administrativa de posts**
   - Listagem geral com ações de editar e excluir.
10. **Autenticação e autorização**
   - Login via endpoint de autenticação.
   - Apenas usuários autenticados acessam o app.
   - Recursos administrativos protegidos para perfil docente.

---

## 🧱 Stack técnica

- **React Native** com **Expo**
- **TypeScript**
- **React Navigation** (Stack + Bottom Tabs)
- **Context API** para estado de autenticação
- **AsyncStorage** para persistência de sessão
- Cliente HTTP com `fetch` centralizado (`apiRequest`)

---

## ▶️ Setup e execução

### Pré-requisitos
- Node.js 18+
- npm 9+
- Expo CLI (`npm install -g expo-cli`) *(opcional, também pode usar npx)*

### Passos

```bash
cd mobile
npm install
npm run start
```

Depois, abra no:
- **Expo Go** (Android/iOS) via QR Code; ou
- emulador/simulador configurado.

---

## 🗂️ Arquitetura do projeto

```text
mobile/
├── App.tsx                        # Bootstrap da aplicação
├── src/
│   ├── api/client.ts              # Cliente REST (headers + token)
│   ├── components/                # Componentes reutilizáveis de UI
│   ├── context/AuthContext.tsx    # Sessão, login, logout e roles
│   ├── navigation/                # Navegação principal (Stack/Tabs)
│   ├── screens/                   # Telas de negócio
│   ├── types/                     # Tipos globais
│   └── utils/constants.ts         # Rotas e API base URL
└── package.json
```

### Organização de navegação
- Usuário **não autenticado**: tela de login.
- Usuário **autenticado**: acesso às tabs.
- Perfil **teacher**: tabs administrativas (Docentes, Alunos, Admin) + telas de criação/edição.
- Perfil **student**: somente visualização de posts e leitura.

---

## 🔌 Integração com back-end

Defina a URL da API em `mobile/src/utils/constants.ts`:

```ts
export const API_BASE_URL = 'http://localhost:3000';
```

> Em dispositivo físico, substitua `localhost` pelo IP da máquina que executa o back-end.

### Endpoints consumidos
- `POST /auth/login`
- `GET /posts`
- `GET /posts/:id`
- `POST /posts`
- `PUT /posts/:id`
- `DELETE /posts/:id`
- `POST /posts/:id/comments`
- `GET /teachers?page=n`
- `GET /teachers/:id`
- `POST /teachers`
- `PUT /teachers/:id`
- `DELETE /teachers/:id`
- `GET /students?page=n`
- `GET /students/:id`
- `POST /students`
- `PUT /students/:id`
- `DELETE /students/:id`

---

## 👩‍🏫 Guia de uso rápido

1. Faça login com um usuário válido.
2. Vá em **Posts** para listar, buscar e abrir detalhes.
3. Se for docente, use:
   - **Nova postagem** para criar;
   - **Admin** para editar/excluir posts;
   - **Docentes** e **Alunos** para CRUD administrativo.

---

## 🎥 Entrega acadêmica sugerida

Para compor a entrega final da disciplina:
1. **Código-fonte** neste repositório.
2. **Vídeo (até 15 min)** demonstrando fluxo, autenticação, permissões e CRUDs.
3. **Documento técnico** com arquitetura, decisões de implementação e desafios encontrados.

---

## 📄 Licença

MIT.
