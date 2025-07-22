
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  FileQuestion, 
  Plus, 
  Trash2, 
  Send, 
  Mail, 
  MessageSquare, 
  Users, 
  Eye,
  Settings
} from "lucide-react";

interface Question {
  id: string;
  type: 'text' | 'multiple_choice' | 'rating' | 'yes_no';
  question: string;
  options?: string[];
  required: boolean;
}

interface Questionnaire {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  targetAudience: 'all_students' | 'specific_course' | 'specific_level';
  courseSelection?: string;
  levelSelection?: string;
  deliveryMethod: 'email' | 'communication_box' | 'both';
  status: 'draft' | 'sent' | 'active';
  createdAt: Date;
  responses?: number;
}

export const QuestionnaireGenerator = () => {
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [currentQuestionnaire, setCurrentQuestionnaire] = useState<Partial<Questionnaire>>({
    title: '',
    description: '',
    questions: [],
    targetAudience: 'all_students',
    deliveryMethod: 'both',
    status: 'draft'
  });
  const [newQuestion, setNewQuestion] = useState<Partial<Question>>({
    type: 'text',
    question: '',
    required: true,
    options: []
  });
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();

  const questionTypes = [
    { value: 'text', label: 'Réponse libre' },
    { value: 'multiple_choice', label: 'Choix multiple' },
    { value: 'rating', label: 'Note (1-5)' },
    { value: 'yes_no', label: 'Oui/Non' }
  ];

  const courses = [
    'Microéconomie L3',
    'Statistiques L2', 
    'Économie générale L1',
    'Mathématiques financières M1'
  ];

  const levels = ['L1', 'L2', 'L3', 'M1', 'M2'];

  const addQuestion = () => {
    if (!newQuestion.question) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir une question",
        variant: "destructive"
      });
      return;
    }

    const question: Question = {
      id: Date.now().toString(),
      type: newQuestion.type as Question['type'],
      question: newQuestion.question,
      required: newQuestion.required || true,
      ...(newQuestion.type === 'multiple_choice' && { options: newQuestion.options || [] })
    };

    setCurrentQuestionnaire(prev => ({
      ...prev,
      questions: [...(prev.questions || []), question]
    }));

    setNewQuestion({
      type: 'text',
      question: '',
      required: true,
      options: []
    });

    toast({
      title: "Question ajoutée",
      description: "La question a été ajoutée au questionnaire"
    });
  };

  const removeQuestion = (questionId: string) => {
    setCurrentQuestionnaire(prev => ({
      ...prev,
      questions: prev.questions?.filter(q => q.id !== questionId) || []
    }));
  };

  const addOption = () => {
    setNewQuestion(prev => ({
      ...prev,
      options: [...(prev.options || []), '']
    }));
  };

  const updateOption = (index: number, value: string) => {
    setNewQuestion(prev => ({
      ...prev,
      options: prev.options?.map((opt, i) => i === index ? value : opt) || []
    }));
  };

  const removeOption = (index: number) => {
    setNewQuestion(prev => ({
      ...prev,
      options: prev.options?.filter((_, i) => i !== index) || []
    }));
  };

  const saveQuestionnaire = () => {
    if (!currentQuestionnaire.title || !currentQuestionnaire.questions?.length) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir un titre et au moins une question",
        variant: "destructive"
      });
      return;
    }

    const questionnaire: Questionnaire = {
      ...currentQuestionnaire,
      id: Date.now().toString(),
      createdAt: new Date(),
      responses: 0
    } as Questionnaire;

    setQuestionnaires(prev => [questionnaire, ...prev]);
    setCurrentQuestionnaire({
      title: '',
      description: '',
      questions: [],
      targetAudience: 'all_students',
      deliveryMethod: 'both',
      status: 'draft'
    });

    toast({
      title: "Questionnaire sauvegardé",
      description: "Le questionnaire a été sauvegardé en brouillon"
    });
  };

  const sendQuestionnaire = (id: string) => {
    setQuestionnaires(prev => 
      prev.map(q => 
        q.id === id 
          ? { ...q, status: 'sent' as const }
          : q
      )
    );

    const questionnaire = questionnaires.find(q => q.id === id);
    const deliveryText = questionnaire?.deliveryMethod === 'both' 
      ? 'par email et dans la boîte de communication'
      : questionnaire?.deliveryMethod === 'email'
      ? 'par email'
      : 'dans la boîte de communication';

    toast({
      title: "Questionnaire envoyé",
      description: `Le questionnaire a été envoyé ${deliveryText}`
    });
  };

  const getAudienceText = (questionnaire: Questionnaire) => {
    switch (questionnaire.targetAudience) {
      case 'all_students':
        return 'Tous les étudiants';
      case 'specific_course':
        return `Cours: ${questionnaire.courseSelection}`;
      case 'specific_level':
        return `Niveau: ${questionnaire.levelSelection}`;
      default:
        return 'Non défini';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-purple-200">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100">
          <CardTitle className="flex items-center gap-2 text-purple-800">
            <FileQuestion className="h-5 w-5" />
            Générateur de Questionnaires
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Configuration du questionnaire */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Titre du questionnaire *</label>
              <Input
                value={currentQuestionnaire.title || ''}
                onChange={(e) => setCurrentQuestionnaire(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Ex: Évaluation du cours de microéconomie"
                className="border-purple-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Textarea
                value={currentQuestionnaire.description || ''}
                onChange={(e) => setCurrentQuestionnaire(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Décrivez l'objectif du questionnaire..."
                className="border-purple-200"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Public cible</label>
                <Select 
                  value={currentQuestionnaire.targetAudience} 
                  onValueChange={(value: any) => setCurrentQuestionnaire(prev => ({ ...prev, targetAudience: value }))}
                >
                  <SelectTrigger className="border-purple-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all_students">Tous les étudiants</SelectItem>
                    <SelectItem value="specific_course">Cours spécifique</SelectItem>
                    <SelectItem value="specific_level">Niveau spécifique</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {currentQuestionnaire.targetAudience === 'specific_course' && (
                <div>
                  <label className="block text-sm font-medium mb-2">Cours</label>
                  <Select 
                    value={currentQuestionnaire.courseSelection || ''} 
                    onValueChange={(value) => setCurrentQuestionnaire(prev => ({ ...prev, courseSelection: value }))}
                  >
                    <SelectTrigger className="border-purple-200">
                      <SelectValue placeholder="Sélectionner un cours" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map(course => (
                        <SelectItem key={course} value={course}>{course}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {currentQuestionnaire.targetAudience === 'specific_level' && (
                <div>
                  <label className="block text-sm font-medium mb-2">Niveau</label>
                  <Select 
                    value={currentQuestionnaire.levelSelection || ''} 
                    onValueChange={(value) => setCurrentQuestionnaire(prev => ({ ...prev, levelSelection: value }))}
                  >
                    <SelectTrigger className="border-purple-200">
                      <SelectValue placeholder="Sélectionner un niveau" />
                    </SelectTrigger>
                    <SelectContent>
                      {levels.map(level => (
                        <SelectItem key={level} value={level}>{level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">Mode d'envoi</label>
                <Select 
                  value={currentQuestionnaire.deliveryMethod} 
                  onValueChange={(value: any) => setCurrentQuestionnaire(prev => ({ ...prev, deliveryMethod: value }))}
                >
                  <SelectTrigger className="border-purple-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email uniquement</SelectItem>
                    <SelectItem value="communication_box">Boîte de communication</SelectItem>
                    <SelectItem value="both">Email + Communication</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Ajout de questions */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium mb-4">Questions du questionnaire</h3>
            
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Type de question</label>
                  <Select 
                    value={newQuestion.type} 
                    onValueChange={(value: any) => setNewQuestion(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {questionTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2 pt-8">
                  <input
                    type="checkbox"
                    checked={newQuestion.required}
                    onChange={(e) => setNewQuestion(prev => ({ ...prev, required: e.target.checked }))}
                    className="rounded border-gray-300"
                  />
                  <label className="text-sm">Question obligatoire</label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Question *</label>
                <Textarea
                  value={newQuestion.question || ''}
                  onChange={(e) => setNewQuestion(prev => ({ ...prev, question: e.target.value }))}
                  placeholder="Saisissez votre question..."
                />
              </div>

              {newQuestion.type === 'multiple_choice' && (
                <div>
                  <label className="block text-sm font-medium mb-2">Options de réponse</label>
                  <div className="space-y-2">
                    {newQuestion.options?.map((option, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={option}
                          onChange={(e) => updateOption(index, e.target.value)}
                          placeholder={`Option ${index + 1}`}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeOption(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addOption}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter une option
                    </Button>
                  </div>
                </div>
              )}

              <Button onClick={addQuestion} className="bg-purple-600 hover:bg-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter la question
              </Button>
            </div>
          </div>

          {/* Questions ajoutées */}
          {currentQuestionnaire.questions && currentQuestionnaire.questions.length > 0 && (
            <div className="border-t pt-6">
              <h4 className="font-medium mb-4">Questions ajoutées ({currentQuestionnaire.questions.length})</h4>
              <div className="space-y-3">
                {currentQuestionnaire.questions.map((question, index) => (
                  <div key={question.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium">Q{index + 1}.</span>
                          <Badge variant="outline">{questionTypes.find(t => t.value === question.type)?.label}</Badge>
                          {question.required && <Badge className="bg-red-100 text-red-800">Obligatoire</Badge>}
                        </div>
                        <p className="text-gray-700">{question.question}</p>
                        {question.options && question.options.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-500">Options:</p>
                            <ul className="text-sm text-gray-600 ml-4">
                              {question.options.map((option, idx) => (
                                <li key={idx}>• {option}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeQuestion(question.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-6 border-t">
            <Button onClick={saveQuestionnaire} variant="outline">
              Sauvegarder en brouillon
            </Button>
            <Button onClick={() => setShowPreview(true)} variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              Aperçu
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Liste des questionnaires */}
      <Card>
        <CardHeader>
          <CardTitle>Questionnaires créés ({questionnaires.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {questionnaires.map((questionnaire) => (
              <div key={questionnaire.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium">{questionnaire.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{questionnaire.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span><Users className="h-3 w-3 inline mr-1" />{getAudienceText(questionnaire)}</span>
                      <span>{questionnaire.questions.length} questions</span>
                      <span>
                        {questionnaire.deliveryMethod === 'email' && <Mail className="h-3 w-3 inline mr-1" />}
                        {questionnaire.deliveryMethod === 'communication_box' && <MessageSquare className="h-3 w-3 inline mr-1" />}
                        {questionnaire.deliveryMethod === 'both' && <><Mail className="h-3 w-3 inline mr-1" /><MessageSquare className="h-3 w-3 inline mr-1" /></>}
                        {questionnaire.deliveryMethod === 'both' ? 'Email + Communication' : 
                         questionnaire.deliveryMethod === 'email' ? 'Email' : 'Communication'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={
                      questionnaire.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                      questionnaire.status === 'sent' ? 'bg-green-100 text-green-800' :
                      'bg-blue-100 text-blue-800'
                    }>
                      {questionnaire.status === 'draft' ? 'Brouillon' :
                       questionnaire.status === 'sent' ? 'Envoyé' : 'Actif'}
                    </Badge>
                    {questionnaire.status === 'draft' && (
                      <Button
                        size="sm"
                        onClick={() => sendQuestionnaire(questionnaire.id)}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Envoyer
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {questionnaires.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <FileQuestion className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Aucun questionnaire créé pour le moment</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
