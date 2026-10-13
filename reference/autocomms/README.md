# Autocomms — SMS & email copy reference

Source of truth for the automated messages ("autocomms") the patient receives
through the journey, and for the **tone** each brand writes them in.

Applies to the base flow and to every white-label brand. A brand picks one tone
column and uses it for every message it renders.

## Files

| File | What it is |
|---|---|
| `philrx-autocomms-enrollment.csv` | The PM's enrollment autocomms, with three tone variants per message |

The CSV is the client's own export, preserved as-is apart from fixing mojibake
(`â` had replaced em-dashes and apostrophes throughout).

## Columns

- **Msg ID** — the client's identifier (`STD1.1`, `STD158`…). `NEW-*` rows are
  **PROPOSED**, not live: they have no "Original (Current)" copy.
- **Channel** — `SMS` or `EMAIL`.
- **Original (Current)** — what production sends today.
- **V1 — Motivational** / **V2 — Professional** / **V3 — Friendly** — the three
  rewrites to choose between.

## The three tones

**V1 Motivational** — momentum and encouragement. Opens on the good news, uses
exclamation marks, frames the patient as making progress. *"Great news! Dr. Smith
sent your prescription…"*, *"Last call!"*, *"Don't miss it!"*

**V2 Professional** — factual and clinical. Passive-to-neutral constructions,
no exclamation marks, no cheerleading. States what happened, then what to do.
*"Your prescription from Dr. Smith has been received for: …"*, *"Verify your
information here:"*, *"Processing has begun."*

**V3 Friendly** — warm and plain-spoken. First-person plural, softeners, casual
register. *"Hi! We received your prescription…"*, *"Just verify your info here"*,
*"we'll handle the rest."*

### Rules of thumb for V2 Professional

Because it is the tone in use for a regulated pharma brand, the pattern is worth
spelling out:

- Lead with the fact, not the feeling. "Your prescription has been received",
  never "Great news!"
- No exclamation marks anywhere.
- Instructions are imperative and specific: "Verify your information here:".
- Reminders are labelled as such — "Reminder —", "Final reminder —" — rather
  than nudged ("Don't miss it!", "we'd hate for you to miss").
- Keep the compliance footer verbatim. It is not copy to rewrite.

## Template variables

| Variable | Resolves to |
|---|---|
| `{{.patient_first_name}}` | Patient's first name |
| `{{.doctor_first_name}}` `{{.doctor_last_name}}` | Prescriber |
| `{{.rx_name}}` | Drug name as displayed |
| `{{.signup_link}}` | Enrollment link |
| `{{.patient_portal_link}}` | Patient's account |
| `{{.coupon_enrollment_url}}` | Manufacturer coupon opt-in |
| `{{.government_waiver_enrollment_url}}` | Government waiver opt-in |
| `{{.zendesk_contact_us_link}}` | Support |
| `{{.spanish_help_message}}` | Spanish-language help line |
| `{{.pt_consent_name}}` | Signer's name on consent copy |

The demo apps render these **resolved**, not as placeholders — they're
walkthroughs, not template previews. `{{.pt_consent_name}}` is the one
exception, left visible in signature consent blocks because the base flow's
Figma shows it that way.

## Which tone each brand uses

| Brand | Tone | Set in |
|---|---|---|
| `projects/myphil-base-flow` | Original (Current) | — |
| `projects/jnj-caplyta` | **V2 — Professional** | Brand spec; see that project's README |

## Applying a tone to a brand

1. Pick the column. Record it in the brand's README so it can't drift.
2. For each SMS screen, take that column's copy for the matching Msg ID.
3. Resolve the variables to the brand's values (drug name, prescriber, pharmacy
   name, links).
4. Keep the compliance footer exactly as written.
5. Where no Msg ID matches a screen (see gaps below), write new copy **in the
   chosen tone's register** rather than inventing a voice. The rules above are
   there so a new message still sounds like the set.

## Known gaps

This CSV covers **enrollment only**. The journey has four later stages whose
autocomms have not been supplied:

- **Prior authorization** — PA required / approved / denied
- **Payment approval** — cost ready, approve your cost
- **Shipping & delivery** — shipped, delivered, signature required
- **Refills** — refill ready

Screens for those stages exist in both apps, and their copy was written to match
the professional register rather than lifted from an approved source. **Ask the
PM for the remaining autocomms exports before any of it is treated as final.**

`NEW-1` (enrollment complete, SMS + email) is also still PROPOSED. No screen
renders it yet; adding one is a product decision, not a copy change.
