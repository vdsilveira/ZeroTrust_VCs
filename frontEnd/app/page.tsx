"use client"

import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Cloud,
  Shield,
  Key,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Wallet,
  LogOut,
  Settings,
  Users,
  RefreshCw,
  Edit,
} from "lucide-react"

// Configurações do contrato
let CONTRACT_ADDRESS = "0xEe68E3f3aDD99A1B40f5c3d6038A4077Dd88C99f" // Substitua pelo endereço real
// const PRIVATE_KEY = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
const JSON_RPC_URL = "https://ethereum-sepolia.publicnode.com"

const CONTRACT_ABI = [
  "function issueCredential(address subject, string calldata data) external returns (bytes32)",
  "function revokeCredential(bytes32 credentialId) external",
  "function isCredentialValid(bytes32 credentialId) external view returns (bool)",
  "function getCredential(bytes32 credentialId) external view returns (address subject, string memory data, uint256 issuedAt, bool revoked)",
  "function getSubjectCredentials(address subject) external view returns (bytes32[] memory)",
  "function owner() external view returns (address)",
  "event CredentialIssued(bytes32 indexed credentialId, address indexed subject, string data)",
  "event CredentialRevoked(bytes32 indexed credentialId)",
]

interface Credential {
  id: string
  subject: string
  data: string
  issuedAt: number
  revoked: boolean
  provider?: string
  accessLevel?: string
}

const CLOUD_PROVIDERS = [
  { value: "aws", label: "Amazon Web Services", icon: "☁️" },
  { value: "oracle", label: "Oracle Cloud", icon: "🔶" },
  { value: "google", label: "Google Cloud Platform", icon: "🌐" },
]

const ACCESS_LEVELS = [
  { value: "read", label: "Somente Leitura" },
  { value: "write", label: "Leitura e Escrita" },
  { value: "admin", label: "Administrador" },
]

