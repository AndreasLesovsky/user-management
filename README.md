# User Management CRUD App

Eine moderne, vollständige Full-Stack Webanwendung zur Verwaltung von Benutzern. Das Frontend wurde mit Angular 20 (Signals + Zoneless) und Bootstrap umgesetzt, das Backend mit Spring Boot und einer MySQL-Datenbank.

## Live Demo

*   **Frontend (Angular):** [user-management.andreas-web.dev](https://user-management.andreas-web.dev)

*   **Backend (Spring Boot):** [backend.andreas-web.dev/api](https://backend.andreas-web.dev/api)

## Features

### Authentifizierung & Sicherheit
*   **JWT-basierte Anmeldung** (Bearer Token)
*   Geschützte Routen mittels **AuthGuard**
*   Der AuthGuard validiert den Token auf Gültigkeit beim Backend.
*   Der Token läuft im Backend nach einer Stunde ab.

### User Management (CRUD)
*   **Übersichtliche Darstellung** aller Benutzer in einer AG Grid Tabelle.
*   **Inline-Bearbeitung** direkt in der Grid.
*   **Vollständige CRUD-Operationen** (Create, Read, Update, Delete) via REST API.
*   **Bestätigungs-Dialog** (Bootstrap Modal) vor dem Löschen eines Benutzers.
*   **Self-Delete Prevention:** Eingeloggte Benutzer können sich nicht selbst löschen.

### Technische Highlights
*   **Globaler HTTP Error Interceptor:** Fängt alle Backend-Fehler ab und zeigt benutzerfreundliche Meldungen via Bootstrap Toasts an.
*   **Globaler HTTP Loading Interceptor:** Zeigt einen Ladespinner exakt für die Dauer aller HTTP-Requests.
*   **Reactive State Management:** Nutzung von Angular Signals für eine effiziente und reaktive State-Verwaltung (z.B. `pagination-store.ts`, `message-store.ts`).
*   **Saubere Projektstruktur:** Moderne Angular 20 Konventionen mit klaren, suffix-freien Dateinamen (z.B. `auth-api.ts`, `user-api.ts`).
*   **Umfassendes Error Handling:** Ein zentraler `GlobalExceptionHandler` im Backend behandelt und formatiert alle Exceptions konsistent für das Frontend.

## Architektur & Tech Stack

### Frontend
*   **Framework:** Angular 20
*   **UI Library:** Bootstrap 5
*   **Data Grid:** AG Grid
*   **State Management:** Angular Signals (`pagination-store.ts`, `message-store.ts`)
*   **HTTP Client:** Angular HttpClient mit globalen Interceptors für Ladeanimationen und Fehlerbehandlung
*   **Routing:** Angular Router mit AuthGuard

### Backend
*   **Framework:** Spring Boot
*   **Datenbank:** MySQL
*   **Persistence:** Spring Data JPA (Hibernate)
*   **Sicherheit:** Spring Security, JWT
*   **API:** RESTful Web Services
*   **Error Handling:** Globaler `@RestControllerAdvice` Exception Handler

### Datenbank
*   **Tabelle:** `tbl_users`

## Installation & Lokale Entwicklung

### Voraussetzungen
*   Node.js & npm
*   Angular CLI
*   Java 17 oder höher
*   Maven
*   Eine laufende MySQL-Instanz

### 1. Backend starten

#### Repository klonen
```bash
git clone https://github.com/AndreasLesovsky/user-management
cd user-management-rest-service
```

#### Anwendung konfigurieren
Die Datei application.example.properties als application.properties kopieren und sicherstellen, dass die richtigen DB-Zugangsdaten eingetragen sind.

#### Backend starten

```bash
./mvnw spring-boot:run
```

Das Backend läuft standardmäßig auf http://localhost:8080.

### 2. Frontend starten

#### In ein neues Terminal wechseln

```bash
cd user-management-frontend
```
#### Abhängigkeiten installieren

```bash
npm install
```

#### Entwicklungsserver starten

```bash
ng serve
```

Das Frontend läuft standardmäßig auf http://localhost:4200.

## API Endpoints (Backend)

| Method | Endpoint         | Description                 | Auth |
|--------|------------------|-----------------------------|-------|
| POST   | /api/auth/login  | Benutzeranmeldung + Token   | Nein  |
| POST   | /api/auth/logout | Benutzerabmeldung           | Nein  |
| GET    | /api/auth/check  | Token-Validierung           | Ja (JWT) |
| GET    | /api/users       | Liefert alle Benutzer       | Ja (JWT) |
| POST   | /api/users       | Erstellt neuen Benutzer     | Ja (JWT) |
| PUT    | /api/users/{id}  | Aktualisiert Benutzer       | Ja (JWT) |
| DELETE | /api/users/{id}  | Löscht Benutzer             | Ja (JWT) |

## Architekturdiagramm

```bash
┌─────────────────────────────────────────────────────────────────
│                        CLIENT (Angular 20)                      
├─────────────────────────────────────────────────────────────────
│  src/app/                                                       
│  ├── 📁 pages/                     # Routable Components
|  |    ├── home/
│  │    ├── login
│  │    └── dashboard/
│  │                                                              
│  ├── 📁 components/                 # Reusable Components
│  │    ├── user-list/                # AG Grid Komponente
│  │    ├── user-form/                # User Bearbeitungsformular
│  │    ├── delete-entity-modal/
│  │    ├── toast/
│  │    ├── spinner/
│  │    ├── pagination/
│  │    ├── search/
│  │    ├── header/
│  │    └── footer/
│  │                                                              
│  ├── 📁 services/                  # Business Logik
│  │    ├── auth-api                  # Login/Logout/Token-Check
│  │    └── user-api                  # CRUD Operations
│  │                                                              
│  ├── 📁 stores/                    # State Management (Signals)
│  │    ├── pagination-store
│  │    ├── message-store
│  │    └── search-store
│  │                                                             
│  ├── 📁 guards/                    # Route Protection
│  │    └── auth-guard                # JWT Validation
│  │                                                              
│  ├── 📁 interceptors/              # HTTP Handling
│  │    ├── error-interceptor         # Fängt Fehler auf und setzt die signals im message-store            
│  │    └── loading-interceptor       # Loading Spinner
│  │                                                              
│  ├── 📁 models/                    # TypeScript Interfaces
|  |    ├── app-message              # Message Interface für Toast Komponente
│  │    ├── user-input               # User Input Model entspticht dto aus dem Backend
│  │    └── user-output              # User Output Model entspticht dto aus dem Backend 
│  │                                                              
│  └── 📁 utils/                     # Utilities
│       └── messages                 # Messages für error-interceptor
└─────────────────────────────────────────────────────────────────
                                │
                                │ HTTP REST API
                                ▼
┌─────────────────────────────────────────────────────────────────
│                        SERVER (Spring Boot)                     
├─────────────────────────────────────────────────────────────────
│  src/main/java/com/example/restservice/                         
│  ├── 📁 controller/              # REST Endpoints               
│  │    ├── UserController
│  │    └── AuthController
│  │                                                               
│  ├── 📁 dto/                     # Data Transfer Objects      
│  │    ├── UserInputDto
│  │    ├── UserOutputDto
│  │    ├── LoginRequestDto
│  │    ├── LoginResponseDto
│  │    └── UserWithTokenDto
│  │                                                               
│  ├── 📁 entity/                  # JPA Entities
│  │    └── User
│  │                                                                
│  ├── 📁 repository/              # Data Access Layer
│  │    └── UserRepository
│  │                                                                
│  ├── 📁 service/                 # Business Logik
│  │    └── UserService
│  │                                                            
│  ├── 📁 security/                # SecurityConfig (JWT Authentication, CORS, Stateless Sessions)
│  │    ├── JwtUtil
│  │    ├── JwtAuthenticationFilter
│  │    ├── SecurityConfig
│  │    └── CorsConfig
│  │                                                                
│  └── 📁 exception/               # Exception Handling
│       ├── GlobalExceptionHandler
│       ├── EntityNotFoundException
│       ├── EmailAlreadyExistsException
│       ├── UsernameAlreadyExistsException
│       ├── ValidationException
│       ├── CannotDeleteSelfException
│       └── JwtAuthException
└─────────────────────────────────────────────────────────────────
                                │
                                │ JDBC
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                     DATABASE (MySQL)                            │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐                                            │
│  │   tbl_users     │                                            │
│  ├─────────────────┤                                            │
│  │ id (PK)         │                                            │
│  │ username        │                                            │
│  │ email (UNIQUE)  │                                            │
│  │ password_hash   │                                            │
│  │ first_name      │                                            │
│  │ last_name       │                                            │
│  │ created_at      │                                            │
│  │ updated_at      │                                            │
│  └─────────────────┘                                            │
└─────────────────────────────────────────────────────────────────┘
```

## Entwickler

**Andreas Lesovsky**  
Full-Stack Web Developer

🌐 [andreas-web.dev](https://andreas-web.dev)  
📧 [kontakt@andreas-web.dev](mailto:kontakt@andreas-web.dev)

## Credits

- [Angular](https://angular.dev)
- [Spring Boot](https://spring.io/projects/spring-boot)
- [AG Grid](https://www.ag-grid.com/)
- [Bootstrap](https://getbootstrap.com/)

## Lizenz

Dieses Projekt steht unter der **MIT License**.