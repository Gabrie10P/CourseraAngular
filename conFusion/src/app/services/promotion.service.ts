import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import {  map, catchError } from 'rxjs/operators';
import { Promotion } from '../shared/promotion';
import { PROMOTIONS } from '../shared/promotions';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseURL } from '../shared/baseurl';
import { ProcessHTTPMsgService } from './process-httpmsg.service';

@Injectable({
  providedIn: 'root'
})
export class PromotionService {

  constructor(private http: HttpClient,
    private processHTTPMsgService: ProcessHTTPMsgService) { }

  getPromotions(): Observable<Promotion[]>{
    return this.http.get<Promotion[]>(baseURL + "promotions")
    .pipe(catchError(this.processHTTPMsgService.handleError))
  }
  // getPromotions(): Observable<Promotion[]> {
  //   return of(PROMOTIONS).pipe(delay(2000));
  // }

  getPromotion(id: string): Observable< Promotion> {
    return this.http.get<Promotion>(baseURL + "promotions" + id)
    .pipe(catchError(this.processHTTPMsgService.handleError))
    // return of(PROMOTIONS.filter((promotion) => (promotion.id === id))[0]).pipe(delay(2000));
  }

  getFeaturedPromotion(): Observable<Promotion> {
    return this.http.get<Promotion[]>(baseURL + 'promotions?Featured=true')
    .pipe(map(promo => promo[0]))
    .pipe(catchError(this.processHTTPMsgService.handleError))
    // return of(PROMOTIONS.filter((promotion) => promotion.featured)[0]).pipe(delay(2000));
  }
}
