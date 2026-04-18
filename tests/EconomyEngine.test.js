import { describe, it, expect } from 'vitest'
import {
  getReputationThreshold,
  getPrice,
  canAfford,
  calculateBattleReward,
  calculateBudgetRestore,
  calculatePostBattleBudget,
  getBudgetDebtStatus,
  calculateDebtPenalty,
  calculateCostSpiralSurcharge,
  calculateCostSpiralHpGain,
  isShopUnlocked,
  purchaseItem,
  calculateQuestBudgetRestore,
} from '../src/engine/EconomyEngine.js'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeShop(overrides = {}) {
  return {
    id: 'test_shop',
    name: 'Test Shop',
    location: 'test_location',
    npc: null,
    priceMultiplier: 1.0,
    inventory: [
      { itemId: 'red_bull', basePrice: 30, stock: -1 },
      { itemId: 'rollback_potion', basePrice: 20, stock: 3 },
    ],
    unlockCondition: null,
    ...overrides,
  }
}

// ---------------------------------------------------------------------------
// getReputationThreshold
// ---------------------------------------------------------------------------

describe('getReputationThreshold', () => {
  it('returns Distinguished Engineer threshold for rep >= 90', () => {
    const t = getReputationThreshold(95)
    expect(t.shopMod).toBe(-0.20)
  })

  it('returns Walking Incident threshold for rep 0-19', () => {
    const t = getReputationThreshold(10)
    expect(t.shopMod).toBe(0.50)
  })

  it('returns neutral shopMod for mid-range reputation', () => {
    const t = getReputationThreshold(50)
    expect(t.shopMod).toBe(0)
  })
})

// ---------------------------------------------------------------------------
// getPrice
// ---------------------------------------------------------------------------

describe('getPrice', () => {
  it('returns base price with 1.0 multiplier and neutral rep', () => {
    const shop = makeShop()
    expect(getPrice(shop, 'red_bull', 50)).toBe(30)
  })

  it('applies shop multiplier', () => {
    const shop = makeShop({ priceMultiplier: 1.15 })
    // 30 * 1.15 * 1.0 = 34.5, ceil = 35
    expect(getPrice(shop, 'red_bull', 50)).toBe(35)
  })

  it('applies reputation discount for high rep', () => {
    const shop = makeShop()
    // rep 95: shopMod = -0.20, so 30 * 1.0 * 0.80 = 24
    expect(getPrice(shop, 'red_bull', 95)).toBe(24)
  })

  it('applies reputation markup for low rep', () => {
    const shop = makeShop()
    // rep 10: shopMod = 0.50, so 30 * 1.0 * 1.50 = 45
    expect(getPrice(shop, 'red_bull', 10)).toBe(45)
  })

  it('returns null for unknown item', () => {
    const shop = makeShop()
    expect(getPrice(shop, 'nonexistent', 50)).toBeNull()
  })

  it('combines shop multiplier and rep modifier', () => {
    const shop = makeShop({ priceMultiplier: 0.80 })
    // 30 * 0.80 * 0.80 = 19.2, ceil = 20
    expect(getPrice(shop, 'red_bull', 95)).toBe(20)
  })
})

// ---------------------------------------------------------------------------
// canAfford
// ---------------------------------------------------------------------------

describe('canAfford', () => {
  it('returns true when budget exceeds price', () => {
    expect(canAfford(500, 30)).toBe(true)
  })

  it('returns true when purchase puts budget to exactly debt limit', () => {
    expect(canAfford(0, 300)).toBe(true) // 0 - 300 = -300 === DEBT_LIMIT
  })

  it('returns false when purchase exceeds debt limit', () => {
    expect(canAfford(0, 301)).toBe(false)
  })

  it('allows going into debt', () => {
    expect(canAfford(10, 100)).toBe(true) // 10 - 100 = -90 > -300
  })
})

// ---------------------------------------------------------------------------
// calculateBattleReward
// ---------------------------------------------------------------------------

describe('calculateBattleReward', () => {
  it('incident optimal gives 40 credits', () => {
    expect(calculateBattleReward('incident', 'optimal')).toBe(40)
  })

  it('incident standard gives 25 credits', () => {
    expect(calculateBattleReward('incident', 'standard')).toBe(25)
  })

  it('incident shortcut gives 15 credits', () => {
    expect(calculateBattleReward('incident', 'shortcut')).toBe(15)
  })

  it('incident cursed gives 5 credits', () => {
    expect(calculateBattleReward('incident', 'cursed')).toBe(5)
  })

  it('incident nuclear gives 0 credits', () => {
    expect(calculateBattleReward('incident', 'nuclear')).toBe(0)
  })

  it('trainer win gives 30 credits', () => {
    expect(calculateBattleReward('trainer', 'win')).toBe(30)
  })

  it('trainer lose gives 0 credits', () => {
    expect(calculateBattleReward('trainer', 'lose')).toBe(0)
  })
})

// ---------------------------------------------------------------------------
// calculateBudgetRestore
// ---------------------------------------------------------------------------

describe('calculateBudgetRestore', () => {
  it('win restores 15% of maxBudget', () => {
    expect(calculateBudgetRestore(true, 500)).toBe(75)
  })

  it('loss restores 5% of maxBudget', () => {
    expect(calculateBudgetRestore(false, 500)).toBe(25)
  })

  it('floors fractional values', () => {
    expect(calculateBudgetRestore(true, 333)).toBe(49) // 333 * 0.15 = 49.95
  })
})

