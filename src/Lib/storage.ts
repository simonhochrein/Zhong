import { readFileSync, writeFileSync } from "fs";

export class Storage {
  static settings = {};

  static get(key) {
    return this.settings[key];
  }

  static set(key, value) {
    this.settings[key] = value;
  }

  static save() {
    writeFileSync("./settings.json", JSON.stringify(this.settings));
  }
  static load() {
    try {
      this.settings = JSON.parse(readFileSync("./settings.json", "utf8"));
    } catch {}
  }
}