export default function VerifiableCredentialsApp() {
  const [provider, setProvider] = useState<ethers.JsonRpcProvider | null>(null)
  const [contract, setContract] = useState<ethers.Contract | null>(null)
  const [wallet, setWallet] = useState<ethers.Wallet | null>(null)
  const [contractOwner, setContractOwner] = useState("")
  const [userAddress, setUserAddress] = useState("")
  const [currentContractAddress, setCurrentContractAddress] = useState(CONTRACT_ADDRESS)

  // Estados para emissão
  const [subjectAddress, setSubjectAddress] = useState("")
  const [selectedProvider, setSelectedProvider] = useState("")
  const [selectedAccessLevel, setSelectedAccessLevel] = useState("")
  const [issueResult, setIssueResult] = useState("")
  const [isIssuing, setIsIssuing] = useState(false)

  // Estados para verificação
  const [checkAddress, setCheckAddress] = useState("")
  const [userCredentials, setUserCredentials] = useState<Credential[]>([])
  const [isChecking, setIsChecking] = useState(false)

  // Estados para revogação
  const [revokeCredentialId, setRevokeCredentialId] = useState("")
  const [revokeResult, setRevokeResult] = useState("")
  const [isRevoking, setIsRevoking] = useState(false)

  const [selectedCloudProvider, setSelectedCloudProvider] = useState("")
  const [accessCredentialId, setAccessCredentialId] = useState("")
  const [accessResult, setAccessResult] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)

  // Estados para MetaMask
  const [isMetaMaskConnected, setIsMetaMaskConnected] = useState(false)
  const [connectedAddress, setConnectedAddress] = useState("")
  const [isConnecting, setIsConnecting] = useState(false)
  const [isOwnerConnected, setIsOwnerConnected] = useState(false)

  // Estados para mudança de contrato
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newContractAddress, setNewContractAddress] = useState("")
  const [isUpdatingContract, setIsUpdatingContract] = useState(false)
  const [contractUpdateResult, setContractUpdateResult] = useState("")

  useEffect(() => {
    initializeContract()
    checkMetaMaskConnection()

    // Listener para mudanças de conta
    if (typeof window.ethereum !== "undefined") {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length > 0) {
          setConnectedAddress(accounts[0])
          setCheckAddress(accounts[0])
          setIsMetaMaskConnected(true)
          checkIfOwner(accounts[0])
        } else {
          disconnectMetaMask()
        }
      })
    }

    return () => {
      if (typeof window.ethereum !== "undefined") {
        window.ethereum.removeAllListeners("accountsChanged")
      }
    }
  }, [])

  const initializeContract = async (contractAddr?: string) => {
    try {
      const addressToUse = contractAddr || currentContractAddress
      const ethersProvider = new ethers.JsonRpcProvider(JSON_RPC_URL)
      const ethersContract = new ethers.Contract(addressToUse, CONTRACT_ABI, ethersProvider)

      setProvider(ethersProvider)
      setContract(ethersContract)

      // Buscar o owner do contrato
      const owner = await ethersContract.owner()
      setContractOwner(owner)

      // Atualizar o endereço atual se foi passado um novo
      if (contractAddr) {
        setCurrentContractAddress(contractAddr)
        CONTRACT_ADDRESS = contractAddr // Atualizar a variável global também
      }
    } catch (error) {
      console.error("Erro ao inicializar contrato:", error)
      throw error
    }
  }

  const updateContractAddress = async () => {
    if (!newContractAddress) {
      setContractUpdateResult("❌ Por favor, insira um endereço válido")
      return
    }

    // Validar se é um endereço Ethereum válido
    if (!ethers.isAddress(newContractAddress)) {
      setContractUpdateResult("❌ Endereço inválido. Use o formato 0x...")
      return
    }

    setIsUpdatingContract(true)
    setContractUpdateResult("")

    try {
      // Tentar inicializar com o novo endereço
      await initializeContract(newContractAddress)

      setContractUpdateResult("✅ Contrato atualizado com sucesso!")

      // Limpar estados relacionados ao contrato anterior
      setUserCredentials([])
      setIsOwnerConnected(false)

      // Verificar se o usuário conectado é owner do novo contrato
      if (connectedAddress) {
        checkIfOwner(connectedAddress)
      }

      // Fechar o dialog após sucesso
      setTimeout(() => {
        setIsDialogOpen(false)
        setNewContractAddress("")
        setContractUpdateResult("")
      }, 2000)
    } catch (error: any) {
      setContractUpdateResult(`❌ Erro ao conectar com o contrato: ${error.message}`)
    } finally {
      setIsUpdatingContract(false)
    }
  }

  const checkIfOwner = (address: string) => {
    if (contractOwner && address) {
      setIsOwnerConnected(contractOwner.toLowerCase() === address.toLowerCase())
    }
  }

  const connectMetaMask = async () => {
    if (typeof window.ethereum === "undefined") {
      alert("MetaMask não está instalado! Por favor, instale a extensão MetaMask.")
      return
    }

    setIsConnecting(true)
    try {
      // Primeiro, limpar qualquer conexão anterior
      setIsMetaMaskConnected(false)
      setConnectedAddress("")
      setIsOwnerConnected(false)

      // Solicitar nova conexão (isso abrirá o popup do MetaMask)
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      })

      if (accounts.length > 0) {
        const newAddress = accounts[0]
        setConnectedAddress(newAddress)
        setIsMetaMaskConnected(true)
        setCheckAddress(newAddress)

        // Aguardar um pouco para garantir que o contractOwner foi carregado
        setTimeout(() => {
          checkIfOwner(newAddress)
        }, 500)
      }
    } catch (error: any) {
      console.error("Erro ao conectar MetaMask:", error)
      if (error.code === 4001) {
        alert("Conexão rejeitada pelo usuário.")
      } else {
        alert("Erro ao conectar com MetaMask: " + error.message)
      }
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectMetaMask = async () => {
    try {
      // Limpar todos os estados locais
      setIsMetaMaskConnected(false)
      setConnectedAddress("")
      setCheckAddress("")
      setUserCredentials([])
      setIsOwnerConnected(false)

      // Limpar resultados de operações
      setIssueResult("")
      setRevokeResult("")
      setAccessResult("")

      // Limpar formulários
      setSubjectAddress("")
      setSelectedProvider("")
      setSelectedAccessLevel("")
      setRevokeCredentialId("")
      setSelectedCloudProvider("")
      setAccessCredentialId("")

      // Forçar atualização da página para garantir limpeza completa
      window.location.reload()
    } catch (error) {
      console.error("Erro ao desconectar:", error)
      // Mesmo com erro, limpar estados locais
      setIsMetaMaskConnected(false)
      setConnectedAddress("")
      setCheckAddress("")
      setUserCredentials([])
      setIsOwnerConnected(false)
    }
  }

  const checkMetaMaskConnection = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" })
        if (accounts.length > 0) {
          setConnectedAddress(accounts[0])
          setIsMetaMaskConnected(true)
          setCheckAddress(accounts[0])
          checkIfOwner(accounts[0])
        }
      } catch (error) {
        console.error("Erro ao verificar conexão MetaMask:", error)
      }
    }
  }

  const issueCredential = async () => {
    if (!contract || !subjectAddress || !selectedProvider || !selectedAccessLevel) return

    if (!isOwnerConnected) {
      setIssueResult("❌ Apenas o owner do contrato pode emitir credenciais")
      return
    }

    setIsIssuing(true)
    setIssueResult("")

    try {
      // Usar o provider do MetaMask para assinar a transação
      const metaMaskProvider = new ethers.BrowserProvider(window.ethereum)
      const signer = await metaMaskProvider.getSigner()
      const contractWithSigner = new ethers.Contract(currentContractAddress, CONTRACT_ABI, signer)

      const credentialData = JSON.stringify({
        provider: selectedProvider,
        accessLevel: selectedAccessLevel,
        issuedBy: connectedAddress,
        timestamp: Date.now(),
      })

      const tx = await contractWithSigner.issueCredential(subjectAddress, credentialData)
      const receipt = await tx.wait()

      // Buscar o evento CredentialIssued
      const event = receipt.logs.find((log: any) => {
        try {
          const parsed = contractWithSigner.interface.parseLog(log)
          return parsed?.name === "CredentialIssued"
        } catch {
          return false
        }
      })

      if (event) {
        const parsed = contractWithSigner.interface.parseLog(event)
        const credentialId = parsed?.args.credentialId
        setIssueResult(`✅ Credencial emitida com sucesso! ID: ${credentialId}`)
      } else {
        setIssueResult("✅ Credencial emitida com sucesso!")
      }

      // Limpar formulário
      setSubjectAddress("")
      setSelectedProvider("")
      setSelectedAccessLevel("")
    } catch (error: any) {
      setIssueResult(`❌ Erro ao emitir credencial: ${error.message}`)
    } finally {
      setIsIssuing(false)
    }
  }

  const checkUserCredentials = async () => {
    if (!contract || !checkAddress) return

    setIsChecking(true)
    setUserCredentials([])

    try {
      const credentialIds = await contract.getSubjectCredentials(checkAddress)
      const credentials: Credential[] = []

      for (const id of credentialIds) {
        try {
          const [subject, data, issuedAt, revoked] = await contract.getCredential(id)
          const parsedData = JSON.parse(data)

          credentials.push({
            id,
            subject,
            data,
            issuedAt: Number(issuedAt),
            revoked,
            provider: parsedData.provider,
            accessLevel: parsedData.accessLevel,
          })
        } catch (error) {
          console.error("Erro ao buscar credencial:", error)
        }
      }

      setUserCredentials(credentials)
    } catch (error: any) {
      console.error("Erro ao verificar credenciais:", error)
    } finally {
      setIsChecking(false)
    }
  }

  const revokeCredential = async () => {
    if (!contract || !revokeCredentialId) return

    if (!isOwnerConnected) {
      setRevokeResult("❌ Apenas o owner do contrato pode revogar credenciais")
      return
    }

    setIsRevoking(true)
    setRevokeResult("")

    try {
      // Usar o provider do MetaMask para assinar a transação
      const metaMaskProvider = new ethers.BrowserProvider(window.ethereum)
      const signer = await metaMaskProvider.getSigner()
      const contractWithSigner = new ethers.Contract(currentContractAddress, CONTRACT_ABI, signer)

      const tx = await contractWithSigner.revokeCredential(revokeCredentialId)
      await tx.wait()
      setRevokeResult("✅ Credencial revogada com sucesso!")
      setRevokeCredentialId("")
    } catch (error: any) {
      setRevokeResult(`❌ Erro ao revogar credencial: ${error.message}`)
    } finally {
      setIsRevoking(false)
    }
  }

  const getProviderInfo = (provider: string) => {
    return CLOUD_PROVIDERS.find((p) => p.value === provider) || { value: provider, label: provider, icon: "☁️" }
  }

  const getAccessLevelInfo = (level: string) => {
    return ACCESS_LEVELS.find((l) => l.value === level) || { value: level, label: level }
  }

  const verifyAndAccess = async () => {
    if (!contract || !selectedCloudProvider || !accessCredentialId) return

    if (!isMetaMaskConnected) {
      setAccessResult("❌ Conecte sua carteira MetaMask para acessar")
      return
    }

    setIsVerifying(true)
    setAccessResult("")

    try {
      // Verificar se a credencial é válida
      const isValid = await contract.isCredentialValid(accessCredentialId)

      if (!isValid) {
        setAccessResult("❌ Credencial inválida ou revogada")
        setIsVerifying(false)
        return
      }

      // Buscar os dados da credencial
      const [subject, data, issuedAt, revoked] = await contract.getCredential(accessCredentialId)

      if (revoked) {
        setAccessResult("❌ Credencial foi revogada")
        setIsVerifying(false)
        return
      }

      // Verificar se a credencial pertence ao usuário logado
      if (subject.toLowerCase() !== connectedAddress.toLowerCase()) {
        setAccessResult("❌ Esta credencial não pertence à sua carteira")
        setIsVerifying(false)
        return
      }

      // Verificar se a credencial corresponde ao provedor selecionado
      const parsedData = JSON.parse(data)

      if (parsedData.provider !== selectedCloudProvider) {
        setAccessResult(`❌ Esta credencial não é válida para ${getProviderInfo(selectedCloudProvider).label}`)
        setIsVerifying(false)
        return
      }

      // Credencial válida - redirecionar para a página do provedor
      setAccessResult(`✅ Credencial válida! Redirecionando para ${getProviderInfo(selectedCloudProvider).label}...`)

      setTimeout(() => {
        window.open(
          `/${selectedCloudProvider}-dashboard?credential=${accessCredentialId}&access=${parsedData.accessLevel}&user=${connectedAddress}`,
          "_blank",
        )
      }, 1500)
    } catch (error: any) {
      setAccessResult(`❌ Erro ao verificar credencial: ${error.message}`)
    } finally {
      setIsVerifying(false)
    }
  }

  useEffect(() => {
    if (isMetaMaskConnected && connectedAddress && contract) {
      checkUserCredentials()
    }
  }, [isMetaMaskConnected, connectedAddress, contract])

  useEffect(() => {
    if (contractOwner && connectedAddress) {
      checkIfOwner(connectedAddress)
    }
  }, [contractOwner, connectedAddress])

  const switchAccount = async () => {
    if (typeof window.ethereum === "undefined") {
      alert("MetaMask não está instalado!")
      return
    }

    try {
      // Solicitar ao usuário para selecionar uma conta diferente
      await window.ethereum.request({
        method: "wallet_requestPermissions",
        params: [{ eth_accounts: {} }],
      })

      // Após a permissão, reconectar
      await connectMetaMask()
    } catch (error: any) {
      console.error("Erro ao trocar conta:", error)
      if (error.code !== 4001) {
        // 4001 = usuário rejeitou
        alert("Erro ao trocar conta: " + error.message)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
            <Shield className="h-8 w-8 text-blue-600" />
            ZeroTrust Cloud Access
          </h1>
          <p className="text-gray-600">Sistema de acesso Zero Trust para provedores de nuvem baseado em blockchain</p>
          <div className="mt-4 flex items-center justify-center gap-4 text-sm flex-wrap">
            <span className="text-gray-500">Rede: Ethereum Sepolia</span>
            <span className="text-gray-500">
              Owner: {contractOwner.slice(0, 6)}...{contractOwner.slice(-4)}
            </span>

            {isMetaMaskConnected ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full">
                  <Wallet className="h-4 w-4" />
                  <span className="font-medium">
                    {connectedAddress.slice(0, 6)}...{connectedAddress.slice(-4)}
                  </span>
                  {isOwnerConnected && (
                    <Badge variant="secondary" className="ml-2 bg-purple-100 text-purple-800">
                      Owner
                    </Badge>
                  )}
                </div>
                <Button size="sm" variant="outline" onClick={switchAccount} className="text-xs">
                  Trocar Conta
                </Button>
                <Button size="sm" variant="ghost" onClick={disconnectMetaMask} className="h-8 w-8 p-0 hover:bg-red-200">
                  <LogOut className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <Button onClick={connectMetaMask} disabled={isConnecting} className="bg-orange-500 hover:bg-orange-600">
                {isConnecting ? "Conectando..." : "Conectar MetaMask"}
              </Button>
            )}
          </div>
        </div>

        {/* Card de Diagnóstico - adicionar após o header */}
        <Card className="mb-6 border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <AlertTriangle className="h-5 w-5" />
              Diagnóstico de Acesso
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-yellow-800">Owner do Contrato:</Label>
                <p className="text-sm font-mono bg-white p-2 rounded mt-1 border">{contractOwner || "Carregando..."}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-yellow-800">Endereço Conectado:</Label>
                <p className="text-sm font-mono bg-white p-2 rounded mt-1 border">
                  {connectedAddress || "Não conectado"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 rounded-lg border">
              {isOwnerConnected ? (
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="h-4 w-4" />
                  <span className="font-medium">Você é o owner! Pode acessar todas as áreas.</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-700">
                  <XCircle className="h-4 w-4" />
                  <span className="font-medium">
                    {!isMetaMaskConnected
                      ? "Conecte sua carteira para verificar se você é o owner"
                      : "Você não é o owner. Conecte a carteira owner para gerenciar credenciais"}
                  </span>
                </div>
              )}
            </div>

            {!isOwnerConnected && isMetaMaskConnected && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  <strong>Para acessar o gerenciamento:</strong>
                </p>
                <ol className="text-sm text-blue-700 mt-2 ml-4 list-decimal">
                  <li>Abra o MetaMask</li>
                  <li>Mude para a conta que é owner do contrato</li>
                  <li>Reconecte aqui no sistema</li>
                  <li>As abas de gerenciamento serão desbloqueadas</li>
                </ol>
              </div>
            )}
          </CardContent>
        </Card>

        <Tabs defaultValue="access" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="access">Acesso às Nuvens</TabsTrigger>
            <TabsTrigger value="verify">Minhas Credenciais</TabsTrigger>
            <TabsTrigger value="management" disabled={!isOwnerConnected}>
              <Settings className="h-4 w-4 mr-2" />
              Gerenciamento
            </TabsTrigger>
            <TabsTrigger value="admin" disabled={!isOwnerConnected}>
              <Users className="h-4 w-4 mr-2" />
              Administração
            </TabsTrigger>
          </TabsList>

          <TabsContent value="access">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cloud className="h-5 w-5" />
                  Acesso aos Provedores de Nuvem
                </CardTitle>
                <CardDescription>
                  Conecte sua carteira e insira sua credencial para acessar os serviços de nuvem
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!isMetaMaskConnected ? (
                  <div className="text-center py-8">
                    <Wallet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Conecte sua Carteira</h3>
                    <p className="text-gray-600 mb-4">
                      Para acessar os provedores de nuvem, você precisa conectar sua carteira MetaMask
                    </p>
                    <Button onClick={connectMetaMask} disabled={isConnecting}>
                      {isConnecting ? "Conectando..." : "Conectar MetaMask"}
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Wallet className="h-5 w-5 text-blue-600" />
                        <span className="font-medium text-blue-800">Carteira Conectada</span>
                      </div>
                      <p className="font-mono text-sm text-blue-700">
                        {connectedAddress.slice(0, 10)}...{connectedAddress.slice(-8)}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="cloudProvider">Provedor de Nuvem</Label>
                        <Select value={selectedCloudProvider} onValueChange={setSelectedCloudProvider}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o provedor" />
                          </SelectTrigger>
                          <SelectContent>
                            {CLOUD_PROVIDERS.map((provider) => (
                              <SelectItem key={provider.value} value={provider.value}>
                                <div className="flex items-center gap-2">
                                  <span>{provider.icon}</span>
                                  <span>{provider.label}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="credentialId">ID da Credencial</Label>
                        <Input
                          id="credentialId"
                          placeholder="0x..."
                          value={accessCredentialId}
                          onChange={(e) => setAccessCredentialId(e.target.value)}
                        />
                      </div>
                    </div>

                    <Button
                      onClick={verifyAndAccess}
                      disabled={isVerifying || !selectedCloudProvider || !accessCredentialId}
                      className="w-full"
                    >
                      {isVerifying ? "Verificando..." : "Verificar e Acessar"}
                    </Button>

                    {accessResult && (
                      <Alert
                        className={
                          accessResult.includes("✅") ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
                        }
                      >
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>{accessResult}</AlertDescription>
                      </Alert>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="verify">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Minhas Credenciais
                </CardTitle>
                <CardDescription>Conecte sua carteira MetaMask para ver suas credenciais</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!isMetaMaskConnected ? (
                  <div className="text-center py-8">
                    <Wallet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Conecte sua Carteira</h3>
                    <p className="text-gray-600 mb-4">
                      Para verificar suas credenciais, você precisa conectar sua carteira MetaMask
                    </p>
                    <Button onClick={connectMetaMask} disabled={isConnecting}>
                      {isConnecting ? "Conectando..." : "Conectar MetaMask"}
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Wallet className="h-5 w-5 text-green-600" />
                        <span className="font-medium text-green-800">Carteira Conectada</span>
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-sm text-green-700">
                          {connectedAddress.slice(0, 10)}...{connectedAddress.slice(-8)}
                        </p>
                        <Button onClick={checkUserCredentials} disabled={isChecking} className="mt-2">
                          {isChecking ? "Verificando..." : "Atualizar Credenciais"}
                        </Button>
                      </div>
                    </div>

                    {userCredentials.length > 0 && (
                      <div className="space-y-3">
                        <h3 className="font-semibold">Suas Credenciais:</h3>
                        {userCredentials.map((cred, index) => (
                          <Card
                            key={index}
                            className={cred.revoked ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}
                          >
                            <CardContent className="pt-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-sm font-medium">Provedor</Label>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span>{getProviderInfo(cred.provider!).icon}</span>
                                    <span>{getProviderInfo(cred.provider!).label}</span>
                                  </div>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Nível de Acesso</Label>
                                  <p className="mt-1">{getAccessLevelInfo(cred.accessLevel!).label}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Status</Label>
                                  <div className="flex items-center gap-2 mt-1">
                                    {cred.revoked ? (
                                      <>
                                        <XCircle className="h-4 w-4 text-red-500" />
                                        <span className="text-red-600">Revogada</span>
                                      </>
                                    ) : (
                                      <>
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                        <span className="text-green-600">Válida</span>
                                      </>
                                    )}
                                  </div>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Emitida em</Label>
                                  <p className="mt-1 text-sm text-gray-600">
                                    {new Date(cred.issuedAt * 1000).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                              <Separator className="my-3" />
                              <div>
                                <Label className="text-sm font-medium">ID da Credencial</Label>
                                <div className="flex items-center gap-2 mt-1">
                                  <p className="text-xs font-mono bg-gray-100 p-2 rounded break-all flex-1">
                                    {cred.id}
                                  </p>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => navigator.clipboard.writeText(cred.id)}
                                  >
                                    Copiar
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}

                    {userCredentials.length === 0 && !isChecking && (
                      <div className="text-center py-8">
                        <Key className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma Credencial Encontrada</h3>
                        <p className="text-gray-600">Você ainda não possui credenciais emitidas para esta carteira.</p>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="management">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Gerenciamento de Credenciais
                </CardTitle>
                <CardDescription>Área exclusiva para o owner do contrato gerenciar credenciais</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {!isOwnerConnected ? (
                  <div className="text-center py-8">
                    <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Acesso Restrito</h3>
                    <p className="text-gray-600 mb-4">
                      Esta área é exclusiva para o owner do contrato. Conecte a carteira do owner para continuar.
                    </p>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                      <p className="text-sm text-yellow-800">
                        <strong>Owner do Contrato:</strong> {contractOwner.slice(0, 10)}...{contractOwner.slice(-8)}
                      </p>
                    </div>
                    {!isMetaMaskConnected && (
                      <Button onClick={connectMetaMask} disabled={isConnecting}>
                        {isConnecting ? "Conectando..." : "Conectar MetaMask"}
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-purple-50 border border-purple-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-purple-600" />
                        <span className="font-medium text-purple-800">Owner Autenticado</span>
                      </div>
                      <Badge className="bg-purple-100 text-purple-800">Acesso Total</Badge>
                    </div>

                    {/* Seção de Emissão */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Emitir Nova Credencial</CardTitle>
                        <CardDescription>Crie uma nova credencial de acesso para um usuário específico</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label htmlFor="subject">Endereço do Usuário</Label>
                          <Input
                            id="subject"
                            placeholder="0x..."
                            value={subjectAddress}
                            onChange={(e) => setSubjectAddress(e.target.value)}
                          />
                        </div>

                        <div>
                          <Label htmlFor="provider">Provedor de Nuvem</Label>
                          <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o provedor" />
                            </SelectTrigger>
                            <SelectContent>
                              {CLOUD_PROVIDERS.map((provider) => (
                                <SelectItem key={provider.value} value={provider.value}>
                                  <div className="flex items-center gap-2">
                                    <span>{provider.icon}</span>
                                    <span>{provider.label}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="access">Nível de Acesso</Label>
                          <Select value={selectedAccessLevel} onValueChange={setSelectedAccessLevel}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o nível de acesso" />
                            </SelectTrigger>
                            <SelectContent>
                              {ACCESS_LEVELS.map((level) => (
                                <SelectItem key={level.value} value={level.value}>
                                  {level.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <Button
                          onClick={issueCredential}
                          disabled={isIssuing || !subjectAddress || !selectedProvider || !selectedAccessLevel}
                          className="w-full"
                        >
                          {isIssuing ? "Emitindo..." : "Emitir Credencial"}
                        </Button>

                        {issueResult && (
                          <Alert>
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>{issueResult}</AlertDescription>
                          </Alert>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="admin">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Administração do Sistema
                </CardTitle>
                <CardDescription>Ferramentas administrativas para gerenciar o sistema de credenciais</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {!isOwnerConnected ? (
                  <div className="text-center py-8">
                    <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Acesso Restrito</h3>
                    <p className="text-gray-600">Esta área é exclusiva para o owner do contrato.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-red-600" />
                        <span className="font-medium text-red-800">Área Administrativa</span>
                      </div>
                      <Badge className="bg-red-100 text-red-800">Acesso Crítico</Badge>
                    </div>

                    {/* Seção de Revogação */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Revogar Credencial</CardTitle>
                        <CardDescription>Revogue uma credencial existente usando seu ID</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label htmlFor="credentialId">ID da Credencial</Label>
                          <Input
                            id="credentialId"
                            placeholder="0x..."
                            value={revokeCredentialId}
                            onChange={(e) => setRevokeCredentialId(e.target.value)}
                          />
                        </div>

                        <Button
                          onClick={revokeCredential}
                          disabled={isRevoking || !revokeCredentialId}
                          variant="destructive"
                          className="w-full"
                        >
                          {isRevoking ? "Revogando..." : "Revogar Credencial"}
                        </Button>

                        {revokeResult && (
                          <Alert>
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>{revokeResult}</AlertDescription>
                          </Alert>
                        )}
                      </CardContent>
                    </Card>

                    {/* Informações do Sistema */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Configurações do Sistema</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm font-medium">Endereço do Contrato</Label>
                            <p className="text-sm font-mono bg-gray-100 p-2 rounded mt-1">{currentContractAddress}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">Owner do Contrato</Label>
                            <p className="text-sm font-mono bg-gray-100 p-2 rounded mt-1">{contractOwner}</p>
                          </div>
                        </div>

                        <div className="flex gap-2 mt-4">
                          <Button
                            onClick={() => initializeContract()}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2"
                          >
                            <RefreshCw className="h-4 w-4" />
                            Recarregar
                          </Button>

                          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" className="flex items-center gap-2">
                                <Edit className="h-4 w-4" />
                                Alterar Contrato
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                              <DialogHeader>
                                <DialogTitle>Alterar Endereço do Contrato</DialogTitle>
                                <DialogDescription>
                                  Insira o novo endereço do contrato. Certifique-se de que é um endereço válido na rede
                                  Sepolia.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div>
                                  <Label htmlFor="newContract">Novo Endereço do Contrato</Label>
                                  <Input
                                    id="newContract"
                                    placeholder="0x..."
                                    value={newContractAddress}
                                    onChange={(e) => setNewContractAddress(e.target.value)}
                                  />
                                </div>

                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                  <p className="text-sm text-yellow-800">
                                    <strong>Atenção:</strong> Alterar o contrato irá limpar todas as credenciais
                                    carregadas e você precisará reconectar como owner se necessário.
                                  </p>
                                </div>

                                {contractUpdateResult && (
                                  <Alert
                                    className={
                                      contractUpdateResult.includes("✅")
                                        ? "border-green-200 bg-green-50"
                                        : "border-red-200 bg-red-50"
                                    }
                                  >
                                    <AlertTriangle className="h-4 w-4" />
                                    <AlertDescription>{contractUpdateResult}</AlertDescription>
                                  </Alert>
                                )}
                              </div>

                              <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                  Cancelar
                                </Button>
                                <Button
                                  onClick={updateContractAddress}
                                  disabled={isUpdatingContract || !newContractAddress}
                                >
                                  {isUpdatingContract ? "Atualizando..." : "Atualizar Contrato"}
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
