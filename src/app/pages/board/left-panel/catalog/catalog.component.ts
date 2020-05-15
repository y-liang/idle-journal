import { Component, OnInit, Input, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { NzDropdownContextComponent, NzDropdownService, NzModalService, NzContextMenuService, NzDropdownMenuComponent } from 'ng-zorro-antd';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Catalog } from 'src/domain/entities';
import { CatalogService } from 'src/app/services/catalog/catalog.service';
import { ArticleService } from 'src/app/services/article/article.service';

/** use reactive form for all form inputs instead of template-driven */

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.less']
})
export class CatalogComponent implements OnInit {
  @Input() isCollapsed: boolean;
  @ViewChild('catalogRenameInput', { static: true }) private catalogRenameInput: ElementRef;
  @ViewChild('catalogInput', { static: true }) private catalogInput: ElementRef;

  catalogs: Catalog[];
  currentCatalogUUID: string;
  contextCatalogUUID: string;
  addCatalogModalVisible: boolean = false;
  renameCatalogModalVisible: boolean = false;

  private destroy$ = new Subject();

  constructor(
    // private dropdownService: NzDropdownService,
    private contextmenuService: NzContextMenuService,
    private catalogService: CatalogService,
    private articleService: ArticleService,
    private modal: NzModalService
  ) { }

  ngOnInit() {
    this.catalogService.catalogs$
      .pipe(takeUntil(this.destroy$))
      .subscribe(catalogs => { this.catalogs = catalogs; });

    this.catalogService.currentUUID$
      .pipe(takeUntil(this.destroy$))
      .subscribe(uuid => { this.currentCatalogUUID = uuid; });

    this.catalogService.getAll();
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  closeAddCatalogModal(): void {
    this.addCatalogModalVisible = false;
  }

  closeRenameCatalogModal(): void {
    this.renameCatalogModalVisible = false;
  }

  openAddCatalogModal(): void {
    this.addCatalogModalVisible = true;
    setTimeout(() => {
      this.catalogInput.nativeElement.focus();
    });
  }

  openRenameCatalogModal(): void {
    this.renameCatalogModalVisible = true;
    setTimeout(() => {
      const title = this.catalogs.find(item => item._id == this.contextCatalogUUID).title;
      console.log(title);

      this.catalogRenameInput.nativeElement.value = title;
      this.catalogRenameInput.nativeElement.focus();
    });
  }

  contextMenu($event: MouseEvent, dropdownMenu: NzDropdownMenuComponent, uuid: string): void {
    this.contextmenuService.create($event, dropdownMenu);
    this.contextCatalogUUID = uuid;
  }

  click(uuid: string): void {
    this.catalogService.setCurrentUUID(uuid);
  }

  rename(title: string): void {
    this.catalogService.rename(this.contextCatalogUUID, title);
    this.closeRenameCatalogModal();
  }

  add(title: string): void {
    this.catalogService.add(title);
    this.closeAddCatalogModal();
  }

  delete(): void {
    const uuid = this.contextCatalogUUID;
    this.modal.confirm({
      nzTitle: 'are you sure you want to delete this catalog',
      nzContent: 'this action will delete all articles belonged to this catalog',
      nzOnOk: () => {
        new Promise((res, rej) => {
          this.catalogService.delete(uuid);
          this.articleService.deleteInCatalog(uuid);
          res();
        }).catch(() => console.error('delete catalog failed'));
      }
    });
  }

  close(): void {
    this.contextmenuService.close();
  }

}
