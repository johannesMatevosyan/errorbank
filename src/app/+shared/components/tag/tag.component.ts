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
  @Output() removeTagFromList = new EventEmitter<Array<object>>();
  @Output() sendTagObjects = new EventEmitter<Array<object>>();
  tags = [];
  constructor(private sfService: SearchFilterService) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
  }

  removeTag(tag: any) {

    let clonedTagArray = [...this.tagsArray];
    let arrayToSend = clonedTagArray.filter(item => item.label !== tag.label);
    this.sfService.searchByTag(arrayToSend);
    this.tagsArray.push(tag);
    this.removeTagFromList.emit(this.tagsArray);
  }

  filterByTag(tagObj) {
    console.log('tagId :', tagObj);
    this.tagsArray = this.tagsArray.filter( obj => obj.id !== tagObj.id );
    this.tags.push(tagObj);
    this.sfService.searchByTag(this.tags);
  }
}
