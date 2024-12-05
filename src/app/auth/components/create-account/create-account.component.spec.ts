import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { CreateAccountComponent } from './create-account.component';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { SharedModule } from '../../../shared/shared.module';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

// Mock AuthService
const mockAuthService = {
  signUp: jasmine.createSpy('signUp').and.returnValue(Promise.resolve()),
};

// Mock NotificationService
const mockNotificationService = {
  setMessage: jasmine.createSpy('setMessage'),
};

// Mock Router
const mockRouter = {
  navigateByUrl: jasmine.createSpy('navigateByUrl'),
};

describe('CreateAccountComponent', () => {
  let component: CreateAccountComponent;
  let fixture: ComponentFixture<CreateAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateAccountComponent],
      imports: [ReactiveFormsModule, SharedModule], // Import du module de formulaires réactifs
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: Router, useValue: mockRouter },
        provideAnimationsAsync()
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should initialize the form with required controls and validators', () => {
    expect(component.createForm.contains('email')).toBeTrue();
    expect(component.createForm.contains('password')).toBeTrue();
    expect(component.createForm.contains('passwordConfirm')).toBeTrue();

    const emailCtrl = component.createForm.get('email');
    expect(emailCtrl?.validator).toBeTruthy();
    expect(emailCtrl?.hasError('required')).toBeTrue();
  });

  it('should validate email control correctly', () => {
    const emailCtrl = component.createForm.get('email');
    emailCtrl?.setValue('invalid-email');
    expect(emailCtrl?.hasError('email')).toBeTrue();

    emailCtrl?.setValue('');
    expect(emailCtrl?.hasError('required')).toBeTrue();
  });

  it('should return the correct error messages', () => {
    const emailCtrl = component.createForm.get('email');  
    emailCtrl?.setValue('');
    expect(component.getFormControlErrorText(emailCtrl!)).toBe('Ce champ est requis');
  
    emailCtrl?.setValue('invalid-email');
    expect(component.getFormControlErrorText(emailCtrl!)).toBe('Veuillez rentrer un e-mail au format jean.michel@apside.com');
  });

  it('should validate password confirmation correctly', () => {
    component.createForm.get('password')?.setValue('password123');
    component.createForm.get('passwordConfirm')?.setValue('password456');
    component.createForm.updateValueAndValidity();
    expect(component.createForm.hasError('PasswordNoMatch')).toBeTrue();
  });

  it('should call authService.signUp and navigate on successful account creation', () => {
    spyOn(component, 'goToLogin');
  
    component.createForm.setValue({
      email: 'test@test.com',
      password: 'password123',
      passwordConfirm: 'password123',
    });
  
    component.createAccount();
  
    expect(mockAuthService.signUp).toHaveBeenCalledWith('test@test.com', 'password123');
    mockAuthService.signUp().then(() => {
      expect(component.goToLogin).toHaveBeenCalled();
    });
  });

  it('should not submit the form if it is invalid', () => {
    component.createAccount();
    expect(mockAuthService.signUp).not.toHaveBeenCalled();
  });
  
  
});

