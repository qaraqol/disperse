export function createTokenTransaction({
  senderName,
  receiverName,
  contractName,
  amount,
  tokenName,
  tokenPrecision,
  memo,
}) {
  const formattedAmount = amount.toFixed(tokenPrecision);

  return {
    actions: [
      {
        account: contractName,
        name: "transfer",
        authorization: [
          {
            actor: senderName,
            permission: "active",
          },
        ],
        data: {
          from: senderName,
          to: receiverName,
          quantity: `${formattedAmount} ${tokenName}`,
          memo: memo,
        },
      },
    ],
  };
}
