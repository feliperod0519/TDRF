import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';

import { Subject, BehaviorSubject, Subscription } from 'rxjs';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes: Recipe[];
  subcription: Subscription;

  constructor(private recipeService: RecipeService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.subcription = this.recipeService.recipesChanged.subscribe((recipes:Recipe[])=>{
      this.recipes = recipes
    });
    this.recipes = this.recipeService.getRecipes();
    
    
    console.log(':)');
    const sB= new BehaviorSubject('');
    sB.next('hello');
    sB.next('world-bs');
    sB.subscribe(x=>console.log(x));

    const s = new Subject();
    s.next('hello');
    s.next('world');
    s.subscribe(x=>console.log(x));
    s.next('HELLO');
    s.next('WORLD');
    s.subscribe(x=>console.log(x));
    s.next('HeLlO');
    s.next('WoRlD');
    s.subscribe(x=>console.log(x));
    s.next('hElLo');
    s.next('wOrLd-->:) JA');
  }

  onNewRecipe() {
    this.router.navigate(['new'], {relativeTo: this.route});
  }

  ngOnDestroy(): void {
    this.subcription.unsubscribe();
  }
}
