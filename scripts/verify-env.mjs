const publicOptional = [
  "VITE_ANALYTICS_ID",
  "VITE_PUBLIC_SITE_URL",
  "NEXT_PUBLIC_DIAGNOSTIC_URL",
];

const forbiddenClientEnv = [
  "SUPABASE_SERVICE_ROLE_KEY",
  "DATABASE_URL",
  "WEBHOOK_SECRET",
  "CLIENT_SECRET",
  "PRIVATE_KEY",
];

const exposedForbidden = forbiddenClientEnv.filter((name) => process.env[name]);

if (exposedForbidden.length > 0) {
  console.error("Forbidden server/private environment variables are present in the frontend runtime contract:");
  for (const name of exposedForbidden) {
    console.error(`- ${name}`);
  }
  process.exit(1);
}

console.log("Environment contract verified.");
console.log(`Optional public variables: ${publicOptional.join(", ")}`);
