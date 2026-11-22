#!/usr/bin/env bash
set -euo pipefail

AUDIT="$HOME/workspace/audit_logs"
mkdir -p "$AUDIT"
chmod 700 "$AUDIT"

REPORT="$AUDIT/system_health_report.txt"

{
    echo "======================================"
    echo "        SYSTEM HEALTH REPORT"
    echo "======================================"
    echo "Generated: $(date)"
    echo "Hostname: $(hostname)"
    echo "Username: $(whoami)"
    echo

    echo "[1] UPTIME"
    uptime -p
    echo

    echo "[2] CPU"
    echo "Architecture: $(uname -m)"
    echo "Kernel: $(uname -r)"
    echo "Logical processors: $(nproc --all)"
    echo "Visible physical cores: $(lscpu -p=SOCKET,CORE | grep -v '^#' | sort -u | wc -l)"
    echo

    echo "[3] MEMORY FROM /proc/meminfo"
    awk '
        /MemTotal:/ {total=$2}
        /MemAvailable:/ {available=$2}
        END {
            used=total-available
            printf "Total memory: %.2f MiB\n", total/1024
            printf "Estimated active usage: %.2f MiB\n", used/1024
            printf "Available memory: %.2f MiB\n", available/1024
        }
    ' /proc/meminfo
    echo

    echo "[4] CURRENT USER PROCESSES"
    ps -u "$(id -un)" \
       -o pid,ppid,%cpu,%mem,rss,comm \
       --sort=-rss
    echo
    echo "======================================"
} > "$REPORT"

chmod 600 "$REPORT"
cat "$REPORT"
