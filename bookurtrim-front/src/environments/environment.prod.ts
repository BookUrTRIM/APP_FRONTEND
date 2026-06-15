export const environment = {
  production: true,
  stripePublishableKey: 'pk_live_YOUR_KEY_HERE',
  // En mode "single-tenant" (déploiement chez un coiffeur), renseigner l'id du prestataire :
  // le client tombe alors directement sur sa page (prestations/avis/à propos) au lieu de la landing.
  providerId: null as number | null,
};
