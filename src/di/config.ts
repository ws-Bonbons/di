import { Contracts as c } from "@bonbons/contracts";

type Configs = c.BonbonsConfigCollection;
type Token<T> = c.BonbonsToken<T>;

export class ConfigCollection implements Configs {

  protected _pool = new Map<symbol, { value: any }>();

  public set<T>(token: Token<T>, entry: T): void {
    this._pool.set(token.key, { value: entry });
  }

  public get<T>(token: Token<T>): T {
    const entry = this._pool.get(token.key);
    return entry && entry.value;
  }

  public toArray(): c.BonbonsEntry<any>[] {
    return Array.from(this._pool.entries()).map(([sb, { value }]) => ({ token: { key: sb }, value }));
  }

}