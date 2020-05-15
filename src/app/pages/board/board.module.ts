import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';


import { BoardRoutingModule } from './board-routing.module';
import { BoardComponent } from './board.component';
import { LeftPanelComponent } from './left-panel/left-panel.component';
import { CatalogComponent } from './left-panel/catalog/catalog.component';
import { RightPanelComponent } from './right-panel/right-panel.component';
import { ArticleComponent } from './right-panel/article/article.component';
import { TopBarComponent } from './right-panel/top-bar/top-bar.component';


@NgModule({
  declarations: [BoardComponent, LeftPanelComponent, CatalogComponent, RightPanelComponent, ArticleComponent, TopBarComponent],
  imports: [
    CommonModule,
    FormsModule,

    BoardRoutingModule,
    NgZorroAntdModule
  ]
})
export class BoardModule { }
