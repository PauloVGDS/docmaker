# DocMaker

Editor de documentos técnicos com interface drag-and-drop para criação de manuais de montagem de máquinas e processos industriais.

## Funcionalidades

- **Interface Drag-and-Drop** - Arraste componentes da sidebar para montar seu documento
- **Componentes Reutilizáveis** - 11 tipos de blocos disponíveis
- **Painel de Estrutura** - Visualize e reorganize blocos pela barra lateral direita
- **Exportação PDF/DOCX** - Exporte documentos formatados profissionalmente
- **Templates** - Salve estruturas de documento para reutilizar
- **100% Local** - Funciona no navegador sem necessidade de servidor

## Componentes Disponíveis

| Componente | Descrição |
|------------|-----------|
| Capa | Página inicial com imagem e título do documento |
| Capa Detalhada | Capa com máquina, responsável e data |
| Seção | Títulos com 3 níveis hierárquicos (H1, H2, H3) |
| Imagem | Imagem centralizada com descrição numerada automaticamente |
| Tabela | Tabela editável com colunas e linhas dinâmicas |
| Lista | Lista com marcadores ou numerada |
| Texto | Bloco de texto simples |
| Seção + Tabela | Título de seção com tabela integrada |
| Seção + Lista | Título de seção com lista integrada |
| Seção + Texto | Título de seção com texto integrado |
| Seção + Imagem | Título de seção com imagem integrada |

## Formatação de Exportação

- **Título**: 16px
- **Texto**: 11px
- **Imagens**: 13cm de largura, centralizadas
- **Descrição de imagens**: 11px, itálico, numeração automática
- **Rodapé**: Logo da empresa centralizada + número da página (esquerda)
- **Capa**: Sem rodapé

## Instalação

```bash
# Clonar o repositório
git clone <url-do-repositorio>
cd docMaker

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

## Scripts Disponíveis

```bash
npm run dev      # Inicia servidor de desenvolvimento
npm run build    # Gera build de produção
npm run preview  # Preview do build de produção
npm run lint     # Executa linter
```

## Como Usar

1. **Criar documento**: Arraste componentes da barra lateral esquerda para a área do documento
2. **Editar blocos**: Clique em qualquer bloco para editar seu conteúdo
3. **Reordenar**: Arraste blocos pelo ícone de grip ou use o painel "Estrutura" na barra lateral direita
4. **Configurar logo**: Clique no ícone de engrenagem e faça upload da logo da empresa
5. **Salvar**: Use o botão "Salvar" para guardar localmente ou exportar JSON
6. **Exportar**: Clique em "Exportar" e escolha PDF ou DOCX

## Estrutura do Projeto

```
src/
├── components/
│   ├── blocks/       # Componentes de cada tipo de bloco
│   ├── editor/       # Editor principal e canvas
│   ├── layout/       # Header, Sidebar e BlockOutline
│   ├── modals/       # Modais (exportar, salvar, carregar, config)
│   └── ui/           # Componentes de UI reutilizáveis
├── contexts/         # React Contexts (Document, Settings)
├── services/         # Exportadores PDF e DOCX
├── types/            # Definições TypeScript
└── utils/            # Utilitários (ID, imagens, factory)
```

## Tecnologias

- **React 18** + **TypeScript** - Framework e tipagem
- **Vite** - Build tool
- **Tailwind CSS** - Estilização
- **@dnd-kit** - Drag and drop
- **pdfmake** - Geração de PDF
- **docx** - Geração de DOCX
- **Lucide React** - Ícones

## Armazenamento

- **Documentos**: Salvos no localStorage do navegador
- **Templates**: Salvos no localStorage
- **Configurações**: Logo e preferências salvas localmente
- **Exportação JSON**: Para backup ou transferência entre dispositivos

## Licença

MIT
