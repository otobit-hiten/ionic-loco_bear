import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonicModule]
})
export class AppComponent {
  constructor(private platform: Platform) {}
  async ngOnInit() {
    console.log("back top");
    await this.platform.ready();
    console.log(this.platform.ready())
    this.platform.backButton.subscribeWithPriority(9999, () => {
      console.log("back");
      console.log(this.platform.platforms);
     });
  }
}
