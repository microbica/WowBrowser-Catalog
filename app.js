"use strict";

const STORAGE_SERVERS = "wowbrowser.servers.v1";const STORAGE_FAVORITES = "wowbrowser.favorites.v1";
const STORAGE_PREFERENCES = "wowbrowser.preferences.v1";
const STORAGE_REMOTE_CATALOG = "wowbrowser.remoteCatalog.v1";
const CLICK_STATS_URL = "/api";
const RELEASE_URL_LATEST = "https://github.com/microbica/WowBrowser-Releases/releases/latest";
const WINDOWS_DOWNLOADS_LATEST = {
  installer: RELEASE_URL_LATEST + "/download/WowBrowser-win-Setup.exe",
  portable: RELEASE_URL_LATEST + "/download/WowBrowser-win-Portable.zip"
};
const CATALOG_URL_CANDIDATES = (function () {
  const custom = "https://wowbrowser.pixplix.com/catalog.json";
  const github = "https://microbica.github.io/WowBrowser-Catalog/catalog.json";
  try {
    const override = localStorage.getItem("wowbrowser.catalogUrl");
    if (override) return [override];
  } catch (e) {}
  return [custom, github];
})();
const seedServers = [
  {
    id: "lasthavens",
    name: "Lasthavens",
    playUrl: "https://lasthavens.com/play",
    registerUrl: "https://lasthavens.com/play#create",
    favicon: "https://lasthavens.com/favicon.svg",
    language: "en",
    region: "other",
    version: "wotlk",
    description: "Reino gratuito de Wrath of the Lich King que ejecuta el cliente en la pestaña, sin launcher ni cliente de 17 GB. PvP, XP x2 y personajes compartidos entre dispositivos.",
    symbol: "LH",
    source: "seed"
  },
  {
    id: "keldurn",
    name: "Keldurn — Classic y Ascension",
    playUrl: "https://play.keldurn.com/",
    registerUrl: "https://play.keldurn.com/register",
    variants: [
      { label: "Classic", playUrl: "https://play.keldurn.com/", version: "classic" },
      { label: "Ascension", playUrl: "https://ascension.keldurn.com/", version: "wotlk" }
    ],
    versionLabel: "Classic / WotLK",
    favicon: "https://keldurn.com/favicon.svg?v=5",
    language: "en",
    region: "other",
    version: "classic",
    description: "MMORPG independiente en el navegador: Classic ofrece PvP persistente, nivel 60 y progresión x1; Ascension añade Conquest of Azeroth con 21 clases nuevas sobre Wrath. Sin descargas y compatible con móvil.",
    symbol: "KC",
    source: "seed"
  },
  {
    id: "shadopan",
    name: "Shadopan",
    playUrl: "https://play.shadopan.com/",
    registerUrl: "https://shadopan.com/en",
    favicon: "https://play.shadopan.com/favicon.svg",
    language: "en",
    region: "other",
    version: "mop",
    description: "Reino PvE de Mists of Pandaria con el cliente 5.4.8 completo en la pestaña. Gratis, sin tienda, XP x1.5 y progresión por parches; en desarrollo.",
    symbol: "SH",
    source: "seed"
  },
  {
    id: "wow-peru-land",
    name: "WoW Perú Land",
    playUrl: "https://play.wowperuland.com/",
    registerUrl: "https://wowperuland.com/registro",
    favicon: "https://wowperuland.com/assets/img/favicon-v2.png",
    language: "es",
    region: "americas",
    version: "wotlk",
    description: "Servidor WotLK en español con progresión desde Vanilla. Nivel máximo 60, XP x3 —x4 los domingos— y ambas facciones comparten grupo, hermandad y chat.",
    symbol: "PL",
    source: "seed"
  },
  {
    id: "grimfall-wow",
    name: "Grimfall WoW — Classless y Conquest",
    playUrl: "https://webclient-live.grimfallwow.com/?mode=embed",
    registerUrl: "https://www.grimfallwow.com/register",
    favicon: "https://www.grimfallwow.com/favicon.ico",
    language: "en",
    region: "other",
    version: "wotlk",
    description: "Red custom sobre WotLK con Classless y Conquest of Azeroth, incluidas 21 clases personalizadas. El cliente web permite jugar desde escritorio o móvil sin instalar nada.",
    symbol: "GW",
    source: "seed"
  },
  {
    id: "clubwow",
    name: "Club WoW — Main y Arena",
    playUrl: "https://clubwow.gg/wow/",
    registerUrl: "https://clubwow.gg",
    favicon: "https://clubwow.gg/wow/assets/icons/icon-192.png",
    language: "en",
    region: "other",
    version: "wotlk",
    description: "Servidor Wrath+ custom con reino principal hasta nivel 80 y reino de arenas hasta 60. Incluye agentes IA opcionales y juego desde ordenador o móvil.",
    symbol: "CW",
    source: "seed"
  },
  {
    id: "gravespire",
    name: "Gravespire",
    playUrl: "https://play.gravespire.com/",
    registerUrl: "https://gravespire.com/register",
    favicon: "https://www.gravespire.com/assets/favicon.png",
    language: "en",
    region: "other",
    version: "wotlk",
    description: "Reino PvP de Wrath con XP x3, pensado para escritorio, iPhone y Android. Permite volver a Northrend desde el navegador sin instalar nada.",
    symbol: "GR",
    source: "seed"
  },
  {
    id: "frostevil",
    name: "FrostEvil — WotLK y TBC",
    playUrl: "https://frostevil.eu/#play",
    registerUrl: "https://frostevil.eu/#play",
    variants: [
      { label: "WotLK", playUrl: "https://frostevil.eu/#play", version: "wotlk" },
      { label: "TBC", playUrl: "https://frostevil.eu/tbc/play/", version: "tbc" }
    ],
    versionLabel: "WotLK / TBC",
    favicon: "https://frostevil.eu/site/favicon.svg",
    language: "en",
    region: "other",
    version: "wotlk",
    description: "Reinos gratuitos de Wrath 3.3.5a (XP x5) y The Burning Crusade 2.4.3 (XP x10), con juego cruzado entre facciones, mazmorras dinámicas y controles táctiles. Acceso directo desde navegador.",
    symbol: "FE",
    source: "seed"
  },
  {
    id: "wow-kraken",
    name: "WoW Kraken — Classic y Vanilla+",
    playUrl: "https://wow-kraken.ru/play-in-browser.php?lang=en",
    registerUrl: "https://wow-kraken.ru/auth.php?return_to=cabinet.php&lang=en&tab=register",
    favicon: "https://wow-kraken.ru/favicon.png",
    language: "other",
    region: "other",
    version: "classic",
    description: "Acceso beta abierto a Classic y Vanilla+ con la misma cuenta y personajes. Bastion sigue la progresión clásica; Stormbringer añade cuartas maestrías y cuatro razas.",
    symbol: "WK",
    source: "seed"
  },
  {
    id: "wow-peru",
    name: "Wow-Peru",
    playUrl: "https://play.proyectoandes.net/?server=wow-peru&login=manual",
    registerUrl: "https://wow-peru.lat/registro.html",
    favicon: "https://wow-peru.lat/favicon.ico",
    language: "es",
    region: "americas",
    version: "wotlk",
    description: "Servidor de WoW para jugar desde el navegador en Perú. Acceso directo sin instalar cliente local.",
    symbol: "WP",
    source: "seed"
  }
];

const metadataNames = {
  es: {
    languages: { es: "Español", en: "Inglés", pt: "Portugués", fr: "Francés", de: "Alemán", other: "Otro" },
    regions: { americas: "América", europe: "Europa", asia: "Asia", oceania: "Oceanía", other: "Sin especificar" },
    versions: {
      classic: "Classic Era / Vanilla", hardcore: "Classic Hardcore", sod: "Season of Discovery",
      tbc: "The Burning Crusade", wotlk: "Wrath of the Lich King", cata: "Cataclysm",
      mop: "Mists of Pandaria", wod: "Warlords of Draenor", legion: "Legion",
      bfa: "Battle for Azeroth", shadowlands: "Shadowlands", dragonflight: "Dragonflight",
      warwithin: "The War Within", midnight: "Midnight", forever: "Forever / Custom",
      other: "Sin especificar"
    }
  },
  en: {
    languages: { es: "Spanish", en: "English", pt: "Portuguese", fr: "French", de: "German", other: "Other" },
    regions: { americas: "Americas", europe: "Europe", asia: "Asia", oceania: "Oceania", other: "Unspecified" },
    versions: {
      classic: "Classic Era / Vanilla", hardcore: "Classic Hardcore", sod: "Season of Discovery",
      tbc: "The Burning Crusade", wotlk: "Wrath of the Lich King", cata: "Cataclysm",
      mop: "Mists of Pandaria", wod: "Warlords of Draenor", legion: "Legion",
      bfa: "Battle for Azeroth", shadowlands: "Shadowlands", dragonflight: "Dragonflight",
      warwithin: "The War Within", midnight: "Midnight", forever: "Forever / Custom",
      other: "Unspecified"
    }
  },
  pt: {
    languages: { es: "Espanhol", en: "Inglês", pt: "Português", fr: "Francês", de: "Alemão", other: "Outro" },
    regions: { americas: "Américas", europe: "Europa", asia: "Ásia", oceania: "Oceania", other: "Não especificada" },
    versions: {
      classic: "Classic Era / Vanilla", hardcore: "Classic Hardcore", sod: "Season of Discovery",
      tbc: "The Burning Crusade", wotlk: "Wrath of the Lich King", cata: "Cataclysm",
      mop: "Mists of Pandaria", wod: "Warlords of Draenor", legion: "Legion",
      bfa: "Battle for Azeroth", shadowlands: "Shadowlands", dragonflight: "Dragonflight",
      warwithin: "The War Within", midnight: "Midnight", forever: "Forever / Personalizado",
      other: "Não especificada"
    }
  },
  fr: {
    languages: { es: "Espagnol", en: "Anglais", pt: "Portugais", fr: "Français", de: "Allemand", other: "Autre" },
    regions: { americas: "Amériques", europe: "Europe", asia: "Asie", oceania: "Océanie", other: "Non précisée" },
    versions: {
      classic: "Classic Era / Vanilla", hardcore: "Classic Hardcore", sod: "Season of Discovery",
      tbc: "The Burning Crusade", wotlk: "Wrath of the Lich King", cata: "Cataclysm",
      mop: "Mists of Pandaria", wod: "Warlords of Draenor", legion: "Legion",
      bfa: "Battle for Azeroth", shadowlands: "Shadowlands", dragonflight: "Dragonflight",
      warwithin: "The War Within", midnight: "Midnight", forever: "Forever / personnalisé",
      other: "Non précisée"
    }
  },
  de: {
    languages: { es: "Spanisch", en: "Englisch", pt: "Portugiesisch", fr: "Französisch", de: "Deutsch", other: "Andere" },
    regions: { americas: "Amerika", europe: "Europa", asia: "Asien", oceania: "Ozeanien", other: "Nicht angegeben" },
    versions: {
      classic: "Classic Era / Vanilla", hardcore: "Classic Hardcore", sod: "Season of Discovery",
      tbc: "The Burning Crusade", wotlk: "Wrath of the Lich King", cata: "Cataclysm",
      mop: "Mists of Pandaria", wod: "Warlords of Draenor", legion: "Legion",
      bfa: "Battle for Azeroth", shadowlands: "Shadowlands", dragonflight: "Dragonflight",
      warwithin: "The War Within", midnight: "Midnight", forever: "Forever / Custom",
      other: "Nicht angegeben"
    }
  }
};
let languageNames = metadataNames.es.languages;
let regionNames = metadataNames.es.regions;
const countryRegionCodes = {
  americas: new Set("US CA MX GL BM PM BZ CR SV GT HN NI PA AG AI AW BS BB BQ VG KY CU CW DM DO GD GP HT JM MQ MS PR BL KN LC MF VC SX TT TC VI AR BO BR CL CO EC FK GF GY PY PE SR UY VE".split(" ")),
  europe: new Set("AX AL AD AT BY BE BA BG HR CY CZ DK EE FO FI FR DE GI GG HU IS IE IM IT JE XK LV LI LT LU MT MD MC ME NL MK NO PL PT RO RU SM RS SK SI ES SJ SE CH TR UA GB VA".split(" ")),
  asia: new Set("AF AM AZ BH BD BT BN KH CN GE HK IN ID IR IQ IL JP JO KZ KP KR KW KG LA LB MO MY MV MN MM NP OM PK PS PH QA SA SG LK SY TW TJ TH TL TM AE UZ VN YE".split(" ")),
  oceania: new Set("AS AU CX CC CK FJ PF GU KI MH FM NR NC NZ NU NF MP PW PG PN WS SB TK TO TV UM VU WF".split(" "))
};
let versionNames = metadataNames.es.versions;
const legacyRegions = { latam: "americas", na: "americas", eu: "europe" };
const pageNamesByLanguage = {
  es: { home: "Inicio", catalog: "Catálogo", favorites: "Favoritos", settings: "Preferencias" },
  en: { home: "Home", catalog: "Catalog", favorites: "Favorites", settings: "Preferences" },
  pt: { home: "Início", catalog: "Catálogo", favorites: "Favoritos", settings: "Preferências" },
  fr: { home: "Accueil", catalog: "Catalogue", favorites: "Favoris", settings: "Préférences" },
  de: { home: "Start", catalog: "Katalog", favorites: "Favoriten", settings: "Einstellungen" }
};
let pageNames = pageNamesByLanguage.es;
const documentTitles = {
  es: "WowBrowser · Catálogo de servidores WoW en el navegador",
  en: "WowBrowser · Browser-based WoW server catalog",
  pt: "WowBrowser · Catálogo de servidores WoW no navegador",
  fr: "WowBrowser · Catalogue de serveurs WoW dans le navigateur",
  de: "WowBrowser · Katalog von WoW-Servern im Browser"
};

