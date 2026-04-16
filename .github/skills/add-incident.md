# Add Incident

Turn a real work problem into a Cloud Quest battle incident. Invoke with a description of the issue (e.g. "Our pods keep OOMKilling in prod after the latest deploy").

## What is an incident in Cloud Quest?

In Cloud Quest, **incidents are wild encounters** — the player stumbles into them while exploring the world, like running into a Pokémon in tall grass. Instead of a creature, the enemy is a technical problem: a CrashLoopBackOff, a cost spike, a failing pipeline.

**The player doesn't know the root cause at the start.** They see symptoms. They have to use an Observability skill to reveal the domain type, then hit it with the right domain for full damage. There's also an SLA timer — if it counts down to zero before the incident is resolved, the player takes HP and reputation damage.

Real incidents from real engineers make the best game content. If you've solved it before, you know exactly what symptoms appear, what the root cause is, and how to fix it.

---

## What you need to provide

Extract from the invocation or ask:

1. **What does the player SEE first?** (the symptom — what error/alert/behavior shows up)
   - Examples: *"Pods in CrashLoopBackOff"*, *"502 errors on the load balancer"*, *"Azure bill 3× normal"*, *"Pipeline stuck at lint step"*

2. **What is the actual root cause?** (hidden from the player until domain is revealed)
   - Examples: *"OOM limit too low"*, *"Misconfigured health check"*, *"Someone left a test cluster running"*, *"Node module cache busted"*

3. **What domain type is it?** (pick one)
   | Domain | Types of incidents it covers |
   |---|---|
   | `linux` | Process issues, file permissions, service failures, cron jobs |
   | `containers` | Docker, image build failures, registry issues, OOM |
   | `kubernetes` | Pod crashes, deployments, ingress, RBAC, resource limits |
   | `cloud` | Azure/AWS/GCP resource issues, networking, billing |
   | `security` | Creds exposed, access denied, cert expired, vulnerability |
   | `iac` | Terraform drift, Pulumi failures, config mismatch |
   | `serverless` | Cold starts, timeout, function errors, event trigger issues |
   | `observability` | Monitoring, alerting, dashboards, noisy signals, blocked diagnosis, stale tickets |

4. **How urgent is it?** (sets the SLA timer)
   | Severity | SLA turns | Description |
   |---|---|---|
   | `sev3` | 10 | Low priority — annoying but not on fire |
   | `sev2` | 6 | Significant — affecting some users or team velocity |
   | `sev1` | 3 | Critical — production down, customers impacted |
   | `sev0` | 1 | Everything is on fire. You are paged at 3am. |

5. **Which region does it belong in?** (determines where in the world the player encounters it)
   - `localhost_town` — beginner incidents, safe environment
   - `pipeline_pass` — CI/CD, build issues
   - `container_port` — container and image issues
   - `cloud_citadel` — cloud platform and billing
   - `kernel_caves` — Linux, OS-level, infra
   - `serverless_steppes` — functions, events, cold starts
   - `three_am_tavern` — nightmare scenarios (rare/cursed pool)

6. **Rarity** — how common is this kind of problem?
   - `common` — seen it every week
   - `rare` — happens but not often
   - `cursed` — the kind of thing that haunts your dreams

---

## Step 1 — Create the incident entry

Add the incident to `src/data/encounters.js`, in the existing `ENCOUNTERS` registry. **Do not create a separate `src/data/incidents.js` file** — incidents are encounter definitions with `type: 'incident'` inside the `ENCOUNTERS` object.

Read the file first to see the existing format, then add a new entry:

```js
incident_id_here: {
  id: 'incident_id_here',                      // snake_case, descriptive
  type: 'incident',                            // required so EncounterEngine treats this as an incident
  name: 'CrashLoopBackOff',                    // what the player sees on screen (the symptom)
  symptomText: 'Pod has been restarting 47 times. Last exit code: 137. Node memory pressure detected.',
  rootCauseText: 'Memory limit set too low — container OOMKilled repeatedly.',
  domain: 'kubernetes',                        // hidden until revealed
  hp: 80,                                      // how much damage to deal before it's resolved
  sla: 6,                                      // turns before SLA breach (3/6/10/1 for sev1/2/3/0)
  difficulty: 3,                               // 1–5, affects XP reward
  attacks: ['reputation_leak'],                // incident attack pattern (cycled each turn)
  optimalFix: 'kubectl_rollout_restart',       // skill ID for ideal solution
  layers: null,                                // null or array of layer objects for multi-stage incidents
},
```

### Field notes

- **`name`**: The error message or symptom as it would appear in a terminal or alert. Not a description — the actual string.
- **`type`**: Must be `'incident'` so the engine recognises it.
- **`hp`**: How tough is this to fix? `25–40` for easy, `40–55` for medium, `55+` for hard.
- **`symptomText`**: A single string describing what the player sees before the domain is revealed. Think: what does `kubectl describe`, CloudWatch, or your monitoring tool show?
- **`rootCauseText`**: The real answer. Only shown after domain is revealed.
- **`sla`**: Turns until SLA breach. Use 1 for sev0, 3 for sev1, 4–6 for sev2, 5–10 for sev3.
- **`difficulty`**: 1–5 scale. Affects XP reward on resolution.
- **`attacks`**: Array of incident attack IDs cycled each turn. Valid values: `uptime_drain`, `budget_spike`, `reputation_leak`, `skill_block`, `confusion`, `escalation`.
- **`optimalFix`**: Skill ID of the ideal solution (or `null` if context-dependent).
- **`layers`**: `null` for single-stage incidents, or an array of layer objects for multi-stage incidents that reveal deeper root causes.

---

## Step 2 — Add to the encounter pool

Open `src/data/encounters.js` and add the incident ID to the correct region's rarity pool in `ENCOUNTER_POOLS`:

```js
container_port: {
  common: ['crashloopbackoff_oom'],   // ← add here
  rare:   [],
  cursed: [],
},
```

---

## Step 3 — Verify

- [ ] `id` matches the object key
- [ ] `type` is `'incident'`
- [ ] `domain` is one of the 8 valid values (including `observability`)
- [ ] `symptomText` and `rootCauseText` are filled in
- [ ] `sla` is a reasonable number of turns
- [ ] `attacks` contains only valid attack type IDs
- [ ] Incident added to the correct pool in `ENCOUNTER_POOLS`
- [ ] Registry exports in `encounters.js` are unchanged

---

## Example — a real incident turned into game content

**The real thing:** *"We had pods OOMKilling in prod after bumping the Node.js image. Someone set the memory limit to 128Mi but the new image uses 200Mi at idle."*

```js
// src/data/encounters.js — add to the ENCOUNTERS object
crashloopbackoff_oom: {
  id: 'crashloopbackoff_oom',
  type: 'incident',
  name: 'CrashLoopBackOff',
  symptomText: 'Pod restart count: 23. OOMKilled. Exit code 137. kubectl describe shows memory pressure on the node.',
  rootCauseText: 'Memory limit (128Mi) below actual usage after image upgrade (~200Mi idle).',
  domain: 'containers',
  hp: 75,
  sla: 6,
  difficulty: 3,
  attacks: ['reputation_leak'],
  optimalFix: 'kubectl_rollout_restart',
  layers: null,
},
```
