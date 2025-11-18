export interface DatabaseAdapter {
  get(path: string): Promise<any>;
  set(path: string, value: any): Promise<void>;
  push?(path: string, value: any): Promise<void>;
  delete(path: string): Promise<void>;
  has(path: string): Promise<boolean>;
  all?(): Promise<any>;
}
