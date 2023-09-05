const Web3 = require('web3'); // creating an instance of web3 package
const solc = require('solc');
const fs = require('fs');
async function web3Solc(){
    web3 = new Web3('http://127.0.0.1:8545')
    nodeInfo = await web3.eth.getNodeInfo();
    console.log(nodeInfo);
    let accounts = await web3.eth.getAccounts();
    console.log("accounts are", accounts);
    let balance = await web3.eth.getBalance(accounts[0]);
    console.log("balance is ", balance);
    let baleth = web3.utils.fromWei(balance);
    console.log(baleth);
   
    Contract_File = 'contracts/Cert.sol';
    let content = fs.readFileSync(Contract_File).toString(); // to read data from solidity file
    //console.log(content);
//to give input in JSON format


input = {
    language : 'Solidity',
    sources:{
      [Contract_File]:{
        content:content
      }  
    },
    settings:{
        outputSelection : {
        '*':{
            '*':['*']
        }
        }
    }
}
let compileOutput = solc.compile(JSON.stringify(input));
//console.log(compileOutput);



let output = JSON.parse(compileOutput);
console.log(output);
let abi = output.contracts['contracts/Cert.sol'].Cert.abi;
//console.log(abi);
MyContract = new web3.eth.Contract(abi); // contract object to deploy bytecode to blockchain
let bytecode = output.contracts['contracts/Cert.sol'].Cert.evm.bytecode.object;
console.log(bytecode);

let gasNeed = await MyContract.deploy({data:'0x'+bytecode}).estimateGas();
console.log("gas required is ",gasNeed);
let data = await MyContract.deploy({data:'0x'+bytecode}).send({from:accounts[0], gasLimit: 800000});
//console.log(data);
let address = data.options.address;
console.log(address);
ContractObj = new web3.eth.Contract(abi,address);
let data1 = await ContractObj.methods.issue("123","CED","An","A","14/03/2022").send({from:accounts[0],gasLimit:320000});
console.log(data1);
let dataItem = await ContractObj.methods.Certificates("123").call();
console.log(dataItem);
}
web3Solc();