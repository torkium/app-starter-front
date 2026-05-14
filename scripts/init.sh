#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${ROOT_DIR}/.env"

if [ -f "${ENV_FILE}" ]; then
  echo "Keep existing ${ENV_FILE}"
else
  cp "${ROOT_DIR}/.env.example" "${ENV_FILE}"
  echo "Created ${ENV_FILE}"
fi

cat <<'EOF'
My App front initialized.

Next steps:
1. Review .env and align API_BASE_URL with your backend stack
2. Run: make up
3. Validate: make check
EOF
