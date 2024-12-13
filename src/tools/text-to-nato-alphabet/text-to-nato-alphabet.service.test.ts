import { describe, expect, it } from 'vitest';
import { textToNatoAlphabet } from './text-to-nato-alphabet.service';

const TestCase_TestYW = 'TesYW 123 ? = !@';
const TestCase_TestYJ = 'TesYj 123 ? = !@';
const natoTests = [
  {
    lang: '(International)',
    input: TestCase_TestYW,
    output: 'TANGO echo sierra YANKEE WHISKEY (SPACE) (digit 1) (digit 2) (digit 3) (SPACE) (punctuation ?) (SPACE) (punctuation =) (SPACE) (punctuation !) (punctuation @)',
  },
  {
    lang: '(France)',
    input: TestCase_TestYW,
    output: 'THÉRÈSE eugène suzanne YVONNE WILLIAM (ESPACE) (digit 1) (digit 2) (digit 3) (ESPACE) (punctuation ?) (ESPACE) (punctuation =) (ESPACE) (punctuation !) (punctuation @)',
  },
  {
    lang: '(Belgium)',
    input: TestCase_TestYW,
    output: 'TELEFOON emiel sofie YVONNE WATERLOO (ESPACE) (digit 1) (digit 2) (digit 3) (ESPACE) (punctuation ?) (ESPACE) (punctuation =) (ESPACE) (punctuation !) (punctuation @)',
  },
  {
    lang: '(Switzerland)',
    input: TestCase_TestYW,
    output: 'THÉRÈSE émile suzanne (Y) WILLIAM (ESPACE) (digit 1) (digit 2) (digit 3) (ESPACE) (punctuation ?) (ESPACE) (punctuation =) (ESPACE) (punctuation !) (punctuation @)',
  },
  {
    lang: '(Québec)',
    input: TestCase_TestYW,
    output: 'THOMAS édouard samuel (Y) WILLIAM (ESPACE) (digit 1) (digit 2) (digit 3) (ESPACE) (punctuation ?) (ESPACE) (punctuation =) (ESPACE) (punctuation !) (punctuation @)',
  },
  {
    lang: '(Germany, 2022)',
    input: 'TesYü 123 ? = !@',
    output: 'TÜBINGEN essen salzwedel YPSILON umlaut-unna (LEERZEICHEN) (digit 1) (digit 2) (digit 3) (LEERZEICHEN) (punctuation ?) (LEERZEICHEN) (punctuation =) (LEERZEICHEN) (punctuation !) (punctuation @)',
  },
  {
    lang: '(Austria)',
    input: TestCase_TestYW,
    output: 'THEODOR emil samuel/siegfried YPSILON WILHELM (LEERZEICHEN) (digit 1) (digit 2) (digit 3) (LEERZEICHEN) (punctuation ?) (LEERZEICHEN) (punctuation =) (LEERZEICHEN) (punctuation !) (punctuation @)',
  },
  {
    lang: '(Germany, informal, 2022)',
    input: 'TesYü 123 ? = !@',
    output: 'THEODOR emil samuel YPSILON überfluss (LEERZEICHEN) (digit 1) (digit 2) (digit 3) (LEERZEICHEN) (punctuation ?) (LEERZEICHEN) (punctuation =) (LEERZEICHEN) (punctuation !) (punctuation @)',
  },
  {
    lang: '(Netherlands)',
    input: 'TesY huis rij 123 ? = !@',
    output: 'THEODOR eduard simon YPSILON (SPATIE) hendrik utrecht izaak simon (SPATIE) richard/rudolf ijmuiden/ijsbrand (SPATIE) (digit 1) (digit 2) (digit 3) (SPATIE) (punctuation ?) (SPATIE) (punctuation =) (SPATIE) (punctuation !) (punctuation @)',
  },
  {
    lang: 'Italian',
    input: TestCase_TestYJ,
    output: 'TORINO empoli savona YORK, YOGURT jolly/juventus (SPAZIO) (digit 1) (digit 2) (digit 3) (SPAZIO) (punctuation ?) (SPAZIO) (punctuation =) (SPAZIO) (punctuation !) (punctuation @)',
  },
  {
    lang: 'Spanish',
    input: 'TesYñj 123 ? = !@',
    output: 'TOLEDO españa sábado YOLANDA ñoño josé (ESPACIO) (digit 1) (digit 2) (digit 3) (ESPACIO) (punctuation ?) (ESPACIO) (punctuation =) (ESPACIO) (punctuation !) (punctuation @)',
  },
  {
    lang: '(Brazil)',
    input: 'TesYÇj 123 ? = !@',
    output: 'TATU estrela saci YOLANDA (Ç) josé (ESPAÇO) (digit 1) (digit 2) (digit 3) (ESPAÇO) (punctuation ?) (ESPAÇO) (punctuation =) (ESPAÇO) (punctuation !) (punctuation @)',
  },
  {
    lang: '(Portugal)',
    input: 'TesYúj 123 ? = !@',
    output: 'TAVIRA évora setúbal YORK (ú) josé (ESPAÇO) (digit 1) (digit 2) (digit 3) (ESPAÇO) (punctuation ?) (ESPAÇO) (punctuation =) (ESPAÇO) (punctuation !) (punctuation @)',
  },
  {
    lang: 'Swedish',
    input: TestCase_TestYJ,
    output: 'TORE erik sigurd YNGVE johan (UTRYMME) (digit 1) (digit 2) (digit 3) (UTRYMME) (punctuation ?) (UTRYMME) (punctuation =) (UTRYMME) (punctuation !) (punctuation @)',
  },
  {
    lang: 'Danish',
    input: 'TesÆYj 123 ? = !@',
    output: 'THEODOR erik søren ÆGIR YRSA johan (MELLEMRUMSTEGN) (digit 1) (digit 2) (digit 3) (MELLEMRUMSTEGN) (punctuation ?) (MELLEMRUMSTEGN) (punctuation =) (MELLEMRUMSTEGN) (punctuation !) (punctuation @)',
  },
  {
    lang: 'Norwegian',
    input: 'TesYÅj 123 ? = !@',
    output: 'TEODOR edith sigrid YNGLING ÅSE johan (MELLOMROMSTEGN) (digit 1) (digit 2) (digit 3) (MELLOMROMSTEGN) (punctuation ?) (MELLOMROMSTEGN) (punctuation =) (MELLOMROMSTEGN) (punctuation !) (punctuation @)',
  },
  {
    lang: 'Finnish',
    input: TestCase_TestYJ,
    output: 'TYYNE eemeli sakari YRJÖ jussi (VÄLILYÖNTI) (digit 1) (digit 2) (digit 3) (VÄLILYÖNTI) (punctuation ?) (VÄLILYÖNTI) (punctuation =) (VÄLILYÖNTI) (punctuation !) (punctuation @)',
  },
  {
    lang: 'Turkish',
    input: TestCase_TestYJ,
    output: 'TOKAT edirne sinop YOZGAT jandarma (BOŞLUK) (digit 1) (digit 2) (digit 3) (BOŞLUK) (punctuation ?) (BOŞLUK) (punctuation =) (BOŞLUK) (punctuation !) (punctuation @)',
  },
  {
    lang: 'Romanian',
    input: TestCase_TestYJ,
    output: 'TUDOR elena sandu I-GREC jean (SPAȚIU) (digit 1) (digit 2) (digit 3) (SPAȚIU) (punctuation ?) (SPAȚIU) (punctuation =) (SPAȚIU) (punctuation !) (punctuation @)',
  },
  {
    lang: 'Czech',
    input: TestCase_TestYJ,
    output: 'TOMÁŠ emil svatopluk YPSILON josef (PROSTOROVÝ) (digit 1) (digit 2) (digit 3) (PROSTOROVÝ) (punctuation ?) (PROSTOROVÝ) (punctuation =) (PROSTOROVÝ) (punctuation !) (punctuation @)',
  },
  {
    lang: 'Yugoslav',
    input: 'TesYČj 123 ? = !@',
    output: 'TUZLA evropa skopje IPSILON ČAČAK jadran (PRIESTOROVÝ) (digit 1) (digit 2) (digit 3) (PRIESTOROVÝ) (punctuation ?) (PRIESTOROVÝ) (punctuation =) (PRIESTOROVÝ) (punctuation !) (punctuation @)',
  },
  {
    lang: 'Serbian',
    input: 'TesYČj 123 ? = !@',
    output: 'TIMOK evropa sava IPSILON ČAČAK jadran (PROSTORNI) (digit 1) (digit 2) (digit 3) (PROSTORNI) (punctuation ?) (PROSTORNI) (punctuation =) (PROSTORNI) (punctuation !) (punctuation @)',
  },
  {
    lang: 'Slovene',
    input: 'TesYČj 123 ? = !@',
    output: 'TRIGLAV evropa soča IPSILON ČATEŽ jadran (PRESLEDKA) (digit 1) (digit 2) (digit 3) (PRESLEDKA) (punctuation ?) (PRESLEDKA) (punctuation =) (PRESLEDKA) (punctuation !) (punctuation @)',
  },
  {
    lang: 'Russian',
    input: 'Зинаида !.?',
    output: 'ЗИНАИДА иван николай анна иван дмитрий анна ( ) (punctuation !) (punctuation .) (punctuation ?)',
  },
  {
    lang: 'Korean',
    input: '안녕하세요 여러분',
    output: '잉어 아버지 나폴리 나폴리 연못 잉어 한강 아버지 서울 엑스레이 잉어 요지경 ( ) 잉어 연못 로마 어머니 바가지 우편 나폴리',
  },
  {
    lang: 'Greek',
    input: 'τίγρης !?',
    output: 'τίγρης (ί) γαλή ρήγας ηρώ σοφός ( ) (punctuation !) (punctuation ?)',
  },
  {
    lang: 'Japanese',
    input: '数字のひと おしまいのン ?:',
    output: '(数) (字) 野原のノ 飛行機のヒ 東京のト ( ) 大阪のオ 新聞のシ マッチのマ いろはのイ 野原のノ おしまいのン ( ) (punctuation ?) (punctuation :)',
  },
];

