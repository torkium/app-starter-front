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
PROJECT_UPPER="$(printf '%s' "$PROJECT_NAME" | tr '[:lower:]-' '[:upper:]_')"

FILES=(
  ".github/workflows/build-and-push.yml"
  ".github/workflows/ci.yml"
  "Makefile"
  "README.md"
  "package.json"
  "package-lock.json"
  ".env.example"
  "next.config.ts"
  "public/manifest.webmanifest"
  "public/sw.js"
  "scripts/init.sh"
  "scripts/validate-public-runtime-env.mjs"
  "src/app/(app)/account/page.tsx"
  "src/app/(auth)/cgu/page.tsx"
  "src/app/(auth)/charte/page.tsx"
  "src/app/(auth)/loading.tsx"
  "src/app/(auth)/register/page.tsx"
  "src/app/(auth)/register/success/page.tsx"
  "src/app/(auth)/reset-password/page.tsx"
  "src/app/(auth)/verify-email/page.tsx"
  "src/app/(auth)/verify-email/success/page.tsx"
  "src/app/global-error.tsx"
  "src/app/layout.tsx"
  "src/app/page.tsx"
  "src/app/runtime-config.js/route.ts"
  "src/design-system/molecules/FormCard.stories.tsx"
  "src/design-system/organisms/AppShell.tsx"
  "src/design-system/organisms/AppShell.stories.tsx"
  "src/design-system/organisms/AuthLayoutFrame.stories.tsx"
  "src/design-system/organisms/Section.stories.tsx"
  "src/design-system/organisms/SidebarShell.tsx"
  "src/design-system/primitives/atoms/Avatar.stories.tsx"
  "src/domains/auth/components/AuthShell.tsx"
  "src/features/shell/AppShell.tsx"
  ".storybook/preview.ts"
  "src/domains/billing/components/BillingPageClient.tsx"
  "src/domains/auth/actions.ts"
  "src/domains/media/hooks/useDirectUpload.ts"
  "src/domains/user/components/DashboardOverview.tsx"
  "src/infrastructure/env/env.ts"
  "src/infrastructure/env/env.test.ts"
  "src/infrastructure/auth/cookies.ts"
  "src/infrastructure/http/requestContext.ts"
  "src/infrastructure/consent/consent.test.ts"
  "src/infrastructure/pwa/PwaContext.tsx"
  "src/infrastructure/pwa/components/PwaInstallBanner.tsx"
  "src/shared/types/runtime-env.d.ts"
  "src/proxy.ts"
)

for file in "${FILES[@]}"; do
  assert_file "$file"
done

