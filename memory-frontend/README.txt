https://hanze-hbo-ict.github.io/webtech3/


First, navigate to this repository's backend submodule part. make sure that works.
then initialize it's front end port here (as described to be port :8080)
there you go, the index page should point you in the right direction.




TODO:

Maak een pagina waarmee een speler zich bij deze backend kan registeren.

Maak een andere pagina waarop de speler zich kan aanmelden. De backend geeft bij correcte gegevens een JWT token terug dat standaard een TTL heeft van 3600 seconden.

Sla het JWT op in de localStorage en zorg ervoor dat dit bij elke request naar de backend in de header wordt meegestuurd.

Maak een nieuwe pagina waarop de speler zijn of haar voorkeuren kan opgeven. Deze voorkeuren bestaan uit de favoriete plaatjes-API, de kleur voor gevonden kaartjes en de kleur voor gesloten kaarten.

Het moet voor de speler ook mogelijk zijn het opgegeven e-mailadres te wijzigen. Dat kun je op dezelfde pagina doen als waar de voorkeuren worden bijgehouden, of je kunt hier weer een nieuwe pagina voor maken.

Als de TTL van het JWT verlopen is, moet de speler een melding krijgen en naar de loginpagina verwezen worden. Tip: om dit te testen kun je de TTL in symfony aanpassen. Voeg daarvoor in config/packages/lexik_jwt_authentication.yaml een key token_ttl toe met een waarde in seconden:

	>>lexik_jwt_authentication:
	>>   secret_key: '%env(resolve:JWT_SECRET_KEY)%'
	>>   public_key: '%env(resolve:JWT_PUBLIC_KEY)%'
	>>   pass_phrase: '%env(JWT_PASSPHRASE)%'
	>>  token_ttl: 300
	


