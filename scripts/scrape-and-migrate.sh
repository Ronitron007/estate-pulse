#!/bin/bash
# Scrape images from property websites and upload to GCS
# Usage: ./scrape-and-migrate.sh

set -e

BUCKET="property-listings-aglaghar"
TMP_DIR="/tmp/property-images"
mkdir -p "$TMP_DIR"

# Property configurations: slug|search_term|website_pattern
PROPERTIES=(
  "godrej-avenue-eleven|Godrej Avenue Eleven Mumbai|godrejproperties.com"
  "godrej-horizon|Godrej Horizon Mumbai|godrejproperties.com"
  "godrej-reserve|Godrej Reserve Pune|godrejproperties.com"
  "godrej-woodsville|Godrej Woodsville Pune|godrejproperties.com"
  "lodha-divino|Lodha Divino Mumbai|lodhagroup.com"
  "lodha-bellevue|Lodha Bellevue Mumbai|lodhagroup.com"
  "hiranandani-fortune-city|Hiranandani Fortune City Panvel|hiranandani.com"
  "oberoi-sky-city|Oberoi Sky City Mumbai|oberoirealty.com"
  "prestige-city-sarjapur|Prestige City Sarjapur Bangalore|prestigeconstructions.com"
  "prestige-high-fields|Prestige High Fields Hyderabad|prestigeconstructions.com"
  "sobha-dream-acres|Sobha Dream Acres Bangalore|sobha.com"
  "sobha-neopolis|Sobha Neopolis Bangalore|sobha.com"
  "brigade-eldorado|Brigade Eldorado Bangalore|brigadegroup.com"
  "dlf-the-arbour|DLF The Arbour Gurgaon|dlf.in"
  "dlf-the-camellias|DLF The Camellias Gurgaon|dlf.in"
)

echo "=== Property Image Migration Script ==="
echo "This script downloads images from property websites and uploads to GCS"
echo ""

for prop in "${PROPERTIES[@]}"; do
  IFS='|' read -r slug search_term website <<< "$prop"
  echo "Processing: $slug"
  echo "  Search: $search_term"
  echo "  Website: $website"
  echo ""
done

echo "Run with Playwright automation to download images."
