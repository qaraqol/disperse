// csv-processor.js
import { parse } from "papaparse";
import { createTokenTransaction } from "./transaction-creator.js";
import { sendTransaction } from "./transaction-sender.js";

export async function processTransactionsFromCSV(filePath, config) {
  const fileContent = await Bun.file(filePath).text();
  parse(fileContent, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    complete: async (results) => {
      const records = results.data;

      for (const record of records) {
        try {
          const transaction = createTokenTransaction({
            senderName: config.senderName,
            receiverName: record.receiverName,
            contractName: config.contractName,
            amount: record.amount,
            tokenName: config.tokenName,
            tokenPrecision: config.tokenPrecision,
            memo: config.memo,
          });

          await sendTransaction({
            rpcApi: config.rpcApi,
            privateKey: config.privateKey,
            transaction,
          });
          // Add delay between transactions if needed
          await new Promise((resolve) => setTimeout(resolve, 1000));
        } catch (error) {
          console.error(
            `Failed to process transaction for ${record.receiverName}:`,
            error
          );
        }
      }
    },
    error: (error) => {
      console.error("Error parsing CSV:", error);
    },
  });
}
