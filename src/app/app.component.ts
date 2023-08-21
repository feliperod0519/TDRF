import { Component, OnInit } from '@angular/core';

import { Subject, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  subject$ = new Subject();

  ngOnInit(): void {
    const bS = new BehaviorSubject<string>('');
    bS.next('hello');
    bS.next('world');
    bS.subscribe(x=>console.log);
  }
}
