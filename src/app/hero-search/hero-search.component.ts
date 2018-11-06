import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.css']
})
export class HeroSearchComponent implements OnInit {

  heroes$: Observable<Hero[]>;
  /** Source of Observable values (the terms) - Observable stream */
  private searchTerms = new Subject<string>();

  constructor(private heroService: HeroService) { }

  /** Push a search term into the observable stream */
  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    // This will reduce the number of calls to searchHeroes from heroService
    this.heroes$ = this.searchTerms.pipe(
      // Wait 300ms after each keystroke before considering the term
      debounceTime(300),
      // Ignore new term if same as previous term
      distinctUntilChanged(),
      /*
       * Switch to new search observable each time the term changes
       * Calls searchHeroes() for each search term that makes it through
       * `debounce` and `distinctUntilChanged`
       * It cancels and discards previous search observables (return only latest Observable)
      */
      switchMap((term: string) => this.heroService.searchHeroes(term))
    );
  }

}
