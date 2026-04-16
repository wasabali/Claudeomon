# Phaser Scene Patterns

Reference for correctly structuring Phaser 3 scenes in Cloud Quest. Use when implementing a new scene or modifying an existing one. Covers scene lifecycle, engine delegation, GameState access, DialogBox usage, and pixel art compliance.

## Scene Lifecycle

Every scene in Cloud Quest follows this structure:

```js
import { BaseScene } from '#scenes/BaseScene.js'
import { createBattleState, resolveTurn } from '#engine/BattleEngine.js'
import { GameState } from '#state/GameState.js'

export class BattleScene extends BaseScene {
  constructor() {
    super({ key: 'BattleScene' })
  }

  preload() {
    // Load assets here only. Nothing else.
    this.load.spritesheet('player', 'assets/sprites/player.png', { frameWidth: 16, frameHeight: 24 })
  }

  create(data) {
    // Receive data passed from previous scene
    // Create battle state via engine function (pure logic, no Phaser)
    // Create all display objects
    // Register input handlers
    this._battleState = createBattleState(data.mode, { ...GameState.player }, data.opponent, {
      slaTimer: data.slaTimer,
    })
  }

  update(time, delta) {
    // Per-frame logic only: input polling, movement, animation ticks
    // Never create objects here
  }

  shutdown() {
    // Clean up event listeners and timers
  }
}
```

## Delegating to Engines (Critical)

Scenes receive player input and pass it to the engine. The engine returns events. The scene renders those events. No game logic in scenes.

```js
// Correct — call engine function, render returned events
onSkillSelected(skill) {
  const events = resolveTurn(this._battleState, skill)
  this.renderEvents(events)
}

renderEvents(events) {
  events.forEach(event => {
    switch (event.type) {
      case 'damage':      this.showDamageNumber(event.target, event.value); break
      case 'domain_reveal': this.showDomainReveal(event.value); break
      case 'battle_end':  this.onBattleEnd(event.value); break
    }
  })
}

// Wrong — game logic in scene
onSkillSelected(skill) {
  if (skill.domain === this.opponent.domain) {  // ← logic belongs in SkillEngine
    this.opponent.hp -= skill.effect.value * 2
  }
}
```

## Using DialogBox

Never create raw Phaser text objects for in-game dialogue. Always use `DialogBox`:

```js
import { DialogBox } from '#ui/DialogBox.js'

create() {
  this.dialog = new DialogBox(this)  // pass scene reference

  // Show a single page of text
  this.dialog.show('Professor Pedersen: "Choose wisely."')

  // Show multiple pages with a callback when dismissed
  this.dialog.show(['Page one text.', 'Page two text.'], () => this.confirmAction())
}
```

## Reading GameState

Read directly. Do not cache across frames.

```js
// Correct — read fresh each time
update() {
  this.hud.setHp(GameState.player.hp, GameState.player.maxHp)
}

// Wrong — stale reference if GameState changes mid-battle
create() {
  this.playerHp = GameState.player.hp  // cached, won't update
}
```

## Scene Transitions

Use `BaseScene.fadeToScene()` for all transitions. Never call `this.scene.start()` directly in gameplay code — it skips the fade.

```js
// Correct
this.fadeToScene('WorldScene', { location: 'pipeline_pass' })

// Only acceptable for immediate hard cuts (title screen, loading)
this.scene.start('TitleScene')
```

## Pixel Art Compliance Checklist

Before committing any scene:

- [ ] No `tween` that interpolates `x`, `y`, `scaleX`, or `scaleY` — use frame swaps
- [ ] No non-integer scale values (`setScale(1.5)` is forbidden)
- [ ] No `setAlpha()` transitions — hide/show is instant
- [ ] All text uses `{ fontFamily: CONFIG.FONT }` — no other font
- [ ] All sprites have texture filter set to nearest (set globally in Phaser config, verify it wasn't overridden)

## Passing Data Between Scenes

```js
import { getById as getTrainerById } from '#data/trainers.js'

// Launching a battle from WorldScene
this.scene.launch('BattleScene', {
  opponent: getTrainerById('kube_master'),
  mode: 'engineer',
  returnScene: 'WorldScene',
})
this.scene.sleep('WorldScene')  // pause world, don't destroy it

// In BattleScene — receive the data
create(data) {
  this.opponent = data.opponent
  this.returnScene = data.returnScene
}

// After battle ends
onBattleEnd(result) {
  this.scene.stop('BattleScene')
  this.scene.wake(this.returnScene)
}
```
