import { readFileSync, writeFileSync } from "fs";
import {join} from 'path';
import {app} from '@electron/remote';

export class Storage {
  static settings = {};

  static path = join(app.getPath('userData'), "settings.json");

  static get(key) {
    return this.settings[key];
  }

  static set(key, value) {
    this.settings[key] = value;
  }

  static save() {
    writeFileSync(this.path, JSON.stringify(this.settings));
  }
  static load() {
    try {
      this.settings = JSON.parse(readFileSync(this.path, "utf8"));
    } catch {}
  }
}
