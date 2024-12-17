import { parse } from "papaparse";
import { sendTransaction } from "./transaction-sender.js";
import { createLogger } from "./logger.js";

export async function processTransactionsFromCSV(filePath, config) {
  const logger = createLogger("transfers.log");
  const fileContent = await Bun.file(filePath).text();

  parse(fileContent, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    complete: async (results) => {
      const records = results.data;
      const batchSize = 15;

      logger.log(
        `Starting to process ${records.length} transfers in batches of ${batchSize}`
      );

      // Split records into batches
      for (let i = 0; i < records.length; i += batchSize) {
        const batch = records.slice(i, i + batchSize);
        const batchNumber = Math.floor(i / batchSize) + 1;
        logger.log(
          `Processing batch ${batchNumber} of ${Math.ceil(
            records.length / batchSize
          )}`
        );

        // Create batch transaction
        const actions = batch.map((record) => ({
          account: config.contractName,
          name: "transfer",
          authorization: [
            {
              actor: config.senderName,
              permission: "active",
            },
          ],
          data: {
            from: config.senderName,
            to: record.receiverName,
            quantity: `${record.amount.toFixed(config.tokenPrecision)} ${
              config.tokenName
            }`,
            memo: config.memo,
          },
        }));

        const transaction = { actions };

        try {
          const result = await sendTransaction({
            rpcApi: config.rpcApi,
            privateKey: config.privateKey,
            transaction,
          });

          logger.log(
            `Successfully processed batch ${batchNumber}. Transaction ID: ${result.transaction_id}`
          );
          batch.forEach((record) => {
            logger.log(
              `Transferred ${record.amount.toFixed(config.tokenPrecision)} ${
                config.tokenName
              } to ${record.receiverName}`
            );
          });

          // Add delay between batches
          if (i + batchSize < records.length) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }
        } catch (error) {
          logger.error(`Failed to process batch ${batchNumber}`, error);
          batch.forEach((record) => {
            logger.log(`Failed transfer to ${record.receiverName}`);
          });
        }
      }

      logger.log("Finished processing all transfers");
    },
    error: (error) => {
      logger.error("Error parsing CSV", error);
    },
  });
}