const englishUiText = {
  "WOWBROWSER · VISTA PREVIA": "WOWBROWSER · PREVIEW",
  "PREPARANDO EL VIAJE": "PREPARING YOUR JOURNEY",
  "Los caminos": "The paths", "vuelven a abrirse.": "are open again.",
  "Reuniendo tus mundos favoritos en un solo lugar.": "Bringing your favorite worlds together in one place.",
  "CONSEJO DEL VIAJERO": "TRAVELER'S TIP",
  "Revisa tu equipo antes de aventurarte en una mazmorra.": "Check your gear before venturing into a dungeon.",
  "PREPARANDO EL PORTAL": "PREPARING THE PORTAL",
  "Un momento, aventurero…": "Just a moment, adventurer…",
  "EXPLORAR": "EXPLORE", "Inicio": "Home", "Catálogo": "Catalog", "Favoritos": "Favorites",
  "WowBrowser, inicio": "WowBrowser, home", "Navegación principal": "Main navigation",
  "Preferencias": "Preferences", "Añadir servidor": "Add server",
  "TU PRÓXIMA AVENTURA EMPIEZA AQUÍ": "YOUR NEXT ADVENTURE STARTS HERE",
  "Encuentra tu": "Find your", "próximo mundo.": "next world.",
  "Encuentra servidores por idioma, expansión y región; abre sus clientes web desde un solo lugar.": "Find servers by language, expansion, and region; open their web clients in one place.",
  "Explorar servidores": "Explore servers", "SELECCIÓN PARA TI": "PICKED FOR YOU",
  "Recomendados": "Recommended", "Ver catálogo": "View catalog",
  "Vista previa comunitaria.": "Community preview.",
  "WowBrowser no está afiliado a Blizzard. Comprueba las reglas, la seguridad y la legalidad de cada servidor antes de jugar.": "WowBrowser is not affiliated with Blizzard. Check each server's rules, security, and legality before playing.",
  "DESCUBRE NUEVOS MUNDOS": "DISCOVER NEW WORLDS",
  "Filtra por idioma, versión del juego y región del servidor.": "Filter by language, game version, and server region.",
  "Buscar nombre, idioma o versión…": "Search name, language, or version…",
  "Todos los idiomas": "All languages", "Todas las versiones": "All versions",
  "Cualquier región": "Any region", "América": "Americas", "Europa": "Europe",
  "Oceanía": "Oceania", "Otro": "Other", "Sin especificar": "Unspecified",
  "Español": "Spanish", "Inglés": "English", "Portugués": "Portuguese",
  "Francés": "French", "Alemán": "German", "Cualquier idioma": "Any language",
  "Otro / sin especificar": "Other / unspecified",
  "Ordenar": "Sort by", "Más jugados": "Most played",
  "No encontramos servidores": "No servers found",
  "Prueba con otro término o añade un servidor.": "Try another search or add a server.",
  "El orden «Más jugados» se basa en los clics globales al abrir cada servidor.": "“Most played” is sorted by the global clicks when each server is opened.",
  "TUS MUNDOS GUARDADOS": "YOUR SAVED WORLDS",
  "Acceso rápido a los servidores que quieres tener a mano.": "Quick access to the servers you want close at hand.",
  "Aún no tienes favoritos": "No favorites yet",
  "Guarda un servidor con el icono del corazón.": "Save a server with the heart icon.",
  "A TU MANERA": "MAKE IT YOURS",
  "Personaliza las sugerencias. Estos ajustes se guardan en este dispositivo.": "Personalize suggestions. These settings are saved on this device.",
  "Idioma de la interfaz": "Interface language",
  "Cambia el idioma de todos los menús y textos.": "Changes the language of menus and interface text.",
  "Cambia el idioma de los menús y textos.": "Changes the language of menus and interface text.",
  "Idioma de los servidores": "Server language",
  "Prioriza servidores que ofrezcan este idioma.": "Prioritizes servers that offer this language.",
  "Nombre del servidor": "Server name",
  "Región preferida": "Preferred region",
  "Se usa solo para ordenar las recomendaciones.": "Used only to sort recommendations.",
  "Automática (país aproximado)": "Automatic (approximate country)",
  "Versión preferida": "Preferred game version",
  "Prioriza la expansión que quieres jugar.": "Prioritizes the expansion you want to play.",
  "Cualquier versión": "Any version",
  "Usar país aproximado": "Use approximate country",
  "Solo país/continente por IP; no GPS ni coordenadas precisas.": "Country/continent from IP only; no GPS or precise coordinates.",
  "Si lo permites, api.country.is recibe tu IP pública para devolver únicamente el código de país. WowBrowser no guarda tu IP y puedes desactivarlo aquí.": "If enabled, api.country.is receives your public IP to return only a country code. WowBrowser does not store your IP; disable it here anytime.",
  "Hecho para explorar con calma.": "Made for exploring at your own pace.",
  "Desarrollado por": "Developed by",
  "AÑADIR A TU LISTA": "ADD TO YOUR LIST",
  "Nuevo servidor": "New server", "Nombre": "Name", "URL del cliente web": "Web client URL",
  "Idioma": "Language", "Región": "Region", "Versión del juego": "Game version",
  "Por ahora se guardará solo en este dispositivo. Verifica que confías en el sitio antes de abrirlo.": "For now, this is saved only on this device. Make sure you trust the site before opening it.",
  "Cancelar": "Cancel", "Guardar servidor": "Save server",
  "PRIVACIDAD": "PRIVACY", "¿Usar tu país aproximado?": "Use your approximate country?",
  "Para recomendar servidores de tu región, WowBrowser consultará": "To recommend servers in your region, WowBrowser will query",
  "al iniciar. Ese servicio recibe tu IP pública y devuelve solo un código de país. No solicitamos GPS ni coordenadas precisas, y no guardamos tu IP. La decisión se recuerda y puedes cambiarla en Preferencias.": "at startup. That service receives your public IP and returns only a country code. We do not request GPS or precise coordinates, and we do not store your IP. Your choice is remembered and can be changed in Preferences.",
  "Ahora no": "Not now", "Permitir país aproximado": "Allow approximate country",
    "Abrir cliente": "Open client", "Registrarse": "Register",
    "Añadir a favoritos": "Add to favorites", "Quitar de favoritos": "Remove from favorites",
    "Filtrar por idioma": "Filter by language", "Filtrar por versión del juego": "Filter by game version",
    "Filtrar por región": "Filter by region", "Ordenar servidores": "Sort servers",
    "Permitir país aproximado por IP": "Allow approximate country by IP",
  "Explora el cliente web y consulta la información del servidor.": "Explore the web client and check the server information.",
  "Una opción en español para descubrir desde el navegador.": "A Spanish-language option to explore in your browser.",
  "Servidor guardado localmente en este dispositivo.": "Server saved locally on this device.",
  "Introduce un nombre y una URL http o https válida.": "Enter a name and a valid http or https URL.",
  "País aproximado desactivado": "Approximate location disabled",
  "La región se elige manualmente": "Choose a region manually",
  "País aproximado activo": "Approximate country enabled",
  "Región detectada:": "Detected region:",
  "País detectado; elige la región manualmente": "Country detected; choose a region manually",
  "Detectando región desde la IP…": "Detecting region from IP…",
  "Si aceptas, en cada inicio consultaremos api.country.is para obtener solo tu país aproximado. El servicio recibe tu IP pública. WowBrowser no la guarda ni solicita GPS o coordenadas precisas. Guardaremos el permiso. Si eliges «Ahora no», volveremos a preguntarte al próximo inicio. Puedes desactivarlo en Preferencias.": "If you allow it, we’ll query api.country.is at each startup to get only your approximate country. The service receives your public IP. WowBrowser does not store it or request GPS or precise coordinates. We’ll remember your permission. If you choose “Not now,” we’ll ask again the next time you open WowBrowser. You can turn it off in Preferences.",
  "Buscar servidores": "Search servers",
  "Cerrar": "Close"
};

