
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function FAQPage() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>FAQ - Bourses d’Études</CardTitle>
          <CardDescription>Questions fréquentes pour le personnel de la faculté</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <strong>Q: Qui peut déposer une candidature ?</strong>
            <p>Tout étudiant inscrit dans la faculté, répondant aux critères d’éligibilité définis par le règlement des bourses.</p>
          </div>
          <div>
            <strong>Q: Quels documents sont requis ?</strong>
            <p>Relevés de notes, certificat de scolarité, lettre de motivation, et pièces spécifiques selon le type de bourse.</p>
          </div>
          <div>
            <strong>Q: Qui évalue les dossiers ?</strong>
            <p>Les candidatures sont attribuées automatiquement ou par le responsable à l’équipe d’évaluateurs référents de chaque bourse.</p>
          </div>
          <div>
            <strong>Q: Comment suivre l’état d’avancement d’une demande ?</strong>
            <p>L’état du dossier s’affiche dans le tableau de gestion des candidatures. Notifications en cas de changement ou de décision finale.</p>
          </div>
          <div>
            <strong>Q: À qui s’adresser en cas de problème ?</strong>
            <p>Contactez votre gestionnaire de bourse ou le secrétariat académique pour toute question complémentaire.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
