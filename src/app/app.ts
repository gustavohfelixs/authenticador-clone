import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { NewsletterService } from './newsletter.service';
import { env } from 'node:process';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  protected readonly title = signal('angular-pwa-app');
  readonly VAPID_PUBLIC_KEY: string =
    'BLg6rMKpps5FY-TrO3donb02BaD8JE_oE7099CF1NcAI8jCEWH_A0Rxsx_-m3bP3_6QkKljvADYmFOj2aQW9JsU';
  constructor(
    private swUpdate: SwUpdate,
    private swPush: SwPush,
    private newsletterService: NewsletterService
  ) {}

  ngOnInit(): void {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.checkForUpdate().then((res) => {
        if (res) {
          if (confirm('New version available. Load New Version?')) {
            window.location.reload();
          }
        }
      });
    }
  }

  subscribeToNotifications() {
    this.swPush
      .requestSubscription({ serverPublicKey: this.VAPID_PUBLIC_KEY })
      .then((sub) => this.newsletterService.addPushSubscriber(sub).subscribe())
      .catch((err) => console.error('Could not subscribe to notifications', err));
  }
}
