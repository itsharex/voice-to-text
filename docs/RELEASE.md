# Гайд по релизу VoicetextAI

Пошаговая инструкция по выпуску новой версии приложения.

## Обзор процесса

```
1. Определить тип релиза (major / minor / patch)
2. Обновить версию во всех файлах
3. Обновить CHANGELOG.md
4. Закоммитить изменения
5. Создать git tag
6. Запушить tag → GitHub Actions соберёт билды
7. Отредактировать GitHub Release
```

---

## 1. Определить тип релиза

Используем [Semantic Versioning](https://semver.org/):

| Тип | Когда | Пример |
|-----|-------|--------|
| **patch** (`0.5.1` → `0.5.2`) | Баг-фиксы, мелкие правки | Исправлен краш при записи |
| **minor** (`0.5.2` → `0.6.0`) | Новый функционал, улучшения | Добавлен новый STT провайдер |
| **major** (`0.6.0` → `1.0.0`) | Ломающие изменения, крупные переработки | Смена архитектуры, удаление API |

---

## 2. Обновить версию

Версия указана в **3 файлах** — все должны совпадать:

```bash
# Проверить текущую версию
grep '"version"' package.json src-tauri/tauri.conf.json
grep '^version' src-tauri/Cargo.toml
```

### Файлы для обновления

| Файл | Поле | Пример |
|------|------|--------|
| `package.json` | `"version"` | `"0.6.0"` |
| `src-tauri/tauri.conf.json` | `"version"` | `"0.6.0"` |
| `src-tauri/Cargo.toml` | `version` | `"0.6.0"` |

```bash
# Быстрая замена (пример: 0.5.1 → 0.6.0)
OLD="0.5.1"
NEW="0.6.0"

sed -i '' "s/\"version\": \"$OLD\"/\"version\": \"$NEW\"/" package.json src-tauri/tauri.conf.json
sed -i '' "s/^version = \"$OLD\"/version = \"$NEW\"/" src-tauri/Cargo.toml
```

### Проверка

```bash
# Убедиться что версии совпадают
grep '"version"' package.json src-tauri/tauri.conf.json
grep '^version' src-tauri/Cargo.toml
```

---

## 3. Обновить CHANGELOG.md

Открыть `CHANGELOG.md` в корне проекта и добавить секцию для новой версии.

### Формат записи

```markdown
## [0.6.0] — 2026-02-02

### Добавлено
- Описание новой фичи

### Изменено
- Описание изменённого поведения

### Исправлено
- Описание бага который починили

### Удалено
- Что убрали (если убирали)
```

### Как собрать список изменений

```bash
# Посмотреть коммиты с последнего релиза
git log v0.5.1..HEAD --oneline

# Более подробно, с датами
git log v0.5.1..HEAD --pretty=format:"%h %s (%ai)"
```

### Категории

| Категория | Что туда | Примеры |
|-----------|----------|---------|
| **Добавлено** | Новый функционал | Новый провайдер, новая страница |
| **Изменено** | Рефакторинг, улучшения | Редизайн UI, оптимизация |
| **Исправлено** | Баги | Краш, некорректное поведение |
| **Удалено** | Убранный функционал | Deprecated API |

---

## 4. Закоммитить

```bash
git add package.json src-tauri/tauri.conf.json src-tauri/Cargo.toml CHANGELOG.md
git commit -m "release: v0.6.0"
```

Формат коммита: `release: v<версия>`

---

## 5. Создать tag и запушить

```bash
# Создать аннотированный tag
git tag v0.6.0

# Запушить коммит и tag
git push origin master
git push origin v0.6.0
```

> После пуша тега GitHub Actions автоматически запустит сборку на всех платформах
> (macOS Intel, macOS ARM, Windows, Linux). Это занимает ~15-20 минут.

---

## 6. Дождаться сборки

```bash
# Следить за прогрессом
gh run list --limit 3
gh run watch
```

Если сборка упала:
```bash
# Посмотреть логи
gh run view <run-id> --log-failed
```

---

## 7. Отредактировать GitHub Release

После успешной сборки GitHub Actions создаст драфт релиза с артефактами.
Нужно обновить описание:

```bash
gh release edit v0.6.0 \
  --title "v0.6.0 — Краткое описание" \
  --notes "$(cat <<'EOF'
## Что нового

### Название фичи 1
- Описание

### Название фичи 2
- Описание

---

## Исправления
- Что починили

---

## Установка

**macOS:**
- Скачать `.dmg` — Intel (`x64`) или Apple Silicon (`aarch64`)
- Перетащить в Applications

**Windows:**
- Скачать `.msi` и запустить установщик

**Linux:**
- `.deb` для Debian/Ubuntu: `sudo dpkg -i voicetextai_*.deb`
- `.AppImage` для остальных: сделать исполняемым и запустить

---

**Полный список изменений:** https://github.com/777genius/voice-to-text/compare/v0.5.1...v0.6.0
EOF
)"
```

### Шаблон описания релиза

```markdown
## Что нового

### <Главная фича>
- Пункт 1
- Пункт 2

### <Ещё фича>
- Пункт

---

## Исправления
- Пункт

---

## Установка

**macOS:**
- Скачать `.dmg` — Intel (`x64`) или Apple Silicon (`aarch64`)
- Перетащить в Applications

**Windows:**
- Скачать `.msi` и запустить установщик

**Linux:**
- `.deb` для Debian/Ubuntu: `sudo dpkg -i voicetextai_*.deb`
- `.AppImage` для остальных: сделать исполняемым и запустить

---

**Полный список изменений:** https://github.com/777genius/voice-to-text/compare/vПРЕДЫДУЩАЯ...vНОВАЯ
```

---

## Чеклист перед релизом

- [ ] Версия обновлена в `package.json`, `tauri.conf.json`, `Cargo.toml`
- [ ] Все три версии совпадают
- [ ] `CHANGELOG.md` обновлён
- [ ] `git status` чистый (нет незакоммиченных файлов)
- [ ] Тесты проходят: `pnpm test:run`
- [ ] Билд проходит локально: `pnpm build`
- [ ] Tag создан и запушен
- [ ] GitHub Actions сборка прошла
- [ ] Описание релиза на GitHub обновлено
- [ ] Артефакты доступны для скачивания

---

## Быстрый релиз (копипаст)

```bash
# Задать версию
VERSION="0.6.0"
OLD_VERSION="0.5.1"

# 1. Обновить версии
sed -i '' "s/\"version\": \"$OLD_VERSION\"/\"version\": \"$VERSION\"/" package.json src-tauri/tauri.conf.json
sed -i '' "s/^version = \"$OLD_VERSION\"/version = \"$VERSION\"/" src-tauri/Cargo.toml

# 2. Обновить CHANGELOG.md (вручную)

# 3. Коммит + tag + push
git add package.json src-tauri/tauri.conf.json src-tauri/Cargo.toml CHANGELOG.md
git commit -m "release: v$VERSION"
git tag "v$VERSION"
git push origin master
git push origin "v$VERSION"

# 4. Следить за сборкой
gh run watch

# 5. Обновить описание релиза (после успешной сборки)
gh release edit "v$VERSION" --title "v$VERSION — Описание" --notes-file release-notes.md
```

---

## Хотфикс (срочное исправление)

Если нужно выпустить срочный патч:

```bash
# 1. Починить баг и закоммитить
git add .
git commit -m "fix: описание бага"

# 2. Поднять patch-версию (0.6.0 → 0.6.1)
# Обновить все 3 файла (см. шаг 2)

# 3. Коммит + tag + push
git add package.json src-tauri/tauri.conf.json src-tauri/Cargo.toml CHANGELOG.md
git commit -m "release: v0.6.1"
git tag v0.6.1
git push origin master
git push origin v0.6.1
```

---

## Полезные команды

```bash
# Список всех тегов (от новых к старым)
git tag --sort=-v:refname

# Коммиты между релизами
git log v0.5.0..v0.5.1 --oneline

# Статус GitHub Actions
gh run list --limit 5

# Список релизов
gh release list

# Удалить tag (если ошибся)
git tag -d v0.6.0
git push origin --delete v0.6.0

# Удалить GitHub Release
gh release delete v0.6.0 --yes
```
