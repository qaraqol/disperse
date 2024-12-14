import { config } from "./config.js";
import { processTransactionsFromCSV } from "./csv-processor.js";

// Example usage
async function main() {
  try {
    await processTransactionsFromCSV("receivers.csv", config);
  } catch (error) {
    console.error("Failed to process transactions:", error);
  }
}

main();
