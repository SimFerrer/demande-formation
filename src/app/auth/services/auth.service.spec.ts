import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UserService } from './user.service';
import { firstValueFrom, of } from 'rxjs';
import firebase from 'firebase/compat/app';

class MockAngularFireAuth {
    authState = of(null);  // Simule l'authentification de l'utilisateur
    createUserWithEmailAndPassword = jasmine.createSpy().and.returnValue(Promise.resolve({
        user: { uid: '123', email: 'test@test.com' }  
    }));
    signInWithEmailAndPassword = jasmine.createSpy().and.returnValue(Promise.resolve({}));
    signInWithPopup = jasmine.createSpy().and.returnValue(Promise.resolve({}));
    signOut = jasmine.createSpy().and.returnValue(Promise.resolve());
}

class MockUserService {
    createWithId = jasmine.createSpy().and.returnValue(Promise.resolve());
    getUserById = jasmine.createSpy().and.returnValue(of({ email: 'test@test.com', approvedByAdmin: true }));
}

describe('AuthService', () => {
    let service: AuthService;
    let mockAuthService: MockAngularFireAuth;
    let mockUserService: MockUserService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                AuthService,
                { provide: AngularFireAuth, useClass: MockAngularFireAuth },
                { provide: UserService, useClass: MockUserService }
            ]
        });
        service = TestBed.inject(AuthService);
        mockAuthService = TestBed.inject(AngularFireAuth) as any;
        mockUserService = TestBed.inject(UserService) as any;
    });

    it('should create a new user in database', async () => {
        const email = 'test@test.com';
        const credentials = { user: { uid: '123' } } as firebase.auth.UserCredential;

        await service.createUserInDatabase(email, credentials);

        expect(mockUserService.createWithId).toHaveBeenCalledWith(
            { email: 'test@test.com', approvedByAdmin: false, role: 'user' },
            '123'
        );
    });

    it('should sign up a new user', async () => {
        const email = 'test@test.com';
        const password = 'password';
        await service.signUp(email, password);

        expect(mockAuthService.createUserWithEmailAndPassword).toHaveBeenCalledWith(email, password);
    });

    it('should handle error when user is not approved by admin', async () => {
        mockUserService.getUserById = jasmine.createSpy().and.returnValue(of({ approvedByAdmin: false }));

        try {
            await firstValueFrom(service.isUserAuthorizedInDatabase$('123'));
        } catch (e) {
            if (e instanceof Error) {
                expect(e.message).toBe('Votre compte n\'a pas été approuvé. Veuillez contacter un Admin');
            } else {
                // Si ce n'est pas une erreur, le test échoue
                fail('Une erreur était attendue, mais un autre type d\'objet a été reçu');
            }
        }
    });
});
