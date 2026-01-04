import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-notes-host',
  standalone: false,
  templateUrl: './notes-host.component.html',
  styleUrl: './notes-host.component.css'
})
export class NotesHostComponent implements OnInit {
  idMateria!: number;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.idMateria = Number(this.route.snapshot.paramMap.get('id'));
  }
}
