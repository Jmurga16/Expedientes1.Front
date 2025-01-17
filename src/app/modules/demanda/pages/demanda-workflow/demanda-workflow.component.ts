import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DemandaService } from '../../common/services/demanda.service';
import { FileService } from '../../../../shared/services/file.service';
import { UsuarioService } from '../../../user/common/services/usuario.service';

@Component({
  selector: 'app-demanda-workflow',
  templateUrl: './demanda-workflow.component.html',
  styleUrl: './demanda-workflow.component.scss'
})
export class DemandaWorkflowComponent {

  loading: boolean = false
  demandaForm: any
  idDemanda: any
  diagramUrl: string = ""

  constructor(
    private activatedRoute: ActivatedRoute,
    private demandaService: DemandaService,
    private fileService: FileService,
    private usuarioService: UsuarioService,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.idDemanda = params['id'];
      console.log('Demanda ID:', this.idDemanda);
      if (this.idDemanda) {
        this.getDemanda();
      }
    });

  }

  getDemanda() {
    this.demandaService.getById(this.idDemanda).subscribe({
      next: (response: any) => {
        console.log(response)
        this.demandaForm = response
        this.diagramUrl = response.urlBpmn
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
      complete: () => {
        //this.getSubtipologia(this.demandaForm.controls["idTipologia"].value)
      }
    });
  }

}
