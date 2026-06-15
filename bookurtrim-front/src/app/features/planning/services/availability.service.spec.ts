import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';
import { AvailabilityService } from './availability.service';

describe('AvailabilityService', () => {
  let service: AvailabilityService;
  let controller: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AvailabilityService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(AvailabilityService);
    controller = TestBed.inject(HttpTestingController);
  });

  afterEach(() => controller.verify());

  it('crée le service', () => expect(service).toBeTruthy());

  it('getAvailabilities appelle le bon endpoint', () => {
    service.getAvailabilities(1).subscribe();
    const req = controller.expectOne(r => r.url.includes('/providers/1/availabilities'));
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('getAvailabilities ajoute le paramètre date si fourni', () => {
    service.getAvailabilities(1, '2026-06-10').subscribe();
    const req = controller.expectOne(r => r.url.includes('date=2026-06-10'));
    req.flush([]);
  });

  it('createBulkAvailabilities appelle POST /availabilities/bulk', () => {
    service.createBulkAvailabilities([
      { day_date: '2026-06-10', start_time: '09:00:00', end_time: '17:00:00', slot_type: 'work' },
    ]).subscribe();
    const req = controller.expectOne(r => r.url.includes('/availabilities/bulk'));
    expect(req.request.method).toBe('POST');
    req.flush([]);
  });

  it('deleteAvailability appelle DELETE /availabilities/:id', () => {
    service.deleteAvailability(42).subscribe();
    const req = controller.expectOne(r => r.url.includes('/availabilities/42'));
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
