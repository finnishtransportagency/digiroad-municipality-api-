export const allowedTrafficSigns = [
  'A1.2 Mutka',
  'A1.1 Mutka',
  'A2.1 Mutkia',
  'A2.2 Mutkia',
  'A3.1 Jyrkkä mäki',
  'A3.2 Jyrkkä mäki',
  'A4 Kapeneva tie',
  'A5 Kaksisuuntainen liikenne',
  'A6 Avattava silta',
  'A7 Lautta, laituri tai ranta',
  'A8 Liikenneruuhka',
  'A9 Epätasainen tie',
  'A10 Töyssyjä',
  'A11 Tietyö',
  'A12 Irtokiviä',
  'A13 Liukas ajorata',
  'A14 Vaarallinen tien reuna',
  'A15 Suojatien ennakkovaroitus',
  'A16 Jalankulkijoita',
  'A17 Lapsia',
  'A18 Pyöräilijöitä',
  'A19 Hiihtolatu',
  'A20.1 Hirvi',
  'A20.2 Poro',
  'A20.3 Kauriseläin',
  'A21 Tienristeys',
  'A22.1 Sivutien risteys',
  'A22.2 Sivutien risteys',
  'A22.3 Sivutien risteys',
  'A22.4 Sivutien risteys',
  'A23 Liikennevalot',
  'A24 Liikenneympyrä',
  'A25 Raitiovaunu',
  'A26 Rautatien tasoristeys ilman puomeja',
  'A27 Rautatien tasoristeys, jossa on puomit',
  'A28.1 Rautatien tasoristeyksen lähestymismerkki',
  'A28.2 Rautatien tasoristeyksen lähestymismerkki',
  'A28.3 Rautatien tasoristeyksen lähestymismerkki',
  'A29.1 Tasoristeys',
  'A29.2 Tasoristeys',
  'A30 Putoavia kiviä',
  'A31 Matalalla lentäviä lentokoneita',
  'A32 Sivutuuli',
  'A33 Muu vaara',
  'B1 Etuajo-oikeutettu tie',
  'B1 Etuajo-oikeutettu tie',
  'B2 Etuajo-oikeuden päättyminen',
  'B3 Etuajo-oikeus kohdattaessa',
  'B4 Väistämisvelvollisuus kohdattaessa',
  'B5 Väistämisvelvollisuus risteyksessä',
  'B6 Pakollinen pysäyttäminen',
  'B7 Väistämisvelvollisuus pyöräilijän tienylityspaikassa',
  'C1 Ajoneuvolla ajo kielletty',
  'C2 Moottorikäyttöisellä ajoneuvolla ajo kielletty',
  'C3 Kuorma- ja pakettiautolla ajo kielletty',
  'C4 Ajoneuvoyhdistelmällä ajo kielletty',
  'C5 Traktorilla ajo kielletty',
  'C6 Moottoripyörällä ajo kielletty',
  'C7 Moottorikelkalla ajo kielletty',
  'C8 Vaarallisten aineiden kuljetus kielletty',
  'C9 Linja-autolla ajo kielletty',
  'C10 Mopolla ajo kielletty',
  'C11 Polkupyörällä ajo kielletty',
  'C12 Polkupyörällä ja mopolla ajo kielletty',
  'C13 Jalankulku kielletty',
  'C14 Jalankulku ja polkupyörällä ajo kielletty',
  'C15 Jalankulku ja polkupyörällä ja mopolla ajo kielletty',
  'C16 Ratsastus kielletty',
  'C17 Kielletty ajosuunta',
  'C18 Vasemmalle kääntyminen kielletty',
  'C19 Oikealle kääntyminen kielletty',
  'C20 U-käännös kielletty',
  'C21 Ajoneuvon suurin sallittu leveys',
  'C22 Ajoneuvon suurin sallittu korkeus',
  'C23 Ajoneuvon tai ajoneuvoyhdistelmän suurin sallittu pituus',
  'C24 Ajoneuvon suurin sallittu massa',
  'C25 Ajoneuvoyhdistelmän suurin sallittu massa',
  'C26 Ajoneuvon suurin sallittu akselille kohdistuva massa',
  'C27 Ajoneuvon suurin sallittu telille kohdistuva massa',
  'C28 Ohituskielto',
  'C29 Ohituskielto päättyy',
  'C30 Ohituskielto kuorma-autolla',
  'C31 Ohituskielto kuorma-autolla päättyy',
  'C32 Nopeusrajoitus',
  'C33 Nopeusrajoitus päättyy',
  'C34 Nopeusrajoitusalue',
  'C35 Nopeusrajoitusalue päättyy',
  'C36 Ajokaistakohtainen kielto, rajoitus tai määräys',
  'C37 Pysäyttäminen kielletty',
  'C38 Pysäköinti kielletty',
  'C39 Pysäköintikieltoalue',
  'C40 Pysäköintikieltoalue päättyy',
  'C41 Taksiasema-alue',
  'C42 Taksin pysähtymispaikka',
  'C43 Kuormauspaikka',
  'C44.1 Vuoropysäköinti',
  'C44.2 Vuoropysäköinti',
  'C45 Pakollinen pysäyttäminen tullitarkastusta varten',
  'C46 Pakollinen pysäyttäminen tarkastusta varten',
  'C47 Moottorikäyttöisten ajoneuvojen vähimmäisetäisyys',
  'C48 Nastarenkailla varustetulla moottorikäyttöisellä ajoneuvolla ajo kielletty',
  'D1.1 Pakollinen ajosuunta',
  'D1.2 Pakollinen ajosuunta',
  'D1.3 Pakollinen ajosuunta',
  'D1.4 Pakollinen ajosuunta',
  'D1.5 Pakollinen ajosuunta',
  'D1.6 Pakollinen ajosuunta',
  'D1.7 Pakollinen ajosuunta',
  'D1.8 Pakollinen ajosuunta',
  'D1.9 Pakollinen ajosuunta',
  'D2 Pakollinen kiertosuunta',
  'D3.1 Liikenteenjakaja',
  'D3.2 Liikenteenjakaja',
  'D3.3 Liikenteenjakaja',
  'D4 Jalkakäytävä',
  'D5 Pyörätie',
  'D6 Yhdistetty pyörätie ja jalkakäytävä',
  'D7.1 Pyörätie ja jalkakäytävä rinnakkain',
  'D7.2 Pyörätie ja jalkakäytävä rinnakkain',
  'D8 Moottorikelkkailureitti',
  'D9 Ratsastustie',
  'D10 Vähimmäisnopeus',
  'D11 Vähimmäisnopeus päättyy',
  'E1 Suojatie',
  'E2 Pysäköintipaikka',
  'E3.1 Liityntäpysäköintipaikka',
  'E3.2 Liityntäpysäköintipaikka',
  'E3.3 Liityntäpysäköintipaikka',
  'E3.4 Liityntäpysäköintipaikka',
  'E3.5 Liityntäpysäköintipaikka',
  'E4.1 Ajoneuvojen sijoitus pysäköintipaikalla',
  'E4.2 Ajoneuvojen sijoitus pysäköintipaikalla',
  'E4.3 Ajoneuvojen sijoitus pysäköintipaikalla',
  'E5 Kohtaamispaikka',
  'E6 Linja-autopysäkki',
  'E7 Raitiovaunupysäkki',
  'E8 Taksiasema',
  'E9.1 Linja-autokaista',
  'E9.2 Linja-autokaista',
  'E10.1 Linja-autokaista päättyy',
  'E10.2 Linja-autokaista päättyy',
  'E11.1 Raitiovaunukaista',
  'E11.2 Raitiovaunukaista',
  'E12.1 Raitiovaunukaista päättyy',
  'E12.2 Raitiovaunukaista päättyy',
  'E13.1 Pyöräkaista',
  'E13.2 Pyöräkaista',
  'E14.1 Yksisuuntainen tie',
  'E14.2 Yksisuuntainen tie',
  'E15 Moottoritie',
  'E16 Moottoritie päättyy',
  'E17 Moottoriliikennetie',
  'E18 Moottoriliikennetie päättyy',
  'E19 Tunneli',
  'E20 Tunneli päättyy',
  'E21 Hätäpysäyttämispaikka',
  'E22 Taajama',
  'E23 Taajama päättyy',
  'E24 Pihakatu',
  'E25 Pihakatu päättyy',
  'E26 Kävelykatu',
  'E27 Kävelykatu päättyy',
  'E28 Pyöräkatu',
  'E29 Pyöräkatu päättyy',
  'E30 Ajokaistojen yhdistyminen',
  'F1.1 Suunnistustaulu',
  'F1.2 Suunnistustaulu',
  'F1.3 Suunnistustaulu',
  'F2.1 Suunnistustaulu',
  'F2.2 Suunnistustaulu',
  'F2.3 Suunnistustaulu',
  'F3 Ajokaistakohtainen suunnistustaulu',
  'F4.1 Kiertotien suunnistustaulu',
  'F4.2 Kiertotien suunnistustaulu',
  'F5 Kiertotieopastus',
  'F6 Ajoreittiopastus',
  'F7.1 Ajokaistaopastus',
  'F7.2 Ajokaistaopastus',
  'F7.3 Ajokaistaopastus',
  'F7.4 Ajokaistaopastus',
  'F7.5 Ajokaistaopastus',
  'F7.6 Ajokaistaopastus',
  'F8.1 Ajokaistan päättyminen',
  'F8.2 Ajokaistan päättyminen',
  'F9 Viitoituksen koontimerkki',
  'F10 Ajokaistan yläpuolinen viitta',
  'F11 Ajokaistan yläpuolinen viitta',
  'F12 Ajokaistan yläpuolinen erkanemisviitta',
  'F13 Tienviitta',
  'F14 Erkanemisviitta',
  'F15 Kiertotien viitta',
  'F16 Osoiteviitta',
  'F17 Osoiteviitan ennakkomerkki',
  'F18 Liityntäpysäköintiviitta',
  'F19 Jalankulun viitta',
  'F20.1 Pyöräilyn viitta',
  'F20.2 Pyöräilyn viitta',
  'F21.1 Pyöräilyn suunnistustaulu',
  'F21.2 Pyöräilyn suunnistustaulu',
  'F22 Pyöräilyn etäisyystaulu',
  'F23 Pyöräilyn paikannimi',
  'F24.1 Umpitie',
  'F24.2 Umpitie',
  'F25 Enimmäisnopeussuositus',
  'F26 Etäisyystaulu',
  'F27.1 Paikannimi',
  'F27.2 Paikannimi',
  'F28 Kansainvälisen pääliikenneväylän numero',
  'F29 Valtatien numero',
  'F30 Kantatien numero',
  'F30 Kantatien numero',
  'F31 Seututien numero',
  'F31 Seututien numero',
  'F32 Muun maantien numero',
  'F33 Kehätien numero',
  'F33 Kehätien numero',
  'F34 Eritasoliittymän numero',
  'F34 Eritasoliittymän numero',
  'F35 Opastus merkin tarkoittamalle tielle',
  'F35 Opastus merkin tarkoittamalle tielle',
  'F37 Moottoritien tunnus',
  'F38 Moottoriliikennetien tunnus',
  'F39 Lentoasema',
  'F40 Autolautta',
  'F41 Matkustajasatama',
  'F42 Tavarasatama',
  'F43 Tavaraterminaali',
  'F44 Teollisuusalue tai yritysalue',
  'F45 Vähittäiskaupan suuryksikkö',
  'F46.1 Pysäköinti',
  'F46.2 Pysäköinti',
  'F47 Rautatieasema',
  'F48 Linja-autoasema',
  'F49 Keskusta',
  'F50 Tietylle ajoneuvolle tarkoitettu reitti',
  'F51 Vaarallisten aineiden kuljetukselle tarkoitettu reitti',
  'F52 Jalankulkijalle tarkoitettu reitti',
  'F53 Esteetön reitti',
  'F54 Reitti, jolla on portaat',
  'F55 Reitti ilman portaita',
  'F56 Hätäuloskäynti',
  'F57 Poistumisreitti',
  'G1 Palvelukohteen opastustaulu',
  'G2 Palvelukohteen opastustaulu',
  'G3 Palvelukohteen erkanemisviitta',
  'G4 Palvelukohteen osoiteviitta',
  'G5 Palvelukohteen osoiteviitan ennakkomerkki',
  'G6 Radioaseman taajuus',
  'G7 Opastuspiste',
  'G8 Opastustoimisto',
  'G9 Ensiapu',
  'G10 Autokorjaamo',
  'G11.1 Polttoaineen jakelu',
  'G11.2 Polttoaineen jakelu',
  'G11.3 Polttoaineen jakelu',
  'G11.4 Polttoaineen jakelu',
  'G12 Hotelli tai motelli',
  'G13 Ruokailupaikka',
  'G14 Kahvila tai pikaruokapaikka',
  'G15 Käymälä',
  'G16 Retkeilymaja',
  'G17 Leirintäalue',
  'G18 Matkailuajoneuvoalue',
  'G19 Levähdysalue',
  'G20 Ulkoilualue',
  'G21 Hätäpuhelin',
  'G22 Sammutin',
  'G23 Museo tai historiallinen rakennus',
  'G24 Maailmanperintökohde',
  'G25 Luontokohde',
  'G26 Näköalapaikka',
  'G27 Eläintarha tai -puisto',
  'G28 Muu nähtävyys',
  'G29 Uintipaikka',
  'G30 Kalastuspaikka',
  'G31 Hiihtohissi',
  'G32 Maastohiihtokeskus',
  'G33 Golfkenttä',
  'G34 Huvi- ja teemapuisto',
  'G35 Mökkimajoitus',
  'G36 Aamiaismajoitus',
  'G37 Suoramyyntipaikka',
  'G38 Käsityöpaja',
  'G39 Kotieläinpiha',
  'G40 Ratsastuspaikka',
  'G41.1 Matkailutie',
  'G41.2 Matkailutie',
  'I1 Sulkupuomi',
  'I2.1 Sulkuaita',
  'I3.1 Sulkupylväs',
  'I3.2 Sulkupylväs',
  'I3.3 Sulkupylväs',
  'I4 Sulkukartio',
  'I5 Taustamerkki',
  'I6 Kaarteen suuntamerkki',
  'I7.1 Reunamerkki',
  'I7.2 Reunamerkki',
  'I8 Korkeusmerkki',
  'I9 Alikulun korkeusmitta',
  'I10.1 Liikennemerkkipylvään tehostamismerkki',
  'I10.2 Liikennemerkkipylvään tehostamismerkki',
  'I11 Erkanemismerkki',
  'I12.1 Reunapaalu',
  'I12.2 Reunapaalu',
  'I13 Siirtokehotus',
  'I14 Paikannusmerkki',
  'I15 Automaattinen liikennevalvonta',
  'I16 Tekninen valvonta',
  'I17.1 Poronhoitoalue',
  'I17.2 Poronhoitoalue',
  'I18 Yleinen nopeusrajoitus',
  'I19 Valtion raja'
];