const uiTextByLanguage = {
  en: englishUiText,
  pt: {
    "WOWBROWSER · VISTA PREVIA": "WOWBROWSER · PRÉVIA",
    "PREPARANDO EL VIAJE": "PREPARANDO A VIAGEM",
    "Los caminos": "Os caminhos", "vuelven a abrirse.": "estão abertos novamente.",
    "Reuniendo tus mundos favoritos en un solo lugar.": "Reunindo seus mundos favoritos em um só lugar.",
    "CONSEJO DEL VIAJERO": "DICA DO VIAJANTE",
    "Revisa tu equipo antes de aventurarte en una mazmorra.": "Confira seu equipamento antes de se aventurar em uma masmorra.",
    "PREPARANDO EL PORTAL": "PREPARANDO O PORTAL", "Un momento, aventurero…": "Um momento, aventureiro…",
    "EXPLORAR": "EXPLORAR", "Inicio": "Início", "Catálogo": "Catálogo", "Favoritos": "Favoritos",
    "WowBrowser, inicio": "WowBrowser, início", "Navegación principal": "Navegação principal",
    "Preferencias": "Preferências", "Añadir servidor": "Adicionar servidor",
    "TU PRÓXIMA AVENTURA EMPIEZA AQUÍ": "SUA PRÓXIMA AVENTURA COMEÇA AQUI",
    "Encuentra tu": "Encontre seu", "próximo mundo.": "próximo mundo.",
    "Encuentra servidores por idioma, expansión y región; abre sus clientes web desde un solo lugar.": "Encontre servidores por idioma, expansão e região; abra os clientes web em um só lugar.",
    "Explorar servidores": "Explorar servidores", "SELECCIÓN PARA TI": "SELEÇÃO PARA VOCÊ",
    "Recomendados": "Recomendados", "Ver catálogo": "Ver catálogo",
    "Vista previa comunitaria.": "Prévia da comunidade.",
    "WowBrowser no está afiliado a Blizzard. Comprueba las reglas, la seguridad y la legalidad de cada servidor antes de jugar.": "WowBrowser não é afiliado à Blizzard. Confira as regras, a segurança e a legalidade de cada servidor antes de jogar.",
    "DESCUBRE NUEVOS MUNDOS": "DESCUBRA NOVOS MUNDOS",
    "Filtra por idioma, versión del juego y región del servidor.": "Filtre por idioma, versão do jogo e região do servidor.",
    "Buscar nombre, idioma o versión…": "Buscar nome, idioma ou versão…",
    "Todos los idiomas": "Todos os idiomas", "Todas las versiones": "Todas as versões",
    "Cualquier región": "Qualquer região", "América": "Américas", "Europa": "Europa", "Asia": "Ásia", "Oceanía": "Oceania",
    "Otro": "Outro", "Sin especificar": "Não especificada", "Español": "Espanhol", "Inglés": "Inglês",
    "Portugués": "Português", "Francés": "Francês", "Alemán": "Alemão", "Cualquier idioma": "Qualquer idioma",
    "Otro / sin especificar": "Outro / não especificado", "Ordenar": "Ordenar",
    "Más jugados": "Mais jogados",
    "No encontramos servidores": "Não encontramos servidores",
    "Prueba con otro término o añade un servidor.": "Tente outro termo ou adicione um servidor.",
    "El orden «Más jugados» se basa en los clics globales al abrir cada servidor.": "A ordem “Mais jogados” é baseada nos cliques globais ao abrir cada servidor.",
    "TUS MUNDOS GUARDADOS": "SEUS MUNDOS SALVOS",
    "Acceso rápido a los servidores que quieres tener a mano.": "Acesso rápido aos servidores que você quer manter por perto.",
    "Aún no tienes favoritos": "Você ainda não tem favoritos",
    "Guarda un servidor con el icono del corazón.": "Salve um servidor com o ícone de coração.",
    "A TU MANERA": "DO SEU JEITO",
    "Personaliza las sugerencias. Estos ajustes se guardan en este dispositivo.": "Personalize as sugestões. Essas configurações ficam salvas neste dispositivo.",
    "Idioma de la interfaz": "Idioma da interface", "Cambia el idioma de los menús y textos.": "Altera o idioma dos menus e textos.",
    "Cambia el idioma de todos los menús y textos.": "Altera o idioma dos menus e textos.",
    "Idioma de los servidores": "Idioma dos servidores",
    "Prioriza servidores que ofrezcan este idioma.": "Prioriza servidores que ofereçam este idioma.",
    "Región preferida": "Região preferida", "Se usa solo para ordenar las recomendaciones.": "Usada apenas para ordenar as recomendações.",
    "Automática (país aproximado)": "Automática (país aproximado)",
    "Versión preferida": "Versão preferida", "Cualquier versión": "Qualquer versão",
    "Prioriza la expansión que quieres jugar.": "Prioriza a expansão que você quer jogar.",
    "Usar país aproximado": "Usar país aproximado",
    "Solo país/continente por IP; no GPS ni coordenadas precisas.": "Somente país/continente por IP; sem GPS ou coordenadas precisas.",
    "Si lo permites, api.country.is recibe tu IP pública para devolver únicamente el código de país. WowBrowser no guarda tu IP y puedes desactivarlo aquí.": "Se permitido, api.country.is recebe seu IP público e retorna apenas o código do país. WowBrowser não salva seu IP; você pode desativar aqui.",
    "Hecho para explorar con calma.": "Feito para explorar sem pressa.", "Desarrollado por": "Desenvolvido por",
    "AÑADIR A TU LISTA": "ADICIONAR À SUA LISTA", "Nuevo servidor": "Novo servidor",
    "Nombre": "Nome", "Nombre del servidor": "Nome do servidor", "URL del cliente web": "URL do cliente web",
    "Idioma": "Idioma", "Región": "Região", "Versión del juego": "Versão do jogo",
    "Por ahora se guardará solo en este dispositivo. Verifica que confías en el sitio antes de abrirlo.": "Por enquanto, será salvo apenas neste dispositivo. Confirme que confia no site antes de abri-lo.",
    "Cancelar": "Cancelar", "Guardar servidor": "Salvar servidor",
    "PRIVACIDAD": "PRIVACIDADE", "¿Usar tu país aproximado?": "Usar seu país aproximado?",
    "Para recomendar servidores de tu región, WowBrowser consultará": "Para recomendar servidores da sua região, o WowBrowser consultará",
    "al iniciar. Ese servicio recibe tu IP pública y devuelve solo un código de país. No solicitamos GPS ni coordenadas precisas, y no guardamos tu IP. La decisión se recuerda y puedes cambiarla en Preferencias.": "ao iniciar. Esse serviço recebe seu IP público e retorna apenas o código do país. Não solicitamos GPS nem coordenadas precisas e não salvamos seu IP. Sua escolha fica salva e pode ser alterada em Preferências.",
    "Ahora no": "Agora não", "Permitir país aproximado": "Permitir país aproximado",
    "Abrir cliente": "Abrir cliente", "Registrarse": "Registrar",
    "Añadir a favoritos": "Adicionar aos favoritos", "Quitar de favoritos": "Remover dos favoritos",
    "Filtrar por idioma": "Filtrar por idioma", "Filtrar por versión del juego": "Filtrar por versão do jogo",
    "Filtrar por región": "Filtrar por região", "Ordenar servidores": "Ordenar servidores",
    "Permitir país aproximado por IP": "Permitir país aproximado por IP",
    "Explora el cliente web y consulta la información del servidor.": "Explore o cliente web e consulte as informações do servidor.",
    "Una opción en español para descubrir desde el navegador.": "Uma opção em espanhol para explorar pelo navegador.",
    "Servidor guardado localmente en este dispositivo.": "Servidor salvo localmente neste dispositivo.",
    "Introduce un nombre y una URL http o https válida.": "Digite um nome e uma URL http ou https válida.",
    "País aproximado desactivado": "País aproximado desativado",
    "No se pudo detectar el país": "Não foi possível detectar o país",
    "La región se elige manualmente": "A região é escolhida manualmente",
    "País aproximado activo": "País aproximado ativado", "Región detectada:": "Região detectada:",
    "País detectado; elige la región manualmente": "País detectado; escolha a região manualmente",
    "Detectando región desde la IP…": "Detectando região pelo IP…", "Buscar servidores": "Buscar servidores", "Cerrar": "Fechar",
    "Si aceptas, en cada inicio consultaremos api.country.is para obtener solo tu país aproximado. El servicio recibe tu IP pública. WowBrowser no la guarda ni solicita GPS o coordenadas precisas. Guardaremos el permiso. Si eliges «Ahora no», volveremos a preguntarte al próximo inicio. Puedes desactivarlo en Preferencias.": "Se você permitir, consultaremos api.country.is a cada inicialização para obter apenas seu país aproximado. O serviço recebe seu IP público. O WowBrowser não o armazena nem solicita GPS ou coordenadas precisas. Sua permissão será lembrada. Se escolher “Agora não”, perguntaremos novamente na próxima vez que abrir o WowBrowser. Você pode desativar essa opção em Preferências."
  },
  fr: {
    "WOWBROWSER · VISTA PREVIA": "WOWBROWSER · APERÇU",
    "PREPARANDO EL VIAJE": "PRÉPARATION DU VOYAGE",
    "Los caminos": "Les chemins", "vuelven a abrirse.": "s’ouvrent à nouveau.",
    "Reuniendo tus mundos favoritos en un solo lugar.": "Tous vos mondes préférés réunis au même endroit.",
    "CONSEJO DEL VIAJERO": "CONSEIL DU VOYAGEUR",
    "Revisa tu equipo antes de aventurarte en una mazmorra.": "Vérifiez votre équipement avant de vous aventurer dans un donjon.",
    "PREPARANDO EL PORTAL": "OUVERTURE DU PORTAIL", "Un momento, aventurero…": "Un instant, aventurier…",
    "EXPLORAR": "EXPLORER", "Inicio": "Accueil", "Catálogo": "Catalogue", "Favoritos": "Favoris",
    "WowBrowser, inicio": "WowBrowser, accueil", "Navegación principal": "Navigation principale",
    "Preferencias": "Préférences", "Añadir servidor": "Ajouter un serveur",
    "TU PRÓXIMA AVENTURA EMPIEZA AQUÍ": "VOTRE PROCHAINE AVENTURE COMMENCE ICI",
    "Encuentra tu": "Trouvez votre", "próximo mundo.": "prochain monde.",
    "Encuentra servidores por idioma, expansión y región; abre sus clientes web desde un solo lugar.": "Trouvez des serveurs par langue, extension et région, et ouvrez leurs clients web au même endroit.",
    "Explorar servidores": "Explorer les serveurs", "SELECCIÓN PARA TI": "SÉLECTION POUR VOUS",
    "Recomendados": "Recommandés", "Ver catálogo": "Voir le catalogue",
    "Vista previa comunitaria.": "Aperçu communautaire.",
    "WowBrowser no está afiliado a Blizzard. Comprueba las reglas, la seguridad y la legalidad de cada servidor antes de jugar.": "WowBrowser n’est pas affilié à Blizzard. Vérifiez les règles, la sécurité et la légalité de chaque serveur avant de jouer.",
    "DESCUBRE NUEVOS MUNDOS": "DÉCOUVREZ DE NOUVEAUX MONDES",
    "Filtra por idioma, versión del juego y región del servidor.": "Filtrez par langue, version du jeu et région du serveur.",
    "Buscar nombre, idioma o versión…": "Rechercher un nom, une langue ou une version…",
    "Todos los idiomas": "Toutes les langues", "Todas las versiones": "Toutes les versions",
    "Cualquier región": "Toutes les régions", "América": "Amériques", "Europa": "Europe", "Asia": "Asie", "Oceanía": "Océanie",
    "Otro": "Autre", "Sin especificar": "Non précisé", "Español": "Espagnol", "Inglés": "Anglais",
    "Portugués": "Portugais", "Francés": "Français", "Alemán": "Allemand", "Cualquier idioma": "Toutes les langues",
    "Otro / sin especificar": "Autre / non précisé", "Ordenar": "Trier",
    "Más jugados": "Les plus joués",
    "No encontramos servidores": "Aucun serveur trouvé",
    "Prueba con otro término o añade un servidor.": "Essayez un autre terme ou ajoutez un serveur.",
    "El orden «Más jugados» se basa en los clics globales al abrir cada servidor.": "Le classement « Les plus joués » est basé sur les clics globaux lors de l’ouverture de chaque serveur.",
    "TUS MUNDOS GUARDADOS": "VOS MONDES ENREGISTRÉS",
    "Acceso rápido a los servidores que quieres tener a mano.": "Accédez rapidement aux serveurs que vous souhaitez garder à portée de main.",
    "Aún no tienes favoritos": "Vous n’avez pas encore de favoris",
    "Guarda un servidor con el icono del corazón.": "Ajoutez un serveur avec l’icône en forme de cœur.",
    "A TU MANERA": "À VOTRE FAÇON",
    "Personaliza las sugerencias. Estos ajustes se guardan en este dispositivo.": "Personnalisez les suggestions. Ces réglages sont enregistrés sur cet appareil.",
    "Idioma de la interfaz": "Langue de l’interface", "Cambia el idioma de los menús y textos.": "Change la langue des menus et des textes.",
    "Cambia el idioma de todos los menús y textos.": "Change la langue des menus et des textes.",
    "Idioma de los servidores": "Langue des serveurs",
    "Prioriza servidores que ofrezcan este idioma.": "Privilégie les serveurs proposant cette langue.",
    "Región preferida": "Région préférée", "Se usa solo para ordenar las recomendaciones.": "Utilisée uniquement pour trier les recommandations.",
    "Automática (país aproximado)": "Automatique (pays approximatif)",
    "Versión preferida": "Version préférée", "Cualquier versión": "Toutes les versions",
    "Prioriza la expansión que quieres jugar.": "Privilégie l’extension à laquelle vous souhaitez jouer.",
    "Usar país aproximado": "Utiliser le pays approximatif",
    "Solo país/continente por IP; no GPS ni coordenadas precisas.": "Pays/continent estimé par IP uniquement ; pas de GPS ni de coordonnées précises.",
    "Si lo permites, api.country.is recibe tu IP pública para devolver únicamente el código de país. WowBrowser no guarda tu IP y puedes desactivarlo aquí.": "Si vous l’autorisez, api.country.is reçoit votre IP publique et renvoie uniquement le code pays. WowBrowser ne conserve pas votre IP ; vous pouvez désactiver cette option ici.",
    "Hecho para explorar con calma.": "Conçu pour explorer à votre rythme.", "Desarrollado por": "Développé par",
    "AÑADIR A TU LISTA": "AJOUTER À VOTRE LISTE", "Nuevo servidor": "Nouveau serveur",
    "Nombre": "Nom", "Nombre del servidor": "Nom du serveur", "URL del cliente web": "URL du client web",
    "Idioma": "Langue", "Región": "Région", "Versión del juego": "Version du jeu",
    "Por ahora se guardará solo en este dispositivo. Verifica que confías en el sitio antes de abrirlo.": "Pour l’instant, cet élément sera enregistré uniquement sur cet appareil. Vérifiez que le site est fiable avant de l’ouvrir.",
    "Cancelar": "Annuler", "Guardar servidor": "Enregistrer le serveur",
    "PRIVACIDAD": "CONFIDENTIALITÉ", "¿Usar tu país aproximado?": "Utiliser votre pays approximatif ?",
    "Para recomendar servidores de tu región, WowBrowser consultará": "Pour recommander des serveurs de votre région, WowBrowser consultera",
    "al iniciar. Ese servicio recibe tu IP pública y devuelve solo un código de país. No solicitamos GPS ni coordenadas precisas, y no guardamos tu IP. La decisión se recuerda y puedes cambiarla en Preferencias.": "au démarrage. Ce service reçoit votre IP publique et renvoie uniquement un code pays. Nous ne demandons ni GPS ni coordonnées précises et ne conservons pas votre IP. Votre choix est mémorisé et modifiable dans Préférences.",
    "Ahora no": "Pas maintenant", "Permitir país aproximado": "Autoriser le pays approximatif",
    "Abrir cliente": "Ouvrir le client", "Registrarse": "S’inscrire",
    "Añadir a favoritos": "Ajouter aux favoris", "Quitar de favoritos": "Retirer des favoris",
    "Filtrar por idioma": "Filtrer par langue", "Filtrar por versión del juego": "Filtrer par version du jeu",
    "Filtrar por región": "Filtrer par région", "Ordenar servidores": "Trier les serveurs",
    "Permitir país aproximado por IP": "Autoriser le pays approximatif par IP",
    "Explora el cliente web y consulta la información del servidor.": "Explorez le client web et consultez les informations du serveur.",
    "Una opción en español para descubrir desde el navegador.": "Une option en espagnol à découvrir dans le navigateur.",
    "Servidor guardado localmente en este dispositivo.": "Serveur enregistré localement sur cet appareil.",
    "Introduce un nombre y una URL http o https válida.": "Saisissez un nom et une URL http ou https valide.",
    "País aproximado desactivado": "Pays approximatif désactivé",
    "No se pudo detectar el país": "Impossible de détecter le pays",
    "La región se elige manualmente": "Choisissez une région manuellement",
    "País aproximado activo": "Pays approximatif activé", "Región detectada:": "Région détectée :",
    "País detectado; elige la región manualmente": "Pays détecté ; choisissez la région manuellement",
    "Detectando región desde la IP…": "Détection de la région par IP…", "Buscar servidores": "Rechercher des serveurs", "Cerrar": "Fermer",
    "Si aceptas, en cada inicio consultaremos api.country.is para obtener solo tu país aproximado. El servicio recibe tu IP pública. WowBrowser no la guarda ni solicita GPS o coordenadas precisas. Guardaremos el permiso. Si eliges «Ahora no», volveremos a preguntarte al próximo inicio. Puedes desactivarlo en Preferencias.": "Si vous l’autorisez, nous consulterons api.country.is à chaque démarrage pour obtenir uniquement votre pays approximatif. Le service reçoit votre IP publique. WowBrowser ne la stocke pas et ne demande ni GPS ni coordonnées précises. Votre autorisation sera mémorisée. Si vous choisissez « Pas maintenant », nous vous le redemanderons au prochain lancement. Vous pouvez désactiver cette option dans Préférences."
  },
  de: {
    "WOWBROWSER · VISTA PREVIA": "WOWBROWSER · VORSCHAU",
    "PREPARANDO EL VIAJE": "DIE REISE WIRD VORBEREITET",
    "Los caminos": "Die Wege", "vuelven a abrirse.": "öffnen sich wieder.",
    "Reuniendo tus mundos favoritos en un solo lugar.": "Deine Lieblingswelten an einem Ort.",
    "CONSEJO DEL VIAJERO": "TIPP FÜR REISENDE",
    "Revisa tu equipo antes de aventurarte en una mazmorra.": "Prüfe deine Ausrüstung, bevor du dich in einen Dungeon wagst.",
    "PREPARANDO EL PORTAL": "PORTAL WIRD VORBEREITET", "Un momento, aventurero…": "Einen Moment, Abenteurer…",
    "EXPLORAR": "ENTDECKEN", "Inicio": "Start", "Catálogo": "Katalog", "Favoritos": "Favoriten",
    "WowBrowser, inicio": "WowBrowser, Startseite", "Navegación principal": "Hauptnavigation",
    "Preferencias": "Einstellungen", "Añadir servidor": "Server hinzufügen",
    "TU PRÓXIMA AVENTURA EMPIEZA AQUÍ": "DEIN NÄCHSTES ABENTEUER BEGINNT HIER",
    "Encuentra tu": "Finde deine", "próximo mundo.": "nächste Welt.",
    "Encuentra servidores por idioma, expansión y región; abre sus clientes web desde un solo lugar.": "Finde Server nach Sprache, Erweiterung und Region und öffne ihre Webclients an einem Ort.",
    "Explorar servidores": "Server entdecken", "SELECCIÓN PARA TI": "FÜR DICH AUSGEWÄHLT",
    "Recomendados": "Empfohlen", "Ver catálogo": "Katalog ansehen",
    "Vista previa comunitaria.": "Community-Vorschau.",
    "WowBrowser no está afiliado a Blizzard. Comprueba las reglas, la seguridad y la legalidad de cada servidor antes de jugar.": "WowBrowser ist nicht mit Blizzard verbunden. Prüfe Regeln, Sicherheit und Rechtmäßigkeit jedes Servers, bevor du spielst.",
    "DESCUBRE NUEVOS MUNDOS": "ENTDECKE NEUE WELTEN",
    "Filtra por idioma, versión del juego y región del servidor.": "Filtere nach Sprache, Spielversion und Serverregion.",
    "Buscar nombre, idioma o versión…": "Name, Sprache oder Version suchen…",
    "Todos los idiomas": "Alle Sprachen", "Todas las versiones": "Alle Versionen",
    "Cualquier región": "Alle Regionen", "América": "Amerika", "Europa": "Europa", "Asia": "Asien", "Oceanía": "Ozeanien",
    "Otro": "Andere", "Sin especificar": "Nicht angegeben", "Español": "Spanisch", "Inglés": "Englisch",
    "Portugués": "Portugiesisch", "Francés": "Französisch", "Alemán": "Deutsch", "Cualquier idioma": "Alle Sprachen",
    "Otro / sin especificar": "Andere / nicht angegeben", "Ordenar": "Sortieren",
    "Más jugados": "Meistgespielt",
    "No encontramos servidores": "Keine Server gefunden",
    "Prueba con otro término o añade un servidor.": "Versuche einen anderen Suchbegriff oder füge einen Server hinzu.",
    "El orden «Más jugados» se basa en los clics globales al abrir cada servidor.": "Die Sortierung „Meistgespielt“ basiert auf den globalen Klicks beim Öffnen jedes Servers.",
    "TUS MUNDOS GUARDADOS": "DEINE GESPEICHERTEN WELTEN",
    "Acceso rápido a los servidores que quieres tener a mano.": "Schneller Zugriff auf Server, die du griffbereit haben möchtest.",
    "Aún no tienes favoritos": "Noch keine Favoriten",
    "Guarda un servidor con el icono del corazón.": "Speichere einen Server über das Herzsymbol.",
    "A TU MANERA": "NACH DEINEM GESCHMACK",
    "Personaliza las sugerencias. Estos ajustes se guardan en este dispositivo.": "Passe Empfehlungen an. Diese Einstellungen werden auf diesem Gerät gespeichert.",
    "Idioma de la interfaz": "Oberflächensprache", "Cambia el idioma de los menús y textos.": "Ändert die Sprache der Menüs und Texte.",
    "Cambia el idioma de todos los menús y textos.": "Ändert die Sprache der Menüs und Texte.",
    "Idioma de los servidores": "Serversprache",
    "Prioriza servidores que ofrezcan este idioma.": "Bevorzugt Server, die diese Sprache anbieten.",
    "Región preferida": "Bevorzugte Region", "Se usa solo para ordenar las recomendaciones.": "Wird nur zum Sortieren der Empfehlungen verwendet.",
    "Automática (país aproximado)": "Automatisch (ungefähres Land)",
    "Versión preferida": "Bevorzugte Spielversion", "Cualquier versión": "Alle Versionen",
    "Prioriza la expansión que quieres jugar.": "Bevorzugt die Erweiterung, die du spielen möchtest.",
    "Usar país aproximado": "Ungefähres Land verwenden",
    "Solo país/continente por IP; no GPS ni coordenadas precisas.": "Nur Land/Kontinent anhand der IP; kein GPS oder genaue Koordinaten.",
    "Si lo permites, api.country.is recibe tu IP pública para devolver únicamente el código de país. WowBrowser no guarda tu IP y puedes desactivarlo aquí.": "Wenn erlaubt, erhält api.country.is deine öffentliche IP und gibt nur den Ländercode zurück. WowBrowser speichert deine IP nicht; du kannst dies hier deaktivieren.",
    "Hecho para explorar con calma.": "Zum entspannten Entdecken gemacht.", "Desarrollado por": "Entwickelt von",
    "AÑADIR A TU LISTA": "ZU DEINER LISTE HINZUFÜGEN", "Nuevo servidor": "Neuer Server",
    "Nombre": "Name", "Nombre del servidor": "Servername", "URL del cliente web": "Webclient-URL",
    "Idioma": "Sprache", "Región": "Region", "Versión del juego": "Spielversion",
    "Por ahora se guardará solo en este dispositivo. Verifica que confías en el sitio antes de abrirlo.": "Wird vorerst nur auf diesem Gerät gespeichert. Öffne nur Seiten, denen du vertraust.",
    "Cancelar": "Abbrechen", "Guardar servidor": "Server speichern",
    "PRIVACIDAD": "DATENSCHUTZ", "¿Usar tu país aproximado?": "Ungefähres Land verwenden?",
    "Para recomendar servidores de tu región, WowBrowser consultará": "Um Server aus deiner Region zu empfehlen, fragt WowBrowser",
    "al iniciar. Ese servicio recibe tu IP pública y devuelve solo un código de país. No solicitamos GPS ni coordenadas precisas, y no guardamos tu IP. La decisión se recuerda y puedes cambiarla en Preferencias.": "beim Start ab. Dieser Dienst erhält deine öffentliche IP und gibt nur den Ländercode zurück. Wir fragen weder GPS noch genaue Koordinaten ab und speichern deine IP nicht. Deine Wahl wird gespeichert und kann in Einstellungen geändert werden.",
    "Ahora no": "Nicht jetzt", "Permitir país aproximado": "Ungefähres Land erlauben",
    "Abrir cliente": "Client öffnen", "Registrarse": "Registrieren",
    "Añadir a favoritos": "Zu Favoriten hinzufügen", "Quitar de favoritos": "Aus Favoriten entfernen",
    "Filtrar por idioma": "Nach Sprache filtern", "Filtrar por versión del juego": "Nach Spielversion filtern",
    "Filtrar por región": "Nach Region filtern", "Ordenar servidores": "Server sortieren",
    "Permitir país aproximado por IP": "Ungefähres Land anhand der IP erlauben",
    "Explora el cliente web y consulta la información del servidor.": "Erkunde den Webclient und informiere dich über den Server.",
    "Una opción en español para descubrir desde el navegador.": "Eine spanischsprachige Option zum Entdecken im Browser.",
    "Servidor guardado localmente en este dispositivo.": "Server lokal auf diesem Gerät gespeichert.",
    "Introduce un nombre y una URL http o https válida.": "Gib einen Namen und eine gültige http- oder https-URL ein.",
    "País aproximado desactivado": "Ungefähres Land deaktiviert",
    "No se pudo detectar el país": "Land konnte nicht ermittelt werden",
    "La región se elige manualmente": "Region manuell auswählen",
    "País aproximado activo": "Ungefähres Land aktiviert", "Región detectada:": "Erkannte Region:",
    "País detectado; elige la región manualmente": "Land erkannt; Region manuell auswählen",
    "Detectando región desde la IP…": "Region anhand der IP wird ermittelt…", "Buscar servidores": "Server suchen", "Cerrar": "Schließen",
    "Si aceptas, en cada inicio consultaremos api.country.is para obtener solo tu país aproximado. El servicio recibe tu IP pública. WowBrowser no la guarda ni solicita GPS o coordenadas precisas. Guardaremos el permiso. Si eliges «Ahora no», volveremos a preguntarte al próximo inicio. Puedes desactivarlo en Preferencias.": "Wenn du zustimmst, fragen wir api.country.is bei jedem Start nach deinem ungefähren Land. Der Dienst erhält deine öffentliche IP. WowBrowser speichert sie nicht und fragt weder GPS noch genaue Koordinaten ab. Deine Zustimmung wird gespeichert. Wenn du „Nicht jetzt“ wählst, fragen wir beim nächsten Start erneut. Du kannst die Funktion in den Einstellungen deaktivieren."
  }
};

