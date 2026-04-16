import { CONFIG } from '../config.js'
import { BaseScene } from '#scenes/BaseScene.js'
import { initNewGame } from '#state/GameState.js'

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
const NAME_MAX_LENGTH = 8
const DEFAULT_NAME = 'ENGINEER'
const PROLOGUE = [
  "Congratulations. You've been hired as a Junior Cloud Engineer.",
  'Your first day starts now. The infrastructure is already on fire.',
  'Professor Pedersen: Ah, a fresh one. Before you touch anything —',
  '— pick your mascot.',
]
const STARTERS = ['DOCKERTLE', 'FUNCTIONCHU', 'VMSAUR']

export class NewGameScene extends BaseScene {
  constructor() {
    super({ key: 'NewGameScene' })
    this.stage = 'name'
    this.playerName = DEFAULT_NAME
    this.cursorIndex = 0
    this.prologueIndex = 0
    this.starterIndex = 0
  }

  create() {
    this.cameras.main.setBackgroundColor('#000000')
    this.render()
    this.registerInput()
  }

  registerInput() {
    this.input.keyboard.on('keydown', (event) => {
      if (event.repeat) return

      if (this.stage === 'name') this.handleNameInput(event.code)
      if (this.stage === 'prologue') this.handlePrologueInput(event.code)
      if (this.stage === 'starter') this.handleStarterInput(event.code)
    })
  }

  handleNameInput(code) {
    const columns = 9
    const totalCells = LETTERS.length + 1

    if (code === 'ArrowRight') this.cursorIndex = (this.cursorIndex + 1) % totalCells
    if (code === 'ArrowLeft') this.cursorIndex = (this.cursorIndex - 1 + totalCells) % totalCells
    if (code === 'ArrowDown') this.cursorIndex = (this.cursorIndex + columns) % totalCells
    if (code === 'ArrowUp') this.cursorIndex = (this.cursorIndex - columns + totalCells) % totalCells

    if (code === 'KeyX') this.playerName = this.playerName.slice(0, -1)
    if (code === 'KeyZ' || code === 'Enter') {
      if (this.cursorIndex === LETTERS.length) {
        this.playerName = this.playerName || DEFAULT_NAME
        this.stage = 'prologue'
      } else if (this.playerName.length < NAME_MAX_LENGTH) {
        this.playerName += LETTERS[this.cursorIndex]
      }
    }

    this.render()
  }

  handlePrologueInput(code) {
    if (code !== 'KeyZ' && code !== 'Enter') return
    this.prologueIndex += 1
    if (this.prologueIndex >= PROLOGUE.length) {
      this.stage = 'starter'
      this.prologueIndex = PROLOGUE.length - 1
    }
    this.render()
  }

  handleStarterInput(code) {
    if (code === 'ArrowDown') this.starterIndex = (this.starterIndex + 1) % STARTERS.length
    if (code === 'ArrowUp') this.starterIndex = (this.starterIndex - 1 + STARTERS.length) % STARTERS.length
    if (code === 'KeyZ' || code === 'Enter') {
      initNewGame(this.playerName, STARTERS[this.starterIndex])
      this.fadeToScene('WorldScene')
      return
    }
    this.render()
  }

  render() {
    this.children.removeAll()

    if (this.stage === 'name') this.renderNameEntry()
    if (this.stage === 'prologue') this.renderPrologue()
    if (this.stage === 'starter') this.renderStarterChoice()
  }

  renderNameEntry() {
    const textStyle = { fontFamily: CONFIG.FONT, fontSize: '8px', color: '#ffffff' }
    this.add.text(8, 8, 'NAME', textStyle)
    this.add.text(8, 24, this.playerName || '_', textStyle)

    const columns = 9
    LETTERS.forEach((letter, index) => {
      const x = 8 + (index % columns) * 16
      const y = 44 + Math.floor(index / columns) * 14
      const selected = index === this.cursorIndex
      const prefix = selected ? '>' : ' '
      this.add.text(x, y, `${prefix}${letter}`, textStyle)
    })

    const endSelected = this.cursorIndex === LETTERS.length
    this.add.text(8, 86, `${endSelected ? '> ' : '  '}END`, textStyle)
    this.add.text(8, 106, 'Z:SELECT X:DEL', textStyle)
  }

  renderPrologue() {
    const textStyle = { fontFamily: CONFIG.FONT, fontSize: '8px', color: '#ffffff', wordWrap: { width: 144 } }
    this.add.text(8, 8, PROLOGUE[this.prologueIndex], textStyle)
    this.add.text(8, 128, 'Z/ENTER NEXT', { fontFamily: CONFIG.FONT, fontSize: '8px', color: '#ffffff' })
  }

  renderStarterChoice() {
    const textStyle = { fontFamily: CONFIG.FONT, fontSize: '8px', color: '#ffffff' }
    this.add.text(8, 8, 'PICK YOUR MASCOT', textStyle)

    STARTERS.forEach((starter, index) => {
      const prefix = index === this.starterIndex ? '> ' : '  '
      this.add.text(8, 30 + index * 14, `${prefix}${starter}`, textStyle)
    })

    this.add.text(8, 86, 'Z:CONFIRM', textStyle)
  }
}
