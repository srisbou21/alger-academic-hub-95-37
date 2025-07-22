import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  PenTool, 
  CheckCircle, 
  Shield, 
  Clock, 
  User, 
  Calendar,
  Eye,
  Download,
  Fingerprint,
  Lock,
  AlertTriangle
} from "lucide-react";

interface SignatureRequest {
  id: string;
  documentId: string;
  documentTitle: string;
  requesterName: string;
  requesterEmail: string;
  signerName: string;
  signerEmail: string;
  role: string;
  status: 'pending' | 'signed' | 'declined' | 'expired';
  requestedAt: Date;
  signedAt?: Date;
  expiresAt: Date;
  signatureMethod: 'digital_certificate' | 'biometric' | 'otp' | 'manual';
  ipAddress?: string;
  deviceInfo?: string;
  verificationLevel: 'basic' | 'standard' | 'advanced' | 'qualified';
}

interface DigitalCertificate {
  id: string;
  ownerName: string;
  ownerEmail: string;
  issuer: string;
  serialNumber: string;
  validFrom: Date;
  validTo: Date;
  status: 'active' | 'expired' | 'revoked';
  thumbprint: string;
  keyUsage: string[];
}

export const ElectronicSignatureManager = () => {
  const { toast } = useToast();
  
  const [signatureRequests, setSignatureRequests] = useState<SignatureRequest[]>([
    {
      id: '1',
      documentId: 'DOC001',
      documentTitle: 'Demande de congé - Dr. Ahmed Benali',
      requesterName: 'Dr. Ahmed Benali',
      requesterEmail: 'ahmed.benali@universite.ma',
      signerName: 'Prof. Fatima Zahra',
      signerEmail: 'fatima.zahra@universite.ma',
      role: 'Chef de département',
      status: 'pending',
      requestedAt: new Date('2024-01-15'),
      expiresAt: new Date('2024-01-25'),
      signatureMethod: 'digital_certificate',
      verificationLevel: 'advanced'
    },
    {
      id: '2',
      documentId: 'DOC002',
      documentTitle: 'Rapport de mission - Formation continue',
      requesterName: 'Prof. Mohamed Alami',
      requesterEmail: 'mohamed.alami@universite.ma',
      signerName: 'Dr. Aicha Bennani',
      signerEmail: 'aicha.bennani@universite.ma',
      role: 'Doyen',
      status: 'signed',
      requestedAt: new Date('2024-01-10'),
      signedAt: new Date('2024-01-12'),
      expiresAt: new Date('2024-01-20'),
      signatureMethod: 'biometric',
      ipAddress: '192.168.1.100',
      deviceInfo: 'Windows 11, Chrome 120',
      verificationLevel: 'qualified'
    }
  ]);

  const [certificates, setCertificates] = useState<DigitalCertificate[]>([
    {
      id: '1',
      ownerName: 'Prof. Fatima Zahra',
      ownerEmail: 'fatima.zahra@universite.ma',
      issuer: 'Autorité de Certification Maroc',
      serialNumber: 'AC-MAR-2024-001',
      validFrom: new Date('2024-01-01'),
      validTo: new Date('2026-12-31'),
      status: 'active',
      thumbprint: 'A1B2C3D4E5F6...',
      keyUsage: ['Digital Signature', 'Non Repudiation']
    },
    {
      id: '2',
      ownerName: 'Dr. Aicha Bennani',
      ownerEmail: 'aicha.bennani@universite.ma',
      issuer: 'Autorité de Certification Maroc',
      serialNumber: 'AC-MAR-2024-002',
      validFrom: new Date('2024-01-01'),
      validTo: new Date('2026-12-31'),
      status: 'active',
      thumbprint: 'B2C3D4E5F6G7...',
      keyUsage: ['Digital Signature', 'Key Encipherment']
    }
  ]);

  const [selectedRequest, setSelectedRequest] = useState<SignatureRequest | null>(null);
  const [showCertificateDialog, setShowCertificateDialog] = useState(false);
  const [activeTab, setActiveTab] = useState<'requests' | 'certificates' | 'audit'>('requests');

  const getStatusColor = (status: SignatureRequest['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'signed': return 'bg-green-100 text-green-700';
      case 'declined': return 'bg-red-100 text-red-700';
      case 'expired': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getVerificationLevelColor = (level: SignatureRequest['verificationLevel']) => {
    switch (level) {
      case 'basic': return 'bg-blue-100 text-blue-700';
      case 'standard': return 'bg-green-100 text-green-700';
      case 'advanced': return 'bg-orange-100 text-orange-700';
      case 'qualified': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getMethodIcon = (method: SignatureRequest['signatureMethod']) => {
    switch (method) {
      case 'digital_certificate': return <Shield className="h-4 w-4" />;
      case 'biometric': return <Fingerprint className="h-4 w-4" />;
      case 'otp': return <Lock className="h-4 w-4" />;
      case 'manual': return <PenTool className="h-4 w-4" />;
      default: return <PenTool className="h-4 w-4" />;
    }
  };

  const handleSignDocument = (requestId: string) => {
    setSignatureRequests(requests =>
      requests.map(req =>
        req.id === requestId
          ? {
              ...req,
              status: 'signed' as const,
              signedAt: new Date(),
              ipAddress: '192.168.1.100',
              deviceInfo: 'Windows 11, Chrome 120'
            }
          : req
      )
    );

    toast({
      title: "Document signé",
      description: "La signature électronique a été appliquée avec succès",
    });
  };

  const handleDeclineSignature = (requestId: string) => {
    setSignatureRequests(requests =>
      requests.map(req =>
        req.id === requestId ? { ...req, status: 'declined' as const } : req
      )
    );

    toast({
      title: "Signature refusée",
      description: "La demande de signature a été refusée",
    });
  };

  const stats = {
    pending: signatureRequests.filter(r => r.status === 'pending').length,
    signed: signatureRequests.filter(r => r.status === 'signed').length,
    expired: signatureRequests.filter(r => r.status === 'expired').length,
    activeCertificates: certificates.filter(c => c.status === 'active').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <PenTool className="h-8 w-8" />
            Gestionnaire de Signatures Électroniques
          </CardTitle>
          <p className="text-indigo-100">
            Système sécurisé de signatures numériques et certificats
          </p>
        </CardHeader>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-600 font-medium">En attente</p>
                <p className="text-2xl font-bold text-yellow-800">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 font-medium">Signés</p>
                <p className="text-2xl font-bold text-green-800">{stats.signed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-600 font-medium">Expirés</p>
                <p className="text-2xl font-bold text-red-800">{stats.expired}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 font-medium">Certificats</p>
                <p className="text-2xl font-bold text-blue-800">{stats.activeCertificates}</p>
              </div>
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-2 mb-6">
            <Button
              variant={activeTab === 'requests' ? 'default' : 'outline'}
              onClick={() => setActiveTab('requests')}
            >
              Demandes de signature
            </Button>
            <Button
              variant={activeTab === 'certificates' ? 'default' : 'outline'}
              onClick={() => setActiveTab('certificates')}
            >
              Certificats numériques
            </Button>
            <Button
              variant={activeTab === 'audit' ? 'default' : 'outline'}
              onClick={() => setActiveTab('audit')}
            >
              Audit et traçabilité
            </Button>
          </div>

          {/* Signature Requests */}
          {activeTab === 'requests' && (
            <div className="space-y-4">
              {signatureRequests.map((request) => (
                <Card key={request.id} className="border border-slate-200 hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold">{request.documentTitle}</h3>
                          <Badge className={getStatusColor(request.status)}>
                            {request.status}
                          </Badge>
                          <Badge className={getVerificationLevelColor(request.verificationLevel)}>
                            {request.verificationLevel}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm text-slate-600">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            Demandeur: {request.requesterName}
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            Signataire: {request.signerName}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Demandé: {request.requestedAt.toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            Expire: {request.expiresAt.toLocaleDateString()}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {getMethodIcon(request.signatureMethod)}
                          <span className="text-sm text-slate-600">
                            Méthode: {request.signatureMethod.replace('_', ' ')}
                          </span>
                          <span className="text-sm text-slate-500">
                            - Rôle: {request.role}
                          </span>
                        </div>

                        {request.signedAt && (
                          <div className="text-sm text-green-600">
                            Signé le {request.signedAt.toLocaleDateString()} à {request.signedAt.toLocaleTimeString()}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 ml-4">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedRequest(request)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {request.status === 'pending' && (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleSignDocument(request.id)}
                              className="text-green-600 hover:text-green-700"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDeclineSignature(request.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <AlertTriangle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Digital Certificates */}
          {activeTab === 'certificates' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Certificats numériques</h3>
                <Button onClick={() => setShowCertificateDialog(true)}>
                  Ajouter certificat
                </Button>
              </div>
              
              {certificates.map((cert) => (
                <Card key={cert.id} className="border border-slate-200">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Shield className="h-5 w-5 text-blue-600" />
                          <h4 className="font-semibold">{cert.ownerName}</h4>
                          <Badge variant={cert.status === 'active' ? 'default' : 'secondary'}>
                            {cert.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm text-slate-600">
                          <div>Émetteur: {cert.issuer}</div>
                          <div>N° série: {cert.serialNumber}</div>
                          <div>Valide du: {cert.validFrom.toLocaleDateString()}</div>
                          <div>Valide jusqu'au: {cert.validTo.toLocaleDateString()}</div>
                        </div>
                        
                        <div className="text-xs text-slate-500">
                          Empreinte: {cert.thumbprint}
                        </div>
                        
                        <div className="flex gap-2">
                          {cert.keyUsage.map((usage, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {usage}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Vérifier
                        </Button>
                        <Button variant="outline" size="sm">
                          Révoquer
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Audit Trail */}
          {activeTab === 'audit' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Journal d'audit des signatures</h3>
              
              <div className="space-y-2">
                {signatureRequests
                  .filter(r => r.status === 'signed')
                  .map((request) => (
                    <Card key={request.id} className="border border-slate-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{request.documentTitle}</div>
                            <div className="text-sm text-slate-600">
                              Signé par {request.signerName} le {request.signedAt?.toLocaleDateString()}
                            </div>
                            {request.ipAddress && (
                              <div className="text-xs text-slate-500">
                                IP: {request.ipAddress} - {request.deviceInfo}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-green-100 text-green-700">Vérifié</Badge>
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Request Details Dialog */}
      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className="max-w-2xl">
          {selectedRequest && (
            <>
              <DialogHeader>
                <DialogTitle>Détails de la demande de signature</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <strong>Document:</strong> {selectedRequest.documentTitle}
                  </div>
                  <div>
                    <strong>Statut:</strong> 
                    <Badge className={`ml-2 ${getStatusColor(selectedRequest.status)}`}>
                      {selectedRequest.status}
                    </Badge>
                  </div>
                  <div>
                    <strong>Demandeur:</strong> {selectedRequest.requesterName}
                  </div>
                  <div>
                    <strong>Signataire:</strong> {selectedRequest.signerName}
                  </div>
                  <div>
                    <strong>Rôle:</strong> {selectedRequest.role}
                  </div>
                  <div>
                    <strong>Méthode:</strong> {selectedRequest.signatureMethod}
                  </div>
                </div>
                
                <div className="p-4 bg-slate-50 rounded-lg">
                  <div className="text-sm">
                    <strong>Niveau de vérification:</strong> {selectedRequest.verificationLevel}
                  </div>
                  <div className="text-sm mt-2">
                    <strong>Expire le:</strong> {selectedRequest.expiresAt.toLocaleDateString()}
                  </div>
                </div>

                {selectedRequest.status === 'pending' && (
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => {
                        handleSignDocument(selectedRequest.id);
                        setSelectedRequest(null);
                      }}
                      className="flex-1"
                    >
                      <PenTool className="h-4 w-4 mr-2" />
                      Signer le document
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        handleDeclineSignature(selectedRequest.id);
                        setSelectedRequest(null);
                      }}
                    >
                      Refuser
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};