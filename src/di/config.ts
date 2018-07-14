import { Contracts as api } from "@bonbons/contracts";

type Configs = api.BonbonsConfigCollection;
type Token<T> = api.BonbonsToken<T>;

export class ConfigCollection implements Configs {

  protected _pool = new Map<symbol, { value: any }>();

  public set<T>(token: Token<T>, entry: T): void {
    this._pool.set(token.key, { value: entry });
  }

  public get<T>(token: Token<T>): T {
    const entry = this._pool.get(token.key);
    return entry && entry.value;
  }

  public toArray(): api.BonbonsEntry<any>[] {
    return Array.from(this._pool.entries()).map(([sb, { value }]) => ({ token: { key: sb }, value }));
  }

}