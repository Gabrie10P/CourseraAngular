import { Component, OnInit,Inject } from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Promotion } from '../shared/promotion';
import { PromotionService } from '../services/promotion.service';
import { Leader } from '../shared/leader';
import { LeaderService } from '../services/leader.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  dish: Dish;
  promotion: Promotion;
  leader: Leader;
  BaseURL;
  dishErrMsg: string;

  constructor(private dishservice: DishService,
    private promotionservice: PromotionService,
    private leaderService: LeaderService,
    @Inject('BaseURL') private baseUrl){
      this.BaseURL = baseUrl;
    }

  ngOnInit(){
    this.dishservice.getFeaturedDish()
    .subscribe(dish => this.dish = dish, errMsg => this.dishErrMsg = <any>errMsg);
    this.promotionservice.getFeaturedPromotion()
    .subscribe(promotion => this.promotion = promotion, errMsg => this.dishErrMsg = <any>errMsg);
    this.leaderService.getFeaturedLeader()
    .subscribe(leader => this.leader = leader, errMsg => this.dishErrMsg = <any>errMsg);
  }

}