const downloadUiText = {
  es: {
    bannerLabel: "Descargar WowBrowser para Windows",
    bannerTitle: "Lleva WowBrowser a tu escritorio",
    bannerDescription: "Descárgalo para Windows y abre tus servidores en un solo lugar.",
    bannerDownload: "Descargar para Windows",
    viewDownloads: "Ver descargas disponibles",
    installer: "Instalador .exe",
    portable: "Portátil .zip",
    dismissBanner: "Cerrar aviso de descarga",
    updateEyebrow: "WOWBROWSER · ACTUALIZACIÓN",
    updateTitle: "Nueva versión disponible",
    updateDescription: "Hay una versión más reciente de WowBrowser disponible para Windows.",
    installedVersion: "Versión instalada",
    availableVersion: "Versión disponible",
    releaseNotes: "Ver notas de la versión",
    downloadInstaller: "Descargar instalador",
    downloadPortable: "Descargar ZIP portátil",
    notNow: "Ahora no"
  },
  en: {
    bannerLabel: "Download WowBrowser for Windows",
    bannerTitle: "Bring WowBrowser to your desktop",
    bannerDescription: "Download it for Windows and open your servers in one place.",
    bannerDownload: "Download for Windows",
    viewDownloads: "View available downloads",
    installer: "Installer .exe",
    portable: "Portable .zip",
    dismissBanner: "Dismiss download notice",
    updateEyebrow: "WOWBROWSER · UPDATE",
    updateTitle: "New version available",
    updateDescription: "A newer version of WowBrowser is available for Windows.",
    installedVersion: "Installed version",
    availableVersion: "Available version",
    releaseNotes: "View release notes",
    downloadInstaller: "Download installer",
    downloadPortable: "Download portable ZIP",
    notNow: "Not now"
  },
  pt: {
    bannerLabel: "Baixar o WowBrowser para Windows",
    bannerTitle: "Leve o WowBrowser para o seu desktop",
    bannerDescription: "Baixe para Windows e abra seus servidores em um só lugar.",
    bannerDownload: "Baixar para Windows",
    viewDownloads: "Ver downloads disponíveis",
    installer: "Instalador .exe",
    portable: "Portátil .zip",
    dismissBanner: "Fechar aviso de download",
    updateEyebrow: "WOWBROWSER · ATUALIZAÇÃO",
    updateTitle: "Nova versão disponível",
    updateDescription: "Há uma versão mais recente do WowBrowser disponível para Windows.",
    installedVersion: "Versão instalada",
    availableVersion: "Versão disponível",
    releaseNotes: "Ver notas da versão",
    downloadInstaller: "Baixar instalador",
    downloadPortable: "Baixar ZIP portátil",
    notNow: "Agora não"
  },
  fr: {
    bannerLabel: "Télécharger WowBrowser pour Windows",
    bannerTitle: "Emportez WowBrowser sur votre bureau",
    bannerDescription: "Téléchargez-le pour Windows et ouvrez vos serveurs au même endroit.",
    bannerDownload: "Télécharger pour Windows",
    viewDownloads: "Voir les téléchargements disponibles",
    installer: "Installateur .exe",
    portable: "Version portable .zip",
    dismissBanner: "Fermer l’avis de téléchargement",
    updateEyebrow: "WOWBROWSER · MISE À JOUR",
    updateTitle: "Nouvelle version disponible",
    updateDescription: "Une version plus récente de WowBrowser est disponible pour Windows.",
    installedVersion: "Version installée",
    availableVersion: "Version disponible",
    releaseNotes: "Voir les notes de version",
    downloadInstaller: "Télécharger l’installateur",
    downloadPortable: "Télécharger le ZIP portable",
    notNow: "Pas maintenant"
  },
  de: {
    bannerLabel: "WowBrowser für Windows herunterladen",
    bannerTitle: "Hol dir WowBrowser auf den Desktop",
    bannerDescription: "Lade es für Windows herunter und öffne deine Server an einem Ort.",
    bannerDownload: "Für Windows herunterladen",
    viewDownloads: "Verfügbare Downloads ansehen",
    installer: "Installer .exe",
    portable: "Portable .zip",
    dismissBanner: "Downloadhinweis schließen",
    updateEyebrow: "WOWBROWSER · UPDATE",
    updateTitle: "Neue Version verfügbar",
    updateDescription: "Eine neuere Version von WowBrowser ist für Windows verfügbar.",
    installedVersion: "Installierte Version",
    availableVersion: "Verfügbare Version",
    releaseNotes: "Versionshinweise ansehen",
    downloadInstaller: "Installer herunterladen",
    downloadPortable: "Portables ZIP herunterladen",
    notNow: "Nicht jetzt"
  }
};

