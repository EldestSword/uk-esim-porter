# eSIM Activation Playbooks (UK) — QR, Profile Transfer, Device Swap

**Version:** 1.0.0  
**Date:** 12 Nov 2025  
**Owner:** Service Improvement (O2 Daisy)

This repo contains agent-ready scripts, customer-facing prompts, and lightweight process assets to reduce Average Handling Time (AHT) for **eSIM activations** in the UK. It covers three flows:

1) **QR Activation** for new or additional lines  
2) **Profile Transfer** when moving an eSIM profile between devices  
3) **Device Swap** where a number/SIM identity moves to a new handset

It bakes in UK-centric expectations, rapid reprovisioning, basic KYC, and practical fraud-aware checkpoints without turning the call into an inquisition.

---

## Why this exists

- **Lower switching friction**: eSIM accelerates provider switching and same-day activations. Our scripts emphasize speed and clarity.
- **Remote reprovisioning**: Multiple profiles and instant downloads create both agility and complexity; our flows make the right path obvious.
- **KYC & security**: We insert minimal friction checks to deter SIM farms, social engineering, and account takeovers.

---

## What’s in here

```
/
├─ scripts/
│  ├─ 01-qr-activation.md
│  ├─ 02-profile-transfer.md
│  └─ 03-device-swap.md
├─ checklists/
│  ├─ agent-preflight.md
│  ├─ post-activation-validation.md
│  └─ fraud-guard-lite.md
├─ talk-tracks/
│  ├─ short-explainers.md
│  └─ fallback-phrases.md
├─ qa/
│  ├─ test-cases.md
│  ├─ acceptance-criteria.md
│  └─ aht-metrics-template.xlsx
├─ ops/
│  ├─ kyc-steps.md
│  ├─ exception-handling.md
│  └─ partner-escalations.md
├─ CHANGELOG.md
└─ README.md
```

---

## Quick start

1) **Pick the flow** you need from `scripts/`.  
2) **Run the preflight** checks from `checklists/agent-preflight.md`.  
3) **Follow the talk track** that matches the customer’s device/platform.  
4) **Validate success** using `checklists/post-activation-validation.md`.  
5) **Record the outcome** and time in the AHT sheet (`qa/aht-metrics-template.xlsx`).

---

## Agent preflight checklist (summary)

- Confirm **account holder or authorised contact**.  
- Match **account details** (account number, postcode, last invoice total or security pin if applicable).  
- Identify **device make/model and OS** (iOS 17+/Android 13+ preferred).  
- Confirm **Wi-Fi availability** and **battery >30%**.  
- If number porting, verify **PAC** status and timing.  
- Confirm **old device** status (still active? to be deactivated?).

Full detail in `checklists/agent-preflight.md`.

---

## Flow 1: QR Activation (new/add-on)

**Goal:** Customer scans QR, profile installs in under 60 seconds, line goes live.

**Core steps**

1) **KYC lite**: confirm authorised person and two data points (see `ops/kyc-steps.md`).  
2) **Prep the device**  
   - iOS: Settings → Mobile Service → Add eSIM  
   - Android: Settings → Connections/Network → SIM Manager → Add eSIM  
3) **Present QR**  
   - Send via secure channel (portal/email with masked token) or read activation code if QR fails.  
4) **Install**  
   - Customer scans → accepts “Add mobile plan/eSIM profile” → labels the plan (e.g. “Business”).  
5) **Network settle**  
   - Toggle flight mode 5–10 seconds or reboot if needed.  
6) **Validation**  
   - Place a test call, confirm data session, check plan label and default for voice/data.  
7) **Close-down**  
   - Give the one-liner explainer and fraud hygiene tips (see Talk Tracks).

**AHT target:** 4–6 minutes including validation.

---

## Flow 2: Profile Transfer (move eSIM to another device)

**Goal:** Move an existing eSIM profile from Device A to Device B without leaving duplicate actives.

**Core steps**

1) **KYC lite** and confirm ownership of both devices.  
2) **Decide posture**  
   - Will the old device stay active temporarily? If not, revoke after transfer.  
