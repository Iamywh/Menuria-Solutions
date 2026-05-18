# Daily Recap — Menuria CRM / Onboarding Pipeline

Date: 2026-05-18
Project: Menuria Solutions / Menuria Main
Status: Major CRM + onboarding milestone completed

---

## 1. Main outcome of the day

Today we transformed Menuria Solutions from a simple public website into a working commercial onboarding pipeline.

The system now supports this flow:

```txt
Visitor lands on Menuria website
→ fills a light microform
→ lead is stored in Supabase
→ admin sees lead in dashboard
→ admin can manage lead status
→ admin can create questionnaire onboarding
→ system generates unique access code
→ customer receives message by WhatsApp/email/copy
→ customer opens /questionnaire with private code
→ full onboarding questionnaire is saved in Supabase
```

This is now a real mini-CRM and onboarding engine, not just a visual demo.

---

## 2. Supabase setup completed

### Tables created / used

We created and/or used these Supabase tables:

```txt
clients
questionnaire_responses
leads
lead_interactions
```

### clients

Purpose: stores restaurants/clients that can access the full onboarding questionnaire.

Important fields:

```txt
id
restaurant_name
contact_name
email
phone
access_code
status
created_at
updated_at
```

Typical status:

```txt
onboarding
submitted
```

### questionnaire_responses

Purpose: stores questionnaire answers per client and per section.

Important fields:

```txt
id
client_id
section_key
data_json
completed
created_at
updated_at
```

Each questionnaire section creates/updates one row.

### leads

Purpose: stores early commercial contacts from the website microform.

Important fields:

```txt
id
restaurant_name
contact_name
contact_method
phone
email
interest
message
status
source
client_id
created_at
updated_at
```

Lead statuses currently used:

```txt
new
contacted
qualified
proposal_sent
accepted
lost
```

### lead_interactions

Purpose: stores commercial actions performed from the admin dashboard.

Important fields:

```txt
id
lead_id
action_type
note
created_at
```

Example action types:

```txt
copy_message
whatsapp_opened
email_opened
onboarding_created
```

---

## 3. Questionnaire V2 completed

The page `/questionnaire` now works with Supabase.

Completed features:

```txt
✅ private access by access_code
✅ client lookup in Supabase
✅ saved answers loaded when client returns
✅ section-by-section saving using upsert
✅ completed sections tracking
✅ resume from first incomplete section
✅ final submission updates client status to submitted
✅ final thank-you screen
✅ 12 onboarding sections
```

### Questionnaire sections

The questionnaire was expanded from 3 sections to 12:

```txt
general
branding
hours
spaces
menu
allergens
drinks
bookings
faq
materials
socials
features
```

The current approach saves every section into `questionnaire_responses` as JSON.

---

## 4. Lead microform added to homepage

A new React component was created:

```txt
src/components/LeadMicroForm.jsx
```

Purpose: collect lightweight commercial leads before asking them to complete the long questionnaire.

Fields:

```txt
restaurant_name
contact_name
contact_method
phone
email
interest
message
```

The lead microform saves into Supabase table:

```txt
leads
```

Important concept decided:

```txt
Microform = first contact / lead capture
Questionnaire = full onboarding after agreement or serious interest
```

---

## 5. Admin dashboard created

A new admin page was created:

```txt
/admin/leads
```

File:

```txt
src/pages/Admin/AdminLeads.jsx
```

Route added in:

```txt
src/App.jsx
```

Admin access code was initially hardcoded, then moved to environment variable:

```env
VITE_ADMIN_CODE=...
```

Current behavior:

```txt
✅ admin login by code
✅ loads leads from Supabase
✅ shows lead cards
✅ can update lead status
✅ search bar
✅ status filters
✅ counters per status
✅ summary metrics
✅ lead interaction history
```

### Admin dashboard features

Current features:

```txt
Total leads summary
New leads count
Contacted leads count
Conversion rate
Search by restaurant/contact/email/phone/interest/message
Filter by status
Status counters
Lead cards
Status selector
Create onboarding button
Generated onboarding code display
Message textarea for client
Copy message button
Open WhatsApp button
Open email button
Commercial history per lead
```

The admin dashboard was restyled with the Menuria dark/premium palette, replacing the earlier restaurant-style beige palette.

---

## 6. Lead → onboarding flow implemented

The admin dashboard can now convert a lead into a real questionnaire client.

Flow:

