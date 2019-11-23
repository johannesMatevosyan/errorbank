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
    console.log('this.tagsArray START :  ', this.tagsArray);
    // let filteredArray = this.tagsArray.splice(0);
    let clonedTagArray = [...this.tagsArray];
    console.log('filteredArray :  ', clonedTagArray);
    let arrayToSend = clonedTagArray.filter(item => item.label !== tag.label);
    console.log('arrayToSend : ', arrayToSend);
    this.sfService.searchByTag(arrayToSend);
    this.tagsArray.push(tag);
    console.log('this.tagsArray FINAL :  ', this.tagsArray);
    this.removeTagFromList.emit(this.tagsArray);
  }

  filterByTag(tagObj) {
    console.log('tagId :', tagObj);
    this.tagsArray = this.tagsArray.filter( obj => obj.id !== tagObj.id );
    this.tags.push(tagObj);
    this.sfService.searchByTag(this.tags);
  }
}
