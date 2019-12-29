import {Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter} from '@angular/core';
import {SearchFilterService} from "@app/+shared/_services/search-filter.service";
import {Router} from '@angular/router';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.css']
})
export class TagComponent implements OnInit {
  @Input() singleTag;
  @Input() removable : boolean;
  @Output() removeTagFromList = new EventEmitter<Array<object>>();
  @Output() addTagToList = new EventEmitter<any>();
  tags = [];

  constructor(private sfService: SearchFilterService, private router: Router) { }

  ngOnInit() {
  }

  addTag(tagObj) {
    this.addTagToList.emit(tagObj);
    this.sfService.searchByTag(tagObj);
    this.router.navigate(['/posts']);
  }

  removeTag(tagObj) {
    this.removeTagFromList.emit(tagObj);
  }
}
