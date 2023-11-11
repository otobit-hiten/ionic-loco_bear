import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { AddPlayerComponent } from '../add-player/add-player.component';
import { Player } from '../player';
import { PreferenceService } from '../preference.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class GamePage implements OnInit {

  public gameName:string='';

  constructor(private modalController: ModalController, private shared: PreferenceService, private route:ActivatedRoute) {
    this.gameName =this.route.snapshot.params.gameName;
    console.log(this.route.snapshot.params.gameName)
   }
  public playerKeys: string[] = []
  player: Player[] = []
  ngOnInit() {
    this.getPlayerKey()
  }
  async getPlayerKey() {
    await this.shared.getPlayerKey('player').then((res) => {
      let key: string[] = JSON.parse(res!)
      this.playerKeys = key
    })
    this.getPlayerList()
  }

  getPlayerList() {
    if (this.playerKeys !== null) {
      for (var data of this.playerKeys) {
        this.shared.getPlayer(data).then((res) => {
          console.log(res)
          let player: Player = JSON.parse(res!)
          this.player.push(player)
        })
      }
    }

    return this.player
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
        if (data === null) {
          key.push(player.id)
        } else {
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
        console.log(data!, "Key")
      })
    });
    return await modal.present();
  }
}
