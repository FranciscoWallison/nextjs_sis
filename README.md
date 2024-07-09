## Começando

## Variáveis  de ambiente

Na maquina que irar rodar o projeto conforme as 'Project settings' do firebase:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
```

## Iniciando o projeto

Primeiro, execute o servidor de desenvolvimento:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## Comandos de knex de migrate


````
MIGRATION

criar
npx knex migrate:make criar_tabela_usuarios --knexfile db/knexfile.js
npx knex migrate:make criar_tabela_manutencoes_programadas --knexfile=db/knexfile.js
npx knex migrate:make criar_tabela_cumprimento_manutencoes --knexfile=db/knexfile.js
npx knex migrate:make criar_tabela_backlog_ordens_servico --knexfile=db/knexfile.js
npx knex migrate:make criar_tabela_kpi_manutencoes --knexfile=db/knexfile.js
npx knex migrate:make criar_tabela_manutencoes --knexfile=db/knexfile.js

executar
npx knex migrate:latest --knexfile=db/knexfile.js



SEED

Cria 
npx knex seed:make seed_usuarios --knexfile db/knexfile.js
npx knex seed:make seed_manutencoes_programadas --knexfile=db/knexfile.js
npx knex seed:make seed_cumprimento_manutencoes --knexfile=db/knexfile.js
npx knex seed:make seed_backlog_ordens_servico --knexfile=db/knexfile.js
npx knex seed:make seed_kpi_manutencoes --knexfile=db/knexfile.js
npx knex seed:make seed_manutencoes --knexfile=db/knexfile.js

Executa
npx knex seed:run --knexfile=db/knexfile.js

````

_____________________________________________

# Melhorias 

### 1. **Divida Componentes em Pastas por Função**
Organize seus componentes por funcionalidade em vez de apenas por tipo. Por exemplo, agrupe todos os componentes relacionados à autenticação em uma pasta `auth`, todos os componentes de layout em uma pasta `layout`, e assim por diante.

```plaintext
src/
  components/
    auth/
      LoginForm.tsx
      SignUpForm.tsx
    layout/
      Header.tsx
      Sidebar.tsx
    dashboard/
      Chart.tsx
      Orders.tsx
    common/
      Button.tsx
      Input.tsx
```

### 2. **Utilize Hooks Customizados**
Crie hooks customizados para lógica de negócio que é reutilizável. Isso ajuda a manter os componentes limpos e focados em sua renderização.

```tsx
// src/hooks/useAuth.ts
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

const useAuth = () => {
  return useContext(AuthContext);
};

export default useAuth;
```

### 3. **Gerenciamento de Estado Global**
Considere usar uma biblioteca de gerenciamento de estado global, como Redux ou Zustand, se o seu projeto crescer e precisar de um estado compartilhado mais complexo.

### 4. **Utilize Types e Interfaces Consistentemente**
Aproveite o TypeScript para garantir que seus dados estejam sempre tipados corretamente, facilitando a manutenção e evitando bugs.

```tsx
interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
}

const initialAuthState: AuthState = {
  user: null,
  token: null,
};
```

### 5. **Gerencie Configurações de Ambiente**
Use variáveis de ambiente para armazenar chaves de API e outras configurações sensíveis.

```plaintext
// .env.local
NEXT_PUBLIC_API_URL=https://api.example.com
```

```tsx
// src/services/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL;
```

### 6. **Escreva Testes**
Adote uma estratégia de testes para garantir que suas funcionalidades funcionem conforme o esperado. Jest e Testing Library são ótimas ferramentas para testes em React.

```tsx
// src/components/auth/LoginForm.test.tsx
import { render, screen } from "@testing-library/react";
import LoginForm from "./LoginForm";

test("renders login form", () => {
  render(<LoginForm />);
  expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
});
```

### 7. **Utilize o ESLint e Prettier**
Configure ESLint e Prettier para garantir um código limpo e consistente.

```json
// .eslintrc.json
{
  "extends": ["next", "next/core-web-vitals", "prettier"],
  "rules": {
    // suas regras personalizadas
  }
}

// .prettierrc
{
  "singleQuote": true,
  "trailingComma": "es5"
}
```

### 8. **Documentação**
Documente seu código e crie um README.md detalhado para ajudar outros desenvolvedores a entenderem e contribuírem com o projeto.

```markdown
# Meu Projeto Next.js

## Configuração

1. Clone o repositório
2. Instale as dependências: `npm install`
3. Inicie o servidor de desenvolvimento: `npm run dev`

## Estrutura do Projeto

- `src/`: Código-fonte do projeto
  - `components/`: Componentes React
  - `contexts/`: Contextos de estado global
  - `hooks/`: Hooks customizados
  - `pages/`: Páginas Next.js
  - `services/`: Lógica de serviços/APIs
  - `utils/`: Utilitários auxiliares

## Scripts

- `npm run dev`: Inicia o servidor de desenvolvimento
- `npm run build`: Constrói o projeto para produção
- `npm run start`: Inicia o servidor de produção
- `npm run lint`: Executa o ESLint
- `npm run test`: Executa os testes
```

### 9. **Optimização de Performance**
Use o `next/image` para otimizar imagens e o `next/script` para carregar scripts de maneira otimizada.

```tsx
import Image from 'next/image';

const MyComponent = () => (
  <div>
    <Image src="/path/to/image.jpg" alt="Descrição da Imagem" width={500} height={300} />
  </div>
);
```

### 10. **Acessibilidade**
Garanta que seus componentes sejam acessíveis, usando atributos ARIA e validando a acessibilidade com ferramentas como o Axe.

```tsx
<button aria-label="Fechar menu" onClick={handleClose}>
  X
</button>
```
