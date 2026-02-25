# sy-lively (喧嚣) - SiYuan Note Plugin

> Calendar management and task scheduling plugin for SiYuan Note (思源笔记)

**Version:** P0.2.6-2 | **Author:** kuangdongksk | **License:** MIT

---

## Project Overview

sy-lively is a comprehensive plugin for SiYuan Note that provides:
- **Calendar & Scheduling** - Monthly calendar view with event management and reminders
- **Domain & Category Management** - Organize tasks by life areas
- **Card System** - Quick card creation with auto-generated aliases (Alt+Q)
- **Task Management** - Track importance, urgency, and completion status
- **Whiteboard Integration** - Visual planning with tldraw
- **Workflow System** - Custom workflow creation

---

## Tech Stack

| Category | Technology |
|----------|-----------|
| **Frontend** | React 19.2.0, TypeScript 5.9.3 |
| **Build** | Vite 7.2.4 |
| **UI** | Ant Design 6.0.0, Tailwind CSS 4.1.17 |
| **Routing** | React Router DOM 7.9.6 |
| **State** | Jotai 2.15.1 |
| **Date** | Day.js 1.11.19 |
| **SiYuan** | siyuan 1.1.7 |

---

## Project Structure

```
sy-lively/
├── src/
│   ├── index.tsx              # Plugin entry point
│   ├── App.tsx                # React root component
│   ├── pages/                 # Page components
│   │   ├── index.tsx          # Main layout with sidebar
│   │   ├── 主页/              # Home page
│   │   ├── 日历/              # Calendar page
│   │   ├── 领域/              # Domains page
│   │   ├── 设置/              # Settings page
│   │   ├── 关系/              # Relationships page
│   │   └── 错误页面/          # Error page
│   ├── components/            # Reusable components
│   │   ├── base/             # Base components (rc/, sy/)
│   │   ├── docker/           # Dock panel components
│   │   ├── 模板/             # Template components
│   │   └── 业务组件/         # Business components
│   ├── module/               # Feature modules
│   │   ├── card/            # Card functionality
│   │   ├── setting/         # Settings (using SiYuan API)
│   │   ├── update/          # Update notifications
│   │   ├── whiteBoard/      # Whiteboard features
│   │   ├── workFlow/        # Workflow features
│   │   └── user/            # User management
│   ├── class/               # Core classes
│   │   ├── helper/          # SQLer, MsgSender, etc.
│   │   └── 思源/            # SiYuan API wrappers
│   ├── store/               # Jotai atoms
│   ├── constant/            # Constants & enums
│   │   ├── API路径.ts       # API endpoints
│   │   ├── syLively.ts      # Plugin constants
│   │   ├── 系统码.ts        # System codes
│   │   └── i18n/            # Translations
│   ├── tools/               # Utility functions
│   ├── types/               # TypeScript definitions
│   └── utils/               # General utilities
├── scripts/                 # Build & utility scripts
│   ├── make_dev_link.js    # Development linking
│   ├── update_version.js   # Version management
│   └── make_install.js     # Installation script
├── public/i18n/            # Translation files
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
├── tailwind.config.js      # Tailwind configuration
├── package.json            # Dependencies & scripts
└── plugin.json             # SiYuan plugin manifest
```

---

## NPM Scripts

| Command | Description |
|---------|-------------|
| `pnpm run ml` | Create development symlink (may require admin) |
| `pnpm run mlw` | Create symlink with elevated privileges (Windows) |
| `pnpm run dev` | Build in watch mode for development |
| `pnpm run uv` | Update version (interactive script) |
| `pnpm run build` | Production build |
| `pnpm run make-install` | Build and create installation package |

---

## Development

### Path Aliases
- `@/*` → `./src/*`

### Build Output
- Development: `dev/`
- Production: `dist/`
- Format: CommonJS (`cjs`)

### Plugin Entry
**Main file:** `src/index.tsx`
**React App:** `src/App.tsx`

---

## Key Features

### 1. Calendar & Scheduling
- Monthly calendar view with event indicators
- Daily note integration with SiYuan blocks
- Event creation with time reminders (5min, 10min, 15min, 30min, 1h, 2h, 1d, 3d, 1w)
- Recurring events (daily, weekly, monthly, yearly)

