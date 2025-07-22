
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { History, User, Calendar, FileText, Filter, Download } from "lucide-react";
import { FormationOffer } from "../../../types/academic";

interface AuditEntry {
  id: string;
  timestamp: Date;
  userId: string;
  userName: string;
  action: 'create' | 'update' | 'delete' | 'validate' | 'reject' | 'duplicate';
  entity: 'formation' | 'module' | 'section' | 'validation';
  entityId: string;
  entityName: string;
  details: string;
  changes?: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];
}

interface FormationAuditTrailProps {
  formations: FormationOffer[];
}

export const FormationAuditTrail = ({ formations }: FormationAuditTrailProps) => {
  const [auditEntries] = useState<AuditEntry[]>([
    {
      id: '1',
      timestamp: new Date('2024-06-20T10:30:00'),
      userId: 'user1',
      userName: 'Dr. Ahmed Benali',
      action: 'create',
      entity: 'formation',
      entityId: 'form1',
      entityName: 'Licence Informatique',
      details: 'Création de la formation Licence Informatique'
    },
    {
      id: '2',
      timestamp: new Date('2024-06-21T14:15:00'),
      userId: 'user2',
      userName: 'Prof. Sarah Amari',
      action: 'update',
      entity: 'formation',
      entityId: 'form1',
      entityName: 'Licence Informatique',
      details: 'Modification des objectifs pédagogiques',
      changes: [
        {
          field: 'pedagogicalObjectives',
          oldValue: ['Objectif 1', 'Objectif 2'],
          newValue: ['Objectif 1', 'Objectif 2', 'Objectif 3']
        }
      ]
    },
    {
      id: '3',
      timestamp: new Date('2024-06-22T09:45:00'),
      userId: 'user3',
      userName: 'Admin System',
      action: 'validate',
      entity: 'validation',
      entityId: 'val1',
      entityName: 'Licence Informatique',
      details: 'Validation pédagogique approuvée'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [entityFilter, setEntityFilter] = useState('all');
  const [userFilter, setUserFilter] = useState('all');

  const filteredEntries = auditEntries.filter(entry => {
    const matchesSearch = entry.entityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.userName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = actionFilter === 'all' || entry.action === actionFilter;
    const matchesEntity = entityFilter === 'all' || entry.entity === entityFilter;
    const matchesUser = userFilter === 'all' || entry.userId === userFilter;
    
    return matchesSearch && matchesAction && matchesEntity && matchesUser;
  });

  const getActionBadge = (action: string) => {
    const styles = {
      create: "bg-blue-100 text-blue-800",
      update: "bg-yellow-100 text-yellow-800",
      delete: "bg-red-100 text-red-800",
      validate: "bg-green-100 text-green-800",
      reject: "bg-red-100 text-red-800",
      duplicate: "bg-purple-100 text-purple-800"
    };
    return styles[action as keyof typeof styles] || "bg-gray-100 text-gray-800";
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'create': return '➕';
      case 'update': return '✏️';
      case 'delete': return '🗑️';
      case 'validate': return '✅';
      case 'reject': return '❌';
      case 'duplicate': return '📋';
      default: return '📝';
    }
  };

  const exportAuditTrail = () => {
    const csvContent = [
      ['Date', 'Utilisateur', 'Action', 'Entité', 'Nom', 'Détails'].join(','),
      ...filteredEntries.map(entry => [
        entry.timestamp.toISOString(),
        entry.userName,
        entry.action,
        entry.entity,
        entry.entityName,
        entry.details
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit_trail_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Piste d'Audit des Formations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div>
              <Input
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les actions</SelectItem>
                  <SelectItem value="create">Création</SelectItem>
                  <SelectItem value="update">Modification</SelectItem>
                  <SelectItem value="delete">Suppression</SelectItem>
                  <SelectItem value="validate">Validation</SelectItem>
                  <SelectItem value="reject">Rejet</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={entityFilter} onValueChange={setEntityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Entité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les entités</SelectItem>
                  <SelectItem value="formation">Formation</SelectItem>
                  <SelectItem value="module">Module</SelectItem>
                  <SelectItem value="section">Section</SelectItem>
                  <SelectItem value="validation">Validation</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={userFilter} onValueChange={setUserFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Utilisateur" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les utilisateurs</SelectItem>
                  <SelectItem value="user1">Dr. Ahmed Benali</SelectItem>
                  <SelectItem value="user2">Prof. Sarah Amari</SelectItem>
                  <SelectItem value="user3">Admin System</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Button onClick={exportAuditTrail} variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Historique des Actions ({filteredEntries.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredEntries.map((entry) => (
              <div key={entry.id} className="border-l-4 border-blue-200 pl-4 py-3 bg-slate-50 rounded-r-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{getActionIcon(entry.action)}</span>
                    <div>
                      <h4 className="font-medium text-slate-800">{entry.entityName}</h4>
                      <p className="text-sm text-slate-600">{entry.details}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={getActionBadge(entry.action)}>
                      {entry.action}
                    </Badge>
                    <p className="text-xs text-slate-500 mt-1">
                      {entry.timestamp.toLocaleString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-slate-600">
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span>{entry.userName}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    <span>{entry.entity}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{entry.timestamp.toLocaleDateString()}</span>
                  </div>
                </div>

                {entry.changes && entry.changes.length > 0 && (
                  <div className="mt-3 p-3 bg-white rounded border">
                    <h5 className="text-sm font-medium mb-2">Modifications détaillées :</h5>
                    {entry.changes.map((change, index) => (
                      <div key={index} className="text-xs space-y-1">
                        <p><strong>Champ:</strong> {change.field}</p>
                        <p><strong>Ancienne valeur:</strong> {JSON.stringify(change.oldValue)}</p>
                        <p><strong>Nouvelle valeur:</strong> {JSON.stringify(change.newValue)}</p>
                        {index < entry.changes!.length - 1 && <hr className="my-2" />}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {filteredEntries.length === 0 && (
              <div className="text-center py-8">
                <History className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-500">Aucune entrée d'audit trouvée</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