function applyDownloadUiLanguage() {
  const strings = downloadUiText[uiLanguage] || downloadUiText.es;
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const translated = strings[element.dataset.i18n];
    if (translated) element.textContent = translated;
  });
  document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
    const translated = strings[element.dataset.i18nAriaLabel];
    if (translated) element.setAttribute("aria-label", translated);
  });
}

function readJson(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

function normalizeServer(server) {
  const region = legacyRegions[server.region] || server.region;
  return {
    ...server,
    language: languageNames[server.language] ? server.language : "other",
    region: regionNames[region] ? region : "other",
    version: versionNames[server.version] ? server.version : "other"
  };
}

const savedServers = readJson(STORAGE_SERVERS, []);
let userServers = Array.isArray(savedServers) ? savedServers.map(normalizeServer) : [];
const cachedRemoteCatalog = readJson(STORAGE_REMOTE_CATALOG, []);
let remoteServers = Array.isArray(cachedRemoteCatalog) ? cachedRemoteCatalog.map(normalizeServer) : [];let favorites = new Set(readJson(STORAGE_FAVORITES, []));
let clickCounts = {};
let clickStatsLoaded = false;
try { localStorage.removeItem("wowbrowser.visits.v1"); } catch (error) {}
const storedPreferencesValue = readJson(STORAGE_PREFERENCES, {});
const storedPreferences = storedPreferencesValue && typeof storedPreferencesValue === "object" &&
  !Array.isArray(storedPreferencesValue) ? storedPreferencesValue : {};
const shouldMigrateUiLanguage = !Object.hasOwn(storedPreferences, "uiLanguage");
const shouldClearDeniedLocation = storedPreferences.approximateLocation === false;
let preferences = {
  language: "es",
  region: "all",
  version: "all",
  ...storedPreferences
};
if (shouldMigrateUiLanguage)
  preferences.uiLanguage = preferences.language === "en" ? "en" : "es";
if (!Object.hasOwn(uiTextByLanguage, preferences.uiLanguage))
  preferences.uiLanguage = "es";
let uiLanguage = preferences.uiLanguage;
languageNames = metadataNames[uiLanguage].languages;
regionNames = metadataNames[uiLanguage].regions;
versionNames = metadataNames[uiLanguage].versions;
pageNames = pageNamesByLanguage[uiLanguage];
preferences.region = legacyRegions[preferences.region] || preferences.region;
if (!["auto", "all", "americas", "europe", "asia", "oceania"].includes(preferences.region)) preferences.region = "auto";
if (!["es", "en", "pt", "fr", "de", "any"].includes(preferences.language)) preferences.language = "es";
if (!versionNames[preferences.version] && preferences.version !== "all") preferences.version = "all";
if (preferences.approximateLocation !== true) {
  delete preferences.approximateLocation;
  delete preferences.countryCode;
  delete preferences.detectedRegion;
  if (preferences.region === "auto")
    preferences.region = "all";
}
if (!/^[A-Z]{2}$/.test(preferences.countryCode || "")) delete preferences.countryCode;
if (!["americas", "europe", "asia", "oceania", "other"].includes(preferences.detectedRegion)) delete preferences.detectedRegion;
let activeView = "home";
let locationLookupFailed = false;

function allServers() {
  const byId = new Map();
  for (const server of seedServers) byId.set(server.id, server);
  for (const server of remoteServers) byId.set(server.id, server);
  for (const server of userServers) byId.set(server.id, server);
  return [...byId.values()];
}
function applyRemoteCatalog(list) {
  if (!Array.isArray(list)) return false;
  remoteServers = list.map(normalizeServer);
  try { localStorage.setItem(STORAGE_REMOTE_CATALOG, JSON.stringify(list)); } catch (e) {}
  if (activeView === "catalog") renderCatalog();
  return true;
}

async function loadRemoteCatalog() {
  for (const baseUrl of CATALOG_URL_CANDIDATES) {
    try {
      const response = await fetch(baseUrl + (baseUrl.indexOf("?") >= 0 ? "&" : "?") + "t=" + Date.now(), { cache: "no-store" });
      if (!response.ok) throw new Error("HTTP " + response.status);
      const data = await response.json();
      applyRemoteCatalog(data);
      return true;
    } catch (error) {
      try { console.warn("WowBrowser: no se pudo actualizar el catalogo remoto (" + baseUrl + "):", error); } catch (e) {}
    }
  }
  return false;
}
function safeHttpUrl(rawUrl) {
  try {
    const url = new URL(rawUrl);
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : null;
  } catch {
    return null;
  }
}

function serverFaviconUrl(server) {
  if (server && server.favicon) return server.favicon;
  const url = safeHttpUrl(server && server.playUrl);
  if (!url) return null;
  try {
    return new URL(url).origin + "/favicon.ico";
  } catch (error) {
    return null;
  }
}

function serverCard(server) {
  const url = safeHttpUrl(server.playUrl);
  if (!url) return "";
  const isFavorite = favorites.has(server.id);
  const lang = languageNames[server.language] || "Otro";
  const region = regionNames[server.region] || "Sin especificar";
  const version = server.versionLabel || versionNames[server.version] || "Sin especificar";
  const text = uiTextByLanguage[uiLanguage] || {};
  const description = text[server.description] || server.description ||
    text["Servidor añadido por ti."] || "Servidor añadido por ti.";
  const faviconUrl = serverFaviconUrl(server);
  const initial = escapeHtml((server.name || "?").trim().charAt(0).toUpperCase() || "✧");
  const clickKnown = clickStatsLoaded && Number.isFinite(clickCounts[server.id]);
  const clicks = clickKnown ? clickCounts[server.id] : 0;
  const clickLabel = clickKnown ? formatClickCount(clicks) : "—";
  let host = "";
  try {
    host = new URL(url).hostname.replace(/^www\./, "");
  } catch (error) {}
  const crest = faviconUrl
    ? `<img class="server-favicon" src="${escapeHtml(faviconUrl)}" alt="" loading="lazy" decoding="async" width="32" height="32">`
    : `<span class="server-favicon-fallback" aria-hidden="true">${initial}</span>`;
  const registerUrl = safeHttpUrl(server.registerUrl);
  const variants = Array.isArray(server.variants)
    ? server.variants
        .map((variant) => ({
          label: variant && String(variant.label || "").trim(),
          playUrl: safeHttpUrl(variant && variant.playUrl)
        }))
        .filter((variant) => variant.label && variant.playUrl)
    : [];
  const playLinks = variants.length
    ? variants.map((variant) => `<a class="play-link variant-link" href="${escapeHtml(variant.playUrl)}" data-launch="${escapeHtml(server.id)}" title="${escapeHtml(translateUiText("Abrir cliente") + " · " + variant.label)}">${escapeHtml(variant.label)} <span>→</span></a>`).join("")
    : `<a class="play-link" href="${escapeHtml(url)}" data-launch="${escapeHtml(server.id)}">${escapeHtml(translateUiText("Abrir cliente"))} <span>→</span></a>`;
  const registerLink = registerUrl
    ? `<a class="register-link" href="${escapeHtml(registerUrl)}" data-open-external target="_blank" rel="noopener noreferrer">${escapeHtml(translateUiText("Registrarse"))} <span aria-hidden="true">↗</span></a>`
    : "";
  const card = document.createElement("article");
  card.className = "server-card";
  card.innerHTML = `
    <div class="server-card-art">
      <span class="art-landscape" aria-hidden="true"></span>
      <span class="server-crest" aria-hidden="true">${crest}</span>
      ${host ? `<span class="server-domain">${escapeHtml(host)}</span>` : ""}
      <span class="server-symbol" aria-hidden="true">${escapeHtml(server.symbol || "✧")}</span>
      <span class="server-type">${escapeHtml(version)}</span>
    </div>
    <div class="server-card-body">
      <div class="server-card-title-row">
        <h3 title="${escapeHtml(server.name)}">${escapeHtml(server.name)}</h3>
        <button class="favorite-button ${isFavorite ? "is-favorite" : ""}" aria-label="${escapeHtml(translateUiText(isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"))}" data-favorite="${escapeHtml(server.id)}">${isFavorite ? "♥" : "♡"}</button>
      </div>
      <p class="server-description">${escapeHtml(description)}</p>
      <div class="server-meta"><span class="meta-chip">${escapeHtml(lang)}</span><span class="meta-chip region">${escapeHtml(region)}</span><span class="meta-chip version">${escapeHtml(version)}</span></div>
      <div class="server-actions"><div class="server-action-links">${registerLink}${playLinks}</div><span class="server-clicks ${clicks > 0 ? "has-clicks" : ""}" data-clicks-for="${escapeHtml(server.id)}" title="${escapeHtml((clickWords[uiLanguage] || clickWords.es)[2])}"><span class="clicks-dot" aria-hidden="true"></span><span class="clicks-number">${clickLabel}</span> <span class="clicks-word">${escapeHtml(clickWord(clicks))}</span></span></div>
    </div>`;

  const faviconImg = card.querySelector(".server-favicon");
  if (faviconImg) {
    let triedGoogle = false;
    faviconImg.addEventListener("error", () => {
      if (!triedGoogle) {
        triedGoogle = true;
        try {
          const host = new URL(url).hostname;
          faviconImg.src = "https://www.google.com/s2/favicons?domain=" + encodeURIComponent(host) + "&sz=64";
          return;
        } catch (error) {}
      }
      const fallback = document.createElement("span");
      fallback.className = "server-favicon-fallback";
      fallback.setAttribute("aria-hidden", "true");
      fallback.textContent = (server.name || "?").trim().charAt(0).toUpperCase() || "✧";
      faviconImg.replaceWith(fallback);
    });
  }

  return card;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);
}

