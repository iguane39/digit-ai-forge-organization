/* Asset externe de demonstration — RS-1 (TF-0837) : sur une application dont la
   politique CSP est script-src 'self' (aucun script inline, aucun nonce disponible en
   fixture statique), l'initialisation du composant vit ICI, dans un fichier .js
   reference par <script src>, jamais dans un <script> inline du document audite. */
DigitAITableFilters.initAll();
