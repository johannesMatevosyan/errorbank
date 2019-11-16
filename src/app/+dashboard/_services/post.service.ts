import { Injectable } from '@angular/core';
import { PostModel } from '@models/post.model';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import {Router} from "@angular/router";
import {TagModel} from "@models/tag.model";

@Injectable({
  providedIn: 'root'
})
export class PostService {
  posts = [];
  tagsArray = [];
  tagsSubject = new Subject<TagModel[]>();
  postsSubject = new Subject<PostModel[]>();

  constructor(private http: HttpClient, private router: Router) { }

  getAll(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http.get<{posts: PostModel[]; tagsArray: TagModel[]; maxPosts: number}>('http://localhost:3000/posts/get-all' + queryParams)
      .pipe(
        map(postData => {
          console.log(' :::::: postData :::::: ', postData);
          return {
            posts: postData.posts.map(post => {
              return {
                id: post._id,
                title: post.title,
                content: post.content,
                imagePath: post.imagePath,
                created: post.created,
                authorId: post.authorId,
              };
            }),
            tagsArray : postData.tagsArray,
            // tagsArray : postData.tagsArray.map(item => {
            //   let orderedTags = { id : item._id, label: item.label };
            //   this.tagsArray = item.slice(0);
            //   this.tagsSubject.next(orderedTags);
            //   return orderedTags;
            // }),


            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe((transformedPostData) => {

        this.posts = transformedPostData.posts.slice(0);
        this.postsSubject.next(transformedPostData.posts);
      });
  }

  create(post) {

    const postData = new FormData();
    postData.append('title', post.title);
    postData.append('content', post.content);
    postData.append('image', post.image);
    postData.append('created', post.created);
    postData.append('updated', post.updated);
    postData.append('tagsArray', JSON.stringify(post.tagsArray));

    this.http.post<PostModel[]>('http://localhost:3000/posts/create', postData)
      .subscribe((responseData) => {
        this.posts.push(post);
        this.postsSubject.next(responseData);
      });
  }

  getPostById(postId: string) {
    this.http.get<{post: PostModel[]}>('http://localhost:3000/posts/get-id/' + postId)
      .subscribe((responseData) => {
        this.postsSubject.next(responseData.post);
      });
  }

  updatePostById(postId, post) {
    console.log('update : ', post);

    const postData = new FormData();
    postData.append('title', post.title);
    postData.append('content', post.content);
    postData.append('image', post.image);
    postData.append('created', post.created);
    postData.append('updated', post.updated);
    postData.append('tagsArray', JSON.stringify(post.tagsArray));

    this.http.put<{post: PostModel[]}>('http://localhost:3000/posts/update/' + postId, postData)
      .subscribe((responseData) => {
        this.router.navigate(['/get-all']);
      });
  }

  delete(postId: string) {
    this.http.delete('http://localhost:3000/posts/delete/' + postId)
      .subscribe(() => {
        const updatedPosts = this.posts.filter(obj => {
          return obj._id !== postId;
        });
        this.postsSubject.next(updatedPosts);
      });
  }

  // getTags() {
  //   this.http.get<{tagsArray: TagModel[]}>('http://localhost:3000/tags/get-all-tags')
  //     .subscribe((responseData) => {
  //       const orderTagsArray = responseData.tagsArray.map(item => {
  //         return { id : item._id, label: item.label }
  //       });
  //       this.tagsArray = orderTagsArray.slice(0);
  //       this.tagsSubject.next(orderTagsArray);
  //     });
  // }

}
