// QuestEngine.js — quest resolution logic, zero Phaser imports.
// Handles branch quest type: presents two paths with different outcomes.
// Returns BattleEvent-style arrays so scenes can render them.

import { getById as getQuestById } from '#data/quests.js'

// ---------------------------------------------------------------------------
// resolveBranchChoice
// Given a branch quest and the chosen branch key ('open' | 'migrate'),
// returns an array of events describing what should happen next.
//
// For 'open' branch: returns a trigger_encounter event (scene starts battle).
// For 'migrate' branch: returns quiz_start with the quiz choices.
// ---------------------------------------------------------------------------
export function resolveBranchChoice(questId, branchKey) {
  const quest = getQuestById(questId)
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
  const quest = getQuestById(questId)
  if (!quest || quest.type !== 'branch') return []
  const branch = quest.branches[branchKey]
  if (!branch) return []

  const events = []

  if (won && branch.onWin) {
    const w = branch.onWin
    if (w.shameDelta)  events.push({ type: 'shame',       target: 'player', value: w.shameDelta })
    if (w.learnSkill)  events.push({ type: 'teach_skill', target: 'player', value: w.learnSkill })
    if (w.setFlag)     events.push({ type: 'set_flag',    value: w.setFlag })
  }

  if (!won && branch.onLoss) {
    const l = branch.onLoss
    if (l.hpDelta)  events.push({ type: 'damage',     target: 'player', value: Math.abs(l.hpDelta) })
    if (l.repDelta) events.push({ type: 'reputation', target: 'player', value: l.repDelta })
    if (l.dialog)   l.dialog.forEach(text => events.push({ type: 'dialog', target: 'player', text }))
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
  const quest = getQuestById(questId)
  if (!quest || quest.type !== 'branch') return []
  const branch = quest.branches[branchKey]
  if (!branch || !branch.quiz) return []

  const answer = branch.quiz[answerIndex]
  if (!answer) return []

  const events = []

  if (answer.result === 'wrong' && answer.budgetLoss) {
    events.push({ type: 'budget_drain', target: 'player', value: answer.budgetLoss })
  }

  if (answer.xp) {
    events.push({ type: 'xp_gain', target: 'player', value: answer.xp })
  }

  if (answer.itemDrop) {
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
  const quest = getQuestById(questId)
  if (!quest || quest.type !== 'branch') return []

  return Object.entries(quest.branches).map(([key, branch]) => ({
    key,
    label: branch.label,
  }))
}
