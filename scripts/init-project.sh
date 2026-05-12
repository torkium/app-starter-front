#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

usage() {
  cat <<'EOF'
Usage: scripts/init-project.sh --project-name <name> [options]

Options:
  --project-name <name>   Project slug, for example: my-app
  --back-repo <name>      Backend repository name, default: <project>-back
  --front-repo <name>     Frontend repository name, default: <project>-front
  --infra-repo <name>     Infra repository name, default: <project>-infra
  --github-owner <name>   Optional GitHub owner, kept for interface consistency
  --help                  Show this help
EOF
}

require_value() {
  local option="$1"
  local value="${2:-}"

  if [ -z "$value" ]; then
    echo "Missing value for $option" >&2
    exit 1
  fi
}

title_case() {
  printf '%s' "$1" | tr '_-' '  ' | awk '{
    for (i = 1; i <= NF; i++) {
      $i = toupper(substr($i, 1, 1)) tolower(substr($i, 2));
    }
    print;
  }'
}

replace_literal() {
  local file="$1"
  local old="$2"
  local new="$3"

  OLD_VALUE="$old" NEW_VALUE="$new" perl -0pi -e 's/\Q$ENV{OLD_VALUE}\E/$ENV{NEW_VALUE}/g' "$file"
}

assert_file() {
  local file="$1"

  if [ ! -f "${ROOT_DIR}/${file}" ]; then
    echo "Expected file not found: ${ROOT_DIR}/${file}" >&2
    exit 1
  fi
}

PROJECT_NAME=""
BACK_REPO=""
FRONT_REPO=""
INFRA_REPO=""

while [ "$#" -gt 0 ]; do
  case "$1" in
    --project-name)
      require_value "$1" "${2:-}"
      PROJECT_NAME="$2"
      shift 2
      ;;
    --back-repo)
      require_value "$1" "${2:-}"
      BACK_REPO="$2"
      shift 2
      ;;
    --front-repo)
      require_value "$1" "${2:-}"
      FRONT_REPO="$2"
      shift 2
      ;;
    --infra-repo)
      require_value "$1" "${2:-}"
      INFRA_REPO="$2"
      shift 2
      ;;
    --github-owner)
      require_value "$1" "${2:-}"
      shift 2
      ;;
    --help|-h)
      usage
      exit 0
      ;;
    *)
      echo "Unknown option: $1" >&2
      usage >&2
      exit 1
      ;;
  esac
done

if [ -z "$PROJECT_NAME" ]; then
  usage >&2
  exit 1
fi

BACK_REPO="${BACK_REPO:-${PROJECT_NAME}-back}"
FRONT_REPO="${FRONT_REPO:-${PROJECT_NAME}-front}"
INFRA_REPO="${INFRA_REPO:-${PROJECT_NAME}-infra}"

PROJECT_TITLE="$(title_case "$PROJECT_NAME")"

FILES=(
  ".github/workflows/build-and-push.yml"
  ".github/workflows/ci.yml"
  ".storybook/preview.ts"
  "README.md"
  "package.json"
  "package-lock.json"
  ".env.example"
  "public/manifest.webmanifest"
  "public/sw.js"
  "scripts/init.sh"
  "src/app/layout.tsx"
  "src/app/page.tsx"
  "src/app/runtime-config.js/route.ts"
  "src/design-system/organisms/AppShell.tsx"
  "src/design-system/organisms/AppShell.stories.tsx"
  "src/features/shell/AppShell.tsx"
  "src/infrastructure/env/env.ts"
  "src/infrastructure/auth/cookies.ts"
  "src/infrastructure/http/requestContext.ts"
  "src/infrastructure/consent/consent.test.ts"
  "src/infrastructure/env/env.test.ts"
  "src/infrastructure/pwa/PwaContext.tsx"
  "src/shared/types/runtime-env.d.ts"
  "src/proxy.ts"
)

for file in "${FILES[@]}"; do
  assert_file "$file"
done

for file in "${FILES[@]}"; do
  target="${ROOT_DIR}/${file}"
  replace_literal "$target" "starter-back" "$BACK_REPO"
  replace_literal "$target" "starter-front" "$FRONT_REPO"
  replace_literal "$target" "starter-infra" "$INFRA_REPO"
  replace_literal "$target" "starter_back" "$BACK_REPO"
  replace_literal "$target" "starter_front" "$FRONT_REPO"
  replace_literal "$target" "starter_infra" "$INFRA_REPO"
  replace_literal "$target" "App Front" "$PROJECT_TITLE"
  replace_literal "$target" "App front" "${PROJECT_TITLE} front"
  replace_literal "$target" "App frontend" "${PROJECT_TITLE} frontend"
  replace_literal "$target" "Starter Front" "$PROJECT_TITLE"
  replace_literal "$target" "Starter front" "${PROJECT_TITLE} front"
  replace_literal "$target" "Starter frontend" "${PROJECT_TITLE} frontend"
  replace_literal "$target" "starter_access_token" "${PROJECT_NAME}_access_token"
  replace_literal "$target" "starter_refresh_token" "${PROJECT_NAME}_refresh_token"
  replace_literal "$target" "starter_session_id" "${PROJECT_NAME}_session_id"
  replace_literal "$target" "starter_locale" "${PROJECT_NAME}_locale"
  replace_literal "$target" "starter_cookie_consent" "${PROJECT_NAME}_cookie_consent"
  replace_literal "$target" "starter:pwa-install-dismissed" "${PROJECT_NAME}:pwa-install-dismissed"
  replace_literal "$target" "starter:pwa-install-dismissed-changed" "${PROJECT_NAME}:pwa-install-dismissed-changed"
  replace_literal "$target" "starter.request_id" "${PROJECT_NAME}.request_id"
  replace_literal "$target" "__STARTER_PUBLIC_CONFIG__" "__$(printf '%s' "$PROJECT_NAME" | tr '[:lower:]-' '[:upper:]_')_PUBLIC_CONFIG__"
done

replace_literal "${ROOT_DIR}/public/manifest.webmanifest" '"short_name": "Starter"' "\"short_name\": \"${PROJECT_TITLE}\""
replace_literal "${ROOT_DIR}/public/manifest.webmanifest" '"short_name": "App"' "\"short_name\": \"${PROJECT_TITLE}\""

cat <<EOF
Project templating applied in ${FRONT_REPO}.

Applied values:
- project: ${PROJECT_NAME}
- back repo: ${BACK_REPO}
- front repo: ${FRONT_REPO}
- infra repo: ${INFRA_REPO}
EOF
