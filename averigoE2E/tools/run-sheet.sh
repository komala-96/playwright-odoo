#!/usr/bin/env bash
# Runs every test case in the order of the test case sheet (tools/sheet-order.txt), one per invocation, on a NEW
# data set (fresh RUN_ID). One test per invocation so a failing case doesn't skip the rest of its spec file.
# Results accumulate in reports/Execution_Results.xlsx; per-case artifacts in test-results/runs/<RUN_ID>/<TC>/.
# Usage: tools/run-sheet.sh            (new data set)
#        RUN_ID=<id> FROM=TC-050 tools/run-sheet.sh   (resume an existing run from a case)
#        STOP_ON_FAIL=1 ...                            (stop at the first failure)
set -u
cd "$(dirname "$0")/.."

if [ -z "${RUN_ID:-}" ]; then
  [ -f .runid ] && cp .runid ".runid.$(grep -o '[0-9]*' .runid)"
  RUN_ID=$(date +%s%3N)
  echo "export RUN_ID=$RUN_ID" > .runid
  [ -f reports/Execution_Results.xlsx ] && mv reports/Execution_Results.xlsx "reports/Execution_Results.before-$RUN_ID.xlsx"
fi
export RUN_ID HEADLESS=${HEADLESS:-1} EXCEL_ACCUMULATE=1
LOG="reports/run-sheet-$RUN_ID.log"
echo "RUN_ID=$RUN_ID started $(date '+%m/%d %H:%M')" | tee -a "$LOG"

started=${FROM:+0}; started=${started:-1}
while read -r tid seq spec; do
  [ -z "$tid" ] && continue
  if [ "$started" = 0 ]; then [ "$tid" = "$FROM" ] && started=1 || continue; fi
  tag="@$(echo "$tid" | tr 'A-Z' 'a-z')\\b"
  out="test-results/runs/$RUN_ID/$tid"
  for attempt in 1 2; do
    t0=$(date +%s)
    res=$(npx playwright test "$spec" --grep "$tag" --output "$out" 2>&1)
    secs=$(( $(date +%s) - t0 ))
    if echo "$res" | grep -q " passed"; then status=PASS
    elif echo "$res" | grep -q " skipped" && ! echo "$res" | grep -q " failed"; then status=SKIPPED
    else status=FAIL; fi
    err=$(echo "$res" | grep -m1 -E "Error:|TimeoutError" | sed 's/^ *//' | cut -c1-180)
    # Retry once only for infrastructure hiccups (slow server / closed browser), not for test failures.
    if [ "$status" = FAIL ] && [ "$attempt" = 1 ] && echo "$res" | grep -qE "page.goto: Timeout|Target page, context or browser has been closed|net::ERR"; then
      echo "$tid ($seq) infra error, retrying: $err" | tee -a "$LOG"; continue
    fi
    break
  done
  printf '%-8s %-8s %-7s %5ss  %s\n' "$tid" "$seq" "$status" "$secs" "$err" | tee -a "$LOG"
  mkdir -p "$out"; echo "$res" > "$out/run.log"
  # STOP_ON_FAIL=1: stop at the first failing case so it can be fixed and re-run (resume with FROM=<that case>).
  if [ "${STOP_ON_FAIL:-0}" = 1 ] && [ "$status" = FAIL ]; then echo "stopped at $tid (STOP_ON_FAIL)" | tee -a "$LOG"; break; fi
done < "${ORDER_FILE:-tools/sheet-order.txt}"
echo "finished $(date '+%m/%d %H:%M')" | tee -a "$LOG"
grep -cE " PASS " "$LOG" | xargs -I{} echo "PASS {}" | tee -a "$LOG"
grep -cE " FAIL " "$LOG" | xargs -I{} echo "FAIL {}" | tee -a "$LOG"
grep -cE " SKIPPED " "$LOG" | xargs -I{} echo "SKIPPED {}" | tee -a "$LOG"
