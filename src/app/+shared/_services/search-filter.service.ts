import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {PostModel} from "@models/post.model";
import {HttpClient} from "@angular/common/http";
import {environment} from "@env/environment";

const BACKEND_URL = environment.apiUrl + '/search/';

@Injectable({
  providedIn: 'root'
})
export class SearchFilterService {

  searchData: any;
  constructor(private http: HttpClient) { }

  tagSource = new BehaviorSubject(this.searchData);
  searchSource = new BehaviorSubject(this.searchData);
  searchKey = this.searchSource.asObservable();

  changeSearch(searchText: string) {
    this.http.post(BACKEND_URL, {key: searchText})
      .subscribe((searchResponse: any) => {
        this.searchSource.next(searchResponse);
      });

  }

  searchByTag(tagArr) {
    console.log('tagArr : ', tagArr);
    let searchData = tagArr.map((item) => {
      return item.id;
    });
    console.log('searchData' , searchData);
    let searchDataObj = { tags : searchData };
    this.http.post(BACKEND_URL + 'tag-name', searchDataObj)
      .subscribe((searchResponse: any) => {
        this.tagSource.next(tagArr);
        console.log(' *** searchResponse ', searchResponse);
        this.searchSource.next(searchResponse);
      });
  }
}
