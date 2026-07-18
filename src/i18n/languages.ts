export interface LanguageInfo {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  geoRegion: string;
  geoPlacename: string;
  localeCode: string;
  dir?: 'ltr' | 'rtl';
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', geoRegion: 'US-NY', geoPlacename: 'New York', localeCode: 'en_US' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩', geoRegion: 'ID-JK', geoPlacename: 'Jakarta', localeCode: 'id_ID' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', geoRegion: 'ES-M', geoPlacename: 'Madrid', localeCode: 'es_ES' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', geoRegion: 'FR-IDF', geoPlacename: 'Paris', localeCode: 'fr_FR' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', geoRegion: 'DE-BE', geoPlacename: 'Berlin', localeCode: 'de_DE' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', geoRegion: 'JP-13', geoPlacename: 'Tokyo', localeCode: 'ja_JP' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷', geoRegion: 'BR-SP', geoPlacename: 'São Paulo', localeCode: 'pt_BR' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', geoRegion: 'RU-MOW', geoPlacename: 'Moscow', localeCode: 'ru_RU' },
  { code: 'zh', name: 'Chinese', nativeName: '中文 (简体)', flag: '🇨🇳', geoRegion: 'CN-BJ', geoPlacename: 'Beijing', localeCode: 'zh_CN' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', geoRegion: 'SA-01', geoPlacename: 'Riyadh', localeCode: 'ar_SA', dir: 'rtl' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', geoRegion: 'IN-DL', geoPlacename: 'New Delhi', localeCode: 'hi_IN' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', geoRegion: 'IT-RM', geoPlacename: 'Rome', localeCode: 'it_IT' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷', geoRegion: 'KR-11', geoPlacename: 'Seoul', localeCode: 'ko_KR' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱', geoRegion: 'NL-NH', geoPlacename: 'Amsterdam', localeCode: 'nl_NL' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷', geoRegion: 'TR-34', geoPlacename: 'Istanbul', localeCode: 'tr_TR' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱', geoRegion: 'PL-MZ', geoPlacename: 'Warsaw', localeCode: 'pl_PL' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳', geoRegion: 'VN-HN', geoPlacename: 'Hanoi', localeCode: 'vi_VN' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭', geoRegion: 'TH-10', geoPlacename: 'Bangkok', localeCode: 'th_TH' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska', flag: '🇸🇪', geoRegion: 'SE-AB', geoPlacename: 'Stockholm', localeCode: 'sv_SE' },
  { code: 'cs', name: 'Czech', nativeName: 'Čeština', flag: '🇨🇿', geoRegion: 'CZ-10', geoPlacename: 'Prague', localeCode: 'cs_CZ' },
  { code: 'da', name: 'Danish', nativeName: 'Dansk', flag: '🇩🇰', geoRegion: 'DK-84', geoPlacename: 'Copenhagen', localeCode: 'da_DK' },
  { code: 'el', name: 'Greek', nativeName: 'Ελληνικά', flag: '🇬🇷', geoRegion: 'GR-I', geoPlacename: 'Athens', localeCode: 'el_GR' },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi', flag: '🇫🇮', geoRegion: 'FI-18', geoPlacename: 'Helsinki', localeCode: 'fi_FI' },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית', flag: '🇮🇱', geoRegion: 'IL-JM', geoPlacename: 'Jerusalem', localeCode: 'he_IL', dir: 'rtl' },
  { code: 'hu', name: 'Hungarian', nativeName: 'Magyar', flag: '🇭🇺', geoRegion: 'HU-BU', geoPlacename: 'Budapest', localeCode: 'hu_HU' },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk', flag: '🇳🇴', geoRegion: 'NO-03', geoPlacename: 'Oslo', localeCode: 'no_NO' },
  { code: 'ro', name: 'Romanian', nativeName: 'Română', flag: '🇷🇴', geoRegion: 'RO-B', geoPlacename: 'Bucharest', localeCode: 'ro_RO' },
  { code: 'sk', name: 'Slovak', nativeName: 'Slovenčina', flag: '🇸🇰', geoRegion: 'SK-BL', geoPlacename: 'Bratislava', localeCode: 'sk_SK' },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська', flag: '🇺🇦', geoRegion: 'UA-30', geoPlacename: 'Kyiv', localeCode: 'uk_UA' },
  { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu', flag: '🇲🇾', geoRegion: 'MY-14', geoPlacename: 'Kuala Lumpur', localeCode: 'ms_MY' },
];

export const getLanguageByCode = (code: string): LanguageInfo => {
  return SUPPORTED_LANGUAGES.find((lang) => lang.code === code) || SUPPORTED_LANGUAGES[0];
};

export const isValidLanguageCode = (code: string): boolean => {
  return SUPPORTED_LANGUAGES.some((lang) => lang.code === code);
};
