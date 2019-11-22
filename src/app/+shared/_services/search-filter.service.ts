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
    let searchData = { tags : tagArr };
    this.http.post(BACKEND_URL + 'tag-name', searchData)
      .subscribe((searchResponse: any) => {
        this.searchSource.next(searchResponse);
      });
  }
}
