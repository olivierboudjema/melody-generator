import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';

import {IPianoKey} from './ipiano-key';
import {Key} from '../models/key';
import {NotationService} from '../notation/notation.service';

@Component({
  selector: 'keyboard',
  templateUrl: './keyboard.component.html',
  styleUrls: ['./keyboard.component.css']
})
export class KeyboardComponent implements OnInit {
  @Output() keyPlayed = new EventEmitter<number>();
  @Output() clearKeyArrayEmitter = new EventEmitter<number>();

  selectedBpm = 120;
  selectedNbOfKeys = 15;
  selectedStartKey = {id: 40, name: 'C2'};

  randomKey = 40;
  keyArray: Key[] = [];
  keyName: { [key: number]: string } =
    {
      16: 'C0', 17: 'C#0', 18: 'D0', 19: 'D#0', 20: 'E0', 21: 'F0', 22: 'F#0', 23: 'G0', 24: 'G#0', 25: 'A0', 26: 'A#0', 27: 'B0',
      28: 'C1', 29: 'C#1', 30: 'D1', 31: 'D#1', 32: 'E1', 33: 'F1', 34: 'F#1', 35: 'G1', 36: 'G#1', 37: 'A1', 38: 'A#1', 39: 'B1',
      40: 'C2', 41: 'C#2', 42: 'D2', 43: 'D#2', 44: 'E2', 45: 'F2', 46: 'F#2', 47: 'G2', 48: 'G#2', 49: 'A2', 50: 'A#2', 51: 'B2',
      52: 'C3', 53: 'C#3', 54: 'D3', 55: 'D#3', 56: 'E3', 57: 'F3', 58: 'F#3', 59: 'G3', 60: 'G#3', 61: 'A3', 62: 'A#2', 63: 'B3',
      64: 'C4',
    };

  keyNameArray: Key[] = [
    {id: 16, name: 'C0'}, {id: 18, name: 'D0'}, {id: 20, name: 'E0'}, {id: 21, name: 'F0'}, {id: 23, name: 'G0'}, {id: 25, name: 'A0'}, {id: 27, name: 'B0'},
    {id: 28, name: 'C1'}, {id: 30, name: 'D1'}, {id: 32, name: 'E1'}, {id: 33, name: 'F1'}, {id: 35, name: 'G1'}, {id: 37, name: 'A1'}, {id: 39, name: 'B1'},
    {id: 40, name: 'C2'}, {id: 42, name: 'D2'}, {id: 44, name: 'E2'}, {id: 45, name: 'F2'}, {id: 47, name: 'G2'}, {id: 49, name: 'A2'}, {id: 51, name: 'B2'},
    {id: 52, name: 'C3'}, {id: 54, name: 'D3'}, {id: 56, name: 'E3'}, {id: 57, name: 'F3'}, {id: 59, name: 'G3'}, {id: 61, name: 'A3'}, {id: 63, name: 'B3'},
    {id: 64, name: 'C4'},
  ];


  blackKeys: number[] = [17, 19, 22, 24, 26, 29, 31, 34, 36, 38, 41, 43, 46, 48, 50, 53, 55, 58, 60, 62];

  pianoKeys: IPianoKey[];
  private highlightedKeyId = 0;

  constructor() {
    this.pianoKeys = [
      {whiteKeyId: 16},
      {whiteKeyId: 18, blackKeyId: 17},
      {whiteKeyId: 20, blackKeyId: 19},
      {whiteKeyId: 21},
      {whiteKeyId: 23, blackKeyId: 22},
      {whiteKeyId: 25, blackKeyId: 24},
      {whiteKeyId: 27, blackKeyId: 26},
      {whiteKeyId: 28},
      {whiteKeyId: 30, blackKeyId: 29},
      {whiteKeyId: 32, blackKeyId: 31},
      {whiteKeyId: 33},
      {whiteKeyId: 35, blackKeyId: 34},
      {whiteKeyId: 37, blackKeyId: 36},
      {whiteKeyId: 39, blackKeyId: 38},
      {whiteKeyId: 40},
      {whiteKeyId: 42, blackKeyId: 41},
      {whiteKeyId: 44, blackKeyId: 43},
      {whiteKeyId: 45},
      {whiteKeyId: 47, blackKeyId: 46},
      {whiteKeyId: 49, blackKeyId: 48},
      {whiteKeyId: 51, blackKeyId: 50},
      {whiteKeyId: 52},
      {whiteKeyId: 54, blackKeyId: 53},
      {whiteKeyId: 56, blackKeyId: 55},
      {whiteKeyId: 57},
      {whiteKeyId: 59, blackKeyId: 58},
      {whiteKeyId: 61, blackKeyId: 60},
      {whiteKeyId: 63, blackKeyId: 62},
      {whiteKeyId: 64}
    ];
  }

  ngOnInit() {
    this.playRandomKeys(this.selectedBpm, this.selectedNbOfKeys);
  }

  private playRandomKeys(nbBpm, nbOfKeys) {
    this.clearKeyArray();
    let i = 0;
    this.saveKeyInArray(this.selectedStartKey.id);
    const myLoopInterval = setInterval(() => {
      let condition = this.getRandomKey(this.randomKey);
      while (condition === false) {
        condition = this.getRandomKey(this.randomKey);
      }
      const key = this.pianoKeys.find(k => k.whiteKeyId === this.randomKey);
      this.keyPress(this.randomKey, key);
      i++;

      if (i > nbOfKeys) {
        clearInterval(myLoopInterval);
      }
    }, this.bpmToMs(nbBpm));
  }

  /// MELODY INTELLIGENCE ///

  private getRandomKey(nbMax: number) {
    this.randomKey = Math.floor(Math.random() * nbMax) + 16;
    return (this.isBlack(this.randomKey) && this.isCloseOfPrevious(this.randomKey) && this.isInPianoRange(this.randomKey));
  }

  private isCloseOfPrevious(nb: number): boolean {
    return (nb >= (this.lastKeyPlayed() - 3)) && (nb <= (this.lastKeyPlayed() + 3));
  }

  private isBlack(nb: number): boolean {
    return !this.blackKeys.includes(nb);
  }

  private isInPianoRange(nb: number): boolean {
    return ((nb >= 16) && (nb <= 64));
  }


  /// PIANO ///

  keyPress(keyNumber: number, key: IPianoKey) {
    this.keyPlayed.emit(keyNumber);
    this.saveKeyInArray(keyNumber);
    // key.status = !key.status;
    this.changeStatus(key);
  }

  getColor(keyId) {
    if (keyId === this.highlightedKeyId) {
      return '#f0e68c';
    } else {
      return '';
    }
  }

  changeStatus(key) {
    key.status = true;
    setTimeout(() => {
      key.status = false;
    }, 500);
  }

  /// CONFIG ///

  private bpmToMs(nbBpm) {
    return 60000 / nbBpm;
  }

  private lastKeyPlayed() {
    return this.keyArray[this.keyArray.length - 1].id;
  }

  private saveKeyInArray(key) {
    const myKey = {id: key, name: this.keyName[key]};
    this.keyArray.push(myKey);
  }

  private clearKeyArray() {
    this.clearKeyArrayEmitter.emit(10);
    this.keyArray = [];
  }
}
