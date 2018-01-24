import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  value = 0;

  onChangeValue($event: CustomEvent) {
    console.log($event);
    const { value } = $event.detail;
    if (this.value !== value) {
      this.value = value;
    }
  }

}
