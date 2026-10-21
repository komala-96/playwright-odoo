# AveriGo (Martiserv) E2E – Playwright JS

Automates all 109 test cases (TC-001 … TC-109) in `data/End_to_End_QA_Test_Cases.xlsx` against `https://martiserv.averigoqa.com` (Odoo 18).

## Setup

```bash
npm install
npx playwright install chromium
cp .env.example .env   # already filled with the QA user's credentials; .env is git-ignored
```

## Login without OTP on every run

`fixtures/index.js` + `utils/auth.js`:

1. **First run:** the fixture logs in. If OTP is asked:
   - if `TOTP_SECRET` is set in `.env`, it generates the code itself (RFC 6238), so the run can be headless;
   - otherwise a headed browser opens and waits (`OTP_WAIT_MS`) for you to type the OTP.
   It ticks *"Don't ask again on this device"* and saves cookies and storage to `.auth/user.json`.
2. **Every later test and run:** Playwright's `storageState` is overridden with that file, so each test starts already signed in, with no login form and no OTP.
3. **Session expired:** the fixture checks the saved session once per worker. If it's no longer valid, it logs in again with the old trusted-device cookie still loaded, so this re-login needs only the password, not the OTP.

```bash
npm run login        # one-time: complete OTP in the opened window
npm test             # full chained suite
```

## Running subsets

```bash
npx playwright test tests/05-sales.spec.js
npm run test:critical            # @critical | also @high, @report, @negative, @financial, @tc-026 ...
RUN_ID=1759470000000 npx playwright test tests/07-sales-reports.spec.js   # reuse data from an earlier run
```

The specs are one chained business flow: master data → products → stock → customers → sales → AR → reports → purchase → AP → micro market → equipment → CRM → negative deletes. They run in file order on one worker, and each file is `describe.serial`. Records created by one test (record URLs, invoice numbers, totals) are saved in `.runtime/state-<RUN_ID>.json` for later tests to use. Every code gets a per-run suffix, so you can re-run without hitting Odoo's unique-name errors.

## Layout

| Path | Purpose |
|---|---|
| `fixtures/index.js` | Login/OTP-skip fixture, page-object fixtures, `tc()` helper |
| `utils/auth.js`, `utils/totp.js` | Login, OTP, session check, storage state |
| `utils/testCases.js` | Reads TC title, priority, type and expected result from the xlsx, used for test titles, tags and annotations |
| `pages/OdooPage.js` | Generic Odoo 18 helpers: apps/menus, field-name based `fill()` (auto-detects many2one, selection, boolean, date), lines, save, dialogs, blocked-delete |
| `pages/*Page.js` | Module page objects. Technical field names sit in one place at the top of each file |
| `tests/NN-*.spec.js` | Specs in execution order |
| `reporters/excelExecutionReporter.js` | Writes Status, Actual Result, Tester and Date into the **Execution** sheet → `reports/Execution_Results.xlsx` |

## Maintaining selectors

Fields are addressed by their Odoo technical name (`.o_field_widget[name="..."]`). Custom AveriGo names were taken from the existing `e2eFlow` page objects. Names that haven't been confirmed against the live forms are best guesses and are grouped in the page objects: equipment, case, specials, catalogue, truck and report-wizard filters. To check a name, turn on developer mode (`/web?debug=1`) and hover the field label.
