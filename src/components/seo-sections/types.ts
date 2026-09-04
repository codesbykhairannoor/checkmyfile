export interface SeoSectionData {
  type: string;
  title: string;
  content?: string;
  subTitle?: string;
  subContent?: string;
  badgeText?: string;
  steps?: { title: string; description: string }[];
}

export interface SectionProps {
  section: SeoSectionData;
  /** flipLayout = true → mirror horizontal arrangement */
  flipLayout: boolean;
  badges?: string[];
  stats?: string[];
  buttonText?: string;
}
