import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './landing.html',
  styleUrls: ['./landing.css']
})
export class Landing implements OnInit {

  pct = 0;

  ngOnInit() {
    setTimeout(() => {
      const t = setInterval(() => {
        this.pct = Math.min(this.pct + Math.floor(Math.random() * 3), 100);
        if (this.pct >= 100) { this.pct = 100; clearInterval(t); }
      }, 60);
    }, 800);
  }
}