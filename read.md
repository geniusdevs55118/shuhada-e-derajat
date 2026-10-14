# Shuhada-e-Derajat Family Healthcare Initiative (DSFHI) - Project Spec

> For any AI coding tool: read this fully before coding. Build every module listed. Use only the stack below. Ask before adding any package.

## 1. Project

Website + staff portal for **Mufti Mehmood Memorial Medical Teaching Institution, Dera Ismail Khan**. Gives verified Shuhada families a single-window healthcare pathway across 3 hospitals:

- District Headquarters Teaching Hospital (DHQ)
- Mufti Mehmood Memorial Teaching Hospital (MMMTH)
- Derajat Women & Children Hospital (W&C)

Tagline: "Honouring the Shuhada by Caring for Their Families." | "Their Sacrifice Our Responsibility."
Principle: VERIFY ONCE, RECORD SECURELY, FACILITATE CONSISTENTLY.
It is a facilitation system, not a clinical system.

## 2. Stack

| Area               | Choice                                                        |
| ------------------ | ------------------------------------------------------------- |
| Framework          | Next.js (App Router, TypeScript)                              |
| Styling            | Tailwind CSS only (no UI libraries; build components by hand) |
| Database           | MySQL                                                         |
| ORM                | Prisma only (one ORM)                                         |
| Auth               | bcryptjs + JWT (jose) in httpOnly cookie                      |
| Validation         | zod + react-hook-form + @hookform/resolvers                   |
| QR generate / scan | qrcode / html5-qrcode                                         |
| PDF                | @react-pdf/renderer (Route Handlers)                          |
| Tables / charts    | @tanstack/react-table / recharts                              |
| Uploads            | Cloudinary (files on Cloudinary, URLs + public_id in MySQL)   |
| Excel export       | xlsx                                                          |
| Rate limit         | rate-limiter-flexible                                         |
| Utils              | date-fns, nanoid, clsx, lucide-react                          |

```bash
npx create-next-app@latest dsfhi --typescript --tailwind --app --eslint
npm i prisma @prisma/client
npx prisma init --datasource-provider mysql
npm i bcryptjs jose
npm i -D @types/bcryptjs
npm i react-hook-form zod @hookform/resolvers
npm i qrcode html5-qrcode
npm i -D @types/qrcode
npm i @react-pdf/renderer
npm i @tanstack/react-table recharts
npm i cloudinary
npm i date-fns nanoid xlsx rate-limiter-flexible clsx lucide-react
```

`next.config.ts`: `serverExternalPackages: ['@react-pdf/renderer']`

`.env`

```
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/dsfhi"
JWT_SECRET=""
JWT_EXPIRES_IN="8h"
QR_SIGNING_SECRET=""
NEXT_PUBLIC_APP_URL="http://localhost:3000"
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
```

## 3. Roles (RBAC)

`SUPER_ADMIN`, `HOSPITAL_DIRECTOR`, `ADDITIONAL_DIRECTOR` (Working Group Convener), `MEDICAL_SUPERINTENDENT` (hospital-scoped), `HEALTH_DESK_OFFICER` (hospital-scoped), `SEHAT_CARD_DESK`, `PHARMACY_REP`, `DIAGNOSTICS_REP`, `ADMIN_FINANCE_REP`, `NURSING_REP`, `IT_MIS_REP`, `WORKING_GROUP_MEMBER`.

- Each user has a hospital (or ALL).
- Hospital-scoped roles see only their hospital's visits/reports; family records are shared across all 3.
- Enforce in `middleware.ts` (jose) and again in every Route Handler.

## 4. Auth

- Login, logout, change password (forced on first login).
- bcryptjs cost 12. JWT in httpOnly, secure, sameSite=lax cookie.
- Rate limit login, lock after repeated failures.
- Admin creates/disables users, resets passwords.
- Audit log for logins and failures.

## 5. Public pages

