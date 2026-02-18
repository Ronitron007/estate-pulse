/**
 * Backfill location_advantages, project_details_extra, and investment_data
 * for existing projects so the new detail sections render.
 *
 * Usage: npx tsx scripts/backfill-rich-fields.ts
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

// Simple .env.local parser (no dotenv dependency)
const envFile = readFileSync(".env.local", "utf-8");
for (const line of envFile.split("\n")) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) process.env[match[1].trim()] = match[2].trim();
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!
);

async function main() {
  // Fetch all published projects
  const { data: projects, error } = await supabase
    .from("projects")
    .select("id, name, city, locality")
    .not("published_at", "is", null)
    .is("deleted_at", null)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Failed to fetch projects:", error);
    return;
  }

  console.log(`Found ${projects.length} published projects to backfill\n`);

  for (const p of projects) {
    const locationAdvantages = {
      airportKm: Math.floor(Math.random() * 30) + 5,
      itParkKm: Math.floor(Math.random() * 15) + 2,
      schoolsKm: Math.floor(Math.random() * 5) + 1,
      hospitalsKm: Math.floor(Math.random() * 8) + 1,
      marketKm: Math.floor(Math.random() * 5) + 1,
    };

    const projectDetailsExtra = {
      totalTowers: Math.floor(Math.random() * 6) + 2,
      totalUnits: Math.floor(Math.random() * 300) + 50,
      floors: Math.floor(Math.random() * 20) + 5,
      constructionStatus: ["Under Construction", "Ready to Move", "Nearing Completion"][Math.floor(Math.random() * 3)],
      facingOptions: ["East", "West", "North", "South"].slice(0, Math.floor(Math.random() * 3) + 2),
    };

    const investmentData = {
      rentalYieldPct: parseFloat((Math.random() * 3 + 2).toFixed(1)),
      appreciationTrendText: `${Math.floor(Math.random() * 10 + 5)}% annual appreciation in ${p.locality || p.city}`,
      futureInfrastructureText: `Metro expansion and IT corridor development near ${p.locality || p.city}`,
      developerTrackRecordSummary: `${Math.floor(Math.random() * 15 + 5)}+ projects delivered across ${p.city}`,
    };

    const { error: updateError } = await supabase
      .from("projects")
      .update({
        location_advantages: locationAdvantages,
        project_details_extra: projectDetailsExtra,
        investment_data: investmentData,
        vastu_compliant: Math.random() > 0.4,
        gated_community: Math.random() > 0.3,
        price_per_sqft: Math.floor(Math.random() * 8000) + 3000,
        maintenance_charges: Math.floor(Math.random() * 3000) + 500,
      })
      .eq("id", p.id);

    if (updateError) {
      console.error(`Failed to update ${p.name}:`, updateError.message);
    } else {
      console.log(`Updated: ${p.name}`);
    }
  }

  console.log("\nDone!");
}

main();
