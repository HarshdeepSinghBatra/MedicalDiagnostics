  app.post('/submitClaim', async (req, res) => {
    try {
  
      const { policyId ,amount} = req.body
  
      const signer = web3.eth.accounts.privateKeyToAccount(
        "0x" + process.env.SIGNER_PRIVATE_KEY
      );
      // console.log(contract.methods)
      web3.eth.accounts.wallet.add(signer);
      const method_abi = contract.methods.submitClaim(policyId,amount).encodeABI(); // change method name and pass required args
      const tx = {
        from: signer.address,
        to: contract.options.address,
        data: method_abi,
        value: amount.toString(), // appropriate value if payable function
        gasPrice: '100000000000',
      };
  
  
      const gas_estimate = await web3.eth.estimateGas(tx);
      tx.gas = gas_estimate;
      const signedTx = await web3.eth.accounts.signTransaction(tx, signer.privateKey);
      console.log("Raw transaction data: " + ( signedTx).rawTransaction);
      
      // Sending the transaction to the network
      const receipt = await web3.eth
        .sendSignedTransaction(signedTx.rawTransaction)
        .once("transactionHash", (txhash) => {
          console.log(`Mining transaction ...`);
          console.log(`https://sepolia.etherscan.io/tx/${txhash}`);
        });
      // The transaction is now on chain!
      console.log(`Mined in block ${receipt.blockNumber}`);
  
      // get the emitted event values and send them as response
      await  contract.events.ClaimSubmitted({ fromBlock: receipt.blockNumber})
      .on('data', async (event) => {
        console.log('submit claim event:', event.returnValues);
        const txEventRV = Object.fromEntries(
          Object.entries(event.returnValues).map(([key, value]) => [key, typeof value === 'bigint' ? String(value) : value])
        );
        res.status(200).json({message: "Submission for Claim", rv: txEventRV, txHash: receipt.transactionHash})
      })
      
  
    } catch (err) {
      console.log(err)
      res.status(500).json({message: "Error: " + err.message})
    }
  })

  app.post('/approveClaim', async (req, res) => {
    try {
  
      const {policyId} = req.body
  
      const signer = web3.eth.accounts.privateKeyToAccount(
        "0x" + process.env.SIGNER_PRIVATE_KEY
      );
      // console.log(contract.methods)
      web3.eth.accounts.wallet.add(signer);
      const method_abi = contract.methods.approveClaim(policyId).encodeABI(); // change method name and pass required args
      const tx = {
        from: signer.address,
        to: contract.options.address,
        data: method_abi,
        value: '0', // appropriate value if payable function
        gasPrice: '100000000000',
      };
  
  
      const gas_estimate = await web3.eth.estimateGas(tx);
      tx.gas = gas_estimate;
      const signedTx = await web3.eth.accounts.signTransaction(tx, signer.privateKey);
      console.log("Raw transaction data: " + ( signedTx).rawTransaction);
      
      // Sending the transaction to the network
      const receipt = await web3.eth
        .sendSignedTransaction(signedTx.rawTransaction)
        .once("transactionHash", (txhash) => {
          console.log(`Mining transaction ...`);
          console.log(`https://sepolia.etherscan.io/tx/${txhash}`);
        });
      // The transaction is now on chain!
      console.log(`Mined in block ${receipt.blockNumber}`);
  
      // get the emitted event values and send them as response
      await  contract.events.ClaimApproved({ fromBlock: receipt.blockNumber})
      .on('data', async (event) => {
        console.log('claim approval:', event.returnValues);
        const txEventRV = Object.fromEntries(
          Object.entries(event.returnValues).map(([key, value]) => [key, typeof value === 'bigint' ? String(value) : value])
        );
        res.status(200).json({message: "Claim Approval", rv: txEventRV, txHash: receipt.transactionHash})
      })
      
  
    } catch (err) {
      console.log(err)
      res.status(500).json({message: "Error: " + err.message})
    }
  })

  
  app.post('/payClaim', async (req, res) => {
    try {
  
      const {policyId} = req.body
  
      const signer = web3.eth.accounts.privateKeyToAccount(
        "0x" + process.env.SIGNER_PRIVATE_KEY
      );
      // console.log(contract.methods)
      web3.eth.accounts.wallet.add(signer);
      const method_abi = contract.methods.payClaim(policyId).encodeABI(); // change method name and pass required args
      const tx = {
        from: signer.address,
        to: contract.options.address,
        data: method_abi,
        value: '0', // appropriate value if payable function
        gasPrice: '100000000000',
      };
  
  
      const gas_estimate = await web3.eth.estimateGas(tx);
      tx.gas = gas_estimate;
      const signedTx = await web3.eth.accounts.signTransaction(tx, signer.privateKey);
      console.log("Raw transaction data: " + ( signedTx).rawTransaction);
      
      // Sending the transaction to the network
      const receipt = await web3.eth
        .sendSignedTransaction(signedTx.rawTransaction)
        .once("transactionHash", (txhash) => {
          console.log(`Mining transaction ...`);
          console.log(`https://sepolia.etherscan.io/tx/${txhash}`);
        });
      // The transaction is now on chain!
      console.log(`Mined in block ${receipt.blockNumber}`);
  
      // get the emitted event values and send them as response
      await  contract.events.ClaimPaid({ fromBlock: receipt.blockNumber})
      .on('data', async (event) => {
        console.log('claim payment:', event.returnValues);
        const txEventRV = Object.fromEntries(
          Object.entries(event.returnValues).map(([key, value]) => [key, typeof value === 'bigint' ? String(value) : value])
        );
        res.status(200).json({message: "Claim Paid", rv: txEventRV, txHash: receipt.transactionHash})
      })
      
  
    } catch (err) {
      console.log(err)
      res.status(500).json({message: "Error: " + err.message})
    }
  })

  app.get('/getClaim', async (req, res) => {
    try {
  
      const { policyId } = req.body
  
      console.log("Initiating ")
      contract.methods.getClaim(web3.utils.toHex(policyId)).call() 
      .then(result => {
        console.log(result)
        const txEventRV = Object.fromEntries(
          Object.entries(result).map(([key, value]) => [key, typeof value === 'bigint' ? String(value) : value])
        );
        res.status(200).json({message: "Claim Details", rv: txEventRV})
      })
  
  
    } catch (err) {
      console.log(err)
      res.status(500).json({message: "Error: " + err.message})
    }
  })
