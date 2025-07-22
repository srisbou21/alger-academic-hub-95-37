
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Settings, Database, Shield, Bell, FileText, 
  Users, Clock, Download, Upload, Save
} from "lucide-react";
import { useState } from "react";

export const SystemConfiguration = () => {
  const [config, setConfig] = useState({
    // Paramètres pédagogiques
    semesterDuration: 16,
    gradeScale: 20,
    passingGrade: 10,
    maxAbsences: 3,
    
    // Paramètres système
    sessionTimeout: 60,
    maxFileSize: 10,
    backupFrequency: 'daily',
    
    // Paramètres sécurité
    passwordMinLength: 8,
    twoFactorAuth: false,
    ipRestriction: false,
    
    // Paramètres notifications
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    
    // Paramètres conformité
    dataRetentionPeriod: 7,
    auditLogLevel: 'detailed',
    gdprCompliance: true
  });

  const handleConfigChange = (key: string, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const saveConfiguration = () => {
    console.log("Configuration sauvegardée:", config);
    // Ici on sauvegarderait via l'API
  };

  const exportConfiguration = () => {
    const configBlob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(configBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fsecsg-config-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-slate-800">Configuration Système</h3>
          <p className="text-slate-600">Paramètres globaux et configuration avancée</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportConfiguration}>
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
          <Button onClick={saveConfiguration} className="bg-blue-600 hover:bg-blue-700">
            <Save className="mr-2 h-4 w-4" />
            Sauvegarder
          </Button>
        </div>
      </div>

      <Tabs defaultValue="academic" className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-6">
          <TabsTrigger value="academic">
            <FileText className="h-4 w-4 mr-2" />
            Pédagogique
          </TabsTrigger>
          <TabsTrigger value="system">
            <Settings className="h-4 w-4 mr-2" />
            Système
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            Sécurité
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="compliance">
            <Database className="h-4 w-4 mr-2" />
            Conformité
          </TabsTrigger>
        </TabsList>

        <TabsContent value="academic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres Pédagogiques</CardTitle>
              <CardDescription>Configuration des règles académiques</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="semesterDuration">Durée semestre (semaines)</Label>
                  <Input
                    id="semesterDuration"
                    type="number"
                    value={config.semesterDuration}
                    onChange={(e) => handleConfigChange('semesterDuration', parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gradeScale">Échelle de notation</Label>
                  <Input
                    id="gradeScale"
                    type="number"
                    value={config.gradeScale}
                    onChange={(e) => handleConfigChange('gradeScale', parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passingGrade">Note de passage</Label>
                  <Input
                    id="passingGrade"
                    type="number"
                    value={config.passingGrade}
                    onChange={(e) => handleConfigChange('passingGrade', parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxAbsences">Absences maximum autorisées</Label>
                  <Input
                    id="maxAbsences"
                    type="number"
                    value={config.maxAbsences}
                    onChange={(e) => handleConfigChange('maxAbsences', parseInt(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres Système</CardTitle>
              <CardDescription>Configuration technique et performance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Timeout session (minutes)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={config.sessionTimeout}
                    onChange={(e) => handleConfigChange('sessionTimeout', parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxFileSize">Taille max fichier (MB)</Label>
                  <Input
                    id="maxFileSize"
                    type="number"
                    value={config.maxFileSize}
                    onChange={(e) => handleConfigChange('maxFileSize', parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="backupFrequency">Fréquence sauvegarde</Label>
                  <Select value={config.backupFrequency} onValueChange={(value) => handleConfigChange('backupFrequency', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Toutes les heures</SelectItem>
                      <SelectItem value="daily">Quotidienne</SelectItem>
                      <SelectItem value="weekly">Hebdomadaire</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres Sécurité</CardTitle>
              <CardDescription>Configuration sécurisée du système</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="passwordMinLength">Longueur min. mot de passe</Label>
                  <Input
                    id="passwordMinLength"
                    type="number"
                    value={config.passwordMinLength}
                    onChange={(e) => handleConfigChange('passwordMinLength', parseInt(e.target.value))}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="twoFactorAuth"
                    checked={config.twoFactorAuth}
                    onCheckedChange={(checked) => handleConfigChange('twoFactorAuth', checked)}
                  />
                  <Label htmlFor="twoFactorAuth">Authentification 2FA</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="ipRestriction"
                    checked={config.ipRestriction}
                    onCheckedChange={(checked) => handleConfigChange('ipRestriction', checked)}
                  />
                  <Label htmlFor="ipRestriction">Restriction par IP</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres Notifications</CardTitle>
              <CardDescription>Configuration des alertes et notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="emailNotifications"
                    checked={config.emailNotifications}
                    onCheckedChange={(checked) => handleConfigChange('emailNotifications', checked)}
                  />
                  <Label htmlFor="emailNotifications">Notifications email</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="smsNotifications"
                    checked={config.smsNotifications}
                    onCheckedChange={(checked) => handleConfigChange('smsNotifications', checked)}
                  />
                  <Label htmlFor="smsNotifications">Notifications SMS</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="pushNotifications"
                    checked={config.pushNotifications}
                    onCheckedChange={(checked) => handleConfigChange('pushNotifications', checked)}
                  />
                  <Label htmlFor="pushNotifications">Notifications push</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Conformité et Audit</CardTitle>
              <CardDescription>Configuration conformité RGPD et audit</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dataRetentionPeriod">Rétention données (années)</Label>
                  <Input
                    id="dataRetentionPeriod"
                    type="number"
                    value={config.dataRetentionPeriod}
                    onChange={(e) => handleConfigChange('dataRetentionPeriod', parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="auditLogLevel">Niveau logs audit</Label>
                  <Select value={config.auditLogLevel} onValueChange={(value) => handleConfigChange('auditLogLevel', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="minimal">Minimal</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="detailed">Détaillé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="gdprCompliance"
                    checked={config.gdprCompliance}
                    onCheckedChange={(checked) => handleConfigChange('gdprCompliance', checked)}
                  />
                  <Label htmlFor="gdprCompliance">Mode conformité RGPD</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
