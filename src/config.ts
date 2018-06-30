import { BonbonsConfigCollection, BonbonsEntry, BonbonsToken } from "@bonbons/contracts";

export class ConfigCollection implements BonbonsConfigCollection {

  protected _pool = new Map<symbol, { value: any }>();

  public set<T>(token: BonbonsToken<T>, entry: T): void {
    this._pool.set(token.key, { value: entry });
  }

  public get<T>(token: BonbonsToken<T>): T {
    const entry = this._pool.get(token.key);
    return entry && entry.value;
  }

  public toArray(): BonbonsEntry<any>[] {
    return Array.from(this._pool.entries()).map(([sb, { value }]) => ({ token: { key: sb }, value }));
  }

}