// ---------------------------------------------------------------------------
// calculatePostBattleBudget
// ---------------------------------------------------------------------------

describe('calculatePostBattleBudget', () => {
  it('combines reward and restore on incident optimal win', () => {
    // 40 reward + 75 restore = 115
    expect(calculatePostBattleBudget(500, 500, true, 'incident', 'optimal')).toBe(615)
  })

  it('applies only restore on trainer loss', () => {
    // 0 reward + 25 restore = 25
    expect(calculatePostBattleBudget(500, 500, false, 'trainer', 'lose')).toBe(525)
  })
})

// ---------------------------------------------------------------------------
// getBudgetDebtStatus
// ---------------------------------------------------------------------------

describe('getBudgetDebtStatus', () => {
  it('returns ok for positive budget', () => {
    expect(getBudgetDebtStatus(100).level).toBe('ok')
  })

  it('returns warning for small negative budget', () => {
    expect(getBudgetDebtStatus(-50).level).toBe('warning')
  })

  it('returns cost_alert at -100 threshold', () => {
    expect(getBudgetDebtStatus(-100).level).toBe('cost_alert')
  })

  it('returns payment_quest at -200', () => {
    expect(getBudgetDebtStatus(-200).level).toBe('payment_quest')
  })

  it('returns suspended at -300', () => {
    expect(getBudgetDebtStatus(-300).level).toBe('suspended')
  })
})

// ---------------------------------------------------------------------------
// calculateDebtPenalty
// ---------------------------------------------------------------------------

describe('calculateDebtPenalty', () => {
  it('returns 0 for positive budget', () => {
    expect(calculateDebtPenalty(100)).toBe(0)
  })

  it('returns 0 for zero budget', () => {
    expect(calculateDebtPenalty(0)).toBe(0)
  })

  it('returns technical_debt stacks based on debt amount', () => {
    // -50 * 0.1 = 5
    expect(calculateDebtPenalty(-50)).toBe(5)
  })

  it('floors fractional debt penalty', () => {
    // 15 * 0.1 = 1.5 → 1
    expect(calculateDebtPenalty(-15)).toBe(1)
  })
})

// ---------------------------------------------------------------------------
// calculateCostSpiralSurcharge
// ---------------------------------------------------------------------------

describe('calculateCostSpiralSurcharge', () => {
  it('returns 5 * turn', () => {
    expect(calculateCostSpiralSurcharge(1)).toBe(5)
    expect(calculateCostSpiralSurcharge(3)).toBe(15)
    expect(calculateCostSpiralSurcharge(10)).toBe(50)
  })
})

// ---------------------------------------------------------------------------
// calculateCostSpiralHpGain
// ---------------------------------------------------------------------------

describe('calculateCostSpiralHpGain', () => {
  it('returns 20', () => {
    expect(calculateCostSpiralHpGain()).toBe(20)
  })
})

// ---------------------------------------------------------------------------
// isShopUnlocked
// ---------------------------------------------------------------------------

describe('isShopUnlocked', () => {
  it('returns true for shops with no unlock condition', () => {
    const shop = makeShop()
    expect(isShopUnlocked(shop, { shamePoints: 0 })).toBe(true)
  })

  it('returns true when player meets shame requirement', () => {
    const shop = makeShop({ unlockCondition: { shameMin: 3 } })
    expect(isShopUnlocked(shop, { shamePoints: 5 })).toBe(true)
  })

  it('returns false when player lacks shame for locked shop', () => {
    const shop = makeShop({ unlockCondition: { shameMin: 3 } })
    expect(isShopUnlocked(shop, { shamePoints: 2 })).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// purchaseItem
// ---------------------------------------------------------------------------

describe('purchaseItem', () => {
  it('returns shop_purchase event for valid purchase', () => {
    const shop = makeShop()
    const events = purchaseItem(shop, 'red_bull', 500, 50)
    expect(events).toEqual([{ type: 'shop_purchase', itemId: 'red_bull', price: 30 }])
  })

  it('returns shop_error for unknown item', () => {
    const shop = makeShop()
    const events = purchaseItem(shop, 'nonexistent', 500, 50)
    expect(events[0].type).toBe('shop_error')
  })

  it('returns shop_error for out of stock item', () => {
    const shop = makeShop({
      inventory: [{ itemId: 'red_bull', basePrice: 30, stock: 0 }],
    })
    const events = purchaseItem(shop, 'red_bull', 500, 50)
    expect(events[0].type).toBe('shop_error')
  })

  it('returns budget_warning when purchase pushes budget negative', () => {
    const shop = makeShop()
    const events = purchaseItem(shop, 'red_bull', 20, 50) // 20 - 30 = -10
    expect(events.length).toBe(2)
    expect(events[1].type).toBe('budget_warning')
  })
})

// ---------------------------------------------------------------------------
// calculateQuestBudgetRestore
// ---------------------------------------------------------------------------

describe('calculateQuestBudgetRestore', () => {
  it('main quest restores 100% of max budget', () => {
    expect(calculateQuestBudgetRestore('main', 500)).toBe(500)
  })

  it('side quest restores 35% of max budget', () => {
    expect(calculateQuestBudgetRestore('side', 500)).toBe(175)
  })
})
