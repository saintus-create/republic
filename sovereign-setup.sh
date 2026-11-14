#!/usr/bin/env bash
# =============================================================================
# sovereign-setup.sh
# Sets up the republic personal site for 100% EU-sovereign deployment.
#
# Usage:
#   chmod +x sovereign-setup.sh
#   ./sovereign-setup.sh
#
# What it does:
#   1. Checks required tools (node 24, pnpm, docker)
#   2. Prompts for your Mistral API key and access password
#   3. Optionally prompts for a SearXNG URL (or spins one up with Docker)
#   4. Writes a .env file
#   5. Installs dependencies
#   6. Runs typecheck and lint
#   7. Builds the app
#   8. Prints run instructions
# =============================================================================

set -euo pipefail

# ── Colours ───────────────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

info()    { echo -e "${CYAN}→${NC} $*"; }
success() { echo -e "${GREEN}✓${NC} $*"; }
warn()    { echo -e "${YELLOW}⚠${NC}  $*"; }
error()   { echo -e "${RED}✗${NC} $*"; exit 1; }
header()  { echo -e "\n${BOLD}$*${NC}"; }

# ── 1. Check tools ────────────────────────────────────────────────────────────
header "Checking required tools"

check_node() {
  if ! command -v node &>/dev/null; then
    error "Node.js not found. Install Node.js 24 from https://nodejs.org"
  fi
  local version
  version=$(node --version | sed 's/v//' | cut -d. -f1)
  if [[ "$version" -lt 24 ]]; then
    error "Node.js 24+ required (found v${version}). Install from https://nodejs.org"
  fi
  success "Node.js $(node --version)"
}

check_pnpm() {
  if ! command -v pnpm &>/dev/null; then
    info "pnpm not found — installing via corepack..."
    corepack enable
    corepack prepare pnpm@latest --activate
  fi
  success "pnpm $(pnpm --version)"
}

check_docker() {
  if command -v docker &>/dev/null; then
    DOCKER_AVAILABLE=true
    success "Docker $(docker --version | awk '{print $3}' | tr -d ',')"
  else
    DOCKER_AVAILABLE=false
    warn "Docker not found — SearXNG auto-setup will be skipped"
  fi
}

check_node
check_pnpm
check_docker

# ── 2. Collect credentials ────────────────────────────────────────────────────
header "Credentials"

read -rp "$(echo -e "${CYAN}Mistral API key${NC} (from console.mistral.ai): ")" MISTRAL_API_KEY
[[ -z "$MISTRAL_API_KEY" ]] && error "Mistral API key is required."

echo ""
echo -e "  ${BOLD}Mistral model choices:${NC}"
echo "    1) mistral-large-latest  (most capable)"
echo "    2) mistral-small-latest  (faster, cheaper)"
echo "    3) open-mistral-nemo     (lightest, free tier friendly)"
read -rp "$(echo -e "${CYAN}Model choice${NC} [1]: ")" MODEL_CHOICE
case "${MODEL_CHOICE:-1}" in
  2) MISTRAL_MODEL="mistral-small-latest" ;;
  3) MISTRAL_MODEL="open-mistral-nemo" ;;
  *) MISTRAL_MODEL="mistral-large-latest" ;;
esac
success "Model: $MISTRAL_MODEL"

echo ""
read -rsp "$(echo -e "${CYAN}Access password${NC} for the chat (visitors will enter this): ")" EVE_ACCESS_PASSWORD
echo ""
[[ -z "$EVE_ACCESS_PASSWORD" ]] && error "Access password is required."
success "Access password set"

# ── 3. SearXNG setup ──────────────────────────────────────────────────────────
header "Sovereign web search (SearXNG)"

SEARXNG_URL=""

