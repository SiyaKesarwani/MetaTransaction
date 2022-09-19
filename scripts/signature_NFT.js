const Web3 = require('web3');
const url = "wss://goerli.infura.io/ws/v3/511de6a404d1471cb9763d54fcb43ca9";
const web3 = new Web3(url);

let fromAddr = "0xb223EACc07D4043A14B22b6a3BF9920EF4d3Db67"
let toAddr = "0x9cC16250e83ebEf01EC56cfBA9C440C3C3dC56f5"
let tokenValue = "1000000000000000"
let goerliETHTokenAddress = "0x7af963cF6D228E564e2A0aA0DdBF06210B38615D"
let signerPrivateKey = "441059994e6154414289ea4d251962bfd652922cfee6ea3ee8d4db7137e4a023"

let calldata = ""

// get the function signature by hashing it and retrieving the first 4 bytes
let fnSignature = web3.utils.keccak256("transferFrom(address,address,uint256)").substr(0,10)

// encode the function parameters and add them to the call data
let fnParams = web3.eth.abi.encodeParameters(
  ["address","address","uint256"],
  [fromAddr,toAddr,tokenValue]
)

calldata = fnSignature + fnParams.substr(2)

console.log("Call data :", calldata)

// pack the GoerliETH Token address and our "transferFrom()" calldata together and sign them.
const sign = async() => {
    let rawData = web3.eth.abi.encodeParameters(
        ['address','bytes'],
        [goerliETHTokenAddress,calldata]
      );
      // hash the data.
      let hash = web3.utils.soliditySha3(rawData);
      // sign the hash.
      let sigObj = await web3.eth.accounts.sign(hash, signerPrivateKey);

      console.log("Signature :", sigObj.signature)
      console.log("MessageHash : ", sigObj.messageHash)
};

sign();
