import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHeader } from '@/app/shared/components/page-header/page-header';
import { EmptyState } from '@/app/shared/components/empty-state/empty-state';
import { RolService } from '../../services/rol.service';

@Component({
  selector: 'app-rol-list',
  imports: [RouterLink, PageHeader, EmptyState],
  templateUrl: './rol-list.html',
})
export class RolList implements OnInit {
  ngOnInit(): void {
    this.funObtenerRol();
  }
  private readonly roles=signal<any>([]);
  private readonly rolService = inject(RolService);

  funObtenerRol(){
    this.rolService.funListarRoles().subscribe({
      next:(res:any)=>{
        this.roles.set(res);
      },
      error:(error)=>{
        console.log(error);
      }
    })
  }
}
