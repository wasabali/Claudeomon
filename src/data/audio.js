// ---------------------------------------------------------------------------
//  Cloud Quest – Audio Registry
//  Pure data. No imports from engine, scenes, or Phaser.
// ---------------------------------------------------------------------------

/**
 * SFX_PRESETS
 * Each entry defines a sound effect sourced from the Ninja Adventure asset pack.
 *
 *   id          – snake_case, matches object key
 *   file        – path to the .ogg asset (OGG preferred; MP3 loaded as fallback by BootScene)
 *   category    – 'battle' | 'ui' | 'overworld' | 'ambient'
 *   seed        – legacy synth seed; retained for potential procedural-generation fallback
 *   volume      – 0.0–1.0 (scaled by priority band)
 *   priority    – 1 (ambient) → 4 (critical)
 *   duration    – length in milliseconds
 *   description – human-readable note for designers
 */
const SFX_PRESETS = {

  sfx_cursor_move: {
    id: 'sfx_cursor_move',
    file: 'assets/audio/sfx/ui/cursor_move.ogg',
    category: 'ui',
    seed: 10001,
    volume: 0.25,
    priority: 1,
    duration: 30,
    description: 'Short click/tick',
  },

  sfx_confirm: {
    id: 'sfx_confirm',
    file: 'assets/audio/sfx/ui/confirm.ogg',
    category: 'ui',
    seed: 10014,
    volume: 0.45,
    priority: 2,
    duration: 50,
    description: 'Bright chirp',
  },

  sfx_cancel: {
    id: 'sfx_cancel',
    file: 'assets/audio/sfx/ui/cancel.ogg',
    category: 'ui',
    seed: 10027,
    volume: 0.4,
    priority: 2,
    duration: 40,
    description: 'Low thud',
  },

  sfx_text_blip: {
    id: 'sfx_text_blip',
    file: 'assets/audio/sfx/ui/text_blip.ogg',
    category: 'ui',
    seed: 10038,
    volume: 0.2,
    priority: 1,
    duration: 15,
    description: 'Tiny blip',
  },

  sfx_damage_hit: {
    id: 'sfx_damage_hit',
    file: 'assets/audio/sfx/battle/hit.ogg',
    category: 'battle',
    seed: 10053,
    volume: 0.55,
    priority: 3,
    duration: 80,
    description: 'Impact crunch',
  },

  sfx_damage_critical: {
    id: 'sfx_damage_critical',
    file: 'assets/audio/sfx/battle/critical.ogg',
    category: 'battle',
    seed: 10069,
    volume: 0.8,
    priority: 4,
    duration: 120,
    description: 'Bigger crunch + flash',
  },

  sfx_heal: {
    id: 'sfx_heal',
    file: 'assets/audio/sfx/battle/heal.ogg',
    category: 'battle',
    seed: 10082,
    volume: 0.45,
    priority: 2,
    duration: 100,
    description: 'Rising arpeggio',
  },

  sfx_status_apply: {
    id: 'sfx_status_apply',
    file: 'assets/audio/sfx/battle/status_apply.ogg',
    category: 'battle',
    seed: 10097,
    volume: 0.5,
    priority: 2,
    duration: 80,
    description: 'Wobble/warble',
  },

  sfx_status_expire: {
    id: 'sfx_status_expire',
    file: 'assets/audio/sfx/battle/status_expire.ogg',
    category: 'battle',
    seed: 10111,
    volume: 0.3,
    priority: 1,
    duration: 60,
    description: 'Soft release',
  },

  sfx_skill_fail: {
    id: 'sfx_skill_fail',
    file: 'assets/audio/sfx/battle/skill_fail.ogg',
    category: 'battle',
    seed: 10126,
    volume: 0.6,
    priority: 3,
    duration: 100,
    description: 'Descending sad trombone',
  },

  sfx_save: {
    id: 'sfx_save',
    file: 'assets/audio/sfx/ui/save.ogg',
    category: 'ui',
    seed: 10139,
    volume: 0.45,
    priority: 2,
    duration: 150,
    description: 'Floppy disk write sound',
  },

  sfx_shame: {
    id: 'sfx_shame',
    file: 'assets/audio/sfx/battle/shame.ogg',
    category: 'battle',
    seed: 10155,
    volume: 0.75,
    priority: 4,
    duration: 200,
    description: 'Ominous chord',
  },

  sfx_emblem_earn: {
    id: 'sfx_emblem_earn',
    file: 'assets/audio/sfx/overworld/emblem_earn.ogg',
    category: 'overworld',
    seed: 10168,
    volume: 0.8,
    priority: 4,
    duration: 300,
    description: 'Triumphant fanfare',
  },

  sfx_emblem_sparkle: {
    id: 'sfx_emblem_sparkle',
    file: 'assets/audio/sfx/overworld/emblem_sparkle.ogg',
    category: 'overworld',
    seed: 10183,
    volume: 0.25,
    priority: 1,
    duration: 50,
    description: 'Tiny sparkle',
  },

  sfx_door_locked: {
    id: 'sfx_door_locked',
    file: 'assets/audio/sfx/overworld/door_locked.ogg',
    category: 'overworld',
    seed: 10194,
    volume: 0.4,
    priority: 2,
    duration: 80,
    description: 'Buzzer / denied beep',
  },

  sfx_encounter_start: {
    id: 'sfx_encounter_start',
    file: 'assets/audio/sfx/battle/encounter_start.ogg',
    category: 'battle',
    seed: 10210,
    volume: 0.55,
    priority: 3,
    duration: 150,
    description: 'Alert jingle',
  },

  sfx_level_up: {
    id: 'sfx_level_up',
    file: 'assets/audio/sfx/overworld/level_up.ogg',
    category: 'overworld',
    seed: 10224,
    volume: 0.7,
    priority: 4,
    duration: 250,
    description: 'Rising scale fanfare',
  },

  sfx_sla_tick: {
    id: 'sfx_sla_tick',
    file: 'assets/audio/sfx/battle/sla_tick.ogg',
    category: 'battle',
    seed: 10237,
    volume: 0.4,
    priority: 2,
    duration: 40,
    description: 'Clock tick',
  },

  sfx_sla_breach: {
    id: 'sfx_sla_breach',
    file: 'assets/audio/sfx/battle/sla_breach.ogg',
    category: 'battle',
    seed: 10251,
    volume: 0.75,
    priority: 4,
    duration: 200,
    description: 'Alarm klaxon',
  },

  sfx_budget_drain: {
    id: 'sfx_budget_drain',
    file: 'assets/audio/sfx/battle/budget_drain.ogg',
    category: 'battle',
    seed: 10266,
    volume: 0.45,
    priority: 2,
    duration: 60,
    description: 'Coin loss jingle',
  },

  sfx_reputation_change: {
    id: 'sfx_reputation_change',
    file: 'assets/audio/sfx/battle/reputation_change.ogg',
    category: 'battle',
    seed: 10279,
    volume: 0.5,
    priority: 2,
    duration: 80,
    description: 'Pitch up for gain, down for loss',
  },
}

