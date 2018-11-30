import { IConfigCollection, IToken, IEntry } from "./declares";

type Configs = IConfigCollection;
type Token<T> = IToken<T>;

export class ConfigCollection implements Configs {

  protected _pool = new Map<symbol, { value: any }>();

  public set<T>(token: Token<T>, entry: T): void {
    this._pool.set(token.key, { value: entry });
  }

  public get<T>(token: Token<T>): T {
    const entry = this._pool.get(token.key);
    return entry && entry.value;
  }

  public toArray(): IEntry<any>[] {
    return Array.from(this._pool.entries()).map(([sb, { value }]) => ({ token: { key: sb }, value }));
  }

}