`/` home, `/about`, `/hospitals`, `/services`, `/eligibility` (widow/widower, parents, dependent children, unmarried daughters, children with disabilities, other eligible dependants), `/how-it-works`, `/sehat-card-plus`, `/working-group`, `/faq`, `/contact`, `/grievance` (public complaint form), `/verify/[token]` (public QR check).
Always show banner: "Emergency care first - assessment is never delayed for routine verification."

## 6. Portal modules (`/dashboard`)

**6.1 Dashboard**: totals (families, beneficiaries, cards, pending verifications), visits by service, emergency cases, open/urgent grievances, Sehat cases, charts, role-based widgets, RED grievance alerts.

**6.2 Family Registration & Verification (Annexure-A)**

- Auto: Family Reg No., registration date, Health Card No., QR/Digital ID
- Shaheed: full name, father's name, CNIC, service/personal no., rank, force/department, unit, date and place of Shahadat, domicile, permanent address, certificate/verification no., issuing authority
- Primary contact: name, relationship, CNIC, mobile, alternative contact, present address, district
- Eligible members (dynamic rows): name, relationship, CNIC/B-Form, DOB/age, mobile, status; special dependency/disability note
- Documents (Cloudinary upload per item): Shahadat certificate, Shaheed CNIC, applicant CNIC, members CNIC/B-Form, proof of relationship, dependency cert, disability docs, domicile, photographs, departmental verification, other
- Verification: Verified & Eligible / Provisional / Additional Docs Required / Not Eligible; reference no., competent authority, remarks, verified by, designation, signature/date
- Card registration: card no., family ID, QR ID, issue date; physical card issued, digital record created, beneficiaries linked, HIS updated
- Hospital access (3 checkboxes)
- Applicant declaration: name, relationship, CNIC, signature/thumb impression, date
- Authorization: Approved / Approved for Card / Returned; officer, designation, stamp, date
- Workflow: Draft, Submitted, Under Verification, Verified, Approved, Card Issued
- Block duplicate CNICs. PDF export.

**6.3 Health Card & Beneficiary Master Record (Annexure-C)**

- Header: reg no., card no., QR ID, registration/issue/revalidation dates; status Active / Under Verification / Suspended / Closed
- Shaheed + contact (from family record)
- Verified beneficiary master list: name, relationship, CNIC/B-Form, DOB/age, Beneficiary ID, card status; active count
- Special facilitation flags (no diagnosis): elderly parent, disability, maternal, child/paediatric, regular specialist follow-up, mobility assistance, other
- Card control: family/individual card, physical issued, QR activated, HIS linked, photo verified, CNIC linked; issued by, designation, signature/date
- Three-hospital access
- Update history (auto log)
- Lost/damaged card: date, previous card, replacement card, date, reason, authorised by (old QR token invalidated)
- Beneficiary status change: name, previous/new status, effective date, reason, supporting doc, verified by
- Misuse/duplication flags: impersonation, unauthorised use, duplicate registration, altered docs, duplicate claim, other
- Periodic revalidation: family particulars, beneficiary list, contacts, card status, digital record confirmed; further verification; next review date; reviewed by
- Authorisation: officer, designation, signature, stamp, date
- Card face: initiative name, card title, family/beneficiary name, Family ID, Beneficiary ID, CNIC/B-Form, relationship, QR, Health Desk contact
- Card back: "Valid for healthcare facilitation through the Derajat Shuhada Family Health Desks of Mufti Mehmood Memorial Medical Teaching Institution, Dera Ismail Khan, subject to applicable institutional rules and clinical protocols. In a medical emergency, immediate clinical assessment shall not be delayed solely for routine card verification."
- Card design: landscape, flag + mountains theme, chip graphic, photo, QR, red title banner. Second layout lists eligible members (S.No, name, relation, CNIC/B-Form, DOB, remarks) with notes: non-transferable, authorised hospitals only, misuse may lead to cancellation, report loss immediately.

**6.4 Healthcare Facilitation (Annexure-B)** - Health Desk main screen
Flow: scan/search card, verify, create visit, record, close.

