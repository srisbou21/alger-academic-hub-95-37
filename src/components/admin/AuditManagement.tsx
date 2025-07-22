
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Shield, FileText, Download, Filter, 
  Calendar, User, Database, AlertTriangle
} from "lucide-react";
import { useState, useEffect } from "react";
import { auditService, AuditLog, SystemAlert } from "@/services/auditService";

export const AuditManagement = () => {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [filters, setFilters] = useState({
    userId: '',
    action: '',
    resource: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    // Charger les logs d'audit
    const logs = auditService.getAuditLogs();
    setAuditLogs(logs);

    // Charger les alertes actives
    const activeAlerts = auditService.getActiveAlerts();
    setAlerts(activeAlerts);

    // S'abonner aux nouvelles alertes
    const unsubscribe = auditService.subscribeToAlerts((alert) => {
      setAlerts(prev => [alert, ...prev]);
    });

    return unsubscribe;
  }, []);

  const applyFilters = () => {
    const filteredLogs = auditService.getAuditLogs({
      userId: filters.userId || undefined,
      action: filters.action || undefined,
      resource: filters.resource || undefined,
      startDate: filters.startDate ? new Date(filters.startDate) : undefined,
      endDate: filters.endDate ? new Date(filters.endDate) : undefined
    });
    setAuditLogs(filteredLogs);
  };

  const exportAuditReport = () => {
    const startDate = filters.startDate ? new Date(filters.startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const endDate = filters.endDate ? new Date(filters.endDate) : new Date();
    
    const report = auditService.generateComplianceReport(startDate, endDate);
    
    const reportBlob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(reportBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const resolveAlert = (alertId: string) => {
    auditService.resolveAlert(alertId, 'admin');
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, resolved: true, resolvedBy: 'admin', resolvedAt: new Date() } : alert
    ));
  };

  const getActionBadgeColor = (action: string) => {
    if (action.includes('login')) return 'bg-blue-100 text-blue-800';
    if (action.includes('create')) return 'bg-green-100 text-green-800';
    if (action.includes('update')) return 'bg-amber-100 text-amber-800';
    if (action.includes('delete')) return 'bg-red-100 text-red-800';
    return 'bg-slate-100 text-slate-800';
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-slate-800">Audit et Traçabilité</h3>
          <p className="text-slate-600">Surveillance des activités et conformité réglementaire</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportAuditReport}>
            <Download className="mr-2 h-4 w-4" />
            Exporter Rapport
          </Button>
        </div>
      </div>

      {/* Alertes Système */}
      {alerts.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-5 w-5" />
              Alertes Système Actives ({alerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.slice(0, 3).map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                  <div className="flex items-center gap-3">
                    <Badge className={getAlertSeverityColor(alert.severity)}>
                      {alert.severity.toUpperCase()}
                    </Badge>
                    <div>
                      <p className="font-medium">{alert.message}</p>
                      <p className="text-sm text-slate-500">
                        {alert.timestamp.toLocaleString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => resolveAlert(alert.id)}
                  >
                    Résoudre
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtres de Recherche
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Input
              placeholder="ID Utilisateur"
              value={filters.userId}
              onChange={(e) => setFilters(prev => ({ ...prev, userId: e.target.value }))}
            />
            <Select value={filters.action} onValueChange={(value) => setFilters(prev => ({ ...prev, action: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Toutes</SelectItem>
                <SelectItem value="login">Connexion</SelectItem>
                <SelectItem value="create">Création</SelectItem>
                <SelectItem value="update">Modification</SelectItem>
                <SelectItem value="delete">Suppression</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Ressource"
              value={filters.resource}
              onChange={(e) => setFilters(prev => ({ ...prev, resource: e.target.value }))}
            />
            <Input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
            />
            <Button onClick={applyFilters} className="bg-blue-600 hover:bg-blue-700">
              <Filter className="mr-2 h-4 w-4" />
              Filtrer
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Logs d'Audit */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Journal d'Audit ({auditLogs.length} entrées)
          </CardTitle>
          <CardDescription>
            Historique détaillé de toutes les opérations système
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {auditLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center">
                    <User className="h-4 w-4 text-slate-500" />
                    <span className="text-xs text-slate-500">{log.userId}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={getActionBadgeColor(log.action)}>
                        {log.action}
                      </Badge>
                      <span className="font-medium">{log.resource}</span>
                    </div>
                    <p className="text-sm text-slate-600">
                      {log.timestamp.toLocaleString('fr-FR')} - {log.userRole}
                    </p>
                    {log.details && Object.keys(log.details).length > 0 && (
                      <p className="text-xs text-slate-500 mt-1">
                        Détails: {JSON.stringify(log.details)}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="text-xs">
                    <Shield className="h-3 w-3 mr-1" />
                    Vérifié
                  </Badge>
                  <p className="text-xs text-slate-500 mt-1">
                    Hash: {log.cryptographicHash?.substring(0, 8)}...
                  </p>
                </div>
              </div>
            ))}
            {auditLogs.length === 0 && (
              <div className="text-center py-8 text-slate-500">
                <Database className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Aucun log d'audit trouvé</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
