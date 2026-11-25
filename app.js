"use strict";

const STORAGE_SERVERS = "wowbrowser.servers.v1";const STORAGE_FAVORITES = "wowbrowser.favorites.v1";
const STORAGE_PREFERENCES = "wowbrowser.preferences.v1";
const STORAGE_REMOTE_CATALOG = "wowbrowser.remoteCatalog.v1";
const CATALOG_URL = (function () {
  try { return localStorage.getItem("wowbrowser.catalogUrl") || "https://microbica.github.io/WowBrowser-Catalog/catalog.json"; }
  catch (e) { return "https://microbica.github.io/WowBrowser-Catalog/catalog.json"; }
})();
const seedServers = [
  {
    id: "grimfall-wow",
    name: "Grimfall WoW",
    playUrl: "https://www.grimfallwow.com/play",
    language: "en",
    region: "other",
    version: "other",
    description: "Explora el cliente web y consulta la información del servidor.",
    symbol: "✧",
    source: "seed"
  },
  {
    id: "wow-peru-land",
    name: "WoW Perú Land",
    playUrl: "https://play.wowperuland.com/",
    language: "es",
    region: "americas",
    version: "other",
    description: "Una opción en español para descubrir desde el navegador.",
    symbol: "✦",
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
  "Ordenar": "Sort by", "Más jugados · próximamente": "Most played · coming soon",
  "No encontramos servidores": "No servers found",
  "Prueba con otro término o añade un servidor.": "Try another search or add a server.",
  "Los votos diarios y “Más jugados” se activarán al conectar el catálogo a un servicio central. Este prototipo no registra ni simula votos.": "Daily votes and “Most played” will be enabled once the catalog has a central service. This prototype does not record or simulate votes.",
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
  "Si lo permites, ipapi.co recibe tu IP pública para devolver únicamente el código de país. WowBrowser no guarda tu IP y puedes desactivarlo aquí.": "If enabled, ipapi.co receives your public IP to return only a country code. WowBrowser does not store your IP; disable it here anytime.",
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
    "No verificado": "Unverified", "Abrir cliente": "Open client",
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
  "Si aceptas, en cada inicio consultaremos ipapi.co para obtener solo tu país aproximado. El servicio recibe tu IP pública. WowBrowser no la guarda ni solicita GPS o coordenadas precisas. Guardaremos el permiso. Si eliges «Ahora no», volveremos a preguntarte al próximo inicio. Puedes desactivarlo en Preferencias.": "If you allow it, we’ll query ipapi.co at each startup to get only your approximate country. The service receives your public IP. WowBrowser does not store it or request GPS or precise coordinates. We’ll remember your permission. If you choose “Not now,” we’ll ask again the next time you open WowBrowser. You can turn it off in Preferences.",
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
    "Más jugados · próximamente": "Mais jogados · em breve",
    "No encontramos servidores": "Não encontramos servidores",
    "Prueba con otro término o añade un servidor.": "Tente outro termo ou adicione um servidor.",
    "Los votos diarios y “Más jugados” se activarán al conectar el catálogo a un servicio central. Este prototipo no registra ni simula votos.": "Os votos diários e “Mais jogados” serão ativados quando o catálogo se conectar a um serviço central. Este protótipo não registra nem simula votos.",
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
    "Si lo permites, ipapi.co recibe tu IP pública para devolver únicamente el código de país. WowBrowser no guarda tu IP y puedes desactivarlo aquí.": "Se permitido, ipapi.co recebe seu IP público e retorna apenas o código do país. WowBrowser não salva seu IP; você pode desativar aqui.",
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
    "No verificado": "Não verificado", "Abrir cliente": "Abrir cliente",
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
    "Si aceptas, en cada inicio consultaremos ipapi.co para obtener solo tu país aproximado. El servicio recibe tu IP pública. WowBrowser no la guarda ni solicita GPS o coordenadas precisas. Guardaremos el permiso. Si eliges «Ahora no», volveremos a preguntarte al próximo inicio. Puedes desactivarlo en Preferencias.": "Se você permitir, consultaremos ipapi.co a cada inicialização para obter apenas seu país aproximado. O serviço recebe seu IP público. O WowBrowser não o armazena nem solicita GPS ou coordenadas precisas. Sua permissão será lembrada. Se escolher “Agora não”, perguntaremos novamente na próxima vez que abrir o WowBrowser. Você pode desativar essa opção em Preferências."
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
    "Más jugados · próximamente": "Les plus joués · bientôt",
    "No encontramos servidores": "Aucun serveur trouvé",
    "Prueba con otro término o añade un servidor.": "Essayez un autre terme ou ajoutez un serveur.",
    "Los votos diarios y “Más jugados” se activarán al conectar el catálogo a un servicio central. Este prototipo no registra ni simula votos.": "Les votes quotidiens et le classement « Les plus joués » seront activés avec un service central. Ce prototype n’enregistre ni ne simule de votes.",
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
    "Si lo permites, ipapi.co recibe tu IP pública para devolver únicamente el código de país. WowBrowser no guarda tu IP y puedes desactivarlo aquí.": "Si vous l’autorisez, ipapi.co reçoit votre IP publique et renvoie uniquement le code pays. WowBrowser ne conserve pas votre IP ; vous pouvez désactiver cette option ici.",
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
    "No verificado": "Non vérifié", "Abrir cliente": "Ouvrir le client",
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
    "Si aceptas, en cada inicio consultaremos ipapi.co para obtener solo tu país aproximado. El servicio recibe tu IP pública. WowBrowser no la guarda ni solicita GPS o coordenadas precisas. Guardaremos el permiso. Si eliges «Ahora no», volveremos a preguntarte al próximo inicio. Puedes desactivarlo en Preferencias.": "Si vous l’autorisez, nous consulterons ipapi.co à chaque démarrage pour obtenir uniquement votre pays approximatif. Le service reçoit votre IP publique. WowBrowser ne la stocke pas et ne demande ni GPS ni coordonnées précises. Votre autorisation sera mémorisée. Si vous choisissez « Pas maintenant », nous vous le redemanderons au prochain lancement. Vous pouvez désactiver cette option dans Préférences."
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
    "Más jugados · próximamente": "Meistgespielt · demnächst",
    "No encontramos servidores": "Keine Server gefunden",
    "Prueba con otro término o añade un servidor.": "Versuche einen anderen Suchbegriff oder füge einen Server hinzu.",
    "Los votos diarios y “Más jugados” se activarán al conectar el catálogo a un servicio central. Este prototipo no registra ni simula votos.": "Tägliche Stimmen und „Meistgespielt“ werden mit einem zentralen Dienst aktiviert. Dieser Prototyp erfasst oder simuliert keine Stimmen.",
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
    "Si lo permites, ipapi.co recibe tu IP pública para devolver únicamente el código de país. WowBrowser no guarda tu IP y puedes desactivarlo aquí.": "Wenn erlaubt, erhält ipapi.co deine öffentliche IP und gibt nur den Ländercode zurück. WowBrowser speichert deine IP nicht; du kannst dies hier deaktivieren.",
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
    "No verificado": "Nicht verifiziert", "Abrir cliente": "Client öffnen",
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
    "Si aceptas, en cada inicio consultaremos ipapi.co para obtener solo tu país aproximado. El servicio recibe tu IP pública. WowBrowser no la guarda ni solicita GPS o coordenadas precisas. Guardaremos el permiso. Si eliges «Ahora no», volveremos a preguntarte al próximo inicio. Puedes desactivarlo en Preferencias.": "Wenn du zustimmst, fragen wir ipapi.co bei jedem Start nach deinem ungefähren Land. Der Dienst erhält deine öffentliche IP. WowBrowser speichert sie nicht und fragt weder GPS noch genaue Koordinaten ab. Deine Zustimmung wird gespeichert. Wenn du „Nicht jetzt“ wählst, fragen wir beim nächsten Start erneut. Du kannst die Funktion in den Einstellungen deaktivieren."
  }
};

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
  try {
    const response = await fetch(CATALOG_URL + (CATALOG_URL.indexOf("?") >= 0 ? "&" : "?") + "t=" + Date.now(), { cache: "no-store" });
    if (!response.ok) throw new Error("HTTP " + response.status);
    const data = await response.json();
    applyRemoteCatalog(data);
    return true;
  } catch (error) {
    try { console.warn("WowBrowser: no se pudo actualizar el catalogo remoto:", error); } catch (e) {}
    return false;
  }
}
function safeHttpUrl(rawUrl) {
  try {
    const url = new URL(rawUrl);
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : null;
  } catch {
    return null;
  }
}

