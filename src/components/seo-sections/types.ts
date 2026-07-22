export interface SeoSectionData {
  type: string;
  title: string;
  content?: string;
  steps?: { title: string; description: string }[];
}

export interface SectionProps {
  section: SeoSectionData;
  /** flipLayout = true → mirror horizontal arrangement */
  flipLayout: boolean;
}
