import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';


import { Ingredient } from '../../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy  {
  //@ViewChild('nameInput', { static: false }) nameInputRef: ElementRef;
  //@ViewChild('amountInput', { static: false }) amountInputRef: ElementRef;

  @ViewChild('f',{static:true}) slForm:NgForm;
  subscription: Subscription;
  editMode= false;
  editingItemIndex: number;
  editItem: Ingredient;
 
  constructor(private slService: ShoppingListService) { }

  ngOnInit() {
    this.subscription = this.slService.startEditing.subscribe((index:number)=>{
      this,this.editingItemIndex=index;
      this.editMode = true;
      this.editItem = this.slService.getIngredient(index);
      this.slForm.setValue({
        name: this.editItem.name,
        amount: this.editItem.amount
      });
    });
  }

  ngOnDestroy(): void {   
    this.subscription.unsubscribe();
  }

  onAddItem(form:NgForm) {
    const value = form.value;
    const newIngredient = new Ingredient(value.name, value.amount);
    if (this.editMode){
      this.slService.updateIngredient(this.editingItemIndex,newIngredient);
    }
    else{
      this.slService.addIngredient(newIngredient);
    }
    this.editMode = false;
    form.reset();
  }

  onDeleteItem(){
    if (this.editMode){
      this.slService.deleteIngredient(this.editingItemIndex);
      this.slForm.reset();
    }
  }

  onResetForm(){
    this.slForm.reset();
    this.editMode = false;
  }



}
