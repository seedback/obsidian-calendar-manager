export interface CustomTagHandler {
  verifier: (str: string) => boolean;
  callback: (str: string) => string;
}