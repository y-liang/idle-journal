import { Injectable } from '@angular/core';
import { Article } from 'src/domain/entities';
import { Subject } from 'rxjs';
import { CatalogService } from '../catalog/catalog.service';
import { LocalStorageService } from '../local-storage/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  articles$ = new Subject<Article[]>();

  private articles: Article[] = [];


  constructor(
    private catalogService: CatalogService,
    private store: LocalStorageService
  ) {
    this.articles = this.store.getCatalog(ARTICLES);
  }



}
