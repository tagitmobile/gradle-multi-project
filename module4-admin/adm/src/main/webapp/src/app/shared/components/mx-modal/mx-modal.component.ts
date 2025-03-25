import { Component, ElementRef, Input, OnInit, Output, ViewEncapsulation, OnDestroy, HostBinding } from '@angular/core';
import { AppService } from '../../../core/modules/services/app.service';

@Component({
    selector: 'mx-ac-modal',
    templateUrl: './mx-modal.component.html',
    styleUrls: ['./mx-modal.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: false
})
export class MxModalComponent implements OnInit, OnDestroy {
  @Input() id: string;
  @Input() inputData: string;
  @HostBinding('class') someClass1;

  private element: any;

  constructor(private modalService: AppService, private el: ElementRef) {
    this.element = el.nativeElement;
  }


  ngOnInit(): void {
    // ensure id attribute exists
    if (!this.id) {
      return;
    }

    // move element to bottom of page (just before </body>) so it can be displayed above everything else
    document.body.appendChild(this.element);

    // close modal on background click
    this.element.addEventListener('click', el => {
      if (el.target.className === 'jw-modal') {
        this.close();
      }
    });

    // add self (this modal instance) to the modal service so it's accessible from controllers
    this.modalService.add(this);
  }
  touchThis(data) {
  }
  // remove self from modal service when component is destroyed
  ngOnDestroy(): void {
    this.modalService.remove(this.id);
    this.element.remove();
  }

  // open modal
  open(): void {
    this.element.style.display = 'block';
    document.body.classList.add('jw-modal-open');
  }

  // close modal
  close(): void {
    this.element.style.display = 'none';
    document.body.classList.remove('jw-modal-open');
  }

  dataChange(event) {
  }

}
