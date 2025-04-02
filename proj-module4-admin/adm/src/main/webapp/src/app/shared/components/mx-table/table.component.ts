import {
  Component, OnInit, Input, Output, EventEmitter, ViewChild, AfterViewInit, ChangeDetectorRef, DoCheck,
  OnDestroy,
  ContentChild,
  forwardRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table'
import { CustomDatePipe } from '../../pipes/custom-date.pipe';
import { SelectionModel } from '@angular/cdk/collections';
import { Subject, Subscription } from 'rxjs';
import { TableEmptyMessageComponent } from './table-empty-message.component';
import { UtilityService } from '../../../core/modules/common/utility.service';
import { animate, state, style, transition, trigger } from '@angular/animations';



@Component({
    selector: 'mx-ac-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss'],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({ height: '0px', minHeight: '0' })),
            state('expanded', style({ height: '*' })),
        ]),
    ],
    standalone: false
})
export class TableComponent implements OnInit, AfterViewInit, DoCheck, OnDestroy {
  tableData = [];
  paginatorData =[];
  showExtraTable = true;
  isClientSearch: boolean;
  filterTableData: any;
  dataSource = new MatTableDataSource(this.tableData);
  selection = new SelectionModel(true, []);
  selectedData: any = [];
  // tslint:disable-next-line:variable-name
  private _paginator: MatPaginator;
  // tslint:disable-next-line:variable-name
  private _sort: MatSort;

  @ContentChild(forwardRef(() => TableEmptyMessageComponent), { static: false }) emptyMessageContent: TableEmptyMessageComponent;

  /**
   * getting table data
   */
  @Input() set data(tableData) {
    if (tableData && tableData[0].data.length) {
      this.isClientSearch = false;
      this.tableData = tableData[0].data;
      this.loadTable();
    } else {
      this.tableData = tableData[0].data;
      this.loadTable();
    }
    // this.cdr.detectChanges();
    /** To clear the Checkbox when the Table data loads */
    this.onCheckboxClear();
    this.cdr.detectChanges();
  }

  /**
   * Filtering the datasource based on the filter string
   */
  @Input() set filterData(data) {
    /** To Handle the client side search empty data message  */
    if (data !== '') {
      this.isClientSearch = true;
    }
    this.dataSource.filter = data ? data.trim().toLowerCase() : '';
    this.filterTableData = this.dataSource.filteredData;
    this.cdr.detectChanges();
  }

  /**
   * getting header data
   */
  @Input() headers: any;

  /**
   * getting table data menu actions
   */
  @Input() actionList: any;
  @Output() action = new EventEmitter();

  /**
   * pagination
   */
  @Input() set pageConfig (data){    
    this.paginatorData= data;
    this.cdr.detectChanges();
  }

  @Output() pageChange = new EventEmitter();

  /**
   * sorting
   */
  @Output() sortChange = new EventEmitter();

  /**
   * link navigation
   */
  @Output() linkNavigation = new EventEmitter();


  /**
   * link navigation
   */
  @Output() objLinkNavigation = new EventEmitter();

  /** Selected checkbox */
  @Output() checkedData = new EventEmitter();

  /** Selected all checkbox */
  @Output() allCheckedData: any = new EventEmitter();

  // server side filtering event emiting
  @Output() filterChange = new EventEmitter();

  /** Selected radio button */
  @Output() selectedRadioData = new EventEmitter();

  // Handling pagination and sorting as client/ server side
  @Input() clientSide: boolean;
  @Input() totalRecords: number;
  @Input() noDataFound: any = 'TABLE_NO_RECORD_FOUND';
  @Input() filterChanged$: Subject<any>;
  filterChangedSubscription: Subscription;

  @ViewChild(MatSort, { static: false }) set sort(sortElm: MatSort) {
    // if (this.clientSide && this.dataSource) {
    if (this.dataSource) {
      this.dataSource.sort = sortElm;
    }
    this._sort = sortElm;
    this.cdr.detectChanges();
  }

  // tslint:disable-next-line:variable-name
  @ViewChild(MatPaginator, { static: false }) set paginator(paginatorElem: MatPaginator) {

    if (this.clientSide && this.dataSource) {
      // if (this.dataSource) {
      this.dataSource.paginator = paginatorElem;
    }
    this._paginator = paginatorElem;
    setTimeout(() => {
      console.log('Table Timeout');
      this.cdr.detectChanges();      
    }, 2000);
  }

  displayedColumns: any[];
  imageurl: any;
  constructor(private cdr: ChangeDetectorRef,
    private customDatePipe: CustomDatePipe, private utilityService: UtilityService) {
    this.imageurl = this.utilityService.microAppBaseURL;
  }