for file in "${FILES[@]}"; do
  target="${ROOT_DIR}/${file}"
  replace_literal "$target" "starter-back" "$BACK_REPO"
  replace_literal "$target" "app-starter-back" "$BACK_REPO"
  replace_literal "$target" "starter-front" "$FRONT_REPO"
  replace_literal "$target" "app-starter-front" "$FRONT_REPO"
  replace_literal "$target" "starter-infra" "$INFRA_REPO"
  replace_literal "$target" "app-starter-infra" "$INFRA_REPO"
  replace_literal "$target" "starter_back" "$BACK_REPO"
  replace_literal "$target" "my_app_back" "$BACK_REPO"
  replace_literal "$target" "starter_front" "$FRONT_REPO"
  replace_literal "$target" "my_app_front" "$FRONT_REPO"
  replace_literal "$target" "starter_infra" "$INFRA_REPO"
  replace_literal "$target" "my_app_infra" "$INFRA_REPO"
  replace_literal "$target" "App Front" "$PROJECT_TITLE"
  replace_literal "$target" "App front" "${PROJECT_TITLE} front"
  replace_literal "$target" "App frontend" "${PROJECT_TITLE} frontend"
  replace_literal "$target" "Production-minded Next.js 16 frontend foundation built for JWT + refresh-token applications, centered on \`User\`, with SSR auth, API proxying, runtime config, and a neutral UI foundation." "${PROJECT_TITLE} frontend built with Next.js 16, SSR auth, API proxying, runtime config, and a neutral UI foundation."
  replace_literal "$target" "This repo is designed to be reusable on its own, or as part of a full application stack with:" "This repository contains the frontend for ${PROJECT_TITLE}."
  replace_literal "$target" "- \`${BACK_REPO}\`: the companion Symfony backend foundation" "- Backend repository: \`${BACK_REPO}\`"
  replace_literal "$target" "- \`${INFRA_REPO}\`: the companion Docker/CI-CD/operations foundation" "- Infrastructure repository: \`${INFRA_REPO}\`"
  replace_literal "$target" "Use \`${FRONT_REPO}\` when you want a frontend foundation that already solves the non-business layer:" "This frontend foundation already solves the non-business layer:"
  replace_literal "$target" "The foundation intentionally contains no product-specific business UI and no project-specific domain pages." "Business-specific screens can be added on top of this foundation."
  replace_literal "$target" "## Companion Repositories" "## Companion Services"
  replace_literal "$target" "Use it if you want the matching backend that already exposes auth, account, billing, realtime, media, and outbox foundations expected by this frontend." "Backend service expected by this frontend."
  replace_literal "$target" "Use it if you want the full stack orchestrator with Nginx, Mercure, Compose, CI/CD, observability, and deployment automation." "Infrastructure service for Nginx, Mercure, Compose, CI/CD, observability, and deployment automation."
  replace_literal "$target" "Typical combinations:" "Typical setup:"
  replace_literal "$target" "- \`${FRONT_REPO}\` alone: bring your own compatible backend and infrastructure" "- Frontend only: bring your own compatible backend and infrastructure"
  replace_literal "$target" "- \`${FRONT_REPO}\` + \`${BACK_REPO}\`: application layer only, with your own infra" "- Frontend + backend: application layer only, with your own infra"
  replace_literal "$target" "- \`${FRONT_REPO}\` + \`${BACK_REPO}\` + \`${INFRA_REPO}\`: full application platform" "- Frontend + backend + infra: full application platform"
  replace_literal "$target" "For the full ${PROJECT_TITLE} stack, prefer \`${INFRA_REPO}\` and its \`make dev-up\` flow. The Compose file in this repository is intended for frontend-only work, Storybook, and isolated local debugging." "For the full ${PROJECT_TITLE} stack, prefer \`${INFRA_REPO}\` and its \`make dev-up\` flow. The Compose file in this repository is intended for frontend-only work, Storybook, and isolated local debugging."
  replace_literal "$target" "To initialize this repository for a named project, run:" "This repository has been initialized for ${PROJECT_TITLE}."
  replace_literal "$target" "./scripts/init-project.sh \\" "# Initial templating command:"
  replace_literal "$target" "  --project-name my-app \\" "# project: ${PROJECT_NAME}"
  replace_literal "$target" "  --back-repo my-app-back \\" "# back repo: ${BACK_REPO}"
  replace_literal "$target" "  --front-repo my-app-front \\" "# front repo: ${FRONT_REPO}"
  replace_literal "$target" "  --infra-repo my-app-infra" "# infra repo: ${INFRA_REPO}"
  replace_literal "$target" "This frontend does not require \`${BACK_REPO}\`, but it expects a backend with equivalent capabilities." "This frontend expects a backend with equivalent capabilities."
  replace_literal "$target" "## Suggested Workflow With The Companion Repositories" "## Suggested Full-Stack Workflow"
  replace_literal "$target" "If you use the full trio:" "If you use the full stack:"
  replace_literal "$target" "Initialize \`${BACK_REPO}\`" "Prepare \`${BACK_REPO}\`"
  replace_literal "$target" "Initialize \`${FRONT_REPO}\`" "Prepare \`${FRONT_REPO}\`"
  replace_literal "$target" "Initialize \`${INFRA_REPO}\`" "Prepare \`${INFRA_REPO}\`"
  replace_literal "$target" "Starter Front" "$PROJECT_TITLE"
  replace_literal "$target" "My App" "$PROJECT_TITLE"
  replace_literal "$target" "Starter front" "${PROJECT_TITLE} front"
  replace_literal "$target" "Starter frontend" "${PROJECT_TITLE} frontend"
  replace_literal "$target" "starter_access_token" "${PROJECT_NAME}_access_token"
  replace_literal "$target" "my_app_access_token" "${PROJECT_NAME}_access_token"
  replace_literal "$target" "starter_refresh_token" "${PROJECT_NAME}_refresh_token"
  replace_literal "$target" "my_app_refresh_token" "${PROJECT_NAME}_refresh_token"
  replace_literal "$target" "starter_session_id" "${PROJECT_NAME}_session_id"
  replace_literal "$target" "my_app_session_id" "${PROJECT_NAME}_session_id"
  replace_literal "$target" "starter_locale" "${PROJECT_NAME}_locale"
  replace_literal "$target" "my_app_locale" "${PROJECT_NAME}_locale"
  replace_literal "$target" "starter_cookie_consent" "${PROJECT_NAME}_cookie_consent"
  replace_literal "$target" "my_app_cookie_consent" "${PROJECT_NAME}_cookie_consent"
  replace_literal "$target" "starter.request_id" "${PROJECT_NAME}.request_id"
  replace_literal "$target" "my_app.request_id" "${PROJECT_NAME}.request_id"
  replace_literal "$target" "my-app.local" "${PROJECT_NAME}.local"
  replace_literal "$target" "my_app:pwa" "${PROJECT_NAME}:pwa"
  replace_literal "$target" "MY_APP_VALIDATE_SERVER_ENV" "${PROJECT_UPPER}_VALIDATE_SERVER_ENV"
  replace_literal "$target" "__STARTER_PUBLIC_CONFIG__" "__${PROJECT_UPPER}_PUBLIC_CONFIG__"
  replace_literal "$target" "__MY_APP_PUBLIC_CONFIG__" "__${PROJECT_UPPER}_PUBLIC_CONFIG__"
done

if [ -f "${ROOT_DIR}/.env" ]; then
  replace_literal "${ROOT_DIR}/.env" "app-starter-front" "$FRONT_REPO"
  replace_literal "${ROOT_DIR}/.env" "My App" "$PROJECT_TITLE"
  replace_literal "${ROOT_DIR}/.env" "my_app" "$PROJECT_NAME"
fi

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
