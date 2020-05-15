import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Article } from 'src/domain/entities';
import { CatalogService } from '../catalog/catalog.service';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { ARTICLES } from '../local-storage/local-storage.namespace';
import { ONE_HOUR, floorToMinute, getCurrentTime } from 'src/utilities/time';


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

  private broadcast(): void {
    this.articles$.next(this.articles);
  }

  private persist(): void {
    this.store.set(ARTICLES, this.articles);
  }

  getAll(): void {
    this.articles = this.store.getCatalog(ARTICLES);
    this.broadcast();
  }

  getRaw(): Article[] {
    return this.articles;
  }

  getByUUID(uuid: string): Article | null {
    return this.articles.find((item: Article) => item._id == uuid) || null;
  }

  setArticleToday(uuid: string): void {
    const article = this.getByUUID(uuid);
    if (article && !article.completedFlag) {
      article.planAt = floorToMinute(new Date()) + ONE_HOUR;
      this.update(article);
    }
  }

  toggleArticleComplete(uuid: string): void {
    const article = this.getByUUID(uuid);
    if (article) {
      article.completedFlag = !article.completedFlag;
      article.completedAt = article.completedFlag ? getCurrentTime() : undefined;
      this.persist();
    }
  }

  moveToCatalog(uuid: string, catalogUUID: string): void {
    const article = this.getByUUID(uuid);
    if (article) {
      article.catalogUUID = catalogUUID;
      this.update(article);
    }
  }

  add(title: string): void {
    const catalogUUID = this.catalogService.getCurrentCatalogUUID();
    const newArticle = new Article(title, catalogUUID);

    if (catalogUUID == 'today') {
      newArticle.planAt = floorToMinute(new Date()) + ONE_HOUR;
      newArticle.catalogUUID = 'article';
    }

    this.articles.push(newArticle);
    this.broadcast();
    this.persist();
  }


  update(article: Article): void {
    const index = this.articles.findIndex(item => item._id == article._id);
    if (index !== -1) {
      article.completedAt = article.completedFlag ? getCurrentTime() : undefined;
      this.articles.splice(index, 1, article);
      this.persist();
      this.broadcast();
    }
  }

  delete(uuid: string): void {
    const index = this.articles.findIndex(item => item._id == uuid);
    if (index !== 1) {
      this.articles.splice(index, 1);
      this.broadcast();
      this.persist();
    }
  }

  deleteInCatalog(uuid: string): void {
    const articlesToDelete = this.articles.filter(item => item.catalogUUID == uuid);
    articlesToDelete.forEach(item => this.delete(item._id));
  }

}
