import { Injectable } from '@angular/core';
import { KeysResult, Preferences } from '@capacitor/preferences';
import { Player } from './player';



@Injectable({
  providedIn: 'root'
})
export class PreferenceService {

  constructor() { }
  savePlayer = async (_key:string, _value:string) => {
    await Preferences.set({
      key: _key,
      value: _value,
    });
  };

  savePlayerKey = async (_key:string,_value:string) => {
    await Preferences.set({
      key: _key,
      value: _value,
    });
  }

   getPlayer = async (_key:string) => {
    const { value } = await Preferences.get({ key: _key });
    return value
  };


  getPlayerKey = async (_key:string) => {
    const { value } = await Preferences.get({ key: _key });
    return value
  };

  key = async () => {
    const  value  = await Preferences.keys()
    return value
  }
}
