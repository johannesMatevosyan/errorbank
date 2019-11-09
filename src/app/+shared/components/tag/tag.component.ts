import {Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.css']
})
export class TagComponent implements OnInit, OnChanges {
  @Input() tagsArray;
  @Input() removable : boolean;
  @Output() filteredTags = new EventEmitter<Array<object>>();
  tags = [];
  constructor() { }

  ngOnInit() {
    console.log('ngOnInit ', this.tagsArray);
  }
  ngOnChanges(changes: SimpleChanges) {
    console.log('ngOnChanges ', this.tagsArray);
  }
  removeTag(tag: any) {

    this.tagsArray = this.tagsArray.filter(item => item.name !== tag.name);
    console.log('removeTag FINAL : ',   this.tagsArray);
    this.filteredTags.emit(this.tagsArray);
  }
}
