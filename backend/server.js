const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const bitcoin = require("bitcoinjs-lib");
const bip39 = require("bip39");
const axios = require("axios");
const bip32 = require("bip32");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;
const TESTNET = bitcoin.networks.testnet;

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Bitcoin Wallet Backend is Running...");
});

app.post("/create-wallet", async (req,res) => {
	try {
		//Generate a mnemonic (12 word phrase) 
	    const mnemonic = bip39.generateMnemonic();

		//Convert the mneonic into a seed
	    const seed = await bip39.mnemonicToSeed(mnemonic);

		// Create a BIP32 root key from the seed
            const root = bip32.fromSeed(seed, TESTNET);

                // Derive a child key for an address (first address in the HD wallet)
            const keyPair = root.derivePath("m/44'/1'/0'/0/0");

               // Generate the public Bitcoin address
           const { address } = bitcoin.payments.p2pkh({
                pubkey: keyPair.publicKey,
                network: TESTNET,
            });

         res.json({
		 mnemonic,
		 address, 
		 privateKey : keyPair.toWIF(),
         })
 }

	catch(error){
		console.error("Error creating wallet :", error.message);  //Log the actual error 
		res.status(500).json({ error : "Error creating wallet"});
	}
});

app.get("/balance/:address/utxo", async (req,res) => {
	const { address } = req.params;

	try{
		//mempool.space API URL for testnet address balance 
		const url = `http://mempool.space/testnet/api/address/${address}/utxo`;

		//Make GET request to fetch UTXOs
		const response = await axios.get(url);

		//Calculate balance from UTXOs
		const balance = response.data.reduce((acc,utxo) => acc + utxo.value,0)/100000000; //Convert satoshis to BTC 
		
		//rETURN THE balance in BTC 
		res.json({
			address, 
			balance : balance,
		});

	}   catch (error) {
		console.error(error);
		res.status(500).json({error : "Error fetching balance from mempool.space"});

          }

  });


app.post("/send/:address/utxo", async (req, res) => {
  const { recipient, amount } = req.body; // Get recipient and amount in BTC

  try {
    // Your testnet wallet details (Load from .env for security)
    const senderAddress = process.env.TESTNET_ADDRESS;
    const privateKeyWIF = process.env.PRIVATE_KEY; // Private Key in Wallet Import Format (WIF)

    if (!senderAddress || !privateKeyWIF) {
      return res.status(500).json({ error: "Wallet details are missing." });
    }

    // Fetch UTXOs for the sender address
    const utxoUrl = `http://mempool.space/testnet/api/address/${senderAddress}/utxo`;
    const utxoResponse = await axios.get(utxoUrl);
    const utxos = utxoResponse.data;

    if (utxos.length === 0) {
      return res.status(400).json({ error: "No UTXOs available to send Bitcoin." });
    }

    // Convert amount to satoshis (1 BTC = 100,000,000 satoshis)
    const amountToSend = Math.floor(amount * 100000000);
    const fee = 1000; // Set a reasonable fee in satoshis (can be adjusted dynamically)

    // Create a Bitcoin transaction builder
    const keyPair = bitcoin.ECPair.fromWIF(privateKeyWIF, TESTNET);
    const psbt = new bitcoin.Psbt({ network: TESTNET });

    let inputAmount = 0;

    // Add UTXOs as inputs
    utxos.forEach((utxo) => {
      if (inputAmount < amountToSend + fee) {
        psbt.addInput({
          hash: utxo.txid,
          index: utxo.vout,
          witnessUtxo: {
            script: Buffer.from(utxo.scriptPubKey, "hex"),
            value: utxo.value,
          },
        });
        inputAmount += utxo.value;
      }
    });

    if (inputAmount < amountToSend + fee) {
      return res.status(400).json({ error: "Insufficient funds." });
    }

    // Add recipient output
    psbt.addOutput({
      address: recipient,
      value: amountToSend,
    });

    // Add change output if needed
    const change = inputAmount - (amountToSend + fee);
    if (change > 0) {
      psbt.addOutput({
        address: senderAddress,
        value: change,
      });
    }

    // Sign the transaction
    utxos.forEach((_, index) => {
      psbt.signInput(index, keyPair);
    });

    psbt.finalizeAllInputs();

    // Get the raw transaction hex
    const rawTx = psbt.extractTransaction().toHex();

    // Broadcast the transaction
    const broadcastUrl = `http://mempool.space/testnet/api/tx`;
    const broadcastResponse = await axios.post(broadcastUrl, rawTx, {
      headers: { "Content-Type": "text/plain" },
    });

    // Return transaction ID
    res.json({ txid: broadcastResponse.data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error sending Bitcoin" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

