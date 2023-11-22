import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { AddPlayerComponent } from '../add-player/add-player.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-laser',
  templateUrl: './laser.page.html',
  styleUrls: ['./laser.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class LaserPage implements OnInit {
  public gameData : any;

  public gameName : any;

  constructor(private modalController: ModalController,private activatedRoute : ActivatedRoute) {
    console.log(this.activatedRoute.snapshot.params)
    this.gameName=this.activatedRoute.snapshot.params.gameName;
    console.log(this.gameName)
    console.log("game name")

  }

  ngOnInit() {
    // this.activatedRoute.snapshot.queryParams.
  }
  async openDialog() {
    const modal = await this.modalController.create({
      component: AddPlayerComponent,
      componentProps: {
        field1: '',
        field2: '',
        field3: '',
      },
    });
    modal.onDidDismiss().then((data) => {
      if (data.role === 'ok') {
        // Handle the data from the dialog
        const { field1, field2, field3 } = data.data;
        // Perform further actions with the data
      }
      console.log(data)
    });

    return await modal.present();
  }


}
