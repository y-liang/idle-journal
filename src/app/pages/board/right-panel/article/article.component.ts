import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Subject, combineLatest } from 'rxjs';
import { Article, Catalog } from 'src/domain/entities';
import { CatalogService } from 'src/app/services/catalog/catalog.service';
import { ArticleService } from 'src/app/services/article/article.service';
import { takeUntil } from 'rxjs/operators';
import { floorToDate, getTodayTime } from 'src/utilities/time';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.less']
})
export class ArticleComponent implements OnInit {
  // @Output() quickAdd = new EventEmitter<string>();


  private destroy$ = new Subject();

  articles: Article[] = [];
  catalogs: Catalog[] = [];
  currentContextArticle: Article;

  constructor(
    private catalogService: CatalogService,
    private articleService: ArticleService
  ) { }

  ngOnInit() {
    this.catalogService.catalogs$
      .pipe(takeUntil(this.destroy$))
      .subscribe(catalogs => {
        this.catalogs = catalogs;
      });

    combineLatest(this.catalogService.currentUUID$, this.articleService.articles$)
      .pipe(takeUntil(this.destroy$))
      .subscribe(sources => {
        this.processArticles(sources[0], sources[1]);
      });

    this.articleService.getAll();
    this.catalogService.getAll();
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  private processArticles(catalogUUID: string, articles: Article[]): void {
    const filteredArticles = articles.filter(item => {
      return (
        (catalogUUID == 'today' && item.planAt && floorToDate(item.planAt) <= getTodayTime())
        || (catalogUUID == 'article' && (!item.catalogUUID || item.catalogUUID == 'article'))
        || (catalogUUID == item.catalogUUID)
      );
    }).map(item => Object.assign({}, item) as Article);

    this.articles = [].concat(filteredArticles);
    // why not just equals to filteredArticles???
  }

  add(title: string): void {
    this.articleService.add(title);
  }


  addArticle(title: string) {
    // if (title) { this.quickAdd.next(title); }
    this.articleService.add(title);
  }

}
