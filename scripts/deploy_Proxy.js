const hre = require("hardhat");

async function main() {

    const fee = ethers.utils.parseEther("0.1");
    const address_from = "0xb223EACc07D4043A14B22b6a3BF9920EF4d3Db67";
    const address_to = "0x9cC16250e83ebEf01EC56cfBA9C440C3C3dC56f5";
    const address_token = "0x7af963cF6D228E564e2A0aA0DdBF06210B38615D";
    const tokenValue = "1000000000000000"
    const calldata = "0x23b872dd000000000000000000000000b223eacc07d4043a14b22b6a3bf9920ef4d3db670000000000000000000000009cc16250e83ebef01ec56cfba9c440c3c3dc56f500000000000000000000000000000000000000000000000000038d7ea4c68000";
    const  signature = "0x22a2db0161d36f69a7b28a1f9181fcb95ad72d5d819d51ac9a04d38990b19f1d43825d1aa3b7b92eed954a61ff5ed9935a5dbc0271db47dc2b8331aa151592fe1c";
  
  const Proxy_Contract = await hre.ethers.getContractFactory("Proxy");
  const Proxy = await Proxy_Contract.deploy();

  console.log("Proxy contract is deployed to:", Proxy.address);

  //await erc721.setWizardToken(ERC20.address);
  //const add = await erc721.wizardToken();
  //console.log(add);
 
  await Proxy.addToWhitelist(address_from);
  console.log("Added from_address to whitelist...");

  const verifySignature = await Proxy.forward(address_token, calldata, signature, {gasLimit: 3e7, value: 1000000000000000});
  console.log("Signature verified!.");
  console.log("Transferred from Account : ", address_from, " To : ", address_to);
  console.log("Transaction hash is : ", verifySignature.hash);


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});