const originalUiTextNodes = new WeakMap();
function translateUiText(text) {
  return uiTextByLanguage[uiLanguage]?.[text] || text;
}

const clickWords = {
  es: ["clic", "clics", "Clics globales al abrir este servidor"],
  en: ["click", "clicks", "Global clicks to open this server"],
  pt: ["clique", "cliques", "Cliques globais para abrir este servidor"],
  fr: ["clic", "clics", "Clics globaux pour ouvrir ce serveur"],
  de: ["Klick", "Klicks", "Globale Klicks zum Öffnen dieses Servers"]
};
function clickWord(count) {
  const words = clickWords[uiLanguage] || clickWords.es;
  return words[count === 1 ? 0 : 1];
}
function formatClickCount(count) {
  return new Intl.NumberFormat(uiLanguage).format(count);
}
function updateClickDisplays(id) {
  const known = clickStatsLoaded && Number.isFinite(clickCounts[id]);
  const count = known ? clickCounts[id] : 0;
  document.querySelectorAll(".server-clicks").forEach((element) => {
    if (element.dataset.clicksFor !== id) return;
    element.querySelector(".clicks-number").textContent = known ? formatClickCount(count) : "—";
    element.querySelector(".clicks-word").textContent = clickWord(count);
    element.title = (clickWords[uiLanguage] || clickWords.es)[2];
    element.classList.toggle("has-clicks", known && count > 0);
  });
}
function updateAllClickDisplays() {
  document.querySelectorAll(".server-clicks").forEach((element) => {
    updateClickDisplays(element.dataset.clicksFor);
  });
}
async function loadClickStats() {
  try {
    const response = await fetch(CLICK_STATS_URL + "/stats", { cache: "no-store" });
    if (!response.ok) return false;
    const data = await response.json();
    if (!data || !data.counts || typeof data.counts !== "object" || Array.isArray(data.counts))
      return false;
    const nextCounts = {};
    for (const [id, count] of Object.entries(data.counts)) {
      if (Number.isSafeInteger(count) && count >= 0) nextCounts[id] = count;
    }
    clickCounts = nextCounts;
    clickStatsLoaded = true;
    updateAllClickDisplays();
    if (document.querySelector("#sort-filter").value === "most-played") renderCatalog();
    return true;
  } catch {
    return false;
  }
}
function trackServerClick(id) {
  if (!id || id.startsWith("custom-")) return;
  if (clickStatsLoaded) {
    clickCounts[id] = (Number.isFinite(clickCounts[id]) ? clickCounts[id] : 0) + 1;
    updateClickDisplays(id);
  }
  const url = CLICK_STATS_URL + "/servers/" + encodeURIComponent(id) + "/click";
  try {
    if (navigator.sendBeacon && navigator.sendBeacon(url)) {
      window.setTimeout(loadClickStats, 1200);
      return;
    }
  } catch (error) {}
  void fetch(url, { method: "POST", cache: "no-store", keepalive: true }).catch(() => {});
  window.setTimeout(loadClickStats, 1200);
}

function replaceOptions(selector, entries, selectedValue) {
  const select = document.querySelector(selector);
  select.replaceChildren(...entries.map(([value, label]) => new Option(label, value)));
  select.value = entries.some(([value]) => value === selectedValue)
    ? selectedValue
    : entries[0][0];
}

