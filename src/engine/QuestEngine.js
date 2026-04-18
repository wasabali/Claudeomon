// QuestEngine.js — pure quest evaluation logic, zero Phaser imports.
// Evaluates quest availability, resolves choices, advances stages,
// and provides Ivan/Alice-specific helpers.
//
// Quest types:
//   quiz        — single-stage NPC quiz
//   branch      — single-stage with branching outcomes
//   multi_stage — multiple sequential stages (Ivan, Alice)

import { getById } from '#data/quests.js'

// ---------------------------------------------------------------------------
// normalizeStory
// Ensures storyState.flags and storyState.activeQuests exist, so old save
// files that predate these fields don't cause runtime errors.
// ---------------------------------------------------------------------------
function normalizeStory(storyState) {
  if (!storyState.flags) storyState.flags = {}
  if (!storyState.activeQuests) storyState.activeQuests = {}
}

// ---------------------------------------------------------------------------
// isQuestAvailable
// Returns { available: boolean, reason: string | null } describing whether
// the player can start or interact with this quest.
// ---------------------------------------------------------------------------
export function isQuestAvailable(questId, storyState) {
  normalizeStory(storyState)
  const quest = getById(questId)
  if (!quest) return { available: false, reason: `Quest "${questId}" not found.` }

  // Already complete (completionFlag is set in flags)
  if (quest.completionFlag && storyState.flags[quest.completionFlag]) {
    return { available: false, reason: 'Quest is already complete.' }
  }

  // Already active and completed
  const active = storyState.activeQuests[questId]
  if (active && active.complete) {
    return { available: false, reason: 'Quest is already complete.' }
  }

  // Act check — quest requires a minimum act
  if (quest.act != null && storyState.act < quest.act) {
    return { available: false, reason: `Requires act ${quest.act}, currently in act ${storyState.act}.` }
  }

  // Required flags check
  if (quest.requiresFlags && !quest.requiresFlags.every(flag => storyState.flags[flag])) {
    const missing = quest.requiresFlags.find(flag => !storyState.flags[flag])
    return { available: false, reason: `Missing required flag: ${missing}.` }
  }

  // Exclude flags check
  if (quest.excludeFlags) {
    const blocking = quest.excludeFlags.find(flag => storyState.flags[flag])
    if (blocking) {
      return { available: false, reason: `Excluded by flag: ${blocking}.` }
    }
  }

  return { available: true, reason: null }
}

// ---------------------------------------------------------------------------
// getQuestStatus
// Returns 'available' | 'active' | 'complete' | 'followed_up' | 'unavailable'
// ---------------------------------------------------------------------------
export function getQuestStatus(questId, storyState) {
  normalizeStory(storyState)
  const quest = getById(questId)
  if (!quest) return 'unavailable'

  // Check followed_up first (more specific than complete)
  if (quest.completionFlag && storyState.flags[quest.completionFlag]) {
    if (storyState.flags[`quest_${questId}_followed_up`]) {
      return 'followed_up'
    }
    return 'complete'
  }

  // Check if active
  if (storyState.activeQuests[questId]) {
    return 'active'
  }

  // Check if available
  const { available } = isQuestAvailable(questId, storyState)
  if (available) return 'available'

  return 'unavailable'
}

// ---------------------------------------------------------------------------
// startQuest
// Adds quest to storyState.activeQuests with { stage: 0, attempts: 1 }.
// Returns { started: boolean, questData: object | null }
// ---------------------------------------------------------------------------
export function startQuest(questId, storyState) {
  normalizeStory(storyState)
  const quest = getById(questId)
  if (!quest) return { started: false, questData: null }

  // Already active
  if (storyState.activeQuests[questId]) {
    return { started: false, questData: quest }
  }

  // Already complete
  if (quest.completionFlag && storyState.flags[quest.completionFlag]) {
    return { started: false, questData: quest }
  }

  storyState.activeQuests[questId] = { stage: 0, attempts: 1 }
  return { started: true, questData: quest }
}

// ---------------------------------------------------------------------------
// getCurrentStage
// Returns the current stage data from the quest's stages array, or null.
// ---------------------------------------------------------------------------
export function getCurrentStage(questId, storyState) {
  normalizeStory(storyState)
  const quest = getById(questId)
  if (!quest) return null

  const active = storyState.activeQuests[questId]
  if (!active) return null

  const stage = quest.stages[active.stage]
  return stage || null
}

