
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Settings, Users, Bell, Database, Shield, Save } from "lucide-react";

export const ScholarshipSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    notifications: {
      emailEnabled: true,
      smsEnabled: false,
      reminderDays: 7,
      autoNotifications: true
    },
    evaluation: {
      minEvaluators: 2,
      maxEvaluators: 3,
      evaluationDeadline: 14,
      autoAssignment: true
    },
    system: {
      autoArchive: true,
      archiveDays: 365,
      backupEnabled: true,
      auditLog: true
    },
    permissions: {
      studentAccess: true,
      teacherAccess: true,
      adminAccess: true
    }
  });

  const handleSaveSettings = () => {
    toast({
      title: "Paramètres sauvegardés",
      description: "Les modifications ont été appliquées avec succès"
    });
  };

  const updateSetting = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configuration du Système
          </CardTitle>
          <CardDescription>
            Paramètres et configuration de la gestion des bourses
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="emailEnabled">Notifications par email</Label>
              <Switch
                id="emailEnabled"
                checked={settings.notifications.emailEnabled}
                onCheckedChange={(value) => updateSetting('notifications', 'emailEnabled', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="smsEnabled">Notifications par SMS</Label>
              <Switch
                id="smsEnabled"
                checked={settings.notifications.smsEnabled}
                onCheckedChange={(value) => updateSetting('notifications', 'smsEnabled', value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reminderDays">Rappel avant échéance (jours)</Label>
              <Input
                id="reminderDays"
                type="number"
                value={settings.notifications.reminderDays}
                onChange={(e) => updateSetting('notifications', 'reminderDays', parseInt(e.target.value))}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="autoNotifications">Notifications automatiques</Label>
              <Switch
                id="autoNotifications"
                checked={settings.notifications.autoNotifications}
                onCheckedChange={(value) => updateSetting('notifications', 'autoNotifications', value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Évaluation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Processus d'Évaluation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="minEvaluators">Nombre minimum d'évaluateurs</Label>
              <Select 
                value={settings.evaluation.minEvaluators.toString()}
                onValueChange={(value) => updateSetting('evaluation', 'minEvaluators', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxEvaluators">Nombre maximum d'évaluateurs</Label>
              <Select 
                value={settings.evaluation.maxEvaluators.toString()}
                onValueChange={(value) => updateSetting('evaluation', 'maxEvaluators', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="evaluationDeadline">Délai d'évaluation (jours)</Label>
              <Input
                id="evaluationDeadline"
                type="number"
                value={settings.evaluation.evaluationDeadline}
                onChange={(e) => updateSetting('evaluation', 'evaluationDeadline', parseInt(e.target.value))}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="autoAssignment">Attribution automatique</Label>
              <Switch
                id="autoAssignment"
                checked={settings.evaluation.autoAssignment}
                onCheckedChange={(value) => updateSetting('evaluation', 'autoAssignment', value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Système */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Paramètres Système
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="autoArchive">Archivage automatique</Label>
              <Switch
                id="autoArchive"
                checked={settings.system.autoArchive}
                onCheckedChange={(value) => updateSetting('system', 'autoArchive', value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="archiveDays">Délai d'archivage (jours)</Label>
              <Input
                id="archiveDays"
                type="number"
                value={settings.system.archiveDays}
                onChange={(e) => updateSetting('system', 'archiveDays', parseInt(e.target.value))}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="backupEnabled">Sauvegarde automatique</Label>
              <Switch
                id="backupEnabled"
                checked={settings.system.backupEnabled}
                onCheckedChange={(value) => updateSetting('system', 'backupEnabled', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="auditLog">Journal d'audit</Label>
              <Switch
                id="auditLog"
                checked={settings.system.auditLog}
                onCheckedChange={(value) => updateSetting('system', 'auditLog', value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Permissions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Contrôle d'Accès
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="studentAccess">Accès étudiants</Label>
              <Switch
                id="studentAccess"
                checked={settings.permissions.studentAccess}
                onCheckedChange={(value) => updateSetting('permissions', 'studentAccess', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="teacherAccess">Accès enseignants</Label>
              <Switch
                id="teacherAccess"
                checked={settings.permissions.teacherAccess}
                onCheckedChange={(value) => updateSetting('permissions', 'teacherAccess', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="adminAccess">Accès administrateurs</Label>
              <Switch
                id="adminAccess"
                checked={settings.permissions.adminAccess}
                onCheckedChange={(value) => updateSetting('permissions', 'adminAccess', value)}
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Rôles personnalisés</Label>
              <Button variant="outline" className="w-full">
                Gérer les Rôles
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions globales */}
      <Card>
        <CardHeader>
          <CardTitle>Actions de Maintenance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline">
              Exporter la Configuration
            </Button>
            <Button variant="outline">
              Importer la Configuration
            </Button>
            <Button variant="outline">
              Réinitialiser les Paramètres
            </Button>
          </div>
          
          <Separator />
          
          <Button onClick={handleSaveSettings} className="w-full">
            <Save className="h-4 w-4 mr-2" />
            Sauvegarder tous les Paramètres
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
