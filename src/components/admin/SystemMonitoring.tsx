
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Activity, Server, Database, Wifi, 
  AlertTriangle, CheckCircle, Clock, TrendingUp
} from "lucide-react";
import { useState, useEffect } from "react";

interface SystemMetrics {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  networkLatency: number;
  activeUsers: number;
  responseTime: number;
  uptime: number;
  errorRate: number;
}

interface PerformanceAlert {
  id: string;
  type: 'performance' | 'security' | 'system';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: Date;
  resolved: boolean;
}

export const SystemMonitoring = () => {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpuUsage: 45,
    memoryUsage: 67,
    diskUsage: 32,
    networkLatency: 45,
    activeUsers: 127,
    responseTime: 1.2,
    uptime: 99.7,
    errorRate: 0.3
  });

  const [alerts, setAlerts] = useState<PerformanceAlert[]>([
    {
      id: '1',
      type: 'performance',
      severity: 'medium',
      message: 'Temps de réponse élevé détecté sur le module de notes',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      resolved: false
    },
    {
      id: '2',
      type: 'system',
      severity: 'low',
      message: 'Utilisation mémoire au-dessus de 60%',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      resolved: false
    }
  ]);

  // Simulation de mise à jour des métriques en temps réel
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        cpuUsage: Math.max(10, Math.min(90, prev.cpuUsage + (Math.random() - 0.5) * 10)),
        memoryUsage: Math.max(20, Math.min(85, prev.memoryUsage + (Math.random() - 0.5) * 5)),
        networkLatency: Math.max(20, Math.min(200, prev.networkLatency + (Math.random() - 0.5) * 20)),
        activeUsers: Math.max(50, Math.min(200, prev.activeUsers + Math.floor((Math.random() - 0.5) * 10))),
        responseTime: Math.max(0.5, Math.min(5, prev.responseTime + (Math.random() - 0.5) * 0.5))
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getMetricStatus = (value: number, thresholds: { warning: number; critical: number }) => {
    if (value >= thresholds.critical) return { color: 'text-red-600', status: 'Critique' };
    if (value >= thresholds.warning) return { color: 'text-amber-600', status: 'Attention' };
    return { color: 'text-green-600', status: 'Normal' };
  };

  const getAlertSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-600 text-white';
      case 'high': return 'bg-red-500 text-white';
      case 'medium': return 'bg-amber-500 text-white';
      case 'low': return 'bg-blue-500 text-white';
      default: return 'bg-slate-500 text-white';
    }
  };

  const resolveAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, resolved: true } : alert
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-slate-800">Monitoring Système</h3>
          <p className="text-slate-600">Surveillance en temps réel des performances</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-slate-600">Temps réel</span>
          </div>
        </div>
      </div>

      {/* Métriques Principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-blue-600 text-sm font-medium">Utilisateurs Actifs</p>
                <p className="text-3xl font-bold text-blue-800">{metrics.activeUsers}</p>
              </div>
              <Activity className="h-10 w-10 text-blue-600" />
            </div>
            <Progress value={Math.min(100, (metrics.activeUsers / 200) * 100)} className="mb-2" />
            <p className="text-xs text-blue-600">Pic: 500 utilisateurs</p>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-green-600 text-sm font-medium">Temps Réponse</p>
                <p className="text-3xl font-bold text-green-800">{metrics.responseTime.toFixed(1)}s</p>
              </div>
              <Clock className="h-10 w-10 text-green-600" />
            </div>
            <Progress value={Math.min(100, 100 - (metrics.responseTime / 5) * 100)} className="mb-2" />
            <p className="text-xs text-green-600">Objectif: &lt; 2s</p>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-purple-600 text-sm font-medium">Disponibilité</p>
                <p className="text-3xl font-bold text-purple-800">{metrics.uptime}%</p>
              </div>
              <CheckCircle className="h-10 w-10 text-purple-600" />
            </div>
            <Progress value={metrics.uptime} className="mb-2" />
            <p className="text-xs text-purple-600">Objectif: 99.5%</p>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-amber-600 text-sm font-medium">Taux d'Erreur</p>
                <p className="text-3xl font-bold text-amber-800">{metrics.errorRate}%</p>
              </div>
              <AlertTriangle className="h-10 w-10 text-amber-600" />
            </div>
            <Progress value={Math.min(100, metrics.errorRate * 20)} className="mb-2" />
            <p className="text-xs text-amber-600">Objectif: &lt; 1%</p>
          </CardContent>
        </Card>
      </div>

      {/* Métriques Système Détaillées */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              Ressources Système
            </CardTitle>
            <CardDescription>Utilisation en temps réel des ressources</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">CPU</span>
                <span className={`text-sm ${getMetricStatus(metrics.cpuUsage, { warning: 70, critical: 85 }).color}`}>
                  {metrics.cpuUsage.toFixed(1)}%
                </span>
              </div>
              <Progress value={metrics.cpuUsage} />
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Mémoire</span>
                <span className={`text-sm ${getMetricStatus(metrics.memoryUsage, { warning: 75, critical: 90 }).color}`}>
                  {metrics.memoryUsage.toFixed(1)}%
                </span>
              </div>
              <Progress value={metrics.memoryUsage} />
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Disque</span>
                <span className={`text-sm ${getMetricStatus(metrics.diskUsage, { warning: 80, critical: 95 }).color}`}>
                  {metrics.diskUsage.toFixed(1)}%
                </span>
              </div>
              <Progress value={metrics.diskUsage} />
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Latence Réseau</span>
                <span className={`text-sm ${getMetricStatus(metrics.networkLatency, { warning: 100, critical: 200 }).color}`}>
                  {metrics.networkLatency.toFixed(0)}ms
                </span>
              </div>
              <Progress value={Math.min(100, metrics.networkLatency / 2)} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Alertes Système ({alerts.filter(a => !a.resolved).length})
            </CardTitle>
            <CardDescription>Notifications et incidents en cours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {alerts.filter(alert => !alert.resolved).map((alert) => (
                <div key={alert.id} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <Badge className={getAlertSeverityColor(alert.severity)}>
                      {alert.severity.toUpperCase()}
                    </Badge>
                    <span className="text-xs text-slate-500">
                      {alert.timestamp.toLocaleTimeString('fr-FR')}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 mb-2">{alert.message}</p>
                  <div className="flex justify-between items-center">
                    <Badge variant="outline" className="text-xs">
                      {alert.type}
                    </Badge>
                    <Button size="sm" variant="outline" onClick={() => resolveAlert(alert.id)}>
                      Résoudre
                    </Button>
                  </div>
                </div>
              ))}
              {alerts.filter(a => !a.resolved).length === 0 && (
                <div className="text-center py-4 text-slate-500">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Aucune alerte active</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions Rapides */}
      <Card>
        <CardHeader>
          <CardTitle>Actions de Maintenance</CardTitle>
          <CardDescription>Outils de gestion et maintenance système</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-16 flex-col">
              <Database className="h-6 w-6 mb-1" />
              <span className="text-xs">Optimiser BDD</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col">
              <Server className="h-6 w-6 mb-1" />
              <span className="text-xs">Redémarrer Services</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col">
              <Wifi className="h-6 w-6 mb-1" />
              <span className="text-xs">Test Connectivité</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col">
              <TrendingUp className="h-6 w-6 mb-1" />
              <span className="text-xs">Rapport Perf.</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
