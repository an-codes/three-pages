# Trzy Strony

Słodka aplikacja do polecania sobie książek dla Ani, Zosi i Asi. Jeden plik `index.html` na GitHub Pages i darmowa baza Firebase (Firestore), dzięki której wszystkie widzicie tę samą listę na żywo.

## 1. Utwórz projekt Firebase

1. Wejdź na https://console.firebase.google.com i kliknij **Dodaj projekt**. Google Analytics nie jest potrzebne.
2. W projekcie kliknij **ikonę internetową (`</>`)**, żeby zarejestrować aplikację internetową. Pomiń Firebase Hosting.
3. Skopiuj obiekt `firebaseConfig`, który się pojawi.
4. W lewym menu wybierz **Build > Firestore Database > Utwórz bazę danych**. Wybierz lokalizację blisko siebie (np. `eur3` albo `europe-central2`) i tryb **produkcyjny**.
5. Włącz logowanie: **Build > Authentication > Rozpocznij > Sign-in method > Adres e-mail/hasło > Włącz > Zapisz**.
6. Załóż trzy konta: **Authentication > Users > Dodaj użytkownika**. Wpisz dokładnie te adresy i dla każdego własne, mocne hasło:
   - `ania@trzystrony.app`
   - `zosia@trzystrony.app`
   - `asia@trzystrony.app`

   To nie są prawdziwe skrzynki pocztowe, tylko loginy, więc żadne maile nie są wysyłane. Hasła przekaż każdej osobno, np. w wiadomości prywatnej.
7. Zablokuj zakładanie nowych kont: **Authentication > Settings > User actions**, wyłącz **Enable create (sign-up)**. Jeśli nie widzisz takiej opcji, nic się nie dzieje, reguły poniżej i tak wpuszczą tylko te trzy adresy.
8. Otwórz **Firestore > zakładka Reguły**, zamień całą zawartość na poniższą i kliknij **Opublikuj**:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /recs/{id} {
      allow read, write: if request.auth != null
        && request.auth.token.email in [
          'ania@trzystrony.app',
          'zosia@trzystrony.app',
          'asia@trzystrony.app'
        ];
    }
  }
}
```

Dzięki temu baza odpowiada tylko osobom zalogowanym jako jedna z Was trzech. Kolekcja `recs` utworzy się sama po dodaniu pierwszej książki.

## 2. Skonfiguruj aplikację

W pliku `index.html` znajdź blok konfiguracji na początku `<script>` i wklej swoje wartości:

```js
const NAMES = ["Ania", "Zosia", "Asia"];

const FIREBASE_CONFIG = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
```

Dane konfiguracyjne Firebase dla aplikacji internetowej nie są tajne, więc można je spokojnie wrzucić na GitHuba.

## 3. Opublikuj

Wrzuć do repozytorium na GitHubie **wszystkie pliki razem**: `index.html`, `manifest.webmanifest`, `sw.js` oraz dwa foldery: `icons` z trzema obrazkami i `fonts` z trzema plikami fontów (`nunito.woff2`, `caveat.woff2`, `pacifico.woff2`). Potem **Settings > Pages > Deploy from a branch > main / root**. Wyślij link pozostałym.

## 4. Zainstaluj na iPhonie

1. Otwórz link w **Safari** (nie w Chrome, bo tylko Safari pozwala dodać stronę do ekranu początkowego).
2. Stuknij przycisk **Udostępnij** (kwadrat ze strzałką).
3. Wybierz **Do ekranu początkowego** i stuknij **Dodaj**.

Na ekranie pojawi się ikona „Trzy Strony". Otwiera się na pełnym ekranie, jak zwykła aplikacja. Zainstalowana wersja ma osobną pamięć niż Safari, więc zaloguj się w niej (wybierz swoje imię i wpisz hasło). Zrobisz to tylko raz, bo sesja zostaje na telefonie, dopóki się nie wylogujesz albo nie usuniesz aplikacji.

Po wypuszczeniu nowej wersji strony aplikacja pobierze ją sama przy następnym otwarciu z internetem. Jeśli coś się nie odświeża, zmień `VERSION` na początku `sw.js` (np. na `trzy-strony-v2`).

## Jak to działa

- Każda może polecić książkę. Po wpisaniu tytułu aplikacja szuka w Open Library i uzupełnia autora oraz okładkę.
- Pozostałe dwie oceniają książkę gwiazdkami. Kliknięcie tej samej gwiazdki drugi raz usuwa ocenę.
- Własne polecenia możesz usunąć.

## Zmiana nazwy

Tytuł strony jest w dwóch miejscach w `index.html`: w `<title>` oraz w nagłówku `<h1>`. Mniejszy napis nad nazwą („bookclub") to `<span class="sub">` wewnątrz `<h1>`.

## Warto wiedzieć

- Lista jest dostępna tylko po zalogowaniu na jedno z trzech kont. Nawet jeśli ktoś pozna link i dane Firebase z kodu, bez hasła nic nie odczyta ani nie zmieni.
- Hasła są przechowywane w Firebase, nie w kodzie. Ponieważ adresy nie są prawdziwymi skrzynkami, mail z resetem hasła nie dojdzie. Zapomniane hasło zmienisz tak: **Authentication > Users > ⋮ > Usuń konto**, a potem dodaj to samo konto jeszcze raz z nowym hasłem.
- Opcjonalnie: w Google Cloud Console > APIs & Services > Credentials możesz ograniczyć klucz API do domeny GitHub Pages (HTTP referrers).
- Bez danych Firebase aplikacja działa w trybie demo (bez logowania) i zapisuje tylko w Twojej przeglądarce.
