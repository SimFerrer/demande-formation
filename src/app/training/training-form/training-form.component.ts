import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import firebase from "firebase/compat/app";
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { DocumentReference } from '@angular/fire/compat/firestore';
import { Training, OriginStatus, TrainingStatus } from '../models/training.model';
import { BehaviorSubject, combineLatest, startWith, map, Observable, filter, tap, Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../auth/services/auth.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../shared/services/notification.service';
import { Action, ActionsSubject, Store } from '@ngrx/store';
import { addTraining, loadTraining, updateTraining } from '../store/training.actions';
import { User } from '../../auth/models/users.model';
import { getTraining } from '../store/training.selectors';
import { EntityService } from '../services/entity.service';
import { UserService } from '../../auth/services/user.service';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-training-form',
  templateUrl: './training-form.component.html',
  styleUrls: ['./training-form.component.scss']
})
export class TrainingFormComponent implements OnInit, OnDestroy {


  @Input() idTraining: string = "";

  trainingForm!: FormGroup;
  originOptions = Object.values(OriginStatus);
  statusOptions = Object.values(TrainingStatus);
  userId: string | null = null;

  filteredModules$!: Observable<string[]>;
  private moduleInput$ = new BehaviorSubject<string>('');

  filteredOrganisms$!: Observable<string[]>;
  private organismInput$ = new BehaviorSubject<string>('');

  userCreatedTraining$!: Observable<User>;
  user$: Observable<firebase.User | null> = this.authService.user$;

  private destroy$ = new Subject<void>();

  @ViewChild('trainingTitleRef') trainingTitleRef!: ElementRef;



  constructor(
    private fb: FormBuilder,
    private actions$: ActionsSubject,
    private authService: AuthService,
    private userService: UserService,
    private notificationService: NotificationService,
    private router: Router,
    private store: Store,
    private afs: AngularFirestore,
    private entityService: EntityService,
    private titleService: Title
  ) { }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.notificationService.clearMessage();
  }

  ngOnInit(): void {

    const SUCCESS_ACTIONS = ['[Training] Add Training Success', '[Training] Update Training Success'];

    this.actions$
      .pipe(
        filter((action: Action) => SUCCESS_ACTIONS.includes(action.type)),
        tap((action: Action) => {
          switch (action.type) {
            case '[Training] Add Training Success':
              this.notificationService.setMessage('Formation créée avec succès');
              this.resetForm();
              break;
            case '[Training] Update Training Success':
              this.notificationService.setMessage('Formation mise à jour avec succès');
              break;
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
          this.trainingTitleRef.nativeElement.focus();
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();

    this.initFormControls();
    this.authService.user$.pipe(
      tap((user) => {
        this.userId = user ? user.uid : null
      }),
      takeUntil(this.destroy$)
    ).subscribe();

    if (this.idTraining) {
      this.titleService.setTitle('Apsiformation - Modification d\'une formation')
      this.loadTrainingData();
    }
    else {
      this.titleService.setTitle('Apsiformation - Création d\'une formation')
    }

    this.manageAutocomplete();

  }


  private manageAutocomplete() {
    // Gestion de l'autocomplétion des modules
    this.filteredModules$ = combineLatest([
      this.entityService.getModules(),
      this.moduleInput$.pipe(startWith('')) // Valeur saisie dans le champ
    ]).pipe(
      map(([modules, input]) =>
        modules.filter(module => module.toLowerCase().includes(input.toLowerCase()))
      )
    );

    // Synchronise les changements de champ "module" avec le sujet `moduleInput$`
    this.trainingForm.get('module')?.valueChanges.subscribe((value) => {
      this.moduleInput$.next(value || '');
    });



    this.filteredOrganisms$ = combineLatest([
      this.entityService.getOrganisms(),
      this.organismInput$.pipe(startWith('')) // Valeur saisie dans le champ
    ]).pipe(
      map(([organisms, input]) =>
        organisms.filter(organism => organism.toLowerCase().includes(input.toLowerCase())),
        tap((organism) => console.log(organism))
      )
    );

    // Synchronise les changements de champ "organism" avec le sujet `organismInput$`
    this.trainingForm.get('organism')?.valueChanges.subscribe((value) => {
      this.organismInput$.next(value || '');
    });
  }

  private loadTrainingData(): void {

    this.store.dispatch(loadTraining({ trainingId: this.idTraining }));


    this.store.select(getTraining).pipe(
      tap((training: Training | null) => {
        if (training) {
          this.trainingForm.patchValue(training);
          this.trainingForm.get('name')?.disable();
          this.trainingForm.get('module')?.disable();
          this.trainingForm.get('origin')?.disable();

          this.userCreatedTraining$ = this.userService.getUserByRef(training.userId)
        }
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  private initFormControls(): void {
    this.trainingForm = this.fb.group({
      name: ['', Validators.required],
      module: ['', Validators.required],
      organism: ['', Validators.required],
      origin: ['', Validators.required],
      onAssignmentRequest: [false],
      comment: [''],
      status: [TrainingStatus.REQUESTED, Validators.required]
    });
  }

  private resetForm(): void {
    this.trainingForm.reset(
      {
        name: '',
        module: '',
        organism: '',
        origin: '',
        onAssignmentRequest: false,
        comment: '',
        status: TrainingStatus.REQUESTED
      },
      { emitEvent: false }
    );

    // Réinitialiser l'état de validation
    Object.keys(this.trainingForm.controls).forEach((key) => {
      const control = this.trainingForm.get(key);
      control?.setErrors(null);
      control?.markAsPristine();
      control?.markAsUntouched();
    });

    this.moduleInput$.next('');
    this.organismInput$.next('');
  }

  private generateId(): string {
    return crypto.randomUUID();
  }

  onSubmit(): void {
    this.notificationService.clearMessage();
    if (this.trainingForm.valid) {


      let training: Training = {
        ...this.trainingForm.value,
        id: this.idTraining || this.generateId(),
        updateDate: new Date(),
      };
      if (this.idTraining) {
        this.store.dispatch(updateTraining({ training }));
      } else {
        const userRef: DocumentReference<User> = this.afs.doc<User>(`users/${this.userId}`).ref;
        training = { ...training, requestDate: new Date(), userId: userRef, }
        this.store.dispatch(addTraining({ training: training, userID: this.userId! }));
      }


    } else {
      console.warn('Le formulaire n\'est pas valide.');
    }
  }



  onReturn() {
    this.router.navigateByUrl('/training/list')
  }
}