export const allowedAdditionalPanel = [
  'H1 Kohde risteävässä suunnassa',
  'H2.1 Kohde nuolen suunnassa',
  'H2.2 Kohde nuolen suunnassa',
  'H2.3 Kohde nuolen suunnassa',
  'H3 Vaikutusalueen pituus',
  'H4 Etäisyys kohteeseen',
  'H5 Etäisyys pakolliseen pysäyttämiseen',
  'H6 Vapaa leveys',
  'H7 Vapaa korkeus',
  'H8 Sähköjohdon korkeus',
  'H9.1 Vaikutusalue molempiin suuntiin',
  'H9.2 Vaikutusalue molempiin suuntiin',
  'H10 Vaikutusalue nuolen suuntaan',
  'H11 Vaikutusalue päättyy',
  'H12.1 Henkilöauto',
  'H12.2 Linja-auto',
  'H12.3 Kuorma-auto',
  'H12.4 Pakettiauto',
  'H12.5 Matkailuperävaunu',
  'H12.6 Matkailuauto',
  'H12.7 Invalidin ajoneuvo',
  'H12.8 Moottoripyörä',
  'H12.9 Mopo',
  'H12.10 Polkupyörä',
  'H12.11 Moottorikelkka',
  'H12.12 Traktori',
  'H12.13 Vähäpäästöinen ajoneuvo',
  'H13.1 Pysäköintitapa',
  'H13.2 Pysäköintitapa',
  'H14 Kielto ryhmän A vaarallisten aineiden kuljetukselle',
  'H15 Läpiajokielto ryhmän B vaarallisten aineiden kuljetukselle',
  'H16 Tunneliluokka',
  'H17.1 Voimassaoloaika arkisin',
  'H17.2 Voimassaoloaika lauantaisin',
  'H17.3 Voimassaoloaika sunnuntaisin ja pyhinä',
  'H18 Aikarajoitus',
  'H19.1 Pysäköintiajan alkamisen osoittamisvelvollisuus',
  'H19.2 Pysäköintiajan alkamisen osoittamisvelvollisuus',
  'H20 Maksullinen pysäköinti',
  'H21 Latauspaikka',
  'H22.1 Etuajo-oikeutetun liikenteen suunta',
  'H22.2 Etuajo-oikeutetun liikenteen suunta',
  'H23.1 Kaksisuuntainen pyörätie',
  'H23.2 Kaksisuuntainen pyörätie',
  'H24 Tekstillinen lisäkilpi',
  'H25 Huoltoajo sallittu',
  'H26 Hätäpuhelin ja sammutin'
];

