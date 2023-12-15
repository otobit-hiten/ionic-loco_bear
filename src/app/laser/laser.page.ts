import { Component, NgZone, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { AddPlayerComponent } from '../add-player/add-player.component';
import { ActivatedRoute } from '@angular/router';
import { PluginListenerHandle } from '@capacitor/core';
import { ConnectionStatus, Network } from '@capacitor/network';
import { PreferenceService } from '../services/preference.service';
import { Player } from '../model/player';
import { LandingScreenService } from '../landing-screen/landing-screen.service';

@Component({
  selector: 'app-laser',
  templateUrl: './laser.page.html',
  styleUrls: ['./laser.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class LaserPage implements OnInit {
  public gameData: any;
  status: boolean = false
  network: PluginListenerHandle | undefined;
  public gameName: any;
  deviceInfo: any;
  public playerKeys: string[] = []
  player: Player[] = []
  approxTime: number = 0
  approxTimeToDisplay = ""
  dialogTime: number = 0
  dialogTimeToDisplay = ""
  isModalOpen = false;
  canDismiss = false;

  constructor(private modalController: ModalController, private activatedRoute: ActivatedRoute, private ngZone: NgZone, private shared: PreferenceService, private landingScreenService: LandingScreenService) {
    console.log(this.activatedRoute.snapshot.params)
    this.gameName = this.activatedRoute.snapshot.params.gameName;
    console.log(this.gameName)
    console.log("game name")

  }

  async ngOnInit() {
    // this.activatedRoute.snapshot.queryParams.
    this.network = await Network.addListener('networkStatusChange', status => {
      this.ngZone.run(() => {
        this.changeStatus(status);
      });
    });
    const status = await Network.getStatus();
    this.changeStatus(status);

    await this.shared.getPlayerKey("device_info").then((data) => {
      this.deviceInfo = JSON.parse(data!)
      console.log(this.deviceInfo)
    })
    this.getPlayerKey()
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
      this.approxTime = 0
      this.playerKeys.forEach(() => {
        this.approxTime += 30
      })
      this.updateWaitingTime()
      this.convertMinToHourAndMin()
    }
  }
  updateWaitingTime() {
    let data: {} = {
      "Time": `${this.approxTime}`
    }
    console.log(this.approxTime)
    this.landingScreenService.UpdateWaitingTime(this.deviceInfo.UniqueId, data).subscribe((response: any) => {
      console.log(response)
    })
  }
  convertMinToHourAndMin() {
    this.dialogTime = this.approxTime
    this.dialogTimeToDisplay = this.approxTimeToDisplay
    const minutes = this.approxTime % 60;
    const hours = Math.floor(this.approxTime / 60);
    this.approxTimeToDisplay = `${this.padTo2Digits(hours)}:${this.padTo2Digits(minutes)}`;
    this.dialogTimeToDisplay = `${this.padTo2Digits(hours)}:${this.padTo2Digits(minutes)}`;
  }
  padTo2Digits(num: number) {
    return num.toString().padStart(2, '0');
  }
}
