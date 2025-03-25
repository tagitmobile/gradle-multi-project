import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import {
    ChangeDetectorRef,
    ComponentRef,
    Directive,
    ElementRef,
    EventEmitter,
    forwardRef,
    HostBinding,
    HostListener,
    Input,
    KeyValueDiffers,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import _moment from 'moment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DaterangepickerComponent } from './daterangepicker.component';
import { LocaleConfig } from './daterangepicker.config';
import { LocaleService } from './locale.service';

const moment = _moment;

@Directive({
    selector: 'input[mxAcDaterangepickerMd]',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DaterangepickerDirective),
            multi: true,
        },
    ],
    standalone: false
})
export class DaterangepickerDirective implements OnInit, OnChanges, OnDestroy {
    @HostBinding('autocomplete') off;
    @HostListener('keyup.esc') hide() {
        if (this.overlayRef) {
            this.overlayRef.dispose();
            this.overlayRef = null;
            this.componentRef = null;
        }
    }
    @HostListener('blur') onBlur() {
        this._onTouched();
    }
    @HostListener('click') open() {
        if (this.overlayRef) {
            this.hide();
        }

        let originX, overlayX;
        switch (this.opens) {
            case 'left':
                originX = 'end';
                overlayX = 'end';
                break;
            case 'center':
                originX = 'center';
                overlayX = 'center';
                break;
            case 'right':
                originX = 'start';
                overlayX = 'start';
                break;
        }

        this.overlayRef = this.overlay.create({
            backdropClass: 'cdk-overlay-transparent-backdrop',
            hasBackdrop: true,
            scrollStrategy: this.overlay.scrollStrategies.reposition(),
            positionStrategy: this.overlay
                .position()
                .flexibleConnectedTo(this.elementRef.nativeElement)
                .withPositions([
                    {
                        offsetY: this.drops === 'up' ? 0 : 13,
                        originX,
                        originY: this.drops === 'up' ? 'top' : 'bottom',
                        overlayX,
                        overlayY: this.drops === 'up' ? 'bottom' : 'top',
                    },
                ]),
        });
        const dateRangePickerPortal = new ComponentPortal(DaterangepickerComponent);
        this.componentRef = this.overlayRef.attach(dateRangePickerPortal);

        // Assign all inputs
        this.componentRef.instance.minDate = this.minDate;
        this.componentRef.instance.maxDate = this.maxDate;
        this.componentRef.instance.autoApply = this.autoApply;
        this.componentRef.instance.alwaysShowCalendars = this.alwaysShowCalendars;
        this.componentRef.instance.showCustomRangeLabel = this.showCustomRangeLabel;
        this.componentRef.instance.linkedCalendars = this.linkedCalendars;
        this.componentRef.instance.dateLimit = this.dateLimit;
        this.componentRef.instance.singleDatePicker = this.singleDatePicker;
        this.componentRef.instance.showWeekNumbers = this.showWeekNumbers;
        this.componentRef.instance.showISOWeekNumbers = this.showISOWeekNumbers;
        this.componentRef.instance.showDropdowns = this.showDropdowns;
        this.componentRef.instance.showClearButton = this.showClearButton;
        this.componentRef.instance.customRangeDirection = this.customRangeDirection;
        this.componentRef.instance.ranges = this.ranges;
        this.componentRef.instance.firstMonthDayClass = this.firstMonthDayClass;
        this.componentRef.instance.lastMonthDayClass = this.lastMonthDayClass;
        this.componentRef.instance.emptyWeekRowClass = this.emptyWeekRowClass;
        this.componentRef.instance.firstDayOfNextMonthClass = this.firstDayOfNextMonthClass;
        this.componentRef.instance.lastDayOfPreviousMonthClass = this.lastDayOfPreviousMonthClass;
        this.componentRef.instance.keepCalendarOpeningWithRange = this.keepCalendarOpeningWithRange;
        this.componentRef.instance.showRangeLabelOnInput = this.showRangeLabelOnInput;
        this.componentRef.instance.showCancel = this.showCancel;
        this.componentRef.instance.lockStartDate = this.lockStartDate;
        this.componentRef.instance.timePicker = this.timePicker;
        this.componentRef.instance.timePicker24Hour = this.timePicker24Hour;
        this.componentRef.instance.timePickerIncrement = this.timePickerIncrement;
        this.componentRef.instance.timePickerSeconds = this.timePickerSeconds;
        this.componentRef.instance.closeOnAutoApply = this.closeOnAutoApply;
        this.componentRef.instance.locale = this.locale;

        this.componentRef.instance.isInvalidDate = this.isInvalidDate;
        this.componentRef.instance.isCustomDate = this.isCustomDate;
        this.componentRef.instance.isTooltipDate = this.isTooltipDate;
        this.componentRef.instance.isZonePickerDisabled = this.isZonePickerDisabled;
        this.componentRef.instance.zonePicker = this.zonePicker;
        this.componentRef.instance.defaultZone = this.defaultZone;
        this.componentRef.instance.monthYearPicker = this.monthYearPicker;

        // Set the value
        this.setValue(this.value);

        const localeDiffer = this.differs.find(this.locale).create();
        if (localeDiffer) {
            const changes = localeDiffer.diff(this.locale);
            if (changes) {
                this.componentRef.instance.updateLocale(this.locale);
            }
        }

        // Subscribe to all outputs
        this.componentRef.instance.startDateChanged
            .asObservable()
            .pipe(takeUntil(this.destroy$))
            .subscribe((itemChanged: { startDate: _moment.Moment }) => {
                this.startDateChanged.emit(itemChanged);
            });

        this.componentRef.instance.endDateChanged
            .asObservable()
            .pipe(takeUntil(this.destroy$))
            .subscribe((itemChanged) => {
                this.endDateChanged.emit(itemChanged);
            });

        this.componentRef.instance.rangeClicked
            .asObservable()
            .pipe(takeUntil(this.destroy$))
            .subscribe((range) => {
                this.rangeClicked.emit(range);
            });

        this.componentRef.instance.datesUpdated
            .asObservable()
            .pipe(takeUntil(this.destroy$))
            .subscribe((range) => {
                this.datesUpdated.emit(range);
            });

        this.componentRef.instance.chosenDate
            .asObservable()
            .pipe(takeUntil(this.destroy$))
            .subscribe((chosenDate) => {
                if (chosenDate) {
                    const { endDate, startDate } = chosenDate;
                    this.value = { [this._startKey]: startDate, [this._endKey]: endDate };
                    this.changed.emit(this.value);
                    if (typeof chosenDate.chosenLabel === 'string') {
                        this.elementRef.nativeElement.value = chosenDate.chosenLabel;
                    }

                    this.hide();
                }
            });

        this.componentRef.instance.closeDateRangePicker
            .asObservable()
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.hide();
            });

        // Close the DateRangePicker when the backdrop is clicked
        this.overlayRef
            .backdropClick()
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.hide();
            });
    }
    @HostListener('keyup') inputChanged(e) {
        if (e.target.tagName.toLowerCase() !== 'input') {
            return;
        }

        if (!e.target.value.length) {
            return;
        }

        if (this.componentRef) {
            const dateString = e.target.value.split(this.componentRef.instance.locale.separator);
            let start = null,
                end = null;
            if (dateString.length === 2) {
                start = moment(dateString[0], this.componentRef.instance.locale.format);
                end = moment(dateString[1], this.componentRef.instance.locale.format);
            }
            if (this.singleDatePicker || start === null || end === null) {
                start = moment(e.target.value, this.componentRef.instance.locale.format);
                end = start;
            }
            if (!start.isValid() || !end.isValid()) {
                return;
            }
            this.componentRef.instance.setStartDate(start);
            this.componentRef.instance.setEndDate(end);
            this.componentRef.instance.updateView();
        }
    }
    private _onChange = Function.prototype;
    private _onTouched = Function.prototype;
    private _validatorChange = Function.prototype;
    private _value: any;
    private overlayRef: OverlayRef;
    private componentRef: ComponentRef<DaterangepickerComponent>;

    @Input()
    minDate: _moment.Moment;
    @Input()
    maxDate: _moment.Moment;
    @Input()
    autoApply: boolean;
    @Input()
    alwaysShowCalendars: boolean;
    @Input()
    showCustomRangeLabel: boolean;
    @Input()
    linkedCalendars: boolean;
    @Input()
    dateLimit: number = null;
    @Input()
    singleDatePicker: boolean;
    @Input()
    showWeekNumbers: boolean;
    @Input()
    showISOWeekNumbers: boolean;
    @Input()
    showDropdowns: boolean;
    @Input()
    showClearButton: boolean;
    @Input()
    customRangeDirection: boolean;
    @Input()
    ranges = {};
    @Input()
    opens: 'left' | 'center' | 'right' = 'center';
    @Input()
    drops: 'up' | 'down' = 'down';
    firstMonthDayClass: string;
    @Input()
    lastMonthDayClass: string;
    @Input()
    emptyWeekRowClass: string;
    @Input()
    firstDayOfNextMonthClass: string;
    @Input()
    lastDayOfPreviousMonthClass: string;
    @Input()
    keepCalendarOpeningWithRange: boolean;
    @Input()
    showRangeLabelOnInput: boolean;
    @Input()
    showCancel = false;
    @Input()
    lockStartDate = false;
    @Input()
    timePicker = false;
    @Input()
    timePicker24Hour = false;
    @Input()
    timePickerIncrement = 1;
    @Input()
    timePickerSeconds = false;
    @Input() closeOnAutoApply = true;
    @Input() isZonePickerDisabled = false;
    @Input() zonePicker = false;
    @Input() monthYearPicker = false;
    @Input() defaultZone = '';
    _locale: LocaleConfig = {};
    @Input() set locale(value) {
        this._locale = { ...this._localeService.config, ...value };
    }
    get locale(): any {
        return this._locale;
    }
    @Input()
    private _endKey = 'endDate';
    private _startKey = 'startDate';
    notForChangesProperty: Array<string> = ['locale', 'endKey', 'startKey'];

    @Output() changed: EventEmitter<{ startDate: _moment.Moment; endDate: _moment.Moment }> = new EventEmitter();
    @Output() rangeClicked: EventEmitter<{ label: string; dates: [_moment.Moment, _moment.Moment] }> = new EventEmitter();
    @Output() datesUpdated: EventEmitter<{ startDate: _moment.Moment; endDate: _moment.Moment }> = new EventEmitter();
    @Output() startDateChanged: EventEmitter<{ startDate: _moment.Moment }> = new EventEmitter();
    @Output() endDateChanged: EventEmitter<{ endDate: _moment.Moment }> = new EventEmitter();

    destroy$ = new Subject<void>();


    @Input()
    isInvalidDate = (date: _moment.Moment) => false
    @Input()
    isCustomDate = (date: _moment.Moment) => false
    @Input()
    isTooltipDate = (date: _moment.Moment) => null
    @Input() set startKey(value) {
        if (value !== null) {
            this._startKey = value;
        } else {
            this._startKey = 'startDate';
        }
    }
    @Input() set endKey(value) {
        if (value !== null) {
            this._endKey = value;
        } else {
            this._endKey = 'endDate';
        }
    }

    get value() {
        return this._value || null;
    }
    set value(val) {
        this._value = val;
        this._onChange(val);
        this._changeDetectorRef.markForCheck();
    }

    constructor(
        public _changeDetectorRef: ChangeDetectorRef,
        private differs: KeyValueDiffers,
        private _localeService: LocaleService,
        private elementRef: ElementRef,
        private overlay: Overlay
    ) { }

    ngOnInit(): void {
        this._buildLocale();
    }

    ngOnChanges(changes: SimpleChanges): void {
        for (const change in changes) {
            if (changes.hasOwnProperty(change)) {
                if (this.componentRef && this.notForChangesProperty.indexOf(change) === -1) {
                    this.componentRef[change] = changes[change].currentValue;
                }
            }
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
    }


    toggle(): void {
        if (this.overlayRef) {
            this.hide();
        } else {
            this.open();
        }
    }

    clear(): void {
        if (this.componentRef) {
            this.componentRef.instance.clear();
        }
    }

    writeValue(value: any): void {
        if (_moment.isMoment(value)) {
            this.value = { [this._startKey]: value };
        } else if (value) {
            this.value = { [this._startKey]: moment(value[this._startKey]), [this._endKey]: moment(value[this._endKey]) };
        } else {
            this.value = null;
        }
        this.setValue(this.value);
    }

    registerOnChange(fn): void {
        this._onChange = fn;
    }

    registerOnTouched(fn): void {
        this._onTouched = fn;
    }

    private setValue(value: any): void {
        if (this.componentRef) {
            if (value) {
                if (value[this._startKey]) {
                    this.componentRef.instance.setStartDate(value[this._startKey]);
                }
                if (value[this._endKey]) {
                    this.componentRef.instance.setEndDate(value[this._endKey]);
                }
                this.componentRef.instance.calculateChosenLabel();
                if (this.componentRef.instance.chosenLabel) {
                    this.elementRef.nativeElement.value = this.componentRef.instance.chosenLabel;
                }
            } else {
                this.componentRef.instance.clear();
            }
        }

        this.elementRef.nativeElement.value = value ? this.calculateChosenLabel(value[this._startKey], value[this._endKey]) : null;
    }

    calculateChosenLabel(startDate: _moment.Moment, endDate: _moment.Moment): string {
        const format = this.locale.displayFormat ? this.locale.displayFormat : this.locale.format;

        if (this.singleDatePicker) {
            return startDate.format(format);
        }

        if (startDate && endDate) {
            return startDate.format(format) + this.locale.separator + endDate.format(format);
        }

        return null;
    }

    /**
     *  build the locale config
     */
    private _buildLocale() {
        this.locale = { ...this._localeService.config, ...this.locale };
        if (!this.locale.format) {
            if (this.timePicker) {
                this.locale.format = _moment.localeData().longDateFormat('lll');
            } else {
                this.locale.format = _moment.localeData().longDateFormat('L');
            }
        }
    }
}
