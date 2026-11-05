# hunter-progression-forever

A local, offline leveling guide for a **Horde hunter (1–60) on WoW Forever**.

## Use it

Double-click **`index.html`** (or `open index.html`). No server, build step or internet needed; it works from `file://`.

| Page | What's on it |
|---|---|
| `index.html` | Level-by-level checklist (trainer visits, pet quest, Claw/Dash tames, weapon upgrades). Ticks are saved in your browser. |
| `training.html` | Spells by trainer level, Horde trainers, weapon masters, pet trainer ranks |
| `pets.html` | Claw 1–8 and Dash 1–3: every Horde-friendly beast that teaches each rank, plus how to learn skills |
| `weapons.html` | Ranged and melee upgrades by bracket, pre-raid picks, ammo |

Type your level into **My level** in the header to highlight the matching rows on every page.
Everything still renders with JavaScript turned off; you only lose the highlight and saved ticks.

## About the data

- **Baseline is vanilla 1.12 / Classic Era.** WoW Forever (launched 4 Nov 2026) keeps most of it but changes some things.
- Confirmed Forever changes are tagged **Forever** on the pages: Aimed Shot is a trainer spell at 20, Parry at 8, Dual Wield at 20,
  Mail at 40, Viper Sting at 36, Track Giants at 40, dual spec at 40, Venomstrike buffed, and changed maps for Desolace/Mulgore/Tirisfal and others.
- Pet ability teachers come from wow-petopia's Classic ability database. Coordinates are left out on purpose.
- Only items whose name and source could be confirmed are listed.

## Tweaking for WoW Forever

All data is plain HTML table rows, so edit, add or delete a `<tr>` to fix something you see in game.
The `data-lvl="N"` or `data-lvl="N-M"` attribute on a row controls level highlighting.

Things most likely to need checking in game:
1. **Spell rank levels** past first-learn (`training.html`). Forever reworked talents, and some ranks may have moved.
2. **Desolace beasts** (`pets.html`, tagged *Map changed*). Forever changed that zone's map.
3. **Weapons** (`weapons.html`). Forever added 1,000+ quests and new items that may beat these picks.

## Files

```
index.html  training.html  pets.html  weapons.html
css/style.css   # dark theme, print-friendly
js/app.js       # level highlight + checklist storage (localStorage, no network)
```
