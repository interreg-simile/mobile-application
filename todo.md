## ToDo
  
- [ ] Scrivere la documentazione
    - [ ] Schede di deployment per App e API
    - [ ] Documentazione vera e propria dell'API
	- [ ] Termini e condizioni GDPR

- [ ] Implementare uso offline
    - [x] Inserimento e sincronizzazione osservazioni
    - [ ] Mostrare osservazioni salvate in grigio (+ errori e cancella)
    - [ ] Impedire click su sincronizza se sta già sincronizzando
	- [ ] Cache delle tiles di OSM


#### Done

- [x] Fornire le osservazioni in formato GeoJSON
    - [x] Riproiettare i dati in EPSG:32632 e EPSG:2056
    
- [x] Aggiungere indicazioni stradali nella pagina del singolo evento

- [x] Modificare icona e splash screen

- [x] Implementare visualizzazione dell'osservazione 

- [x] Implementare legenda/filtro mappa

- [x] Implementare ripopolamento mappa

- [x] Implementare sezione "progetto"

- [x] Implementare hardware back button
    - [x] Doppio click per chiudere l'applicazione
    - [x] Far uscire alert di sicurezza durante l'inserimento di un'osservazione
    - [x] Click per chiudere il drawer
    
- [x] Implementare pagine help

- [x] Ristrutturare la sezione Fauna

- [x] Sistemare temporaneamente utente
    - [x] Togliere da osservazioni
    - [x] Togliere da drawer
    
- [x] Iscriversi a tutti i servizi con la mail di progetto

- [x] Tradurre il sistema in inglese
    - [x] Riconoscere lingua del telefono
    - [x] Implementare cambio lingua nelle impostazioni


#### Known bugs

- [x] Le foto delle osservazioni non si vedono

- [x] Le tile della basemap si rompono dopo che si lascia la mappa
    
    
#### Future releases

- [ ] Implementare login/registrazione utenti in app
    - [ ] Implementare cancellazione delle osservazioni

- [ ] Capire dopo quanto tempo le osservazioni scompaiono dalla mappa

- [ ] Implementare sezione "quiz"

- [ ] Creare interfaccia web per admin
    - [ ] Implementare inserimento di eventi, alert, quiz
    - [ ] Implementare la visualizzazione delle osservazioni
    - [ ] Login admin con registrazione da superadmin
    
- [ ] Implementare chiamata alle autorità

- [ ] Implementare fade dei marker delle osservazioni in base alla data