function applyUiLanguage(language) {
  uiLanguage = Object.hasOwn(uiTextByLanguage, language) ? language : "es";
  languageNames = metadataNames[uiLanguage].languages;
  regionNames = metadataNames[uiLanguage].regions;
  versionNames = metadataNames[uiLanguage].versions;
  pageNames = pageNamesByLanguage[uiLanguage];
  const text = uiTextByLanguage[uiLanguage] || {};
  document.documentElement.lang = uiLanguage;
  if (window.__wowbrowser?.native === true) {
    try {
      window.location.href = "wowbrowser://language/" + uiLanguage;
    } catch (error) {
      // El puente nativo no está disponible fuera de WowBrowser.
    }
  }

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();
  while (node) {
    if (!originalUiTextNodes.has(node))
      originalUiTextNodes.set(node, node.nodeValue);
    const original = originalUiTextNodes.get(node);
    const match = original.match(/^(\s*)([\s\S]*?)(\s*)$/);
    const text = match[2];
    const translated = translateUiText(text);
    node.nodeValue = `${match[1]}${translated}${match[3]}`;
    node = walker.nextNode();
  }

  document.title = documentTitles[uiLanguage] || documentTitles.es;
  const locales = Object.entries(languageNames).filter(([value]) => ["es", "en", "pt", "fr", "de"].includes(value));
  const languageOptions = Object.entries(languageNames);
  const regionOptions = Object.entries(regionNames);
  const versionOptions = Object.entries(versionNames);
  replaceOptions("#ui-language", locales, uiLanguage);
  replaceOptions("#language-filter", [["all", text["Todos los idiomas"] || "Todos los idiomas"], ...languageOptions], document.querySelector("#language-filter").value || "all");
  replaceOptions("#preferred-language", [...languageOptions, ["any", text["Cualquier idioma"] || "Cualquier idioma"]], preferences.language);
  replaceOptions("#add-server-form [name='language']", languageOptions, document.querySelector("#add-server-form [name='language']").value || "es");
  replaceOptions("#region-filter", [["all", text["Cualquier región"] || "Cualquier región"], ...regionOptions], document.querySelector("#region-filter").value || "all");
  replaceOptions("#preferred-region", [
    ["auto", text["Automática (país aproximado)"] || "Automática (país aproximado)"],
    ["all", text["Cualquier región"] || "Cualquier región"],
    ...regionOptions.filter(([value]) => value !== "other")
  ], preferences.region);
  replaceOptions("#add-server-form [name='region']", regionOptions, document.querySelector("#add-server-form [name='region']").value || "americas");
  replaceOptions("#version-filter", [
    ["all", text["Todas las versiones"] || "Todas las versiones"],
    ...versionOptions
  ], document.querySelector("#version-filter").value || "all");
  replaceOptions("#preferred-version", [
    ["all", text["Cualquier versión"] || "Cualquier versión"],
    ...versionOptions
  ], preferences.version);
  replaceOptions("#add-server-form [name='version']", versionOptions, document.querySelector("#add-server-form [name='version']").value || "other");
  document.querySelector("#server-search").placeholder = text["Buscar nombre, idioma o versión…"] || "Buscar nombre, idioma o versión…";
  document.querySelector("#server-search").setAttribute("aria-label", text["Buscar servidores"] || "Buscar servidores");
  document.querySelector('[name="name"]').placeholder = text["Nombre del servidor"] || "Nombre del servidor";
  document.querySelector("#language-filter").setAttribute("aria-label", text["Filtrar por idioma"] || "Filtrar por idioma");
  document.querySelector("#version-filter").setAttribute("aria-label", text["Filtrar por versión del juego"] || "Filtrar por versión del juego");
  document.querySelector("#region-filter").setAttribute("aria-label", text["Filtrar por región"] || "Filtrar por región");
  document.querySelector("#sort-filter").setAttribute("aria-label", text["Ordenar servidores"] || "Ordenar servidores");
  document.querySelector("#location-toggle").setAttribute("aria-label", text["Permitir país aproximado por IP"] || "Permitir país aproximado por IP");
  document.querySelector("#close-add-server").setAttribute("aria-label", text["Cerrar"] || "Cerrar");
  document.querySelector("#ui-language").setAttribute("aria-label", text["Idioma de la interfaz"] || "Idioma de la interfaz");
  document.querySelector(".brand").setAttribute("aria-label", translateUiText("WowBrowser, inicio"));
  document.querySelector(".main-nav").setAttribute("aria-label", translateUiText("Navegación principal"));
  document.querySelector("#page-title").textContent = pageNames[activeView];
  updateLocationStatus();
  applyDownloadUiLanguage();
  renderAll();
}

function renderGrid(element, servers) {
  element.replaceChildren(...servers.map(serverCard).filter(Boolean));
}

function preferredServers(servers) {
  const preferredRegion = preferences.region === "auto"
    ? (preferences.detectedRegion || "all")
    : preferences.region;
  return [...servers].sort((left, right) => {
    const languageScore = (server) => preferences.language === "any" || server.language === preferences.language ? 1 : 0;
    const regionScore = (server) => preferredRegion === "all" || server.region === preferredRegion ? 1 : 0;
    const versionScore = (server) => preferences.version === "all" || server.version === preferences.version ? 1 : 0;
    return (languageScore(right) + regionScore(right) + versionScore(right)) -
      (languageScore(left) + regionScore(left) + versionScore(left));
  });
}

function renderCatalog() {
  const query = document.querySelector("#server-search").value.trim().toLocaleLowerCase();
  const language = document.querySelector("#language-filter").value;
  const version = document.querySelector("#version-filter").value;
  const region = document.querySelector("#region-filter").value;
  const servers = preferredServers(allServers()).filter((server) => {
    const searchable = [
      server.name,
      server.description,
      server.versionLabel || "",
      languageNames[server.language],
      regionNames[server.region],
      versionNames[server.version],
      ...(Array.isArray(server.variants) ? server.variants.map((variant) => (variant && variant.label) || "") : [])
    ].join(" ").toLocaleLowerCase();
    const matchesQuery = !query || searchable.includes(query);
    return matchesQuery &&
      (language === "all" || server.language === language) &&
      (version === "all" || server.version === version) &&
      (region === "all" || server.region === region);
  });
  if (document.querySelector("#sort-filter").value === "most-played") {
    servers.sort((left, right) => {
      const leftClicks = Number.isFinite(clickCounts[left.id]) ? clickCounts[left.id] : 0;
      const rightClicks = Number.isFinite(clickCounts[right.id]) ? clickCounts[right.id] : 0;
      return rightClicks - leftClicks;
    });
  }
  renderGrid(document.querySelector("#catalog-server-grid"), servers);
  const countUnit = {
    es: ["servidor", "servidores"],
    en: ["server", "servers"],
    pt: ["servidor", "servidores"],
    fr: ["serveur", "serveurs"],
    de: ["Server", "Server"]
  }[uiLanguage] || ["servidores", "servidores"];
  document.querySelector("#server-count").textContent =
    `${new Intl.NumberFormat(uiLanguage).format(servers.length)} ${countUnit[servers.length === 1 ? 0 : 1]}`;
  document.querySelector("#empty-state").classList.toggle("hidden", servers.length > 0);
}

function renderAll() {
  const recommended = preferredServers(allServers());
  renderGrid(document.querySelector("#home-server-grid"), recommended.slice(0, 4));
  renderCatalog();

  const favoriteServers = allServers().filter((server) => favorites.has(server.id));
  renderGrid(document.querySelector("#favorites-server-grid"), favoriteServers);
  document.querySelector("#favorites-empty").classList.toggle("hidden", favoriteServers.length > 0);
}

function setView(view) {
  if (!pageNames[view]) return;
  activeView = view;
  document.querySelectorAll(".view").forEach((element) => element.classList.remove("active"));
  document.querySelector(`#view-${view}`).classList.add("active");
  document.querySelectorAll("[data-view]").forEach((element) => {
    const isNavigationItem = element.classList.contains("nav-item") ||
      element.classList.contains("settings-link");
    element.classList.toggle("active", isNavigationItem && element.dataset.view === view);
  });
  document.querySelector("#page-title").textContent = pageNames[view];
  if (view === "catalog") renderCatalog();
  window.scrollTo(0, 0);
}

function toggleFavorite(id) {
  if (favorites.has(id)) favorites.delete(id);
  else favorites.add(id);
  localStorage.setItem(STORAGE_FAVORITES, JSON.stringify([...favorites]));
  renderAll();
}

function savePreferences() {
  localStorage.setItem(STORAGE_PREFERENCES, JSON.stringify(preferences));
}

function regionForCountry(countryCode) {
  for (const [region, codes] of Object.entries(countryRegionCodes)) {
    if (codes.has(countryCode))
      return region;
  }
  return "other";
}

function updateLocationStatus() {
  const enabled = preferences.approximateLocation === true;
  const status = document.querySelector("#location-status");
  const detail = document.querySelector("#location-detail");
  const toggle = document.querySelector("#location-toggle");
  toggle.checked = enabled;

  if (!enabled) {
    status.textContent = translateUiText("País aproximado desactivado");
    detail.textContent = translateUiText("La región se elige manualmente");
    return;
  }

  if (preferences.detectedRegion && preferences.detectedRegion !== "other") {
    status.textContent = translateUiText("País aproximado activo");
    detail.textContent = `${translateUiText("Región detectada:")} ${regionNames[preferences.detectedRegion]}`;
  } else if (preferences.countryCode) {
    status.textContent = translateUiText("País aproximado activo");
    detail.textContent = translateUiText("País detectado; elige la región manualmente");
  } else if (locationLookupFailed) {
    status.textContent = translateUiText("No se pudo detectar el país");
    detail.textContent = translateUiText("La región se elige manualmente");
  } else {
    status.textContent = translateUiText("País aproximado activo");
    detail.textContent = translateUiText("Detectando región desde la IP…");
  }
}

function saveNativePreferences(payload) {
  if (window.__wowbrowser?.native !== true) return;
  try {
    window.location.href = "wowbrowser://prefs/save?payload=" + encodeURIComponent(JSON.stringify(payload));
  } catch (e) {}
}

async function refreshApproximateCountry() {
  if (preferences.approximateLocation !== true)
    return;

  locationLookupFailed = false;
  try {
    const response = await fetch("https://api.country.is/", {
      cache: "no-store",
      credentials: "omit",
      referrerPolicy: "no-referrer",
      signal: AbortSignal.timeout(8000)
    });
    if (!response.ok)
      throw new Error("Country lookup failed");

    const payload = await response.json();
    const countryCode = String(payload.country || "").trim().toUpperCase();
    if (!/^[A-Z]{2}$/.test(countryCode))
      throw new Error("Invalid country code");

    preferences.countryCode = countryCode;
    preferences.detectedRegion = regionForCountry(countryCode);
    locationLookupFailed = false;
    savePreferences();
    const nativePayload = { approximateLocation: true };
    if (preferences.countryCode) nativePayload.countryCode = preferences.countryCode;
    if (preferences.detectedRegion) nativePayload.detectedRegion = preferences.detectedRegion;
    saveNativePreferences(nativePayload);
    updateLocationStatus();
    renderAll();
  } catch {
    // Keep the last coarse country, if available; never store the IP address.
    locationLookupFailed = true;
    updateLocationStatus();
  }
}