- Header: visit no., date/time, family reg no., card no.
- Beneficiary: name, father/husband/guardian, CNIC/B-Form, relationship, mobile, Shaheed name; status Verified / Verified Digitally / Emergency - Verification in Process
- Hospital + facilitation officer
- Healthcare needed (multi-select): OPD, specialist, emergency/trauma, lab, radiology/imaging, medicines, inpatient, medical treatment, surgical consultation, operation/procedure, ICU, maternal, paediatric, neonatal, rehabilitation, follow-up, Sehat Card Plus, ambulance, referral, other
- Clinical: department, consultant, OPD/Emergency/MR no., diagnosis (optional, restricted), advice, follow-up date
- Diagnostics: CBC, blood chemistry, urine, microbiology, histopathology, X-ray, ultrasound, CT, MRI, echo, other; Completed / Partial / Pending
- Medicines: prescribed, pharmacy facilitated; Fully / Partially / Not available; remarks
- Admission/procedure: ward, admission date, procedure, consultant, date; Planned / Completed / Deferred / Referred
- Sehat Card Plus: eligibility checked; Covered / Not covered / N/A; Approved / Under process; claim ref
- Emergency: emergency case, triage done, immediate treatment started; verification completed / concurrent / subsequent
- Ambulance/referral: from/to, date/time, facility, reason, referring consultant; Provided / Coordinated / Documents provided / Appointment facilitated / Pending
- Desk action: registration, appointment, OPD access, emergency, diagnostics, pharmacy, admission, Sehat, surgery coordination, ambulance, referral, follow-up; issue, action taken, final status
- Feedback: guided, unnecessary movement avoided, treated with dignity, facilitation provided; comments; signature
- Certification: officer, designation, signature/date, escalated to, decision, authorised officer
- **Emergency mode**: one-tap emergency visit with no verification required; flagged `EMERGENCY_PENDING`, goes to verification queue. Never block emergency intake.
- PDF export.

**6.5 Sehat Card Plus desk**: list visits needing facilitation, record coverage/approval/claim ref, **unique claim per visit+service** (block duplicates/overlaps).

**6.6 Ambulance & Referral**: requests, from/to, status, referral facility/reason, documents, pending issues; external emergency services count.

**6.7 Grievance & Rapid Escalation (Annexure-E)**

- Grievance no., date/time, priority Routine / Urgent / Immediate
- Beneficiary: name, reg no., card no., CNIC/B-Form, relationship, Shaheed, contact
- Service point: hospital, department, health desk, incident date/time
- Nature: registration/verification delay, repetitive documentation, OPD/specialist access, emergency facilitation, lab delay, radiology, medicine/pharmacy, admission, procedure/surgery, ICU, Sehat processing, ambulance, referral, card/digital record, staff behaviour/dignity, confidentiality, unnecessary movement, financial/billing, other
- Description; immediate healthcare need Y/N; delay could affect care Y/N
- Escalation screen: **RED** (emergency delayed, patient-safety concern, critical medicine issue, urgent admission/referral, urgent ambulance, other immediate) = instant notification; **AMBER** (avoidable delay, repeated verification problem, Sehat issue, diagnostic/medicine/admission issue, referral issue, serious facilitation concern); **GREEN** (general issue, card correction, information, non-urgent admin, feedback)
- Desk action: received by, designation, time, action, resolved at desk/time
- Escalation: to, designation, date/time, reason, channel (phone/written/digital/in person)
- Clinical safeguard text: grievance or admin dispute never delays emergency care
- Resolution: action, responsible officer, date/time; Fully / Partially resolved / Further action / Referred / Closed after explanation
- Beneficiary confirmation: explained Y/N, facilitation Yes/Partial/No, further help Y/N, comments, signature, date
- Root cause, corrective + preventive action, officer, target date, completed Y/N/In progress
- Working Group review: required Y/N, reviewed by, observations, directions
- Closure: Resolved & Closed / Closed with Corrective Action / Referred / Pending; closed by, designation, date
- Marked CONFIDENTIAL. Timeline per ticket, SLA timers, PDF.

