// Shop definitions — Azure Marketplace and vending machines.
// Budget IS Azure Credits — one currency for battles, shops, everything.
const SHOPS = {
  azure_marketplace: {
    id: 'azure_marketplace',
    name: 'Azure Marketplace',
    location: 'azure_town',
    npc: 'the_billing_dashboard',
    priceMultiplier: 1.0,
    inventory: [
      { itemId: 'red_bull',             basePrice: 30, stock: -1 },
      { itemId: 'rollback_potion',      basePrice: 20, stock: -1 },
      { itemId: 'azure_credit_voucher', basePrice: 40, stock: 3  },
      { itemId: 'skip_tests_scroll',    basePrice: 60, stock: 1  },
      { itemId: 'on_call_phone',        basePrice: 50, stock: 1  },
      { itemId: 'incident_postmortem',  basePrice: 15, stock: -1 },
    ],
    unlockCondition: null,
  },
  pipeline_vending: {
    id: 'pipeline_vending',
    name: 'CI/CD Vending Machine',
    location: 'pipeline_pass',
    npc: null,
    priceMultiplier: 1.15,
    inventory: [
      { itemId: 'red_bull',        basePrice: 30, stock: 5 },
      { itemId: 'rollback_potion', basePrice: 20, stock: 5 },
      { itemId: 'cold_coffee',     basePrice: 5,  stock: 3 },
    ],
    unlockCondition: null,
  },
  three_am_vending: {
    id: 'three_am_vending',
    name: 'Suspicious Vending Machine',
    location: 'three_am_tavern',
    npc: null,
    priceMultiplier: 0.80,
    inventory: [
      { itemId: 'scorched_server',   basePrice: 25, stock: 2 },
      { itemId: 'cold_coffee',       basePrice: 3,  stock: -1 },
      { itemId: 'skip_tests_scroll', basePrice: 40, stock: 1  },
    ],
    unlockCondition: { shameMin: 3 },
  },
}

export const getById = (id)           => SHOPS[id]
export const getAll  = ()             => Object.values(SHOPS)
export const getBy   = (field, value) => getAll().filter(x => x[field] === value)
