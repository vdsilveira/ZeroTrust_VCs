"use client"

import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Database, Shield, BarChart3, Network, HardDrive, Cpu, Lock } from "lucide-react"
import { useEffect } from "react"

export default function OracleDashboard() {
  const searchParams = useSearchParams()
  const credential = searchParams.get("credential")
  const accessLevel = searchParams.get("access")
  const userAddress = searchParams.get("user")

  useEffect(() => {
    // Verificar se o usuário está autenticado
    if (!userAddress) {
      alert("Acesso não autorizado. Você precisa estar logado com MetaMask.")
      window.close()
    }
  }, [userAddress])

  const getAccessLevelColor = (level: string) => {
    switch (level) {
      case "admin":
        return "bg-red-100 text-red-800"
      case "write":
        return "bg-yellow-100 text-yellow-800"
      case "read":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getAccessLevelLabel = (level: string) => {
    switch (level) {
      case "admin":
        return "Administrador"
      case "write":
        return "Leitura e Escrita"
      case "read":
        return "Somente Leitura"
      default:
        return level
    }
  }

  const canAccess = (requiredLevel: string) => {
    if (accessLevel === "admin") return true
    if (accessLevel === "write" && (requiredLevel === "write" || requiredLevel === "read")) return true
    if (accessLevel === "read" && requiredLevel === "read") return true
    return false
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-red-600 p-2 rounded-lg">
                <span className="text-white text-xl font-bold">🔶</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Oracle Cloud Infrastructure</h1>
                <p className="text-gray-600">Console de Gerenciamento OCI</p>
              </div>
            </div>
            <div className="text-right">
              <Badge className={getAccessLevelColor(accessLevel || "")}>{getAccessLevelLabel(accessLevel || "")}</Badge>
              <p className="text-xs text-gray-500 mt-1">Credencial: {credential?.slice(0, 10)}...</p>
              <p className="text-xs text-gray-500">
                Usuário: {userAddress?.slice(0, 6)}...{userAddress?.slice(-4)}
              </p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="compute">Compute</TabsTrigger>
            <TabsTrigger value="database">Database</TabsTrigger>
            <TabsTrigger value="storage">Storage</TabsTrigger>
            <TabsTrigger value="networking">Networking</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-blue-500" />
                    Instâncias Compute
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">6</div>
                  <p className="text-xs text-gray-500">4 em execução</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Database className="h-4 w-4 text-orange-500" />
                    Bancos Oracle
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2</div>
                  <p className="text-xs text-gray-500">Autonomous DB</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <HardDrive className="h-4 w-4 text-green-500" />
                    Block Storage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1.5</div>
                  <p className="text-xs text-gray-500">TB provisionados</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-purple-500" />
                    Custo Mensal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$892</div>
                  <p className="text-xs text-gray-500">-5% vs mês anterior</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recursos Ativos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Cpu className="h-5 w-5 text-blue-500" />
                      <span>VM.Standard2.1 (prod-web-01)</span>
                    </div>
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      Running
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Database className="h-5 w-5 text-orange-500" />
                      <span>Autonomous Database (PROD)</span>
                    </div>
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      Available
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Network className="h-5 w-5 text-purple-500" />
                      <span>Load Balancer (lb-prod)</span>
                    </div>
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      Active
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Monitoramento</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 text-green-800">
                      <Shield className="h-4 w-4" />
                      <span className="font-medium">Sistema Saudável</span>
                    </div>
                    <p className="text-sm text-green-700 mt-1">Todos os serviços operando normalmente</p>
                  </div>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2 text-blue-800">
                      <BarChart3 className="h-4 w-4" />
                      <span className="font-medium">Performance</span>
                    </div>
                    <p className="text-sm text-blue-700 mt-1">CPU: 45% | Memória: 62% | Rede: Normal</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="compute">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cpu className="h-5 w-5" />
                  Compute Instances
                </CardTitle>
                <CardDescription>Gerencie suas instâncias de computação</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Button disabled={!canAccess("write")}>Criar Instância</Button>
                    <Button variant="outline" disabled={!canAccess("admin")}>
                      Configurações de Rede
                    </Button>
                  </div>

                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left p-3">Nome</th>
                          <th className="text-left p-3">Shape</th>
                          <th className="text-left p-3">Estado</th>
                          <th className="text-left p-3">IP Público</th>
                          <th className="text-left p-3">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-t">
                          <td className="p-3">prod-web-01</td>
                          <td className="p-3">VM.Standard2.1</td>
                          <td className="p-3">
                            <Badge className="bg-green-100 text-green-800">Running</Badge>
                          </td>
                          <td className="p-3">129.213.45.67</td>
                          <td className="p-3">
                            <Button size="sm" variant="outline" disabled={!canAccess("write")}>
                              Parar
                            </Button>
                          </td>
                        </tr>
                        <tr className="border-t">
                          <td className="p-3">dev-app-01</td>
                          <td className="p-3">VM.Standard2.2</td>
                          <td className="p-3">
                            <Badge className="bg-gray-100 text-gray-800">Stopped</Badge>
                          </td>
                          <td className="p-3">-</td>
                          <td className="p-3">
                            <Button size="sm" variant="outline" disabled={!canAccess("write")}>
                              Iniciar
                            </Button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="database">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Oracle Database Services
                </CardTitle>
                <CardDescription>Bancos de dados Oracle gerenciados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Button disabled={!canAccess("write")}>Criar Autonomous Database</Button>
                    <Button variant="outline" disabled={!canAccess("admin")}>
                      Configurar Backup
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <Card>
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold">PROD-ADB</h3>
                            <p className="text-sm text-gray-600">Autonomous Database • 2 OCPU</p>
                          </div>
                          <div className="text-right">
                            <Badge className="bg-green-100 text-green-800">Available</Badge>
                            <p className="text-xs text-gray-500 mt-1">Auto Scaling: ON</p>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button size="sm" variant="outline">
                            SQL Developer Web
                          </Button>
                          <Button size="sm" variant="outline" disabled={!canAccess("admin")}>
                            Configurar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold">DEV-ADB</h3>
                            <p className="text-sm text-gray-600">Autonomous Database • 1 OCPU</p>
                          </div>
                          <div className="text-right">
                            <Badge className="bg-green-100 text-green-800">Available</Badge>
                            <p className="text-xs text-gray-500 mt-1">Development</p>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button size="sm" variant="outline">
                            SQL Developer Web
                          </Button>
                          <Button size="sm" variant="outline" disabled={!canAccess("admin")}>
                            Configurar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="storage">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HardDrive className="h-5 w-5" />
                  Block Storage
                </CardTitle>
                <CardDescription>Volumes de armazenamento em bloco</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Button disabled={!canAccess("write")}>Criar Volume</Button>
                    <Button variant="outline" disabled={!canAccess("write")}>
                      Anexar Volume
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">prod-web-boot</CardTitle>
                        <CardDescription>Volume de boot</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <p className="text-sm text-gray-600">50 GB • Anexado a prod-web-01</p>
                          <Badge className="bg-green-100 text-green-800">In-use</Badge>
                          <div className="flex gap-2 mt-3">
                            <Button size="sm" variant="outline" disabled={!canAccess("admin")}>
                              Backup
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">data-volume-01</CardTitle>
                        <CardDescription>Volume de dados</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <p className="text-sm text-gray-600">500 GB • Disponível</p>
                          <Badge className="bg-blue-100 text-blue-800">Available</Badge>
                          <div className="flex gap-2 mt-3">
                            <Button size="sm" variant="outline" disabled={!canAccess("write")}>
                              Anexar
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="networking">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Network className="h-5 w-5" />
                  Virtual Cloud Networks
                </CardTitle>
                <CardDescription>Configurações de rede e conectividade</CardDescription>
              </CardHeader>
              <CardContent>
                {canAccess("admin") ? (
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Button>Criar VCN</Button>
                      <Button variant="outline">Configurar Gateway</Button>
                    </div>

                    <div className="space-y-3">
                      <Card>
                        <CardContent className="pt-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold">prod-vcn</h3>
                              <p className="text-sm text-gray-600">10.0.0.0/16 • 3 subnets</p>
                            </div>
                            <Badge className="bg-green-100 text-green-800">Active</Badge>
                          </div>
                          <div className="flex gap-2 mt-3">
                            <Button size="sm" variant="outline">
                              Gerenciar Subnets
                            </Button>
                            <Button size="sm" variant="outline">
                              Security Lists
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Acesso Restrito</h3>
                    <p className="text-gray-600">Você precisa de permissões de administrador para gerenciar redes.</p>
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
