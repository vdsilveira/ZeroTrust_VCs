import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("VerifiableCredentialIssuerModule", (m) => {
  const VerifiableCredentialIssuer = m.contract("VerifiableCredentialIssuer");

  return { VerifiableCredentialIssuer };
});