describe('text-to-nato', () => {
  it('Convert text to NATO', async () => {
    for (const nato of natoTests) {
      const { lang, input, output } = nato;
      expect(textToNatoAlphabet({ text: input, langOrCountry: lang })).to.equal(output);
    }
  });

  it('Convert text to NATO (includes punctuations and digits names)', async () => {
    expect(textToNatoAlphabet({ text: 'a 1 2 3 ! % ? ;', langOrCountry: '(France)', useDigitsNames: true, usePunctuationsNames: true })).to.equal(
      'anatole (ESPACE) {digit 1 => un} (ESPACE) {digit 2 => deux} (ESPACE) {digit 3 => trois} (ESPACE) {punctuation ! => point d\'exclamation} (ESPACE) {punctuation % => pour cent} (ESPACE) {punctuation ? => point d\'interrogation} (ESPACE) {punctuation ; => point-virgule}');
    expect(textToNatoAlphabet({ text: 'и 1 2 3 ! % ? ;', langOrCountry: 'Russian', useDigitsNames: true, usePunctuationsNames: true })).to.equal(
      'иван ( ) {digit 1 => один (odin)} ( ) {digit 2 => два (dva)} ( ) {digit 3 => три (tri)} ( ) {punctuation ! => восклицательный знак (vosklitsatel\'nyy znak)} ( ) {punctuation % => процент (protsent)} ( ) {punctuation ? => вопросительный знак (voprositel\'nyy znak)} ( ) {punctuation ; => точка с запятой (tochka s zapyatoy)}');
    expect(textToNatoAlphabet({ text: 'TesYj 1 2 3 ! % ? ;', langOrCountry: 'Swedish', useDigitsNames: true, usePunctuationsNames: true })).to.equal(
      'TORE erik sigurd YNGVE johan (UTRYMME) {digit 1 => ett} (UTRYMME) {digit 2 => två} (UTRYMME) {digit 3 => tre} (UTRYMME) {punctuation ! => utropstecken} (UTRYMME) {punctuation % => procent} (UTRYMME) {punctuation ? => frågetecken} (UTRYMME) {punctuation ; => semikolon}');
  });
});