if [[ "$DOCKER_AVAILABLE" == true ]]; then
  read -rp "$(echo -e "${CYAN}Start a local SearXNG container?${NC} [Y/n]: ")" START_SEARXNG
  if [[ "${START_SEARXNG:-Y}" =~ ^[Yy]$ ]]; then
    SEARXNG_PORT=8080
    info "Pulling SearXNG Docker image..."
    docker pull searxng/searxng:latest -q
    info "Starting SearXNG container on port $SEARXNG_PORT..."
    docker run -d \
      --name republic-searxng \
      --restart unless-stopped \
      -p "${SEARXNG_PORT}:8080" \
      -e "SEARXNG_SECRET=$(openssl rand -hex 32)" \
      searxng/searxng:latest \
      > /dev/null 2>&1 || {
        warn "SearXNG container may already be running — trying to reuse it."
        docker start republic-searxng > /dev/null 2>&1 || true
      }
    sleep 2
    SEARXNG_URL="http://localhost:${SEARXNG_PORT}"
    success "SearXNG running at $SEARXNG_URL"
  else
    read -rp "$(echo -e "${CYAN}Enter your SearXNG URL${NC} (or leave blank to skip web search): ")" SEARXNG_URL
  fi
else
  read -rp "$(echo -e "${CYAN}Enter your SearXNG URL${NC} (or leave blank to skip web search): ")" SEARXNG_URL
fi

if [[ -z "$SEARXNG_URL" ]]; then
  warn "No SearXNG URL set — web search will be unavailable."
fi

# ── 4. Write .env ──────────────────────────────────────────────────────────────
header "Writing .env"

cat > .env << EOF
# 🔑 Mistral — EU-sovereign AI (France)
MISTRAL_API_KEY=${MISTRAL_API_KEY}
MISTRAL_MODEL=${MISTRAL_MODEL}

# 🔒 Chat access password
EVE_ACCESS_PASSWORD=${EVE_ACCESS_PASSWORD}

# 🔍 SearXNG — sovereign web search
SEARXNG_URL=${SEARXNG_URL}
EOF

success ".env written"

# ── 5. Install dependencies ────────────────────────────────────────────────────
header "Installing dependencies"
pnpm install
success "Dependencies installed"

# ── 6. Validate ───────────────────────────────────────────────────────────────
header "Running typecheck"
if pnpm run typecheck; then
  success "Typecheck passed"
else
  warn "Typecheck had errors — check output above before deploying"
fi

# ── 7. Build ───────────────────────────────────────────────────────────────────
header "Building"
info "Building agent..."
pnpm run build:agent

info "Building web app..."
pnpm run build:web

success "Build complete"

# ── 8. Done ────────────────────────────────────────────────────────────────────
header "🇪🇺 Sovereign setup complete"
echo ""
echo -e "  ${BOLD}To run locally:${NC}"
echo "    pnpm run start:agent   # starts the eve agent on port 3000"
echo "    pnpm run start:web     # starts the web app on port 4173"
echo ""
echo -e "  ${BOLD}To run with Docker:${NC}"
echo "    docker build -t republic ."
echo "    docker run -d \\"
echo "      --env-file .env \\"
echo "      -v republic-sessions:/app/.eve \\"
echo "      -p 3000:3000 -p 4173:4173 \\"
echo "      republic"
echo ""
echo -e "  ${BOLD}Sovereignty checklist:${NC}"
echo "    ✓ AI model  → Mistral (France 🇫🇷)"
echo "    ✓ Web search → SearXNG (self-hosted)"
echo "    ✓ Sandbox   → JustBash (in-process, your server)"
echo "    ✓ Sessions  → local disk (.eve/)"
echo "    ✗ Hosting   → deploy to Hetzner / Scaleway / OVHcloud for full EU sovereignty"
echo ""
echo -e "  ${BOLD}Recommended EU hosts:${NC}"
echo "    • Hetzner Cloud    https://www.hetzner.com/cloud  (Germany 🇩🇪)"
echo "    • Scaleway         https://www.scaleway.com       (France 🇫🇷)"
echo "    • OVHcloud         https://www.ovhcloud.com       (France 🇫🇷)"
echo ""
