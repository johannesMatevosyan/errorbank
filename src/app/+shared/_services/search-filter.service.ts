import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {PostModel} from "@models/post.model";
import {HttpClient} from "@angular/common/http";
import {environment} from "@env/environment";

const BACKEND_URL = environment.apiUrl + '/posts';

@Injectable({
  providedIn: 'root'
})
export class SearchFilterService {
  postsPerPage = 2;
  currentPage = 1;
  query = {
    filter: {
      tags : [],
    },
    pagination : {
      pagesize: this.postsPerPage,
      page: this.currentPage
    }
  };
  searchData: any;
  tagSource = new BehaviorSubject(this.searchData);
  searchSource = new BehaviorSubject(this.searchData);
  searchKey = this.searchSource.asObservable();

  constructor(private http: HttpClient) { }

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

    this.query.filter.tags = searchData;
    this.http.post(BACKEND_URL, this.query)
      .subscribe((searchResponse: any) => {
        this.tagSource.next(tagArr);
        this.searchSource.next(searchResponse);
      });
  }

}
