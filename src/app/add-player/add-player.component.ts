import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ModalController } from '@ionic/angular';


@Component({
  selector: 'app-add-player',
  templateUrl: './add-player.component.html',
  styleUrls: ['./add-player.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class AddPlayerComponent  implements OnInit {
  @Input() name: string = '';
  @Input() number: number | undefined;
  @Input() count: number | undefined;

  constructor(private modalController: ModalController) { }

  ngOnInit() {}

  cancel(){
    this.modalController.dismiss();
  }
  save(){
    const data = {
      field1: this.name,
      field2: this.number,
      field3: this.count,
    };
    console.log(data)
    this.modalController.dismiss(data);

  }

}