// ---------------------------------------------------------------------------

/**
 * BGM_CONFIG
 * Each entry points to a background music track on disk.
 *
 *   id         – snake_case, matches object key
 *   file       – relative path to the .ogg asset (rename the Ninja Adventure source
 *                file to this name when placing it in assets/audio/bgm/)
 *   volume     – 0.0–1.0 base playback volume
 *   loop       – whether the track loops continuously
 *   ninjaTrack – source track from the Ninja Adventure Asset Pack (CC0) by pixel-boy
 *                https://pixel-boy.itch.io/ninja-adventure-asset-pack
 */
const BGM_CONFIG = {

  title: {
    id: 'title',
    file: 'assets/audio/bgm/title.ogg',
    volume: 0.6,
    loop: true,
    ninjaTrack: '07 - MainMenu.ogg',
  },

  localhost_town: {
    id: 'localhost_town',
    file: 'assets/audio/bgm/localhost_town.ogg',
    volume: 0.4,
    loop: true,
    ninjaTrack: '18 - Town.ogg',
  },

  pipeline_pass: {
    id: 'pipeline_pass',
    file: 'assets/audio/bgm/pipeline_pass.ogg',
    volume: 0.5,
    loop: true,
    ninjaTrack: '33 - Peaceful.ogg',
  },

  container_port: {
    id: 'container_port',
    file: 'assets/audio/bgm/container_port.ogg',
    volume: 0.5,
    loop: true,
    ninjaTrack: '35 - Energy.ogg',
  },

  cloud_citadel: {
    id: 'cloud_citadel',
    file: 'assets/audio/bgm/cloud_citadel.ogg',
    volume: 0.5,
    loop: true,
    ninjaTrack: '15 - Castle.ogg',
  },

  kernel_caves: {
    id: 'kernel_caves',
    file: 'assets/audio/bgm/kernel_caves.ogg',
    volume: 0.4,
    loop: true,
    ninjaTrack: '09 - WaterCave.ogg',
  },

  serverless_steppes: {
    id: 'serverless_steppes',
    file: 'assets/audio/bgm/serverless_steppes.ogg',
    volume: 0.4,
    loop: true,
    ninjaTrack: '13 - Forest.ogg',
  },

  three_am_tavern: {
    id: 'three_am_tavern',
    file: 'assets/audio/bgm/three_am_tavern.ogg',
    volume: 0.5,
    loop: true,
    ninjaTrack: '21 - Inn.ogg',
  },

  legacy_codebase: {
    id: 'legacy_codebase',
    file: 'assets/audio/bgm/legacy_codebase.ogg',
    volume: 0.4,
    loop: true,
    ninjaTrack: '34 - Ancient.ogg',
  },

  outcast_network: {
    id: 'outcast_network',
    file: 'assets/audio/bgm/outcast_network.ogg',
    volume: 0.5,
    loop: true,
    ninjaTrack: '37 - Secret.ogg',
  },

  shadow_registry: {
    id: 'shadow_registry',
    file: 'assets/audio/bgm/shadow_registry.ogg',
    volume: 0.3,
    loop: true,
    ninjaTrack: '26 - Mystery.ogg',
  },

  battle_incident: {
    id: 'battle_incident',
    file: 'assets/audio/bgm/battle_incident.ogg',
    volume: 0.7,
    loop: true,
    ninjaTrack: '22 - Battle.ogg',
  },

  battle_engineer: {
    id: 'battle_engineer',
    file: 'assets/audio/bgm/battle_engineer.ogg',
    volume: 0.7,
    loop: true,
    ninjaTrack: '29 - Escape.ogg',
  },

  battle_cursed: {
    id: 'battle_cursed',
    file: 'assets/audio/bgm/battle_cursed.ogg',
    volume: 0.7,
    loop: true,
    ninjaTrack: '28 - Tension.ogg',
  },

  battle_throttlemaster: {
    id: 'battle_throttlemaster',
    file: 'assets/audio/bgm/battle_throttlemaster.ogg',
    volume: 0.8,
    loop: true,
    ninjaTrack: '08 - BossTheme.ogg',
  },

  victory: {
    id: 'victory',
    file: 'assets/audio/bgm/victory.ogg',
    volume: 0.7,
    loop: false,
    ninjaTrack: '23 - Victory.ogg',
  },

  game_over: {
    id: 'game_over',
    file: 'assets/audio/bgm/game_over.ogg',
    volume: 0.6,
    loop: false,
    ninjaTrack: '24 - GameOver.ogg',
  },
}

// ---------------------------------------------------------------------------
//  Registry accessors — standard pattern (getById / getAll / getBy)
//
//  audio.js has two registries (SFX + BGM) so it exposes typed helpers
//  alongside the standard accessors that search both registries.
// ---------------------------------------------------------------------------

const ALL_AUDIO = { ...SFX_PRESETS, ...BGM_CONFIG }

export const getById = (id)           => ALL_AUDIO[id]
export const getAll  = ()             => Object.values(ALL_AUDIO)
export const getBy   = (field, value) => getAll().filter(x => x[field] === value)

// Typed helpers — convenience accessors scoped to a single registry.
export const getSfxPreset = (id) => SFX_PRESETS[id]
export const getBgmConfig = (id) => BGM_CONFIG[id]
export const getAllSfx     = () => Object.values(SFX_PRESETS)
export const getAllBgm     = () => Object.values(BGM_CONFIG)
