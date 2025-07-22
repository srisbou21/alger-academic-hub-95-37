
export class ChatbotService {
  private predefinedResponses = {
    "horaires": "Les salles sont disponibles de 8h à 20h du lundi au vendredi, et de 9h à 17h le samedi.",
    "réserver": "Pour réserver une salle, utilisez l'onglet Planning et cliquez sur 'Nouvelle Réservation'.",
    "conflits": "En cas de conflit, le système propose automatiquement des alternatives. Consultez l'onglet Conflits.",
    "annulation": "Vous pouvez annuler une réservation jusqu'à 2h avant le début prévu.",
    "équipements": "Les équipements disponibles incluent : vidéoprojecteur, système audio, ordinateurs, tableau interactif.",
    "capacité": "Précisez-moi le nombre de participants et je vous suggérerai les salles adaptées."
  };

  generateResponse(userInput: string): string {
    const input = userInput.toLowerCase();
    
    for (const [keyword, response] of Object.entries(this.predefinedResponses)) {
      if (input.includes(keyword)) {
        return response;
      }
    }

    if (input.includes("salle") && input.includes("libre")) {
      return "Voici les salles libres maintenant : Amphithéâtre B (200 places), Salle C12 (30 places), Labo D3 (20 places).";
    }

    if (input.includes("aide") || input.includes("help")) {
      return "Je peux vous aider avec : horaires, réservations, conflits, annulations, équipements disponibles. Que souhaitez-vous savoir ?";
    }

    return "Je n'ai pas compris votre demande. Pouvez-vous reformuler ? Tapez 'aide' pour voir ce que je peux faire.";
  }

  getQuickActions(): string[] {
    return [
      "Quelles salles sont libres maintenant ?",
      "Comment réserver une salle ?",
      "Quels sont les horaires ?",
      "Comment annuler une réservation ?"
    ];
  }
}

export const chatbotService = new ChatbotService();
