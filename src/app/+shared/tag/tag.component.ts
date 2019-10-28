import {Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.css']
})
export class TagComponent implements OnInit, OnChanges {
  @Input() tagName;
  @Output() outputFilteredTags = new EventEmitter<Array<string>>();
  tags = [];
  constructor() { }

  ngOnInit() {
  }
  ngOnChanges(changes: SimpleChanges) {
    if(this.tagName){
      this.tags.push(this.tagName);
    }

  }
  removeTag(tagName:string) {
    this.tags = this.tags.filter(item => item !== tagName);
    this.outputFilteredTags.emit(this.tags);
  }
}
