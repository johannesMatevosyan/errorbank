import {Component, OnInit, Inject, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser, isPlatformServer} from '@angular/common';
import {AuthService} from '@app/+shared/_services/auth.service';
import {Subscription} from 'rxjs/index';
import {map} from 'rxjs/operators';
import {SearchFilterService} from '@app/+shared/_services/search-filter.service';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NotificationModel} from '@models/notification.model';
import { NotificationService } from '@app/+profile/_services/notification.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  clientId = '8eee574d84d9fd8f73bd';
  message: string;
  profile: any;
  userIsAuthenticated = false;
  searchForm: FormGroup;
  authListenerSubs: Subscription;
  notificationsArr: NotificationModel[] = [];
  unreadNotifications = 0;
  isOpen = false;
  isDropdownOpen = false;
  constructor(private authService: AuthService,
              private router: Router,
              private fb: FormBuilder,
              private notificationService: NotificationService,
              private sfService: SearchFilterService, @Inject(PLATFORM_ID) private platformId: any) {}

  ngOnInit() {

    this.checkAuthenticationStatus();

    this.loadSearchForm();
    this.authListenerSubs = this.authService.userInfoDataStorage.subscribe(userData =>  {
      if (userData) {
        this.profile = userData;
      }

    });
    this.sfService.searchKey.subscribe(message => {
      this.message = message;
    });

    if (this.userIsAuthenticated) {
      this.notificationService.getNotifications();
    }

    this.notificationService
      .notificationsList
      .subscribe((res: NotificationModel[]) => {
        this.notificationsArr = res;

        this.unreadNotifications = this.notificationsArr.filter(item => {
          return item.checked === false;
        }).length;
      });
  }

  checkAuthenticationStatus() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });

    if (this.userIsAuthenticated) {
      if (isPlatformBrowser(this.platformId)) {
        // localStorage will be available: we can use it.
        console.log('Browser side');

        const userData = {
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

  hideDropdown() {
    this.isOpen = false;
  }

  onSubmit() {
    console.log('this.searchForm.value ', this.searchForm.value);
    this.sfService.searchByText(this.searchForm.value);
  }

  redirectTo(uri: string) {
    this.router.navigateByUrl('/', { skipLocationChange: true })
      .then(() =>
        this.router.navigate([uri])
      );
  }

  getNotifications() {
    this.notificationService.getNotifications();
  }

  toggleNotifications() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.getNotifications();
    }
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  hideNavigation() {
    this.isDropdownOpen = false;
  }

  onLogout() {
    this.authService.logout();
  }
}
