import Phaser from 'phaser'
import { CONFIG } from './config.js'
import { GameState } from '#state/GameState.js'
import { BootScene } from '#scenes/BootScene.js'
import { TitleScene } from '#scenes/TitleScene.js'
import { WorldScene } from '#scenes/WorldScene.js'
import { SaveScene } from '#scenes/SaveScene.js'
import { NewGameScene } from '#scenes/NewGameScene.js'
import { ServiceCatalogScene } from '#scenes/ServiceCatalogScene.js'
import { SkillManagementScene } from '#scenes/SkillManagementScene.js'
import { EmblemScene }          from '#scenes/EmblemScene.js'
import { StackOverflowScene }   from '#scenes/StackOverflowScene.js'
import { CreditsScene }         from '#scenes/CreditsScene.js'
import { BattleScene }          from '#scenes/BattleScene.js'
import { PauseScene }           from '#scenes/PauseScene.js'
import { ShopScene }            from '#scenes/ShopScene.js'

const game = new Phaser.Game({
  type:   Phaser.AUTO,
  width:  CONFIG.WIDTH,
  height: CONFIG.HEIGHT,
  parent: 'app',

  physics: {
    default: 'arcade',
    arcade:  { gravity: { y: 0 }, debug: false },
  },
  scale: {
    mode:       Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [
    BootScene,
    TitleScene,
    NewGameScene,
    WorldScene,
    SaveScene,
    ServiceCatalogScene,
    SkillManagementScene,
    EmblemScene,
    StackOverflowScene,
    BattleScene,
    PauseScene,
    CreditsScene,
    ShopScene,
  ],
})

window.addEventListener('beforeunload', e => {
  if (GameState._session.isDirty) {
    e.preventDefault()
    e.returnValue = ''
  }
})

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    game.sound.mute = true
  } else {
    game.sound.mute = GameState._session.userMuted
  }
})
