# UI Registry & Atomic Component Catalog: Tiag Kitchen

## 1. Component Architecture & Atomic Classification

All UI elements adhere to strict Atomic Design classification. Features must be composed by nesting established Atoms into Molecules, and Molecules into Organisms.

```
[ATOMS] ──────► [MOLECULES] ──────► [ORGANISMS] ──────► [VIEWS / SCREENS]
Button          SecondaryCard       PrimaryCounter       Setup View
Numeral         UndoActionBar       ServingHeader        Serving Dashboard
StatusBadge     FormFieldBlock      SettingsSheet        Summary View
LogoSlot        MultiSelectChips    SummaryCard          Install Guide
```

---

## 2. Atoms (Indivisible Primitives)

### `[ATOM] Button`
- **Variants**:
  - `primary-gradient`: Linear brand gradient, pill radius, white text. Used for "Start Serving" and "Confirm".
  - `secondary-purple`: Royal purple (`#7F499A`), pill radius, white text. Used for "Undo".
  - `outline`: White or transparent background with 2px border. Used for "Serve multiple" and secondary sheet actions.
  - `danger-hold`: Quiet red outline transitioning to filled red during 2-second hold. Used for "Hold to reset".
- **Props**: `variant`, `disabled`, `onClick`, `onTouchStart`, `onTouchEnd`, `ariaLabel`.
- **Min Touch Target**: 48px height (56px for primary action bars).

### `[ATOM] NumeralDisplay`
- **Purpose**: Ultra-high-contrast tabular numerical display.
- **Weights**: Always 800 ExtraBold.
- **Sizes**:
  - `hero`: Dynamic clamp (`clamp(72px, 18vw, 110px)`).
  - `secondary`: `36px - 48px`.
  - `compact`: `20px - 24px`.
- **Contrast**: Strictly >= 7:1 against its parent surface.

### `[ATOM] StatusBadge`
- **Variants**: `ok`, `low`, `critical`, `finished`.
- **Contents**: Inline SVG icon (checkmark, triangle, hexagon exclamation, lock) + uppercase text string.
- **Styling**: Bound directly to `--status-*-badge` and `--status-*-text`.

### `[ATOM] LogoSlot`
- **Variants**: `setup` (96px), `header` (40px), `summary` (72px).
- **Features**: Circular clipping mask with 2px white ring (`rgba(255,255,255,0.85)`), `object-fit: contain`, 12% internal padding.
- **Fallback**: Neutral SVG seal outline with text "YOUR LOGO".

### `[ATOM] InputField`
- **Purpose**: Clean, high-legibility numerical and text input.
- **Attributes**: `inputmode="numeric"`, `pattern="[0-9]*"`, `autocomplete="off"`.
- **Validation**: Rejects negative, decimal, or alphabetic characters on paste.

---

## 3. Molecules (Compound Functional Units)

### `[MOLECULE] SecondaryCounterCard`
- **Composition**: Container card + Header label (e.g. "Workers") + `NumeralDisplay` + Subtitle ("Served: N") + `StatusBadge` + "x N" Serve Multiple chip button.
- **Min Height**: 88px.
- **Layout**: 50/50 split row on portrait mobile.

### `[MOLECULE] UndoActionBar`
- **Composition**: `Button` (Purple variant, dynamic text "Undo: [Last Action]") + `Button` (Outline variant, "Serve multiple").
- **Min Height**: 56px.
- **State**: Disabled with 0.4 opacity when history stack is empty.

### `[MOLECULE] MultiSelectChipGroup`
- **Composition**: Array of circular/pill chips (`2`, `3`, `4`, `5`, `10`) with active focus ring.
- **Usage**: Embedded inside the "Serve multiple" bottom sheet.

### `[MOLECULE] FormFieldBlock`
- **Composition**: Label atom + InputField atom + ErrorText atom.

---

## 4. Organisms (Distinct Composite Sections)

### `[ORGANISM] PrimaryParticipantButton`
- **Composition**:
  - Full-width touch surface (55%–60% viewport height).
  - Top: Label "PARTICIPANTS" (bold uppercase) + `StatusBadge`.
  - Center: Enormous `NumeralDisplay` (e.g. `412`) + Subtitle "LEFT".
  - Bottom: "Served: 188".
- **Dynamic Theming**: Surface and borders adapt dynamically across OK, LOW, CRITICAL, and FINISHED status tokens.
- **Tap Animation**: Scale bump (0.97 on press, 1.0 on release) + 50ms surface flash.

### `[ORGANISM] ServingHeaderBar`
- **Composition**:
  - `LogoSlot` (40px).
  - Title block: "Tiag Kitchen" + Event/Station subline.
  - Right cluster: Global Worst-Status `StatusBadge` + Settings gear icon button (48px target).
  - Bottom edge: 3px brand gradient border line.

### `[ORGANISM] SettingsBottomSheet`
- **Composition**:
  - Draggable handle + Header title "Settings" + Close button.
  - Action list rows:
    - Restock ("Add food")
    - Adjust ("Fix a count")
    - Tap Lock toggle
    - Sound toggle (beep on low/critical)
    - Vibration toggle
    - Change Logo
    - Event Info
    - End Service
    - Hold to Reset (2s hold-to-confirm).

### `[ORGANISM] EndServiceSummaryCard`
- **Composition**:
  - Header: Logo (72px) + Event name + Station name + Start/End timestamps.
  - Metrics table: Starting, Restocked, Adjusted, Served, Remaining per category.
  - Action row: "Copy summary as text" (clipboard) + "Download CSV" (local blob).
  - Primary CTA: "Start New Event".
