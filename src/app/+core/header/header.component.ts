import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import {isPlatformBrowser, isPlatformServer} from '@angular/common';
import { AuthService } from '@app/+shared/_services/auth.service';
import { Subscription } from 'rxjs/index';
import { SearchFilterService } from '@app/+shared/_services/search-filter.service';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NotificationModel} from '@models/notification.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  clientId: string = '8eee574d84d9fd8f73bd';
  message: string;
  profile: any;
  userIsAuthenticated = false;
  searchForm: FormGroup;
  authListenerSubs: Subscription;
  notificationsArr: NotificationModel[] = [];
  isOpen = false;
  constructor(private authService: AuthService,
              private router: Router,
              private fb: FormBuilder,
              private sfService: SearchFilterService, @Inject(PLATFORM_ID) private platformId: any) {}

  ngOnInit() {

    this.checkAuthenticationStatus();
    this.loadSearchForm();
    this.getNotifications();
    this.authListenerSubs = this.authService.userInfoDataStorage.subscribe(userData =>  {
      if (userData) {
        this.profile = userData;
      }

    });
    this.sfService.searchKey.subscribe(message => {
      this.message = message;
    });
  }

  checkAuthenticationStatus() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });

    if(this.userIsAuthenticated) {
      if (isPlatformBrowser(this.platformId)) {
        // localStorage will be available: we can use it.
        console.log('Browser side');

        let userData = {
          _id : localStorage.getItem('_id'),
          userId : localStorage.getItem('_id'),
          githubId : localStorage.getItem('githubId'),
          name : localStorage.getItem('name'),
          login : localStorage.getItem('login'),
        };
        this.profile = userData;
      }
      if (isPlatformServer(this.platformId)) {
        // localStorage will be null.
        console.log('Server side');
      }

    }
  }

  loadSearchForm() {

    this.searchForm = this.fb.group({
      searchItem: [''],
    });
  }

  onSubmit() {
    this.sfService.searchByText(this.searchForm.value)
  }

  redirectTo(uri:string){
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
      this.router.navigate([uri]));
  }

  getNotifications() {
    this.notificationsArr = [
      {
        userId: 'retdfgdfg51651s',
        postId: '26268484sadads1f2',
        postTitle: 'Rx Visualizer - Animated playground for Rx Observables',
        content: 'One remark: using Object.create() to create a "copy" of objects coming from an unbounded stream will produce an unbounded prototype chain',
        date: '29-12-2019',
        type: 'comment',
        checked: true,
      },
      {
        userId: 'retdfgdfg51651s',
        postId: '26268484sadads1f2',
        postTitle: 'okokookokok',
        content: 'Software is Changing the World. QCon empowers software development by facilitating the spread of knowledge and innovation in the developer community',
        date: '30-12-2019',
        type: 'comment',
        checked: false,
      },
      {
        userId: 'fdghghfgh3266',
        postId: 'tyuytu49hg4j94h',
        postTitle: 'RxEmber — an experimental set of helpers for Ember and RxJS',
        content: 'What Every Hipster Should Know About Functional Reactive Programming',
        date: '31-12-2019',
        type: 'comment',
        checked: false,
      },
      {
        userId: 'fdghghfgh3266',
        postId: 'tyuytu49hg4j94h',
        postTitle: 'RxEmber — an experimental set of helpers for Ember and RxJS',
        content: 'What Every Hipster Should Know About Functional Reactive Programming',
        date: '31-12-2019',
        type: 'comment',
        checked: true,
      },
      {
        userId: 'fdghghfgh3266',
        postId: 'tyuytu49hg4j94h',
        postTitle: 'RxEmber — an experimental set of helpers for Ember and RxJS',
        content: 'What Every Hipster Should Know About Functional Reactive Programming',
        date: '31-12-2019',
        type: 'comment',
        checked: false,
      },
      {
        userId: 'retdfgdfg51651s',
        postId: '26268484sadads1f2',
        postTitle: 'okokookokok',
        content: 'Software is Changing the World. QCon empowers software development by facilitating the spread of knowledge and innovation in the developer community',
        date: '30-12-2019',
        type: 'comment',
        checked: false,
      },
    ];
  }

  toggleNotifications() {
    this.isOpen = !this.isOpen;
  }

  onLogout() {
    this.authService.logout();
  }


}
