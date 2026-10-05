export type CausalNodeKind =
  | "outcome"
  | "calculation"
  | "driver"
  | "constant";

export interface CausalNodeDefinition {
  id: string;
  label: string;
  formula?: string;
  explanation?: string;
  kind?: CausalNodeKind;
  children?: CausalNodeDefinition[];
}