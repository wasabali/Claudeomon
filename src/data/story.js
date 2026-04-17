// Story act definitions, dialog trees, and narrative flags.
// Registry pattern: getById('npc_margaret') → { id, pages, variants? }
//
// Dialogue variants are checked before the default `pages`.
// Each variant has a `condition` object with optional fields:
//   reputationMin, reputationMax, shameMin, shameMax
// The first matching variant wins (evaluated top-to-bottom).
//
// Variants may also have a `pool` field (array of pages arrays) instead of
// `pages`. When matched, a random entry from the pool is selected. This is
// used for shame-3 one-liners so players see different reactions each time.
const STORY = {
  npc_margaret: {
    id:    'npc_margaret',
    pages: [
      "Oh! A new engineer! Welcome to Localhost Town.",
      "The Azure Terminal is just east of here.\nUse it to manage your skill deck.",
      "Be careful in the tall grass — incidents love\nto ambush young engineers.",
    ],
    variants: [
      {
        condition: { shameMin: 10 },
        pages: [
          "...",
          "I've heard what you've been doing.\nI think you should leave.",
        ],
      },
      {
        condition: { shameMin: 5 },
        pages: [
          "You again. People are talking, you know.\nNot in a good way.",
          "Please be careful what you do out there.",
        ],
      },
      {
        // shame 3–4: random one-liner from pool about what you did to the repo
        condition: { shameMin: 3, shameMax: 4 },
        pool: [
          ["I heard about what you did to the repo.\nYou know that `git reflog` exists, right?"],
          ["Someone told me what happened in prod last week.\n...We don't need to talk about it."],
          ["I can't believe you committed directly to main.\nProfessor Pedersen is inconsolable."],
          ["So I heard about the force push.\nThe whole team had to re-clone. You know that?"],
          ["The intern cried. Just so you know.\nAfter your last deployment."],
          ["Three people filed Jira tickets about you.\nPersonally. About you."],
        ],
      },
      {
        condition: { reputationMin: 80 },
        pages: [
          "Welcome back! The whole town is talking\nabout your last deployment.",
          "You're becoming a legend around here.",
        ],
      },
      {
        condition: { reputationMax: -25 },
        pages: [
          "Oh. It's you.",
          "No, everything's fine. I was just leaving.",
        ],
      },
    ],
  },
  npc_azure_terminal: {
    id:    'npc_azure_terminal',
    pages: [
      '> AZURE TERMINAL v2.0\n> Connecting to skill management...',
    ],
  },
  npc_professor_pedersen: {
    id:    'npc_professor_pedersen',
    pages: [
      "Ah, a new student! Study hard and use\nonly the approved techniques.",
      "There are no shortcuts worth taking\nin this profession.",
    ],
    // Variants are evaluated top-to-bottom; first match wins.
    // Most-specific conditions (multiple fields) come before less-specific ones.
    variants: [
      {
        // Shadow Engineer — genuine awe mixed with deep despair
        condition: { shameMin: 10 },
        pages: [
          "I wrote the textbook on responsible engineering.\nYou apparently used it as a doorstop.",
          "And yet... you're still here. Still winning.\n*stares into the middle distance*",
          "I need a moment.",
        ],
      },
      {
        // High shame + still competent → "brilliant but dangerous"
        condition: { shameMin: 5, reputationMin: 60 },
        pages: [
          "Your work is impressive. I wish I could\nsay the same about your methods.",
          "*sighs* I hope you know what you're doing.",
        ],
      },
      {
        // High shame + low reputation → full disappointment
        condition: { shameMin: 5 },
        pages: [
          "*sighs*",
          "I've seen what's in your commit history.\nI'm deeply disappointed.",
        ],
      },
      {
        // shame 3–4 one-liner pool
        condition: { shameMin: 3, shameMax: 4 },
        pool: [
          ["I heard about what you did to the repo.\nI'm choosing to believe it was an accident."],
          ["You skipped the tests again, didn't you.\nThe CI log doesn't lie."],
          ["Three of my students saw what you did.\nThey're considering other careers now."],
          ["I've started locking the lab when you're around.\nNothing personal."],
        ],
      },
      {
        condition: { shameMin: 1 },
        pages: [
          "Hm. I've heard some things.\nJust... be careful with those techniques.",
        ],
      },
      {
        condition: { reputationMin: 80 },
        pages: [
          "Excellent work on that last incident.\nYou're exactly the kind of engineer\nwe need more of.",
        ],
      },
      {
        condition: { reputationMax: -50 },
        pages: [
          "Ah. You.",
          "You know we have a runbook now.\nSection 4 is just your name.",
        ],
      },
      {
        condition: { reputationMax: -25 },
        pages: [
          "I see you again.",
          "I've updated the curriculum.\nThere's now a case study titled 'What Not To Do.'\nI think you'll recognise the scenarios.",
        ],
      },
    ],
  },
  npc_random_intern: {
    id:    'npc_random_intern',
    pages: [
      "H-hi! I'm still learning...\nDo you have any tips?",
    ],
    variants: [
      {
        condition: { shameMin: 10 },
        pages: [
          "Oh no.",
          "My senior said if I see you,\nI should run a `git stash` and leave immediately.",
          "Goodbye.",
        ],
      },
      {
        condition: { shameMin: 5 },
        pages: [
          "Oh. Um. I heard about you.\nMy senior told me to avoid you.",
          "No offence.",
        ],
      },
      {
        // shame 3–4 one-liner pool
        condition: { shameMin: 3, shameMax: 4 },
        pool: [
          ["I heard you push directly to main sometimes.\nIs... is that allowed?"],
          ["Someone said you deployed on a Friday?\nAnd lived?"],
          ["They're talking about you in the Slack channel.\nThe one I'm not supposed to know about."],
          ["I looked at your commit history once.\nI closed the tab pretty fast."],
        ],
      },
      {
        // shameMax: 0 — only greet clean-record players (exactly 0 shame accumulated)
        condition: { reputationMin: 80, shameMax: 0 },
        pages: [
          "I heard you fixed the payments API\nin two turns. Can you show me how?",
          "You're kind of my hero right now.",
        ],
      },
      {
        condition: { reputationMax: -25 },
        pages: [
          "Oh! Sorry, I didn't see— I mean I did see you, I just—",
          "I'll just go check on... something. Elsewhere.",
        ],
      },
    ],
  },
  terminal_hosting: {
    id:    'terminal_hosting',
    pages: [
      '> az staticwebapp show --name cloud-quest',
      '{\n  "name": "cloud-quest",\n  "location": "West Europe",\n  "sku": "Free",\n  "repositoryUrl": "https://github.com/wasabali/claudeomon",\n  "branch": "main",\n  "defaultHostname": "cloud-quest.azurestaticapps.net"\n}',
      '> cat staticwebapp.config.json',
      '{\n  "globalHeaders": {\n    "Cross-Origin-Opener-Policy": "same-origin",\n    "Cross-Origin-Embedder-Policy": "require-corp"\n  }\n}',
      'These two headers are the reason you can play this game.\nYou are inside the infrastructure you are learning to manage.',
    ],
  },
  terminal_hosting_pipeline: {
    id:    'terminal_hosting_pipeline',
    pages: [
      'name: Deploy Cloud Quest\n\non:\n  push:\n    branches: [main]\n\njobs:\n  deploy:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v3\n      - name: Build\n        run: npm run build\n      - name: Deploy to Azure Static Web Apps\n        uses: Azure/static-web-apps-deploy@v1',
    ],
  },
  npc_west_eu_2_wilhelm: {
    id:    'npc_west_eu_2_wilhelm',
    pages: [
      "West-EU-2 Wilhelm: I used to run a whole region.\nNow I'm just deprecated.",
      "They shut it down without even a blog post.",
    ],
  },
  npc_west_eu_2_wilhelm_post_terminal: {
    id:    'npc_west_eu_2_wilhelm_post_terminal',
    pages: [
      "West-EU-2 Wilhelm: West Europe. Of course they picked West Europe.",
      "I put in a request to host it in West-EU-2.\nStill waiting on the ticket.",
    ],
  },

  // =========================================================================
  // CTO BOSS — dialog by phase
  // =========================================================================

  cto_phase_1_intro: {
    id: 'cto_phase_1_intro',
    pages: [
      "Why is the site down?",
      "I have a board meeting in 20 minutes\nand the dashboard is showing red.",
      "Fix it. Now.",
    ],
  },
  cto_phase_2_transition: {
    id: 'cto_phase_2_transition',
    pages: [
      "Fine, the site is up. But LOOK at this bill.",
      "LOOK AT IT.",
      "This is more than my house.",
    ],
  },
  cto_phase_3_transition: {
    id: 'cto_phase_3_transition',
    pages: [
      "I need you to explain something.",
      "Why. Can't. We. Use. Excel?",
      "I built the original system in Excel.\nIt worked fine for 15 years.",
    ],
  },
  cto_executive_mode: {
    id: 'cto_executive_mode',
    pages: [
      "That's it. I'm taking over.",
      "Executive Mode: ACTIVATED.",
    ],
  },
  cto_defeat: {
    id: 'cto_defeat',
    pages: [
      "...",
      "You know what? You're promoted.",
      "Principal Engineer, effective immediately.",
    ],
    variants: [
      {
        condition: { shameMin: 10 },
        pages: [
          "You won. I don't know how you operate,\nand I don't want to know.",
          "You're promoted.",
        ],
      },
    ],
  },

  // =========================================================================
  // ENDINGS
  // =========================================================================

  ending_post_mortem: {
    id: 'ending_post_mortem',
    title: 'The Post-Mortem',
    titleCard: '"The Post-Mortem"',
    promotionLine: "I'm promoting you to Principal Engineer.",
    confluenceLine: 'Page views: 0.',
    creditsMusic: 'bgm_azure_theme_chiptune',
    postCreditsText: 'ALERT: Production Plains — High CPU (98%).',
    postCreditsFollowUp: '47 more alerts pending.',
    pages: ['"The Post-Mortem"'],
  },
  ending_shadow_post_mortem: {
    id: 'ending_shadow_post_mortem',
    title: 'The Shadow Post-Mortem',
    titleCard: '"The Shadow Post-Mortem"',
    promotionLine: "Promoted. There are also some audit findings.\nWe'll discuss those.",
    confluenceLine: 'Page views: 0.',
    creditsMusic: 'bgm_azure_theme_minor',
    postCreditsText: 'AUDIT: 47 compliance findings pending.',
    postCreditsFollowUp: 'Have a good weekend.',
    pages: ['"The Shadow Post-Mortem"'],
  },
  ending_fork_the_company: {
    id: 'ending_fork_the_company',
    title: 'Fork the Company',
    titleCard: '"Fork the Company"',
    promotionLine: 'Welcome to TechThrottle Consulting AS.',
    creditsMusic: 'bgm_cursed_theme',
    postCreditsText: 'Monthly Azure bill: €47,000.',
    postCreditsFollowUp: 'Promotion: Principal Villain.',
    pages: ['"Fork the Company"'],
  },

  // =========================================================================
  // CREDITS NPC LIST
  // =========================================================================

  credits_npc_list: {
    id: 'credits_npc_list',
    pages: [],
    entries: [
      { name: 'Margaret',                role: 'Town Guide' },
      { name: 'Professor Pedersen',      role: 'Ethics & Education' },
      { name: 'Ola the Ops Guy',         role: 'Linux Fundamentals' },
      { name: 'Tux the Terminal Wizard',  role: 'Terminal Arts' },
      { name: 'Fatima the Function Witch', role: 'Serverless Engineering' },
      { name: 'Bjorn the Breaker',       role: 'Security Operations' },
      { name: 'The CTO',                 role: 'Executive Oversight' },
      { name: 'The Random Intern',       role: 'Moral Support' },
    ],
  },

  // =========================================================================
  // CONFLUENCE PAGE
  // =========================================================================

  confluence_page: {
    id: 'confluence_page',
    pages: [
      "Confluence — New Page Created:",
      "Page views: 0.",
    ],
  },

  // =========================================================================
  // POST-CREDITS PAGER
  // =========================================================================

  pager_alert: {
    id: 'pager_alert',
    pages: [
      'ALERT: Production Plains — High CPU (98%).\nClick to acknowledge.',
    ],
  },
  pager_acknowledged: {
    id: 'pager_acknowledged',
    pages: [
      'Thank you for acknowledging this alert.\n47 more alerts pending.',
    ],
  },
}

export const getById = (id)           => STORY[id]
export const getAll  = ()             => Object.values(STORY)
export const getBy   = (field, value) => getAll().filter(x => x[field] === value)
