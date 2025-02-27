import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppMessagesTableComponent } from '../app/core/modules/messages/app-messages/app-messages-table/app-messages-table.component'
import { BpmnComponent } from './bpmn/bpmn.component';

const routes: Routes = [
  { path: '', component: AppMessagesTableComponent, runGuardsAndResolvers: 'always' },
  { path: 'home/widget/custom-admin/app-messages-list', component: AppMessagesTableComponent, runGuardsAndResolvers: 'always' },
  { path: 'home/widget/bpmn/viewer', component: BpmnComponent, runGuardsAndResolvers: 'always' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes,
    {
      onSameUrlNavigation: 'reload',
      useHash: true,
      errorHandler: (error) => {
        console.error('Navigation error: ', error);
       // MXHINT-TODO - feature Handle the error, show a user-friendly message, or log the error as needed
      }
    })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
