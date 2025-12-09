# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DocMaker is a technical document editor designed for creating assembly manuals and industrial process documentation. It's a browser-based application that runs 100% locally with no backend server required. Documents are created using drag-and-drop blocks and can be exported to PDF or DOCX formats with professional formatting.

## Development Commands

```bash
# Start development server (runs on http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## Core Architecture

### State Management

The application uses React Context for global state management with two main contexts:

1. **DocumentContext** (`src/contexts/DocumentContext.tsx`)
   - Manages the active document and all blocks
   - Operations: `addBlock`, `updateBlock`, `deleteBlock`, `moveBlock`, `updateTitle`, `updateSettings`
   - Each document contains: id, title, timestamps, settings (logo, page size), and an ordered array of blocks

2. **SettingsContext** (`src/contexts/SettingsContext.tsx`)
   - Manages app-level settings, templates, and recent documents
   - Persists to localStorage automatically
   - Storage key: `docmaker_settings`

### Block System

All content is represented as **blocks** (8 types defined in `src/types/blocks.ts`):
- `cover`: Document cover page with title and optional image
- `section`: Hierarchical headings (levels 1-3)
- `image`: Image with auto-numbered caption
- `table`: Editable table with dynamic rows/columns
- `list`: Bulleted or numbered lists
- `text`: Simple text paragraphs
- `section-table`: Combined section heading + table
- `section-list`: Combined section heading + list

Each block has:
- `id`: Unique identifier (UUID)
- `type`: One of the BlockType values
- `data`: Type-specific content object

Block creation uses the factory pattern (`src/utils/blockFactory.ts`).

### Drag-and-Drop

Uses `@dnd-kit` for all drag-and-drop functionality:
- Sidebar items can be dragged onto the canvas to create new blocks
- Existing blocks can be reordered by dragging
- Main DnD logic in `src/components/editor/DocumentEditor.tsx`
- Active dragging IDs starting with `new-` indicate new blocks from sidebar

### Export System

Two separate exporters handle document conversion:

1. **PDF Exporter** (`src/services/pdfExporter.ts`)
   - Uses `pdfmake` library
   - Key dimensions: 13cm image width, A4 sizing
   - Handles footer with company logo (13cm × 2.5cm) + page number
   - Cover pages skip footer
   - Auto-numbers images ("Figura 1:", "Figura 2:", etc.)

2. **DOCX Exporter** (`src/services/docxExporter.ts`)
   - Uses `docx` library
   - Converts base64 images to ArrayBuffers for embedding
   - Maintains aspect ratios for images
   - Same footer logic as PDF
   - Async conversion (returns Promises)

### Storage

- **Documents**: NOT stored in localStorage automatically - user must explicitly save
- **Settings**: Auto-saved to localStorage on every change
- **Templates**: Stored in settings context
- **Recent Documents**: Tracked as metadata only (id, title, timestamp)
- **Export Format**: JSON files can be saved/loaded for document transfer

## Key Technical Details

### Image Handling

Images are stored as base64 data URLs throughout the application:
- Conversion utilities in `src/utils/imageUtils.ts`
- Image numbering is calculated during export (not stored in block data)
- Cover images can fill entire page, other images are centered at 13cm width

### TypeScript Path Aliases

The project uses `@/` alias for `src/` directory (configured in `tsconfig.json` and `vite.config.ts`):
```typescript
import { useDocument } from '@/contexts'
import { Block } from '@/types'
```

### Styling

- Tailwind CSS for all styling
- Configuration in `tailwind.config.js`
- No custom CSS files - all utility classes

### Component Structure

```
src/components/
├── blocks/        # Individual block renderers (CoverBlock, TableBlock, etc.)
├── editor/        # Main editor components (DocumentEditor, BlockRenderer, BlockWrapper)
├── layout/        # App shell (Header, Sidebar)
├── modals/        # Dialogs (ExportModal, SaveModal, LoadModal, SettingsModal)
└── ui/            # Reusable UI primitives (Button, Input, Modal)
```

### Block Editing

- Blocks are edited in place on the canvas
- Each block component handles its own edit state
- Changes immediately update via `updateBlock()` from DocumentContext
- Double-click or click on block enables edit mode

## Important Conventions
Always use context7 when I need code generation, setup or configuration steps, or
library/API documentation. This means you should automatically use the Context7 MCP tools to resolve library id and get library docs without me having to explicitly ask.

### Adding New Block Types

When adding a new block type:
1. Add type definition to `src/types/blocks.ts`
2. Update `BlockType` union and add labels/descriptions
3. Create component in `src/components/blocks/`
4. Add factory case in `src/utils/blockFactory.ts`
5. Add export logic to both `pdfExporter.ts` and `docxExporter.ts`
6. Update `BlockRenderer.tsx` to render the new type

### Image Numbering

Image numbering (Figura 1, Figura 2, etc.) is calculated during export traversal - it's NOT stored in the block data. The exporters maintain an `ImageCounter` object that increments as they process blocks.

### Export Formatting Standards

Based on requirements in README.md:
- Title text: 16px (PDF) / 32 half-points (DOCX)
- Body text: 11px (PDF) / 22 half-points (DOCX)
- Images: 13cm width (maintains aspect ratio)
- Image descriptions: 11px, italic, centered
- Footer logo: 13cm × 2.5cm, centered
- Page numbers: left-aligned in footer
- Cover page: No footer

### LocalStorage Keys

- Settings: `docmaker_settings`
- Individual documents: Not stored automatically - user exports JSON when needed

## Build Configuration

- **Vite** for build tooling
- **React 18** with TypeScript strict mode
- **ESLint** configured for React + TypeScript
- PostCSS with Tailwind and Autoprefixer
