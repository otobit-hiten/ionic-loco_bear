import { LandingScreenService } from './landing-screen.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { Device } from '@capacitor/device';
import { Router } from '@angular/router';
@Component({
  selector: 'app-landing-screen',
  templateUrl: './landing-screen.page.html',
  styleUrls: ['./landing-screen.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class LandingScreenPage implements OnInit {

  public listData: any[] = [];
  public deviceId = '';
  public gameData: any;
  public deviceName: string = '';
  public orgSet: boolean = false;
  public gameSet: boolean = false;

  constructor(private LandingScreenService: LandingScreenService, private toastController: ToastController, private route: Router) { }

  ngOnInit() {
    this.callOrganisation()
  }
  async callOrganisation() {
    var a: string = '';
    await Device.getId().then(data => {
      this.deviceId = data.identifier
    })
    console.log(this.deviceId)
    this.LandingScreenService.checkOrganisation(this.deviceId).subscribe(response => {
      console.log(response)
      if (response.OId === 0) {
        this.LandingScreenService.getOrganisationData().subscribe(response => {
          var list = response.Records
          this.listData = list
        })
      } else {
        this.orgSet = true;
        if (response.template_ByGames === null) {
          this.gameSet = false
        } else {
          this.gameSet = true;
          this.gameData = response.template_ByGames;
          switch (this.gameData.ForGame.Id) {
            case 503: this.route.navigate(['/laser'],{queryParams :this.gameData}); break;
            case 504: this.route.navigate(['/game','Cricket']); break;
            case 505: this.route.navigate(['/game','Bowling']); break;
            case 506: this.route.navigate(['/game','Go Karting']); break;
            case 507: this.route.navigate(['/game','Shooting']); break;
          }
        }
      }
    })
  }
  async setOrg(id: string) {
    if ((this.deviceName) === '') {
      this.presentToast()
    } else {
      const requestData = {
        "OId": id,
        "UniqueId": this.deviceId,
        "DeviceName": this.deviceName
      };
      this.LandingScreenService.setOrganisationData(requestData).subscribe(data => {

        // this.route.navigateByUrl('/laser', { replaceUrl: true })
      })
    }
  }
  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Please enter device name',
      duration: 1500,
      position: 'bottom',
    });

    await toast.present();
  }
}
