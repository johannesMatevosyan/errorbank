import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {PostModel} from "@models/post.model";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class SearchFilterService {

  searchData: any;
  constructor(private http: HttpClient) { }

  private searchSource = new BehaviorSubject(this.searchData);
  searchKey = this.searchSource.asObservable();

  changeSearch(searchText: string) {
    this.http.post('http://localhost:3000/search/', {key: searchText})
      .subscribe((searchResponse: any) => {
        this.searchSource.next(searchResponse);
      });

  }

  searchByTag(tagObj) {
    console.log('tagObj ', tagObj);
    this.http.post('http://localhost:3000/search/tag-name', tagObj)
      .subscribe((searchResponse: any) => {
        this.searchSource.next(searchResponse);
      });
  }
}
