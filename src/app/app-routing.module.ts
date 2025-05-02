import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewestStoriesComponent } from './newest-stories/newest-stories/newest-stories.component';


const routes: Routes = [
  { path: '', component: NewestStoriesComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
