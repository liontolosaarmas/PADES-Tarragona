import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		redirectTo: 'pades'
	},
	{
		path: 'pades',
		loadChildren: () =>
			import('./features/pades/pades.routes').then((m) => m.PADES_ROUTES)
	}
];