// ---------------------------------------------------------------------------
// resolveChoice
// Takes the quest ID, chosen answer index, story state, and player state.
// Returns a QuestEvent object or null if the quest/choice is invalid.
// ---------------------------------------------------------------------------
export function resolveChoice(questId, choiceIndex, storyState, playerState) {
  normalizeStory(storyState)
  const quest = getById(questId)
  if (!quest) return null

  const active = storyState.activeQuests[questId]
  if (!active) return null

  const stageIndex = active.stage
  const stage = quest.stages[stageIndex]
  if (!stage) return null

  const choice = stage.choices[choiceIndex]
  if (!choice) return null

  const isLastStage = stageIndex >= quest.stages.length - 1
  const isCorrect = choice.correct !== false
  const questComplete = isCorrect && isLastStage

  // Build penalty — handle both new-style { type, value } and legacy hpLoss
  // (margaret_website uses hpLoss; newer quests use { type, value })
  let penalty = choice.penalty || null
  if (!penalty && choice.hpLoss) {
    penalty = { type: 'hp', value: -choice.hpLoss }
  }

  // HP floor at 1: clamp HP penalty so player can't die from wrong answers.
  // Only HP penalties are clamped — budget/reputation have no floor by design.
  if (penalty && penalty.type === 'hp' && penalty.value < 0) {
    const currentHp = playerState.hp ?? 100
    const maxLoss = Math.max(0, currentHp - 1)
    if (-penalty.value > maxLoss) {
      penalty = { ...penalty, value: maxLoss === 0 ? 0 : -maxLoss }
    }
  }

  // stage_reset penalty: the scene resets the player to redo the current
  // stage. The engine flags it here; the scene applies it via startQuest
  // or by resetting activeQuests[questId].stage to the current value.
  const stageReset = penalty != null && penalty.type === 'stage_reset'

  return {
    questId,
    stageIndex,
    choiceIndex,
    correct:          choice.correct ?? false,
    xp:               choice.xp ?? 0,
    repDelta:         choice.repDelta ?? 0,
    shameDelta:       choice.shameDelta ?? 0,
    penalty,
    itemReward:       choice.itemReward || null,
    flag:             choice.flag || null,
    triggerEncounter: choice.triggerEncounter || null,
    responseDialog:   choice.responseDialog || [],
    stageReset,
    questComplete:    stageReset ? false : questComplete,
    completionFlag:   (stageReset ? false : questComplete) ? (quest.completionFlag || null) : null,
  }
}

// ---------------------------------------------------------------------------
// isQuestCompleted
// Returns true if the quest ID is in the completed list.
// ---------------------------------------------------------------------------
export function isQuestCompleted(questId, completedQuests) {
  return completedQuests.includes(questId)
}

// ---------------------------------------------------------------------------
// getCompletedDialog
// Returns the revisit dialog for a completed quest.
// ---------------------------------------------------------------------------
export function getCompletedDialog(questId) {
  const quest = getById(questId)
  return quest?.completedDialog ?? ['...']
}

// ---------------------------------------------------------------------------
// resolveBranchChoice
// Given a branch quest and the chosen branch key ('open' | 'migrate'),
// returns an array of events describing what should happen next.
//
// For 'open' branch: returns a trigger_encounter event (scene starts battle).
// For 'migrate' branch: returns quiz_start with the quiz choices.
// ---------------------------------------------------------------------------
export function resolveBranchChoice(questId, branchKey) {
  const quest = getById(questId)
  if (!quest || quest.type !== 'branch') return []
  const branch = quest.branches[branchKey]
  if (!branch) return []

  const events = []

  if (branch.triggerEncounter) {
    events.push({ type: 'trigger_encounter', value: branch.triggerEncounter, branchKey })
  }

  if (branch.quiz) {
    events.push({ type: 'quiz_start', value: branch.quiz, branchKey })
  }

  return events
}

// ---------------------------------------------------------------------------
// resolveBranchBattleOutcome
// Called after a battle triggered by a branch quest's 'open' path.
// `won` is true/false. Returns events for the outcome.
// ---------------------------------------------------------------------------
export function resolveBranchBattleOutcome(questId, branchKey, won) {
  const quest = getById(questId)
  if (!quest || quest.type !== 'branch') return []
  const branch = quest.branches[branchKey]
  if (!branch) return []

  const events = []

  if (won && branch.onWin) {
    const w = branch.onWin
    if (w.shameDelta != null) events.push({ type: 'shame',       target: 'player', value: w.shameDelta })
    if (w.learnSkill != null) events.push({ type: 'teach_skill', target: 'player', value: w.learnSkill })
    if (w.setFlag != null)    events.push({ type: 'set_flag',    value: w.setFlag })
  }

  if (!won && branch.onLoss) {
    const l = branch.onLoss
    if (l.hpDelta != null) {
      if (l.hpDelta < 0) events.push({ type: 'damage', target: 'player', value: Math.abs(l.hpDelta) })
      if (l.hpDelta > 0) events.push({ type: 'heal',   target: 'player', value: l.hpDelta })
    }
    if (l.repDelta != null) events.push({ type: 'reputation', target: 'player', value: l.repDelta })
    if (l.dialog != null)   l.dialog.forEach(text => events.push({ type: 'dialog', target: 'player', text }))
  }

  if (quest.completionFlag) {
    events.push({ type: 'set_flag', value: quest.completionFlag })
  }

  return events
}

