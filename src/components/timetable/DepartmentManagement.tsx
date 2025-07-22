
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2 } from "lucide-react";
import { ComprehensiveFormationOfferManager } from "../formation/ComprehensiveFormationOfferManager";

export const DepartmentManagement = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-6 w-6" />
            Gestion des Départements et Offres de Formation
          </CardTitle>
          <p className="text-slate-600">
            Gérez les départements, spécialités et offres de formation avec leur hiérarchie académique complète
          </p>
        </CardHeader>
      </Card>

      <Tabs defaultValue="formations" className="w-full">
        <TabsList className="grid w-full grid-cols-1">
          <TabsTrigger value="formations">Offres de Formation</TabsTrigger>
        </TabsList>

        <TabsContent value="formations">
          <ComprehensiveFormationOfferManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};
