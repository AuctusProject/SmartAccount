import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {Location} from '@angular/common';

@Component({
  selector: 'app-add-token',
  templateUrl: './add-token.component.html',
  styleUrls: ['./add-token.component.css']
})
export class AddTokenComponent implements OnInit {

 
  constructor(private router: Router) { 
  }

  ngOnInit() {
  }

  public add(){
    alert('Token Added');
    this.router.navigate(['../']);
  }

}
