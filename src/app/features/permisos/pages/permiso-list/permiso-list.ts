import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHeader } from '@/app/shared/components/page-header/page-header';
import { EmptyState } from '@/app/shared/components/empty-state/empty-state';
import { PermisoService } from '../../services/permiso.service';

@Component({
  selector: 'app-permiso-list',
  imports: [RouterLink, PageHeader, EmptyState],
  templateUrl: './permiso-list.html',
})
export class PermisoList implements OnInit {
  ngOnInit(): void {
    this.funObtenerPermiso();
  }
  private readonly permisos=signal<any>([]);
  private readonly permisoService = inject(PermisoService);


  funObtenerPermiso(){
    this.permisoService.funListarPermiso().subscribe({
      next:(res:any)=>{
        //guardar en permisos
        this.permisos.set(res);
      },
      error:(error)=>{
        console.log(error);
      }
    })
  }
}
