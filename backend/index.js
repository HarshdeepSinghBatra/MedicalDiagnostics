require('dotenv').config({ path: require('find-config')('.env') })

const express = require('express')
const app = express()
const port = process.env.PORT || 9000

app.use(express.json())

const cors = require('cors')
app.use(cors())

const { web3, policyContract, medicalRecordsContract, claimsContract } = require('./web3')


app.post('/createPolicy', async (req, res) => {
  try {

    const { insuranceAddr, name, typeOfTreatment, premiumAmount, duration, maturityAmount } = req.body

    const signer = web3.eth.accounts.privateKeyToAccount(
      "0x" + process.env.SIGNER_PRIVATE_KEY
    );
    // console.log(contract.methods)
    web3.eth.accounts.wallet.add(signer);
    const method_abi = policyContract.methods.createPolicy(web3.utils.toHex(insuranceAddr), name, typeOfTreatment, premiumAmount, duration, maturityAmount).encodeABI(); // change method name and pass required args
    const tx = {
      from: signer.address,
      to: policyContract.options.address,
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
    await  policyContract.events.PolicyCreated({ fromBlock: receipt.blockNumber})
    .on('data', async (event) => {
      console.log('inside PolicyCreated event:', event.returnValues);
      const txEventRV = Object.fromEntries(
        Object.entries(event.returnValues).map(([key, value]) => [key, typeof value === 'bigint' ? String(value) : value])
      );
      res.status(200).json({message: "Policy created successfully", rv: txEventRV, txHash: receipt.transactionHash})
    })
    

  } catch (err) {
    console.log(err)
    res.status(500).json({message: "Error: " + err.message})
  }
})
app.post('/withdrawFunds', async (req, res) => {
  try {

    const signer = web3.eth.accounts.privateKeyToAccount(
      "0x" + process.env.SIGNER_PRIVATE_KEY
    );
    // console.log(policyContract.methods)
    web3.eth.accounts.wallet.add(signer);
    const method_abi = policyContract.methods.withdraw().encodeABI(); // change method name and pass required args
    const tx = {
      from: signer.address,
      to: policyContract.options.address,
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
    console.log(receipt)
    
    res.status(200).json({message: "Funds withdrawn successfully", txHash: receipt.transactionHash})


  } catch (err) {
    console.log(err)
    res.status(500).json({message: "Error: " + err.message})
  }
})

app.listen(port, () => {
  console.log(`Now listening on port ${port}`);
});


app.post('/cancelPolicy', async (req, res) => {
  try {

    const { policyId} = req.body

    const signer = web3.eth.accounts.privateKeyToAccount(
      "0x" + process.env.SIGNER_PRIVATE_KEY
    );
    // console.log(policyContract.methods)
    web3.eth.accounts.wallet.add(signer);
    const method_abi = policyContract.methods.cancelPolicy(policyId).encodeABI(); // change method name and pass required args
    const tx = {
      from: signer.address,
      to: policyContract.options.address,
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
        console.log("Mining transaction ...");
        console.log(`https://sepolia.etherscan.io/tx/${txhash}`);
      });
    // The transaction is now on chain!
    console.log(`Mined in block ${receipt.blockNumber}`);

    // get the emitted event values and send them as response
    
      res.status(200).json({message: policyId + " Discontinued successfully"});
    

  } catch (err) {
    console.log(err)
    res.status(500).json({message: "Error: " + err.message})
  }
})
app.get('/getPolicy', async (req, res) => {
  try {

    const { policyId } = req.body

    console.log("Initiating ")
    policyContract.methods.getPolicy(web3.utils.toHex(policyId)).call() 
    .then(result => {
      console.log(result)
      const txEventRV = Object.fromEntries(
        Object.entries(result).map(([key, value]) => [key, typeof value === 'bigint' ? String(value) : value])
      );
      res.status(200).json({message: "Policy Details", rv: txEventRV})
    })


  } catch (err) {
    console.log(err)
    res.status(500).json({message: "Error: " + err.message})
  }
})

app.post('/getUserPolicies', async (req, res) => {
  try {

    const { userAddr } = req.body

    const signer = web3.eth.accounts.privateKeyToAccount(
      "0x" + process.env.SIGNER_PRIVATE_KEY
    );
    // console.log(contract.methods)
    web3.eth.accounts.wallet.add(signer);
    const method_abi = policyContract.methods.getUserPolicies(userAddr).encodeABI(); // change method name and pass required args
    const tx = {
      from: signer.address,
      to: policyContract.options.address,
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
    // console.log(receipt)

    // get the emitted event values and send them as response
    await  policyContract.events.ReturnUserPolicies({ fromBlock: receipt.blockNumber})
    .on('data', async (event) => {
      console.log('inside PolicyCreated event:', event.returnValues)
      const data = event.returnValues.userPolicies.map(obj => {
        const rvObj = Object.fromEntries(
          Object.entries(obj).map(([key, value]) => [key, typeof value === 'bigint' ? String(value) : value])
        );
        return rvObj
      })

      // console.log('inside PolicyCreated event:', data);
      res.status(200).json({message: "User Policies", rv: data, txHash: receipt.transactionHash})
    })
    

  } catch (err) {
    console.log(err)
    res.status(500).json({message: "Error: " + err.message})
  }
})
app.post('/getInsurerPolicies', async (req, res) => {
  try {

    const { insurerAddr } = req.body

    const signer = web3.eth.accounts.privateKeyToAccount(
      "0x" + process.env.SIGNER_PRIVATE_KEY
    );
    // console.log(contract.methods)
    web3.eth.accounts.wallet.add(signer);
    const method_abi = policyContract.methods.getInsurerPolicies(insurerAddr).encodeABI(); // change method name and pass required args
    const tx = {
      from: signer.address,
      to: policyContract.options.address,
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
    // console.log(receipt)

    // get the emitted event values and send them as response
    await  policyContract.events.ReturnInsurerPolicies({ fromBlock: receipt.blockNumber})
    .on('data', async (event) => {
      console.log('inside PolicyCreated event:', event.returnValues)
      const data = event.returnValues.insurerPolicies.map(obj => {
        const rvObj = Object.fromEntries(
          Object.entries(obj).map(([key, value]) => [key, typeof value === 'bigint' ? String(value) : value])
        );
        return rvObj
      })

      // console.log('inside PolicyCreated event:', data);
      res.status(200).json({message: "Insurer Policies", rv: data, txHash: receipt.transactionHash})
    })
    

  } catch (err) {
    console.log(err)
    res.status(500).json({message: "Error: " + err.message})
  }
})

// Medical Records

app.post('/addPatientRecord', async (req, res) => {
  try {

    const { name, aadhaarNo, email, diagnosis, typeOfTreatment, medicalRecords, billAmount, patientAddr } = req.body

    const signer = web3.eth.accounts.privateKeyToAccount(
      "0x" + process.env.SIGNER_PRIVATE_KEY
    );
    // console.log(contract.methods)
    web3.eth.accounts.wallet.add(signer);
    const method_abi = medicalRecordsContract.methods.addPatientRecord(name, aadhaarNo, email, diagnosis, typeOfTreatment, medicalRecords, billAmount, patientAddr).encodeABI(); // change method name and pass required args
    const tx = {
      from: signer.address,
      to: medicalRecordsContract.options.address,
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
    await  medicalRecordsContract.events.RecordCreated({ fromBlock: receipt.blockNumber})
    .on('data', async (event) => {
      console.log('inside PolicyCreated event:', event.returnValues);
      const txEventRV = Object.fromEntries(
        Object.entries(event.returnValues).map(([key, value]) => [key, typeof value === 'bigint' ? String(value) : value])
      );
      res.status(200).json({message: "Inserted successfully", rv: txEventRV, txHash: receipt.transactionHash})
    })
    

  } catch (err) {
    console.log(err)
    res.status(500).json({message: "Error: " + err.message})
  }
})

app.post('/getPatientRecords', async (req, res) => {
  try {

    const { patientAddr } = req.body

    const signer = web3.eth.accounts.privateKeyToAccount(
      "0x" + process.env.SIGNER_PRIVATE_KEY
    );
    // console.log(contract.methods)
    web3.eth.accounts.wallet.add(signer);
    const method_abi = medicalRecordsContract.methods.getPatientRecords(patientAddr).encodeABI(); // change method name and pass required args
    const tx = {
      from: signer.address,
      to: medicalRecordsContract.options.address,
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
    // console.log(receipt)

    // get the emitted event values and send them as response
    await  medicalRecordsContract.events.ReturnPatientRecords({ fromBlock: receipt.blockNumber})
    .on('data', async (event) => {

      const data = event.returnValues.patientRecord.map(obj => {
        const rvObj = Object.fromEntries(
          Object.entries(obj).map(([key, value]) => [key, typeof value === 'bigint' ? String(value) : value])
        );
        return rvObj
      })

      console.log('inside PolicyCreated event:', data);
      res.status(200).json({message: "Patient records", rv: data, txHash: receipt.transactionHash})
    })
    

  } catch (err) {
    console.log(err)
    res.status(500).json({message: "Error: " + err.message})
  }
})
app.post('/getAllRecordsByHospital', async (req, res) => {
  try {

    // const { patientAddr } = req.body

    const signer = web3.eth.accounts.privateKeyToAccount(
      "0x" + process.env.SIGNER_PRIVATE_KEY
    );
    // console.log(contract.methods)
    web3.eth.accounts.wallet.add(signer);
    // console.log(signer.address)
    const method_abi = medicalRecordsContract.methods.getAllRecordsByHospital(signer.address).encodeABI(); // change method name and pass required args
    const tx = {
      from: signer.address,
      to: medicalRecordsContract.options.address,
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
    // console.log(receipt)

    // get the emitted event values and send them as response
    await  medicalRecordsContract.events.ReturnHospitalRecords({ fromBlock: receipt.blockNumber})
    .on('data', async (event) => {

      const data = event.returnValues.patientRecord.map(obj => {
        const rvObj = Object.fromEntries(
          Object.entries(obj).map(([key, value]) => [key, typeof value === 'bigint' ? String(value) : value])
        );
        return rvObj
      })

      console.log('inside PolicyCreated event:', data);
      res.status(200).json({message: "Patient records of Hospital", rv: data, txHash: receipt.transactionHash})
    })
    

  } catch (err) {
    console.log(err)
    res.status(500).json({message: "Error: " + err.message})
  }
})

// Claims

app.post('/submitClaim', async(req, res) => {
  try {

    const { insurerAddr, policyId, recordId, amount, typeOfTreatment } = req.body

    const signer = web3.eth.accounts.privateKeyToAccount(
      "0x" + process.env.SIGNER_PRIVATE_KEY
    );
    // console.log(contract.methods)
    web3.eth.accounts.wallet.add(signer);
    const method_abi = claimsContract.methods.submitClaim(web3.utils.toHex(insurerAddr), web3.utils.toHex(policyId), recordId, amount, typeOfTreatment).encodeABI(); // change method name and pass required args
    const tx = {
      from: signer.address,
      to: claimsContract.options.address,
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
    await  claimsContract.events.ClaimSubmitted({ fromBlock: receipt.blockNumber})
    .on('data', async (event) => {
      console.log('inside PolicyCreated event:', event.returnValues);
      const txEventRV = Object.fromEntries(
        Object.entries(event.returnValues).map(([key, value]) => [key, typeof value === 'bigint' ? String(value) : value])
      );
      res.status(200).json({message: "Claim submitted successfully", rv: txEventRV, txHash: receipt.transactionHash})
    })
    

  } catch (err) {
    console.log(err)
    res.status(500).json({message: "Error: " + err.message})
  }
})

app.post('/processClaim', async (req, res) => {
  try {

    const { claimId } = req.body

    const signer = web3.eth.accounts.privateKeyToAccount(
      "0x" + process.env.SIGNER_PRIVATE_KEY
    );
    // console.log(contract.methods)
    web3.eth.accounts.wallet.add(signer);
    const method_abi = claimsContract.methods.processClaim(web3.utils.toHex(claimId)).encodeABI(); // change method name and pass required args
    const tx = {
      from: signer.address,
      to: claimsContract.options.address,
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
    await  claimsContract.events.ClaimApproved({ fromBlock: receipt.blockNumber})
    .on('data', async (event) => {
      console.log('inside PolicyCreated event:', event.returnValues);
      const txEventRV = Object.fromEntries(
        Object.entries(event.returnValues).map(([key, value]) => [key, typeof value === 'bigint' ? String(value) : value])
      );
      res.status(200).json({message: "Claim approved successfully", rv: txEventRV, txHash: receipt.transactionHash})
    })
    

  } catch (err) {
    console.log(err)
    res.status(500).json({message: "Error: " + err.message})
  }
})

app.post('/payClaim', async (req, res) => {
  try {

    const { claimId } = req.body

    const signer = web3.eth.accounts.privateKeyToAccount(
      "0x" + process.env.SIGNER_PRIVATE_KEY
    );
    // console.log(contract.methods)
    web3.eth.accounts.wallet.add(signer);
    const method_abi = claimsContract.methods.payClaim(web3.utils.toHex(claimId)).encodeABI(); // change method name and pass required args
    const tx = {
      from: signer.address,
      to: claimsContract.options.address,
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
    await  claimsContract.events.ClaimPaid({ fromBlock: receipt.blockNumber})
    .on('data', async (event) => {
      console.log('inside PolicyCreated event:', event.returnValues);
      const txEventRV = Object.fromEntries(
        Object.entries(event.returnValues).map(([key, value]) => [key, typeof value === 'bigint' ? String(value) : value])
      );

      updateClaimStatus(parseInt(txEventRV.recordId))
      .then(() => {        
        res.status(200).json({message: "Claim paid successfully", rv: txEventRV, txHash: receipt.transactionHash})
      })

    })
    

  } catch (err) {
    console.log(err)
    res.status(500).json({message: "Error: " + err.message})
  }
})

const updateClaimStatus = async (recordId) => {
  try {

    const signer = web3.eth.accounts.privateKeyToAccount(
      "0x" + process.env.SIGNER_PRIVATE_KEY
    );
    // console.log(contract.methods)
    web3.eth.accounts.wallet.add(signer);
    const method_abi = medicalRecordsContract.methods.updateClaimStatus(recordId).encodeABI(); // change method name and pass required args
    const tx = {
      from: signer.address,
      to: medicalRecordsContract.options.address,
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

  } catch (err) {
    console.log(err)
    res.status(500).json({message: "Error: " + err.message})
  }
}


app.get("/getClaim", async (req, res) => {
  try {

    const { claimId } = req.body

    console.log("Initiating ")
    claimsContract.methods.getClaim(web3.utils.toHex(claimId)).call() 
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

app.post('/getUserClaims', async (req, res) => {
  try {

    const { userAddr } = req.body

    const signer = web3.eth.accounts.privateKeyToAccount(
      "0x" + process.env.SIGNER_PRIVATE_KEY
    );
    // console.log(contract.methods)
    web3.eth.accounts.wallet.add(signer);
    const method_abi = claimsContract.methods.getUserClaims(userAddr).encodeABI(); // change method name and pass required args
    const tx = {
      from: signer.address,
      to: claimsContract.options.address,
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
    // console.log(receipt)

    // get the emitted event values and send them as response
    await  claimsContract.events.ReturnUserClaims({ fromBlock: receipt.blockNumber})
    .on('data', async (event) => {
      console.log('inside PolicyCreated event:', event.returnValues)
      const data = event.returnValues.userClaims.map(obj => {
        const rvObj = Object.fromEntries(
          Object.entries(obj).map(([key, value]) => [key, typeof value === 'bigint' ? String(value) : value])
        );
        return rvObj
      })

      // console.log('inside PolicyCreated event:', data);
      res.status(200).json({message: "User Policies", rv: data, txHash: receipt.transactionHash})
    })
    

  } catch (err) {
    console.log(err)
    res.status(500).json({message: "Error: " + err.message})
  }
} )
app.post('/getInsurerClaims', async (req, res) => {
  try {

    const { insurerAddr } = req.body

    const signer = web3.eth.accounts.privateKeyToAccount(
      "0x" + process.env.SIGNER_PRIVATE_KEY
    );
    // console.log(contract.methods)
    web3.eth.accounts.wallet.add(signer);
    const method_abi = claimsContract.methods.getInsurerClaims(insurerAddr).encodeABI(); // change method name and pass required args
    const tx = {
      from: signer.address,
      to: claimsContract.options.address,
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
    // console.log(receipt)

    // get the emitted event values and send them as response
    await  claimsContract.events.ReturnInsurerClaims({ fromBlock: receipt.blockNumber})
    .on('data', async (event) => {
      console.log('inside PolicyCreated event:', event.returnValues)
      const data = event.returnValues.insurerClaims.map(obj => {
        const rvObj = Object.fromEntries(
          Object.entries(obj).map(([key, value]) => [key, typeof value === 'bigint' ? String(value) : value])
        );
        return rvObj
      })

      // console.log('inside PolicyCreated event:', data);
      res.status(200).json({message: "User Policies", rv: data, txHash: receipt.transactionHash})
    })
    

  } catch (err) {
    console.log(err)
    res.status(500).json({message: "Error: " + err.message})
  }
} )