```txt
Admin clicks Crear onboarding
→ system creates row in clients
→ unique access_code is generated
→ lead status becomes accepted
→ lead.client_id is linked to created client
→ onboarding_created interaction is logged
→ admin sees the access code and message
```

Example generated code:

```txt
TES-MEN-2026-6U10
```

The customer can then go to:

```txt
/questionnaire
```

and enter the generated access code.

---

## 7. WhatsApp/email/copy actions added

For leads with onboarding created, the admin dashboard now generates a ready-to-send message.

Message includes:

```txt
Customer name
Private questionnaire link
Access code
Short explanation
Menuria signature
```

Buttons added:

```txt
Copiar mensaje
Abrir WhatsApp
Abrir email
```

Test completed successfully:

```txt
✅ message copied correctly
✅ WhatsApp opened with original message
✅ email action works
✅ interactions saved in lead_interactions
```

---

## 8. Interaction tracking added

Every commercial action can be logged to Supabase.

Currently tracked actions:

```txt
copy_message
whatsapp_opened
email_opened
onboarding_created
```

The admin card now displays:

```txt
Historial comercial
```

So the lead timeline is visible directly inside the dashboard.

---

## 9. Netlify production fixes

The production site initially showed a black screen because Netlify did not have the required Vite environment variables.

Required Netlify environment variables:

```env
VITE_SUPABASE_URL=https://lwjpphqaomlrhrxjwnmo.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_...
VITE_ADMIN_CODE=...
```

Important rule:

```txt
Only VITE_ public frontend variables go to Netlify.
Service role / secret keys never go to Netlify.
```

### React Router Netlify fix

Direct navigation to `/admin/leads` initially produced a broken link.

Fixed by creating:

```txt
public/_redirects
```

with:

```txt
/*    /index.html   200
```

This allows Netlify to serve React Router routes correctly.

Production test completed:

```txt
✅ /admin/leads works on Netlify
✅ WhatsApp button works in production
✅ original onboarding message is generated instantly
```

---

## 10. Security incident and fix

A service role key was accidentally pasted into chat.

Immediate response:

```txt
✅ key treated as compromised
✅ Supabase JWT/signing key rotation flow started
✅ new Supabase secret key strategy used
✅ service role moved to Supabase Edge Function secret
✅ service role removed from frontend concerns
```

Important lesson:

```txt
Never paste service_role, sb_secret, or any backend secret into chat, GitHub, Netlify, or frontend code.
```

---

## 11. Supabase CLI installed and configured

Supabase CLI was installed on Windows using Scoop.

Version confirmed:

```txt
supabase 2.98.2
```

The local project was linked to Supabase project:

```txt
Menuria-Main
Project ref: lwjpphqaomlrhrxjwnmo
```

Command used:

```powershell
supabase link --project-ref lwjpphqaomlrhrxjwnmo
```

`supabase status` produced a Docker-related error, but that was not blocking because cloud function commands worked.

---

## 12. Edge Function created

Created Supabase Edge Function:

```txt
admin-create-onboarding
```

Path:

```txt
supabase/functions/admin-create-onboarding/index.ts
```

Purpose:

```txt
Move onboarding creation away from the frontend.
Use server-side secret key to create clients and update leads.
```

Current frontend now calls:

```js
supabase.functions.invoke('admin-create-onboarding', ...)
```

The Edge Function:

```txt
✅ checks x-admin-code header
✅ uses MENURIA_SERVICE_ROLE_KEY secret
✅ loads lead by id
✅ prevents duplicate onboarding if lead already has client_id
✅ generates access code server-side
✅ inserts into clients
✅ updates lead status to accepted
✅ links lead.client_id
✅ inserts onboarding_created interaction
✅ returns client and accessCode
```

Important secret names:

```txt
ADMIN_CODE
MENURIA_SERVICE_ROLE_KEY
```

Important correction made:

The function originally read:

```ts
Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
```

but Supabase does not allow custom secrets starting with `SUPABASE_`.

It was corrected to:

```ts
Deno.env.get('MENURIA_SERVICE_ROLE_KEY')
```

---

## 13. Deno config added

Added Deno support files for VS Code / Edge Functions:

```txt
deno.json
.vscode/settings.json
```

Purpose:

```txt
Reduce VS Code false TypeScript errors on Deno remote imports
Enable Deno only for supabase/functions
```

---

## 14. Git / deployment hygiene

Repeated checks confirmed:

```txt
✅ .env is not on GitHub
✅ public/_redirects is on GitHub
✅ Supabase function is on GitHub
✅ AdminLeads.jsx uses Edge Function invoke
✅ Netlify environment variables are configured separately
```