**6.8 Monthly Report (Annexure-D)** - auto-generated from data

- Header: month/year, report no., submission date, hospital (DHQ / MMMTH / W&C / Consolidated), focal person, contact
- Registration: total families, new families, total beneficiaries, new beneficiaries, cards issued, QR records activated, pending verification, average verification time
- Utilization per service: OPD, specialist, emergency/trauma, lab, radiology, pharmacy, admissions, medical, surgical, ICU, maternal, paediatric, neonatal, rehab/follow-up, ambulance, referral, total encounters
- Sehat Card Plus: facilitated, processed, approved, pending, not covered, issues, corrective action
- Emergency: received, treated before verification, successfully facilitated, delay cases, reason, corrective action
- Ambulance/referral: requests, facilitated, external services, referral cases, coordinated, pending issues
- Health Desk performance: approached, resolved at desk, escalated, pending, avg response time, issues
- Beneficiary experience: feedback received, satisfactory, issues, dignity/staff complaints, action
- Grievances: received, resolved, pending, urgent, avg resolution time, nature, corrective/preventive action
- Service gaps checklist: verification delay, card issue, OPD access, diagnostic delay, medicine availability, admission, Sehat issue, surgery delay, ambulance, referral, IT/digital, staffing, other; root cause; corrective action
- Exceptional cases: yes/no, ref no., description, immediate action, further action
- Working Group review: achievements, challenges, corrective measures, recommendations to Director
- Action tracker: issue, responsible officer, target date, status
- Sign-off: focal person, hospital rep, Chairman comments, Hospital Director directions/signature/date
- KPI table (indicator / target / achievement / On Track or Needs Attention): card issuance, emergency care, OPD facilitation, diagnostics, pharmacy, admissions, surgical procedures, Sehat Card Plus, ambulance, referrals
- Workflow: Draft, Submitted, Under Review, Signed Off. PDF + Excel export.

**6.9 Working Group**: members (Additional Director as Convener, 3 Medical Superintendents, Health Desk focal person, reps from Admin/Finance, Sehat Card Plus, Pharmacy, Diagnostics/Radiology, Nursing, IT/MIS, others; co-opt option), 12-item Terms of Reference tracker with owner/status, 15-working-day framework deadline countdown, monthly reports, meeting minutes and decisions log.

**6.10 Other**: Health Desk management per hospital (location, staff, contact, orientation done); verification queue (post-emergency, provisional, docs required); feedback summary; misuse control queue; global search (CNIC, reg no., card no., name); QR scan screen; admin (users, roles, lookups, settings, audit log viewer).

## 7. ID formats (DB counter table, atomic)

Family `DSF-YYYY-000001` | Card `DSFHC-000001` | Beneficiary `DSFB-000001-01` | Visit `FAC-<HOSP>-YYYYMM-0001` | Grievance `GRV-<HOSP>-YYYYMM-0001` | Report `RPT-<HOSP|ALL>-YYYYMM`

## 8. Database (MySQL + Prisma)

Tables: User, Hospital, HealthDesk, Family, Shaheed, FamilyContact, Beneficiary, Document, Verification, HealthCard, CardHistory, CardReplacement, BeneficiaryStatusChange, MisuseFlag, RevalidationReview, FacilitationVisit, VisitService, VisitDiagnostic, VisitMedicine, VisitAdmission, SehatCardCase, AmbulanceReferral, VisitFeedback, Grievance, GrievanceCategory, GrievanceEscalation, GrievanceAction, MonthlyReport, ReportActionItem, ReportIndicator, WorkingGroupMember, TorItem, MeetingMinute, Notification, AuditLog, IdCounter, Setting.

Enums: Role, HospitalCode, VerificationStatus, CardStatus, VisitVerificationMode (VERIFIED, DIGITAL, EMERGENCY_PENDING), GrievancePriority, EscalationLevel (RED, AMBER, GREEN), GrievanceStatus, SehatStatus, ReportStatus.
Uniques: CNIC per person, card no, qrToken, SehatCardCase(visitId, serviceType).

