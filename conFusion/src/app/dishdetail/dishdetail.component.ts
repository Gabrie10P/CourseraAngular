import { Component, Input, OnInit, ViewChild, Inject } from '@angular/core';
import { DishService } from '../services/dish.service';
import { Dish } from '../shared/dish';
import { DISHES } from '../shared/dishes';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Comment } from '../shared/comment';
import { visibility,flyInOut, expand } from '../animations/app.animation';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
    },
  animations: [
    visibility(),
    flyInOut(),
    expand()
  ]
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
  BaseURL;
  dishErrMsg: string;
  dishCopy: Dish;
  visibility = 'shown';

  

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
    @Inject('BaseURL') private baseUrl,
    private fb: FormBuilder){
      this.createForm();
      this.BaseURL = baseUrl;
    }

  ngOnInit(){
    this.dishservice.getDishIds().subscribe(dishIds => this.dishIds = dishIds, errMsg => this.dishErrMsg = <any>errMsg);
    this.route.params.pipe(switchMap((params: Params) => {this.visibility = 'hidden'; return this.dishservice.getDish(params['id'])}))
    .subscribe(dish => { this.dish = dish; this.dishCopy = dish ;this.setPrevNext(dish.id) }, errMsg => this.dishErrMsg = <any>errMsg);
    
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
    this.dishCopy.comments.push(this.comentario);
    this.dishservice.putDish(this.dishCopy).subscribe(dish => {
      this.dish = dish; this.dishCopy = dish
    },
    errMsg => {this.dish == null; this.dishCopy == null; this.dishErrMsg = <any>errMsg;}
    );

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