const locationConsentDialog = document.querySelector("#location-consent-dialog");
function resolveLocationConsent(allowed) {
  if (locationConsentDialog.open)
    locationConsentDialog.close();

  if (allowed) {
    locationLookupFailed = false;
    preferences.approximateLocation = true;
    preferences.region = "auto";
    document.querySelector("#preferred-region").value = "auto";
    savePreferences();
    const nativePayload = { approximateLocation: true };
    if (preferences.countryCode) nativePayload.countryCode = preferences.countryCode;
    if (preferences.detectedRegion) nativePayload.detectedRegion = preferences.detectedRegion;
    saveNativePreferences(nativePayload);
    updateLocationStatus();
    renderAll();
    void refreshApproximateCountry();
    return;
  }

  delete preferences.approximateLocation;
  delete preferences.countryCode;
  delete preferences.detectedRegion;
  locationLookupFailed = false;
  if (preferences.region === "auto") {
    preferences.region = "all";
    document.querySelector("#preferred-region").value = "all";
  }
  savePreferences();
  saveNativePreferences({});
  updateLocationStatus();
  renderAll();
}

function showLocationConsent() {
  if (!locationConsentDialog.open)
    locationConsentDialog.showModal();
}

function parseSemanticVersion(value) {
  if (typeof value !== "string") return null;
  const match = /^v?(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:\.(0|[1-9]\d*))?(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/.exec(value.trim());
  if (!match) return null;
  const prerelease = match[5] ? match[5].split(".") : null;
  if (prerelease && prerelease.some((identifier) => /^\d+$/.test(identifier) && identifier.length > 1 && identifier.startsWith("0")))
    return null;
  return {
    core: [BigInt(match[1]), BigInt(match[2]), BigInt(match[3]), BigInt(match[4] || "0")],
    prerelease
  };
}

function compareSemanticVersions(left, right) {
  const a = parseSemanticVersion(left);
  const b = parseSemanticVersion(right);
  if (!a || !b) return null;
  for (let index = 0; index < a.core.length; index += 1) {
    if (a.core[index] < b.core[index]) return -1;
    if (a.core[index] > b.core[index]) return 1;
  }
  if (!a.prerelease && !b.prerelease) return 0;
  if (!a.prerelease) return 1;
  if (!b.prerelease) return -1;
  const length = Math.max(a.prerelease.length, b.prerelease.length);
  for (let index = 0; index < length; index += 1) {
    const leftIdentifier = a.prerelease[index];
    const rightIdentifier = b.prerelease[index];
    if (leftIdentifier === undefined) return -1;
    if (rightIdentifier === undefined) return 1;
    if (leftIdentifier === rightIdentifier) continue;
    const leftNumeric = /^\d+$/.test(leftIdentifier);
    const rightNumeric = /^\d+$/.test(rightIdentifier);
    if (leftNumeric && rightNumeric) {
      const leftNumber = BigInt(leftIdentifier);
      const rightNumber = BigInt(rightIdentifier);
      if (leftNumber < rightNumber) return -1;
      if (leftNumber > rightNumber) return 1;
    } else if (leftNumeric !== rightNumeric) {
      return leftNumeric ? -1 : 1;
    } else {
      return leftIdentifier < rightIdentifier ? -1 : 1;
    }
  }
  return 0;
}

function safeDownloadUrl(rawUrl) {
  try {
    const url = new URL(rawUrl);
    return url.protocol === "https:" ? url.href : null;
  } catch {
    return null;
  }
}

function normalizeVersionManifest(payload) {
  if (!payload || payload.schemaVersion !== 1 || !parseSemanticVersion(payload.version)) return null;
  const windows = payload.downloads?.windows;
  return {
    version: payload.version.trim(),
    releaseUrl: safeDownloadUrl(payload.releaseUrl) || RELEASE_URL_LATEST,
    installer: safeDownloadUrl(windows?.installer) || WINDOWS_DOWNLOADS_LATEST.installer,
    portable: safeDownloadUrl(windows?.portable) || WINDOWS_DOWNLOADS_LATEST.portable
  };
}

const downloadBanner = document.querySelector("#download-banner");
const updateDialog = document.querySelector("#update-dialog");
let downloadBannerDismissed = false;
let pendingUpdate = null;
let nativeUpdateCheckStarted = false;
let wowbrowserReady = false;

function updateDownloadBanner() {
  const visible = wowbrowserReady && window.__wowbrowser?.native !== true && !downloadBannerDismissed;
  downloadBanner.hidden = !visible;
  document.body.classList.toggle("has-download-banner", visible);
}

function presentPendingUpdate() {
  if (!pendingUpdate || locationConsentDialog.open || updateDialog.open) return;
  updateDialog.showModal();
}

async function checkForAppUpdate() {
  if (window.__wowbrowser?.native !== true || window.__wowbrowser?.platform !== "windows") return;
  try {
    const response = await fetch("version.json", { cache: "no-store", credentials: "omit" });
    if (!response.ok) return;
    const manifest = normalizeVersionManifest(await response.json());
    if (!manifest) return;
    const installedVersion = window.__wowbrowser?.version;
    if (compareSemanticVersions(manifest.version, installedVersion) !== 1) return;
    document.querySelector("#update-installed-version").textContent = String(installedVersion).trim();
    document.querySelector("#update-available-version").textContent = manifest.version;
    document.querySelector("#update-release-link").href = manifest.releaseUrl;
    pendingUpdate = manifest;
    presentPendingUpdate();
  } catch {
    // La comprobación de versión es opcional y nunca debe interrumpir el catálogo.
  }
}

function refreshNativeFeatures() {
  if (!wowbrowserReady) return;
  const appVersion = document.querySelector("#app-version");
  if (window.__wowbrowser?.native === true && typeof window.__wowbrowser.version === "string") {
    appVersion.textContent = "v" + window.__wowbrowser.version.trim();
    appVersion.hidden = false;
  } else {
    appVersion.textContent = "";
    appVersion.hidden = true;
  }
  updateDownloadBanner();
  if (window.__wowbrowser?.native === true && !nativeUpdateCheckStarted) {
    nativeUpdateCheckStarted = true;
    void checkForAppUpdate();
  }
}

function openAddDialog() {
  document.querySelector("#add-server-dialog").showModal();
}

document.addEventListener("click", (event) => {
  const externalLink = event.target.closest("[data-open-external]");
  if (externalLink) {
    const url = safeHttpUrl(externalLink.href);
    if (!url) {
      event.preventDefault();
      return;
    }
    if (window.__wowbrowser?.native === true) {
      event.preventDefault();
      window.location.href = "wowbrowser://open-external?url=" + encodeURIComponent(url);
    }
    return;
  }

  const viewButton = event.target.closest("[data-view]");
  if (viewButton) {
    event.preventDefault();
    setView(viewButton.dataset.view);
    return;
  }

  const favoriteButton = event.target.closest("[data-favorite]");
  if (favoriteButton) {
    toggleFavorite(favoriteButton.dataset.favorite);
    return;
  }

  const launchLink = event.target.closest("[data-launch]");
  if (launchLink) {
    const target = safeHttpUrl(launchLink.href);
    if (!target) {
      event.preventDefault();
      return;
    }
    trackServerClick(launchLink.dataset.launch);
    // The native browser chrome keeps Home and Back available while the game runs.
  }
});

document.querySelector("#open-add-server").addEventListener("click", () => {
  window.location.href = "https://forms.gle/DKUQuvgxgoK16JMN9";
});
document.querySelector("#close-add-server").addEventListener("click", () => document.querySelector("#add-server-dialog").close());
document.querySelector("#cancel-add-server").addEventListener("click", () => document.querySelector("#add-server-dialog").close());
document.querySelector("#server-search").addEventListener("input", renderCatalog);
document.querySelector("#language-filter").addEventListener("change", renderCatalog);
document.querySelector("#version-filter").addEventListener("change", renderCatalog);
document.querySelector("#region-filter").addEventListener("change", renderCatalog);
document.querySelector("#sort-filter").addEventListener("change", renderCatalog);

document.querySelector("#ui-language").value = uiLanguage;
document.querySelector("#preferred-language").value = preferences.language;
document.querySelector("#preferred-region").value = preferences.region;
document.querySelector("#preferred-version").value = preferences.version;
document.querySelector("#ui-language").addEventListener("change", (event) => {
  preferences.uiLanguage = event.target.value;
  savePreferences();
  applyUiLanguage(preferences.uiLanguage);
});
document.querySelector("#preferred-language").addEventListener("change", (event) => {
  preferences.language = event.target.value;
  savePreferences();
  renderAll();
});
document.querySelector("#preferred-region").addEventListener("change", (event) => {
  preferences.region = event.target.value;
  savePreferences();
  renderAll();
});
document.querySelector("#preferred-version").addEventListener("change", (event) => {
  preferences.version = event.target.value;
  savePreferences();
  renderAll();
});

document.querySelector("#location-toggle").addEventListener("change", (event) => {
  if (event.target.checked) {
    showLocationConsent();
  } else {
    resolveLocationConsent(false);
  }
});
document.querySelector("#allow-location").addEventListener("click", () => resolveLocationConsent(true));
document.querySelector("#deny-location").addEventListener("click", () => resolveLocationConsent(false));
locationConsentDialog.addEventListener("cancel", (event) => {
  event.preventDefault();
  resolveLocationConsent(false);
});
locationConsentDialog.addEventListener("close", presentPendingUpdate);
updateDialog.addEventListener("close", () => {
  pendingUpdate = null;
});
document.querySelector("#dismiss-download-banner").addEventListener("click", () => {
  downloadBannerDismissed = true;
  updateDownloadBanner();
});
document.querySelector("#dismiss-update").addEventListener("click", () => updateDialog.close());
window.addEventListener("wowbrowser:native", refreshNativeFeatures);
updateLocationStatus();
window.addEventListener("wowbrowser:ready", () => {
  wowbrowserReady = true;
  refreshNativeFeatures();
  try {
    if (window.__nativePrefs && typeof window.__nativePrefs === "object") {
      const np = window.__nativePrefs;
      if (typeof np.approximateLocation === "boolean")
        preferences.approximateLocation = np.approximateLocation;
      if (typeof np.countryCode === "string")
        preferences.countryCode = np.countryCode;
      if (typeof np.detectedRegion === "string")
        preferences.detectedRegion = np.detectedRegion;
      if (np.approximateLocation === true && preferences.region !== "auto")
        preferences.region = "auto";
      savePreferences();
    }
  } catch (e) {}
  if (typeof preferences.approximateLocation !== "boolean") {
    showLocationConsent();
  } else if (preferences.approximateLocation) {
    void refreshApproximateCountry();
  }
}, { once: true });

document.querySelector("#add-server-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const name = String(form.get("name")).trim();
  const playUrl = safeHttpUrl(String(form.get("url")).trim());
  if (!name || !playUrl) {
    window.alert("Introduce un nombre y una URL http o https válida.");
    return;
  }
  const server = {
    id: `custom-${Date.now()}`,
    name,
    playUrl,
    language: String(form.get("language")),
    region: String(form.get("region")),
    version: String(form.get("version")),
    description: "Servidor guardado localmente en este dispositivo.",
    symbol: "✧",
    source: "user"
  };
  userServers = [...userServers, server];
  localStorage.setItem(STORAGE_SERVERS, JSON.stringify(userServers));
  event.currentTarget.reset();
  document.querySelector("#add-server-dialog").close();
  renderAll();
  setView("catalog");
});

if (shouldMigrateUiLanguage || shouldClearDeniedLocation)
  savePreferences();
applyUiLanguage(uiLanguage);
loadRemoteCatalog();
void loadClickStats();
window.setInterval(loadClickStats, 60000);
