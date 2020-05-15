import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { USERNAME } from 'src/app/services/local-storage/local-storage.namespace';
import { CatalogComponent } from './catalog/catalog.component';

@Component({
  selector: 'app-left-panel',
  templateUrl: './left-panel.component.html',
  styleUrls: ['./left-panel.component.less']
})
export class LeftPanelComponent implements OnInit {
  @Input() isCollapsed: boolean;
  @ViewChild(CatalogComponent, { static: true }) CatalogComponent: CatalogComponent;

  username: string;

  constructor(private store: LocalStorageService) { }

  ngOnInit() {
    this.username = this.store.get(USERNAME);
  }

  openAddCatalogModal(): void {
    this.CatalogComponent.openAddCatalogModal();
  }

}
