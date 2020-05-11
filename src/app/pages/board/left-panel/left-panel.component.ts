import { Component, OnInit, Input } from '@angular/core';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { USERNAME } from 'src/app/services/local-storage/local-storage.namespace';

@Component({
  selector: 'app-left-panel',
  templateUrl: './left-panel.component.html',
  styleUrls: ['./left-panel.component.less']
})
export class LeftPanelComponent implements OnInit {
  @Input() isCollapsed: boolean;

  username: string;

  constructor(private store: LocalStorageService) { }

  ngOnInit() {
    this.username = this.store.get(USERNAME);
  }

}
