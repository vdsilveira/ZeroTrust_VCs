"use client"

import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Database, Server, Shield, BarChart3, HardDrive, Lock, Zap } from "lucide-react"
import { useEffect } from "react"

export default function GoogleDashboard() {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500 p-2 rounded-lg">
                <span className="text-white text-xl">🌐</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Google Cloud Platform</h1>
                <p className="text-gray-600">Console de Gerenciamento GCP</p>
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
            <TabsTrigger value="compute">Compute Engine</TabsTrigger>
            <TabsTrigger value="storage">Cloud Storage</TabsTrigger>
            <TabsTrigger value="database">Cloud SQL</TabsTrigger>
            <TabsTrigger value="functions">Cloud Functions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Server className="h-4 w-4 text-blue-500" />
                    VM Instances
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">9</div>
                  <p className="text-xs text-gray-500">7 em execução</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <HardDrive className="h-4 w-4 text-green-500" />
                    Cloud Storage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4.2</div>
                  <p className="text-xs text-gray-500">TB armazenados</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    Cloud Functions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">15</div>
                  <p className="text-xs text-gray-500">funções ativas</p>
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
                  <div className="text-2xl font-bold">$1,156</div>
                  <p className="text-xs text-gray-500">+8% vs mês anterior</p>
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
                      <Server className="h-5 w-5 text-blue-500" />
                      <span>prod-web-server (e2-medium)</span>
                    </div>
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      Running
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Database className="h-5 w-5 text-blue-500" />
                      <span>Cloud SQL (MySQL 8.0)</span>
                    </div>
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      Running
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Zap className="h-5 w-5 text-yellow-500" />
                      <span>api-handler (Cloud Function)</span>
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
                      <span className="font-medium">Todos os Serviços OK</span>
                    </div>
                    <p className="text-sm text-green-700 mt-1">Nenhum incidente reportado</p>
                  </div>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2 text-blue-800">
                      <BarChart3 className="h-4 w-4" />
                      <span className="font-medium">Uso de Recursos</span>
                    </div>
                    <p className="text-sm text-blue-700 mt-1">Compute: 67% | Storage: 34% | Network: Normal</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="compute">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  Compute Engine
                </CardTitle>
                <CardDescription>Máquinas virtuais escaláveis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Button disabled={!canAccess("write")}>Criar Instância</Button>
                    <Button variant="outline" disabled={!canAccess("admin")}>
                      Configurar Firewall
                    </Button>
                  </div>

                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left p-3">Nome</th>
                          <th className="text-left p-3">Zona</th>
                          <th className="text-left p-3">Tipo de Máquina</th>
                          <th className="text-left p-3">Status</th>
                          <th className="text-left p-3">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-t">
                          <td className="p-3">prod-web-server</td>
                          <td className="p-3">us-central1-a</td>
                          <td className="p-3">e2-medium</td>
                          <td className="p-3">
                            <Badge className="bg-green-100 text-green-800">Running</Badge>
                          </td>
                          <td className="p-3">
                            <Button size="sm" variant="outline" disabled={!canAccess("write")}>
                              Parar
                            </Button>
                          </td>
                        </tr>
                        <tr className="border-t">
                          <td className="p-3">dev-app-server</td>
                          <td className="p-3">us-central1-b</td>
                          <td className="p-3">e2-small</td>
                          <td className="p-3">
                            <Badge className="bg-gray-100 text-gray-800">Stopped</Badge>
                          </td>
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

          <TabsContent value="storage">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HardDrive className="h-5 w-5" />
                  Cloud Storage
                </CardTitle>
                <CardDescription>Armazenamento de objetos unificado</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Button disabled={!canAccess("write")}>Criar Bucket</Button>
                    <Button variant="outline" disabled={!canAccess("write")}>
                      Upload de Arquivo
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">prod-app-storage</CardTitle>
                        <CardDescription>Bucket de produção</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <p className="text-sm text-gray-600">2.1 GB • 3,245 objetos</p>
                          <Badge variant="outline" className="bg-blue-100 text-blue-800">
                            Standard
                          </Badge>
                          <div className="flex gap-2 mt-3">
                            <Button size="sm" variant="outline">
                              Navegar
                            </Button>
                            <Button size="sm" variant="outline" disabled={!canAccess("admin")}>
                              Configurar
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">backup-data</CardTitle>
                        <CardDescription>Backups automáticos</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <p className="text-sm text-gray-600">1.8 GB • 567 objetos</p>
                          <Badge variant="outline" className="bg-green-100 text-green-800">
                            Coldline
                          </Badge>
                          <div className="flex gap-2 mt-3">
                            <Button size="sm" variant="outline">
                              Navegar
                            </Button>
                            <Button size="sm" variant="outline" disabled={!canAccess("admin")}>
                              Configurar
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

          <TabsContent value="database">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Cloud SQL
                </CardTitle>
                <CardDescription>Bancos de dados relacionais totalmente gerenciados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Button disabled={!canAccess("write")}>Criar Instância</Button>
                    <Button variant="outline" disabled={!canAccess("admin")}>
                      Configurar Backup
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <Card>
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold">prod-mysql-db</h3>
                            <p className="text-sm text-gray-600">MySQL 8.0 • db-n1-standard-2</p>
                          </div>
                          <div className="text-right">
                            <Badge className="bg-green-100 text-green-800">Running</Badge>
                            <p className="text-xs text-gray-500 mt-1">us-central1</p>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button size="sm" variant="outline">
                            Conectar
                          </Button>
                          <Button size="sm" variant="outline" disabled={!canAccess("admin")}>
                            Editar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold">dev-postgres-db</h3>
                            <p className="text-sm text-gray-600">PostgreSQL 13 • db-f1-micro</p>
                          </div>
                          <div className="text-right">
                            <Badge className="bg-green-100 text-green-800">Running</Badge>
                            <p className="text-xs text-gray-500 mt-1">us-east1</p>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button size="sm" variant="outline">
                            Conectar
                          </Button>
                          <Button size="sm" variant="outline" disabled={!canAccess("admin")}>
                            Editar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="functions">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Cloud Functions
                </CardTitle>
                <CardDescription>Funções serverless orientadas a eventos</CardDescription>
              </CardHeader>
              <CardContent>
                {canAccess("write") ? (
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Button>Criar Função</Button>
                      <Button variant="outline">Deploy via CLI</Button>
                    </div>

                    <div className="space-y-3">
                      <Card>
                        <CardContent className="pt-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold">api-handler</h3>
                              <p className="text-sm text-gray-600">Node.js 18 • HTTP Trigger</p>
                            </div>
                            <div className="text-right">
                              <Badge className="bg-green-100 text-green-800">Active</Badge>
                              <p className="text-xs text-gray-500 mt-1">1,247 invocações hoje</p>
                            </div>
                          </div>
                          <div className="flex gap-2 mt-3">
                            <Button size="sm" variant="outline">
                              Ver Logs
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
                              <h3 className="font-semibold">image-processor</h3>
                              <p className="text-sm text-gray-600">Python 3.9 • Cloud Storage Trigger</p>
                            </div>
                            <div className="text-right">
                              <Badge className="bg-green-100 text-green-800">Active</Badge>
                              <p className="text-xs text-gray-500 mt-1">89 invocações hoje</p>
                            </div>
                          </div>
                          <div className="flex gap-2 mt-3">
                            <Button size="sm" variant="outline">
                              Ver Logs
                            </Button>
                            <Button size="sm" variant="outline" disabled={!canAccess("admin")}>
                              Configurar
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
                    <p className="text-gray-600">
                      Você precisa de permissões de escrita para gerenciar Cloud Functions.
                    </p>
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
