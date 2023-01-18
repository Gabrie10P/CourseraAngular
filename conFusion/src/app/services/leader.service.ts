import { Injectable, OnInit } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { Leader } from '../shared/leader';
import { LEADERS } from '../shared/leaders';
import {  map, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseURL } from '../shared/baseurl';
import { ProcessHTTPMsgService } from './process-httpmsg.service';
@Injectable({
  providedIn: 'root'
})
export class LeaderService{

  constructor(private http: HttpClient,
    private processHTTPMsgService: ProcessHTTPMsgService) { }

  getLeaders(): Observable<Leader[]>{
    return this.http.get<Leader[]>(baseURL + 'leadership')
    .pipe(catchError(this.processHTTPMsgService.handleError))
  }

  getFeaturedLeader(): Observable<Leader>{
    return this.http.get<Leader[]>(baseURL + 'leadership?Featured=true')
    .pipe(map(leader => leader[0]))
    .pipe(catchError(this.processHTTPMsgService.handleError))
  }
}
