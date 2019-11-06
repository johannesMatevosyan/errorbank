import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/+shared/_services/auth.service';
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-github',
  templateUrl: './github.component.html',
  styleUrls: ['./github.component.css']
})
export class GithubComponent implements OnInit {

  constructor(private authService: AuthService, private route:ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      let code = params['code'];
      console.log('code : ', code); // Print the parameter to the console.
      this.authService.getGithubUser(code);
    });
  }

}
