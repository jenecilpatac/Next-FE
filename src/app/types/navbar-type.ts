export type NavItem = {
  href: string;
  label: string;
  icon: string;
  show_on_auth?: boolean;
  target?: string | "_blank" | "_self" | "_parent" | "_top";
  is_always_display?: boolean;
};
