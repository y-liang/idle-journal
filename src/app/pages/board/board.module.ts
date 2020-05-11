import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BoardRoutingModule } from './board-routing.module';
import { BoardComponent } from './board.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { LeftPanelComponent } from './left-panel/left-panel.component';


@NgModule({
  declarations: [BoardComponent, LeftPanelComponent],
  imports: [
    CommonModule,
    BoardRoutingModule,
    NgZorroAntdModule
  ]
})
export class BoardModule { }
