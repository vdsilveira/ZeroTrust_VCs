import { JsonRpcProvider } from "ethers";

const provider = new JsonRpcProvider("http://localhost:8545");

(async () => {
  const network = await provider.getNetwork();
  console.log("Chain ID:", network.chainId); // deve mostrar 31337
})();
