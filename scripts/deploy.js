async function main() {
  const Pyrotoken = await ethers.getContractFactory('PyroToken');

  // Start deployment, returning a promise that resolves to a contract object
  const PyroToken = await Pyrotoken.deploy();
  console.log('Contract deployed to address:', PyroToken.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
