
interface AuditLog {
  id: string;
  timestamp: Date;
  userId: string;
  userRole: string;
  action: string;
  resource: string;
  details: any;
  ipAddress: string;
  userAgent: string;
  cryptographicHash?: string;
}

interface SystemAlert {
  id: string;
  type: 'error' | 'warning' | 'info';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: Date;
  resolved: boolean;
  resolvedBy?: string;
  resolvedAt?: Date;
}

class AuditService {
  private logs: AuditLog[] = [];
  private alerts: SystemAlert[] = [];
  private listeners: ((alert: SystemAlert) => void)[] = [];

  // Création d'un log d'audit
  async createAuditLog(
    userId: string,
    userRole: string,
    action: string,
    resource: string,
    details: any = {}
  ): Promise<void> {
    const log: AuditLog = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      userId,
      userRole,
      action,
      resource,
      details,
      ipAddress: await this.getClientIP(),
      userAgent: navigator.userAgent,
      cryptographicHash: await this.generateHash(`${userId}_${action}_${resource}_${Date.now()}`)
    };

    this.logs.push(log);
    this.persistAuditLog(log);
    
    console.log(`[AUDIT] ${action} on ${resource} by ${userId} (${userRole})`);
  }

  // Génération d'une alerte système
  createAlert(
    type: SystemAlert['type'],
    severity: SystemAlert['severity'],
    message: string
  ): SystemAlert {
    const alert: SystemAlert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      severity,
      message,
      timestamp: new Date(),
      resolved: false
    };

    this.alerts.push(alert);
    this.notifyListeners(alert);
    return alert;
  }

  // Récupération des logs d'audit avec filtres
  getAuditLogs(
    filters: {
      userId?: string;
      action?: string;
      resource?: string;
      startDate?: Date;
      endDate?: Date;
    } = {}
  ): AuditLog[] {
    return this.logs.filter(log => {
      if (filters.userId && log.userId !== filters.userId) return false;
      if (filters.action && !log.action.includes(filters.action)) return false;
      if (filters.resource && !log.resource.includes(filters.resource)) return false;
      if (filters.startDate && log.timestamp < filters.startDate) return false;
      if (filters.endDate && log.timestamp > filters.endDate) return false;
      return true;
    });
  }

  // Récupération des alertes actives
  getActiveAlerts(): SystemAlert[] {
    return this.alerts.filter(alert => !alert.resolved);
  }

  // Résolution d'une alerte
  resolveAlert(alertId: string, resolvedBy: string): void {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.resolved = true;
      alert.resolvedBy = resolvedBy;
      alert.resolvedAt = new Date();
    }
  }

  // Génération de hash cryptographique
  private async generateHash(data: string): Promise<string> {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Obtention de l'IP client (simulée)
  private async getClientIP(): Promise<string> {
    // En production, ceci serait obtenu via l'API backend
    return '192.168.1.100';
  }

  // Persistance des logs (localStorage pour la démo)
  private persistAuditLog(log: AuditLog): void {
    const existingLogs = JSON.parse(localStorage.getItem('audit_logs') || '[]');
    existingLogs.push(log);
    localStorage.setItem('audit_logs', JSON.stringify(existingLogs));
  }

  // Abonnement aux alertes
  subscribeToAlerts(callback: (alert: SystemAlert) => void): () => void {
    this.listeners.push(callback);
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private notifyListeners(alert: SystemAlert): void {
    this.listeners.forEach(listener => listener(alert));
  }

  // Génération de rapport de conformité
  generateComplianceReport(startDate: Date, endDate: Date): {
    totalOperations: number;
    userActions: { userId: string; count: number }[];
    resourceAccess: { resource: string; count: number }[];
    securityEvents: AuditLog[];
    period: { start: Date; end: Date };
  } {
    const logs = this.getAuditLogs({ startDate, endDate });
    
    const userActions = logs.reduce((acc, log) => {
      const existing = acc.find(item => item.userId === log.userId);
      if (existing) {
        existing.count++;
      } else {
        acc.push({ userId: log.userId, count: 1 });
      }
      return acc;
    }, [] as { userId: string; count: number }[]);

    const resourceAccess = logs.reduce((acc, log) => {
      const existing = acc.find(item => item.resource === log.resource);
      if (existing) {
        existing.count++;
      } else {
        acc.push({ resource: log.resource, count: 1 });
      }
      return acc;
    }, [] as { resource: string; count: number }[]);

    const securityEvents = logs.filter(log => 
      log.action.includes('login') || 
      log.action.includes('permission') || 
      log.action.includes('access_denied')
    );

    return {
      totalOperations: logs.length,
      userActions: userActions.sort((a, b) => b.count - a.count),
      resourceAccess: resourceAccess.sort((a, b) => b.count - a.count),
      securityEvents,
      period: { start: startDate, end: endDate }
    };
  }
}

export const auditService = new AuditService();
export type { AuditLog, SystemAlert };
