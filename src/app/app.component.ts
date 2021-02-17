import {Component, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';


import {PianoService} from './core/piano.service';
import {SoundService} from './core/sound.service';

import {PianoNote} from './core/piano-note';
import {PianoMode} from './core/piano-mode.enum';
import {NotationComponent} from './notation/notation.component';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  PianoMode = PianoMode; // allows template access to PianoMode enum
  title: string = 'MELODY GENERATOR';
  mode: PianoMode = PianoMode.Play;
  subscription: Subscription;


  private currentTestNote: PianoNote;
  private timeoutId: any;
  private delayMs = 1000;

  @ViewChild(NotationComponent, {static: false}) notation: NotationComponent;

  constructor(
    private pianoService: PianoService,
    private soundService: SoundService) {
    this.subscription = pianoService.notePlayed$.subscribe(note => this.handleNotePlayed(note));
  }

  ngOnInit() {
    this.mode = PianoMode.Play;
    this.soundService.initialize();
  }

  handleModeSelected(selectedMode: PianoMode) {
    if (this.mode == selectedMode) {
      return;
    }

    // Mode has been changed
    this.mode = selectedMode;
    if (this.mode == PianoMode.Quiz) {
      this.newQuiz();
    } else {
      // Clear all notes from the notation component
      this.notation.clear();
    }
  }

  handleKeyPlayed(keyId: number) {
    if (this.mode === PianoMode.Play) {
      this.pianoService.playNoteByKeyId(keyId);
    } else {
      this.soundService.playNote(keyId);

      this.currentTestNote = this.pianoService.getNoteByKeyId(keyId);
      this.notation.addNote(this.currentTestNote);
    }
  }

  handleNotePlayed(note: PianoNote) {
    this.soundService.playNote(note.keyId);
  }

  private newQuiz() {
    this.notation.clear();
  }

  private handleClearNotation(object: any) {
    if (this.notation) {
      this.notation.clear();
    }
  }
}
