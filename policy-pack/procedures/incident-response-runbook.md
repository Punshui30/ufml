# Incident Response Runbook
## Severity Levels
- Sev1 (data exfil suspected): page team, isolate systems, rotate keys, notify counsel.
- Sev2 (degraded security control): mitigate within 24h.
- Sev3 (minor issue): backlog within 7d.

## Steps
1. Detect → triage → declare severity.
2. Contain (disable creds, block IPs, revoke tokens).
3. Eradicate (patch, rotate, restore from backup if needed).
4. Recover (bring services up under monitoring).
5. Notify (users/regulators if required).
6. Postmortem within 7 days.
