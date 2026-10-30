import { PathLocationStrategy } from '@angular/common';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { describe, expect, it, vi } from 'vitest';
import { environment } from '../../environments/environment';
import { decksDict } from '../model/deck';
import NewGamePageComponent from './new-game-page.component';

describe('Creating a game', () => {
  it('sends the selected deck and opens the room returned by the backend', () => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    const navigate = vi.fn().mockResolvedValue(true);
    const page = new NewGamePageComponent(
      TestBed.inject(HttpClient),
      { navigate } as unknown as Router,
      { getBaseHref: () => '/poker/' } as PathLocationStrategy
    );
    page.onNewGame({ name: 'Sprint planning', deck: decksDict['FIBONACCI'] });
    const http = TestBed.inject(HttpTestingController);
    const request = http.expectOne(`${environment.backendRootOverride ?? '/poker/'}create`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ name: 'Sprint planning', deck: 'FIBONACCI' });
    expect(navigate).not.toHaveBeenCalled();
    request.flush('room-id-from-server');
    expect(navigate).toHaveBeenCalledWith(['game', 'room-id-from-server']);
    http.verify();
  });
});
