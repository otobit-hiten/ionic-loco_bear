import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { GamePage } from '../game/game.page';


@Component({
  selector: 'app-add-player',
  templateUrl: './add-player.component.html',
  styleUrls: ['./add-player.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class AddPlayerComponent implements OnInit {
  @Input() name: string = '';
  @Input()
  number: number | undefined;
  @Input()
  count: number | undefined;


  constructor(private modalController: ModalController, private toastController: ToastController) { }

  ngOnInit() { }

  cancel() {
    this.modalController.dismiss();
  }
  save() {
    if (this.name === '' || typeof this.number === "undefined" || typeof this.count === "undefined" ||  this.number === null ||  this.count === null) {
      this.presentToast("Please Provide All Details...")
    } else {
      const data = {
        field1: this.name,
        field2: this.number,
        field3: this.count,
      };
      console.log(data)
      this.modalController.dismiss(data);
    }
  }

  async presentToast(msg:string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 1500,
      position: 'bottom',
    });

    await toast.present();
  }
}