// ---------------------------------------------------------------------------
// resolveQuizAnswer
// Called when the player answers a quiz in a 'migrate'-style branch.
// `answerIndex` is the 0-based index into branch.quiz[].
// Returns events describing the outcome.
// ---------------------------------------------------------------------------
export function resolveQuizAnswer(questId, branchKey, answerIndex) {
  const quest = getById(questId)
  if (!quest || quest.type !== 'branch') return []
  const branch = quest.branches[branchKey]
  if (!branch || !branch.quiz) return []

  const answer = branch.quiz[answerIndex]
  if (!answer) return []

  const events = []

  if (answer.result === 'wrong' && answer.budgetLoss != null) {
    events.push({ type: 'budget_drain', target: 'player', value: answer.budgetLoss })
  }

  if (answer.xp != null) {
    events.push({ type: 'xp_gain', target: 'player', value: answer.xp })
  }

  if (answer.itemDrop != null) {
    events.push({ type: 'item_drop', target: 'player', value: answer.itemDrop })
  }

  if (answer.result === 'optimal' && branch.onOptimal) {
    const o = branch.onOptimal
    if (o.setFlag) events.push({ type: 'set_flag', value: o.setFlag })
    if (o.dialog) o.dialog.forEach(text => events.push({ type: 'dialog', target: 'player', text }))
  }

  if (branch.followUpLine) {
    events.push({ type: 'dialog', target: 'player', text: branch.followUpLine })
  }

  if (quest.completionFlag) {
    events.push({ type: 'set_flag', value: quest.completionFlag })
  }

  return events
}

// ---------------------------------------------------------------------------
// getBranchLabels
// Returns the labels for a branch quest's two paths.
// Used by scenes to display the choice UI.
// ---------------------------------------------------------------------------
export function getBranchLabels(questId) {
  const quest = getById(questId)
  if (!quest || quest.type !== 'branch') return []

  return Object.entries(quest.branches).map(([key, branch]) => ({
    key,
    label: branch.label,
  }))
}

// advanceStage
// Increments storyState.activeQuests[questId].stage.
// If stage >= quest stages length, marks quest complete.
// Returns { advanced: boolean, newStage: number, questComplete: boolean }
// ---------------------------------------------------------------------------
export function advanceStage(questId, storyState) {
  normalizeStory(storyState)
  const quest = getById(questId)
  if (!quest) return { advanced: false, newStage: 0, questComplete: false }

  const active = storyState.activeQuests[questId]
  if (!active) return { advanced: false, newStage: 0, questComplete: false }

  active.stage += 1
  const newStage = active.stage
  const questComplete = newStage >= quest.stages.length

  if (questComplete && quest.completionFlag) {
    storyState.flags[quest.completionFlag] = true
  }

  return { advanced: true, newStage, questComplete }
}

// ---------------------------------------------------------------------------
// getIvanLocation
// Returns the location where Ivan should appear for the given act.
// Uses the ivanLocations map from the intern_ivan_roaming quest.
// Returns null if act is out of range.
// ---------------------------------------------------------------------------
export function getIvanLocation(act) {
  const ivanQuest = getById('intern_ivan_roaming')
  if (!ivanQuest || !ivanQuest.ivanLocations) return null
  return ivanQuest.ivanLocations[act] || null
}

// ---------------------------------------------------------------------------
// canAdvanceAliceStage
// Checks if Alice's current stage's requiresFlags are all met.
// Returns boolean.
// ---------------------------------------------------------------------------
export function canAdvanceAliceStage(stageIndex, storyFlags) {
  const aliceQuest = getById('architect_alice_design')
  if (!aliceQuest) return false

  if (stageIndex < 0 || stageIndex >= aliceQuest.stages.length) return false

  const stage = aliceQuest.stages[stageIndex]
  if (!stage.requiresFlags) return true

  return stage.requiresFlags.every(flag => !!storyFlags[flag])
}