export const allowedOnKapy = [
  'A11 Tietyö',
  'A21 Tienristeys',
  'A33 Muu vaara',
  'B5 Väistämisvelvollisuus risteyksessä',
  'B6 Pakollinen pysäyttäminen',
  'C2 Moottorikäyttöisellä ajoneuvolla ajo kielletty',
  'C21 Ajoneuvon suurin sallittu leveys',
  'C22 Ajoneuvon suurin sallittu korkeus',
  'C24 Ajoneuvon suurin sallittu massa',
  'D4 Jalkakäytävä',
  'D5 Pyörätie',
  'D6 Yhdistetty pyörätie ja jalkakäytävä',
  'D7.1 Pyörätie ja jalkakäytävä rinnakkain',
  'D7.2 Pyörätie ja jalkakäytävä rinnakkain',
  'E26 Kävelykatu',
  'E27 Kävelykatu päättyy',
  'F16 Osoiteviitta',
  'F19 Jalankulun viitta',
  'F20.1 Pyöräilyn viitta',
  'F20.2 Pyöräilyn viitta',
  'F21.1 Pyöräilyn suunnistustaulu',
  'F21.2 Pyöräilyn suunnistustaulu',
  'F22 Pyöräilyn etäisyystaulu',
  'F23 Pyöräilyn paikannimi',
  'F50.9 Polkupyörälle tarkoitettu reitti',
  'F52 Jalankulkijalle tarkoitettu reitti',
  'F53 Esteetön reitti',
  'F54.1 Reitti, jolla on portaat alas',
  'F54.2 Reitti, jolla on portaat ylös',
  'F55.1 Reitti ilman portaita alas',
  'F55.2 Reitti ilman portaitaylös',
  'F55.3 Pyörätuoliramppi alas',
  'F55.4 Pyörätuoliramppi ylös',
  'F56.1 Hätäuloskäynti vasemmalla',
  'F56.2 Hätäuloskäynti oikealla',
  'F57.1 Poistumisreitti (yksi)',
  'F57.2 Poistumisreitti (useita)',
  'H23.1 Kaksisuuntainen pyörätie',
  'H23.2 Kaksisuuntainen pyörätie',
  'H24 Tekstillinen lisäkilpi',
  'H25 Huoltoajo sallittu'
];

// TODO: Complete this list
export const trafficSignsWithTextValue = [
  'C32 Nopeusrajoitus',
  'C33 Nopeusrajoitus päättyy',
  'C34 Nopeusrajoitusalue',
  'C35 Nopeusrajoitusalue päättyy'
];

export const maxValues = {
  'A3.1': 45,
  'A3.2': 45,
  C21: 100000,
  C22: 100000,
  C23: 100000,
  C24: 100000,
  C25: 100000,
  C26: 100000,
  C27: 100000,
  C32: 120,
  C33: 120,
  C34: 120,
  C35: 120,
  C47: 100000,
  D10: 120,
  D11: 120,
  F25: 120,
  F29: 100000,
  F30: 100000,
  F31: 100000,
  F32: 100000,
  F33: 100000,
  F34: 100000,
  F35: 100000,
  F36: 100000,
  H5: 100000,
  H6: 45,
  H7: 45,
  H8: 45,
  'H12.13 ': 100000,
  I9: 45,
  'H2.2': 100000,
  'H2.3': 100000,
  H3: 100000,
  H4: 100000
};

