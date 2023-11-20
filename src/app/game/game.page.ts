import { ActivatedRoute } from '@angular/router';
import { Component, NgZone, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { AddPlayerComponent } from '../add-player/add-player.component';
import { Player } from '../model/player';
import { PreferenceService } from '../services/preference.service';
import { ChangeDetectorRef } from '@angular/core';
import { ConnectionStatus, Network } from '@capacitor/network';
import { PluginListenerHandle } from '@capacitor/core';
import { LandingScreenService } from '../landing-screen/landing-screen.service';
import { AllocatePlayer, GameSlot } from '../model/allocate_player';
@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class GamePage implements OnInit {

  public gameName: string = '';
  status: boolean = false
  network: PluginListenerHandle | undefined;


  constructor(private landingScreenService: LandingScreenService, private ngZone: NgZone, private changeDetectorRef: ChangeDetectorRef, private modalController: ModalController, private shared: PreferenceService, private route: ActivatedRoute) {
    this.gameName = this.route.snapshot.params.gameName;
  }

  public playerKeys: string[] = []
  player: Player[] = []
  async ngOnInit() {
    this.network = await Network.addListener('networkStatusChange', status => {
      this.ngZone.run(() => {
        this.changeStatus(status);
      });
    });
    const status = await Network.getStatus();
    this.changeStatus(status);
    this.getPlayerKey()
  }
  changeStatus(status: ConnectionStatus) {
    this.status = status.connected;
  }

  ngOnDestroy(): void {
    if (this.network) {
      this.network.remove();
    }
  }

  async getPlayerKey() {
    this.playerKeys = []
    await this.shared.getPlayerKey('player').then((res) => {
      let key: string[] = JSON.parse(res!)
      this.playerKeys = key
    })
    this.getPlayerList()
  }

  async getPlayerList() {
    this.player = []
    if (this.playerKeys !== null) {
      for (var data of this.playerKeys) {
        await this.shared.getPlayer(data).then((res) => {
          let player: Player = JSON.parse(res!)
          this.player.push(player)
        })
      }
    }
    console.log(this.player, "Hiten")
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
    modal.onDidDismiss().then(async (data) => {
      const player: Player = {
        name: '',
        phone: 0,
        playerCount: 0,
        id: '',
        arrived: false,
        time: new Date()
      }
      let key: string[] = []
      player.name = data.data['field1']
      player.phone = data.data['field2']
      player.playerCount = data.data['field3']
      player.arrived = false
      player.time = new Date()
      player.id = "id" + Math.random().toString(16).slice(2)
      await this.shared.savePlayer(player.id, JSON.stringify(player))

      await this.shared.getPlayerKey('player').then((data) => {
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


      await this.shared.getPlayer(player.id).then((data) => {
        console.log(data!, "Player")
      })
      await this.shared.key().then((data) => {
        console.log(data!, "Key")
      })
      this.getPlayerKey()
      this.changeDetectorRef.detectChanges()
    });
    return await modal.present();
  }

  up(i: number) {

    console.log(this.player.length)
  }
  down(i: number) {
    console.log(this.player.length)
  }

  registerAndAllocatePlayer() {
   
    const data: AllocatePlayer = {
      OId: 0,
      UniqueId: '',
      DeviceName: '',
      GameSlots: []
    }

    for (let i = 0; i < this.player.length; i++) {
        data.GameSlots.push({
          GameTemplateId: 0,
          AllocatedAt: this.player[i].time,
          StartedAt: new Date(),
          PlayerDetail: []
        })
    }
    

    // this.landingScreenService.registerAndAllocatePlayer(data).subscribe(respose => {

    // });

    console.log(data)
  }
  
}