3) **Start transfer**  
   - iOS to iOS: Settings → Mobile Service → Transfer eSIM (devices side-by-side, both on Wi-Fi).  
   - Android to Android: OEM transfer tool or QR reissue if supported.  
   - Cross-platform: issue a **new QR** and revoke the old profile after validation.  
4) **Validation** on Device B, then **revoke/disable** old profile if requested.  
5) **Record** IMEI/OS for audit.

**AHT target:** 6–8 minutes typical, longer for cross-platform.

---

## Flow 3: Device Swap (number to new handset)

**Goal:** Keep the number, move to new device, clean deactivation on old.

**Core steps**

1) **KYC lite** + confirm number and IMEI/OS of new device.  
2) **Provision**  
   - Generate QR for the number or push profile via MDM/portal if available.  
3) **Install and set defaults** for voice/SMS/data on the new device.  
4) **Deactivate** eSIM on the old device to avoid dual ringing and fraud exposure.  
5) **Validation** and call wrap.

**AHT target:** 5–7 minutes.

---

## Security & fraud guard (lite)

- **KYC minimum**: authorised contact, plus at least two corroborating data points.  
- **Device binding**: record device make, model, OS, last 4 of IMEI where policy allows.  
- **One-in/one-out**: when transferring, revoke old profiles unless there’s an explicit reason not to.  
- **Timeouts**: QR codes expire; don’t resend the same token repeatedly.  
- **Red flags**: hurried requests to keep old device active, multiple rapid swaps, mismatched contact details.  
See `checklists/fraud-guard-lite.md` for fast decision trees.

---

## Talk tracks (short, plain English)

Use `talk-tracks/short-explainers.md` for agent phrasing. Examples:

- **QR Activation open**  
  “I’ll send a QR that adds your plan in about a minute. Before we start, I just need to confirm a couple of details for security.”

- **Transfer close**  
  “Your number is now live on the new phone. I’m switching off the old profile so calls don’t split or get abused.”

- **If install lags**  
  “Sometimes the phone needs a quick reset to finish. Power off and on once, then the plan label should show under Mobile Service.”

---

## Troubleshooting quick hits

- **Stuck on ‘Activating’**: toggle flight mode 10 seconds; if no joy, reboot.  
- **No data**: set the eSIM as default for data and enable mobile data.  
- **No calling**: ensure the plan is set as default for voice/SMS; try a test call to a landline.  
- **QR won’t scan**: use activation code entry flow; check camera permissions; increase brightness.  
- **Old device still rings**: remove or disable the old eSIM profile.

See `ops/exception-handling.md` for deeper trees.

---

## AHT & quality

- **Targets**: QR 4–6m, Transfer 6–8m, Device Swap 5–7m.  
- Log every call’s start/stop and issue cause in `qa/aht-metrics-template.xlsx`.  
- Acceptance criteria in `qa/acceptance-criteria.md` for each flow.

---

## Integrations & options

- **MDM push**: If the customer is on managed devices, prefer silent push over QR.  
- **KYC via CRM**: Where available, pull KYC prompts from CRM so agents don’t miss steps.  
- **Audit**: Store minimal device identifiers and timestamp of revocation/activation.

---

## Adapting the scripts

- Keep the **flow headings** intact so training and QA map 1:1.  
- Avoid adding jargon; every step must be executable by a new starter in under 30 seconds of reading.  
- If you localise terms, update the acceptance criteria the same day.

---

## Contributing

1) Create a feature branch: `feature/<short-description>`  
2) Edit the relevant file(s) under `scripts/`, `checklists/`, or `talk-tracks/`.  
3) Update `qa/test-cases.md` if you changed the flow.  
4) Add a dated entry to `CHANGELOG.md`.  
5) Open a PR with a one-paragraph summary and before/after AHT expectations.

---

## Versioning

- Semantic-ish: docs-only changes can bump patch, new flow options bump minor.  
- Keep the visible version/date at the top of this README in sync with `CHANGELOG.md`.

---

## Licensing & usage

Internal O2 Daisy operational content. Do not distribute externally without approval.

---

## Contact

Service Improvement Team  
Provisioning & AMT Enablement  
Internal channel: #esim-activation-playbooks