## 9. QR rules

- QR holds only `${APP_URL}/verify/<token>`. Never CNIC or personal data.
- Token stored in `HealthCard.qrToken`; replaced on card replacement (old one dies).
- Public `/verify/[token]`: valid / invalid / suspended, card no., first name + relationship, allowed hospitals only.
- Logged-in staff scan sees full summary by role. Log every scan.

## 10. PDFs (@react-pdf/renderer, Route Handlers)

Family Health Card (front/back with QR + photo), eligible-members card, Annexures A-E (filled), blank printable A-E. All with institution header + logo and signature/stamp lines.

## 11. Uploads (Cloudinary)

- Server-side upload via Route Handler using `cloudinary` SDK. Accept PDF/JPG/PNG, max 5 MB, validate type server-side.
- Store `publicId`, `secureUrl`, `resourceType`, `docType`, owner FK in MySQL `Document` table.
- Sensitive docs (CNIC, Shahadat certificate, disability docs): upload with `type: "authenticated"` and serve through short-lived signed URLs after a role check. Card photos can use normal delivery.

## 12. Business rules

1. Verify once; updates only via authorised change + audit + periodic revalidation.
2. Emergency visits can always be created; verification is concurrent or later.
3. Priority means admin facilitation only. No clinical queue, ICU, OT or blood prioritisation features.
4. No duplicate billing or overlapping Sehat claims.
5. No detailed diagnosis on card or family record; visit diagnosis optional and role-restricted. Never make families re-narrate their loss.
6. Card is for identification and facilitation only, no wallet or balance.
7. Cards non-transferable; misuse flags and cancellation supported.
8. Eligibility decided by competent authority; system only records it.
9. Audit log all create/update/delete/sensitive views.
10. Security statistics on public pages are editable content (settings table), marked "revalidate before external publication".

## 13. Security

zod on every server input, Prisma parameterized queries only, httpOnly cookies, security headers in `next.config.ts`, rate limits on login/verify/public grievance, role checks in every handler, data minimisation on public pages, no CNIC in logs.

## 14. Folder structure

```
dsfhi/
├─ prisma/ (schema.prisma, seed.ts)
├─ src/
│  ├─ app/
│  │  ├─ (public)/ (home, about, hospitals, services, eligibility, how-it-works, sehat-card-plus, working-group, faq, contact, grievance, verify/[token])
│  │  ├─ (auth)/login
│  │  ├─ dashboard/ (families, cards, visits, scan, sehat-card, ambulance-referrals, grievances, reports, working-group, verification-queue, feedback, misuse, admin)
│  │  └─ api/ (auth, families, beneficiaries, cards, visits, sehat-cases, referrals, grievances, reports, working-group, uploads, qr, verify, pdf, export)
│  ├─ components/ (forms, tables, charts, pdf, layout, ui)   # ui = hand-built Tailwind components
│  ├─ lib/ (prisma, auth, rbac, ids, qr, cloudinary, audit, rate-limit, reports, utils)
│  ├─ validations/
│  ├─ types/
│  └─ middleware.ts
├─ .env
└─ PROJECT_SPEC.md
```

## 15. Build order

1. Setup, Tailwind, Prisma schema, seed
2. Auth, middleware, RBAC, audit
3. Public pages
4. Family registration + Cloudinary uploads + verification (A)
5. Health card, master record, QR, card PDF (C)
6. Scan/search + public verify
7. Visits + emergency mode (B)
8. Sehat Card Plus + ambulance/referral
9. Grievances + escalation + notifications (E)
10. Monthly reports + PDF/Excel (D)
11. Working Group, dashboard, feedback, misuse
12. Hardening, testing, deploy

## 16. Notes

- Server Components by default; `"use client"` only for forms, scanner, charts.
- Keep labels exactly as in the annexures so printed forms match the official ones.
- All seed/demo data is FAKE (the PDF's sample card is illustrative only).
- Do not add features or packages outside this spec without asking.
