import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DishService } from '../services/dish.service';
import { Dish } from '../shared/dish';
import { DISHES } from '../shared/dishes';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Comment } from '../shared/comment';




@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})

export class DishdetailComponent implements OnInit{
  commentForm: FormGroup;
  comentario: Comment;
  dishes = DISHES;
  comments: Comment[];
  @Input()
  dish: Dish ;
  dishIds: string[];
  prev: string;
  next: string;

  formErrors = {
    'author': '',
    'comment': '',
  };

  validationMessages = {
    'author':{
      'required': 'El campo autor es obligatorio',
      'minLength': 'El autor no puede tener menos de 2 caracteres',
      'maxLength': 'El autor no puede tener más de 25 caracteres',
    },
    'comment':{
      'required': 'El campo comentario es obligatorio',
      'minLength': 'El comentario no puede tener menos de 3 caracteres',
      'maxLength': 'El nombre no puede tener más de 150 caracteres',
    }
  };

  @ViewChild('fform') commentFormDirective;

  constructor(private dishservice: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder){
      this.createForm();
    }

  ngOnInit(){
    this.dishservice.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
    this.route.params.pipe(switchMap((params: Params) => this.dishservice.getDish(params['id'])))
    .subscribe(dish => { this.dish = dish; this.setPrevNext(dish.id); });
  }

  createForm(){
    this.commentForm = this.fb.group({
      autor: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
      comment:['', [Validators.required, Validators.minLength(2), Validators.maxLength(150)] ],
      rating:'',
      date: Date.now,
    });

    this.commentForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged();
  }

  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

  goBack(): void {
    this.location.back();
  }

  addComment(comentario: Comment){
    this.comments.push(this.comentario);
    this.dishes.map(dish => {

    });
  }

  onSubmit(){
    this.comentario = this.commentForm.value;
    this.addComment(this.comentario);
    console.log(this.comentario);
    this.commentForm.reset({
      author: '',
      comment:'',
      rating: '',
      date: '',
    });
    this.commentFormDirective.resetForm();
  }

  onValueChanged(data?: any){
    if(!this.commentForm) {return;}
    const form = this.commentForm;
    for(const field  in this.formErrors){
      if(this.formErrors.hasOwnProperty(field)){
        this.formErrors[field] = '';
        const control = form.get(field);
        if(control && control.dirty && !control.valid){
          const messages = this.validationMessages[field];
          for(const key in control.errors){
            if(control.errors.hasOwnProperty(key)){
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

}