function serverCard(server) {
  const url = safeHttpUrl(server.playUrl);
  if (!url) return "";
  const isFavorite = favorites.has(server.id);
  const lang = languageNames[server.language] || "Otro";
  const region = regionNames[server.region] || "Sin especificar";
  const version = versionNames[server.version] || "Sin especificar";
  const text = uiTextByLanguage[uiLanguage] || {};
  const description = text[server.description] || server.description ||
    text["Servidor añadido por ti."] || "Servidor añadido por ti.";
  const card = document.createElement("article");
  card.className = "server-card";
  card.innerHTML = `
    <div class="server-card-art">
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
      <div class="server-actions"><a class="play-link" href="${escapeHtml(url)}" data-launch="${escapeHtml(server.id)}">${escapeHtml(translateUiText("Abrir cliente"))} <span>→</span></a><span class="server-status">${escapeHtml(translateUiText("No verificado"))}</span></div>
    </div>`;
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
  try {
    window.location.href = "wowbrowser://language/" + uiLanguage;
  } catch (error) {
    // El puente nativo no está disponible fuera de WowBrowser.
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

  document.title = "WowBrowser";
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
      languageNames[server.language],
      regionNames[server.region],
      versionNames[server.version]
    ].join(" ").toLocaleLowerCase();
    const matchesQuery = !query || searchable.includes(query);
    return matchesQuery &&
      (language === "all" || server.language === language) &&
      (version === "all" || server.version === version) &&
      (region === "all" || server.region === region);
  });
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

async function refreshApproximateCountry() {
  if (preferences.approximateLocation !== true)
    return;

  locationLookupFailed = false;
  try {
    const response = await fetch("https://ipapi.co/country/", {
      cache: "no-store",
      credentials: "omit",
      referrerPolicy: "no-referrer",
      signal: AbortSignal.timeout(8000)
    });
    if (!response.ok)
      throw new Error("Country lookup failed");

    const countryCode = (await response.text()).trim().toUpperCase();
    if (!/^[A-Z]{2}$/.test(countryCode))
      throw new Error("Invalid country code");

    preferences.countryCode = countryCode;
    preferences.detectedRegion = regionForCountry(countryCode);
    locationLookupFailed = false;
    savePreferences();
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
  updateLocationStatus();
  renderAll();
}

function showLocationConsent() {
  if (!locationConsentDialog.open)
    locationConsentDialog.showModal();
}

function openAddDialog() {
  document.querySelector("#add-server-dialog").showModal();
}

document.addEventListener("click", (event) => {
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
updateLocationStatus();
window.addEventListener("wowbrowser:ready", () => {
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
