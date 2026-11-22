# MARVEL Task 4: Hack the Hardware
## Execution and Analysis Notebook

### 1. Objective
Inspect an Ubuntu Linux workstation using terminal commands,
identify hardware and resource information, analyze processes,
manage file permissions, and trace system calls.

### 2. Environment
Ubuntu Server running inside UTM on an Apple Silicon Mac.
The hardware reported inside Ubuntu is virtualized.

### 3. Hardware and Kernel Inspection
Commands:
- lscpu
- uname -r
- cat /proc/cpuinfo
- cat /proc/meminfo

Evidence: audit_logs/system_summary.txt

lscpu displays the CPU architecture and topology visible to Linux.
uname -r displays the running Linux kernel version.
/proc exposes kernel-maintained information as virtual files.

### 4. Process and Resource Triage
Command:
ps aux --sort=-%mem

User-specific command:
ps -u "$(id -un)" -o pid,ppid,%cpu,%mem,rss,comm --sort=-rss

Evidence: audit_logs/process_audit.log

The first command lists system-wide processes ordered by
reported memory percentage. The second restricts the results
to processes owned by the current user.

### 5. Filesystem Permissions
Commands:
mkdir -p ~/workspace/audit_logs
chmod 700 ~/workspace/audit_logs

Permission 700 gives the owner read, write, and execute access,
while group members and other users receive no access.

### 6. Log Parsing
Command:
cat system.log | grep '\[ERROR\]' | awk -F'] ' '{print $2}' | sort | uniq -c | sort -nr

Explanation:
cat reads the log.
grep selects entries marked [ERROR].
awk extracts the message after the closing bracket.
sort groups identical messages together.
uniq -c counts repeated messages.
sort -nr ranks messages by frequency.

Evidence: audit_logs/error_counts.txt

### 7. System Calls
Command:
strace -e trace=openat,write /bin/ls

openat() asks the kernel to open a file or directory.
write() asks the kernel to write bytes to a file descriptor.

Evidence: audit_logs/strace.log

Add two exact lines from strace_examples.txt here.
Explain each line's arguments and return value.

### 8. Automated Health Monitoring
The system_health.sh script collects:
- System uptime
- CPU architecture and visible core count
- Memory statistics from /proc/meminfo
- Current user's running processes

Evidence: audit_logs/system_health_report.txt

### 9. Problems and Solutions
Document any real errors encountered during installation,
permissions configuration, or script execution.

### 10. CPU Drawings
Attach two original drawings:
1. My understanding of a CPU before studying architecture.
2. My understanding after studying the CU, ALU, registers,
   memory, buses, and fetch-decode-execute cycle.

### 11. Conclusion
Write a short conclusion based on your actual observations.

---

## 12. Actual System Observations

The following results were obtained from Ubuntu Server
running inside a UTM virtual machine.

- Hostname: marvel-ubuntu
- Architecture: aarch64 (ARM64)
- Kernel version: 7.0.0-44-generic
- Logical processors: 2
- CPU cores visible to Ubuntu: 2
- Total RAM: 3381.12 MiB
- Estimated used RAM: 424.49 MiB
- Available RAM: 2956.62 MiB
- Uptime at measurement: 13 minutes

These CPU values describe the virtual hardware exposed
to Ubuntu rather than the physical Mac processor.

## 13. System Call Analysis

Observed openat() call:

openat(AT_FDCWD, "/etc/ld.so.cache", O_RDONLY|O_CLOEXEC) = 3

Explanation:
- openat() requests access to a file.
- AT_FDCWD indicates the current working directory
  for relative paths.
- O_RDONLY requests read-only access.
- O_CLOEXEC closes the descriptor during exec.
- Return value 3 indicates successful opening.

Observed write() call:

write(1, "audit_logs\nsystem_health.sh\n", 28) = 28

Explanation:
- write() sends bytes to a file descriptor.
- Descriptor 1 represents standard output.
- The command requested writing 28 bytes.
- Return value 28 confirms that all bytes were written.

## 14. Log Processing Results

The sample log produced:

- Disk read failed: 3 occurrences
- Memory allocation failed: 2 occurrences
- Permission denied: 1 occurrence

Pipes allow commands to pass their output directly
to the next command without intermediate files.

## 15. Permission Verification

The audit_logs directory has permissions drwx------.

This corresponds to octal mode 700:
- Owner: read, write, execute
- Group: no permissions
- Others: no permissions

## 16. Environment Setup Notes

Ubuntu Server was installed in UTM using an ARM64
virtual machine. SSH was configured to allow terminal
access from macOS.

Using SSH made it possible to paste commands and
execute shell scripts conveniently.

## 17. Conclusion

This exercise demonstrated how Linux exposes system
information through terminal commands and virtual
filesystems. The system audit successfully collected
CPU, kernel, memory, process, and permission details.

The strace utility showed how a user-space command
interacts with the Linux kernel through system calls.
A Bash script was created to automate system health
reporting and store its output securely.