export const allowedTrafficSignsObject = {
  "A1.1": { "text": "Mutka oikealle", "type": "TRAFFICSIGN" },
  "A1.2": { "text": "Mutka vasemmalle", "type": "TRAFFICSIGN" },
  "A2.1": {
    "text": "Mutkia, joista ensimmäinen oikealle",
    "type": "TRAFFICSIGN"
  },
  "A2.2": {
    "text": "Mutkia, joista ensimmäinen vasemmalle",
    "type": "TRAFFICSIGN"
  },
  "A3.1": { "text": "Jyrkkä ylämäki", "maxValue": 45, "type": "TRAFFICSIGN" },
  "A3.2": { "text": "Jyrkkä alamäki", "maxValue": 45, "type": "TRAFFICSIGN" },
  "A4": { "text": "Kapeneva tie", "type": "TRAFFICSIGN" },
  "A5": { "text": "Kaksisuuntainen liikenne", "type": "TRAFFICSIGN" },
  "A6": { "text": "Avattava silta", "type": "TRAFFICSIGN" },
  "A7": { "text": "Lautta, laituri tai ranta", "type": "TRAFFICSIGN" },
  "A8": { "text": "Liikenneruuhka", "type": "TRAFFICSIGN" },
  "A9": { "text": "Epätasainen tie", "type": "TRAFFICSIGN" },
  "A10": { "text": "Töyssyjä", "type": "TRAFFICSIGN" },
  "A11": { "text": "Tietyö", "type": "TRAFFICSIGN" },
  "A12": { "text": "Irtokiviä", "type": "TRAFFICSIGN" },
  "A13": { "text": "Liukas ajorata", "type": "TRAFFICSIGN" },
  "A14": { "text": "Vaarallinen tien reuna", "type": "TRAFFICSIGN" },
  "A15": { "text": "Suojatien ennakkovaroitus", "type": "TRAFFICSIGN" },
  "A16": { "text": "Jalankulkijoita", "type": "TRAFFICSIGN" },
  "A17": { "text": "Lapsia", "type": "TRAFFICSIGN" },
  "A18": { "text": "Pyöräilijöitä", "type": "TRAFFICSIGN" },
  "A19": { "text": "Hiihtolatu", "type": "TRAFFICSIGN" },
  "A20.1": { "text": "Hirvi", "type": "TRAFFICSIGN" },
  "A20.2": { "text": "Poro", "type": "TRAFFICSIGN" },
  "A20.3": { "text": "Kauriseläin", "type": "TRAFFICSIGN" },
  "A21": { "text": "Tienristeys", "type": "TRAFFICSIGN" },
  "A22.1": {
    "text": "Sivutien risteys molemmin puolin",
    "type": "TRAFFICSIGN"
  },
  "A22.2": {
    "text": "Sivutien risteys molemmin puolin porrastetusti",
    "type": "TRAFFICSIGN"
  },
  "A22.3": {
    "text": "Sivutien risteys oikealla/vasemmalla",
    "type": "TRAFFICSIGN"
  },
  "A22.4": {
    "text": "Sivutien risteys oikealla/vasemmalla viistoon",
    "type": "TRAFFICSIGN"
  },
  "A23": { "text": "Liikennevalot", "type": "TRAFFICSIGN" },
  "A24": { "text": "Liikenneympyrä", "type": "TRAFFICSIGN" },
  "A25": { "text": "Raitiovaunu", "type": "TRAFFICSIGN" },
  "A26": {
    "text": "Rautatien tasoristeys ilman puomeja",
    "type": "TRAFFICSIGN"
  },
  "A27": {
    "text": "Rautatien tasoristeys, jossa on puomit",
    "type": "TRAFFICSIGN"
  },
  "A28.1": {
    "text": "Rautatien tasoristeyksen lähestymismerkki",
    "type": "TRAFFICSIGN"
  },
  "A28.2": {
    "text": "Rautatien tasoristeyksen lähestymismerkki",
    "type": "TRAFFICSIGN"
  },
  "A28.3": {
    "text": "Rautatien tasoristeyksen lähestymismerkki",
    "type": "TRAFFICSIGN"
  },
  "A29.1": {
    "text": "Yksiraiteisen rautatien tasoristeys",
    "type": "TRAFFICSIGN"
  },
  "A29.2": {
    "text": "Kaksi tai useampiraiteisen rautatien tasoristeys",
    "type": "TRAFFICSIGN"
  },
  "A30": { "text": "Putoavia kiviä", "type": "TRAFFICSIGN" },
  "A31": { "text": "Matalalla lentäviä lentokoneita", "type": "TRAFFICSIGN" },
  "A32": { "text": "Sivutuuli", "type": "TRAFFICSIGN" },
  "A33": { "text": "Muu vaara", "type": "TRAFFICSIGN" },
  "B1": { "text": "Etuajo-oikeutettu tie", "type": "TRAFFICSIGN" },
  "B2": { "text": "Etuajo-oikeuden päättyminen", "type": "TRAFFICSIGN" },
  "B3": { "text": "Etuajo-oikeus kohdattaessa", "type": "TRAFFICSIGN" },
  "B4": { "text": "Väistämisvelvollisuus kohdattaessa", "type": "TRAFFICSIGN" },
  "B5": { "text": "Väistämisvelvollisuus risteyksessä", "type": "TRAFFICSIGN" },
  "B6": { "text": "Pakollinen pysäyttäminen", "type": "TRAFFICSIGN" },
  "B7": {
    "text": "Väistämisvelvollisuus pyöräilijän tienylityspaikassa",
    "type": "TRAFFICSIGN"
  },
  "C1": { "text": "Ajoneuvolla ajo kielletty", "type": "TRAFFICSIGN" },
  "C2": {
    "text": "Moottorikäyttöisellä ajoneuvolla ajo kielletty",
    "type": "TRAFFICSIGN"
  },
  "C3": {
    "text": "Kuorma- ja pakettiautolla ajo kielletty",
    "type": "TRAFFICSIGN"
  },
  "C4": {
    "text": "Ajoneuvoyhdistelmällä ajo kielletty",
    "type": "TRAFFICSIGN"
  },
  "C5": { "text": "Traktorilla ajo kielletty", "type": "TRAFFICSIGN" },
  "C6": { "text": "Moottoripyörällä ajo kielletty", "type": "TRAFFICSIGN" },
  "C7": { "text": "Moottorikelkalla ajo kielletty", "type": "TRAFFICSIGN" },
  "C8": {
    "text": "Vaarallisten aineiden kuljetus kielletty",
    "type": "TRAFFICSIGN"
  },
  "C9": { "text": "Linja-autolla ajo kielletty", "type": "TRAFFICSIGN" },
  "C10": { "text": "Mopolla ajo kielletty", "type": "TRAFFICSIGN" },
  "C11": { "text": "Polkupyörällä ajo kielletty", "type": "TRAFFICSIGN" },
  "C12": {
    "text": "Polkupyörällä ja mopolla ajo kielletty",
    "type": "TRAFFICSIGN"
  },
  "C13": { "text": "Jalankulku kielletty", "type": "TRAFFICSIGN" },
  "C14": {
    "text": "Jalankulku ja polkupyörällä ajo kielletty",
    "type": "TRAFFICSIGN"
  },
  "C15": {
    "text": "Jalankulku ja polkupyörällä ja mopolla ajo kielletty",
    "type": "TRAFFICSIGN"
  },
  "C16": { "text": "Ratsastus kielletty", "type": "TRAFFICSIGN" },
  "C17": { "text": "Kielletty ajosuunta", "type": "TRAFFICSIGN" },
  "C18": { "text": "Vasemmalle kääntyminen kielletty", "type": "TRAFFICSIGN" },
  "C19": { "text": "Oikealle kääntyminen kielletty", "type": "TRAFFICSIGN" },
  "C20": { "text": "U-käännös kielletty", "type": "TRAFFICSIGN" },
  "C21": {
    "text": "Ajoneuvon suurin sallittu leveys",
    "maxValue": 2000,
    "minValue": 200,
    "unit": "cm",
    "type": "TRAFFICSIGN"
  },
  "C22": {
    "text": "Ajoneuvon suurin sallittu korkeus",
    "maxValue": 5000,
    "minValue": 100,
    "unit": "cm",
    "type": "TRAFFICSIGN"
  },
  "C23": {
    "text": "Ajoneuvon tai ajoneuvoyhdistelmän suurin sallittu pituus",
    "maxValue": 10000,
    "minValue": 200,
    "unit": "cm",
    "type": "TRAFFICSIGN"
  },
  "C24": {
    "text": "Ajoneuvon suurin sallittu massa",
    "maxValue": 100000,
    "minValue": 100,
    "unit": "kg",
    "type": "TRAFFICSIGN"
  },
  "C25": {
    "text": "Ajoneuvoyhdistelmän suurin sallittu massa",
    "maxValue": 100000,
    "minValue": 100,
    "unit": "kg",
    "type": "TRAFFICSIGN"
  },
  "C26": {
    "text": "Ajoneuvon suurin sallittu akselille kohdistuva massa",
    "maxValue": 100000,
    "minValue": 100,
    "unit": "kg",
    "type": "TRAFFICSIGN"
  },
  "C27": {
    "text": "Ajoneuvon suurin sallittu telille kohdistuva massa",
    "maxValue": 100000,
    "minValue": 100,
    "unit": "kg",
    "type": "TRAFFICSIGN"
  },
  "C28": { "text": "Ohituskielto", "type": "TRAFFICSIGN" },
  "C29": { "text": "Ohituskielto päättyy", "type": "TRAFFICSIGN" },
  "C30": { "text": "Ohituskielto kuorma-autolla", "type": "TRAFFICSIGN" },
  "C31": {
    "text": "Ohituskielto kuorma-autolla päättyy",
    "type": "TRAFFICSIGN"
  },
  "C32": {
    "text": "Nopeusrajoitus",
    "maxValue": 120,
    "minValue": 10,
    "unit": "km/h",
    "type": "TRAFFICSIGN"
  },
  "C33": {
    "text": "Nopeusrajoitus päättyy",
    "maxValue": 120,
    "minValue": 10,
    "unit": "km/h",
    "type": "TRAFFICSIGN"
  },
  "C34": {
    "text": "Nopeusrajoitusalue",
    "maxValue": 120,
    "minValue": 10,
    "unit": "km/h",
    "type": "TRAFFICSIGN"
  },
  "C35": {
    "text": "Nopeusrajoitusalue päättyy",
    "maxValue": 120,
    "minValue": 10,
    "unit": "km/h",
    "type": "TRAFFICSIGN"
  },
  "C36": {
    "text": "Ajokaistakohtainen kielto, rajoitus tai määräys",
    "type": "TRAFFICSIGN"
  },
  "C37": { "text": "Pysäyttäminen kielletty", "type": "TRAFFICSIGN" },
  "C38": { "text": "Pysäköinti kielletty", "type": "TRAFFICSIGN" },
  "C39": { "text": "Pysäköintikieltoalue", "type": "TRAFFICSIGN" },
  "C40": { "text": "Pysäköintikieltoalue päättyy", "type": "TRAFFICSIGN" },
  "C41": { "text": "Taksiasema-alue", "type": "TRAFFICSIGN" },
  "C42": { "text": "Taksin pysähtymispaikka", "type": "TRAFFICSIGN" },
  "C43": { "text": "Kuormauspaikka", "type": "TRAFFICSIGN" },
  "C44.1": {
    "text": "Vuoropysäköinti (kielletty parittomina päivinä)",
    "type": "TRAFFICSIGN"
  },
  "C44.2": {
    "text": "Vuoropysäköinti (kielletty parillisina päivinä)",
    "type": "TRAFFICSIGN"
  },
  "C45": {
    "text": "Pakollinen pysäyttäminen tullitarkastusta varten",
    "type": "TRAFFICSIGN"
  },
  "C46": {
    "text": "Pakollinen pysäyttäminen tarkastusta varten",
    "type": "TRAFFICSIGN"
  },
  "C47": {
    "text": "Moottorikäyttöisten ajoneuvojen vähimmäisetäisyys",
    "maxValue": 1000,
    "unit": "m",
    "type": "TRAFFICSIGN"
  },
  "C48": {
    "text": "Nastarenkailla varustetulla moottorikäyttöisellä ajoneuvolla ajo kielletty",
    "type": "TRAFFICSIGN"
  },
  "D1.1": { "text": "Pakollinen ajosuunta oikealle", "type": "TRAFFICSIGN" },
  "D1.2": { "text": "Pakollinen ajosuunta vasemmalle", "type": "TRAFFICSIGN" },
  "D1.3": { "text": "Pakollinen ajosuunta suoraan", "type": "TRAFFICSIGN" },
  "D1.4": {
    "text": "Pakollinen ajosuunta kääntyminen oikealle",
    "type": "TRAFFICSIGN"
  },
  "D1.5": {
    "text": "Pakollinen ajosuunta kääntyminen vasemmalle",
    "type": "TRAFFICSIGN"
  },
  "D1.6": {
    "text": "Pakollinen ajosuunta suoraan tai kääntyminen oikealle",
    "type": "TRAFFICSIGN"
  },
  "D1.7": {
    "text": "Pakollinen ajosuunta suoraan tai kääntyminen vasemmalle",
    "type": "TRAFFICSIGN"
  },
  "D1.8": {
    "text": "Pakollinen ajosuunta kääntyminen oikealle tai vasemmalle",
    "type": "TRAFFICSIGN"
  },
  "D1.9": {
    "text": "Pakollinen ajosuunta suoraan tai kääntyminen oikealle tai vasemmalle",
    "type": "TRAFFICSIGN"
  },
  "D2": { "text": "Pakollinen ajosuunta", "type": "TRAFFICSIGN" },
  "D3.1": { "text": "Liikenteenjakaja oikea", "type": "TRAFFICSIGN" },
  "D3.2": { "text": "Liikenteenjakaja vasen", "type": "TRAFFICSIGN" },
  "D3.3": { "text": "Liikenteenjakaja molemmin puolin", "type": "TRAFFICSIGN" },
  "D4": { "text": "Jalkakäytävä", "type": "TRAFFICSIGN" },
  "D5": { "text": "Pyörätie", "type": "TRAFFICSIGN" },
  "D6": {
    "text": "Yhdistetty pyörätie ja jalkakäytävä",
    "type": "TRAFFICSIGN"
  },
  "D7.1": {
    "text": "Pyörätie ja jalkakäytävä rinnakkain, pyörätie vasemmalla",
    "type": "TRAFFICSIGN"
  },
  "D7.2": {
    "text": "Pyörätie ja jalkakäytävä rinnakkain, pyörätie oikealla",
    "type": "TRAFFICSIGN"
  },
  "D8": { "text": "Moottorikelkkailureitti", "type": "TRAFFICSIGN" },
  "D9": { "text": "Ratsastustie", "type": "TRAFFICSIGN" },
  "D10": {
    "text": "Vähimmäisnopeus",
    "maxValue": 120,
    "minValue": 10,
    "unit": "km/h",
    "type": "TRAFFICSIGN"
  },
  "D11": {
    "text": "Vähimmäisnopeus päättyy",
    "maxValue": 120,
    "minValue": 10,
    "unit": "km/h",
    "type": "TRAFFICSIGN"
  },
  "E1": { "text": "Suojatie", "type": "TRAFFICSIGN" },
  "E2": { "text": "Pysäköintipaikka", "type": "TRAFFICSIGN" },
  "E3.1": { "text": "Liityntäpysäköintipaikka juna", "type": "TRAFFICSIGN" },
  "E3.2": {
    "text": "Liityntäpysäköintipaikka linja-auto",
    "type": "TRAFFICSIGN"
  },
  "E3.3": {
    "text": "Liityntäpysäköintipaikka raitiovaunu",
    "type": "TRAFFICSIGN"
  },
  "E3.4": { "text": "Liityntäpysäköintipaikka metro", "type": "TRAFFICSIGN" },
  "E3.5": {
    "text": "Liityntäpysäköintipaikka useita joukkoliikennevälineitä",
    "type": "TRAFFICSIGN"
  },
  "E4.1": {
    "text": "Ajoneuvojen sijoitus pysäköintipaikalla suoraan",
    "type": "TRAFFICSIGN"
  },
  "E4.2": {
    "text": "Ajoneuvojen sijoitus pysäköintipaikalla vastakkain",
    "type": "TRAFFICSIGN"
  },
  "E4.3": {
    "text": "Ajoneuvojen sijoitus pysäköintipaikalla vinoon",
    "type": "TRAFFICSIGN"
  },
  "E5": { "text": "Kohtaamispaikka", "type": "TRAFFICSIGN" },
  "E6": { "text": "Linja-autopysäkki", "type": "TRAFFICSIGN" },
  "E7": { "text": "Raitiovaunupysäkki", "type": "TRAFFICSIGN" },
  "E8": { "text": "Taksiasema", "type": "TRAFFICSIGN" },
  "E9.1": { "text": "Linja-autokaista", "type": "TRAFFICSIGN" },
  "E9.2": { "text": "Linja-auto ja taksikaista", "type": "TRAFFICSIGN" },
  "E10.1": { "text": "Linja-autokaista päättyy", "type": "TRAFFICSIGN" },
  "E10.2": {
    "text": "Linja-auto ja taksikaista päättyy",
    "type": "TRAFFICSIGN"
  },
  "E11.1": { "text": "Raitiovaunukaista", "type": "TRAFFICSIGN" },
  "E11.2": { "text": "Raitiovaunu- ja taksikaista", "type": "TRAFFICSIGN" },
  "E12.1": { "text": "Raitiovaunukaista päättyy", "type": "TRAFFICSIGN" },
  "E12.2": {
    "text": "Raitiovaunu- ja taksikaista päättyy",
    "type": "TRAFFICSIGN"
  },
  "E13.1": { "text": "Pyöräkaista oikealla", "type": "TRAFFICSIGN" },
  "E13.2": { "text": "Pyöräkaista keskellä", "type": "TRAFFICSIGN" },
  "E14.1": { "text": "Yksisuuntainen tie suoraan", "type": "TRAFFICSIGN" },
  "E14.2": {
    "text": "Yksisuuntainen tie oikealle/vasemmalle",
    "type": "TRAFFICSIGN"
  },
  "E15": { "text": "Moottoritie", "type": "TRAFFICSIGN" },
  "E16": { "text": "Moottoritie päättyy", "type": "TRAFFICSIGN" },
  "E17": { "text": "Moottoriliikennetie", "type": "TRAFFICSIGN" },
  "E18": { "text": "Moottoriliikennetie päättyy", "type": "TRAFFICSIGN" },
  "E19": { "text": "Tunneli", "type": "TRAFFICSIGN" },
  "E20": { "text": "Tunneli päättyy", "type": "TRAFFICSIGN" },
  "E21": { "text": "Hätäpysäyttämispaikka", "type": "TRAFFICSIGN" },
  "E22": { "text": "Taajama", "type": "TRAFFICSIGN" },
  "E23": { "text": "Taajama päättyy", "type": "TRAFFICSIGN" },
  "E24": { "text": "Pihakatu", "type": "TRAFFICSIGN" },
  "E25": { "text": "Pihakatu päättyy", "type": "TRAFFICSIGN" },
  "E26": { "text": "Kävelykatu", "type": "TRAFFICSIGN" },
  "E27": { "text": "Kävelykatu päättyy", "type": "TRAFFICSIGN" },
  "E28": { "text": "Pyöräkatu", "type": "TRAFFICSIGN" },
  "E29": { "text": "Pyöräkatu päättyy", "type": "TRAFFICSIGN" },
  "E30": { "text": "Ajokaistojen yhdistyminen", "type": "TRAFFICSIGN" },
  "F1.1": { "text": "Suunnistustaulu", "type": "TRAFFICSIGN" },
  "F1.2": { "text": "Suunnistustaulu", "type": "TRAFFICSIGN" },
  "F1.3": { "text": "Suunnistustaulu", "type": "TRAFFICSIGN" },
  "F2.1": { "text": "Suunnistustaulu", "type": "TRAFFICSIGN" },
  "F2.2": { "text": "Suunnistustaulu", "type": "TRAFFICSIGN" },
  "F2.3": { "text": "Suunnistustaulu", "type": "TRAFFICSIGN" },
  "F3": { "text": "Ajokaistakohtainen suunnistustaulu", "type": "TRAFFICSIGN" },
  "F4.1": {
    "text": "Kiertotien suunnistustaulu (sininen pohja)",
    "type": "TRAFFICSIGN"
  },
  "F4.2": {
    "text": "Kiertotien suunnistustaulu (keltainen pohja)",
    "type": "TRAFFICSIGN"
  },
  "F5": { "text": "Kiertotieopastus", "type": "TRAFFICSIGN" },
  "F6": { "text": "Ajoreittiopastus", "type": "TRAFFICSIGN" },
  "F7.1": { "text": "Ajokaistaopastus", "type": "TRAFFICSIGN" },
  "F7.2": { "text": "Ajokaistaopastus", "type": "TRAFFICSIGN" },
  "F7.3": { "text": "Ajokaistaopastus", "type": "TRAFFICSIGN" },
  "F7.4": { "text": "Ajokaistaopastus", "type": "TRAFFICSIGN" },
  "F7.5": { "text": "Ajokaistaopastus", "type": "TRAFFICSIGN" },
  "F7.6": { "text": "Ajokaistaopastus", "type": "TRAFFICSIGN" },
  "F8.1": { "text": "Ajokaistan päättyminen", "type": "TRAFFICSIGN" },
  "F8.2": { "text": "Ajokaistan päättyminen", "type": "TRAFFICSIGN" },
  "F9": { "text": "Viitoituksen koontimerkki", "type": "TRAFFICSIGN" },
  "F10": { "text": "Ajokaistan yläpuolinen viitta", "type": "TRAFFICSIGN" },
  "F11": { "text": "Ajokaistan yläpuolinen viitta", "type": "TRAFFICSIGN" },
  "F12": {
    "text": "Ajokaistan yläpuolinen erkanemisviitta",
    "type": "TRAFFICSIGN"
  },
  "F13": { "text": "Tienviitta", "type": "TRAFFICSIGN" },
  "F14": { "text": "Erkanemisviitta", "type": "TRAFFICSIGN" },
  "F15": { "text": "Kiertotien viitta", "type": "TRAFFICSIGN" },
  "F16": { "text": "Osoiteviitta", "type": "TRAFFICSIGN" },
  "F17": { "text": "Osoiteviitan ennakkomerkki", "type": "TRAFFICSIGN" },
  "F18.1": { "text": "Liityntäpysäköintiviitta juna", "type": "TRAFFICSIGN" },
  "F18.2": { "text": "Liityntäpysäköintiviitta bussi", "type": "TRAFFICSIGN" },
  "F18.3": {
    "text": "Liityntäpysäköintiviitta raitiovaunu",
    "type": "TRAFFICSIGN"
  },
  "F18.4": { "text": "Liityntäpysäköintiviitta metro", "type": "TRAFFICSIGN" },
  "F18.5": {
    "text": "Liityntäpysäköintiviitta useita joukkoliikennevälineitä",
    "type": "TRAFFICSIGN"
  },
  "F19": { "text": "Jalankulun viitta", "type": "TRAFFICSIGN" },
  "F20.1": {
    "text": "Pyöräilyn viitta ilman etäisyyksiä",
    "type": "TRAFFICSIGN"
  },
  "F20.2": {
    "text": "Pyöräilyn viitta etäisyyslukemilla",
    "type": "TRAFFICSIGN"
  },
  "F21.1": {
    "text": "Pyöräilyn suunnistustaulu etäisyyslukemilla",
    "type": "TRAFFICSIGN"
  },
  "F21.2": {
    "text": "Pyöräilyn suunnistustaulu ilman etäisyyksiä",
    "type": "TRAFFICSIGN"
  },
  "F22": { "text": "Pyöräilyn etäisyystaulu", "type": "TRAFFICSIGN" },
  "F23": { "text": "Pyöräilyn paikannimi", "type": "TRAFFICSIGN" },
  "F24.1": { "text": "Umpitie edessä", "type": "TRAFFICSIGN" },
  "F24.2": { "text": "Umpitie oikealla/vasemmalla", "type": "TRAFFICSIGN" },
  "F24.3": { "text": "Umpitie", "type": "TRAFFICSIGN" },
  "F25": {
    "text": "Enimmäisnopeussuositus",
    "maxValue": 120,
    "minValue": 10,
    "unit": "km/h",
    "type": "TRAFFICSIGN"
  },
  "F26": { "text": "Etäisyystaulu", "type": "TRAFFICSIGN" },
  "F27.1": { "text": "Paikannimi", "type": "TRAFFICSIGN" },
  "F27.2": { "text": "Vesistön nimi", "type": "TRAFFICSIGN" },
  "F28": {
    "text": "Kansainvälisen pääliikenneväylän numero",
    "type": "TRAFFICSIGN"
  },
  "F29": {
    "text": "Valtatien numero",
    "maxValue": 100000,
    "type": "TRAFFICSIGN"
  },
  "F30": {
    "text": "Kantatien numero",
    "maxValue": 100000,
    "type": "TRAFFICSIGN"
  },
  "F31": {
    "text": "Seututien numero",
    "maxValue": 100000,
    "type": "TRAFFICSIGN"
  },
  "F32": {
    "text": "Muun maantien numero",
    "maxValue": 100000,
    "type": "TRAFFICSIGN"
  },
  "F33": {
    "text": "Kehätien numero",
    "maxValues": 100000,
    "type": "TRAFFICSIGN"
  },
  "F34": {
    "text": "Eritasoliittymän numero",
    "maxValue": 100000,
    "type": "TRAFFICSIGN"
  },
  "F35": {
    "text": "Opastus merkin tarkoittamalle tielle",
    "maxValue": 100000,
    "type": "TRAFFICSIGN"
  },
  "F36": { "text": "Varareitti", "maxValue": 100000, "type": "TRAFFICSIGN" },
  "F37": { "text": "Moottoritien tunnus", "type": "TRAFFICSIGN" },
  "F38": { "text": "Moottoriliikennetien tunnus", "type": "TRAFFICSIGN" },
  "F39": { "text": "Lentoasema", "type": "TRAFFICSIGN" },
  "F40": { "text": "Autolautta", "type": "TRAFFICSIGN" },
  "F41": { "text": "Matkustajasatama", "type": "TRAFFICSIGN" },
  "F42": { "text": "Tavarasatama", "type": "TRAFFICSIGN" },
  "F43": { "text": "Tavaraterminaali", "type": "TRAFFICSIGN" },
  "F44": { "text": "Teollisuusalue tai yritysalue", "type": "TRAFFICSIGN" },
  "F45": { "text": "Vähittäiskaupan suuryksikkö", "type": "TRAFFICSIGN" },
  "F46.1": { "text": "Pysäköinti", "type": "TRAFFICSIGN" },
  "F46.2": { "text": "Katettu pysäköinti", "type": "TRAFFICSIGN" },
  "F47": { "text": "Rautatieasema", "type": "TRAFFICSIGN" },
  "F48": { "text": "Linja-autoasema", "type": "TRAFFICSIGN" },
  "F49": { "text": "Keskusta", "type": "TRAFFICSIGN" },
  "F50": {
    "text": "Tietylle ajoneuvolle tarkoitettu reitti",
    "type": "TRAFFICSIGN"
  },
  "F50.1": {
    "text": "Kuorma-autolle tarkoitettu reitti",
    "type": "TRAFFICSIGN"
  },
  "F50.2": {
    "text": "Henkilöautolle tarkoitettu reitti",
    "type": "TRAFFICSIGN"
  },
  "F50.3": {
    "text": "Linja-autolle tarkoitettu reitti",
    "type": "TRAFFICSIGN"
  },
  "F50.4": {
    "text": "Pakettiautolle tarkoitettu reitti",
    "type": "TRAFFICSIGN"
  },
  "F50.5": {
    "text": "Moottoripyörälle tarkoitettu reitti",
    "type": "TRAFFICSIGN"
  },
  "F50.6": { "text": "Mopolle tarkoitettu reitti", "type": "TRAFFICSIGN" },
  "F50.7": { "text": "Traktorille tarkoitettu reitti", "type": "TRAFFICSIGN" },
  "F50.8": {
    "text": "Matkailuajoneuvolle tarkoitettu reitti",
    "type": "TRAFFICSIGN"
  },
  "F50.9": {
    "text": "Polkupyörälle tarkoitettu reitti",
    "type": "TRAFFICSIGN"
  },
  "F51": {
    "text": "Vaarallisten aineiden kuljetukselle tarkoitettu reitti",
    "type": "TRAFFICSIGN"
  },
  "F52": {
    "text": "Jalankulkijalle tarkoitettu reitti",
    "type": "TRAFFICSIGN"
  },
  "F53": { "text": "Esteetön reitti", "type": "TRAFFICSIGN" },
  "F54.1": { "text": "Reitti, jolla on portaat alas", "type": "TRAFFICSIGN" },
  "F54.2": { "text": "Reitti, jolla on portaat ylös", "type": "TRAFFICSIGN" },
  "F55.1": { "text": "Reitti ilman portaita alas", "type": "TRAFFICSIGN" },
  "F55.2": { "text": "Reitti ilman portaita ylös", "type": "TRAFFICSIGN" },
  "F55.3": { "text": "Pyörätuoliramppi alas", "type": "TRAFFICSIGN" },
  "F55.4": { "text": "Pyörätuoliramppii ylös", "type": "TRAFFICSIGN" },
  "F56.1": { "text": "Hätäuloskäynti vasemmalla", "type": "TRAFFICSIGN" },
  "F56.2": { "text": "Hätäuloskäynti oikealla", "type": "TRAFFICSIGN" },
  "F57.1": { "text": "Poistumisreitti (yksi)", "type": "TRAFFICSIGN" },
  "F57.2": { "text": "Poistumisreitti (useita)", "type": "TRAFFICSIGN" },
  "G1": { "text": "Palvelukohteen opastustaulu", "type": "TRAFFICSIGN" },
  "G2": {
    "text": "Palvelukohteen opastustaulu nuolella",
    "type": "TRAFFICSIGN"
  },
  "G3": { "text": "Palvelukohteen erkanemisviitta", "type": "TRAFFICSIGN" },
  "G4": { "text": "Palvelukohteen osoiteviitta", "type": "TRAFFICSIGN" },
  "G5": {
    "text": "Palvelukohteen osoiteviitan ennakkomerkki",
    "type": "TRAFFICSIGN"
  },
  "G6": { "text": "Radioaseman taajuus", "type": "TRAFFICSIGN" },
  "G7": { "text": "Opastuspiste", "type": "TRAFFICSIGN" },
  "G8": { "text": "Opastustoimisto", "type": "TRAFFICSIGN" },
  "G9": { "text": "Ensiapu", "type": "TRAFFICSIGN" },
  "G10": { "text": "Autokorjaamo", "type": "TRAFFICSIGN" },
  "G11.1": {
    "text": "Polttoaineen jakelu bensiini tai etanoli",
    "type": "TRAFFICSIGN"
  },
  "G11.2": {
    "text": "Polttoaineen jakelu paineistettu maakaasu",
    "type": "TRAFFICSIGN"
  },
  "G11.3": { "text": "Polttoaineen jakelu sähkö", "type": "TRAFFICSIGN" },
  "G11.4": { "text": "Polttoaineen jakelu vety", "type": "TRAFFICSIGN" },
  "G12": { "text": "Hotelli tai motelli", "type": "TRAFFICSIGN" },
  "G13": { "text": "Ruokailupaikka", "type": "TRAFFICSIGN" },
  "G14": { "text": "Kahvila tai pikaruokapaikka", "type": "TRAFFICSIGN" },
  "G15": { "text": "Käymälä", "type": "TRAFFICSIGN" },
  "G16": { "text": "Retkeilymaja", "type": "TRAFFICSIGN" },
  "G17": { "text": "Leirintäalue", "type": "TRAFFICSIGN" },
  "G18": { "text": "Matkailuajoneuvoalue", "type": "TRAFFICSIGN" },
  "G19": { "text": "Levähdysalue", "type": "TRAFFICSIGN" },
  "G20": { "text": "Ulkoilualue", "type": "TRAFFICSIGN" },
  "G21": { "text": "Hätäpuhelin", "type": "TRAFFICSIGN" },
  "G22": { "text": "Sammutin", "type": "TRAFFICSIGN" },
  "G23": { "text": "Museo tai historiallinen rakennus", "type": "TRAFFICSIGN" },
  "G24": { "text": "Maailmanperintökohde", "type": "TRAFFICSIGN" },
  "G25": { "text": "Luontokohde", "type": "TRAFFICSIGN" },
  "G26": { "text": "Näköalapaikka", "type": "TRAFFICSIGN" },
  "G27": { "text": "Eläintarha tai -puisto", "type": "TRAFFICSIGN" },
  "G28": { "text": "Muu nähtävyys", "type": "TRAFFICSIGN" },
  "G29": { "text": "Uintipaikka", "type": "TRAFFICSIGN" },
  "G30": { "text": "Kalastuspaikka", "type": "TRAFFICSIGN" },
  "G31": { "text": "Hiihtohissi", "type": "TRAFFICSIGN" },
  "G32": { "text": "Maastohiihtokeskus", "type": "TRAFFICSIGN" },
  "G33": { "text": "Golfkenttä", "type": "TRAFFICSIGN" },
  "G34": { "text": "Huvi- ja teemapuisto", "type": "TRAFFICSIGN" },
  "G35": { "text": "Mökkimajoitus", "type": "TRAFFICSIGN" },
  "G36": { "text": "Aamiaismajoitus", "type": "TRAFFICSIGN" },
  "G37": { "text": "Suoramyyntipaikka", "type": "TRAFFICSIGN" },
  "G38": { "text": "Käsityöpaja", "type": "TRAFFICSIGN" },
  "G39": { "text": "Kotieläinpiha", "type": "TRAFFICSIGN" },
  "G40": { "text": "Ratsastuspaikka", "type": "TRAFFICSIGN" },
  "G41.1": { "text": "Matkailutie (pelkkä teksti)", "type": "TRAFFICSIGN" },
  "G41.2": { "text": "Matkailutie (kuva ja teksti)", "type": "TRAFFICSIGN" },
  "I5": { "text": "Taustamerkki", "type": "TRAFFICSIGN" },
  "I6": { "text": "Kaarteen suuntamerkki", "type": "TRAFFICSIGN" },
  "I7.1": { "text": "Reunamerkki vasemmalla", "type": "TRAFFICSIGN" },
  "I7.2": { "text": "Reunamerkki oikealla", "type": "TRAFFICSIGN" },
  "I8": { "text": "Korkeusmerkki", "type": "TRAFFICSIGN" },
  "I9": {
    "text": "Alikulun korkeusmitta",
    "maxValue": 45,
    "unit": "m",
    "type": "TRAFFICSIGN"
  },
  "I10.1": {
    "text": "Liikennemerkkipylvään tehostamismerkki (sinivalkoinen)",
    "type": "TRAFFICSIGN"
  },
  "I10.2": {
    "text": "Liikennemerkkipylvään tehostamismerkki (keltamusta)",
    "type": "TRAFFICSIGN"
  },
  "I11": { "text": "Erkanemismerkki", "type": "TRAFFICSIGN" },
  "I13": { "text": "Siirtokehotus", "type": "TRAFFICSIGN" },
  "I14": { "text": "Paikannusmerkki", "type": "TRAFFICSIGN" },
  "I15": { "text": "Automaattinen liikennevalvonta", "type": "TRAFFICSIGN" },
  "I16": { "text": "Tekninen valvonta", "type": "TRAFFICSIGN" },
  "I17.1": { "text": "Poronhoitoalue tekstillinen", "type": "TRAFFICSIGN" },
  "I17.2": { "text": "Poronhoitoalue ilman tekstiä", "type": "TRAFFICSIGN" },
  "I18": { "text": "Yleinen nopeusrajoitus rajalla", "type": "TRAFFICSIGN" },
  "I19": { "text": "Valtion raja", "type": "TRAFFICSIGN" },
  "H1": { "text": "Kohde risteävässä suunnassa", "type": "ADDITIONALPANEL" },
  "H2.1": { "text": "Kohde nuolen suunnassa", "type": "ADDITIONALPANEL" },
  "H2.2": {
    "text": "Kohde nuolen suunnassa ja etäisyys",
    "maxValue": 100,
    "unit": "km",
    "type": "ADDITIONALPANEL"
  },
  "H2.3": {
    "text": "Kohde edessä ja etäisyys",
    "maxValue": 100,
    "unit": "km",
    "type": "ADDITIONALPANEL"
  },
  "H3": {
    "text": "Vaikutusalueen pituus",
    "maxValue": 100,
    "unit": "km",
    "type": "ADDITIONALPANEL"
  },
  "H4": {
    "text": "Etäisyys kohteeseen",
    "maxValue": 10000,
    "unit": "m",
    "type": "ADDITIONALPANEL"
  },
  "H5": {
    "text": "Etäisyys pakolliseen pysäyttämiseen",
    "maxValue": 10000,
    "unit": "m",
    "type": "ADDITIONALPANEL"
  },
  "H6": {
    "text": "Vapaa leveys",
    "maxValue": 20,
    "unit": "m",
    "type": "ADDITIONALPANEL"
  },
  "H7": {
    "text": "Vapaa korkeus",
    "maxValue": 50,
    "unit": "m",
    "type": "ADDITIONALPANEL"
  },
  "H8": {
    "text": "Sähköjohdon korkeus",
    "maxValue": 100,
    "unit": "m",
    "type": "ADDITIONALPANEL"
  },
  "H9.1": {
    "text": "Vaikutusalue molempiin suuntiin oikealle ja vasemmalle",
    "type": "ADDITIONALPANEL"
  },
  "H9.2": {
    "text": "Vaikutusalue molempiin suuntiin eteen- ja taaksepäin",
    "type": "ADDITIONALPANEL"
  },
  "H10": { "text": "Vaikutusalue nuolen suuntaan", "type": "ADDITIONALPANEL" },
  "H11": { "text": "Vaikutusalue päättyy", "type": "ADDITIONALPANEL" },
  "H12.1": { "text": "Henkilöauto", "type": "ADDITIONALPANEL" },
  "H12.2": { "text": "Linja-auto", "type": "ADDITIONALPANEL" },
  "H12.3": { "text": "Kuorma-auto", "type": "ADDITIONALPANEL" },
  "H12.4": { "text": "Pakettiauto", "type": "ADDITIONALPANEL" },
  "H12.5": { "text": "Matkailuperävaunu", "type": "ADDITIONALPANEL" },
  "H12.6": { "text": "Matkailuauto", "type": "ADDITIONALPANEL" },
  "H12.7": { "text": "Invalidin ajoneuvo", "type": "ADDITIONALPANEL" },
  "H12.8": { "text": "Moottoripyörä", "type": "ADDITIONALPANEL" },
  "H12.9": { "text": "Mopo", "type": "ADDITIONALPANEL" },
  "H12.10": { "text": "Polkupyörä", "type": "ADDITIONALPANEL" },
  "H12.11": { "text": "Moottorikelkka", "type": "ADDITIONALPANEL" },
  "H12.12": { "text": "Traktori", "type": "ADDITIONALPANEL" },
  "H12.13": {
    "text": "Vähäpäästöinen ajoneuvo",
    "maxValue": 10000,
    "unit": "g/km",
    "type": "ADDITIONALPANEL"
  },
  "H13.1": {
    "text": "Pysäköintitapa reunakiven päälle",
    "type": "ADDITIONALPANEL"
  },
  "H13.2": {
    "text": "Pysäköintitapa reunakiven laitaan",
    "type": "ADDITIONALPANEL"
  },
  "H14": {
    "text": "Kielto ryhmän A vaarallisten aineiden kuljetukselle",
    "type": "ADDITIONALPANEL"
  },
  "H15": {
    "text": "Kielto ryhmän B vaarallisten aineiden kuljetukselle",
    "type": "ADDITIONALPANEL"
  },
  "H16": { "text": "Tunneliluokka", "type": "ADDITIONALPANEL" },
  "H17.1": {
    "text": "Voimassaoloaika arkisin ma-pe",
    "type": "ADDITIONALPANEL"
  },
  "H17.2": {
    "text": "Voimassaoloaika arkilauantaisin",
    "type": "ADDITIONALPANEL"
  },
  "H17.3": {
    "text": "Voimassaoloaika sunnuntaisin ja pyhinä",
    "type": "ADDITIONALPANEL"
  },
  "H18": {
    "text": "Aikarajoitus",
    "maxValue": 2000,
    "unit": "min",
    "type": "ADDITIONALPANEL"
  },
  "H19.1": {
    "text": "Pysäköintiajan alkamisen osoittamisvelvollisuus (keltainen pohja)",
    "maxValue": 2000,
    "unit": "min",
    "type": "ADDITIONALPANEL"
  },
  "H19.2": {
    "text": "Pysäköintiajan alkamisen osoittamisvelvollisuus (sininen pohja)",
    "maxValue": 2000,
    "unit": "min",
    "type": "ADDITIONALPANEL"
  },
  "H20": { "text": "Maksullinen pysäköinti", "type": "ADDITIONALPANEL" },
  "H21": { "text": "Latauspaikka", "type": "ADDITIONALPANEL" },
  "H22.1": {
    "text": "Etuajo-oikeutetun liikenteen suunta",
    "type": "ADDITIONALPANEL"
  },
  "H22.2": {
    "text": "Etuajo-oikeutetun liikenteen suunta kääntyville",
    "type": "ADDITIONALPANEL"
  },
  "H23.1": {
    "text": "Kaksisuuntainen pyörätie (keltainen pohja)",
    "type": "ADDITIONALPANEL"
  },
  "H23.2": {
    "text": "Kaksisuuntainen pyörätie (sininen pohja)",
    "type": "ADDITIONALPANEL"
  },
  "H24": { "text": "Tekstillinen lisäkilpi", "type": "ADDITIONALPANEL" },
  "H25": { "text": "Huoltoajo sallittu", "type": "ADDITIONALPANEL" },
  "H26": { "text": "Hätäpuhelin ja sammutin", "type": "ADDITIONALPANEL" }
}
;

