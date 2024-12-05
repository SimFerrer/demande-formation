import { Component, OnInit, ViewChild } from '@angular/core';
import { Training } from '../models/training.model';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, map, tap } from 'rxjs';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { getLoading, getTrainings } from '../store/training.selectors';
import { loadTrainings } from '../store/training.actions';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-training-list',
  templateUrl: './training-list.component.html',
  styleUrls: ['./training-list.component.scss']
})
export class TrainingListComponent implements OnInit {



  trainings$!: Observable<Training[]>;   // Observable des formations
  loading$!: Observable<boolean>;

  // Colonnes à afficher dans le tableau
  displayedColumns: string[] = ['name', 'module', 'status', 'updateDate', 'actions'];
  dataSource: MatTableDataSource<Training> = new MatTableDataSource<Training>();

  constructor(private router: Router, private store: Store, private titleService:Title) { }

  ngOnInit(): void {
    this.initObservables();
    this.store.dispatch(loadTrainings());
    this.titleService.setTitle('Apsiformation - Liste des formation')
  }
  initObservables() {

    this.trainings$ = this.store.pipe(
      select(getTrainings),
    );

    this.trainings$.subscribe((trainings) => {
      this.dataSource.data = trainings;
    });
    this.loading$ = this.store.pipe(select(getLoading));
  }

  // Méthode pour afficher les détails
  viewDetails(id: string): void {
    this.router.navigateByUrl(`/training/edit/${id}`)
  }

  // Appliquer un filtre sur les champs name et module
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase(); // Valeur de la recherche
    this.dataSource.filterPredicate = (data: Training, filter: string) => {
      const searchStr = filter.toLowerCase();
      return data.name.toLowerCase().includes(searchStr) || data.module.toLowerCase().includes(searchStr) || data.status.toLowerCase().includes(searchStr); // Filtrage personnalisé
    };
    this.dataSource.filter = filterValue; // Appliquer le filtre
  }

  onAddTraining() {
    this.router.navigateByUrl('/training/create');
  }

  onReturn() {
    this.router.navigateByUrl('/training');
  }
}
