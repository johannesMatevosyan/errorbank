import {Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter} from '@angular/core';
import {SearchFilterService} from "@app/+shared/_services/search-filter.service";

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.css']
})
export class TagComponent implements OnInit, OnChanges {
  @Input() tagsArray;
  @Input() removable : boolean;
  @Output() filteredTags = new EventEmitter<Array<object>>();
  @Output() sendTagObjects = new EventEmitter<Array<object>>();
  tags = [];
  constructor(private sfService: SearchFilterService) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
  }

  removeTag(tag: any) {
    this.tagsArray = this.tagsArray.filter(item => item.label !== tag.label);
    this.filteredTags.emit(this.tagsArray);
  }

  getTag(tag) {
    console.log('tag : ', tag);
    this.sfService.searchByTag(tag);
  }
}
