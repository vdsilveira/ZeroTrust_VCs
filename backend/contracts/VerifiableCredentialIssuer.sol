// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract VerifiableCredentialIssuer {
    address public owner;

    // Estrutura simples da credencial
    struct Credential {
        address subject;     // Para quem é a credencial
        string data;         // Dados da credencial (ex: JSON, IPFS hash, etc)
        uint256 issuedAt;    // Timestamp de emissão
        bool revoked;        // Se a credencial foi revogada
    }

    // Mapping: credentialId => Credential
    mapping(bytes32 => Credential) public credentials;
    // Mapping: subject => array of credentialIds
    mapping(address => bytes32[]) public subjectCredentials;

    // Eventos
    event CredentialIssued(bytes32 indexed credentialId, address indexed subject, string data);
    event CredentialRevoked(bytes32 indexed credentialId);

    modifier onlyOwner() {
        require(msg.sender == owner, "Somente o emissor pode executar");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // Emitir uma credencial
    function issueCredential(address subject, string calldata data) external onlyOwner returns (bytes32) {
        // Gera um ID único da credencial
        bytes32 credentialId = keccak256(abi.encodePacked(subject, data, block.timestamp));

        // Salva a credencial
        credentials[credentialId] = Credential({
            subject: subject,
            data: data,
            issuedAt: block.timestamp,
            revoked: false
        });
        // Adiciona o ID da credencial ao sujeito
        subjectCredentials[subject].push(credentialId);

        emit CredentialIssued(credentialId, subject, data);
        return credentialId;
    }

    // Revogar uma credencial
    function revokeCredential(bytes32 credentialId) external onlyOwner {
        require(credentials[credentialId].issuedAt != 0, "Credencial nao existe");
        require(!credentials[credentialId].revoked, "Credencial ja revogada");

        credentials[credentialId].revoked = true;
        emit CredentialRevoked(credentialId);
    }

    // Verificar se a credencial é válida
    function isCredentialValid(bytes32 credentialId) external view returns (bool) {
        Credential memory cred = credentials[credentialId];
        return (cred.issuedAt != 0 && !cred.revoked);
    }

    // Recuperar dados da credencial
    function getCredential(bytes32 credentialId) external view returns (address subject, string memory data, uint256 issuedAt, bool revoked) {
        Credential memory cred = credentials[credentialId];
        require(cred.issuedAt != 0, "Credencial nao existe");
        return (cred.subject, cred.data, cred.issuedAt, cred.revoked);
    }
    // Recuperar todas as credenciais de um sujeito
    function getSubjectCredentials(address subject) external view returns (bytes32[] memory) {
        return subjectCredentials[subject];
    }
}
