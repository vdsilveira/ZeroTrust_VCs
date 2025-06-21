"use client"

import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Cloud, Database, Server, Shield, BarChart3, Settings, Users, HardDrive, Lock } from "lucide-react"
import { useEffect } from "react"

export default function AWSDashboard() {
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-orange-500 p-2 rounded-lg">
                <Cloud className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Amazon Web Services</h1>
                <p className="text-gray-600">Console de Gerenciamento AWS</p>
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
            <TabsTrigger value="ec2">EC2</TabsTrigger>
            <TabsTrigger value="s3">S3</TabsTrigger>
            <TabsTrigger value="rds">RDS</TabsTrigger>
            <TabsTrigger value="iam">IAM</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Server className="h-4 w-4 text-blue-500" />
                    Instâncias EC2
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-gray-500">8 em execução</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <HardDrive className="h-4 w-4 text-green-500" />
                    Buckets S3
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">5</div>
                  <p className="text-xs text-gray-500">2.3 TB armazenados</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Database className="h-4 w-4 text-purple-500" />
                    Bancos RDS
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-gray-500">Todos ativos</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-orange-500" />
                    Custo Mensal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$1,247</div>
                  <p className="text-xs text-gray-500">+12% vs mês anterior</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Serviços Recentes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Server className="h-5 w-5 text-blue-500" />
                      <span>EC2 Instance i-1234567890abcdef0</span>
                    </div>
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      Running
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <HardDrive className="h-5 w-5 text-green-500" />
                      <span>S3 Bucket: my-app-storage</span>
                    </div>
                    <Badge variant="outline" className="bg-blue-100 text-blue-800">
                      Active
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Database className="h-5 w-5 text-purple-500" />
                      <span>RDS MySQL: prod-database</span>
                    </div>
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      Available
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Alertas e Notificações</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2 text-yellow-800">
                      <Shield className="h-4 w-4" />
                      <span className="font-medium">Aviso de Segurança</span>
                    </div>
                    <p className="text-sm text-yellow-700 mt-1">2 grupos de segurança com regras muito permissivas</p>
                  </div>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2 text-blue-800">
                      <BarChart3 className="h-4 w-4" />
                      <span className="font-medium">Otimização de Custos</span>
                    </div>
                    <p className="text-sm text-blue-700 mt-1">Instâncias subutilizadas detectadas</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="ec2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  Instâncias EC2
                </CardTitle>
                <CardDescription>Gerencie suas instâncias virtuais</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Button disabled={!canAccess("write")}>Lançar Instância</Button>
                    <Button variant="outline" disabled={!canAccess("admin")}>
                      Configurações Avançadas
                    </Button>
                  </div>

                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left p-3">ID da Instância</th>
                          <th className="text-left p-3">Tipo</th>
                          <th className="text-left p-3">Estado</th>
                          <th className="text-left p-3">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-t">
                          <td className="p-3">i-1234567890abcdef0</td>
                          <td className="p-3">t3.medium</td>
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
                          <td className="p-3">i-0987654321fedcba0</td>
                          <td className="p-3">t3.large</td>
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

          <TabsContent value="s3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HardDrive className="h-5 w-5" />
                  Amazon S3
                </CardTitle>
                <CardDescription>Armazenamento de objetos escalável</CardDescription>
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
                        <CardTitle className="text-lg">my-app-storage</CardTitle>
                        <CardDescription>Bucket principal da aplicação</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <p className="text-sm text-gray-600">1.2 GB • 1,847 objetos</p>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              Explorar
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
                        <CardTitle className="text-lg">backup-files</CardTitle>
                        <CardDescription>Backups automáticos</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <p className="text-sm text-gray-600">856 MB • 234 objetos</p>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              Explorar
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

          <TabsContent value="rds">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Amazon RDS
                </CardTitle>
                <CardDescription>Bancos de dados relacionais gerenciados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Button disabled={!canAccess("write")}>Criar Banco de Dados</Button>
                    <Button variant="outline" disabled={!canAccess("admin")}>
                      Configurar Backup
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <Card>
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold">prod-database</h3>
                            <p className="text-sm text-gray-600">MySQL 8.0 • db.t3.medium</p>
                          </div>
                          <div className="text-right">
                            <Badge className="bg-green-100 text-green-800">Available</Badge>
                            <p className="text-xs text-gray-500 mt-1">99.9% uptime</p>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button size="sm" variant="outline">
                            Conectar
                          </Button>
                          <Button size="sm" variant="outline" disabled={!canAccess("admin")}>
                            Modificar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold">dev-database</h3>
                            <p className="text-sm text-gray-600">PostgreSQL 14 • db.t3.micro</p>
                          </div>
                          <div className="text-right">
                            <Badge className="bg-green-100 text-green-800">Available</Badge>
                            <p className="text-xs text-gray-500 mt-1">Development</p>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button size="sm" variant="outline">
                            Conectar
                          </Button>
                          <Button size="sm" variant="outline" disabled={!canAccess("admin")}>
                            Modificar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="iam">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Identity and Access Management (IAM)
                </CardTitle>
                <CardDescription>Gerencie usuários, grupos e permissões</CardDescription>
              </CardHeader>
              <CardContent>
                {canAccess("admin") ? (
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Button>Criar Usuário</Button>
                      <Button variant="outline">Criar Grupo</Button>
                      <Button variant="outline">Criar Política</Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            Usuários
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">8</div>
                          <p className="text-sm text-gray-600">usuários ativos</p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Shield className="h-5 w-5" />
                            Grupos
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">3</div>
                          <p className="text-sm text-gray-600">grupos configurados</p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Settings className="h-5 w-5" />
                            Políticas
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">12</div>
                          <p className="text-sm text-gray-600">políticas personalizadas</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Acesso Restrito</h3>
                    <p className="text-gray-600">Você precisa de permissões de administrador para acessar o IAM.</p>
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
