import { Component, ElementRef, HostListener, inject, OnInit, signal, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHeader } from '@/app/shared/components/page-header/page-header';
import { EmptyState } from '@/app/shared/components/empty-state/empty-state';
import { CategoriaService } from '../../services/categoria.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-categoria-list',
  imports: [RouterLink, PageHeader, EmptyState, ReactiveFormsModule],
  templateUrl: './categoria-list.html',
})
export class CategoriaList implements OnInit {
  ngOnInit(): void {
    this.funObtenerCategoria();
  }
  //aca va almacenar los usuarios
  protected readonly categorias = signal<any>([]);
  //inyectar servivio
  protected readonly categoriaService = inject(CategoriaService);
  //abrir modal con el nombre de
  protected readonly crearCategoria = signal(false);

  //------------- LISTADO CATEGORIA ---------------//
  funObtenerCategoria() {
    this.categoriaService.funListarCategoria().subscribe({
      next: (res: any) => {
        this.categorias.set(res);
      },
      error(err) {
        console.log(err);
      },
    })
  }

  //---------------- FORMULARIO ----------------//
  protected readonly categoriaForm = new FormGroup({
    nombre: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    descripcion: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    foto: new FormControl<File | null>(null, Validators.required),
  });
  //------------- GUARDAR CATEGORIA ---------------//
  funGuardarCategoria() {
    if (this.categoriaForm.invalid) {
      this.categoriaForm.markAllAsTouched();
      return;
    }
    const { nombre, descripcion, foto } = this.categoriaForm.getRawValue();
    //Form Data para las fotos
    const formData = new FormData();
    formData.append('nombre', nombre ?? '');
    formData.append('descripcion', descripcion ?? '');
    if (foto) formData.append('foto', foto);

    this.categoriaService.funGuarda(formData).subscribe({
      next: () => {
        this.funObtenerCategoria();
        this.cerrarModal();
      },
      error: (err) => console.error('Error al guardar la categoría', err),
    });
  }
  //Para almacenar una foto
  onFotoSeleccionada(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.categoriaForm.controls.foto.setValue(file);
    this.categoriaForm.controls.foto.markAsTouched();

  }
  //------------- MODAL ---------------//

  abrir(compra: any) {
    this.crearCategoria.set(compra);
  }
  @ViewChild('fotoInput') fotoInput?: ElementRef<HTMLInputElement>;
  cerrarModal() {
    this.crearCategoria.set(false);
    this.categoriaForm.reset({ nombre: '', descripcion: '', foto: null });
    if (this.fotoInput) this.fotoInput.nativeElement.value = '';
  }
  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.crearCategoria()) this.cerrarModal();
  }

}
