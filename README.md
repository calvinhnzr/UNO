<a name="readme-top"></a>

<!-- [![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url] -->

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/antonztsv/FDDWSS22_HinzerZaitsev">
    <img src="./docs/images/logo.png" alt="Logo" width="100" height="100">
  </a>

<h3 align="center"><strong>UNO Kartenspiel</strong></h3>

  <p align="center">
    Projekt im Modul Frameworks, Dienste und Daten im Web
    <br />
    <br />
    <p><strong>Calvin Hinzer</strong> - <a href="mailto:calvin.hinzer@smail.th-koeln.de ">calvin.hinzer@smail.th-koeln.de </a></p>
    <p><strong>Anton Zaitsev</strong> - <a href="mailto:anton.zaitsev@smail.th-koeln.de">anton.zaitsev@smail.th-koeln.de</a></p>
    <br>
  </p>
</div>

<!-- ABOUT THE PROJECT -->

## **Über das Projekt**

[![Product Name Screen Shot][product-screenshot]](#)

Für das Modul Frameworks, Dienste und Daten im Web wurde als Projekt das Kartenspiel UNO in vereinfachter Form entwickelt und umgesetzt.
Dabei wurde der Fokus auf eine in Microservices aufgeteilte ereignisgesteuerte Architektur gelegt.

<p align="right">(<a href="#readme-top">Zum Anfang</a>)</p>

### Spielregeln

Für das Spiel gibt es ein eigenes Kartendeck mit 108 Karten. Die Karten haben vier Farben (blau, grün, rot, gelb) und die Werte von neun bis null. Hinzu kommen drei Aktionskarten in jeder Farbe sowie acht schwarze Aktionskarten. Da jede Karte bis auf die Null und die schwarzen Aktionskarten doppelt sind, kommen am Ende 108 Karten zusammen.

Jeder Spieler erhält zu Beginn des Spiels sieben Karten auf die Hand. Anschließend werden reihum Karten abgelegt. Karten können dabei nur auf dieselbe Farbe oder Werte abgelegt werden. Aktionskarten haben dabei unterschiedliche Funktionen (Zwei ziehen, Aussetzen, Richtungswechsel und Vier ziehen, Farbwechsel).
Gewonnen hat der Spieler, der alle Karten als erstes abgelegt hat.

<p align="right">(<a href="#readme-top">Zum Anfang</a>)</p>

### **Verwendete Technologien**

<br>

![Node.js Badge](https://img.shields.io/badge/Node.js-393?logo=nodedotjs&logoColor=fff&style=for-the-badge)
![RabbitMQ Badge](https://img.shields.io/badge/RabbitMQ-F60?logo=rabbitmq&logoColor=fff&style=for-the-badge)
![React Badge](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=000&style=for-the-badge)
![Docker Badge](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=fff&style=for-the-badge)
![Socket.io Badge](https://img.shields.io/badge/Socket.io-010101?logo=socketdotio&logoColor=fff&style=for-the-badge)
![npm Badge](https://img.shields.io/badge/npm-CB3837?logo=npm&logoColor=fff&style=for-the-badge)
![Git Badge](https://img.shields.io/badge/Git-F05032?logo=git&logoColor=fff&style=for-the-badge)

Die einzelnen Microservices im Backend wurden mit dem serverseitigem [Javascript Framework Node.js](https://nodejs.org/en/) umgesetzt. Dieses ermöglicht, vor allem durch die Einbindung von [externen NPM-Packages](https://www.npmjs.com/), eine schnelle und unkomplizierte Implementierung von Funktionalitäten. Die Kommunikaton zwischen den Services erfolgt durch die Anbindung eines RabbitMQ Brokers, wodurch ein asynchroner Austausch von Nachrichten, auch im Falle eines Serviceausfalls, stattfinden kann.

Für das Frontend wurde die [Javascript-Library React](https://reactjs.org/) verwendet. **Beschreibung wieso??**

Der Austausch von Spieldaten zwischen dem Frontend und den jeweiligen Services wird über die [Socket.io Bibliothek](https://socket.io/) realisiert. Diese baut auf dem Websocket Protokoll auf und bietet erweiterte Funktionen, wie z.B. eine garantierte Fallback-Lösung auf HTTP-Polling oder eine automatische Reconnect-Funktion.

Damit die Anwendungen lokal entwickelt und getestet werden können, werden diese über [Docker sowie Docker Compose](https://www.docker.com/) verwaltet. Die Services können dadurch unabhängig zum darunterliegendem Entwicklungssystem gestartet werden und es treten keine Kompatibilitätsprobleme auf.

<p align="right">(<a href="#readme-top">Zum Anfang</a>)</p>

### **Architektur**

[![Product Name Screen Shot][architecture]](#)

Die Anwendung wurde in vier Backend Services aufgeteilt, welche unabhängige Funktionen übernehmen:

#### **game_service**

Der _game_service_ ist für die gesamte Verwaltung von Spielen verantwortlich. Über den Service können neue Spiele gestartet oder bereits erstellten Spielen beigetreten werden. Zudem speichert der Service alle für ein Spiel benötigten Daten.

#### **player_service**

Der _player_service_ erstellt und speichert alle Spielerdaten. Außerdem kommuniziert dieser zwischen dem Frontend und dem _authentication_service_.

#### **authentication_service**

Alle Spieler authentifizieren sich über einen JWT-Token. Diese werden nur vom _authentication_service_ generiert. Jeder andere Backend Service kann den generierten Token anschließend unabhängig verfizieren.

#### **rule_service**

Die einem Spieler zur Verfügung stehen Spielkarten in der eigenen Hand werden vom _rule_service_ überprüft. Ein Spieler kann nach erfolgreicher Überprüfung nur noch Karten spielen, die auch den Regeln nach spielbar wären.

### **Kommunikation**

Zu Beginn muss sich ein Spieler mit einem gewählten Spielernamen anmelden. Für diesen Aufruf wird eine REST-Schnittstelle auf dem _player_service_ bereitsgestellt. Der _player_service_ leitet den eingegebenen Namen an eine externe API weiter, welche eine einfache Obszönitätskontrolle durchführt. Nach erfolgreicher Überprüfung werden die Daten als asynchrone Nachricht über RabbitMQ als AMQP Broker an den _authentication_service_ weitergeleitet. Dieser generiert einen JWT-Token und schickt anschließend eine AMQP Nachricht über den Broker an den _player_service_. Hervorzuheben ist hierbei, dass jeder der anderen Services die Nachricht ebenfalls empfangen kann, aber nicht auf die Nachrichten reagiert. Dem Spieler wird der eigene JWT-Token zurückgesendet und danach weiter zum eigenen Dashboard weitergeleitet.

Von dem Dashboard aus kann ein Spieler ein neues Spiel erstellen, oder aber einem bereits erstelltem Spiel über die _gameId_ beitreten. Beide Aufrufe werden dabei von dem _game_service_ als REST-Schnittstellen bereitsgestellt.

Bei der Verbindung zu einem Spiel stellt das Frontend eine über den JWT-Token authentifizierte Socket.io Verbindung zum _game_service_ sowie zum _rule_service_ her. Durch die auf dem Websocket Protokoll aufbauende Technologie kann eine Echtzeitkommunikation aufgebaut und alle im Spiel auftredenden Interaktionen über Events von den jeweiligen Services verarbeitet werden.

Folgende AMQP und Socket.io Nachrichten werden dabei im gesamten System versendet:

**AMQP**:

- newPlayer
- playerToken
- updateWinners

**Socket.io**:

- player_joined
- player_left
- deck_size_updated
- discard_pile_updated
- disconnect_from_socket
- played_card
- get_hands
- game_started
- game_ended
- disconnect
- start_game
- draw_card
- play_card
- join_game
  <br>
  <br>
- check_hand
- checked_hand

<p align="right">(<a href="#readme-top">Zum Anfang</a>)</p>

## **Erste Schritte**

Im folgenden wird erläutert, wie das Projekt lokal gestartet werden kann.

### **Voraussetzungen**

Folgende Programme werden benötigt:

- Docker inkl. Docker-Compose

  ```
  https://www.docker.com/get-started/
  ```

### **Installation**

1. Das Repository klonen
   ```sh
   git clone https://github.com/antonztsv/FDDWSS22_HinzerZaitsev.git
   ```
2. In den Ordner wechseln
   ```sh
   cd FDDWSS22_HinzerZaitsev
   ```
3. Skript ausführen um die _.env.example_ Dateien in jedem Backend Service in _.env_ umzubennenen

   ```sh
   ./copy-env.sh
   ```

   oder manuell:

   ```sh
    cp ./backend/authentication_service/.env.example ./backend/authentication_service/.env
    cp ./backend/game_service/.env.example ./backend/game_service/.env
    cp ./backend/player_service/.env.example ./backend/player_service/.env
    cp ./backend/rule_service/.env.example ./backend/rule_service/.env
   ```

4. Anwendungen mit _docker-compose_ starten
   ```sh
   docker-compose up -d --build
   ```

Nach dem Starten der einzelnen Services kann es bis zu zehn Sekunden dauern, bis das Frontend sowie der RabbitMQ Service vollständig gestartet sind.

<p align="right">(<a href="#readme-top">Zum Anfang</a>)</p>

## **Verwendung**

Das Frontend kann über [`http://localhost:3000`](http://localhost:3000) aufgerufen werden.

### **Ablauf**

1. Eingabe Spielername
2. Erstellung eines neuen Spiels
3. Beitritt des Spiels über einen anderen Browser (oder über Inkognito im gleichen Browser) über die gameId
4. Spiel starten
5. Spiel spielen
6. Spiel beenden

<p align="right">(<a href="#readme-top">Zum Anfang</a>)</p>

## **Kontakt**

**Calvin Hinzer** - calvin.hinzer@smail.th-koeln.de
<br>
**Anton Zaitsev** - anton.zaitsev@smail.th-koeln.de
<br>
<br>
Projekt Link: [https://github.com/antonztsv/FDDWSS22_HinzerZaitsev](https://github.com/antonztsv/FDDWSS22_HinzerZaitsev)

<p align="right">(<a href="#readme-top">Zum Anfang</a>)</p>

<!-- ACKNOWLEDGMENTS -->

<!-- ## Acknowledgments

- []()
- []()
- []() -->

<!-- <p align="right">(<a href="#readme-top">An den Anfang</a>)</p> -->

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/antonztsv/FDDWSS22_HinzerZaitsev.svg?style=for-the-badge
[contributors-url]: https://github.com/antonztsv/FDDWSS22_HinzerZaitsev/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/antonztsv/FDDWSS22_HinzerZaitsev.svg?style=for-the-badge
[forks-url]: https://github.com/antonztsv/FDDWSS22_HinzerZaitsev/network/members
[stars-shield]: https://img.shields.io/github/stars/antonztsv/FDDWSS22_HinzerZaitsev.svg?style=for-the-badge
[stars-url]: https://github.com/antonztsv/FDDWSS22_HinzerZaitsev/stargazers
[issues-shield]: https://img.shields.io/github/issues/antonztsv/FDDWSS22_HinzerZaitsev.svg?style=for-the-badge
[issues-url]: https://github.com/antonztsv/FDDWSS22_HinzerZaitsev/issues
[license-shield]: https://img.shields.io/github/license/antonztsv/FDDWSS22_HinzerZaitsev.svg?style=for-the-badge
[license-url]: https://github.com/antonztsv/FDDWSS22_HinzerZaitsev/blob/master/LICENSE.txt
[product-screenshot]: docs/images/screenshot.png
[architecture]: docs/images/architecture.png

<!-- [react.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[react-url]: https://reactjs.org/ -->

<!-- [node.js]: https://img.shields.io/npm/v/nodejs.svg?logo=nodedotjs
[node-url]: https://nodejs.org/ -->
