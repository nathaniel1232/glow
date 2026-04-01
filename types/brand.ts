export type Vibe =
  | "minimal"
  | "bold"
  | "organic"
  | "y2k"
  | "dark"
  | "coastal"
  | "retro";

export interface BrandInput {
  description: string;
  vibe: Vibe;
}

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  usage: Record<string, string>;
}

export interface FontPairing {
  heading: string;
  body: string;
  headingUrl: string;
  bodyUrl: string;
}

export interface BrandVoice {
  tone: string;
  tagline: string;
  description: string;
  keywords: string[];
}

export interface LogoAsset {
  url: string;
  style: string;
}

export interface SocialTemplate {
  type: "instagram" | "twitter" | "linkedin";
  headline: string;
  subtext: string;
}

export interface BrandProject {
  id: string;
  user_id: string;
  name: string;
  description: string;
  vibe: Vibe;
  brand_names: string[];
  colors: ColorPalette;
  fonts: FontPairing;
  voice: BrandVoice;
  logos: LogoAsset[];
  social_templates: SocialTemplate[];
  bio_slug: string | null;
  bio_links: BioLink[];
  is_paid: boolean;
  created_at: string;
  updated_at: string;
}

export interface BioLink {
  label: string;
  url: string;
}

export interface GenerationResult {
  brand_names: string[];
  colors: ColorPalette;
  fonts: FontPairing;
  voice: BrandVoice;
  social_templates: SocialTemplate[];
}

export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  subscription_status: "free" | "one_time" | "subscribed";
  stripe_customer_id?: string;
}
