import { Component, OnInit, Input } from '@angular/core';
import { TokenBalance } from '../../../model/TokenBalance';

@Component({
  selector: 'app-token-list-item',
  templateUrl: './token-list-item.component.html',
  styleUrls: ['./token-list-item.component.css']
})
export class TokenListItemComponent implements OnInit {

  @Input() tokenBalance: TokenBalance;
  
  constructor() { }

  ngOnInit() {
  }

}
