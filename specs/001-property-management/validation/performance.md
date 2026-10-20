# Three-session local timing smoke

Observed on macOS Apple Silicon, Bun 1.3.14, compiled Nest backend with PostgreSQL17.11 and Redis7.4.11 running in local Docker. This is a small demo smoke, not load/stress or a production SLA.

Command: `bun scripts/performance.ts`. Three simultaneous authenticated Owner/Manager/Viewer sessions each performed list/detail and permitted save or metadata read; all nine responses were200 and below the2000ms budget. The isolated rental_demo_test baseline was restored afterwards. Actual per-action timings and timestamp: [T092-timing.json](../coding/logs/T092-timing.json). Initial probe used shortened property IDs and failed; corrected to canonical fixture IDs before measuring accepted results.
