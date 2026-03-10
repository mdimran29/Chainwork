const { Connection, PublicKey } = require('@solana/web3.js');
const bs58 = require('bs58').default;

const DEVNET_RPC = 'https://api.devnet.solana.com';

// @desc    Verify a Solana Devnet transaction
// @route   POST /api/verify-tx
// @access  Public
const verifyTx = async (req, res) => {
  const { signature, wallet } = req.body;

  // --- Input validation ---
  if (!signature || typeof signature !== 'string' || signature.trim() === '') {
    return res.status(400).json({
      success: false,
      transactionFound: false,
      message: 'Missing or invalid "signature" field',
    });
  }

  if (!wallet || typeof wallet !== 'string' || wallet.trim() === '') {
    return res.status(400).json({
      success: false,
      transactionFound: false,
      message: 'Missing or invalid "wallet" field',
    });
  }

  // Validate wallet is a valid Solana public key
  let walletPubkey;
  try {
    walletPubkey = new PublicKey(wallet.trim());
  } catch {
    return res.status(400).json({
      success: false,
      transactionFound: false,
      message: 'Invalid wallet address',
    });
  }

  // Validate signature is a valid base58-encoded 64-byte value
  try {
    const decoded = bs58.decode(signature.trim());
    if (decoded.length !== 64) throw new Error('Wrong length');
  } catch {
    return res.status(400).json({
      success: false,
      transactionFound: false,
      message: 'Invalid transaction signature — must be a base58-encoded 64-byte value',
    });
  }

  try {
    const connection = new Connection(DEVNET_RPC, 'confirmed');

    // Fetch transaction from Solana Devnet
    const transaction = await connection.getTransaction(signature.trim(), {
      commitment: 'confirmed',
      maxSupportedTransactionVersion: 0,
    });

    // Transaction not found on-chain
    if (!transaction) {
      return res.status(404).json({
        success: false,
        transactionFound: false,
        message: 'Transaction not found on Solana Devnet',
      });
    }

    // Check transaction status
    const isSuccessful = transaction.meta && transaction.meta.err === null;

    // Check if the expected wallet appears in the transaction account keys
    const accountKeys =
      transaction.transaction?.message?.accountKeys ||
      transaction.transaction?.message?.staticAccountKeys ||
      [];

    const walletMatched = accountKeys.some(key => {
      const keyStr = typeof key.toBase58 === 'function' ? key.toBase58() : key.toString();
      return keyStr === walletPubkey.toBase58();
    });

    if (!isSuccessful) {
      return res.status(200).json({
        success: false,
        transactionFound: true,
        status: 'failed',
        walletMatched,
        message: 'Transaction was found but it failed on-chain',
      });
    }

    return res.status(200).json({
      success: true,
      transactionFound: true,
      status: 'success',
      walletMatched,
      signature: signature.trim(),
      slot: transaction.slot ?? null,
      blockTime: transaction.blockTime ?? null,
      message: 'Transaction verified successfully on Solana Devnet',
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
