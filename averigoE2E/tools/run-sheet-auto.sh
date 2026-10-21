#!/usr/bin/env bash
# Drives tools/run-sheet.sh with STOP_ON_FAIL=1 and handles each stop:
#   every failure is re-run once on its own: PASS -> resume at the next case; FAIL -> if listed in KNOWN (known
#   app defects / setup gaps) logged and skipped, otherwise stop for investigation. The re-run of a known case also
#   recovers a slow-server failure before the defect (e.g. a save timing out), so later cases still get their data.
# Usage: RUN_ID=<id> FROM=TC-030 BASE_URL=... ORDER_FILE=... KNOWN="TC-019 TC-029 ..." tools/run-sheet-auto.sh
set -u
cd "$(dirname "$0")/.."
: "${RUN_ID:?RUN_ID required}"
ORDER_FILE=${ORDER_FILE:-tools/sheet-order.txt}
KNOWN=" ${KNOWN:-} "
export RUN_ID HEADLESS=${HEADLESS:-1} EXCEL_ACCUMULATE=1
LOG="reports/run-sheet-$RUN_ID.log"
from=${FROM:-}

next_case() { awk -v t="$1" 'f{print $1; exit} $1==t{f=1}' "$ORDER_FILE"; }

while :; do
  FROM=$from STOP_ON_FAIL=1 tools/run-sheet.sh
  stopped=$(tail -6 "$LOG" | sed -n 's/^stopped at \([^ ]*\) .*/\1/p')
  [ -z "$stopped" ] && { echo "AUTO: run complete" | tee -a "$LOG"; exit 0; }
  spec=$(awk -v t="$stopped" '$1==t{print $3}' "$ORDER_FILE")
  tag="@$(echo "$stopped" | tr 'A-Z' 'a-z')\\b"
  res=$(npx playwright test "$spec" --grep "$tag" --output "test-results/runs/$RUN_ID/$stopped-rerun" 2>&1)
  echo "$res" > "test-results/runs/$RUN_ID/$stopped-rerun.log"
  err=$(echo "$res" | grep -m1 -E 'Error:|TimeoutError' | sed 's/^ *//' | cut -c1-160)
  if echo "$res" | grep -q " passed"; then
    echo "AUTO: $stopped rerun PASS" | tee -a "$LOG"
  elif [[ "$KNOWN" == *" $stopped "* ]]; then
    echo "AUTO: $stopped rerun FAIL, known defect, skipped: $err" | tee -a "$LOG"
  else
    echo "AUTO: $stopped rerun FAIL $err" | tee -a "$LOG"
    exit 1
  fi
  from=$(next_case "$stopped")
  [ -z "$from" ] && { echo "AUTO: run complete" | tee -a "$LOG"; exit 0; }
done
