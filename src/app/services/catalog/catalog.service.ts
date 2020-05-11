import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Catalog } from 'src/domain/entities';

import { LocalStorageService } from '../local-storage/local-storage.service';
import { CATALOGS } from '../local-storage/local-storage.namespace';

type SpecialCatalogUUID = 'today' | 'article';

@Injectable({
  providedIn: 'root'
})
export class CatalogService {

  private current: Catalog;
  private catalogs: Catalog[] = [];

  currentUUID: SpecialCatalogUUID | string = 'today';

  currentUUID$ = new Subject<string>();
  current$ = new Subject<Catalog>();
  catalogs$ = new Subject<Catalog[]>();

  constructor(private store: LocalStorageService) { }

  private broadcast(): void {
    this.catalogs$.next(this.catalogs);
    this.current$.next(this.current);
    this.currentUUID$.next(this.currentUUID);
  }

  private persist(): void {
    this.store.set(CATALOGS, this.catalogs);
  }

  private getByUUID(uuid: string): Catalog {
    return this.catalogs.find(item => item._id == uuid);
  }

  private update(catalog: Catalog): void {
    const index = this.catalogs.findIndex(item => item._id == catalog._id);
    if (index !== -1) { // maybe !== ???
      this.catalogs.splice(index, 1, catalog);
      this.broadcast();
      this.persist();
    }
  }


  getCurrentCatalogUUID(): SpecialCatalogUUID | string {
    return this.currentUUID;
  }

  getAll(): void {
    this.catalogs = this.store.getCatalog(CATALOGS);
    this.broadcast();
  }

  setCurrentUUID(uuid: string): void {
    this.currentUUID = uuid;
    this.current = this.catalogs.find(item => item._id == uuid);
    this.broadcast();
  }

  add(title: string): void {
    const newCatalog = new Catalog(title);
    this.catalogs.push(newCatalog);
    this.currentUUID = newCatalog._id;
    this.current = newCatalog;

    this.broadcast();
    this.persist();
  }

  rename(uuid: string, title: string) {
    const catalog = this.getByUUID(uuid);
    if (catalog) {
      catalog.title = title;
      this.update(catalog);
    }
  }

  delete(uuid: string): void {
    const index = this.catalogs.findIndex(item => item._id == uuid);
    if (index !== -1) {
      this.catalogs.splice(index, 1);
      this.currentUUID = this.catalogs.length ?
        this.catalogs[this.catalogs.length - 1]._id
        : this.currentUUID == 'today' ? 'today' : 'article';

      this.broadcast();
      this.persist();
    }
  };

}