### 2. Card System
- **Shortcut:** `Alt+Q` for quick card creation
- Auto-generated aliases from pinyin
- Block reference insertion (`[[alias]`)
- Card dock panel for quick access
- Card validation against configured document

### 3. Task Management
- States: Not Started, Completed
- Types: Events, Anniversaries
- Importance & Urgency tracking
- Hierarchical parent-child relationships
- Domain & Category categorization

### 4. Settings
- **IMPORTANT:** Settings are managed via SiYuan's settings API
- Per-notebook configuration
- Located in `src/module/setting/index.ts`
- Uses `this.config` from SiYuan's plugin configuration

---

## Data Model

### Custom Attributes (prefix: `custom-plugin-lively-`)

| Attribute | Description |
|-----------|-------------|
| `domain` | Domain/life area data |
| `category` | Category within domain |
| `things` | Items/things data |
| `card` | Card metadata |
| `userSettings` | User preferences |

### Item Attributes (prefix: `custom-plugin-lively-thing-`)

| Attribute | Description |
|-----------|-------------|
| `name` | Item name |
| `alias` | Pinyin alias for quick reference |
| `importance` | Importance level |
| `urgency` | Urgency level |
| `startTime` / `endTime` | Time bounds |
| `status` | not_started / completed |
| `repeat` | Recurring settings |
| `remind` | Reminder settings |
| `level` | Hierarchy level |
| `parentId` | Parent item ID |
| `notebookId` | Associated notebook |

### Storage Keys
- User settings
- Card document ID
- Locked notebooks
- Workflow data
- Version tracking

---

## Plugin Architecture

### Lifecycle Hooks

```typescript
// In src/index.tsx
export const syLively = {
  onload: async () => {
    // Add icons
    // Register shortcuts (Alt+Shift+X, Alt+Q)
    // Add top bar button
    // Register slash commands
    // Initialize dock panels
  },

  onLayoutReady: async () => {
    // Add tabs
    // Register event listeners
    // Show update notices
  },

  onunload: () => {
    // Cleanup
  }
};
```

### Event Bus Integration

| Event | Purpose |
|-------|---------|
| `open-menu-content` | Menu interactions |
| `click-blockicon` | Block icon clicks |
| `click-editorcontent` | Editor content clicks |
| `open-menu-doctree` | Document tree menu |
| `loaded-protyle-static` | Static content loaded |
| `ws-main` | WebSocket events |

---

## Key Classes

### SiYuan API Wrappers (`src/class/思源/`)
- **Block** - Block operations
- **Notebook** - Notebook management
- **SQL** - SQL query execution

### Helpers (`src/class/helper/`)
- **SQLer** - SQL query builder
- **MsgSender** - Message notification sender

---

## Internationalization

Supported languages:
- Chinese (zh_CN) - Primary
- English (en_US)

Uses `i18n-js` with locale detection via IP geolocation.

---

## Version Management

To update the version:
1. Run `pnpm run uv` (interactive script)
2. Updates `package.json`, `plugin.json`, and `src/module/update/index.ts`
3. Follow semantic versioning: `P{major}.{minor}.{patch}`

---

## Important Notes

1. **Settings Management:** Settings were migrated to use SiYuan's built-in settings API. Check `src/module/setting/index.ts` for implementation.

2. **Block-Based Storage:** All data is stored as SiYuan blocks with custom attributes.

3. **SQL Queries:** The plugin uses custom SQL queries against SiYuan's SQLite database for data retrieval.

4. **Multiple React Roots:** The plugin may use multiple React roots for different UI sections (dock, main panel, etc.).

5. **Development:** Use `pnpm run dev` for watch mode development. Changes will be built to `dev/` directory.

---

## Links

- **GitHub:** https://github.com/kuangdongksk/sy-lively
- **Documentation:** https://github.com/kuangdongksk/sy-lively/wiki
- **Discussion (Chinese):** https://ld246.com/article/1729246064268
- **Funding:** https://afdian.com/a/kuangdongksk
