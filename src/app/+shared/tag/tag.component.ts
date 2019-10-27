import {Component, Input, OnInit, OnChanges, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.css']
})
export class TagComponent implements OnInit, OnChanges {
  @Input() tagName;
  tags = [];
  constructor() { }

  ngOnInit() {
  }
  ngOnChanges(changes: SimpleChanges) {
    console.log(' >>>>>>>> tagName ', this.tagName);
    if(this.tagName){
      this.tags.push(this.tagName);
    }

  }
  removeTag(tagName) {
    console.log(' >>>>>>>> tagName ', tagName);
  }
}
