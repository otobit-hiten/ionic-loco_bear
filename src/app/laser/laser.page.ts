import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { AddPlayerComponent } from '../add-player/add-player.component';
import { ActivatedRoute } from '@angular/router';
import { PluginListenerHandle } from '@capacitor/core';
import { ConnectionStatus, Network } from '@capacitor/network';
import { PreferenceService } from '../services/preference.service';
import { Player } from '../model/player';
import { LandingScreenService } from '../landing-screen/landing-screen.service';
import { Slot } from '../model/slot';
import { HttpErrorResponse } from '@angular/common/http';
import { AllocatePlayer } from '../model/allocate_player';

@Component({
  selector: 'app-laser',
  templateUrl: './laser.page.html',
  styleUrls: ['./laser.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class LaserPage implements OnInit {
  status: boolean = false
  network: PluginListenerHandle | undefined;
  public gameName: any;
  deviceInfo: any;
  public playerKeys: string[] = []
  player: Player[] = []
  public slotKeys: string[] = []
  slots: Slot[] = []
  approxTime: number = 0
  approxTimeToDisplay = ""
  dialogTime: number = 0
  dialogTimeToDisplay = ""
  isModalOpen = false;
  canDismiss = false;
  gameDuration = '';
  playerCount = '';
  gameTemplateId = 0;

  constructor(private toastController: ToastController, private modalController: ModalController, private activatedRoute: ActivatedRoute, private ngZone: NgZone, private shared: PreferenceService, private landingScreenService: LandingScreenService, private changeDetectorRef: ChangeDetectorRef) {
    this.gameName = this.activatedRoute.snapshot.params.gameName;
  }

  async ngOnInit() {
    this.network = await Network.addListener('networkStatusChange', status => {
      this.ngZone.run(() => {
        this.changeStatus(status);
      });
    });
    const status = await Network.getStatus();
    this.changeStatus(status);
    await this.shared.getPlayerKey("device_info").then((data) => {
      this.deviceInfo = JSON.parse(data!)
      this.gameDuration = this.deviceInfo.Template_ByGame.GameDuration;
      this.playerCount = this.deviceInfo.Template_ByGame.MaxPlayer;
      this.gameTemplateId = this.deviceInfo.Template_ByGame.GameTemplateId;
    })

    this.getPlayerKey()
    this.getSlotKey()
  }
  async openDialog(position: number, id: string) {
    console.log("dialog opened")
    const modal = await this.modalController.create({
      showBackdrop: true,
      backdropDismiss: false,
      component: AddPlayerComponent,
      componentProps: {
        field1: '',
        field2: '',
        field3: '',
      },
    });
    modal.onDidDismiss().then(async (data) => {
      console.log("dialog closed")
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
      console.log("player added")
      console.log(player)
      await this.shared.savePlayer(player.id, JSON.stringify(player))
      await this.shared.getPlayerKey('player').then((data) => {
        if (data === null) {
          key.push(player.id)
        } else {
          let aa = JSON.parse(data!)
          key = aa
          key.push(player.id)
        }
        console.log("player keys saved")
        console.log(key)
        this.shared.savePlayerKey('player', JSON.stringify(key))
      })
      this.getPlayerKey()
      await this.shared.getPlayerKey('slots').then((data: string | null) => {
        let slotKeyDelete: string[] = JSON.parse(data!)
        console.log("slot data")
        console.log(slotKeyDelete)
        if (slotKeyDelete !== null) {
          for (var dataItem of slotKeyDelete) {
            if (dataItem == id) {
              this.shared.getPlayerKey(id).then((data) => {
                var slotHere: Slot = JSON.parse(data!)
                console.log(slotHere)
                slotHere.players.push(player.id)
                console.log("changed player")
                console.log(slotHere)
                this.shared.savePlayerKey(id, JSON.stringify(slotHere))
              });
            }
          }
        }
      })
      this.getPlayerKey()
      this.getSlotKey()
      this.changeDetectorRef.detectChanges()
    });

    return await modal.present();
  }

  async createSlot() {
    const slot: Slot = {
      id: '',
      GameTemplateId: 0,
      AllocatedAt: new Date(),
      StartedAt: undefined,
      players: [],
      arrivedPlayers: 0,
      maxPlayer: this.deviceInfo.Template_ByGame.MaxPlayer,
      totalPlayers: 0
    }
    let key: string[] = []
    slot.id = "id" + Math.random().toString(16).slice(2);
    slot.GameTemplateId = this.gameTemplateId;
    await this.shared.savePlayerKey(slot.id, JSON.stringify(slot));
    await this.shared.getPlayerKey('slots').then((data) => {
      if (data === null) {
        key.push(slot.id);
      } else {
        let vari = JSON.parse(data!)
        key = vari;
        key.push(slot.id);
      }
      this.shared.savePlayerKey('slots', JSON.stringify(key))
    });
    this.getSlotKey()
  }
  changeStatus(status: ConnectionStatus) {
    this.status = status.connected;
  }

  ngOnDestroy(): void {
    if (this.network) {
      this.network.remove();
    }
  }
  async getSlotKey() {
    this.slotKeys = []
    await this.shared.getPlayerKey('slots').then((res) => {
      let key: string[] = JSON.parse(res!)
      this.slotKeys = key
    })
    this.getslotList()
  }
  async getslotList() {
    this.slots = []
    if (this.slotKeys !== null) {
      for (var data of this.slotKeys) {
        await this.shared.getPlayer(data).then((res) => {
          let slot: Slot = JSON.parse(res!)
          console.log("players")
          console.log(slot.players)
          this.slots.push(slot)
        })
      }
      this.approxTime = 0
      this.slotKeys.forEach(() => {
        this.approxTime += this.deviceInfo.Template_ByGame.GameDuration
      })
      this.updateWaitingTime()
      this.convertMinToHourAndMin()
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
  }
  updateWaitingTime() {
    let data: {} = {
      "Time": `${this.approxTime}`
    }

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
  async sendSlot(a: string) {
  }
  async addPlayerToSlot(position: number) {

  }
  async deleteSlot(position: number) {
    this.slotKeys.splice(position, 1)
    this.slots.splice(position, 1)
    this.shared.savePlayerKey('slots', JSON.stringify(this.slotKeys))
    this.getSlotKey()
    this.presentToast("Success")
  }
  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 1500,
      position: 'bottom',
      color: "danger"
    });
    await toast.present();
  }
   getPlayerName(id: string) {
    console.log("player name called")
    for(let i =0 ; i<this.player.length;i++){
      if(id==this.player[i].id){
        return this.player[i].name
      }
    }
    return ""
  }
   getPlayerNumber(id: string) {
    console.log("player number called")
    for(let i =0 ; i<this.player.length;i++){
      if(id==this.player[i].id){
        return this.player[i].phone
      }
    }
    return 0
  }
  getPlayerCount(id: string) {
    console.log("player name called")
    for(let i =0 ; i<this.player.length;i++){
      if(id==this.player[i].id){
        return this.player[i].playerCount
      }
    }
    return 0
  }
  getPlayerAllocatedTime(id: string) {
    console.log("player name called")
    for(let i =0 ; i<this.player.length;i++){
      if(id==this.player[i].id){
        return this.player[i].time
      }
    }
    return new Date()
  }
  async registerAndAllocatePlayer(pos: number) {
    const data: AllocatePlayer = {
      OId: this.deviceInfo.OId,
      UniqueId: this.deviceInfo.UniqueId,
      GameSlots: []
    }
    data.GameSlots.push({
      GameTemplateId: this.slots[pos].GameTemplateId,
      AllocatedAt: this.slots[pos].AllocatedAt,
      StartedAt: new Date(),
      PlayerDetail: []
    })
    this.slots[pos].players.forEach((dataHere)=>{
      data.GameSlots[0].PlayerDetail.push({
        Name: this.getPlayerName(dataHere),
        MobileNumber: this.getPlayerNumber(dataHere),
        PlayersCount: this.getPlayerCount(dataHere),
        AllocatedAt: this.getPlayerAllocatedTime(dataHere),
      })
    })
    this.landingScreenService.setOrganisationData(data).subscribe((response: any) => {
      console.log(response)
      if (response.Result === "success") {
        console.log(this.playerKeys)
        this.slotKeys.splice(pos, 1)
        this.slots.splice(pos, 1)
        this.shared.savePlayerKey('slots', JSON.stringify(this.slotKeys))
        this.getSlotKey()
        this.getPlayerKey()
        this.presentToast("Success")
      } else {
        console.error("Unexpected response:", response);
        this.presentToast("Something went wrong..")
      }
    },
      (error: any) => {
        if (error instanceof HttpErrorResponse) {
          this.presentToast(error.status.toString() + "" + error.message)
        } else {
          this.presentToast(error.status.toString())
        }
      })
    console.log(data)
  }
}
