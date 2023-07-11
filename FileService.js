
require("dotenv").config();

 

const {
    ContractCreateTransaction,
    ContractFunctionParameters,
    ContractExecuteTransaction,
    AccountBalanceQuery,
    ContractCallQuery,
    TransferTransaction,
    ContractInfoQuery,
    ContractCreateFlow,
    Hbar,
    AccountCreateTransaction,
    FileAppendTransaction,
    FileCreateTransaction,
    FileUpdateTransaction,
    FileDeleteTransaction,
    FileInfoQuery,
    FileContentsQuery,


    Client, AccountId, PrivateKey

} = require("@hashgraph/sdk");

 
const fs=require('fs');

// Import required functions 

//const bytecode=fs.readFileSync("LookupContract1_sol_LookupContract.bin");

 

async function createByteCodeFileId() {
    //const fileCreateTx = await new FileCreateTransaction()

    const operatorId = AccountId.fromString(process.env.MY_ACCOUNT_ID);

const operatorKey = PrivateKey.fromString(process.env.MY_PRIVATE_KEY);

 

const client = Client.forTestnet().setOperator(operatorId, operatorKey);
console.log("0");

const newAccountPrivateKey = PrivateKey.generateED25519(); 
const newAccountPublicKey = newAccountPrivateKey.publicKey;
//Create a new account with 1,000 tinybar starting balance
const newAccount = await new AccountCreateTransaction()
    .setKey(newAccountPublicKey)
    .setInitialBalance(Hbar.fromTinybars(1000))
    .execute(client);

    console.log("1");
    const bytecode=fs.readFileSync("./FileService/SupplyChain/Ballot_sol_Ballot.bin");
    const fileCreateTx = await new FileCreateTransaction()
           // .setContents(bytecode)
        //Set the bytecode of the contract
        .setKeys([newAccountPublicKey])
         .freezeWith(client)
        .sign(newAccountPrivateKey);

 
        console.log("2");
    //Submit the file to the Hedera test network signing with the transaction fee payer key specified with the client
    const submitTx = await fileCreateTx.execute(client);

 

    //Get the receipt of the file create transaction
    const fileReceipt = await submitTx.getReceipt(client);

 

    //Get the file ID from the receipt
    const bytecodeFileId = fileReceipt.fileId;

  

    //Log the file ID
    console.log("The smart contract byte code file ID is " + bytecodeFileId)
    //Now Create file Append transaction
    const fileAppendTx = await new FileAppendTransaction()
        .setFileId(bytecodeFileId)
        .setContents(bytecode)
        .setMaxChunks(10000)
        // .setChunkSize(3000)
        .freezeWith(client)
        .sign(newAccountPrivateKey);

        

    const fileAppendSubmit = await fileAppendTx.execute(client);

    //console.log("3");

    const fileAppendRx = await fileAppendSubmit.getReceipt(client);
    const fileAppendStatus = fileAppendRx.status;

 
    console.log(`\n bytecode file Id :${bytecodeFileId}`);

 

    console.log(`\n File append status:${fileAppendStatus}`);

    console.log("4");
   // return(bytecodeFileId);

//}

//createByteCodeFileId();

// Function to deploy contract on hedera network and return contract Id

 

//async function createContractFactoryContractId(bytecodeFileId) {
    console.log("################### Calling createContractId function #######################################");
    // Instantiate the contract instance
    const contractTx = await new ContractCreateTransaction()
        //Set the file ID of the Hedera file storing the bytecode
        .setBytecodeFileId(bytecodeFileId)
        //Set the gas to instantiate the contract
        .setGas(300000)

        //.setConstructorParameters(new ContractFunctionParameters().addString());

 
       console.log("5");

    //Create the transaction
    const transaction = await new FileDeleteTransaction()
    .setFileId(bytecodeFileId)
    //.setContents("The new contents")
    .setMaxTransactionFee(new Hbar(2))
    .freezeWith(client);

    //Sign with the file private key
    const signTx = await transaction.sign(newAccountPrivateKey);

    //const getKey = transaction.getKey();

    //Sign with the client operator private key and submit to a Hedera network
    //const submitTx = await signTx.execute(client);

    //Request the receipt
    const receipt = await submitTx.getReceipt(client);

    //Get the transaction consensus status
    const transactionStatus = receipt.status;

    console.log("The transaction consensus status " +transactionStatus.toString());



    


   // console.log("The transaction consensus status " +transactionStatus3.toString());

   //Create the query
   const query = new FileInfoQuery()
   .setFileId(bytecodeFileId);

//Sign the query with the client operator private key and submit to a Hedera network
   const getInfo = await query.execute(client);

   console.log("File info response: " +getInfo);



   //Create the query
   const query1 = new FileContentsQuery()
   .setFileId(bytecodeFileId);

//Sign with client operator private key and submit the query to a Hedera network
   const contents = await query.execute(client);

   console.log(contents.toString());





    

    //Submit the transaction to the Hedera test network

    const contractResponse = await contractTx.execute(client);

 

    //Get the receipt of the file create transaction
    const contractReceipt = await contractResponse.getReceipt(client);

 

    //Get the smart contract ID
    const contractID = contractReceipt.contractId;

 

    //Log the smart contract ID
    console.log("The smart contract ID is " + contractID);

    //console.log("The Constructor Parameter function is ", ContractFunctionParameters());

    const contractAddress = contractID.toSolidityAddress();
 
    console.log("The smart ContractAddress is " + contractAddress);

}

// async function main() {
   // let contractId = await
     createByteCodeFileId();
    // let result1 = await createContractFactoryContractId();
//     console.log(`Recieved answer from function 1 is ${result1}`);
//     //let result2 = await createContractFactoryContractId();
//     //console.log(`Recieved answer from function 2 is ${result2}`);

 

//     process.exit();
// }

// main();

// Now we update and delete a file 