Important Git rule reinforced:

```txt
.env stays local only.
.env.example is safe and can be committed.
```

---

## 15. Strategic discussion: Menuria Orders / POS

We discussed a possible future product:

```txt
Menuria Orders
```

Positioning:

```txt
Secret project for now.
Could later be shown on Menuria main as:
“Descubre también Menuria Orders”
```

Clear distinction made:

```txt
Menuria Orders = orders, tables, kitchen/bar flow, pre-bill, reports
Fiscal POS = official fiscal ticket/factura system, legal compliance, tax requirements
```

Important conclusion:

```txt
Menuria Orders MVP: possible in around 2 weeks if focused.
Fiscal POS: safer estimate 2–6 months depending on compliance path and asesor involvement.
```

Recommended phased path:

```txt
Phase 1 — Menuria Orders non-fiscal MVP
Phase 2 — cashiering/reporting/export for asesor
Phase 3 — fiscal integration or compliance module with asesor/technical specialist
```

Decision:

```txt
Keep Menuria Orders as secret project until ready.
```

---

## 16. Strategic discussion: server, n8n, agents, voice

We discussed the future architecture:

```txt
server / VPS / mini server
n8n
Menuria hosting
database
AI agents
voice agent for restaurant calls
CRM automation
WhatsApp summaries
reservation handling
scam/sales call handling
```

Important architecture principle:

```txt
Do not buy expensive hardware too early.
Avoid becoming a full-time sysadmin before validating business demand.
```

Suggested staged architecture:

```txt
Phase 1 — Cloud lightweight:
Netlify + Supabase + Edge Functions + optional n8n

Phase 2 — Own server/VPS:
n8n, automation workers, backups, internal dashboards

Phase 3 — Voice Agent:
phone provider + speech-to-text + LLM + text-to-speech + booking logic + WhatsApp manager summary
```

Voice agent future product concept:

```txt
Menuria Voice
- answers restaurant calls
- handles reservation requests
- captures messages for owner/manager
- sends summaries to WhatsApp
- filters spam/sales/scam calls
- escalates to human when needed
```

Recommended safety path:

```txt
V1 Voice: collect request and send manager summary, no automatic confirmation
V2 Voice: check availability and suggest slots
V3 Voice: confirm reservations automatically under safe rules
```

---

## 17. Current production state

Live site:

```txt
https://menuria-solutions.netlify.app/
```

Admin route:

```txt
https://menuria-solutions.netlify.app/admin/leads
```

Questionnaire route:

```txt
https://menuria-solutions.netlify.app/questionnaire
```

Known required production env variables in Netlify:

```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=sb_publishable_...
VITE_ADMIN_CODE=...
```

Known required Supabase Edge Function secrets:

```txt
ADMIN_CODE
MENURIA_SERVICE_ROLE_KEY
```

---

## 18. Important next steps

### Immediate technical next steps

```txt
1. Final production test of Edge Function from Netlify
2. Create a brand-new production lead
3. Convert it to onboarding from /admin/leads
4. Confirm client appears in clients table
5. Confirm onboarding_created interaction appears
6. Confirm generated code works in /questionnaire
```

### Security next steps

```txt
1. Review and tighten Supabase RLS policies
2. Remove temporary broad anon policies where Edge Functions can replace direct writes
3. Move more admin actions behind Edge Functions
4. Consider Supabase Auth for real admin login later
```

### Product next steps

```txt
1. Design Menuria server/n8n architecture
2. Decide hosting model: Supabase + Netlify vs own server/VPS hybrid
3. Plan Menuria Orders as secret MVP
4. Plan Menuria Voice V1 as call-summary assistant before full auto-reservations
```

---

## 19. Core lessons from today

```txt
.env belongs only locally or in hosting environment variables.
.env.example is safe for GitHub.
Frontend can use VITE_ public variables.
Service role and sb_secret keys must never touch frontend, GitHub, Netlify, or chat.
React Router on Netlify needs public/_redirects.
Supabase Edge Functions are the right path for privileged actions.
Questionnaire is not first contact; microform is.
Menuria is becoming a platform, not just a website.
```

---

## 20. Final status

Today’s final state:

```txt
Menuria CRM V1 is live and working.
Admin dashboard is usable.
Lead capture works.
Lead conversion to onboarding works.
WhatsApp/email actions work.
Interaction history works.
Supabase Edge Function exists and is deployed.
The system is ready for the next hardening and architecture phase.
```
