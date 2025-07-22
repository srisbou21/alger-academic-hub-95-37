import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, PenTool, Archive, Workflow } from "lucide-react";
import { DigitalWorkflowManager } from './DigitalWorkflowManager';
import { ElectronicSignatureManager } from './ElectronicSignatureManager';
import { DigitalArchiveManager } from './DigitalArchiveManager';

export const DigitalFacultyManager = () => {
  const [activeTab, setActiveTab] = useState("workflows");

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-emerald-600 to-green-600 text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <FileText className="h-8 w-8" />
            Gestion Numérique Sans Papier
          </CardTitle>
          <p className="text-emerald-100">
            Système complet de dématérialisation pour une faculté moderne et écologique
          </p>
        </CardHeader>
      </Card>

      {/* Digital Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 font-medium">Documents numériques</p>
                <p className="text-2xl font-bold text-blue-800">1,247</p>
                <p className="text-xs text-blue-500">+18% ce mois</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 font-medium">Signatures électroniques</p>
                <p className="text-2xl font-bold text-purple-800">324</p>
                <p className="text-xs text-purple-500">+25% ce mois</p>
              </div>
              <PenTool className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 font-medium">Workflows automatisés</p>
                <p className="text-2xl font-bold text-green-800">89</p>
                <p className="text-xs text-green-500">+12% ce mois</p>
              </div>
              <Workflow className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 font-medium">Documents archivés</p>
                <p className="text-2xl font-bold text-orange-800">5,629</p>
                <p className="text-xs text-orange-500">+8% ce mois</p>
              </div>
              <Archive className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Environmental Impact */}
      <Card className="bg-gradient-to-r from-green-100 to-emerald-100 border-green-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-green-800">Impact Environnemental</h3>
              <div className="grid grid-cols-3 gap-6 mt-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-700">12,450</p>
                  <p className="text-sm text-green-600">Feuilles économisées</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-700">8.7 kg</p>
                  <p className="text-sm text-green-600">CO2 évité</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-700">156L</p>
                  <p className="text-sm text-green-600">Eau économisée</p>
                </div>
              </div>
            </div>
            <div className="text-6xl">🌱</div>
          </div>
        </CardContent>
      </Card>

      {/* Digital Management Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-white shadow-sm border border-slate-200">
          <TabsTrigger 
            value="workflows"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            <Workflow className="h-4 w-4 mr-2" />
            Workflows Numériques
          </TabsTrigger>
          <TabsTrigger 
            value="signatures"
            className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
          >
            <PenTool className="h-4 w-4 mr-2" />
            Signatures Électroniques
          </TabsTrigger>
          <TabsTrigger 
            value="archives"
            className="data-[state=active]:bg-orange-600 data-[state=active]:text-white"
          >
            <Archive className="h-4 w-4 mr-2" />
            Archives Numériques
          </TabsTrigger>
        </TabsList>

        <TabsContent value="workflows" className="space-y-6">
          <DigitalWorkflowManager />
        </TabsContent>

        <TabsContent value="signatures" className="space-y-6">
          <ElectronicSignatureManager />
        </TabsContent>

        <TabsContent value="archives" className="space-y-6">
          <DigitalArchiveManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};