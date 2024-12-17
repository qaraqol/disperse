import { Api, JsonRpc } from "eosjs";
const { JsSignatureProvider } = require("eosjs/dist/eosjs-jssig");
export async function sendTransaction({ rpcApi, privateKey, transaction }) {
  const rpc = new JsonRpc(rpcApi, { fetch });
  const signatureProvider = new JsSignatureProvider([privateKey]);
  const api = new Api({
    rpc,
    signatureProvider,
    textDecoder: new TextDecoder(),
    textEncoder: new TextEncoder(),
  });

  try {
    const result = await api.transact(transaction, {
      blocksBehind: 3,
      expireSeconds: 30,
    });
    const amount = transaction.actions[0].data.quantity;
    const toAccount = transaction.actions[0].data.to;
    const fromAccount = transaction.actions[0].data.from;
    const transactionId = result.transaction_id;
    console.log(
      `Successfully sent ${amount} to ${toAccount} from ${fromAccount}. Trx ID: ${transactionId}`
    );
    return result;
  } catch (error) {
    console.error("Transaction Error:", error);
    throw error;
  }
}
