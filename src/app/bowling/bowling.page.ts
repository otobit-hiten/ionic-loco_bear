import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { AddPlayerComponent } from '../add-player/add-player.component';
import { Player } from '../player';
import { PreferenceService } from '../preference.service';

@Component({
  selector: 'app-bowling',
  templateUrl: './bowling.page.html',
  styleUrls: ['./bowling.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class BowlingPage implements OnInit {

  constructor(private modalController: ModalController, private shared: PreferenceService) { }
   public playerKeys: string[] = []
   player : Player[] = []
  ngOnInit() {
    this.getPlayerList()
  }
  getPlayerList(){
    this.shared.getPlayerKey('player').then((res) => {
      let key :string[] = JSON.parse(res!)
      this.playerKeys = key
    })

   
  }

  async openDialog() {
    this.playerKeys.forEach((data) => {
      this.shared.getPlayer(data).then((res) =>{
        console.log(res)
        let player :Player[] = JSON.parse(res!)
        this.player = player
      })
    })
    console.log(this.player)
    console.log(this.playerKeys)
    const modal = await this.modalController.create({
      component: AddPlayerComponent,
      componentProps: {
        field1: '',
        field2: '',
        field3: '',
      },
    });
    modal.onDidDismiss().then((data) => {
      const player: Player = {
        name: '',
        phone: 0,
        playerCount: 0,
        id: '',
        arrived: false
      }
      let key: string[] = []
      player.name = data.data['field1']
      player.phone = data.data['field2']
      player.playerCount = data.data['field3']
      player.arrived = false
      player.id = "id" + Math.random().toString(16).slice(2)
      this.shared.savePlayer(player.id, JSON.stringify(player))
      
      this.shared.getPlayerKey('player').then((data) => {
        if(data === null){
          key.push(player.id)
        }else{
          let aa = JSON.parse(data!)
          key = aa
          key.push(player.id)
        }
        console.log(key)
        this.shared.savePlayerKey('player', JSON.stringify(key))
      })
  
      
      this.shared.getPlayer(player.id).then((data) => {
        console.log(data!, "Player")
      })
      this.shared.key().then((data) => {
        console.log(data!,"Key")
      })
    });
    return await modal.present();
  }
}