  ngAfterViewInit() {
    // reset the paginator after sorting
    this._sort.sortChange.subscribe(() => {
      this._paginator.pageIndex = 0
      this.cdr.detectChanges();
    }
    );
    this.cdr.detectChanges();
  }

  ngOnInit() {
    this.imageurl = this.utilityService.microAppBaseURL;
    this.filterChangedSubscription = this.filterChanged$.asObservable().subscribe(() => {
      this.cdr.detectChanges();
      if (this._paginator) {
        this._paginator.pageIndex = 0;
      }
    });

    this.displayedColumns = this.headers.map(col => col.prop);
    /**
     * applying filter to specfic columns(displyed columns in table)
     */
    this.dataSource.filterPredicate = (rowData: any, filter: string): any => {
      let matchFound = false;
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.displayedColumns.length; i++) {
        const headerKey = this.displayedColumns[i];
        const header = this.headers.find(hr => hr.prop === headerKey);
        const colData = rowData[header.prop];

        if (colData) {
          if (header.type === 'date') {
            const dateFormat = header.dateConfig ? header.dateConfig.format || undefined : undefined;
            const timeZone = header.dateConfig ? header.dateConfig.timeZone || undefined : undefined;
            const formattedValue = this.customDatePipe.transform(colData, dateFormat, timeZone) || '';
            matchFound = formattedValue.toLowerCase().includes(filter);
          } else {
            matchFound = colData.toLowerCase().includes(filter);
          }
          if (matchFound) {
            break;
          }
        }
      }
      this.cdr.detectChanges();
      return matchFound;
    };
  }

  /**
   * loading tabular data
   */
  loadTable() {
    this.dataSource = new MatTableDataSource(this.tableData);
    this.cdr.detectChanges();

  }

  /**
   * emitting the menu action data
   * @param actionVal action name & icon
   * @param data row data
   */
  onActionClick(actionVal, data, i) {
    data.index = i;
    this.action.emit({ action: actionVal, rowData: data });
  }

  /**
   * emitting the data while page changing
   * @param data page info
   */
  onPageChange(data) {
    this.pageChange.emit(data);
    this.cdr.detectChanges();
  }

  paginatorClick() {    
    setTimeout(() => {
      this.cdr.detectChanges();
    }, 200);
  }


  /**
   * emitting the data while sorting the columns
   * @param sortCol column data
   */
  onSortChange(sortCol: Sort) {
    console.log(sortCol);
    let sortData = null;
    sortData = sortCol;
    if (!this.clientSide) {
      sortData = { ...sortCol, pageIndex: this._paginator.pageIndex };
      this.sortChange.emit(sortData);
    }
    this.cdr.detectChanges();
  }
  /**
   * emitting the data on navigation click
   * @param data row data
   */
  onLinkClick(data, i, link?) {
    data.index = i;
    if (link) {
      this.linkNavigation.emit({ data, selectedLink: link });
    } else {
      this.linkNavigation.emit(data);
    }
    this.cdr.detectChanges();
  }

  /**
    * emitting the data on navigation click
    * @param data row data
    */
  onObjLinkClick(data, i, link?) {
    data.index = i;
    if (link) {
      this.objLinkNavigation.emit({ data, selectedLink: link });
    } else {
      this.objLinkNavigation.emit(data);
    }
    this.cdr.detectChanges();
  }
  /** To close the expanded row when another row is opened */
  checkforExpanded(row) {
    // this.showExtraTable = !this.showExtraTable;
    row.isExpanded = !row.isExpanded;
    this.tableData.forEach(d => {
      if (row.isExpanded && d.locKey != row.locKey) d.isExpanded = false;
      this.showExtraTable = false;
    })
    this.cdr.detectChanges();
  }

  ngDoCheck() {
    this.cdr.detectChanges();
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection and emit the all selected data */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.dataSource.data.forEach(row => {
        this.selection.select(row);
      });
    }
    this.allCheckedData.emit(this.selection.selected);
    this.cdr.detectChanges();
  }

  /** Emit the selected checkbox data */
  onCheckedChange(row, i) {
    row.index = i;
    this.selection.toggle(row);
    this.checkedData.emit(this.selection.selected);
    this.cdr.detectChanges();
    // this.checkedData.emit({data: this.selection.selected, index: i});
  }

  /** Emit the selected radiobutton data */
  onChangeRadio(row) {
    this.selectedRadioData.emit(row);
    this.cdr.detectChanges();
  }

  /** To clear the Checkbox when the Table data loads */
  onCheckboxClear() {
    if (this.selection) {
      this.selection.clear();
    }
    this.cdr.detectChanges();
  }

  ngOnDestroy() {
    if (this.filterChangedSubscription) {
      this.filterChangedSubscription.unsubscribe();
    }
  }
}
