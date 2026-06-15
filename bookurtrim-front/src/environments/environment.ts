export const environment = {
  production: false,
  stripePublishableKey: 'pk_test_51Tb63P21tox6oZtDtMKloJBn3l3G0LKAn9AcvYXf5ve2X24lRL2SRtfW2atX4IweQp9WoOTfLHfkeeEm39M6lOtX00mkwZ7gLN',
  // En mode "single-tenant" (déploiement chez un coiffeur), renseigner l'id du prestataire :
  // le client tombe alors directement sur sa page (prestations/avis/à propos) au lieu de la landing.
  providerId: null as number | null,
};