export const allowedAdditionalPanelObject = {
  H1: {text: 'Kohde risteävässä suunnassa'},
  'H2.1': {text: 'Kohde nuolen suunnassa'},
  'H2.2': {text: 'Kohde nuolen suunnassa ja etäisyys', maxValue: 100, unit: 'km'},
  'H2.3': {text: 'Kohde edessä ja etäisyys', maxValue: 100, unit: 'km'},
  H3: {text: 'Vaikutusalueen pituus', maxValue: 100, unit: 'km'},
  H4: {text: 'Etäisyys kohteeseen', maxValue: 10000, unit: 'm'},
  H5: {text: 'Etäisyys pakolliseen pysäyttämiseen', maxValue: 10000, unit: 'm'},
  H6: {text: 'Vapaa leveys', maxValue: 20, unit: 'm'},
  H7: {text: 'Vapaa korkeus', maxValue: 50, unit: 'm'},
  H8: {text: 'Sähköjohdon korkeus', maxValue: 100, unit: 'm'},
  'H9.1': {text: 'Vaikutusalue molempiin suuntiin oikealle ja vasemmalle'},
  'H9.2': {text: 'Vaikutusalue molempiin suuntiin eteen- ja taaksepäin'},
  H10: {text: 'Vaikutusalue nuolen suuntaan'},
  H11: {text: 'Vaikutusalue päättyy'},
  'H12.1': {text: 'Henkilöauto'},
  'H12.2': {text: 'Linja-auto'},
  'H12.3': {text: 'Kuorma-auto'},
  'H12.4': {text: 'Pakettiauto'},
  'H12.5': {text: 'Matkailuperävaunu'},
  'H12.6': {text: 'Matkailuauto'},
  'H12.7': {text: 'Invalidin ajoneuvo'},
  'H12.8': {text: 'Moottoripyörä'},
  'H12.9': {text: 'Mopo'},
  'H12.10': {text: 'Polkupyörä'},
  'H12.11': {text: 'Moottorikelkka'},
  'H12.12': {text: 'Traktori'},
  'H12.13': {text: 'Vähäpäästöinen ajoneuvo', maxValue: 10000, unit: 'g/km'},
  'H13.1': {text: 'Pysäköintitapa reunakiven päälle'},
  'H13.2': {text: 'Pysäköintitapa reunakiven laitaan'},
  H14: {text: 'Kielto ryhmän A vaarallisten aineiden kuljetukselle'},
  H15: {text: 'Kielto ryhmän B vaarallisten aineiden kuljetukselle'},
  H16: {text: 'Tunneliluokka'},
  'H17.1': {text: 'Voimassaoloaika arkisin ma-pe'},
  'H17.2': {text: 'Voimassaoloaika arkilauantaisin'},
  'H17.3': {text: 'Voimassaoloaika sunnuntaisin ja pyhinä'},
  H18: {text: 'Aikarajoitus', maxValue: 2000, unit: 'min'},
  'H19.1': {text: 'Pysäköintiajan alkamisen osoittamisvelvollisuus (keltainen pohja)', maxValue: 2000, unit: 'min'},
  'H19.2': {text: 'Pysäköintiajan alkamisen osoittamisvelvollisuus (sininen pohja)', maxValue: 2000, unit: 'min'},
  H20: {text: 'Maksullinen pysäköinti'},
  H21: {text: 'Latauspaikka'},
  'H22.1': {text: 'Etuajo-oikeutetun liikenteen suunta'},
  'H22.2': {text: 'Etuajo-oikeutetun liikenteen suunta kääntyville'},
  'H23.1': {text: 'Kaksisuuntainen pyörätie (keltainen pohja)'},
  'H23.2': {text: 'Kaksisuuntainen pyörätie (sininen pohja)'},
  H24: {text: 'Tekstillinen lisäkilpi'},
  H25: {text: 'Huoltoajo sallittu'},
  H26: {text: 'Hätäpuhelin ja sammutin'}
};
export const allowedOnKapyObject = {
  A11: 'Tietyö',
  A21: 'Tienristeys',
  A33: 'Muu vaara',
  B5: 'Väistämisvelvollisuus risteyksessä',
  B6: 'Pakollinen pysäyttäminen',
  C2: 'Moottorikäyttöisellä ajoneuvolla ajo kielletty',
  C21: 'Ajoneuvon suurin sallittu leveys',
  C22: 'Ajoneuvon suurin sallittu korkeus',
  C24: 'Ajoneuvon suurin sallittu massa',
  D4: 'Jalkakäytävä',
  D5: 'Pyörätie',
  D6: 'Yhdistetty pyörätie ja jalkakäytävä',
  'D7.1': 'Pyörätie ja jalkakäytävä rinnakkain',
  'D7.2': 'Pyörätie ja jalkakäytävä rinnakkain',
  E26: 'Kävelykatu',
  E27: 'Kävelykatu päättyy',
  F16: 'Osoiteviitta',
  F19: 'Jalankulun viitta',
  'F20.1': 'Pyöräilyn viitta',
  'F20.2': 'Pyöräilyn viitta',
  'F21.1': 'Pyöräilyn suunnistustaulu',
  'F21.2': 'Pyöräilyn suunnistustaulu',
  F22: 'Pyöräilyn etäisyystaulu',
  F23: 'Pyöräilyn paikannimi',
  'F50.9': 'Polkupyörälle tarkoitettu reitti',
  F52: 'Jalankulkijalle tarkoitettu reitti',
  F53: 'Esteetön reitti',
  'F54.1': 'Reitti, jolla on portaat alas',
  'F54.2': 'Reitti, jolla on portaat ylös',
  'F55.1': 'Reitti ilman portaita alas',
  'F55.2': 'Reitti ilman portaita ylös',
  'F55.3': 'Pyörätuoliramppi alas',
  'F55.4': 'Pyörätuoliramppi ylös',
  'F56.1': 'Hätäuloskäynti vasemmalla',
  'F56.2': 'Hätäuloskäynti oikealla',
  'F57.1': 'Poistumisreitti (yksi)',
  'F57.2': 'Poistumisreitti (useita)',
  'H23.1': 'Kaksisuuntainen pyörätie',
  'H23.2': 'Kaksisuuntainen pyörätie',
  H24: 'Tekstillinen lisäkilpi',
  H25: 'Huoltoajo sallittu'
};
