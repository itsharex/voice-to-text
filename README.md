# VoicetextAI

Modern voice-to-text desktop application using AI, built with Tauri 2.0, Rust, and Vue 3.

[![GitHub release](https://img.shields.io/github/v/release/777genius/voice-to-text)](https://github.com/777genius/voice-to-text/releases)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)

**Website:** [voicetext.site](https://voicetext.site)

## Features

- **45+ Languages** — Full Deepgram Nova-3 support with real-time multilingual detection
- **Real-time Transcription** — Instant partial and final results via WebSocket streaming
- **Global Hotkey** — Quick access with customizable hotkeys (default: Cmd+Shift+X / Ctrl+Shift+X)
- **Auto-copy to Clipboard** — Instant access to transcribed text
- **Auto-paste** — Automatically paste text into the active window (requires Accessibility permission on macOS)
- **System Tray** — Runs in background, accessible from tray icon
- **Auto-Updates** — Automatic update checks with secure cryptographic signatures
- **Cross-Platform** — macOS (Intel & Apple Silicon), Windows, Linux
- **Privacy-Focused** — No cloud storage of audio, secure API handling
- **Beautiful UI** — Minimal design with glass morphism effects, dark/light/system themes
- **Multi-window Sync** — State synchronization between app windows
- **OAuth Authentication** — Google sign-in support

## Architecture

This project follows **Clean Architecture** principles with clear separation of concerns.

### Backend (Rust)

```
src-tauri/src/
├── domain/              # Domain Layer — Business Logic
│   ├── models/          # Value Objects & Entities
│   └── ports/           # Interfaces (Traits)
│
├── application/         # Application Layer — Use Cases
│   └── services/
│       └── transcription_service.rs
│
├── infrastructure/      # Infrastructure Layer — Implementations
│   ├── stt/             # STT Providers (Deepgram, AssemblyAI)
│   ├── audio/           # Audio Capture (cpal)
│   ├── updater.rs       # Auto-update logic
│   └── factory.rs       # Provider Factory (DI)
│
└── presentation/        # Presentation Layer — Tauri API
    ├── commands.rs      # Tauri commands
    ├── events.rs        # Event definitions
    └── state.rs         # Global application state
```

### Frontend (Vue 3 + TypeScript)

```
src/
├── features/            # Feature modules (DDD)
│   ├── auth/            # Authentication (OAuth, sessions)
│   │   ├── domain/
│   │   ├── application/
│   │   ├── infrastructure/
│   │   └── presentation/
│   └── settings/        # Settings management
│       ├── domain/
│       ├── store/
│       └── presentation/
│
├── stores/              # Global Pinia stores
│   ├── transcription.ts # Recording & transcription state
│   ├── sttConfig.ts     # STT configuration sync
│   ├── appConfig.ts     # App configuration sync
│   └── update.ts        # Auto-update state
│
├── windowing/           # Multi-window support
│   └── stateSync/       # Cross-window state synchronization
│
├── presentation/        # Shared UI components
│   └── components/
│
├── i18n.ts              # Internationalization (6 locales)
├── i18n.locales.ts      # Locale & STT language definitions
└── App.vue
```

### Landing Page (Nuxt 3)

```
landing/
├── components/          # Vue components
├── pages/               # Routes (index, terms, privacy, refund)
├── locales/             # i18n translations (6 languages)
├── content/             # Page content per locale
└── server/              # API routes (downloads, sitemap)
```

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- Rust 1.77+
- macOS, Windows, or Linux

### Installation

```bash
# Install dependencies
pnpm install

# Run in development mode
pnpm tauri:dev

# Build for production
pnpm tauri:build

# Run tests
pnpm test
```

#### Linux System Dependencies

**Debian/Ubuntu:**
```bash
sudo apt update
sudo apt install libwebkit2gtk-4.1-dev build-essential curl wget file \
  libxdo-dev libssl-dev libayatana-appindicator3-dev librsvg2-dev \
  libasound2-dev pkg-config
```

**Arch Linux:**
```bash
sudo pacman -S webkit2gtk-4.1 base-devel curl wget file openssl \
  libayatana-appindicator librsvg alsa-lib
```

**Fedora:**
```bash
sudo dnf install webkit2gtk4.1-devel openssl-devel curl wget file \
  libappindicator-gtk3-devel librsvg2-devel alsa-lib-devel
```

## Platform Support

| Platform | Audio Backend | Installer |
|----------|---------------|-----------|
| macOS Intel | CoreAudio | `.dmg` |
| macOS ARM | CoreAudio | `.dmg` |
| Windows | WASAPI | `.msi` |
| Linux | ALSA/PulseAudio/PipeWire | `.deb`, `.AppImage` |

## Tech Stack

- **Tauri 2.0** — Native desktop framework
- **Rust** — Backend, audio capture, system integration
- **Vue 3** — Reactive UI with Composition API
- **TypeScript** — Type-safe frontend
- **Pinia** — State management
- **Vuetify 3** — Material Design components
- **vue-i18n** — Internationalization
- **Vite** — Fast build tool
- **Nuxt 3** — Landing page SSR
- **Deepgram Nova-3** — Speech-to-text engine

## Scripts

```bash
pnpm dev           # Vite dev server (frontend only)
pnpm build         # Build frontend
pnpm tauri:dev     # Full Tauri development
pnpm tauri:build   # Production build
pnpm test          # Run Vitest tests
pnpm lint          # ESLint check
pnpm format        # Prettier formatting
```

## License

Apache License 2.0 — see [LICENSE](LICENSE) for details.

## Contributing

Contributions are welcome! Please follow the existing architecture patterns and maintain clean separation of concerns.

## Links

- [Website](https://voicetext.site)
- [GitHub](https://github.com/777genius/voice-to-text)
- [Releases](https://github.com/777genius/voice-to-text/releases)
- [Changelog](CHANGELOG.md)
