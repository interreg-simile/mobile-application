## ToDo

- [x] Fornire le osservazioni in formato GeoJSON
    - [ ] Riproiettare i dati in EPSG:32632 e _sistema svizzero (?)_
    
- [ ] Scrivere la documentazione
    - [ ] Schede di deployment per App e API
    - [ ] Documentazione vera e propria dell'API
	- [ ] Termini e condizioni GDPR
  
- [ ] Implementare login e registrazione

- [ ] Implementare uso offline
	- [ ] Cache delle tiles di OSM

- [ ] Tradurre il sistema in inglese
    - [x] Riconoscere lingua del telefono
    - [ ] Implementare cambio lingua nelle impostazioni

- [ ] Ristrutturare la sezione Fauna

- [ ] Implementare pagine help

- [ ] Implementare eliminazione osservazione (?)

- [ ] Implementare inserimento di eventi e alert dall'applicazione per gli utenti admin (?)


#### Done

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


#### Known bugs

- [ ] Le tile della basemap si rompono dopo che si lascia la mappa
    - [ ] Provare a inserire un'altra basemap
    - [ ] Provare a togliere il position watcher
    
    
#### Future realeases

- [ ] Capire dopo quanto tempo le osservazioni scompaiono dalla mappa

- [ ] Implementare sezione "quiz"

- [ ] Creare interfaccia web per admin
    - [ ] Implementare inserimento di eventi, alert, quiz
    - [ ] Implementare la visualizzazione delle osservazioni
    - [ ] Login admin con registrazione da superadmin
    
- [ ] Implementare chiamata alle autorità
