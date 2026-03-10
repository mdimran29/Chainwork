const { Connection, PublicKey } = require('@solana/web3.js');

// Solana Devnet RPC endpoint
const DEVNET_RPC = 'https://api.devnet.solana.com';

// Replace this with the actual expected wallet public key
const EXPECTED_WALLET_ADDRESS = 'REPLACE_WITH_EXPECTED_PUBLIC_KEY';

// @desc    Verify a Solana Devnet transaction
// @route   POST /api/verify-tx
// @access  Public
const verifyTx = async (req, res) => {
  const { signature } = req.body;

  // Input validation
  if (!signature || typeof signature !== 'string' || signature.trim() === '') {
    return res.status(400).json({
      success: false,
      transactionFound: false,
      message: 'Missing or invalid "signature" field',
    });
  }

  try {
    const connection = new Connection(DEVNET_RPC, 'confirmed');

    // Fetch the transaction from Solana Devnet
    const transaction = await connection.getTransaction(signature.trim(), {
      commitment: 'confirmed',
      maxSupportedTransactionVersion: 0,
    });

    // Condition 1: Transaction must exist
    if (!transaction) {
      return res.status(404).json({
        success: false,
        transactionFound: false,
        status: 'not_found',
        walletMatched: false,
      });
    }

    // Condition 2: Transaction status must be successful (meta.err === null)
    const isSuccessful = transaction.meta !== null && transaction.meta.err === null;

    // Condition 3: Expected wallet address must be in the transaction account keys
    const accountKeys =
      transaction.transaction?.message?.accountKeys ||
      transaction.transaction?.message?.staticAccountKeys ||
      [];

    let walletMatched = false;
    try {
      const expectedPubkey = new PublicKey(EXPECTED_WALLET_ADDRESS);
      walletMatched = accountKeys.some(key => {
        const keyStr = typeof key.toBase58 === 'function' ? key.toBase58() : key.toString();
        return keyStr === expectedPubkey.toBase58();
      });
    } catch {
      // EXPECTED_WALLET_ADDRESS is still a placeholder — skip wallet check
      walletMatched = false;
    }

    // Transaction found but failed on-chain
    if (!isSuccessful) {
      return res.status(200).json({
        success: false,
        transactionFound: true,
        status: 'failed',
        walletMatched,
      });
    }

    // All conditions met — success
    return res.status(200).json({
      success: true,
      transactionFound: true,
      status: 'success',
      walletMatched,
    });

  } catch (error) {
    console.error('[verifyTx] Error:', error.message);
    return res.status(500).json({
      success: false,
      transactionFound: false,
      message: 'Internal server error while verifying transaction',
    });
  }
};

module.exports = { verifyTx };
