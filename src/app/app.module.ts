import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';
import { KeyboardComponent } from './keyboard/keyboard.component';
import { PianoService } from './core/piano.service';
import { SoundService } from './core/sound.service';
import { SafePipe } from './shared/safe.pipe';
import {NotationComponent} from './notation/notation.component';
import {NotationService} from './notation/notation.service';

@NgModule({
  declarations: [
    AppComponent,
    KeyboardComponent,
    NotationComponent,
    SafePipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule
  ],
  providers: [
    PianoService,
    SoundService,
    NotationService
  ],
  exports: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
