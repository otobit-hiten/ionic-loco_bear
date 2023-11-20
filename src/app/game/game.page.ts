import { ActivatedRoute } from '@angular/router';
import { Component, NgZone, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { AddPlayerComponent } from '../add-player/add-player.component';
import { Player } from '../model/player';
import { PreferenceService } from '../services/preference.service';
import { ChangeDetectorRef } from '@angular/core';
import { ConnectionStatus, Network } from '@capacitor/network';
import { PluginListenerHandle } from '@capacitor/core';
import { LandingScreenService } from '../landing-screen/landing-screen.service';
import { AllocatePlayer, GameSlot } from '../model/allocate_player';
import { Device } from '@capacitor/device';
import { HttpErrorResponse } from '@angular/common/http';
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
  time:number = 0
  displayTime = ""
  deviceInfo: any
  constructor(private toastController: ToastController,private landingScreenService: LandingScreenService, private ngZone: NgZone, private changeDetectorRef: ChangeDetectorRef, private modalController: ModalController, private shared: PreferenceService, private route: ActivatedRoute) {
    this.gameName = this.route.snapshot.params.gameName;
    this.minToHourMin()
  }
  minToHourMin() {
    const minutes = this.time % 60;
    const hours = Math.floor(this.time / 60);
    this.displayTime = `${this.padTo2Digits(hours)}:${this.padTo2Digits(minutes)}`;
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
    await this.shared.getPlayerKey("device_info").then((data) => {
      this.deviceInfo = JSON.parse(data!)
      console.log(this.deviceInfo)
    })
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
    this.time = 0
    this.player.forEach((res)=>{
      this.time += 30
    })
    this.minToHourMin()
    this.updateWaitingTime()
    return this.player
  }
  updateWaitingTime() {
    let data : {} = {
      Time: this.time
    }
    this.landingScreenService.UpdateWaitingTime(this.deviceInfo.UniqueId, data).subscribe((response:any) => {
      console.log(response)
    })
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

  async registerAndAllocatePlayer(pos: number) {

 
    const data: AllocatePlayer = {
      OId: this.deviceInfo.OId,
      UniqueId: this.deviceInfo.UniqueId,
      GameSlots: []
    }
    data.GameSlots.push({
      GameTemplateId: this.deviceInfo.Template_ByGame.GameTemplateId,
      AllocatedAt: this.player[pos].time,
      StartedAt: new Date(),
      PlayerDetail: []
    })
    data.GameSlots[0].PlayerDetail.push({
      Name: this.player[pos].name,
      MobileNumber: this.player[pos].phone,
      PlayersCount: this.player[pos].playerCount,
      AllocatedAt: this.player[pos].time,
    })

    this.landingScreenService.setOrganisationData(data).subscribe(
      (response: any) => {
        if (response.Result === "success") {
          console.log(this.playerKeys)
          this.playerKeys.splice(pos,1)
          this.player.splice(pos,1)
          this.shared.savePlayerKey('player', JSON.stringify(this.playerKeys))
          this.getPlayerKey()
          this.presentToast("Success")
        } else {
          console.error("Unexpected response:", response);
          this.presentToast("Something went wrong..")
        }
      },
      (error: any) => {
        if (error instanceof HttpErrorResponse) {
          this.presentToast(error.status.toString()+""+error.message)
        } else {
          this.presentToast(error.status.toString())
        }
      }
    );
    console.log(data)
  }

  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 1500,
      position: 'bottom',
    });

    await toast.present();
  }

  add(){
    this.time += 15
    this.minToHourMin()
  }

  minus(){
    if(this.time > 0 ){
      this.time -= 15
      this.minToHourMin()
    }
  }
  padTo2Digits(num: number) {
    return num.toString().padStart(2, '0');
  }
}


