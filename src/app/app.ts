import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { NewsletterService } from './newsletter.service';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  protected readonly title = signal('angular-pwa-app');
  readonly VAPID_PUBLIC_KEY =
    'BGVnbQKNgqqMWiwUwjOVJwhDU2aa7Wu62f29NUjMuOU81Z2Fib4-J46iD2Wq3PGC3pju-WtRoeoN61TicOQD-I8';
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
      .then((sub) => console.log(sub))
      .catch((err) => console.error('Could not subscribe to notifications', err));
    // .then((sub) => this.newsletterService.addPushSubscriber(sub).subscribe())
    // .catch((err) => console.error('Could not subscribe to notifications', err));
  }
}
