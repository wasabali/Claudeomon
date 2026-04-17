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
}

// ---------------------------------------------------------------------------
// Shame one-liner pools — randomly selected per NPC interaction.
// Same NPC says the same thing on repeat visits (seed: npcId + shamePoints + location).
// ---------------------------------------------------------------------------
export const SHAME_ONE_LINERS = {
  shame_3: [
    { id: 'shame3_01', text: 'I heard what you did to that repo. We all heard.', tone: 'disgust' },
    { id: 'shame3_02', text: 'The postmortem channel has your name in bold.', tone: 'disgust' },
    { id: 'shame3_03', text: 'Someone left a screenshot of your git log in the break room.', tone: 'disgust' },
    { id: 'shame3_04', text: 'HR says you are not technically a war criminal.', tone: 'disgust' },
    { id: 'shame3_05', text: 'The CEO mentioned you by name in the all-hands. Not in a good way.', tone: 'disgust' },
    { id: 'shame3_06', text: 'Did you... did you really chmod 777 production?', tone: 'horror' },
    { id: 'shame3_07', text: 'The firewall team printed your commit and hung it in their office. As a warning.', tone: 'horror' },
    { id: 'shame3_08', text: 'Three services went down. They are calling it your name now.', tone: 'horror' },
    { id: 'shame3_09', text: 'The SRE team made a drinking game out of your incidents.', tone: 'horror' },
    { id: 'shame3_10', text: 'Legend says if you type your name in the terminal three times, an alert fires.', tone: 'horror' },
    { id: 'shame3_11', text: 'I hate that what you did actually worked.', tone: 'respect' },
    { id: 'shame3_12', text: 'The interns think you are cool. The seniors are concerned.', tone: 'respect' },
    { id: 'shame3_13', text: 'That was the worst best fix I have ever seen.', tone: 'respect' },
    { id: 'shame3_14', text: 'Your PR got more comments than the company blog post.', tone: 'disgust' },
    { id: 'shame3_15', text: 'The on-call rotation now has a you-specific runbook.', tone: 'horror' },
  ],
  shame_5: [
    { id: 'shame5_01', text: 'The Throttlemaster sends their regards. Here is my card.', tone: 'ominous' },
    { id: 'shame5_02', text: 'You have been flagged in the vendor risk assessment.', tone: 'ominous' },
    { id: 'shame5_03', text: 'Welcome to the watchlist. Snacks are in the back.', tone: 'ominous' },
    { id: 'shame5_04', text: 'Even the load balancer knows your name now.', tone: 'ominous' },
    { id: 'shame5_05', text: 'The firewall has a rule specifically for you. Rule #1: Deny.', tone: 'ominous' },
    { id: 'shame5_06', text: 'Your access logs are being studied by three teams.', tone: 'ominous' },
    { id: 'shame5_07', text: 'Someone in security wrote a blog post about you. Anonymous. Barely.', tone: 'ominous' },
    { id: 'shame5_08', text: 'The incident channel auto-pings you now. You are not on-call.', tone: 'ominous' },
    { id: 'shame5_09', text: 'Your badge still works but the doors hesitate.', tone: 'ominous' },
    { id: 'shame5_10', text: 'The monitoring dashboard has a panel named after you.', tone: 'ominous' },
    { id: 'shame5_11', text: 'There is a canary deployment just for your commits.', tone: 'ominous' },
    { id: 'shame5_12', text: 'The SOC team has your photo on the wall. Not in a good way.', tone: 'ominous' },
    { id: 'shame5_13', text: 'Compliance sent you a holiday card. It was a cease and desist.', tone: 'ominous' },
    { id: 'shame5_14', text: 'Your merge requests now require 5 approvals. Standard is 2.', tone: 'ominous' },
    { id: 'shame5_15', text: 'The CISO mentioned you in their board presentation. Slide 7.', tone: 'ominous' },
  ],
  shame_10: [
    { id: 'shame10_01', text: "You don't look like an engineer anymore. You look like a consequence.", tone: 'dark' },
    { id: 'shame10_02', text: 'The coffee machine fears you. It brews when you walk by. Unprompted.', tone: 'dark' },
    { id: 'shame10_03', text: 'Your LinkedIn changed to Shadow Engineer and somehow got more recruiter messages.', tone: 'dark' },
    { id: 'shame10_04', text: 'You have mass. Gravitational. Services orbit around you now.', tone: 'dark' },
    { id: 'shame10_05', text: 'Legend. Shadow. Liability. HR uses all three.', tone: 'dark' },
    { id: 'shame10_06', text: 'The CI pipeline pauses when you push. Out of respect. Or fear.', tone: 'dark' },
    { id: 'shame10_07', text: 'Your terminal prompt changed to a skull emoji. You did not configure this.', tone: 'dark' },
    { id: 'shame10_08', text: 'Juniors whisper your name like a campfire story.', tone: 'dark' },
    { id: 'shame10_09', text: 'The SLA has a clause about you specifically.', tone: 'dark' },
    { id: 'shame10_10', text: 'You walk into the standup and everyone stands a little further away.', tone: 'dark' },
    { id: 'shame10_11', text: 'Kubernetes clusters self-heal faster when you are nearby. Survival instinct.', tone: 'dark' },
    { id: 'shame10_12', text: 'Your git blame is a true crime documentary.', tone: 'dark' },
    { id: 'shame10_13', text: 'The chaos engineering team says you make their job redundant.', tone: 'dark' },
    { id: 'shame10_14', text: 'Cloud providers sent you a personal thank-you. Your incidents fund three regions.', tone: 'dark' },
    { id: 'shame10_15', text: 'You have achieved a state beyond on-call. You are the incident.', tone: 'dark' },
  ],
}

// ---------------------------------------------------------------------------
// Reputation-variant NPC dialog snippets for shops and key NPCs.
// Used by scenes to pick context-appropriate dialog.
// ---------------------------------------------------------------------------
export const REPUTATION_DIALOG = {
  pedersen: {
    walking_incident: 'Ah. You. The one my insurance company called about.',
    liability:        'I see you have chosen... a path.',
    distinguished:    'I mentioned you in my keynote.',
  },
  shop: {
    walking_incident: 'Cash only. And I am counting it twice.',
    liability:        'Surge pricing is active. Just for you.',
    distinguished:    'For you? Discount. Always.',
  },
}

export const getById = (id)           => STORY[id]
export const getAll  = ()             => Object.values(STORY)
export const getBy   = (field, value) => getAll().filter(x => x[field] === value)
